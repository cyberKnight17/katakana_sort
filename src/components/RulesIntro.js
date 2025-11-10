import React from "https://esm.sh/react@18.2.0?dev";

const h = React.createElement;

export default function RulesIntro({ title, lead, rules }) {
  const listItems = rules.map((rule, index) => h("li", { key: index }, rule));

  return h(
    "section",
    { className: "rules-intro" },
    h("h1", null, title),
    h("p", { className: "lead" }, lead),
    h("ol", { className: "rules-list" }, listItems)
  );
}

