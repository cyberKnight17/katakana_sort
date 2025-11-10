import React from "https://esm.sh/react@18.2.0?dev";

const h = React.createElement;

export default function BrandRow({ brand }) {
  const fallback = brand.logoText ?? brand.displayName.charAt(0) ?? "・";

  return h(
    "li",
    { className: "brand-row" },
    h("div", { className: "brand-logo" }, fallback),
    h(
      "div",
      { className: "brand-text" },
      h("span", { className: "jp-name" }, brand.displayName),
      h("span", { className: "latin-name" }, brand.latinName ?? "")
    )
  );
}

