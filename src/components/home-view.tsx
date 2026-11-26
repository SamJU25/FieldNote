"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type HomeViewProps = {
  onBrowseCourses: () => void;
  onOpenTracker: () => void;
};

const STORY_STEPS = [
  {
    tag: "Concept guides",
    title: "Mental models before syntax",
    body: "Each lesson pairs plain explanations with an execution diagram and edge-case notes.",
  },
  {
    tag: "Execution traces",
    title: "Inspect every state change step by step",
    body: "Move forward and backward through code execution to watch variables and output update line by line.",
  },
  {
    tag: "Checks & drills",
    title: "Verify intuition before writing code",
    body: "Inline prediction checks expose edge cases early before you open Warmup, Core, and Stretch exercises.",
  },
  {
    tag: "Study tracker",
    title: "Review shaky topics on schedule",
    body: "Flag notes by course, run a focus timer, and log 12 weeks of study minutes.",
  },
] as const;

const PRINCIPLES = [
  {
    title: "No feeds or pop-ups",
    body: "Completed lessons, quiz scores, and study notes stay where you left them.",
  },
  {
    title: "Organized per subject",
    body: "Filter Tracker by course to inspect module completion, quiz scores, and notes separately.",
  },
  {
    title: "Local and exportable",
    body: "No account required. Study logs and notes stay in browser storage and export as JSON.",
  },
] as const;

// 8-point smooth activity curve pre-scaled for Scene 4 preview (260×76 chart area)
const ACTIVITY_CURVE_POINTS = [
  { x: 0, y: 62.1 },
  { x: 36.4, y: 52.9 },
  { x: 72.8, y: 57.5 },
  { x: 109.2, y: 39.1 },
  { x: 145.6, y: 43.7 },
  { x: 182, y: 25.3 },
  { x: 218.4, y: 29.9 },
  { x: 260, y: 11.5 },
] as const;

const ACTIVITY_LINE_PATH = ACTIVITY_CURVE_POINTS.reduce((path, pt, idx, arr) => {
  if (idx === 0) return `M ${pt.x} ${pt.y}`;
  const prev = arr[idx - 1];
  const midX = (prev.x + pt.x) / 2;
  return `${path} C ${midX} ${prev.y}, ${midX} ${pt.y}, ${pt.x} ${pt.y}`;
}, "");

const ACTIVITY_AREA_PATH = `${ACTIVITY_LINE_PATH} L 260 76 L 0 76 Z`;

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Given continuous `stepCursor` in [-0.35, 3.35]:
 * - Integer `i` (0..3) corresponds to Step `i` centered on the reading focal line.
 * - Crossfades happen in [i + 0.62, i + 0.96], so while reading Step `i`
 *   (cursor near `i` .. `i + 0.60`), Scene `i` stays at full opacity and animates
 *   its own internal mechanism!
 */
function getSceneVisibility(cursor: number, index: number): number {
  const fadeIn = index === 0 ? 1 : smoothstep(index - 0.30, index - 0.06, cursor);
  const fadeOut = index === 3 ? 1 : 1 - smoothstep(index + 0.56, index + 0.78, cursor);
  return fadeIn * fadeOut;
}

function getFocalY(stickyStageEl: HTMLDivElement | null): number {
  const vh = window.innerHeight;
  if (window.innerWidth <= 960 && stickyStageEl) {
    const stageRect = stickyStageEl.getBoundingClientRect();
    if (stageRect.bottom > 56 && stageRect.bottom < vh * 0.68) {
      return stageRect.bottom + (vh - stageRect.bottom) * 0.44;
    }
  }
  return vh * 0.5;
}

/**
 * Isolated scroll-driven SVG stage so 60fps cursor updates only re-render the canvas,
 * keeping HomeView hero, principles, and chapter narrative idle during scroll.
 */
