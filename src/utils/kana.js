const SMALL_KATAKANA_MAP = new Map([
  ["ァ", "ア"],
  ["ィ", "イ"],
  ["ゥ", "ウ"],
  ["ェ", "エ"],
  ["ォ", "オ"],
  ["ャ", "ヤ"],
  ["ュ", "ユ"],
  ["ョ", "ヨ"],
  ["ッ", "ツ"],
  ["ヮ", "ワ"],
  ["ヵ", "カ"],
  ["ヶ", "ケ"]
]);

export const IGNORED_CHARS = new Set([
  " ",
  "　",
  "・",
  "･",
  "／",
  "/",
  "-",
  "‐",
  "－",
  "―",
  "（",
  "）",
  "(",
  ")",
  "[",
  "]",
  "［",
  "］",
  "＆",
  "&",
  "＋",
  "+",
  "：",
  ":",
  "．",
  ".",
  "。"
]);

const KATAKANA_ROWS = [
  ["ア", "イ", "ウ", "ヴ", "エ", "オ"],
  ["カ", "ガ", "キ", "ギ", "ク", "グ", "ケ", "ゲ", "コ", "ゴ"],
  ["サ", "ザ", "シ", "ジ", "ス", "ズ", "セ", "ゼ", "ソ", "ゾ"],
  ["タ", "ダ", "チ", "ヂ", "ツ", "ヅ", "テ", "デ", "ト", "ド"],
  ["ナ", "ニ", "ヌ", "ネ", "ノ"],
  ["ハ", "バ", "パ", "ヒ", "ビ", "ピ", "フ", "ブ", "プ", "ヘ", "ベ", "ペ", "ホ", "ボ", "ポ"],
  ["マ", "ミ", "ム", "メ", "モ"],
  ["ヤ", "ユ", "ヨ"],
  ["ラ", "リ", "ル", "レ", "ロ"],
  ["ワ", "ヰ", "ヱ", "ヲ"],
  ["ン"]
];

const ROW_LABELS = ["あ行", "か行", "さ行", "た行", "な行", "は行", "ま行", "や行", "ら行", "わ行", "ん行"];

const ORDER_MAP = {};
const GROUP_LABELS = {};
const KATAKANA_SEQUENCE = [];

KATAKANA_ROWS.forEach((row, rowIndex) => {
  const label = ROW_LABELS[rowIndex];
  row.forEach((char) => {
    if (!(char in ORDER_MAP)) {
      ORDER_MAP[char] = KATAKANA_SEQUENCE.length;
      GROUP_LABELS[char] = label;
      KATAKANA_SEQUENCE.push(char);
    }
  });
});

const HALF_WIDTH_KATAKANA_MAP = (() => {
  const source =
    "｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ";
  const target =
    "。「」、・ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜";
  return source.split("").reduce((map, ch, idx) => {
    map[ch] = target[idx];
    return map;
  }, {});
})();

const NON_KANA_PRIORITY = {
  digit: 0,
  letter: 1,
  other: 2
};

function toKatakanaFullWidth(char) {
  if (HALF_WIDTH_KATAKANA_MAP[char]) {
    return HALF_WIDTH_KATAKANA_MAP[char];
  }
  const code = char.charCodeAt(0);
  // Hiragana -> Katakana
  if (code >= 0x3041 && code <= 0x3096) {
    return String.fromCharCode(code + 0x60);
  }
  // Full-width digits
  if (code >= 0xff10 && code <= 0xff19) {
    return String.fromCharCode(code - 0xfee0);
  }
  // Full-width uppercase letters
  if (code >= 0xff21 && code <= 0xff3a) {
    return String.fromCharCode(code - 0xfee0);
  }
  // Full-width lowercase letters -> uppercase ASCII
  if (code >= 0xff41 && code <= 0xff5a) {
    return String.fromCharCode(code - 0xfee0).toUpperCase();
  }
  return char;
}

function normalizeKatakana(raw) {
  const normalized = [];
  for (const rawChar of raw) {
    if (IGNORED_CHARS.has(rawChar)) {
      continue;
    }
    let char = toKatakanaFullWidth(rawChar);
    if (char === "") continue;

    if (SMALL_KATAKANA_MAP.has(char)) {
      char = SMALL_KATAKANA_MAP.get(char);
    }

    if (char === "ー") {
      if (normalized.length > 0) {
        normalized.push(normalized[normalized.length - 1]);
      }
      continue;
    }

    // Regular Katakana range (ァ-ヺ plus ヽヾ)
    if (/[\u30A1-\u30FA\u30FD\u30FE]/.test(char)) {
      normalized.push(char);
      continue;
    }

    if (/[0-9]/.test(char)) {
      normalized.push(char);
      continue;
    }

    if (/[A-Za-z]/.test(char)) {
      normalized.push(char.toUpperCase());
      continue;
    }

    if (char.trim() === "") {
      continue;
    }

    normalized.push(char);
  }
  return normalized;
}

export function getNonKanaCategory(char) {
  if (char === undefined) return "other";
  if (/[0-9]/.test(char)) return "digit";
  if (/[A-Za-z]/.test(char)) return "letter";
  return "other";
}

export function classifyBrand(rawName) {
  const normalized = normalizeKatakana(rawName);
  const firstKana = normalized.find((ch) => ORDER_MAP[ch] !== undefined);
  const isKana = firstKana !== undefined;
  const primaryGroup = isKana ? GROUP_LABELS[firstKana] ?? "その他" : "# グループ";
  const isHashGroup = !isKana;
  const firstChar = normalized[0];
  const nonKanaCategory = isHashGroup ? getNonKanaCategory(firstChar) : null;
  const printableNormalized = normalized
    .map((ch) => {
      if (ORDER_MAP[ch] !== undefined) return ch;
      if (/[0-9A-Za-z]/.test(ch)) return ch.toUpperCase();
      return ch;
    })
    .join("");

  return {
    normalized,
    isKana,
    primaryGroup,
    isHashGroup,
    nonKanaCategory,
    printableNormalized
  };
}

export function compareNonKana(a, b) {
  const catA = NON_KANA_PRIORITY[a.meta.nonKanaCategory];
  const catB = NON_KANA_PRIORITY[b.meta.nonKanaCategory];
  if (catA !== catB) {
    return catA - catB;
  }
  const upperA = a.meta.printableNormalized.toUpperCase();
  const upperB = b.meta.printableNormalized.toUpperCase();
  return upperA.localeCompare(upperB, "en");
}

export function compareBrands(a, b) {
  if (a.meta.isKana && !b.meta.isKana) return -1;
  if (!a.meta.isKana && b.meta.isKana) return 1;
  if (!a.meta.isKana && !b.meta.isKana) {
    return compareNonKana(a, b);
  }

  const len = Math.max(a.meta.normalized.length, b.meta.normalized.length);
  for (let i = 0; i < len; i += 1) {
    const charA = a.meta.normalized[i];
    const charB = b.meta.normalized[i];
    if (charA === charB) continue;
    if (charA === undefined) return -1;
    if (charB === undefined) return 1;

    const orderA = ORDER_MAP[charA];
    const orderB = ORDER_MAP[charB];

    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;

    const codeDiff = charA.codePointAt(0) - charB.codePointAt(0);
    if (codeDiff !== 0) return codeDiff;
  }
  return 0;
}

export function normalizeKana(raw) {
  return normalizeKatakana(raw);
}

