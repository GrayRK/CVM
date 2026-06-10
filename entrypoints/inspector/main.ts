import { browser } from '#imports';
import { settings } from '@/lib/storage';
import {
  INSPECTOR_PORT_NAME,
  INSPECTOR_RECONNECT_DELAY_MS,
  HIGHLIGHT_DURATION_MS,
} from '@/lib/constants';
import type { CvmRuntimeState } from '@/lib/types';
import type { InspectorMessage } from '@/lib/messaging';

// --- Источники строк ---
const SOURCE_STORAGE = 'chrome.storage';
const SOURCE_RUNTIME = 'runtime state';

// --- Отображаемое значение ---
interface DisplayValue {
  text: string;
  typeName: string;
}

function asString(value: string): DisplayValue {
  return { text: `"${value}"`, typeName: 'String' };
}
function asBoolean(value: boolean): DisplayValue {
  return { text: String(value), typeName: 'Boolean' };
}
function asNumber(value: number): DisplayValue {
  return { text: String(value), typeName: 'Number' };
}
function asMasked(value: string): DisplayValue {
  return { text: value.length > 0 ? '•••••• (задан)' : '(пусто)', typeName: 'String' };
}
function asNullableId(value: string | null): DisplayValue {
  return { text: value === null ? 'null' : `"${value}"`, typeName: 'String' };
}

// --- Доступ к storage-элементу в обобщённом виде ---
interface WatchableValue<T> {
  getValue: () => Promise<T>;
  watch: (callback: (value: T) => void) => unknown;
}

// --- Реестр строк таблицы ---
interface Row {
  valueCell: HTMLElement;
  typeCell: HTMLElement;
  container: HTMLElement;
  previousText: string | null;
  highlightTimer: ReturnType<typeof setTimeout> | undefined;
}

const rows = new Map<string, Row>();
const rowsBody = document.getElementById('rows');
const connEl = document.getElementById('conn');
const connLabelEl = document.getElementById('conn-label');
if (rowsBody === null || connEl === null || connLabelEl === null) {
  throw new Error('[CVM] inspector: разметка таблицы не найдена');
}

function createRow(id: string, label: string, source: string): void {
  const tr = document.createElement('tr');

  const dotCell = document.createElement('td');
  dotCell.className = 'col-dot';
  const dot = document.createElement('span');
  dot.className = 'row-dot';
  dotCell.append(dot);

  const nameCell = document.createElement('td');
  nameCell.className = 'cell-name';
  nameCell.textContent = label;

  const valueCell = document.createElement('td');
  valueCell.className = 'cell-value';
  valueCell.textContent = '…';

  const typeCell = document.createElement('td');
  typeCell.className = 'cell-type';

  const sourceCell = document.createElement('td');
  sourceCell.className = 'cell-source';
  sourceCell.textContent = source;

  tr.append(dotCell, nameCell, valueCell, typeCell, sourceCell);
  rowsBody!.append(tr);

  rows.set(id, {
    valueCell,
    typeCell,
    container: tr,
    previousText: null,
    highlightTimer: undefined,
  });
}

function updateRow(id: string, display: DisplayValue): void {
  const row = rows.get(id);
  if (row === undefined) {
    return;
  }

  row.valueCell.textContent = display.text;
  row.typeCell.textContent = display.typeName;

  const isFirstPaint = row.previousText === null;
  const changed = !isFirstPaint && row.previousText !== display.text;
  row.previousText = display.text;

  if (!changed) {
    return;
  }

  if (row.highlightTimer !== undefined) {
    clearTimeout(row.highlightTimer);
  }
  row.container.classList.add('changed');
  row.highlightTimer = setTimeout(() => {
    row.container.classList.remove('changed');
    row.highlightTimer = undefined;
  }, HIGHLIGHT_DURATION_MS);
}

// --- Привязка storage-строки: начальное значение + живое наблюдение ---
function bindStorageRow<T>(
  id: string,
  source: WatchableValue<T>,
  format: (value: T) => DisplayValue,
): void {
  void source.getValue().then((value) => updateRow(id, format(value)));
  source.watch((value) => updateRow(id, format(value)));
}

// --- Рантайм-состояние из порта ---
function applyRuntimeState(state: CvmRuntimeState): void {
  updateRow('currentVideoId', asNullableId(state.currentVideoId));
  updateRow('translationStatus', asString(state.translationStatus));
  updateRow('translationActive', asBoolean(state.translationActive));
}

function setConnection(online: boolean): void {
  connEl!.classList.toggle('online', online);
  connLabelEl!.textContent = online ? 'подключено' : 'отключено';
}

function connect(): void {
  const port = browser.runtime.connect({ name: INSPECTOR_PORT_NAME });
  setConnection(true);

  port.onMessage.addListener((message: unknown) => {
    const inspectorMessage = message as InspectorMessage;
    if (inspectorMessage.type === 'runtime-state') {
      applyRuntimeState(inspectorMessage.state);
    }
  });

  port.onDisconnect.addListener(() => {
    setConnection(false);
    setTimeout(connect, INSPECTOR_RECONNECT_DELAY_MS);
  });
}

function init(): void {
  // Storage-строки (порядок как в TASKS.md).
  createRow('videoDucking', 'videoDucking', SOURCE_STORAGE);
  createRow('translationVolume', 'translationVolume', SOURCE_STORAGE);
  createRow('subtitlesEnabled', 'subtitlesEnabled', SOURCE_STORAGE);
  createRow('ttsEnabled', 'ttsEnabled', SOURCE_STORAGE);
  createRow('useYoutubeTranslation', 'useYoutubeTranslation', SOURCE_STORAGE);
  createRow('autoStart', 'autoStart', SOURCE_STORAGE);
  createRow('selectedVoice', 'selectedVoice', SOURCE_STORAGE);
  createRow('targetLanguage', 'targetLanguage', SOURCE_STORAGE);
  createRow('apiKey', 'apiKey', SOURCE_STORAGE);
  // Runtime-строки.
  createRow('translationActive', 'translationActive', SOURCE_RUNTIME);
  createRow('currentVideoId', 'currentVideoId', SOURCE_RUNTIME);
  createRow('translationStatus', 'translationStatus', SOURCE_RUNTIME);

  bindStorageRow('videoDucking', settings.videoDucking, asNumber);
  bindStorageRow('translationVolume', settings.translationVolume, asNumber);
  bindStorageRow('subtitlesEnabled', settings.subtitlesEnabled, asBoolean);
  bindStorageRow('ttsEnabled', settings.ttsEnabled, asBoolean);
  bindStorageRow('useYoutubeTranslation', settings.useYoutubeTranslation, asBoolean);
  bindStorageRow('autoStart', settings.autoStart, asBoolean);
  bindStorageRow('selectedVoice', settings.selectedVoice, asString);
  bindStorageRow('targetLanguage', settings.targetLanguage, asString);
  bindStorageRow('apiKey', settings.apiKey, asMasked);

  connect();
  console.info('[CVM] inspector ready');
}

document.addEventListener('DOMContentLoaded', init);
