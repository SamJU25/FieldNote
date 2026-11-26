"use client";

import { type RefObject, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { renderInlineRich } from "@/components/visuals/rich-text";
import type {
  DsaArrayVisual,
  DsaDivideVisual,
  DsaDpGridVisual,
  DsaGraphVisual,
  DsaGrowthTier,
  DsaGrowthVisual,
  DsaStructureVisual,
} from "@/lib/lesson-types";

function computeTierSteps(id: DsaGrowthTier, n: number): number {
  if (id === "const") return 1;
  if (id === "log") return Math.max(1, Math.round(Math.log2(n)));
  if (id === "linear") return n;
  return n * n;
}

function describeTierAtN(id: DsaGrowthTier, n: number): string {
  const steps = computeTierSteps(id, n);
  if (id === "const") return `Constant O(1): 1 step at n = ${n}.`;
  if (id === "log") {
    const chain = Array.from({ length: steps }, (_, i) => Math.max(1, Math.floor(n / 2 ** i))).join(" -> ");
    return `O(log₂ ${n}) = ${steps} halvings (${chain}).`;
  }
  if (id === "linear") return `Linear O(n): ${steps} steps scanning n = ${n} items.`;
  return `Quadratic O(n²): ${n} × ${n} = ${steps} pair checks.`;
}

/**
 * Normalize dynamic pointer labels ("lo = 0" -> "lo = 3", "p = 2 (prime)" -> "p = 3 (prime)")
 * so pointer badges retain a continuous FLIP identity and glide across columns.
 */
function normalizePointerIdentity(label: string): string {
  const stem = label.split(/\s*[=:(]/)[0]?.trim().toLowerCase();
  if (stem && /^[a-z_][a-z0-9_ -]{0,18}$/i.test(stem)) {
    return stem;
  }
  return label.toLowerCase();
}

/**
 * Shared FLIP motion hook (Web Animations API): physically glides moved,
 * shifted, split, and swapped elements from their prior step position.
 */
function useFlipMotion(containerRef: RefObject<HTMLElement | null>, trigger: unknown) {
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-flip-key]"));
    for (const el of elements) {
      for (const anim of el.getAnimations()) anim.cancel();
    }

    const nextRects = new Map<string, DOMRect>();
    for (const el of elements) {
      const key = el.dataset.flipKey;
      if (key) nextRects.set(key, el.getBoundingClientRect());
    }

    const hadPrev = prevRectsRef.current.size > 0;
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hadPrev && !reduced && typeof Element !== "undefined" && typeof elements[0]?.animate === "function") {
      for (const el of elements) {
        const key = el.dataset.flipKey;
        if (!key) continue;
        const nextRect = nextRects.get(key);
        if (!nextRect) continue;
        const prevRect = prevRectsRef.current.get(key);

        if (!prevRect) {
          el.animate(
            [
              { opacity: 0, transform: "translateY(-8px) scale(0.95)" },
              { opacity: 1, transform: "translateY(1px) scale(1.02, 0.98)", offset: 0.72 },
              { opacity: 1, transform: "translateY(0px) scale(1, 1)" },
            ],
            { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
          );
          continue;
        }

        const dx = prevRect.left - nextRect.left;
        const dy = prevRect.top - nextRect.top;
        if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) continue;

        el.style.zIndex = "3";
        const isWideSwap = Math.abs(dx) > 72 && Math.abs(dy) < 14;
        const keyframes: Keyframe[] = isWideSwap
          ? [
              { transform: `translate(${dx}px, ${dy}px) scale(1)` },
              { transform: `translate(${dx * 0.5}px, ${dx < 0 ? -16 : 16}px) scale(1.04)`, offset: 0.48 },
              { transform: "translate(0px, 0px) scale(1)" },
            ]
          : [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0px, 0px)" },
            ];

        const anim = el.animate(keyframes, {
          duration: isWideSwap ? 290 : 250,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
        });
        const clearZ = () => {
          el.style.zIndex = "";
        };
        anim.onfinish = clearZ;
        anim.oncancel = clearZ;
      }
    }

    prevRectsRef.current = nextRects;
  }, [containerRef, trigger]);
}

/**
 * 1. Smooth CSS-Animated Big-O Step Growth Comparator
 * Uses native CSS layout + smooth width transitions (no viewBox font scaling distortion).
 */
