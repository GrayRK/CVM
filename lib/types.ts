// Общие типы проекта.

// Пользовательские настройки (хранятся в chrome.storage.local).
export interface CvmSettings {
  apiKey: string;
  targetLanguage: string;
  selectedVoice: string;
  ttsEnabled: boolean;
  subtitlesEnabled: boolean;
  useYoutubeTranslation: boolean; // брать готовый перевод YouTube вместо API
  autoStart: boolean; // запускать перевод при открытии страницы
  translationVolume: number; // 0..1
  videoDucking: number; // 0..MAX_VIDEO_DUCKING
}

// Статус перевода для индикатора и Inspector.
export type TranslationStatus = 'ready' | 'translating' | 'error';

// Рантайм-состояние (не сохраняется, живёт во время сессии).
export interface CvmRuntimeState {
  currentVideoId: string | null;
  translationStatus: TranslationStatus;
  translationActive: boolean; // состояние кнопки виджета (вкл/выкл перевод)
}

// Полный снимок состояния для Live State Inspector.
export interface CvmStateSnapshot extends CvmSettings, CvmRuntimeState {}

// Вариант языка перевода для дропдауна popup.
export interface LanguageOption {
  code: string;
  label: string;
}
