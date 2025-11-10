import React from "https://esm.sh/react@18.2.0?dev";
import BrandGroup from "./BrandGroup.js";
import UnsortedList from "./UnsortedList.js";
import KanaIndex from "./KanaIndex.js";

const h = React.createElement;

export default function BrandShell({ brands, sortedData, isSorted, onSort, onReset, texts }) {
  const [activeLabel, setActiveLabel] = React.useState(null);
  const { navTitle, backLabel, heading, description, buttonSort, buttonSorted, buttonReset } =
    texts;

  const groupRefs = React.useMemo(() => {
    const refs = {};
    sortedData.order.forEach((label) => {
      refs[label] = React.createRef();
    });
    return refs;
  }, [sortedData.order]);

  const handleKanaSelect = (label) => {
    const targetRef = groupRefs[label];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveLabel(label);
    }
  };

  React.useEffect(() => {
    if (!isSorted) {
      setActiveLabel(null);
    }
  }, [isSorted]);

  let listContent;
  if (isSorted) {
    if (sortedData.order.length) {
      listContent = sortedData.order.map((label) =>
        h(BrandGroup, {
          key: label,
          ref: groupRefs[label],
          label,
          items: sortedData.grouped.get(label)
        })
      );
    } else {
      listContent = h("div", { className: "empty-hint" }, "ソート対象のブランドがありません。");
    }
  } else {
    listContent = h(UnsortedList, { brands });
  }

  return h(
    "div",
    { className: "app-shell" },
    h("div", { className: "status-notch" }),
    h(
      "header",
      { className: "top-bar" },
      h("button", { className: "back-button", type: "button", "aria-label": backLabel }, "‹"),
      h("span", { className: "top-title" }, navTitle)
    ),
    h(
      "main",
      { className: "content" },
      h(
        "section",
        { className: "sort-card" },
        h("h2", null, heading),
        h("p", null, description),
        h(
          "button",
          { type: "button", onClick: onSort, disabled: isSorted },
          isSorted ? buttonSorted : buttonSort
        ),
        isSorted
          ? h(
              "button",
              { type: "button", className: "reset-button", onClick: onReset },
              buttonReset
            )
          : null
      ),
      h(
        "section",
        { className: "list-shell" },
        h("div", { className: "brand-scroll" }, listContent),
        h(KanaIndex, {
          order: sortedData.order,
          visible: isSorted,
          activeLabel,
          onSelect: handleKanaSelect
        })
      )
    )
  );
}
