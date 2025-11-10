import React from "https://esm.sh/react@18.2.0?dev";

const h = React.createElement;

export default function KanaIndex({ order, visible, activeLabel, onSelect }) {
  const buttons = order.map((label) =>
    h(
      "button",
      {
        key: label,
        type: "button",
        className: label === activeLabel ? "active" : "",
        onClick: () => onSelect(label)
      },
      label.charAt(0)
    )
  );

  return h(
    "nav",
    { className: `kana-index ${visible ? "visible" : ""}`, "aria-hidden": !visible },
    buttons
  );
}

