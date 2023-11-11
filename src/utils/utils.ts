
class UtilsClass {
  RandInt = (minimum: number, maximum: number): number => {
    return Math.floor(Math.random() * (Math.round(maximum) - Math.round(minimum) + 1)) + Math.round(minimum);
  }
}
const Utils = new UtilsClass();
export default Utils;

export const shuffleArray = (array: Array<number>): void => {
  let c = array.length;
  let b, d;
  while (c)
    b = Math.random() * c-- | 0, d = array[c], array[c] = array[b], array[b] = d
}

export const STATUS_UNFLIPPED = 0
export const STATUS_FLIPPING = 1
export const STATUS_FLIPPED = 2






export class TdMap {
  map: Map<number, Map<number, unknown>> = new Map();
  set(x: number, y: number, value: unknown): void {
    let yMap = this.map.get(x);
    if (!yMap) {
      yMap = new Map<number, unknown>();
      this.map.set(x, yMap);
    }
    yMap.set(y, value);
  }

  get(x: number, y: number): unknown {
    const yMap = this.map.get(x);
    if (!yMap) {
      return null;
    }
    return yMap.get(y) || null;
  }

  has(x: number, y: number): unknown {
    const yMap = this.map.get(x);
    if (!yMap) {
      return false;
    }
    return yMap.has(y);
  }

  forEach(callbackFn: (value: unknown, x: number, y: number, map: Map<number, Map<number, unknown>>) => unknown): void {
    this.map.forEach((yMap: Map<number, unknown>, x: number, map: Map<number, Map<number, unknown>>) => {
      yMap.forEach((value: unknown, y: number) => {
        callbackFn(value, x, y, map);
      });
    })
  }
}

export function pickOneOfMany<T>(selection: T | Array<T>): T {
  if (Array.isArray(selection)) {
    return selection[Math.floor(Math.random() * selection.length)];
  }
  return selection;
}

const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]

export function toggleOn(map: Array<Array<number>>, x: number, y: number, targetCode: number): void {
  const width = map[0]?.length;
  const height = map.length;
  if (x >= 0 && x < width && y >= 0 && y < height && map[y][x] !== targetCode) {
    map[y][x] = targetCode;
    for (let dir = 0; dir < 4; dir++) {
      const rand = Utils.RandInt(1, 100);
      if (rand > 70) {
        toggleOn(map, x + directions[dir][0], y + directions[dir][1], targetCode);
      }
    }
  }
}

export function mapGenerateRandomSpots(width: number, height: number, base: number, target: number, spots: number): Array<Array<number>> {
  const map: Array<Array<number>> = [...Array(height)].map(() => Array(width).fill(base));

  for (let i = 0; i < spots; i++) {
    const x = Utils.RandInt(0, width - 1);
    const y = Utils.RandInt(0, height - 1);
    toggleOn(map, x, y, target);
  }
  return map;
}