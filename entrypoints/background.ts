import { defineBackground, browser } from '#imports';
import { INSPECTOR_PORT_NAME } from '@/lib/constants';
import type { CvmRuntimeState } from '@/lib/types';
import type { InspectorMessage, BackgroundMessage } from '@/lib/messaging';

// Тип порта выводим из слушателя, чтобы не зависеть от имён неймспейсов WXT.
type RuntimePort = Parameters<Parameters<typeof browser.runtime.onConnect.addListener>[0]>[0];

export default defineBackground(() => {
  // Рантайм-состояние (не сохраняется). Точки обновления появятся в Стадии 2.
  const runtimeState: CvmRuntimeState = {
    currentVideoId: null,
    translationStatus: 'ready',
    translationActive: false,
  };

  // Подключённые страницы Inspector — реестр для рассылки обновлений.
  const inspectorPorts = new Set<RuntimePort>();

  function broadcastRuntimeState(): void {
    const snapshot: InspectorMessage = { type: 'runtime-state', state: runtimeState };
    for (const port of inspectorPorts) {
      port.postMessage(snapshot);
    }
  }

  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== INSPECTOR_PORT_NAME) {
      return;
    }
    inspectorPorts.add(port);

    const snapshot: InspectorMessage = { type: 'runtime-state', state: runtimeState };
    port.postMessage(snapshot);

    port.onDisconnect.addListener(() => {
      inspectorPorts.delete(port);
    });
  });

  browser.runtime.onMessage.addListener((message: unknown) => {
    const backgroundMessage = message as BackgroundMessage;
    if (backgroundMessage.type === 'set-translation-active') {
      runtimeState.translationActive = backgroundMessage.active;
      broadcastRuntimeState();
    }
  });

  console.info('[CVM] background ready');
});
