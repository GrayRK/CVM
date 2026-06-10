// Общие именованные константы проекта. Никаких магических чисел/строк в коде.

import type { LanguageOption, TranslationStatus } from '@/lib/types';

// --- Совпадения URL для контент-скриптов ---
export const YOUTUBE_MATCHES: string[] = ['https://www.youtube.com/*'];

// --- Ключи chrome.storage.local (префикс cvm_) ---
export const STORAGE_KEYS = {
  apiKey: 'local:cvm_api_key',
  targetLanguage: 'local:cvm_target_language',
  selectedVoice: 'local:cvm_selected_voice',
  ttsEnabled: 'local:cvm_tts_enabled',
  subtitlesEnabled: 'local:cvm_subtitles_enabled',
  useYoutubeTranslation: 'local:cvm_use_youtube_translation',
  autoStart: 'local:cvm_auto_start',
  translationVolume: 'local:cvm_translation_volume',
  videoDucking: 'local:cvm_video_ducking',
} as const;

// --- Значения по умолчанию ---
export const DEFAULT_TARGET_LANGUAGE = 'ru';
export const DEFAULT_SELECTED_VOICE = '';
export const DEFAULT_TTS_ENABLED = true;
export const DEFAULT_SUBTITLES_ENABLED = true;
export const DEFAULT_USE_YOUTUBE_TRANSLATION = false;
export const DEFAULT_AUTO_START = false;
export const DEFAULT_TRANSLATION_VOLUME = 0.9; // громкость TTS, 0..1
export const DEFAULT_VIDEO_DUCKING = 0.4; // приглушение оригинала, 0..MAX_VIDEO_DUCKING

// --- Границы значений ---
export const MIN_VOLUME = 0;
export const MAX_VOLUME = 1;
export const MAX_VIDEO_DUCKING = 0.8; // субтитры: приглушение не более 80%

// --- Связь Inspector <-> остальные контексты ---
export const INSPECTOR_PORT_NAME = 'cvm-inspector';
export const HIGHLIGHT_DURATION_MS = 1000; // подсветка изменённого значения
export const INSPECTOR_RECONNECT_DELAY_MS = 1000; // переподключение порта при перезапуске SW

// --- Имя страницы Live State Inspector (entrypoint inspector/) ---
export const INSPECTOR_PAGE = 'inspector.html';

// --- Языки перевода (короткий список, легко расширяется) ---
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
];

// --- Подписи статуса перевода для индикатора ---
export const STATUS_LABELS: Record<TranslationStatus, string> = {
  ready: 'Готов',
  translating: 'Переводим…',
  error: 'Ошибка',
};

// --- UI popup ---
export const PERCENT_SCALE = 100; // хранение 0..1 <-> отображение 0..100%
export const API_KEY_SAVE_DEBOUNCE_MS = 400;

// --- Виджет на странице видео (content.ts) ---
export const WIDGET_HOST_ID = 'cvm-widget-host';
export const PLAYER_SELECTOR = '.html5-video-player'; // элемент, уходящий в фуллскрин
export const WIDGET_MOUNT_POLL_MS = 1000; // проверка наличия плеера/виджета
export const WIDGET_LABEL_START = 'Перевести и озвучить';
export const WIDGET_LABEL_STOP = 'Выключить перевод';
