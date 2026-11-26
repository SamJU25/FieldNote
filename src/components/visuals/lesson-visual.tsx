"use client";

import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/icon";
import {
  DsaArraySvg,
  DsaDivideView,
  DsaDpGridView,
  DsaGraphSvg,
  DsaGrowthSvg,
  DsaStructureSvg,
} from "@/components/visuals/dsa-visuals";
import {
  AsyncTimelineLab,
  LoopStepper,
  OperatorLab,
  RegexLab,
  SliceExplorer,
  TypeCastLab,
} from "@/components/visuals/interactive-labs";
import { ObjectModelLab, ParamLab } from "@/components/visuals/explorable-labs";
import { LineCodePanel, handleTabKeyDown, renderInlineRich } from "@/components/visuals/rich-text";
import type {
  ComparisonVisual,
  ComplexityVisual,
  ExecutionTraceVisual,
  InteractiveWidgetVisual,
  LessonVisual,
  MemoryBoxesVisual,
  PipelineFlowVisual,
} from "@/lib/lesson-types";

type MemorySimVisual = Extract<InteractiveWidgetVisual, { kind: "memory-sim" }>;

function PipelineFlowSvg({ visual }: { visual: PipelineFlowVisual }) {
  const uid = useId();
  const arrowId = `${uid}-arrow`;
  const arrowActiveId = `${uid}-arrow-active`;
  const gridId = `${uid}-dot-grid`;

  const count = Math.max(1, visual.nodes.length);
  const nodeW = visual.nodes.reduce(
    (maxW, node) =>
      Math.max(
        maxW,
        Math.ceil(node.label.length * 8 + 26),
        Math.ceil((node.sublabel?.length ?? 0) * 6.5 + 24),
      ),
    144,
  );
  const gap = 82;
  const totalW = Math.max(460, count * nodeW + (count - 1) * gap + 48);
  const startX = (totalW - (count * nodeW + (count - 1) * gap)) / 2;
  const coords = new Map<string, { idx: number; x: number; y: number }>();
  visual.nodes.forEach((node, idx) => {
    coords.set(node.id, { idx, x: startX + idx * (nodeW + gap), y: 74 });
  });

  const hasNonAdjacentLinks = visual.links.some((link) => {
    const f = coords.get(link.from);
    const t = coords.get(link.to);
    return f && t && (t.idx < f.idx || Math.abs(t.idx - f.idx) > 1);
  });
  const viewH = hasNonAdjacentLinks ? 228 : 206;

  return (
    <div className="visual-svg-wrap">
      <div
        className="visual-svg-stage"
        style={{ maxWidth: `${totalW}px` }}
      >
        <svg
          viewBox={`0 0 ${totalW} ${viewH}`}
          className="visual-svg"
          role="img"
          aria-label={visual.caption ?? "System flow diagram"}
        >
        <defs>
          <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" className="svg-grid-dot" />
          </pattern>
          <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="svg-arrow-head" />
          </marker>
          <marker id={arrowActiveId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="svg-arrow-head-active" />
          </marker>
        </defs>

        <rect x="0" y="0" width={totalW} height={viewH} fill={`url(#${gridId})`} />

        {visual.links.map((link, idx) => {
          const from = coords.get(link.from);
          const to = coords.get(link.to);
          if (!from || !to) return null;
          const isBackwardOrJump = to.idx < from.idx || Math.abs(to.idx - from.idx) > 1;
          const marker = link.active ? `url(#${arrowActiveId})` : `url(#${arrowId})`;

          if (isBackwardOrJump) {
            const x1 = from.x + nodeW / 2;
            const x2 = to.x + nodeW / 2;
            const isBack = to.idx < from.idx;
            const anchorY = isBack ? from.y + 68 : from.y;
            const controlY = isBack ? anchorY + 46 : anchorY - 46;
            const d = `M ${x1} ${anchorY} Q ${(x1 + x2) / 2} ${controlY}, ${x2} ${isBack ? anchorY + 4 : anchorY - 4}`;
            const labelY = isBack ? anchorY + 34 : anchorY - 30;
            return (
              <g key={`${link.from}-${link.to}-${idx}`}>
                <path
                  d={d}
                  fill="none"
                  className={link.active ? "svg-edge-active" : "svg-edge"}
                  markerEnd={marker}
                />
                {link.label && (
                  <text x={(x1 + x2) / 2} y={labelY} textAnchor="middle" className={link.active ? "svg-edge-label active" : "svg-edge-label"}>
                    {link.label}
                  </text>
                )}
              </g>
            );
          }

          const x1 = from.x + nodeW;
          const x2 = to.x - 4;
          const y = from.y + 34;
          return (
            <g key={`${link.from}-${link.to}-${idx}`}>
              <line
                x1={x1}
                y1={y}
                x2={x2}
                y2={y}
                className={link.active ? "svg-edge-active" : "svg-edge"}
                markerEnd={marker}
              />
              {link.label && (
                <text x={(x1 + x2) / 2} y={y - 10} textAnchor="middle" className={link.active ? "svg-edge-label active" : "svg-edge-label"}>
                  {link.label}
                </text>
              )}
            </g>
          );
        })}

        {visual.nodes.map((node) => {
          const pos = coords.get(node.id)!;
          return (
            <g key={node.id} className={`svg-node ${node.active ? "is-active" : ""} tone-${node.tone ?? "accent"}`}>
              <rect x={pos.x} y={pos.y} width={nodeW} height={68} rx={10} className="svg-node-box" />
              <text x={pos.x + nodeW / 2} y={pos.y + 29} textAnchor="middle" className="svg-node-title">
                {node.label}
              </text>
              {node.sublabel && (
                <text x={pos.x + nodeW / 2} y={pos.y + 49} textAnchor="middle" className="svg-node-sub">
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}
        </svg>
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

function MemoryBoxesSvg({ visual }: { visual: MemoryBoxesVisual }) {
  const uid = useId();
  const arrowId = `${uid}-mem-arrow`;
  const arrowActiveId = `${uid}-mem-arrow-active`;
  const gridId = `${uid}-mem-grid`;

  // Position frames on the left and heap objects on the right with SVG reference arrows.
  const totalBindings = visual.frames.reduce((sum, f) => sum + f.bindings.length + 1, 0);
  const objectsHeight = visual.objects.reduce((sum, obj) => sum + (obj.cells ? 92 : 64), 44);
  const height = Math.max(230, Math.max(totalBindings * 42 + 44, objectsHeight + 20));
  const frameW = visual.frames.reduce(
    (maxW, frame) =>
      frame.bindings.reduce(
        (m, b) => Math.max(m, Math.ceil(b.label.length * 7.8 + 46)),
        Math.max(maxW, Math.ceil(frame.name.length * 7.2 + 28)),
      ),
    210,
  );
  const bindingW = frameW - 26;
  const pinX = 22 + frameW - 14;
  const arrowStartX = 22 + frameW - 2;
  const objStartX = 22 + frameW + 124;

  const objectWidths = visual.objects.map((obj) => {
    const headerW = Math.ceil((obj.typeLabel.length + (obj.mutable ? 10 : 12)) * 6.4 + 28);
    if (obj.cells) {
      const cellW = obj.cells.reduce(
        (mW, c) => Math.max(mW, Math.ceil(String(c.value).length * 8.2 + 16), Math.ceil(String(c.index).length * 6.6 + 14)),
        46,
      );
      const cellPitch = cellW + 4;
      const boxW = Math.max(220, headerW, obj.cells.length * cellPitch + 20);
      return { boxW, cellW, cellPitch };
    }
    const valW = Math.ceil(String(obj.value ?? "").length * 8.2 + 28);
    return { boxW: Math.max(236, headerW, valW), cellW: 46, cellPitch: 50 };
  });
  const maxObjW = objectWidths.reduce((mW, item) => Math.max(mW, item.boxW), 236);
  const width = Math.max(620, objStartX + maxObjW + 24);

  const bindingAnchors: Array<{ key: string; x: number; y: number; targetId: string; highlight?: boolean }> = [];
  const objectAnchors = new Map<string, { x: number; y: number }>();

  const frameBlocks = visual.frames.reduce<
    Array<{
      name: string;
      startY: number;
      endY: number;
      rows: Array<{ label: string; targetId: string; highlight?: boolean; y: number }>;
      nextY: number;
    }>
  >((acc, frame) => {
    const startY = acc.length === 0 ? 52 : acc[acc.length - 1].nextY;
    const rowsStartY = startY + 28;
    const rows = frame.bindings.map((b, i) => {
      const y = rowsStartY + i * 38;
      bindingAnchors.push({ key: `${frame.name}:${b.label}`, x: arrowStartX, y: y + 15, targetId: b.targetId, highlight: b.highlight });
      return { ...b, y };
    });
    const nextY = rowsStartY + frame.bindings.length * 38 + 20;
    acc.push({ name: frame.name, startY, endY: nextY - 12, rows, nextY });
    return acc;
  }, []);

  const objectBlocks = visual.objects.reduce<Array<(typeof visual.objects)[number] & { y: number }>>(
    (acc, obj) => {
      const prev = acc[acc.length - 1];
      const y = prev ? prev.y + (prev.cells ? 92 : 64) : 44;
      objectAnchors.set(obj.id, { x: objStartX, y: y + 28 });
      acc.push({ ...obj, y });
      return acc;
    },
    [],
  );

  return (
    <div className="visual-svg-wrap">
      <div
        className="visual-svg-stage"
        style={{ maxWidth: `${width}px` }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="visual-svg" role="img" aria-label={visual.caption ?? "Python names and objects memory model"}>
        <defs>
          <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" className="svg-grid-dot" />
          </pattern>
          <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="svg-arrow-head" />
          </marker>
          <marker id={arrowActiveId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="svg-arrow-head-active" />
          </marker>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill={`url(#${gridId})`} />

        <text x={24} y={24} className="svg-section-label">Frames (names)</text>
        <text x={objStartX} y={24} className="svg-section-label">Objects in memory</text>

        {frameBlocks.map((fb) => (
          <g key={fb.name}>
            <rect x={22} y={fb.startY} width={frameW} height={Math.max(54, fb.endY - fb.startY)} rx={10} className="svg-frame-box" />
            <text x={34} y={fb.startY + 19} className="svg-frame-title">{fb.name}</text>
            {fb.rows.map((r) => (
              <g key={`${fb.name}-${r.label}`} className={r.highlight ? "is-active" : ""}>
                <rect x={34} y={r.y} width={bindingW} height={30} rx={6} className={r.highlight ? "svg-binding-box active" : "svg-binding-box"} />
                <text x={46} y={r.y + 19} className="svg-mono-label">{r.label}</text>
                <circle cx={pinX} cy={r.y + 15} r={3.5} className={r.highlight ? "svg-pin active" : "svg-pin"} />
              </g>
            ))}
          </g>
        ))}

        {bindingAnchors.map((from) => {
          const to = objectAnchors.get(from.targetId);
          if (!to) return null;
          const midX = (from.x + to.x) / 2;
          const pathD = `M ${from.x - 10} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 6} ${to.y}`;
          return (
            <path
              key={from.key}
              d={pathD}
              fill="none"
              className={from.highlight ? "svg-edge-active" : "svg-edge"}
              markerEnd={from.highlight ? `url(#${arrowActiveId})` : `url(#${arrowId})`}
            />
          );
        })}

        {objectBlocks.map((obj, oIdx) => {
          const dims = objectWidths[oIdx] ?? { boxW: 236, cellW: 46, cellPitch: 50 };
          return (
            <g
              key={obj.id}
              className={`svg-object-group ${obj.highlight ? "is-active" : ""}`}
              style={{ transform: `translateY(${obj.y}px)` }}
            >
              {obj.cells ? (
                <>
                  <rect
                    x={objStartX}
                    y={0}
                    width={dims.boxW}
                    height={78}
                    rx={10}
                    className={obj.highlight ? "svg-object-box active" : "svg-object-box"}
                  />
                  <text x={objStartX + 12} y={17} className="svg-type-pill">
                    {obj.typeLabel}{obj.mutable ? " · mutable" : " · immutable"}
                  </text>
                  {obj.cells.map((cell, ci) => {
                    const cx = objStartX + 12 + ci * dims.cellPitch;
                    const mid = cx + dims.cellW / 2;
                    return (
                      <g key={`${obj.id}-${cell.index}-${ci}`}>
                        <rect
                          x={cx}
                          y={24}
                          width={dims.cellW}
                          height={28}
                          rx={5}
                          className={cell.active ? "svg-cell active" : cell.dim ? "svg-cell dim" : "svg-cell"}
                        />
                        <text
                          key={`${obj.id}-${cell.index}-${cell.value}`}
                          x={mid}
                          y={42}
                          textAnchor="middle"
                          className={`svg-mono-value ${cell.active ? "svg-val-settle" : ""}`}
                        >
                          {cell.value}
                        </text>
                        <text x={mid} y={68} textAnchor="middle" className="svg-cell-index">
                          {cell.index}
                        </text>
                      </g>
                    );
                  })}
                </>
              ) : (
                <>
                  <rect
                    x={objStartX}
                    y={0}
                    width={dims.boxW}
                    height={52}
                    rx={10}
                    className={obj.highlight ? "svg-object-box active" : "svg-object-box"}
                  />
                  <text x={objStartX + 12} y={18} className="svg-type-pill">
                    {obj.typeLabel}{obj.mutable ? " · mutable" : ""}
                  </text>
                  <text
                    key={`${obj.id}-${obj.value}`}
                    x={objStartX + 12}
                    y={39}
                    className={`svg-mono-value ${obj.highlight ? "svg-val-settle" : ""}`}
                  >
                    {obj.value}
                  </text>
                </>
              )}
            </g>
          );
        })}
        </svg>
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

function ExecutionTraceView({ visual }: { visual: ExecutionTraceVisual }) {
  return (
    <div className="trace-visual-box">
      {visual.iteration && <div className="trace-iteration-tag">{visual.iteration}</div>}
      <div className="trace-branch-list">
        {visual.branches.map((branch) => (
          <div key={branch.id} className={`trace-branch status-${branch.status}`}>
            <span className="trace-branch-dot" />
            <span className="trace-branch-label">{renderInlineRich(branch.label)}</span>
            <span className="trace-branch-state">{branch.status}</span>
          </div>
        ))}
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

function ComplexityView({ visual }: { visual: ComplexityVisual }) {
  return (
    <div className="complexity-visual-box">
      <div className="complexity-head">Input size: <strong>{visual.inputSizeLabel}</strong></div>
      <div className="complexity-bars">
        {visual.bars.map((bar) => {
          const pct = Math.max(4, Math.min(100, Math.round((bar.steps / Math.max(1, bar.maxSteps)) * 100)));
          return (
            <div key={bar.label} className={`complexity-row ${bar.active ? "is-active" : ""}`}>
              <div className="complexity-label">
                <code>{bar.formula}</code>
                <span>{bar.label}</span>
              </div>
              <div className="complexity-track">
                <div className="complexity-fill" style={{ transform: `scaleX(${(pct / 100).toFixed(4)})` }} />
              </div>
              <span className="complexity-steps tabular">{bar.steps} steps</span>
            </div>
          );
        })}
      </div>
      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

function ComparisonView({ visual }: { visual: ComparisonVisual }) {
  return (
    <div className="compare-visual-box">
      <div className="compare-grid">
        <div className="compare-col-head">{visual.leftTitle}</div>
        <div className="compare-col-head">{visual.rightTitle}</div>
        {visual.rows.map((row, idx) => (
          <div key={idx} className={`compare-row ${row.highlight ? "is-active" : ""}`}>
            <div className="compare-cell"><code>{row.left}</code></div>
            <div className="compare-cell">
              <code>{row.right}</code>
              {row.note && <small>{renderInlineRich(row.note)}</small>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemorySimView({ visual }: { visual: MemorySimVisual }) {
  const tabBaseId = useId();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenario = visual.scenarios[Math.min(scenarioIdx, Math.max(0, visual.scenarios.length - 1))];
  const totalSteps = scenario?.steps.length ?? 0;
  const safeStep = Math.min(stepIdx, Math.max(0, totalSteps - 1));
  const step = scenario?.steps[safeStep];

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, reduced ? 1600 : 1350);
    return () => window.clearInterval(timer);
  }, [isPlaying, totalSteps]);

  if (!scenario || !step) return null;

  const progressPct = totalSteps <= 1 ? 1 : (safeStep + 1) / totalSteps;

  return (
    <div className="interactive-lab">
      <div className="lab-header">
        <span className="lab-title">
          Memory simulator · <span className="tabular">{safeStep + 1} / {totalSteps}</span>
        </span>
        {visual.scenarios.length > 1 && (
          <div className="lab-pill-row" role="tablist" aria-label="Memory scenarios">
            {visual.scenarios.map((sc, i) => {
              const selected = i === scenarioIdx;
              return (
                <button
                  key={sc.label}
                  id={`${tabBaseId}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${tabBaseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={`lab-pill-btn ${selected ? "is-active" : ""}`}
                  onClick={() => {
                    setIsPlaying(false);
                    setScenarioIdx(i);
                    setStepIdx(0);
                  }}
                  onKeyDown={(e) =>
                    handleTabKeyDown(e, i, visual.scenarios.length, (next) => {
                      setIsPlaying(false);
                      setScenarioIdx(next);
                      setStepIdx(0);
                    })
                  }
                >
                  {sc.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {totalSteps > 1 && (
        <div className="lab-progress-rail" aria-hidden="true">
          <div className="lab-progress-fill" style={{ transform: `scaleX(${progressPct})` }} />
        </div>
      )}

      <div
        id={`${tabBaseId}-panel`}
        role="tabpanel"
        aria-labelledby={visual.scenarios.length > 1 ? `${tabBaseId}-tab-${scenarioIdx}` : undefined}
        className="lab-panel-body"
      >
        {totalSteps > 1 && (
          <div className="mem-transport-bar">
            <div className="loop-transport">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={safeStep === 0}
                onClick={() => {
                  setIsPlaying(false);
                  setStepIdx((s) => Math.max(0, s - 1));
                }}
              >
                Prev
              </button>
              <button
                type="button"
                className={`btn btn-sm ${isPlaying ? "btn-primary" : "btn-secondary"}`}
                onClick={() => {
                  if (!isPlaying && safeStep >= totalSteps - 1) setStepIdx(0);
                  setIsPlaying((p) => !p);
                }}
              >
                <Icon name={isPlaying ? "pause" : "play"} size={13} />
                <span>{isPlaying ? "Pause" : "Auto-step"}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={safeStep >= totalSteps - 1}
                onClick={() => {
                  setIsPlaying(false);
                  setStepIdx((s) => Math.min(totalSteps - 1, s + 1));
                }}
              >
                Next
              </button>
            </div>
            <div className="lab-pill-row" role="group" aria-label="Memory scenario steps">
              {scenario.steps.map((st, i) => (
                <button
                  key={`mem-step-${i}`}
                  type="button"
                  aria-pressed={i === safeStep}
                  aria-label={`Step ${i + 1}: line ${st.line}`}
                  className={`lab-pill-btn mono ${i === safeStep ? "is-active" : ""}`}
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx(i);
                  }}
                >
                  L{st.line}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mem-sim-stage">
          <LineCodePanel
            lines={scenario.code}
            activeLines={[step.line]}
            variant="mini"
          />

          <div className="loop-state-panel">
            <MemoryBoxesSvg
              visual={{
                kind: "memory",
                frames: step.frames,
                objects: step.objects,
              }}
            />
            <p className="lab-note">{renderInlineRich(step.note)}</p>
          </div>
        </div>
      </div>

      {visual.caption && <p className="visual-caption">{renderInlineRich(visual.caption)}</p>}
    </div>
  );
}

export function LessonVisualRenderer({ visual }: { visual: LessonVisual }) {
  switch (visual.kind) {
    case "pipeline":
      return <PipelineFlowSvg visual={visual} />;
    case "memory":
      return <MemoryBoxesSvg visual={visual} />;
    case "trace":
      return <ExecutionTraceView visual={visual} />;
    case "complexity":
      return <ComplexityView visual={visual} />;
    case "compare":
      return <ComparisonView visual={visual} />;
    case "operator-lab":
      return <OperatorLab visual={visual} />;
    case "type-cast-lab":
      return <TypeCastLab visual={visual} />;
    case "slice-explorer":
      return <SliceExplorer visual={visual} />;
    case "loop-stepper":
      return <LoopStepper visual={visual} />;
    case "memory-sim":
      return <MemorySimView visual={visual} />;
    case "async-timeline":
      return <AsyncTimelineLab visual={visual} />;
    case "regex-lab":
      return <RegexLab visual={visual} />;
    case "param-lab":
      return <ParamLab visual={visual} />;
    case "object-model-lab":
      return <ObjectModelLab visual={visual} />;
    case "dsa-growth":
      return <DsaGrowthSvg visual={visual} />;
    case "dsa-array":
      return <DsaArraySvg visual={visual} />;
    case "dsa-structure":
      return <DsaStructureSvg visual={visual} />;
    case "dsa-graph":
      return <DsaGraphSvg visual={visual} />;
    case "dsa-dp-grid":
      return <DsaDpGridView visual={visual} />;
    case "dsa-divide":
      return <DsaDivideView visual={visual} />;
  }
}
