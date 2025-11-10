import React from "https://esm.sh/react@18.2.0?dev";
import RulesIntro from "./RulesIntro.js";
import BrandShell from "./BrandShell.js";
import { generateSampleBrands, shuffleArray } from "../data/brands.js";
import { useSortedData } from "../hooks/useSortedData.js";

const LOCALE_OPTIONS = [
  { code: "ja", label: "日本語" },
  { code: "zh", label: "简体中文" }
];

const TEXT = {
  ja: {
    switchLabel: "言語",
    rulesTitle: "五十音順ソートのルール",
    rulesLead:
      "ブランド名の先頭から片仮名を比較して五十音順に整列するための手順です。長音や小書き仮名、片仮名以外で始まる名称も、このルールに従えば一貫して並べ替えられます。",
    brandNavTitle: "ブランド",
    brandBackLabel: "前の画面へ戻る",
    brandDescription:
      "いま表示している順番は登録順のサンプルです。「五十音順に並べ替える」ボタンで、五十音ルールを適用した結果を確認できます。",
    brandButtonSort: "五十音順に並べ替える",
    brandButtonSorted: "五十音順に並べ替えました",
    brandButtonReset: "並び順を元に戻す",
    heading: (count) => `ブランド名リスト（サンプル ${count} 件）`
  },
  zh: {
    switchLabel: "语言",
    rulesTitle: "五十音排序规则",
    rulesLead:
      "以下步骤说明如何以片假名为基准，为品牌名执行五十音排序。处理长音符、小片假名以及非片假名开头的情况后，就能保持稳定的排序结果。",
    brandNavTitle: "品牌",
    brandBackLabel: "返回上一页",
    brandDescription: "当前列表按样例录入顺序展示。点击按钮即可应用五十音排序并查看结果。",
    brandButtonSort: "应用五十音排序",
    brandButtonSorted: "已按五十音排序",
    brandButtonReset: "恢复原始顺序",
    heading: (count) => `品牌名称列表（样例 ${count} 个）`
  }
};

const RULES = {
  ja: [
    "ブランド名の最初の片仮名を、表に示された五十音順（清音→濁音→半濁音）で比較します。",
    "先頭が同じ場合は 2 文字目以降を順に比較し、差が出るまで続けます。",
    "長音符「ー」は直前の片仮名と同じ文字として扱います（例：コー → ココ）。",
    "小書き片仮名（ャュョッ 等）は比較前に対応する大文字（ヤユヨツ 等）に置き換えます。",
    "片仮名以外で始まる名称は「# グループ」に分類し、数字 → 英字 → 記号の順に並べます。"
  ],
  zh: [
    "先取品牌名的首个片假名，按照五十音表中的顺序（清音→浊音→半浊音）比较。",
    "首字相同则比较第二个、第三个……直到出现差异或一方结束为止。",
    "遇到长音「ー」时，将其视作前一个片假名重复（如「コー」按「ココ」比较）。",
    "将小片假名（ャ、ュ、ョ、ッ等）统一替换为对应的大片假名（ヤ、ユ、ヨ、ツ等）。",
    "若不是片假名开头，则归入「# 组」，并在组内按 数字 → 英字 → 符号 排列。"
  ]
};

const h = React.createElement;

export default function App() {
  const [brands] = React.useState(() => shuffleArray(generateSampleBrands(1000)));
  const [isSorted, setIsSorted] = React.useState(false);
  const [locale, setLocale] = React.useState("ja");

  const sortedData = useSortedData(brands, isSorted);
  const text = TEXT[locale];
  const rules = RULES[locale];
  const headingText = text.heading(brands.length);

  const localeButtons = LOCALE_OPTIONS.map(({ code, label }) =>
    h(
      "button",
      {
        key: code,
        type: "button",
        className: code === locale ? "active" : "",
        onClick: () => setLocale(code)
      },
      label
    )
  );

  const localeSwitch = h(
    "div",
    { className: "locale-switch" },
    [h("span", { className: "switch-label" }, text.switchLabel), ...localeButtons]
  );

  const brandTexts = {
    navTitle: text.brandNavTitle,
    backLabel: text.brandBackLabel,
    description: text.brandDescription,
    buttonSort: text.brandButtonSort,
    buttonSorted: text.brandButtonSorted,
    buttonReset: text.brandButtonReset,
    heading: headingText
  };

  return h(
    "div",
    { className: "page-container" },
    localeSwitch,
    h(
      "div",
      { className: "content-columns" },
      h(RulesIntro, {
        title: text.rulesTitle,
        lead: text.rulesLead,
        rules
      }),
      h(BrandShell, {
        brands,
        sortedData,
        isSorted,
        onSort: () => setIsSorted(true),
        onReset: () => setIsSorted(false),
        texts: brandTexts
      })
    )
  );
}

