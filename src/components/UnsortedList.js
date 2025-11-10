import React from "https://esm.sh/react@18.2.0?dev";
import BrandRow from "./BrandRow.js";

const h = React.createElement;

export default function UnsortedList({ brands }) {
  if (!brands.length) {
    return h("div", { className: "empty-hint" }, "ブランドがまだ登録されていません。");
  }

  const rows = brands.map((brand) => h(BrandRow, { key: brand.id, brand }));

  return h("ul", { className: "brand-list" }, rows);
}

