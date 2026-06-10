import { defineConfig } from 'wxt';

// Конфиг расширения. Часть полей manifest задаётся здесь (заменяет manifest.json).
// imports: false — отключаем авто-импорты WXT, используем явные импорты из '#imports'.
export default defineConfig({
  imports: false,
  manifest: {
    name: 'ClaudeVoiceMaster',
    description: 'Перевод и озвучка субтитров YouTube в реальном времени.',
    permissions: ['storage'],
    icons: {
      16: '/icons/16.png',
      32: '/icons/32.png',
      48: '/icons/48.png',
      128: '/icons/128.png',
    },
  },
});
