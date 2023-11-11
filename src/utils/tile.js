const NW = Math.pow(2, 0);
const N = Math.pow(2, 1);
const NE = Math.pow(2, 2);
const W = Math.pow(2, 3);
const E = Math.pow(2, 4);
const SW = Math.pow(2, 5);
const S = Math.pow(2, 6);
const SE = Math.pow(2, 7);

const BITMASK = {
  2: 1, 8: 2, 10: 3, 11: 4,
  16: 5, 18: 6, 22: 7, 24: 8,
  26: 9, 27: 10, 30: 11, 31: 12,
  64: 13, 66: 14, 72: 15, 74: 16,
  75: 17, 80: 18, 82: 19, 86: 20,
  88: 21, 90: 22, 91: 23, 94: 24,
  95: 25, 104: 26, 106: 27, 107: 28,
  120: 29, 122: 30, 123: 31, 126: 32,
  127: 33, 208: 34, 210: 35, 214: 36,
  216: 37, 218: 38, 219: 39, 222: 40,
  223: 41, 248: 42, 250: 43, 251: 44,
  254: 45, 255: 46, 0: 47
};

const MAPPING = {
  0: [0, 0, 0, 0],
  1: [4, 6, 1, 3],
  2: [8, 9, 2, 3],
  3: [13, 6, 2, 3],
  4: [5, 6, 2, 3],
  5: [7, 8, 1, 2],
  6: [4, 12, 1, 2],
  7: [4, 5, 1, 2],
  8: [8, 8, 2, 2],
  9: [13, 12, 2, 2],
  10: [5, 12, 2, 2],
  11: [13, 5, 2, 2],
  12: [5, 5, 2, 2],
  13: [7, 9, 4, 6],
  14: [4, 6, 4, 6],
  15: [8, 9, 11, 6],
  16: [13, 6, 11, 6],
  17: [5, 6, 11, 6],
  18: [7, 8, 4, 10],
  19: [4, 12, 4, 10],
  20: [4, 5, 4, 10],
  21: [8, 8, 11, 10],
  22: [13, 12, 11, 10],
  23: [5, 12, 11, 10],
  24: [13, 5, 11, 10],
  25: [5, 5, 11, 10],
  26: [8, 9, 5, 6],
  27: [13, 6, 5, 6],
  28: [5, 6, 5, 6],
  29: [8, 8, 5, 10],
  30: [13, 12, 5, 10],
  31: [5, 12, 5, 10],
  32: [13, 5, 5, 10],
  33: [5, 5, 5, 10],
  34: [7, 8, 4, 5],
  35: [4, 12, 4, 5],
  36: [4, 5, 4, 5],
  37: [8, 8, 11, 5],
  38: [13, 12, 11, 5],
  39: [5, 12, 11, 5],
  40: [13, 5, 11, 5],
  41: [5, 5, 11, 5],
  42: [8, 8, 5, 5],
  43: [13, 12, 5, 5],
  44: [5, 12, 5, 5],
  45: [13, 5, 5, 5],
  46: [5, 5, 5, 5],
  47: [7, 9, 1, 3]
}


function autotileLookup(map, x_boundary, y_boundary, x, y, isLite) {
  let sum = 0;
  let n = false;
  let e = false;
  let s = false;
  let w = false;

  if (!map[y][x]) {
    return isLite ? 0 : MAPPING[0];
  }

  if (y > 0 && map[y - 1][x]) { n = true; sum += N; }
  if (x > 0 && map[y][x - 1]) { w = true; sum += W; }
  if (x < x_boundary && map[y][x + 1]) { e = true; sum += E; }
  if (y < y_boundary && map[y + 1][x]) { s = true; sum += S; }

  if (n && w && y > 0 && x > 0 && map[y - 1][x - 1]) sum += NW;
  if (n && e && y > 0 && x < x_boundary && map[y - 1][x + 1]) sum += NE;
  if (s && w && y < y_boundary && x > 0 && map[y + 1][x - 1]) sum += SW;
  if (s && e && x < x_boundary && y < y_boundary && map[y + 1][x + 1]) sum += SE;

  return isLite ? BITMASK[sum] : MAPPING[BITMASK[sum]];
}

export function autotile(map, isLite) {
  const tiles = [];
  const height = map.length;
  const width = map[0].length;
  const x_boundary = width - 1;
  const y_boundary = height - 1;
  for (let y = 0; y < height; y++) {
    if (isLite) {
      tiles[y] = [];
    }
    else {
      tiles[y * 2] = [];
      tiles[y * 2 + 1] = [];
    }
    for (let x = 0; x < width; x++) {
      if (isLite) {
        tiles[y][x] = autotileLookup(map, x_boundary, y_boundary, x, y, true);
      }
      else {
        const complexTiles = autotileLookup(map, x_boundary, y_boundary, x, y);
        tiles[y * 2][x * 2] = complexTiles[0];
        tiles[y * 2][x * 2 + 1] = complexTiles[1];
        tiles[y * 2 + 1][x * 2] = complexTiles[2];
        tiles[y * 2 + 1][x * 2 + 1] = complexTiles[3];
      }
    }
  }
  return tiles;
}