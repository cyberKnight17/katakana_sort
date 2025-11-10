import React from "https://esm.sh/react@18.2.0?dev";
import BrandRow from "./BrandRow.js";

const h = React.createElement;

const BrandGroup = React.forwardRef(function BrandGroup({ label, items }, ref) {
  const rows = items.map((brand) => h(BrandRow, { key: brand.id, brand }));

  return h(
    "section",
    { ref, className: "brand-group", id: `group-${label}` },
    h("div", { className: "group-header" }, label),
    h("ul", { className: "brand-list" }, rows)
  );
});

export default BrandGroup;