export function DsaGrowthSvg({ visual }: { visual: DsaGrowthVisual }) {
  const [override, setOverride] = useState<{
    forVisual: DsaGrowthVisual;
    n: number | null;
    tier: DsaGrowthTier | "all" | null;
  } | null>(null);
  const [autoGrow, setAutoGrow] = useState(false);

  const overrideN = override?.forVisual === visual ? override.n : null;
  const overrideTier = override?.forVisual === visual ? override.tier : null;
  const isAnimating = autoGrow && override?.forVisual === visual;

  const isStandardGrowth =
    visual.tiers.some((t) => t.id === "const") &&
    visual.tiers.some((t) => t.id === "quad") &&
    visual.tiers.every((t) => /^O\(/.test(t.label));
  const activeN = (isStandardGrowth ? overrideN : null) ?? visual.n;
  const activeTier = overrideTier ?? visual.activeTier ?? "all";
  const showAll = activeTier === "all";

  useEffect(() => {
    if (!isAnimating || !isStandardGrowth) return;
    const stops = [2, 4, 8, 16];
    const timer = window.setInterval(() => {
      setOverride((prev) => {
        const current = prev?.forVisual === visual && prev.n !== null ? prev.n : visual.n;
        const idx = stops.indexOf(current);
        return {
          forVisual: visual,
          n: stops[(idx + 1) % stops.length],
          tier: prev?.forVisual === visual ? prev.tier : null,
        };
      });
    }, 1150);
    return () => window.clearInterval(timer);
  }, [isAnimating, isStandardGrowth, visual]);

  const rows = visual.tiers.map((tier) => ({
    ...tier,
    steps: isStandardGrowth && overrideN !== null ? computeTierSteps(tier.id, activeN) : tier.steps,
  }));
  const maxSteps = Math.max(1, ...rows.map((r) => r.steps));

  return (
    <div className="visual-svg-wrap dsa-visual-wrap">
      <div className="dsa-lab-controls" role="group" aria-label="Interactive Big-O controls">
        {isStandardGrowth && (
          <div className="dsa-control-group">
            <span className="dsa-control-label">Input size</span>
            {[2, 4, 8, 16].map((val) => (
              <button
                key={val}
                type="button"
                aria-pressed={activeN === val}
                className={`lab-pill-btn tabular ${activeN === val ? "is-active" : ""}`}
                onClick={() => {
                  setAutoGrow(false);
                  setOverride({ forVisual: visual, n: val, tier: overrideTier });
                }}
              >
                n = {val}
              </button>
            ))}
            <button
              type="button"
              className={`lab-pill-btn ${isAnimating ? "is-active" : ""}`}
              aria-pressed={isAnimating}
              onClick={() => {
                setAutoGrow((prev) => {
                  const next = !prev;
                  if (next) {
                    setOverride({ forVisual: visual, n: activeN, tier: overrideTier });
                  }
                  return next;
                });
              }}
            >
              <Icon name={isAnimating ? "pause" : "play"} size={12} />
              <span>{isAnimating ? "Pause" : "Animate"}</span>
            </button>
          </div>
        )}

        <div className="dsa-control-group">
          <button
            type="button"
            aria-pressed={activeTier === "all"}
            className={`lab-pill-btn ${activeTier === "all" ? "is-active" : ""}`}
            onClick={() => setOverride({ forVisual: visual, n: overrideN, tier: "all" })}
          >
            All
          </button>
          {visual.tiers.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={activeTier === t.id}
              className={`lab-pill-btn mono ${activeTier === t.id ? "is-active" : ""}`}
              onClick={() =>
                setOverride({
                  forVisual: visual,
                  n: overrideN,
                  tier: activeTier === t.id ? "all" : t.id,
                })
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="dsa-growth-board" role="group" aria-label={`Algorithm step comparison at n = ${activeN}`}>
        {rows.map((row) => {
          const isFocus = showAll || activeTier === row.id;
          const isSpotlight = !showAll && activeTier === row.id;
          const pct = Math.max(2, (row.steps / maxSteps) * 100);
          const pipCount = Math.min(row.steps, 32);

          return (
            <button
              key={row.id}
              type="button"
              aria-pressed={isSpotlight}
              className={`dsa-growth-row ${isFocus ? "is-focus" : "is-dim"} ${isSpotlight ? "is-spotlight" : ""}`}
              onClick={() =>
                setOverride({
                  forVisual: visual,
                  n: overrideN,
                  tier: activeTier === row.id ? "all" : row.id,
                })
              }
            >
              <div className="dsa-growth-meta">
                <strong className="mono">{row.label}</strong>
                <span>{row.name}</span>
              </div>

              <div className="dsa-growth-visual-col">
                <div className="dsa-growth-track">
                  <div
                    className={`dsa-growth-bar tier-${row.id}`}
                    style={{ transform: `scaleX(${(pct / 100).toFixed(4)})` }}
                  />
                </div>
                <div className="dsa-pip-row" aria-hidden="true">
                  {Array.from({ length: pipCount }).map((_, idx) => (
                    <span key={idx} className="dsa-step-pip" />
                  ))}
                  {row.steps > pipCount && (
                    <span className="dsa-pip-overflow tabular">+{row.steps - pipCount} more</span>
                  )}
                </div>
              </div>

              <div className="dsa-growth-count tabular">
                <strong>{row.steps}</strong>
                <span>{row.steps === 1 ? "step" : "steps"}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="dsa-inspector-strip tabular">
        <span>
          <strong>n = {activeN}</strong> ·{" "}
          {activeTier === "all"
            ? "Select a row or press Animate to compare growth."
            : describeTierAtN(activeTier, activeN)}
        </span>
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

/**
 * 2. Smooth HTML/CSS Array & Pointer Studio
 * Pointers align over exact grid columns with smooth transitions and exact Fieldnote typography.
 */
export function DsaArraySvg({ visual }: { visual: DsaArrayVisual }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [slotPick, setSlotPick] = useState<{
    forVisual: DsaArrayVisual;
    tray: number;
    index: number;
  } | null>(null);
  const selectedSlot = slotPick?.forVisual === visual ? slotPick : null;

  useFlipMotion(boardRef, visual);

  const inspectedTray = selectedSlot ? visual.trays[selectedSlot.tray] : null;
  const inspectedCell = selectedSlot && inspectedTray ? inspectedTray.cells[selectedSlot.index] : null;

  return (
    <div className="visual-svg-wrap dsa-visual-wrap">
      <div ref={boardRef} className="dsa-array-board">
        {visual.trays.map((tray, tIdx) => {
          const cols = Math.max(1, tray.cells.length);
          const hasPointers = Boolean(tray.pointers && tray.pointers.length > 0);
          const minColPx = cols >= 12 ? 32 : cols >= 9 ? 38 : 48;
          const gridStyle = {
            gridTemplateColumns: `repeat(${cols}, minmax(${minColPx}px, 1fr))`,
            gap: cols >= 10 ? "6px 4px" : "6px 8px",
          };
          const ptrKeys = new Map<NonNullable<typeof tray.pointers>[number], string>();
          const labelCounts = new Map<string, number>();
          for (const ptr of tray.pointers ?? []) {
            const normId = normalizePointerIdentity(ptr.label);
            const count = labelCounts.get(normId) ?? 0;
            labelCounts.set(normId, count + 1);
            ptrKeys.set(ptr, `ptr-${tIdx}-${normId}-${count}`);
          }
          return (
            <div key={tIdx} className={`dsa-array-tray ${cols >= 10 ? "is-compact" : ""}`}>
              {tray.label && <div className="dsa-tray-head">{tray.label}</div>}

              <div className="dsa-tray-grid" style={gridStyle}>
                {hasPointers &&
                  tray.cells.map((_, cIdx) => {
                    const ptrsHere = tray.pointers?.filter((p) => p.index === cIdx) ?? [];
                    return (
                      <div
                        key={`p-${cIdx}`}
                        className="dsa-pointer-slot"
                        style={{ gridColumn: cIdx + 1, gridRow: 1 }}
                      >
                        {ptrsHere.map((ptr, pIdx) => (
                          <span
                            key={ptrKeys.get(ptr) ?? `${ptr.label}-${pIdx}`}
                            data-flip-key={ptrKeys.get(ptr)}
                            className={`dsa-ptr-badge tone-${ptr.tone ?? "accent"}`}
                          >
                            <span>{ptr.label}</span>
                            <span className="dsa-ptr-stem" aria-hidden="true" />
                          </span>
                        ))}
                      </div>
                    );
                  })}

                {tray.cells.length === 0 ? (
                  <div className="dsa-empty-array-pill tabular">[] (0 items)</div>
                ) : (
                  tray.cells.map((cell, cIdx) => {
                  const inWindow =
                    tray.highlightRange &&
                    cIdx >= tray.highlightRange[0] &&
                    cIdx <= tray.highlightRange[1];
                  const isPicked = selectedSlot?.tray === tIdx && selectedSlot?.index === cIdx;
                  const stateCls = cell.state && cell.state !== "default" ? `is-${cell.state}` : "";

                  return (
                    <button
                      key={cell.id ?? cIdx}
                      data-flip-key={cell.id ?? `${tIdx}-${cIdx}`}
                      type="button"
                      aria-pressed={isPicked}
                      style={{ gridColumn: cIdx + 1, gridRow: hasPointers ? 2 : 1 }}
                      className={`dsa-cell-btn ${stateCls} ${inWindow ? "in-window" : ""} ${
                        isPicked ? "is-user-picked" : ""
                      }`}
                      onClick={() => setSlotPick({ forVisual: visual, tray: tIdx, index: cIdx })}
                    >
                      <span className="dsa-cell-val tabular">{cell.value}</span>
                      <span className="dsa-cell-idx tabular">[{cell.index ?? cIdx}]</span>
                    </button>
                  );
                }))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dsa-inspector-strip tabular">
        {inspectedCell && selectedSlot ? (
          <span>
            <strong>
              arr[{inspectedCell.index ?? selectedSlot.index}] = {inspectedCell.value}
            </strong>{" "}
            · Offset = <code>base + {inspectedCell.index ?? selectedSlot.index} × slot_size</code> (1 direct O(1) lookup)
          </span>
        ) : (
          <span>Select a cell to inspect its index and memory offset.</span>
        )}
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

/**
 * 3. Smooth HTML/CSS Stack, Queue & Linked-List Studio
 */
export function DsaStructureSvg({ visual }: { visual: DsaStructureVisual }) {
  const structRef = useRef<HTMLDivElement>(null);
  const [picked, setPicked] = useState<{ forVisual: DsaStructureVisual; id: string } | null>(null);
  const selectedId = picked?.forVisual === visual ? picked.id : null;

  useFlipMotion(structRef, visual);

  const selectedItem =
    visual.items.find((it) => it.id === selectedId) ?? visual.items[visual.items.length - 1];

  if (visual.mode === "stack") {
    const reversed = [...visual.items].reverse();
    return (
      <div className="visual-svg-wrap dsa-visual-wrap">
        <div className="dsa-struct-board">
          {visual.title && <div className="dsa-tray-head is-centered">{visual.title}</div>}
          <div ref={structRef} className="dsa-stack-well" role="group" aria-label={visual.title ?? "Call stack"}>
            {reversed.map((item, idx) => {
              const stateCls = item.state && item.state !== "default" ? `is-${item.state}` : "";
              const isPicked = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  data-flip-key={item.id}
                  type="button"
                  aria-pressed={isPicked}
                  className={`dsa-stack-frame ${stateCls} ${isPicked ? "is-user-picked" : ""}`}
                  onClick={() => setPicked({ forVisual: visual, id: item.id })}
                >
                  <span className="dsa-frame-name mono">
                    {idx === 0 && <em className="dsa-top-tag">Top</em>}
                    {item.label}
                  </span>
                  {item.sub && <span className="dsa-frame-sub tabular">{item.sub}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {selectedItem && (
          <div className="dsa-inspector-strip tabular">
            <span>
              <strong>Frame: {selectedItem.label}</strong>
              {selectedItem.sub ? ` · ${selectedItem.sub}` : ""}
            </span>
          </div>
        )}
        {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
      </div>
    );
  }

  const inferredLinkKind =
    visual.linkKind ??
    (visual.title?.toLowerCase().includes("doubly") || visual.title?.toLowerCase().includes("lru")
      ? "doubly"
      : visual.title?.toLowerCase().includes("cycle") || visual.items.some((it) => /next\s*->\s*\d|loops/i.test(it.sub ?? ""))
        ? "cycle"
        : "singly");
  const isDoubly = inferredLinkKind === "doubly";
  const isCycle = inferredLinkKind === "cycle";

  return (
    <div className="visual-svg-wrap dsa-visual-wrap">
      <div className="dsa-struct-board">
        {visual.title && <div className="dsa-tray-head is-centered">{visual.title}</div>}
        {visual.mode === "queue" && (
          <div className="dsa-queue-ends">
            <span>Front (dequeue)</span>
            <span>Back (enqueue)</span>
          </div>
        )}
        <div ref={structRef} className="dsa-chain-row" role="list">
          {visual.items.map((item, idx) => {
            const stateCls = item.state && item.state !== "default" ? `is-${item.state}` : "";
            const isPicked = selectedId === item.id;
            const hasNext = idx < visual.items.length - 1;
            const hasBreak =
              visual.mode === "linked-list" &&
              hasNext &&
              (Boolean(item.breaksChain) || /\bnull\b/i.test(item.sub ?? ""));
            return (
              <div key={item.id} data-flip-key={item.id} className="dsa-chain-item" role="listitem">
                <button
                  type="button"
                  aria-pressed={isPicked}
                  className={`dsa-node-card ${stateCls} ${isPicked ? "is-user-picked" : ""}`}
                  onClick={() => setPicked({ forVisual: visual, id: item.id })}
                >
                  <strong className="mono">{item.label}</strong>
                  {item.sub && <small className="tabular">{item.sub}</small>}
                </button>
                {visual.mode === "linked-list" && hasNext && hasBreak && (
                  <span className="dsa-chain-null mono" aria-label="chain ends at null">
                    -&gt; null
                  </span>
                )}
                {visual.mode === "linked-list" && hasNext && !hasBreak && (
                  <span className="dsa-chain-arrow mono" aria-hidden="true">
                    {isDoubly ? "<->" : "->"}
                  </span>
                )}
              </div>
            );
          })}
          {visual.mode === "linked-list" && !isDoubly && !isCycle && (
            <span className="dsa-chain-null mono">null</span>
          )}
          {visual.mode === "linked-list" && isCycle && (
            <span className="dsa-chain-cycle mono">
              loops -&gt; {visual.cycleTarget ?? "cycle"}
            </span>
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="dsa-inspector-strip tabular">
          <span>
            <strong>Node: {selectedItem.label}</strong>
            {selectedItem.sub ? ` · ${selectedItem.sub}` : ""}
          </span>
        </div>
      )}
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

/**
 * 4. 1:1 Scale Interactive Graph & Tree Canvas (fixed max-width 640px prevents SVG font distortion)
 */
export function DsaGraphSvg({ visual }: { visual: DsaGraphVisual }) {
  const uid = useId();
  const gridId = `${uid}-gr-grid`;
  const arrowId = `${uid}-gr-arrow`;
  const arrowActiveId = `${uid}-gr-arrow-active`;
  const hatchActiveId = `${uid}-gr-hatch-active`;
  const hatchVisitedId = `${uid}-gr-hatch-visited`;
  const svgRef = useRef<SVGSVGElement>(null);
  const runnerRef = useRef<SVGGElement>(null);
  const prevGraphRef = useRef<{
    nodes: Map<string, { state?: string }>;
    edges: Map<string, string>;
  } | null>(null);
  const [nodePick, setNodePick] = useState<{ forVisual: DsaGraphVisual; id: string | null } | null>(null);
  const selectedNodeId = nodePick?.forVisual === visual ? nodePick.id : null;

  const w = 640;
  const h = 340;
  const mapX = (nx: number) => 66 + (nx / 100) * (w - 132);
  const mapY = (ny: number) => 56 + (ny / 100) * (h - 90);
  const circleR = 21;
  const pillH = 38;
  const getNodeBox = (label: string) => {
    const isPill = label.length > 4;
    const halfW = isPill ? Math.max(circleR, Math.min(58, label.length * 3.8 + 10)) : circleR;
    const halfH = isPill ? pillH / 2 : circleR;
    return { isPill, halfW, halfH };
  };
  const borderDist = (halfW: number, halfH: number, isPill: boolean, ux: number, uy: number) => {
    if (!isPill) return halfW;
    const tx = Math.abs(ux) > 1e-4 ? halfW / Math.abs(ux) : 1e6;
    const ty = Math.abs(uy) > 1e-4 ? halfH / Math.abs(uy) : 1e6;
    return Math.min(tx, ty);
  };
  const nodeMap = new Map(visual.nodes.map((n) => [n.id, n]));
  const hasDirectedEdges = visual.edges.some((e) => e.directed);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const runner = runnerRef.current;
    const prev = prevGraphRef.current;
    const nextNodes = new Map(visual.nodes.map((n) => [n.id, { state: n.state }]));
    const nextEdges = new Map(visual.edges.map((e, i) => [`${e.from}->${e.to}#${i}`, e.state ?? "default"]));

    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (svg && prev && !reduced) {
      const sameTopologyFamily = visual.nodes.some((n) => prev.nodes.has(n.id));
      if (sameTopologyFamily) {
        // 1. Trigger expanding ripple on newly active, queued, or visited nodes
        for (const node of visual.nodes) {
          const prevState = prev.nodes.get(node.id)?.state;
          const nextState = node.state;
          if (
            nextState &&
            nextState !== "default" &&
            nextState !== "dim" &&
            nextState !== prevState
          ) {
            const spotEl = svg.querySelector<SVGGraphicsElement>(`[data-spot-node="${CSS.escape(node.id)}"]`);
            if (spotEl && typeof spotEl.animate === "function") {
              for (const anim of spotEl.getAnimations()) anim.cancel();
              spotEl.animate(
                [
                  { opacity: 0.72, transform: "scale(0.9)" },
                  { opacity: 0, transform: "scale(1.68)" },
                ],
                { duration: 280, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
              );
            }
          }
        }

        // 2. Glide runner orb along the primary newly activated edge
        let runnerEdge: (typeof visual.edges)[number] | null = null;
        for (let i = 0; i < visual.edges.length; i++) {
          const e = visual.edges[i];
          const prevEdgeState = prev.edges.get(`${e.from}->${e.to}#${i}`);
          if (e.state === "active" && prevEdgeState !== "active") {
            runnerEdge = e;
            break;
          }
        }
        if (runnerEdge && runner && typeof runner.animate === "function") {
          const fromN = nodeMap.get(runnerEdge.from);
          const toN = nodeMap.get(runnerEdge.to);
          if (fromN && toN) {
            for (const anim of runner.getAnimations()) anim.cancel();
            const sx = mapX(fromN.x);
            const sy = mapY(fromN.y);
            const ex = mapX(toN.x);
            const ey = mapY(toN.y);
            runner.animate(
              [
                { opacity: 0, transform: `translate(${sx}px, ${sy}px) scale(0.75)` },
                { opacity: 1, transform: `translate(${sx + (ex - sx) * 0.25}px, ${sy + (ey - sy) * 0.25}px) scale(1.08)`, offset: 0.25 },
                { opacity: 1, transform: `translate(${ex}px, ${ey}px) scale(1)`, offset: 0.82 },
                { opacity: 0, transform: `translate(${ex}px, ${ey}px) scale(1.3)` },
              ],
              { duration: 270, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
            );
          }
        }
      }
    }

    prevGraphRef.current = { nodes: nextNodes, edges: nextEdges };
  });

  const pickedNode = selectedNodeId ? nodeMap.get(selectedNodeId) : null;
  const pickedChildren = pickedNode
    ? visual.edges
        .filter((e) => e.from === pickedNode.id || (!e.directed && e.to === pickedNode.id))
        .map((e) => nodeMap.get(e.from === pickedNode.id ? e.to : e.from)?.label)
        .filter(Boolean)
    : [];

  return (
    <div className="dsa-visual-wrap">
      <div className="visual-svg-wrap">
        <div className="dsa-graph-stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${w} ${h}`}
          className="visual-svg dsa-graph-svg"
          role="img"
          aria-label={visual.caption ?? "Interactive tree or graph diagram"}
        >
          <defs>
            <pattern id={gridId} width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.9" className="svg-grid-dot" />
            </pattern>
            <pattern id={hatchActiveId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
              <rect width="2.2" height="6" className="dsa-hatch-coral" />
            </pattern>
            <pattern id={hatchVisitedId} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
              <rect width="1.8" height="7" className="dsa-hatch-ok" />
            </pattern>
            <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="svg-arrow-head" />
            </marker>
            <marker
              id={arrowActiveId}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="dsa-arrow-coral" />
            </marker>
          </defs>

          <rect x="0" y="0" width={w} height={h} rx="10" className="dsa-canvas-bg" />
          <rect x="0" y="0" width={w} height={h} fill={`url(#${gridId})`} />

          {visual.edges.map((edge, idx) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const x1 = mapX(from.x);
            const y1 = mapY(from.y);
            const x2 = mapX(to.x);
            const y2 = mapY(to.y);
            const fromBox = getNodeBox(from.label);
            const toBox = getNodeBox(to.label);
            const touchesPicked =
              selectedNodeId && (edge.from === selectedNodeId || (!edge.directed && edge.to === selectedNodeId));
            const edgeCls =
              touchesPicked || edge.state === "active"
                ? "is-active"
                : edge.state === "dim"
                  ? "is-dim"
                  : "";
            const markerEnd = edge.directed
              ? edgeCls === "is-active"
                ? `url(#${arrowActiveId})`
                : `url(#${arrowId})`
              : undefined;
            const pillCompact = (edge.weight?.length ?? 0) > 6;
            const pillW = edge.weight
              ? Math.max(20, Math.min(82, edge.weight.length * (pillCompact ? 5.7 : 6.2) + 9))
              : 0;

            if (edge.from === edge.to) {
              const loopDir = y1 < h * 0.45 ? -1 : 1;
              const startX = x1 - 10;
              const endX = x1 + 10;
              const anchorY = y1 + loopDir * fromBox.halfH;
              const apexY = y1 + loopDir * (fromBox.halfH + 34);
              const d = `M ${startX} ${anchorY} C ${x1 - 24} ${apexY}, ${x1 + 24} ${apexY}, ${endX} ${anchorY + loopDir * 3}`;
              const labelY = y1 + loopDir * (fromBox.halfH + 26);
              return (
                <g key={`${edge.from}-${edge.to}-${idx}`}>
                  <path d={d} className={`dsa-graph-edge ${edgeCls}`} markerEnd={markerEnd} />
                  {edge.weight && (
                    <g>
                      <rect x={x1 - pillW / 2} y={labelY - 8} width={pillW} height="16" rx="4" className="dsa-weight-pill" />
                      <text x={x1} y={labelY + 3.5} textAnchor="middle" className={`dsa-arr-idx tabular ${pillCompact ? "is-compact" : ""}`}>
                        {edge.weight}
                      </text>
                    </g>
                  )}
                </g>
              );
            }

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.max(1, Math.hypot(dx, dy));
            const ux = dx / len;
            const uy = dy / len;
            const startOff = borderDist(fromBox.halfW, fromBox.halfH, fromBox.isPill, ux, uy);
            const endOff = borderDist(toBox.halfW, toBox.halfH, toBox.isPill, ux, uy) + (edge.directed ? 4 : 0);
            const sx = x1 + ux * startOff;
            const sy = y1 + uy * startOff;
            const ex = x2 - ux * endOff;
            const ey = y2 - uy * endOff;

            const hasReverse = visual.edges.some(
              (other, oIdx) => oIdx !== idx && other.from === edge.to && other.to === edge.from,
            );

            if (hasReverse) {
              const perpX = -uy;
              const perpY = ux;
              const curveOffset = 22;
              const qx = (sx + ex) / 2 + perpX * curveOffset;
              const qy = (sy + ey) / 2 + perpY * curveOffset;
              const mx = 0.25 * sx + 0.5 * qx + 0.25 * ex;
              const my = 0.25 * sy + 0.5 * qy + 0.25 * ey;
              return (
                <g key={`${edge.from}-${edge.to}-${idx}`}>
                  <path
                    d={`M ${sx} ${sy} Q ${qx} ${qy} ${ex} ${ey}`}
                    className={`dsa-graph-edge ${edgeCls}`}
                    markerEnd={markerEnd}
                  />
                  {edge.weight && (
                    <g>
                      <rect x={mx - pillW / 2} y={my - 8} width={pillW} height="16" rx="4" className="dsa-weight-pill" />
                      <text x={mx} y={my + 3.5} textAnchor="middle" className={`dsa-arr-idx tabular ${pillCompact ? "is-compact" : ""}`}>
                        {edge.weight}
                      </text>
                    </g>
                  )}
                </g>
              );
            }

            const pillT = to.badge && dy > 20 ? 0.36 : 0.5;
            const mx = sx + (ex - sx) * pillT;
            const my = sy + (ey - sy) * pillT;
            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                <line
                  x1={sx}
                  y1={sy}
                  x2={ex}
                  y2={ey}
                  className={`dsa-graph-edge ${edgeCls}`}
                  markerEnd={markerEnd}
                />
                {edge.weight && (
                  <g>
                    <rect x={mx - pillW / 2} y={my - 8} width={pillW} height="16" rx="4" className="dsa-weight-pill" />
                    <text x={mx} y={my + 3.5} textAnchor="middle" className={`dsa-arr-idx tabular ${pillCompact ? "is-compact" : ""}`}>
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {visual.nodes.map((node) => {
            const cx = mapX(node.x);
            const cy = mapY(node.y);
            const { isPill, halfW, halfH } = getNodeBox(node.label);
            const isPicked = selectedNodeId === node.id;
            const stateCls = node.state && node.state !== "default" ? `is-${node.state}` : "";
            const badgeCompact = (node.badge?.length ?? 0) > 10;
            const badgeW = node.badge
              ? Math.max(24, Math.min(92, node.badge.length * (badgeCompact ? 5.6 : 6.1) + 10))
              : 0;
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={isPicked}
                aria-label={`Inspect node ${node.label}`}
                style={{ transform: `translate(${cx}px, ${cy}px)` }}
                className={`dsa-anim-group is-interactive ${stateCls}`}
                onClick={() =>
                  setNodePick({ forVisual: visual, id: selectedNodeId === node.id ? null : node.id })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setNodePick({ forVisual: visual, id: selectedNodeId === node.id ? null : node.id });
                  }
                }}
              >
                <ellipse
                  cx={0}
                  cy={halfH + 4}
                  rx={halfW * 0.78}
                  ry={4.5}
                  className={`dsa-node-ground-shadow ${stateCls}`}
                />
                <circle
                  cx={0}
                  cy={0}
                  r={isPill ? halfH : circleR}
                  data-spot-node={node.id}
                  className={`dsa-node-spot ${stateCls}`}
                />
                {isPill ? (
                  <>
                    <rect
                      x={-halfW}
                      y={-halfH}
                      width={halfW * 2}
                      height={halfH * 2}
                      rx={halfH}
                      className={`dsa-graph-node ${stateCls} ${isPicked ? "is-user-picked" : ""}`}
                    />
                    {(node.state === "active" || node.state === "visited") && (
                      <rect
                        x={-halfW + 1}
                        y={-halfH + 1}
                        width={halfW * 2 - 2}
                        height={halfH * 2 - 2}
                        rx={halfH - 1}
                        fill={`url(#${node.state === "active" ? hatchActiveId : hatchVisitedId})`}
                        className="dsa-node-hatch"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <circle
                      cx={0}
                      cy={0}
                      r={circleR}
                      className={`dsa-graph-node ${stateCls} ${isPicked ? "is-user-picked" : ""}`}
                    />
                    {(node.state === "active" || node.state === "visited") && (
                      <circle
                        cx={0}
                        cy={0}
                        r={circleR - 1.5}
                        fill={`url(#${node.state === "active" ? hatchActiveId : hatchVisitedId})`}
                        className="dsa-node-hatch"
                      />
                    )}
                  </>
                )}
                <text
                  x={0}
                  y={4}
                  textAnchor="middle"
                  className={`dsa-graph-label ${isPill ? "is-compact" : ""} ${stateCls}`}
                >
                  {node.label}
                </text>
                {node.badge && (
                  <g
                    key={`${node.id}-${node.badge}`}
                    className={`dsa-badge-group ${stateCls}`}
                  >
                    <rect
                      x={-badgeW / 2}
                      y={-halfH - 17}
                      width={badgeW}
                      height="15"
                      rx="4"
                      className={`dsa-node-badge ${stateCls}`}
                    />
                    <text
                      x={0}
                      y={-halfH - 6}
                      textAnchor="middle"
                      className={`dsa-node-badge-text tabular ${badgeCompact ? "is-compact" : ""}`}
                    >
                      {node.badge}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          <g ref={runnerRef} className="dsa-runner-orb" aria-hidden="true">
            <circle cx={0} cy={0} r={9} className="dsa-runner-halo" />
            <circle cx={0} cy={0} r={4.5} className="dsa-runner-core" />
          </g>
        </svg>
        </div>
      </div>

      <div className="dsa-inspector-strip tabular">
        {pickedNode ? (
          <span>
            <strong>Node [{pickedNode.label}]</strong>
            {pickedNode.badge ? ` (${pickedNode.badge})` : ""} ·{" "}
            {pickedChildren.length > 0
              ? `${hasDirectedEdges ? "Outgoing" : "Neighbors"}: ${pickedChildren.map((c) => `[${c}]`).join(", ")}`
              : hasDirectedEdges
                ? "Leaf / terminal node (0 outgoing edges)"
                : "Isolated node (0 incident edges)"}
          </span>
        ) : (
          <span>Select a node to inspect its connections.</span>
        )}
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

/**
 * 5. Dynamic Programming 2D Table Grid
 */
export function DsaDpGridView({ visual }: { visual: DsaDpGridVisual }) {
  const [cellPick, setCellPick] = useState<{ forVisual: DsaDpGridVisual; r: number; c: number } | null>(null);
  const picked = cellPick?.forVisual === visual ? cellPick : null;
  const cellMap = new Map(visual.cells.map((c) => [`${c.r}:${c.c}`, c]));
  const pickedCell = picked ? cellMap.get(`${picked.r}:${picked.c}`) : null;

  return (
    <div className="visual-svg-wrap dsa-dp-wrap">
      <div className="ref-table-scroll">
        <table className="dsa-dp-table" aria-label={visual.caption ?? "Dynamic programming table"}>
          <thead>
            <tr>
              <th scope="col" className="dsa-dp-corner" />
              {visual.colHeaders.map((ch, cIdx) => (
                <th key={cIdx} scope="col" className="tabular">
                  {ch}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visual.rowHeaders.map((rh, rIdx) => (
              <tr key={rIdx}>
                <th scope="row" className="dsa-dp-rowhead">
                  {rh}
                </th>
                {visual.colHeaders.map((_, cIdx) => {
                  const cell = cellMap.get(`${rIdx}:${cIdx}`);
                  const cls = cell?.state && cell.state !== "default" ? `is-${cell.state}` : "";
                  const isPicked = picked?.r === rIdx && picked?.c === cIdx;
                  const animPop = cell?.state === "active" || cell?.state === "optimal" || cell?.state === "source";
                  return (
                    <td key={cIdx} className={`dsa-dp-cell tabular ${cls} ${isPicked ? "is-user-picked" : ""}`}>
                      <button
                        type="button"
                        aria-pressed={isPicked}
                        className="dsa-dp-cell-btn"
                        aria-label={`Inspect cell ${rh}, ${visual.colHeaders[cIdx]}: ${cell?.value ?? "unset"}`}
                        onClick={() => setCellPick({ forVisual: visual, r: rIdx, c: cIdx })}
                      >
                        <span
                          key={`${rIdx}-${cIdx}-${cell?.value ?? ""}-${cell?.state ?? ""}`}
                          className={`dsa-dp-val ${animPop ? "is-pop" : ""}`}
                        >
                          {cell?.value ?? "·"}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dsa-inspector-strip tabular">
        {picked ? (
          <span>
            <strong>
              [{visual.rowHeaders[picked.r]}, {visual.colHeaders[picked.c]}] = {pickedCell?.value ?? "unset"}
            </strong>
            {pickedCell?.state ? ` · state: ${pickedCell.state}` : ""}
          </span>
        ) : (
          <span>Select a table cell to inspect its state and value.</span>
        )}
      </div>
      {visual.formulaNote && <p className="dsa-dp-note">{renderInlineRich(visual.formulaNote)}</p>}
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

/**
 * 6. Grouped Divide & Conquer / Merge-Tree Level Visualizer
 * Keeps split subarrays physically separated into distinct groups instead of flat rows.
 */
export function DsaDivideView({ visual }: { visual: DsaDivideVisual }) {
  const divideRef = useRef<HTMLDivElement>(null);
  const [groupPick, setGroupPick] = useState<{
    forVisual: DsaDivideVisual;
    lIdx: number;
    gIdx: number;
  } | null>(null);
  const picked = groupPick?.forVisual === visual ? groupPick : null;
  const pickedGroup = picked ? visual.levels[picked.lIdx]?.groups[picked.gIdx] : null;
  const pickedLevel = picked ? visual.levels[picked.lIdx] : null;

  useFlipMotion(divideRef, visual);

  return (
    <div className="visual-svg-wrap dsa-visual-wrap">
      <div ref={divideRef} className="dsa-divide-board">
        {visual.levels.map((level, lIdx) => (
          <div key={lIdx} className="dsa-divide-level">
            <div className="dsa-divide-label">{level.label}</div>
            <div className="dsa-divide-groups">
              {level.groups.map((grp, gIdx) => {
                const stateCls = grp.state && grp.state !== "default" ? `is-${grp.state}` : "";
                const isPicked = picked?.lIdx === lIdx && picked?.gIdx === gIdx;
                return (
                  <button
                    key={gIdx}
                    type="button"
                    aria-pressed={isPicked}
                    className={`dsa-subarray-box ${stateCls} ${isPicked ? "is-user-picked" : ""}`}
                    onClick={() => setGroupPick({ forVisual: visual, lIdx, gIdx })}
                  >
                    {(grp.label || grp.pointerLabel) && (
                      <span className="dsa-subarray-head tabular">
                        {grp.label ?? grp.pointerLabel}
                      </span>
                    )}
                    <span className="dsa-sub-cells">
                      {grp.values.map((val, vIdx) => {
                        const isPtr = grp.pointerIndex === vIdx;
                        const flipId = grp.cellIds?.[vIdx];
                        return (
                          <span
                            key={flipId ?? vIdx}
                            data-flip-key={flipId}
                            className={`dsa-sub-cell tabular ${isPtr ? "is-pointer" : ""}`}
                          >
                            {val}
                          </span>
                        );
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="dsa-inspector-strip tabular">
        {pickedGroup && pickedLevel ? (
          <span>
            <strong>
              {pickedLevel.label} [{pickedGroup.values.join(", ")}]
            </strong>
            {pickedGroup.note ? ` · ${pickedGroup.note}` : ` · ${pickedGroup.values.length} items`}
          </span>
        ) : (
          <span>Select a subarray block to inspect its split or merge state.</span>
        )}
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}
