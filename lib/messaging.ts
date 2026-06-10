import type { CvmRuntimeState } from '@/lib/types';

// Сообщения от background к странице Inspector по long-lived порту.
export interface RuntimeStateMessage {
  type: 'runtime-state';
  state: CvmRuntimeState;
}

export type InspectorMessage = RuntimeStateMessage;

// Сообщения от content-скрипта к background.
export interface SetTranslationActiveMessage {
  type: 'set-translation-active';
  active: boolean;
}

export type BackgroundMessage = SetTranslationActiveMessage;
