import { storage } from '#imports';
import { CALIBRATION_SAMPLES_KEY } from '@/lib/constants';
import type { CostSample, CalibrationStats } from '@/lib/types';

// Хранилище калибровочных замеров калькулятора (Стадия 3.3).
// Отдельно от кэша текстов — поэтому переживает «Очистить кэш». Доступно из
// фона (запись при фиксации) и из Inspector (чтение/наблюдение/сброс).
export const costSamples = storage.defineItem<CostSample[]>(CALIBRATION_SAMPLES_KEY, {
  fallback: [],
});

// Добавить замер (вызывается из фона при фиксации стоимости).
export async function addCostSample(sample: CostSample): Promise<void> {
  const list = await costSamples.getValue();
  await costSamples.setValue([...list, sample]);
}

// Полный сброс калибровки (на случай смены модели/цен).
export async function clearCostSamples(): Promise<void> {
  await costSamples.setValue([]);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Усреднённые коэффициенты по выборкам ТЕКУЩЕЙ модели. Каждый замер даёт своё
// отношение (например $/символ), усредняем — больше замеров, выше точность.
export function computeStats(samples: CostSample[], model: string): CalibrationStats {
  const relevant = samples.filter((sample) => sample.model === model && sample.chars > 0);
  const dollarsPerChar = average(relevant.map((sample) => sample.dollars / sample.chars));
  const tokensPerChar = average(
    relevant.map((sample) => (sample.tokensIn + sample.tokensOut) / sample.chars),
  );
  const withDuration = relevant.filter((sample) => sample.videoSeconds > 0);
  const charsPerMinute = average(
    withDuration.map((sample) => sample.chars / (sample.videoSeconds / 60)),
  );
  return {
    sampleCount: relevant.length,
    dollarsPerChar,
    charsPerMinute,
    tokensPerChar,
  };
}
