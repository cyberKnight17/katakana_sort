import React from "https://esm.sh/react@18.2.0?dev";
import { classifyBrand, compareBrands } from "../utils/kana.js";

export function useSortedData(brands, isSorted) {
  return React.useMemo(() => {
    if (!isSorted) {
      return { grouped: null, order: [], enriched: brands };
    }

    const enriched = brands.map((brand) => ({
      ...brand,
      meta: classifyBrand(brand.displayName)
    }));

    enriched.sort((a, b) => compareBrands(a, b));

    const groupMap = new Map();
    const groupOrder = [];
    enriched.forEach((brand) => {
      const label = brand.meta.primaryGroup;
      if (!groupMap.has(label)) {
        groupMap.set(label, []);
        groupOrder.push(label);
      }
      groupMap.get(label).push(brand);
    });

    return { grouped: groupMap, order: groupOrder, enriched };
  }, [brands, isSorted]);
}

