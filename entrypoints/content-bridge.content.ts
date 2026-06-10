import { defineContentScript } from '#imports';
import { YOUTUBE_MATCHES } from '@/lib/constants';

// MAIN world: перехват субтитров YouTube (нужен доступ к контексту страницы).
export default defineContentScript({
  matches: YOUTUBE_MATCHES,
  world: 'MAIN',
  runAt: 'document_start',
  main() {
    // Стадия 2: перехват сетевых запросов субтитров YouTube.
    // Сейчас — заглушка каркаса.
    console.debug('[CVM] content bridge (MAIN) loaded');
  },
});
