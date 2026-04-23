import { useMemo, useEffect, useState, ReactNode } from "react";

interface MasonryItem {
  /** Stable key for React. */
  key: string;
  /** Aspect ratio (width / height). When unknown, pass null. */
  ratio: number | null;
  /** Rendered card content. */
  render: () => ReactNode;
}

interface MasonryGridProps {
  items: MasonryItem[];
  /** Tailwind-like breakpoints → number of columns. */
  columns: { base: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Horizontal gap in px (also used as vertical gap unless gapY provided). */
  gapX?: number;
  gapY?: number;
  /** Fallback ratio (w/h) used only for items with unknown ratio (kept conservative). */
  fallbackRatio?: number;
}

/**
 * Column-based masonry (Artsy-style):
 * - N equal-width columns at the current breakpoint.
 * - Each item is placed into the currently shortest column (greedy packing
 *   based on its predicted ratio), which eliminates row-aligned holes while
 *   preserving each artwork's TRUE proportions.
 * - Re-distributes when the viewport breakpoint or items change.
 *
 * The component owns layout only. Card visuals (image, metadata) are passed
 * in via `items[i].render()` — proportions are honored by the card itself.
 */
const MasonryGrid = ({
  items,
  columns,
  gapX = 24,
  gapY = 40,
  fallbackRatio = 4 / 5,
}: MasonryGridProps) => {
  const [colCount, setColCount] = useState<number>(() => resolveColumns(columns));

  useEffect(() => {
    const onResize = () => setColCount(resolveColumns(columns));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [columns]);

  const distributed = useMemo(() => {
    // Track each column's accumulated normalized height (1 / ratio).
    // Greedy: place each item into the currently shortest column.
    const cols: { items: MasonryItem[]; height: number }[] = Array.from(
      { length: colCount },
      () => ({ items: [], height: 0 })
    );
    for (const item of items) {
      const ratio = item.ratio && item.ratio > 0 ? item.ratio : fallbackRatio;
      // Find shortest column (ties → leftmost for stable visual order).
      let target = 0;
      for (let i = 1; i < cols.length; i++) {
        if (cols[i].height < cols[target].height - 0.0001) target = i;
      }
      cols[target].items.push(item);
      cols[target].height += 1 / ratio;
    }
    return cols;
  }, [items, colCount, fallbackRatio]);

  return (
    <div className="flex w-full" style={{ gap: `${gapX}px` }}>
      {distributed.map((col, ci) => (
        <div
          key={ci}
          className="flex-1 min-w-0 flex flex-col"
          style={{ gap: `${gapY}px` }}
        >
          {col.items.map((item) => (
            <div key={item.key}>{item.render()}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Resolve current column count from window width using Tailwind breakpoints. */
function resolveColumns(c: MasonryGridProps["columns"]): number {
  if (typeof window === "undefined") return c.base;
  const w = window.innerWidth;
  if (w >= 1280 && c.xl) return c.xl;
  if (w >= 1024 && c.lg) return c.lg;
  if (w >= 768 && c.md) return c.md;
  if (w >= 640 && c.sm) return c.sm;
  return c.base;
}

export default MasonryGrid;