function HomeStoryCanvas({
  stepRefs,
  progressBarRef,
  stickyStageRef,
  activeIdx,
  onActiveIdxChange,
  onJumpToStep,
}: {
  stepRefs: RefObject<Array<HTMLElement | null>>;
  progressBarRef: RefObject<HTMLDivElement | null>;
  stickyStageRef: RefObject<HTMLDivElement | null>;
  activeIdx: number;
  onActiveIdxChange: (idx: number) => void;
  onJumpToStep: (idx: number) => void;
}) {
  const [cursor, setCursor] = useState(-0.2);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsScrollTimeline =
      typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()");

    let targetCursor = -0.2;
    let currentCursor = -0.2;
    let rafId = 0;

    const measureTarget = () => {
      if (!reducedMotion && !supportsScrollTimeline && progressBarRef.current) {
        const totalDoc = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const docPct = clamp01(window.scrollY / totalDoc);
        progressBarRef.current.style.transform = `scaleX(${docPct.toFixed(4)})`;
      }

      const nodes = stepRefs.current;
      if (!nodes[0]) return;

      const focalY = getFocalY(stickyStageRef.current);
      const centers = nodes.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + r.height * 0.5;
      });

      const c0 = centers[0] ?? 0;
      const c1 = centers[1] ?? c0 + 300;
      const c2 = centers[2] ?? c1 + 300;
      const c3 = centers[3] ?? c2 + 300;

      if (focalY <= c0) {
        const leadSpan = Math.max(180, window.innerHeight * 0.45);
        targetCursor = -0.35 * clamp01((c0 - focalY) / leadSpan);
      } else if (focalY <= c1) {
        targetCursor = (focalY - c0) / Math.max(1, c1 - c0);
      } else if (focalY <= c2) {
        targetCursor = 1 + (focalY - c1) / Math.max(1, c2 - c1);
      } else if (focalY <= c3) {
        targetCursor = 2 + (focalY - c2) / Math.max(1, c3 - c2);
      } else {
        const tailSpan = Math.max(160, window.innerHeight * 0.35);
        targetCursor = 3 + 0.35 * clamp01((focalY - c3) / tailSpan);
      }
    };

    const tick = () => {
      if (reducedMotion) {
        currentCursor = targetCursor;
      } else {
        const delta = targetCursor - currentCursor;
        if (Math.abs(delta) > 0.001) {
          currentCursor += delta * 0.18;
          rafId = window.requestAnimationFrame(tick);
        } else {
          currentCursor = targetCursor;
          rafId = 0;
        }
      }

      setCursor(currentCursor);

      const nextIdx =
        currentCursor < 0.78
          ? 0
          : currentCursor < 1.78
            ? 1
            : currentCursor < 2.78
              ? 2
              : 3;
      onActiveIdxChange(nextIdx);
    };

    const onScrollOrResize = () => {
      measureTarget();
      if (reducedMotion) {
        tick();
      } else if (rafId === 0) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    measureTarget();
    currentCursor = targetCursor;
    setCursor(currentCursor);
    const initialIdx =
      currentCursor < 0.78 ? 0 : currentCursor < 1.78 ? 1 : currentCursor < 2.78 ? 2 : 3;
    onActiveIdxChange(initialIdx);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [onActiveIdxChange, progressBarRef, stepRefs, stickyStageRef]);

  const vis0 = getSceneVisibility(cursor, 0);
  const vis1 = getSceneVisibility(cursor, 1);
  const vis2 = getSceneVisibility(cursor, 2);
  const vis3 = getSceneVisibility(cursor, 3);

  const p0 = smoothstep(-0.32, 0.42, cursor);
  const p1 = smoothstep(0.75, 1.58, cursor);
  const p2 = smoothstep(1.75, 2.58, cursor);
  const p3 = smoothstep(2.75, 3.25, cursor);

  const traceSubStep = p1 < 0.34 ? 0 : p1 < 0.68 ? 1 : 2;
  const checkSelected = p2 > 0.22;
  const tier1Done = smoothstep(0.2, 0.45, p2);
  const tier2Done = smoothstep(0.45, 0.72, p2);
  const tier3Done = smoothstep(0.72, 0.96, p2);

  const timerRemainingSec = Math.max(0, Math.round((25 - p3 * 6.5) * 60));
  const timerDisplay = `${String(Math.floor(timerRemainingSec / 60)).padStart(2, "0")}:${String(
    timerRemainingSec % 60,
  ).padStart(2, "0")}`;
  const isNoteSolid = p3 > 0.48;
  const chartDraw = smoothstep(0.05, 0.85, p3);
  const activeStepMeta = STORY_STEPS[activeIdx] ?? STORY_STEPS[0];

  return (
    <div className="fn-canvas-sticky" ref={stickyStageRef}>
      <div className="fn-canvas-frame">
        <div className="fn-frame-bar">
          <span className="fn-frame-stage tabular">
            <strong>{activeStepMeta.tag}</strong>
          </span>

          <div className="fn-frame-dots" role="group" aria-label="Jump to stage">
            {STORY_STEPS.map((st, idx) => (
              <button
                key={st.tag}
                type="button"
                aria-label={`Jump to ${st.tag}`}
                aria-current={activeIdx === idx ? "step" : undefined}
                className={`fn-dot-pill ${activeIdx === idx ? "is-active" : ""}`}
                onClick={() => onJumpToStep(idx)}
              />
            ))}
          </div>
        </div>

        <svg
          viewBox="0 0 540 330"
          className="fn-stage-svg"
          role="img"
          aria-label={`${activeStepMeta.tag}: ${activeStepMeta.title}`}
        >
                <defs>
                  <pattern
                    id="fn-dot-grid"
                    width="22"
                    height="22"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" className="fn-svg-grid-dot" />
                  </pattern>
                  <marker
                    id="fn-arrow-accent"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto"
                  >
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fn-svg-arrow-accent" />
                  </marker>
                  <marker
                    id="fn-arrow-muted"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto"
                  >
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fn-svg-arrow-muted" />
                  </marker>
                </defs>

                <rect x="0" y="0" width="540" height="330" fill="url(#fn-dot-grid)" />

                {/* ======================================================== */}
                {/* SCENE 01: STRUCTURED GUIDES                              */}
                {/* Everyday puzzle questions -> Structured Fieldnote model  */}
                {/* ======================================================== */}
                <g
                  style={{
                    opacity: vis0,
                    transform: `translateY(${(1 - vis0) * -10}px)`,
                    pointerEvents: vis0 > 0.2 ? "auto" : "none",
                  }}
                >
                  {/* Left: Everyday beginner questions stacked uniformly */}
                  <g style={{ transform: `translateY(${(1 - p0) * 3}px)` }}>
                    <rect x="24" y="54" width="172" height="50" rx="9" className="fn-svg-card" />
                    <text x="38" y="75" className="fn-svg-label-strong">
                      Up 50%, down 50%
                    </text>
                    <text x="38" y="93" className="fn-svg-sub is-coral">
                      Not back at 100%?
                    </text>

                    <rect x="24" y="122" width="172" height="50" rx="9" className="fn-svg-card" />
                    <text x="38" y="143" className="fn-svg-label-strong">
                      A rises with B
                    </text>
                    <text x="38" y="161" className="fn-svg-sub">
                      Did A cause B?
                    </text>

                    <rect x="24" y="190" width="172" height="50" rx="9" className="fn-svg-card" />
                    <text x="38" y="211" className="fn-svg-label-strong">
                      Twice the items
                    </text>
                    <text x="38" y="229" className="fn-svg-sub">
                      Why 4× slower now?
                    </text>
                  </g>

                  {/* Bridge connector */}
                  <line
                    x1="204"
                    y1="147"
                    x2="226"
                    y2="147"
                    className="fn-svg-connector is-accent"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - clamp01(0.35 + p0 * 0.65)}
                    markerEnd="url(#fn-arrow-accent)"
                  />

                  {/* Right: Structured Fieldnote Concept Card */}
                  <g>
                    <rect
                      x="234"
                      y="40"
                      width="282"
                      height="214"
                      rx="12"
                      className="fn-svg-surface-card is-accent"
                    />
                    <text x="254" y="68" className="fn-svg-mono-accent">
                      Mental model
                    </text>
                    <text x="254" y="92" className="fn-svg-label-strong">
                      Picture the idea first
                    </text>
                    <text x="254" y="111" className="fn-svg-sub">
                      Cause, visual map, and hidden traps
                    </text>

                    {/* Mini structural model: Start -> Rule to result */}
                    <rect x="254" y="126" width="60" height="28" rx="6" className="fn-svg-inner-box" />
                    <text x="284" y="144" textAnchor="middle" className="fn-svg-sub is-ink">
                      Start
                    </text>
                    <line x1="318" y1="140" x2="338" y2="140" className="fn-svg-connector is-accent" />
                    <rect x="342" y="126" width="110" height="28" rx="6" className="fn-svg-inner-box is-ok" />
                    <text x="397" y="144" textAnchor="middle" className="fn-svg-sub is-ink">
                      Rule to result
                    </text>
                    <circle cx="476" cy="140" r="11" className="fn-svg-ok-ring" />
                    <circle cx="476" cy="140" r="4" className="fn-svg-ok-dot" />

                    {/* Highlighted Edge-Case Trap Callout */}
                    <rect
                      x="254"
                      y="174"
                      width="242"
                      height="60"
                      rx="9"
                      className="fn-svg-card is-coral"
                    />
                    <circle cx="272" cy="195" r="4" className="fn-svg-coral-dot" />
                    <text x="284" y="199" className="fn-svg-mono-coral">
                      Watch out
                    </text>
                    <text x="270" y="219" className="fn-svg-sub is-ink">
                      Where edge cases break
                    </text>
                  </g>

                  <text x="270" y="294" textAnchor="middle" className="fn-svg-caption">
                    Structure before syntax
                  </text>
                </g>

                {/* ======================================================== */}
                {/* SCENE 02: INTERACTIVE STEP-THROUGHS                      */}
                {/* Plain-language walkthrough card + state chips + knob     */}
                {/* ======================================================== */}
                <g
                  style={{
                    opacity: vis1,
                    transform: `translateY(${(1 - vis1) * 12}px)`,
                    pointerEvents: vis1 > 0.2 ? "auto" : "none",
                  }}
                >
                  {/* Left: Clean Guided Walkthrough Card */}
                  <rect x="24" y="38" width="286" height="190" rx="12" className="fn-svg-surface-card" />
                  <line x1="24" y1="74" x2="310" y2="74" className="fn-svg-divider" />
                  <text x="42" y="61" className="fn-svg-label-strong">
                    Walkthrough
                  </text>
                  <text x="292" y="61" textAnchor="end" className="fn-svg-mono-accent">
                    Step {traceSubStep + 1} of 3
                  </text>

                  {/* Smooth sliding step highlight */}
                  <g
                    className="fn-svg-line-slider"
                    style={{ transform: `translateY(${traceSubStep * 40}px)` }}
                  >
                    <rect x="30" y="88" width="274" height="32" rx="6" className="fn-svg-step-hl" />
                  </g>

                  {[
                    { num: "1", label: "Set base price to $4", y: 109 },
                    { num: "2", label: "Set quantity to 2", y: 149 },
                    { num: "3", label: "Multiply: price × qty", y: 189 },
                  ].map((ln, lIdx) => (
                    <g key={ln.num}>
                      <text
                        x="42"
                        y={ln.y}
                        className={traceSubStep === lIdx ? "fn-svg-mono-accent" : "fn-svg-mono-xs"}
                      >
                        {ln.num}
                      </text>
                      <text
                        x="64"
                        y={ln.y}
                        className={`fn-svg-sub ${traceSubStep === lIdx ? "is-ink" : ""}`}
                      >
                        {ln.label}
                      </text>
                    </g>
                  ))}

                  {/* Right: Live Values at Step */}
                  <rect x="326" y="38" width="190" height="190" rx="12" className="fn-svg-surface-card" />
                  <text x="344" y="64" className="fn-svg-mono-xs">
                    Values at Step {traceSubStep + 1}
                  </text>

                  {/* Chip 1: Price */}
                  <rect
                    x="344"
                    y="82"
                    width="154"
                    height="36"
                    rx="8"
                    className={`fn-svg-card ${traceSubStep === 0 ? "is-accent" : "is-accent-subtle"}`}
                  />
                  <text x="358" y="105" className="fn-svg-mono-xs">
                    Price
                  </text>
                  <text x="484" y="105" textAnchor="end" className="fn-svg-value-sm">
                    $4
                  </text>

                  {/* Chip 2: Quantity */}
                  <rect
                    x="344"
                    y="128"
                    width="154"
                    height="36"
                    rx="8"
                    className={`fn-svg-card ${
                      traceSubStep === 1 ? "is-accent" : traceSubStep > 1 ? "is-accent-subtle" : ""
                    }`}
                  />
                  <text x="358" y="151" className="fn-svg-mono-xs">
                    Quantity
                  </text>
                  <text
                    x="484"
                    y="151"
                    textAnchor="end"
                    className="fn-svg-value-sm"
                    style={{ opacity: traceSubStep >= 1 ? 1 : 0.35 }}
                  >
                    {traceSubStep >= 1 ? "2" : "—"}
                  </text>

                  {/* Chip 3: Total */}
                  <rect
                    x="344"
                    y="174"
                    width="154"
                    height="36"
                    rx="8"
                    className={`fn-svg-card ${traceSubStep === 2 ? "is-ok" : ""}`}
                  />
                  <text x="358" y="197" className="fn-svg-mono-xs">
                    Total
                  </text>
                  <text
                    x="484"
                    y="197"
                    textAnchor="end"
                    className="fn-svg-value-sm"
                    style={{ opacity: traceSubStep === 2 ? 1 : 0.35 }}
                  >
                    {traceSubStep === 2 ? "$8" : "—"}
                  </text>

                  {/* Tactile Step Scrubber Bar */}
                  <line x1="120" y1="266" x2="420" y2="266" className="fn-svg-track-bg" />
                  <line x1="120" y1="266" x2={120 + p1 * 300} y2="266" className="fn-svg-track-active" />

                  {[
                    { label: "Step 1", x: 120 },
                    { label: "Step 2", x: 270 },
                    { label: "Step 3", x: 420 },
                  ].map((stop, sIdx) => (
                    <g key={stop.label}>
                      <circle
                        cx={stop.x}
                        cy={266}
                        r={4.5}
                        className={traceSubStep >= sIdx ? "fn-svg-accent-dot" : "fn-svg-track-tick"}
                      />
                      <text
                        x={stop.x}
                        y={292}
                        textAnchor="middle"
                        className={`fn-svg-mono-xs ${traceSubStep === sIdx ? "is-strong" : ""}`}
                      >
                        {stop.label}
                      </text>
                    </g>
                  ))}

                  <circle cx={120 + p1 * 300} cy={266} r={8.5} className="fn-svg-knob" />
                </g>

                {/* ======================================================== */}
                {/* SCENE 03: ACTIVE VERIFICATION                            */}
                {/* Plain-language quick check + Warmup -> Core -> Stretch   */}
                {/* ======================================================== */}
                <g
                  style={{
                    opacity: vis2,
                    transform: `translateY(${(1 - vis2) * 12}px)`,
                    pointerEvents: vis2 > 0.2 ? "auto" : "none",
                  }}
                >
                  {/* Top: Quick Predict Card */}
                  <rect x="24" y="34" width="492" height="142" rx="12" className="fn-svg-surface-card" />
                  <text x="44" y="60" className="fn-svg-label-strong">
                    Quick predict check
                  </text>
                  <text x="496" y="60" textAnchor="end" className={checkSelected ? "fn-svg-mono-ok" : "fn-svg-mono-xs"}>
                    {checkSelected ? "Verified" : "Pick your answer"}
                  </text>

                  {/* Friendly plain-English prompt box (no code syntax) */}
                  <rect x="44" y="74" width="212" height="84" rx="8" className="fn-svg-inner-box" />
                  <text x="58" y="96" className="fn-svg-sub">
                    Numbers: 2, 4, 6
                  </text>
                  <text x="58" y="118" className="fn-svg-sub">
                    Double the average
                  </text>
                  <text x="58" y="140" className="fn-svg-sub is-ink">
                    What is the result?
                  </text>

                  {/* Option A */}
                  <rect x="272" y="74" width="224" height="38" rx="8" className="fn-svg-inner-box" />
                  <text x="290" y="98" className="fn-svg-mono-xs">
                    A
                  </text>
                  <text x="314" y="98" className="fn-svg-mono-ink">
                    6
                  </text>

                  {/* Option B (Correct - illuminates on scroll) */}
                  <rect
                    x="272"
                    y="120"
                    width="224"
                    height="38"
                    rx="8"
                    className={checkSelected ? "fn-svg-card is-ok" : "fn-svg-inner-box"}
                  />
                  <circle
                    cx="294"
                    cy="139"
                    r="8.5"
                    className={checkSelected ? "fn-svg-ok-ring" : "fn-svg-node-ring"}
                  />
                  <path
                    d="M 290 139 L 293 142 L 298.5 136"
                    fill="none"
                    className="fn-svg-check-stroke"
                    strokeDasharray="16"
                    strokeDashoffset={checkSelected ? 0 : 16}
                  />
                  <text x="314" y="143" className="fn-svg-mono-ink">
                    8
                  </text>

                  {/* Bottom: 3-Tier Practice Progression */}
                  <text x="26" y="204" className="fn-svg-sub">
                    Progressive practice tiers
                  </text>

                  {[
                    { name: "Warmup", task: "Guided example", x: 24, done: tier1Done },
                    { name: "Core", task: "Apply on your own", x: 194, done: tier2Done },
                    { name: "Stretch", task: "Combine ideas", x: 364, done: tier3Done },
                  ].map((tier) => (
                    <g key={tier.name}>
                      <rect
                        x={tier.x}
                        y={216}
                        width={152}
                        height={76}
                        rx={11}
                        className={`fn-svg-surface-card ${tier.done > 0.65 ? "is-ok" : ""}`}
                      />
                      <circle
                        cx={tier.x + 24}
                        cy={244}
                        r="9.5"
                        className={tier.done > 0.65 ? "fn-svg-ok-ring" : "fn-svg-node-ring"}
                      />
                      <path
                        d={`M ${tier.x + 19.5} 244 L ${tier.x + 23} 247.5 L ${tier.x + 29} 241`}
                        fill="none"
                        className="fn-svg-check-stroke"
                        strokeDasharray="18"
                        strokeDashoffset={18 * (1 - tier.done)}
                      />
                      <text x={tier.x + 42} y={248} className="fn-svg-label-strong">
                        {tier.name}
                      </text>
                      <text x={tier.x + 18} y={274} className="fn-svg-mono-xs">
                        {tier.task}
                      </text>
                    </g>
                  ))}
                </g>

                {/* ======================================================== */}
                {/* SCENE 04: CALM STUDY TRACKER                             */}
                {/* 25:00 Focus Dial + Shaky->Solid Note + Study Activity    */}
                {/* ======================================================== */}
                <g
                  style={{
                    opacity: vis3,
                    transform: `translateY(${(1 - vis3) * 12}px)`,
                    pointerEvents: vis3 > 0.2 ? "auto" : "none",
                  }}
                >
                  {/* Left Card: Focus Timer Dial */}
                  <rect x="24" y="34" width="174" height="260" rx="12" className="fn-svg-surface-card" />
                  <text x="111" y="64" textAnchor="middle" className="fn-svg-sub">
                    Focus timer
                  </text>
                  <circle cx="111" cy="156" r="52" className="fn-svg-ring-bg" />
                  <circle
                    cx="111"
                    cy="156"
                    r="52"
                    className="fn-svg-ring-active"
                    strokeDasharray={327}
                    strokeDashoffset={327 * (1 - (0.22 + p3 * 0.66))}
                    transform="rotate(-90 111 156)"
                  />
                  <text x="111" y="162" textAnchor="middle" className="fn-svg-timer-text">
                    {timerDisplay}
                  </text>
                  <text x="111" y="256" textAnchor="middle" className="fn-svg-mono-xs">
                    Logged locally
                  </text>

                  {/* Top-Right: Course-Scoped Note Status Morph (Shaky -> Solid) */}
                  <rect
                    x="216"
                    y="34"
                    width="300"
                    height="84"
                    rx="12"
                    className={`fn-svg-surface-card ${isNoteSolid ? "is-ok" : "is-coral"}`}
                  />
                  <text x="236" y="60" className="fn-svg-sub">
                    Course review note
                  </text>
                  <text x="496" y="60" textAnchor="end" className="fn-svg-mono-xs">
                    Per-course
                  </text>
                  <circle
                    cx="242"
                    cy="88"
                    r="4.5"
                    className={isNoteSolid ? "fn-svg-ok-dot" : "fn-svg-coral-dot"}
                  />
                  <text x="255" y="92" className="fn-svg-label-strong">
                    {isNoteSolid ? "Marked solid" : "Flagged shaky"}
                  </text>

                  {/* Bottom-Right: Study Activity Line Graph */}
                  <rect x="216" y="134" width="300" height="160" rx="12" className="fn-svg-surface-card" />
                  <text x="236" y="160" className="fn-svg-sub">
                    Study activity
                  </text>
                  <text x="496" y="160" textAnchor="end" className="fn-svg-mono-xs">
                    14 days · 3h 20m
                  </text>

                  <g transform="translate(236, 178)">
                    {[8, 42, 76].map((yPos) => (
                      <line
                        key={yPos}
                        x1="0"
                        y1={yPos}
                        x2="260"
                        y2={yPos}
                        className="fn-svg-chart-grid"
                      />
                    ))}
                    <path
                      d={ACTIVITY_AREA_PATH}
                      className="fn-svg-chart-area"
                      style={{ opacity: 0.14 * chartDraw }}
                    />
                    <path
                      d={ACTIVITY_LINE_PATH}
                      className="fn-svg-chart-line"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - chartDraw}
                    />
                    {ACTIVITY_CURVE_POINTS.map((pt, idx) => {
                      const reveal = smoothstep(
                        idx / (ACTIVITY_CURVE_POINTS.length - 1) - 0.12,
                        idx / (ACTIVITY_CURVE_POINTS.length - 1) + 0.04,
                        chartDraw,
                      );
                      const isEnd = idx === ACTIVITY_CURVE_POINTS.length - 1;
                      return (
                        <circle
                          key={pt.x}
                          cx={pt.x}
                          cy={pt.y}
                          r={isEnd ? 4 : 3}
                          className={`fn-svg-chart-dot ${isEnd ? "is-end" : ""}`}
                          style={{ opacity: reveal }}
                        />
                      );
                    })}
                  </g>
                </g>
              </svg>
            </div>
          </div>
  );
}

