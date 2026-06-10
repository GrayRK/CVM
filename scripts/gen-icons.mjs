// Генерация плейсхолдер-иконок (сплошной цвет) в public/icons/.
// Без зависимостей: ручная сборка PNG через zlib. Заменится в Стадии 1.1.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync, crc32 } from 'node:zlib';

const SIZES = [16, 32, 48, 128];
const COLOR = [124, 58, 237, 255]; // фиолетовый RGBA
const OUT_DIR = 'public/icons';

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0, 0);
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // глубина цвета
  ihdr[9] = 6; // тип цвета: RGBA
  // байты 10..12 = 0: компрессия, фильтр, без чересстрочности

  const row = Buffer.alloc(1 + size * 4); // +1 байт фильтра (0) на строку
  for (let x = 0; x < size; x++) {
    row.set(COLOR, 1 + x * 4);
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const idat = deflateSync(raw);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const size of SIZES) {
  writeFileSync(`${OUT_DIR}/${size}.png`, png(size));
  console.log(`icon ${size}x${size} -> ${OUT_DIR}/${size}.png`);
}
