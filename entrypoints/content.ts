import { defineContentScript, browser } from '#imports';
import type { BackgroundMessage } from '@/lib/messaging';
import {
  YOUTUBE_MATCHES,
  WIDGET_HOST_ID,
  PLAYER_SELECTOR,
  WIDGET_MOUNT_POLL_MS,
  WIDGET_LABEL_START,
  WIDGET_LABEL_STOP,
} from '@/lib/constants';

// SPA-событие YouTube об окончании внутренней навигации.
const YT_NAVIGATE_EVENT = 'yt-navigate-finish';

const WIDGET_STYLES = `
  .cvm-toggle {
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    background: rgba(124, 58, 237, 0.92);
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .cvm-toggle:hover {
    background: rgba(124, 58, 237, 1);
  }
  .cvm-toggle[data-active='true'] {
    background: rgba(220, 38, 38, 0.92);
  }
  .cvm-toggle[data-active='true']:hover {
    background: rgba(220, 38, 38, 1);
  }
`;

// ISOLATED world: плавающий виджет управления поверх плеера.
export default defineContentScript({
  matches: YOUTUBE_MATCHES,
  runAt: 'document_idle',
  main(ctx) {
    let active = false;
    let button: HTMLButtonElement | null = null;

    function reportActive(): void {
      const message: BackgroundMessage = { type: 'set-translation-active', active };
      void browser.runtime.sendMessage(message).catch(() => {
        // background мог быть усыплён — состояние синхронизируется при следующем сообщении.
      });
    }

    function render(): void {
      if (button === null) {
        return;
      }
      button.textContent = active ? WIDGET_LABEL_STOP : WIDGET_LABEL_START;
      button.dataset.active = String(active);
    }

    function resetActive(): void {
      // Новое видео / SPA-навигация — состояние перевода начинается заново.
      if (!active) {
        return;
      }
      active = false;
      render();
      reportActive();
    }

    function toggle(): void {
      // Стадия 1: только переключение состояния и индикация.
      // Запуск пайплайна перевода/озвучки — Стадия 2.
      active = !active;
      render();
      reportActive();
      console.info(`[CVM] перевод ${active ? 'включён' : 'выключен'} (пайплайн — Стадия 2)`);
    }

    function createWidget(): HTMLElement {
      const host = document.createElement('div');
      host.id = WIDGET_HOST_ID;
      host.style.cssText = 'position:absolute;top:12px;right:12px;z-index:1000;';

      const shadow = host.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = WIDGET_STYLES;

      const btn = document.createElement('button');
      btn.className = 'cvm-toggle';
      btn.addEventListener('click', toggle);

      shadow.append(style, btn);
      button = btn;
      render();
      return host;
    }

    function removeWidget(): void {
      document.getElementById(WIDGET_HOST_ID)?.remove();
      button = null;
    }

    function isWatchPage(): boolean {
      return location.pathname === '/watch';
    }

    function mount(): void {
      if (!isWatchPage()) {
        removeWidget();
        return;
      }
      const player = document.querySelector(PLAYER_SELECTOR);
      if (player === null) {
        return; // плеер ещё не готов — попробуем на следующем тике
      }
      if (player.querySelector(`#${WIDGET_HOST_ID}`) !== null) {
        return; // уже смонтирован
      }
      player.append(createWidget());
    }

    mount();
    reportActive(); // синхронизируем начальное состояние с background
    ctx.setInterval(mount, WIDGET_MOUNT_POLL_MS);
    ctx.addEventListener(document, YT_NAVIGATE_EVENT, () => {
      resetActive();
      mount();
    });

    console.info('[CVM] content (isolated) loaded');
  },
});