export function HomeView({
  onBrowseCourses,
  onOpenTracker,
}: HomeViewProps) {
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const stickyStageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const jumpToStep = (index: number) => {
    const el = stepRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const stepCenter = rect.top + rect.height * 0.5;
    let focalY = getFocalY(stickyStageRef.current);
    if (window.innerWidth <= 960 && stickyStageRef.current) {
      const stageHeight = stickyStageRef.current.getBoundingClientRect().height;
      const dockedBottom = 56 + stageHeight;
      focalY = dockedBottom + Math.max(80, window.innerHeight - dockedBottom) * 0.44;
    }
    const targetTop = Math.max(0, window.scrollY + (stepCenter - focalY));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: targetTop, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="fn-minimal-home">
      <div className="fn-scroll-hairline" aria-hidden="true">
        <div className="fn-scroll-hairline-fill" ref={progressBarRef} />
      </div>

      {/* ================================================================== */}
      {/* 1. COMPACT PRODUCT HERO                                            */}
      {/* ================================================================== */}
      <section className="fn-hero-minimal" aria-labelledby="fn-title">
        <h1 id="fn-title" className="fn-display-title">
          Interactive courses built around live traces.
        </h1>
        <p className="fn-display-lead">
          Plain explanations paired with step-by-step code traces, saved right in your browser.
        </p>

        <div className="fn-cta-row">
          <button type="button" className="btn btn-primary fn-btn-lg" onClick={onBrowseCourses}>
            Explore courses
          </button>
          <button type="button" className="btn btn-secondary fn-btn-lg" onClick={onOpenTracker}>
            Study tracker
          </button>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. TEXT-SYNCED 2D VISUAL STORY                                     */}
      {/* ================================================================== */}
      <section className="fn-story-track" aria-label="How Fieldnote works">
        <div className="fn-story-layout">
          <div className="fn-story-steps">
            {STORY_STEPS.map((step, idx) => (
              <article
                key={step.tag}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className={`fn-story-step ${activeIdx === idx ? "is-current" : ""}`}
              >
                <span className="fn-step-tag">{step.tag}</span>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <HomeStoryCanvas
            stepRefs={stepRefs}
            progressBarRef={progressBarRef}
            stickyStageRef={stickyStageRef}
            activeIdx={activeIdx}
            onActiveIdxChange={setActiveIdx}
            onJumpToStep={jumpToStep}
          />
        </div>
      </section>

      <footer className="fn-colophon" aria-label="Workspace notes">
        {PRINCIPLES.map((item) => (
          <p key={item.title} className="fn-colophon-item">
            <strong>{item.title}.</strong> {item.body}
          </p>
        ))}
      </footer>
    </div>
  );
}
