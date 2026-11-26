"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/icon";
import { LessonVisualRenderer } from "@/components/visuals/lesson-visual";
import {
  LineCodePanel,
  OutputStrip,
  StateChips,
  handleTabKeyDown,
  renderInlineRich,
  renderParagraphs,
} from "@/components/visuals/rich-text";
import { loadModuleBundle, type CourseBundle } from "@/data/python";
import {
  getCourseLessons,
  getCourseTotalMinutes,
  type Course,
  type CourseModule,
} from "@/lib/curriculum";
import type {
  ContextTabGroup,
  DeepDiveItem,
  GuidedBuildUp,
  LessonContent,
  ModulePracticeSet,
  ModuleQuiz,
  PracticeChallenge,
  PredictOutputPrompt,
  PredictQuestion,
  ReferenceTable,
} from "@/lib/lesson-types";
import { QUIZ_PASS_THRESHOLD, type ConfidenceLevel, type LessonNote, type ProgressState, type QuizResult } from "@/lib/progress";

export type CourseSubView = "catalog" | "overview" | "lesson" | "quiz";

type CoursesViewProps = {
  courses: Course[];
  activeCourseId: string;
  activeLessonId: string;
  activeQuizModuleId: string;
  subView: CourseSubView;
  progress: ProgressState;
  lessonLaunchOpt?: { lessonId: string; openNotes: boolean; nonce: number } | null;
  quizLaunchOpt?: { moduleId: string; tab: "practice" | "mcq"; nonce: number } | null;
  onQuizTabChange?: (tab: "practice" | "mcq") => void;
  onSelectCatalog: () => void;
  onSelectCourseOverview: (courseId: string) => void;
  onSelectLesson: (courseId: string, lessonId: string) => void;
  onSelectQuiz: (courseId: string, moduleId: string, options?: { tab?: "practice" | "mcq" }) => void;
  onToggleComplete: (lessonId: string) => void;
  onTogglePractice: (lessonId: string) => void;
  onSaveQuizResult: (
    moduleId: string,
    result: Omit<QuizResult, "updatedAt">,
    options?: { silent?: boolean; label?: string },
  ) => void;
  onSaveConceptualQuizResult: (
    moduleId: string,
    result: Omit<QuizResult, "updatedAt">,
    options?: { silent?: boolean; label?: string },
  ) => void;
  onSaveNote: (
    lessonId: string,
    note: string,
    confidence: ConfidenceLevel,
    options?: { silent?: boolean },
  ) => void;
  onStartTimerForLesson: (courseId: string, lessonId: string, title: string) => void;
};

function ReferenceTableView({ table }: { table: ReferenceTable }) {
  return (
    <div className="ref-table-card">
      <div className="ref-table-wrap">
        <table className="ref-table">
          {table.caption && (
            <caption className="ref-table-caption">{renderInlineRich(table.caption)}</caption>
          )}
          <thead>
            <tr>
              {table.headers.map((head, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={table.highlightCol === idx ? "is-highlight" : undefined}
                >
                  {renderInlineRich(head)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className={table.highlightCol === cIdx ? "is-highlight" : undefined}>
                    {renderInlineRich(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GuidedBuildUpCard({ buildUp }: { buildUp: GuidedBuildUp }) {
  const tabBaseId = useId();
  const [idx, setIdx] = useState(0);
  const steps = buildUp.steps;
  const safeIdx = Math.min(idx, Math.max(0, steps.length - 1));
  const step = steps[safeIdx];
  if (!step) return null;
  const progressPct = steps.length <= 1 ? 1 : (safeIdx + 1) / steps.length;

  return (
    <section className="guided-buildup-card">
      <div className="stepper-head-wrap">
        <div className="stepper-top-bar">
          <div className="stepper-title-col">
            <strong>{renderInlineRich(buildUp.title)}</strong>
            {buildUp.subtitle && <p className="buildup-sub">{renderInlineRich(buildUp.subtitle)}</p>}
          </div>
          <div className="step-dots" role="tablist" aria-label="Code-along steps">
            {steps.map((s, i) => {
              const selected = i === safeIdx;
              const cleanLabel = s.label.replace(/^Step\s+\d+\s*:\s*/i, "");
              return (
                <button
                  key={`${s.label}-${i}`}
                  id={`${tabBaseId}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${tabBaseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={`step-tab ${selected ? "is-active" : ""}`}
                  onClick={() => setIdx(i)}
                  onKeyDown={(e) => handleTabKeyDown(e, i, steps.length, setIdx)}
                >
                  <span className="step-tab-text">
                    {i + 1}. {renderInlineRich(cleanLabel)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {steps.length > 1 && (
          <div className="stepper-progress-rail" aria-hidden="true">
            <div className="stepper-progress-fill" style={{ transform: `scaleX(${progressPct})` }} />
          </div>
        )}
      </div>

      <div
        id={`${tabBaseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${tabBaseId}-tab-${safeIdx}`}
        className="buildup-body"
      >
        <p key={safeIdx} className="buildup-explain panel-swap-enter">
          {renderInlineRich(step.explanation)}
        </p>
        <LineCodePanel lines={step.code} activeLines={step.activeLines} />
        <OutputStrip title={`Run output · step ${safeIdx + 1}`} output={step.output} />
      </div>

      {steps.length > 1 && (
        <div className="stepper-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={safeIdx === 0}
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
          >
            <span className="stepper-label-full">Prev step</span>
            <span className="stepper-label-compact">Prev</span>
          </button>
          <span className="stepper-counter tabular">
            <span className="stepper-label-full">Build step {safeIdx + 1} of {steps.length}</span>
            <span className="stepper-label-compact">{safeIdx + 1} / {steps.length}</span>
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={safeIdx >= steps.length - 1}
            onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
          >
            <span className="stepper-label-full">Add next lines</span>
            <span className="stepper-label-compact">Next</span>
          </button>
        </div>
      )}
    </section>
  );
}

function ContextTabsView({ group }: { group: ContextTabGroup }) {
  const uid = useId();
  const [localId, setLocalId] = useState(group.tabs[0]?.id ?? "");
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const firstId = group.tabs[0]?.id ?? "";

  const subscribeSync = useCallback(
    (onStoreChange: () => void) => {
      if (!group.persistKey || typeof window === "undefined") return () => {};
      window.addEventListener("fn-context-tab-sync", onStoreChange);
      return () => window.removeEventListener("fn-context-tab-sync", onStoreChange);
    },
    [group.persistKey],
  );

  const getClientTabId = useCallback(() => {
    if (!group.persistKey || typeof window === "undefined") return firstId;
    try {
      const saved = window.sessionStorage.getItem(`fn-ctx-${group.persistKey}`);
      if (saved && group.tabs.some((t) => t.id === saved)) return saved;
    } catch {
      // Ignore storage restrictions
    }
    return firstId;
  }, [firstId, group.persistKey, group.tabs]);

  const persistedId = useSyncExternalStore(subscribeSync, getClientTabId, () => firstId);
  const selectedId = group.persistKey ? persistedId : localId;

  const chooseTab = useCallback(
    (tabId: string) => {
      if (!group.persistKey) {
        setLocalId(tabId);
        return;
      }
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem(`fn-ctx-${group.persistKey}`, tabId);
        } catch {
          // Ignore storage restrictions
        }
        window.dispatchEvent(new CustomEvent("fn-context-tab-sync"));
      }
    },
    [group.persistKey],
  );

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    for (const tab of group.tabs) {
      const el = panelRefs.current[tab.id];
      if (!el) continue;
      const onMatch = () => chooseTab(tab.id);
      el.addEventListener("beforematch", onMatch);
      cleanups.push(() => el.removeEventListener("beforematch", onMatch));
    }
    return () => cleanups.forEach((fn) => fn());
  }, [chooseTab, group.tabs]);

  if (group.tabs.length === 0) return null;
  const activeIdx = Math.max(0, group.tabs.findIndex((t) => t.id === selectedId));
  const activeTabId = group.tabs[activeIdx].id;

  return (
    <div className="context-tabs-card">
      <div className="context-tablist" role="tablist" aria-label={group.groupLabel}>
        {group.tabs.map((tab, idx) => {
          const isSelected = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              id={`${uid}-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              className="context-tab-btn"
              onClick={(e) => {
                chooseTab(tab.id);
                e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
              }}
              onKeyDown={(e) =>
                handleTabKeyDown(e, idx, group.tabs.length, (nextIdx) => {
                  chooseTab(group.tabs[nextIdx].id);
                })
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {group.tabs.map((tab) => {
        const isSelected = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            ref={(node) => {
              panelRefs.current[tab.id] = node;
            }}
            id={`${uid}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${tab.id}`}
            tabIndex={isSelected ? 0 : undefined}
            hidden={!isSelected ? ("until-found" as unknown as boolean) : undefined}
            className="context-tabpanel"
          >
            <div className="context-tab-panel-inner">
              {tab.summary && <p className="context-tab-summary">{renderInlineRich(tab.summary)}</p>}
              {tab.paragraphs && tab.paragraphs.map((p, i) => <p key={i}>{renderInlineRich(p)}</p>)}
              {tab.code && <LineCodePanel lines={tab.code} label={tab.codeLabel ?? tab.label} variant="mini" />}
              {tab.output && <OutputStrip title="Output" output={tab.output} />}
              {tab.note && <p className="lab-note">{renderInlineRich(tab.note)}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DeepDiveAccordion({ items }: { items: DeepDiveItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="deep-dive-group" role="group" aria-label="Deep dive technical notes">
      {items.map((item, idx) => (
        <details key={`${item.label}-${idx}`} className="deep-dive-item">
          <summary className="deep-dive-summary">
            <span>{renderInlineRich(item.label)}</span>
          </summary>
          <div className="deep-dive-body">
            {item.paragraphs && item.paragraphs.map((p, i) => <p key={i}>{renderInlineRich(p)}</p>)}
            {item.bullets && item.bullets.length > 0 && (
              <ul className="deep-dive-bullets">
                {item.bullets.map((b, i) => (
                  <li key={i}>{renderInlineRich(b)}</li>
                ))}
              </ul>
            )}
            {item.code && <LineCodePanel lines={item.code} label={item.codeLabel ?? "Details"} variant="mini" />}
            {item.note && <p className="lab-note">{renderInlineRich(item.note)}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}

function SectionPredictOutput({ output, predictOutput }: { output: string; predictOutput: PredictOutputPrompt }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="predict-reveal-box">
      <div className="predict-reveal-head">
        <span className="predict-reveal-prompt">
          {renderInlineRich(predictOutput.prompt ?? "Predict what this prints before revealing:")}
        </span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          aria-expanded={revealed}
          onClick={() => setRevealed((v) => !v)}
        >
          {revealed ? "Hide output" : predictOutput.revealLabel ?? "Reveal output & why"}
        </button>
      </div>
      {revealed && (
        <>
          <OutputStrip title="Actual output" output={output} />
          <p className="predict-reveal-why">
            <strong>Why:</strong> {renderInlineRich(predictOutput.why)}
          </p>
        </>
      )}
    </div>
  );
}

function SectionMicroCheck({ check, labelId }: { check: PredictQuestion; labelId: string }) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const compactOpts = check.options.every((o) => o.label.length <= 28);

  return (
    <div className="micro-check-card" role="group" aria-labelledby={labelId}>
      <span id={labelId} className="micro-check-badge">
        Quick 10s check
      </span>
      <p className="micro-check-prompt">{renderInlineRich(check.prompt)}</p>
      {check.code.trim().length > 0 && (
        <pre className="predict-code">
          <code>{check.code}</code>
        </pre>
      )}
      <div className={`predict-options ${compactOpts ? "is-compact-grid" : ""}`} role="radiogroup" aria-labelledby={labelId}>
        {check.options.map((opt, oIdx) => {
          const chosen = chosenId === opt.id;
          const answered = chosenId !== null;
          const isCorrect = opt.id === check.correctId;
          const tone = answered ? (isCorrect ? "is-correct" : chosen ? "is-wrong" : "") : "";
          return (
            <button
              type="button"
              role="radio"
              aria-checked={chosen}
              tabIndex={chosen || (!chosenId && oIdx === 0) ? 0 : -1}
              key={opt.id}
              className={`predict-option ${tone}`}
              onClick={() => setChosenId(opt.id)}
              onKeyDown={(e) => {
                const radios = Array.from(
                  e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
                );
                let nextIdx = -1;
                if (e.key === "ArrowDown" || e.key === "ArrowRight") nextIdx = (oIdx + 1) % check.options.length;
                else if (e.key === "ArrowUp" || e.key === "ArrowLeft") nextIdx = (oIdx - 1 + check.options.length) % check.options.length;
                else if (e.key === "Home") nextIdx = 0;
                else if (e.key === "End") nextIdx = check.options.length - 1;
                if (nextIdx >= 0) {
                  e.preventDefault();
                  setChosenId(check.options[nextIdx].id);
                  radios[nextIdx]?.focus();
                }
              }}
            >
              <span className="opt-letter">{opt.id.toUpperCase()}</span>
              <span className="opt-label-text">{renderInlineRich(opt.label)}</span>
              {answered && isCorrect && <Icon name="check" size={14} className="opt-status-icon is-right" />}
              {answered && chosen && !isCorrect && <Icon name="close" size={14} className="opt-status-icon is-wrong" />}
            </button>
          );
        })}
      </div>
      {chosenId !== null && (
        <div className="predict-feedback">
          <strong>{chosenId === check.correctId ? "Correct:" : "Takeaway:"}</strong>{" "}
          {renderInlineRich(check.explanation)}
        </div>
      )}
    </div>
  );
}

function resolveChallengeDifficulty(
  tier: string | undefined,
  isDsa: boolean,
  index = 0,
  total = 3,
): { label: string; tone: "easy" | "medium" | "hard" } | null {
  if (tier === "Warmup") return { label: isDsa ? "Easy" : "Warmup", tone: "easy" };
  if (tier === "Core") return { label: isDsa ? "Medium" : "Core", tone: "medium" };
  if (tier === "Stretch") return { label: isDsa ? "Hard" : "Stretch", tone: "hard" };
  if (!isDsa) return null;
  if (index === 0) return { label: "Easy", tone: "easy" };
  if (total >= 4 && index <= 2) return { label: "Medium", tone: "medium" };
  if (index < total - 1) return { label: "Medium", tone: "medium" };
  return { label: "Hard", tone: "hard" };
}

function PracticeChallengeBody({
  challenge,
  challengeIndex = 0,
  challengeTotal = 3,
  isDsa,
  showHint,
  onToggleHint,
  showSolution,
  onToggleSolution,
  showPatternHint = false,
  onTogglePatternHint,
  onRevisitLesson,
}: {
  challenge: PracticeChallenge;
  challengeIndex?: number;
  challengeTotal?: number;
  isDsa: boolean;
  showHint: boolean;
  onToggleHint: () => void;
  showSolution: boolean;
  onToggleSolution: () => void;
  showPatternHint?: boolean;
  onTogglePatternHint?: () => void;
  onRevisitLesson?: (lessonId: string) => void;
}) {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const diff = resolveChallengeDifficulty(challenge.tier, isDsa, challengeIndex, challengeTotal);
  const showTierPill = Boolean(diff && challengeTotal <= 1);
  const showComplexityPill = Boolean(isDsa && challenge.complexity);

  return (
    <>
      <div className="practice-challenge-title-row">
        <h3>{renderInlineRich(challenge.title)}</h3>
        {(showTierPill || showComplexityPill) && (
          <div className="practice-badge-group">
            {showTierPill && diff && <span className={`practice-tier-pill is-${diff.tone}`}>{diff.label}</span>}
            {showComplexityPill && challenge.complexity && (
              <span className="practice-complexity-pill tabular">
                Target: {challenge.complexity.time} · {challenge.complexity.space}
              </span>
            )}
          </div>
        )}
      </div>

      <p className="practice-goal">{renderInlineRich(challenge.goal)}</p>

      {challenge.constraints && challenge.constraints.length > 0 && (
        <div className="practice-constraints" aria-label="Problem constraints">
          <span className="practice-spec-label">Constraints</span>
          {challenge.constraints.map((c, idx) => (
            <span key={idx} className="practice-constraint-pill tabular">
              {renderInlineRich(c)}
            </span>
          ))}
        </div>
      )}

      {challenge.examples && challenge.examples.length > 0 && (
        <div className="practice-examples-wrap">
          <div className="practice-spec-label">Sample Test Cases</div>
          <div className="practice-examples">
            {challenge.examples.map((ex, idx) => (
              <div key={idx} className="practice-example-card">
                <div className="practice-example-head">Sample {idx + 1}</div>
                <div className="practice-example-io">
                  <div>
                    <span>Input</span>
                    <code>{ex.input}</code>
                  </div>
                  <div>
                    <span>Output</span>
                    <code>{ex.output}</code>
                  </div>
                </div>
                {ex.explanation && (
                  <p className="practice-example-exp">
                    <strong>Explanation:</strong> {renderInlineRich(ex.explanation)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <ul className="practice-task-checklist" aria-label="Challenge steps checklist">
        {challenge.tasks.map((task, idx) => {
          const checked = Boolean(checkedSteps[idx]);
          return (
            <li key={idx}>
              <button
                type="button"
                aria-pressed={checked}
                className={`practice-check-btn ${checked ? "is-checked" : ""}`}
                onClick={() => setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))}
              >
                <span className="practice-check-box" aria-hidden="true">
                  {checked && <Icon name="check" size={12} />}
                </span>
                <span>{renderInlineRich(task)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {challenge.starterCode && (
        <LineCodePanel
          lines={challenge.starterCode.split("\n")}
          label={isDsa ? "Pseudocode" : "Starter template · .py"}
        />
      )}

      <OutputStrip title="Expected sample run" output={challenge.expectedOutput} />

      <div className="practice-toggles">
        {challenge.patternHint && onTogglePatternHint && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            aria-expanded={showPatternHint}
            onClick={onTogglePatternHint}
          >
            {showPatternHint ? "Hide pattern" : "Pattern hint"}
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          aria-expanded={showHint}
          onClick={onToggleHint}
        >
          {showHint ? "Hide hint" : "Hint"}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          aria-expanded={showSolution}
          onClick={onToggleSolution}
        >
          {showSolution ? "Hide solution" : "Solution"}
        </button>
      </div>

      {showPatternHint && challenge.patternHint && (
        <div className="practice-hint">
          <strong>Pattern:</strong> {renderInlineRich(challenge.patternHint)}
          {challenge.lessonRefId && onRevisitLesson && (
            <div className="quiz-review-link-row">
              <button
                type="button"
                className="text-link-btn"
                onClick={() => onRevisitLesson(challenge.lessonRefId!)}
              >
                Review matching lesson
              </button>
            </div>
          )}
        </div>
      )}

      {showHint && <div className="practice-hint">{renderInlineRich(challenge.hint)}</div>}

        {showSolution && (
        <div className="practice-solution">
          {isDsa && challenge.complexity && (
            <div className="practice-complexity-row tabular">
              <span>
                <strong>Time:</strong> {challenge.complexity.time}
              </span>
              <span>
                <strong>Space:</strong> {challenge.complexity.space}
              </span>
            </div>
          )}
          <LineCodePanel
            lines={challenge.solutionCode.split("\n")}
            label={isDsa ? "Solution (Pseudocode)" : "Sample solution · Python"}
          />
        </div>
      )}
    </>
  );
}

export function CoursesView({
  courses,
  activeCourseId,
  activeLessonId,
  activeQuizModuleId,
  subView,
  progress,
  lessonLaunchOpt,
  quizLaunchOpt,
  onQuizTabChange,
  onSelectCatalog,
  onSelectCourseOverview,
  onSelectLesson,
  onSelectQuiz,
  onToggleComplete,
  onTogglePractice,
  onSaveQuizResult,
  onSaveConceptualQuizResult,
  onSaveNote,
  onStartTimerForLesson,
}: CoursesViewProps) {
  const [bundles, setBundles] = useState<Record<string, CourseBundle>>({});
  const [loadedModuleKeys, setLoadedModuleKeys] = useState<Record<string, boolean>>({});
  const [bundleError, setBundleError] = useState(false);
  const [bundleAttempt, setBundleAttempt] = useState(0);
  const [stepNav, setStepNav] = useState<{
    index: number;
    prevIndex: number | null;
    dir: "forward" | "back" | "instant";
  }>({ index: 0, prevIndex: null, dir: "forward" });
  const [playSpeed, setPlaySpeed] = useState<0.5 | 1 | 2>(1);
  const stepIndex = stepNav.index;
  const goToStep = useCallback(
    (nextOrUpdater: number | ((prev: number) => number), via: "pointer" | "keyboard" = "pointer") => {
      setStepNav((prev) => {
        const nextIndex =
          typeof nextOrUpdater === "function" ? nextOrUpdater(prev.index) : nextOrUpdater;
        if (nextIndex === prev.index) return prev;
        return {
          index: nextIndex,
          prevIndex: prev.index,
          dir: via === "keyboard" ? "instant" : nextIndex >= prev.index ? "forward" : "back",
        };
      });
    },
    [],
  );
  const stepperCardRef = useRef<HTMLElement>(null);
  const ensureStageVisible = useCallback(() => {
    const card = stepperCardRef.current;
    if (!card || typeof window === "undefined") return;
    const rect = card.getBoundingClientRect();
    if (rect.top < 56) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targetY = Math.max(0, window.scrollY + rect.top - 64);
      window.scrollTo({ top: targetY, behavior: reduced ? "auto" : "smooth" });
    }
  }, []);
  const [isPlayingSteps, setIsPlayingSteps] = useState(false);
  const [stepCodeTab, setStepCodeTab] = useState<"primary" | "alt">("primary");
  const [predictChoices, setPredictChoices] = useState<Record<number, string>>({});
  const [challengeTab, setChallengeTab] = useState(0);
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<number, boolean>>({});
  const [openPatternHints, setOpenPatternHints] = useState<Record<number, boolean>>({});
  const [notesOpen, setNotesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);
  const [lessonFilter, setLessonFilter] = useState("");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Quiz state scoped to activeQuizModuleId
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [confirmRetake, setConfirmRetake] = useState(false);
  const [quizAssessmentTab, setQuizAssessmentTab] = useState<"practice" | "mcq">("practice");
  const selectQuizTab = (nextTab: "practice" | "mcq") => {
    setQuizAssessmentTab(nextTab);
    onQuizTabChange?.(nextTab);
  };
  const practiceTabBaseId = useId();
  const noteInputId = useId();
  const quizBannerRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const mobileCloseBtnRef = useRef<HTMLButtonElement>(null);
  const pendingNoteRef = useRef<{ lessonId: string; note: string; confidence: ConfidenceLevel } | null>(null);

  const activeCourse = courses.find((c) => c.id === activeCourseId) ?? courses[0];
  const isPracticeSetCourse = activeCourse.assessmentKind === "practice-set";
  const flatLessons = useMemo(() => getCourseLessons(activeCourse), [activeCourse]);
  const currentMeta = flatLessons.find((f) => f.lesson.id === activeLessonId) ?? flatLessons[0];
  const currentLesson = currentMeta.lesson;
  const activeQuizMod =
    activeCourse.modules.find((m) => m.id === activeQuizModuleId) ?? activeCourse.modules[0];

  const existingNote: LessonNote = progress.lessonNotes[currentLesson.id] ?? {
    note: "",
    confidence: "learning",
    updatedAt: "",
  };
  const noteSyncKey = `${currentLesson.id}|${existingNote.updatedAt}|${existingNote.confidence}|${existingNote.note}`;
  const [noteDraft, setNoteDraft] = useState(existingNote.note);
  const [confidenceDraft, setConfidenceDraft] = useState<ConfidenceLevel>(existingNote.confidence);

  const hasStoredNote = Boolean(progress.lessonNotes[currentLesson.id]);
  const isNoteDirty =
    noteDraft.trim() !== existingNote.note.trim() || confidenceDraft !== existingNote.confidence;

  useEffect(() => {
    const pending = pendingNoteRef.current;
    if (!pending || pending.lessonId !== currentLesson.id) return;
    const timer = window.setTimeout(() => {
      const latest = pendingNoteRef.current;
      if (latest && latest.lessonId === currentLesson.id) {
        pendingNoteRef.current = null;
        onSaveNote(latest.lessonId, latest.note, latest.confidence, { silent: true });
      }
    }, 450);
    return () => window.clearTimeout(timer);
    // Debounced auto-save for the current lesson note.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson.id, noteDraft, confidenceDraft]);

  useEffect(() => {
    return () => {
      const pending = pendingNoteRef.current;
      if (pending && pending.lessonId === currentLesson.id) {
        pendingNoteRef.current = null;
        onSaveNote(pending.lessonId, pending.note, pending.confidence, { silent: true });
      }
    };
    // Intentionally flush uncommitted draft when switching away from a lesson.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson.id]);

  useEffect(() => {
    if (!quizSubmitted) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = quizBannerRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, [quizSubmitted]);

  const lessonViewKey = `${subView}|${currentLesson.id}`;
  const quizViewKey = `${subView}|${activeQuizMod.id}`;
  const prevKeysRef = useRef({
    lessonViewKey,
    quizViewKey,
    noteSyncKey,
    lessonNonce: 0,
    quizNonce: 0,
  });

  useLayoutEffect(() => {
    const prev = prevKeysRef.current;
    const lessonChanged = prev.lessonViewKey !== lessonViewKey;
    const hasLessonLaunch =
      subView === "lesson" &&
      lessonLaunchOpt &&
      lessonLaunchOpt.lessonId === currentLesson.id &&
      lessonLaunchOpt.nonce !== prev.lessonNonce;
    const noteChanged = prev.noteSyncKey !== noteSyncKey;
    const quizChanged = prev.quizViewKey !== quizViewKey;
    const hasQuizLaunch =
      subView === "quiz" &&
      quizLaunchOpt &&
      quizLaunchOpt.moduleId === activeQuizMod.id &&
      quizLaunchOpt.nonce !== prev.quizNonce;

    if (!lessonChanged && !hasLessonLaunch && !noteChanged && !quizChanged && !hasQuizLaunch) {
      return;
    }

    if (lessonChanged) prev.lessonViewKey = lessonViewKey;
    if (hasLessonLaunch && lessonLaunchOpt) prev.lessonNonce = lessonLaunchOpt.nonce;
    if (noteChanged) prev.noteSyncKey = noteSyncKey;
    if (quizChanged) prev.quizViewKey = quizViewKey;
    if (hasQuizLaunch && quizLaunchOpt) prev.quizNonce = quizLaunchOpt.nonce;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (lessonChanged) {
        setStepNav({ index: 0, prevIndex: null, dir: "forward" });
        setIsPlayingSteps(false);
        setStepCodeTab("primary");
        setPredictChoices({});
        setChallengeTab(0);
        setOpenHints({});
        setOpenSolutions({});
        setOpenPatternHints({});
        setNotesOpen(false);
        setMobileModulesOpen(false);
      }
      if (hasLessonLaunch && lessonLaunchOpt?.openNotes) {
        setNotesOpen(true);
      }
      if (noteChanged) {
        const nextNote = progress.lessonNotes[currentLesson.id];
        setNoteDraft(nextNote?.note ?? "");
        setConfidenceDraft(nextNote?.confidence ?? "learning");
      }
      if (quizChanged) {
        setQuizAnswers({});
        setQuizSubmitted(false);
        setConfirmRetake(false);
        setQuizAssessmentTab(
          quizLaunchOpt && quizLaunchOpt.moduleId === activeQuizMod.id ? quizLaunchOpt.tab : "practice",
        );
        setChallengeTab(0);
        setOpenHints({});
        setOpenSolutions({});
        setOpenPatternHints({});
        setMobileModulesOpen(false);
      }
      if (hasQuizLaunch && quizLaunchOpt) {
        setQuizAssessmentTab(quizLaunchOpt.tab);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [
    lessonViewKey,
    quizViewKey,
    noteSyncKey,
    subView,
    currentLesson.id,
    activeQuizMod.id,
    lessonLaunchOpt,
    quizLaunchOpt,
    progress.lessonNotes,
  ]);

  const targetModuleId = subView === "quiz" ? activeQuizMod.id : currentMeta.module.id;
  const targetModuleCacheKey = `${activeCourse.id}:${targetModuleId}`;

  useEffect(() => {
    let cancelled = false;
    if ((subView !== "lesson" && subView !== "quiz") || loadedModuleKeys[targetModuleCacheKey]) return;
    loadModuleBundle(activeCourse.id, targetModuleId)
      .then((modBundle) => {
        if (cancelled) return;
        setBundleError(false);
        setLoadedModuleKeys((prev) => ({ ...prev, [targetModuleCacheKey]: true }));
        setBundles((prev) => {
          const existing = prev[activeCourse.id] ?? { lessons: {}, quizzes: {}, practiceSets: {} };
          return {
            ...prev,
            [activeCourse.id]: {
              lessons: { ...existing.lessons, ...modBundle.lessons },
              quizzes: { ...existing.quizzes, ...modBundle.quizzes },
              practiceSets: { ...existing.practiceSets, ...modBundle.practiceSets },
            },
          };
        });
      })
      .catch(() => {
        if (!cancelled) setBundleError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCourse.id, targetModuleId, targetModuleCacheKey, loadedModuleKeys, subView, bundleAttempt]);

  useEffect(() => {
    if (!mobileModulesOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const drawerEl = document.getElementById("course-modules-drawer");
    const topNavEl = document.querySelector(".top-nav") as HTMLElement | null;
    const mobileBarEl = document.querySelector(".study-mobile-bar") as HTMLElement | null;
    if (topNavEl) topNavEl.inert = true;
    if (mobileBarEl) mobileBarEl.inert = true;
    mobileCloseBtnRef.current?.focus();
    const triggerEl = mobileMenuBtnRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileModulesOpen(false);
        window.requestAnimationFrame(() => triggerEl?.focus());
        return;
      }
      if (e.key === "Tab" && drawerEl) {
        const focusables = Array.from(
          drawerEl.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      if (topNavEl) topNavEl.inert = false;
      if (mobileBarEl) mobileBarEl.inert = false;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileModulesOpen]);

  const completedSet = useMemo(() => new Set(progress.completedLessons), [progress.completedLessons]);
  const practiceSet = useMemo(() => new Set(progress.completedPractice), [progress.completedPractice]);
  const walkthroughStepsCount =
    bundles[activeCourse.id]?.lessons[currentLesson.id]?.walkthrough?.steps?.length ?? 0;

  useEffect(() => {
    if (subView !== "lesson" || walkthroughStepsCount <= 1) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable ||
          target.closest('[role="tablist"]'))
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        setIsPlayingSteps(false);
        goToStep((i) => Math.max(0, i - 1), "keyboard");
        ensureStageVisible();
      } else if (e.key === "ArrowRight") {
        setIsPlayingSteps(false);
        goToStep((i) => Math.min(walkthroughStepsCount - 1, i + 1), "keyboard");
        ensureStageVisible();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [subView, walkthroughStepsCount, goToStep, ensureStageVisible]);

  useEffect(() => {
    if (!isPlayingSteps || subView !== "lesson" || walkthroughStepsCount <= 1) return;
    const delayMs = playSpeed === 2 ? 850 : playSpeed === 0.5 ? 2600 : 1650;
    const timer = window.setTimeout(() => {
      if (stepIndex < walkthroughStepsCount - 1) {
        goToStep((i) => Math.min(walkthroughStepsCount - 1, i + 1));
      } else {
        setIsPlayingSteps(false);
      }
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [isPlayingSteps, subView, walkthroughStepsCount, stepIndex, playSpeed, goToStep]);

  const defaultExpandedModId = useMemo(() => {
    if (subView === "quiz") return activeQuizMod.id;
    if (subView === "lesson") return currentMeta.module.id;
    return (
      flatLessons.find((item) => !completedSet.has(item.lesson.id))?.module.id ??
      activeCourse.modules[0]?.id ??
      ""
    );
  }, [subView, activeQuizMod.id, currentMeta.module.id, flatLessons, completedSet, activeCourse.modules]);

  const isModuleExpanded = (modId: string) =>
    expandedModules[modId] ?? modId === defaultExpandedModId;

  const toggleModuleCollapse = (mod: CourseModule) => {
    const currentlyOpen = isModuleExpanded(mod.id);
    setExpandedModules((prev) => ({ ...prev, [mod.id]: !currentlyOpen }));
  };

  // 1. COURSES CATALOG VIEW
  if (subView === "catalog") {
    return (
      <div key="catalog" className="catalog-container view-enter">
        <header className="catalog-header">
          <h1>Courses</h1>
          <p>Self-contained courses ordered from fundamentals to applied problem sets.</p>
        </header>

        <div className="catalog-grid">
          {courses.map((course, courseIdx) => {
            const lessons = getCourseLessons(course);
            const doneCount = lessons.filter((l) => completedSet.has(l.lesson.id)).length;
            const pct = lessons.length === 0 ? 0 : Math.round((doneCount / lessons.length) * 100);
            const totalMins = getCourseTotalMinutes(course);
            const hours = Math.floor(totalMins / 60);
            const mins = totalMins % 60;
            return (
              <article
                key={course.id}
                className="catalog-card"
                style={{ "--course-accent": course.accent } as React.CSSProperties}
              >
                {course.coverImage ? (
                  <div className="catalog-card-media">
                    <Image
                      src={course.coverImage}
                      alt={`${course.title} course artwork`}
                      width={1280}
                      height={720}
                      sizes="(max-width: 820px) 100vw, 560px"
                      className="catalog-card-img"
                      priority={courseIdx === 0}
                    />
                    {doneCount > 0 && (
                      <span className="catalog-media-pill tabular">
                        {doneCount}/{lessons.length} done
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="catalog-card-top">
                    {doneCount > 0 && (
                      <span className="catalog-progress-chip tabular">
                        {doneCount}/{lessons.length}
                      </span>
                    )}
                  </div>
                )}

                <div className="catalog-card-body">
                  <div className="catalog-card-head">
                    <h2>
                      <button
                        type="button"
                        className="catalog-card-trigger"
                        onClick={() => onSelectCourseOverview(course.id)}
                      >
                        {course.title}
                      </button>
                    </h2>
                  </div>
                  <p className="catalog-card-desc">{course.tagline}</p>

                  {doneCount > 0 && (
                    <div className="catalog-progress-row" aria-label={`Course progress ${pct}%`}>
                      <div className="progress-track is-mini">
                        <div className="progress-fill" style={{ transform: `scaleX(${pct / 100})` }} />
                      </div>
                      <small className="tabular">{pct}%</small>
                    </div>
                  )}

                  <div className="catalog-card-footer">
                    <span className="catalog-card-meta tabular">
                      {course.modules.length} modules · {lessons.length} lessons · {hours}h {mins}m
                    </span>
                    <span className="catalog-cta-label">
                      {doneCount > 0 ? "Continue track" : "Open track"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. COURSE OVERVIEW VIEW
  if (subView === "overview") {
    const totalMins = getCourseTotalMinutes(activeCourse);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const doneCount = flatLessons.filter((l) => completedSet.has(l.lesson.id)).length;
    const donePct = flatLessons.length === 0 ? 0 : Math.round((doneCount / flatLessons.length) * 100);
    const nextIncompleteMeta =
      flatLessons.find((item) => !completedSet.has(item.lesson.id)) ?? flatLessons[0];
    const nextIncomplete = nextIncompleteMeta?.lesson;
    const hasStarted = doneCount > 0;
    const allModulesExpanded = activeCourse.modules.every((m) => isModuleExpanded(m.id));

    return (
      <div key={`overview-${activeCourse.id}`} className="course-overview-container view-enter">
        <button type="button" className="back-link-btn" onClick={onSelectCatalog}>
          <Icon name="chevron" size={14} strokeWidth={2} className="icon-chevron-left" />
          <span>All courses</span>
        </button>

        <section
          className="overview-banner"
          style={{ "--course-accent": activeCourse.accent } as React.CSSProperties}
        >
          <div className={`overview-hero-grid ${activeCourse.coverImage ? "has-cover" : ""}`}>
            <div className="overview-hero-main">
              <div className="overview-head-copy">
                {!activeCourse.coverImage && (
                  <div className="overview-icon-box" aria-hidden="true">
                    <Icon name="code" size={20} />
                  </div>
                )}
                <div>
                  <h1>{activeCourse.title}</h1>
                  <p>{activeCourse.tagline}</p>
                </div>
              </div>

              <div className="overview-meta tabular">
                <span>
                  <Icon name="layers" size={14} /> {activeCourse.modules.length} modules
                </span>
                <span>
                  <Icon name="book" size={14} /> {flatLessons.length} lessons
                </span>
                <span>
                  <Icon name="check-circle" size={14} /> {activeCourse.modules.length}{" "}
                  {isPracticeSetCourse ? "practice sets" : "quizzes"}
                </span>
                <span>
                  <Icon name="clock" size={14} /> {hours}h {mins}m
                </span>
              </div>

              {hasStarted && (
                <div className="overview-progress-bar">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ transform: `scaleX(${donePct / 100})` }} />
                  </div>
                  <span className="tabular">
                    {doneCount} / {flatLessons.length} completed ({donePct}%)
                  </span>
                </div>
              )}

              {nextIncomplete && (
                <div className="overview-cta-row">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectLesson(activeCourse.id, nextIncomplete.id)}
                  >
                    {doneCount === flatLessons.length
                      ? "Review from Module 00"
                      : hasStarted
                        ? "Continue next lesson"
                        : "Start Module 00"}
                  </button>
                </div>
              )}
            </div>

            {activeCourse.coverImage && (
              <div className="overview-cover-wrap">
                <Image
                  src={activeCourse.coverImage}
                  alt={`${activeCourse.title} course artwork`}
                  width={1280}
                  height={720}
                  sizes="(max-width: 820px) 100vw, 360px"
                  className="overview-cover-img"
                />
              </div>
            )}
          </div>

          <details className="why-course-details">
            <summary>
              <Icon name="chevron" size={14} strokeWidth={1.9} className="why-details-chevron" />
              <span>What this track covers</span>
            </summary>
            <ul className="why-course-list">
              {activeCourse.whyThisCourse.map((line) => (
                <li key={line}>
                  <Icon name="check" size={14} />
                  <span>{renderInlineRich(line)}</span>
                </li>
              ))}
            </ul>
          </details>
        </section>

        <section className="syllabus-section">
          <div className="syllabus-head">
            <h2>Course syllabus</h2>
            <button
              type="button"
              className="text-link-btn"
              onClick={() => {
                const nextState: Record<string, boolean> = {};
                for (const m of activeCourse.modules) nextState[m.id] = !allModulesExpanded;
                setExpandedModules(nextState);
              }}
            >
              {allModulesExpanded ? "Collapse all" : "Expand all modules"}
            </button>
          </div>

          <div className="syllabus-accordion">
            {activeCourse.modules.map((mod, modIdx) => {
              const prevTier = modIdx > 0 ? activeCourse.modules[modIdx - 1]?.tier : undefined;
              const showTierDivider = Boolean(mod.tier && mod.tier !== prevTier);
              const isOpen = isModuleExpanded(mod.id);
              const doneInMod = mod.lessons.filter((l) => completedSet.has(l.id)).length;
              const modComplete = doneInMod === mod.lessons.length;
              const quizRes = progress.quizResults[mod.id];
              const mcqRes = progress.conceptualQuizResults?.[mod.id];
              const hasMcq = isPracticeSetCourse && Boolean(mod.quizCount && mod.quizCount > 0);
              const setCount = mod.practiceSetCount ?? mod.quizCount ?? 0;
              const practicePassed = Boolean(
                quizRes && quizRes.score / Math.max(1, quizRes.total) >= QUIZ_PASS_THRESHOLD,
              );
              const mcqPassed =
                !hasMcq ||
                Boolean(mcqRes && mcqRes.score / Math.max(1, mcqRes.total) >= QUIZ_PASS_THRESHOLD);
              const assessmentDone = practicePassed && mcqPassed;
              return (
                <div key={mod.id} className="syllabus-mod-slot">
                  {showTierDivider && (
                    <div className="syllabus-tier-divider">{mod.tier}</div>
                  )}
                  <div className={`syllabus-module ${modComplete ? "is-complete" : ""}`}>
                    <button
                      type="button"
                      className="syllabus-module-trigger"
                      aria-expanded={isOpen}
                      aria-controls={`syllabus-panel-${mod.id}`}
                      onClick={() => toggleModuleCollapse(mod)}
                    >
                      <div className="syllabus-module-title">
                        <span className={`syllabus-num tabular ${modComplete ? "is-done" : ""}`}>{mod.number}</span>
                        <div>
                          <strong>{mod.title}</strong>
                          <p>{renderInlineRich(mod.summary)}</p>
                        </div>
                      </div>
                      <div className="syllabus-module-right">
                        <span className="syllabus-count tabular">
                          {doneInMod}/{mod.lessons.length}
                        </span>
                        <Icon
                          name="chevron"
                          size={16}
                          className={isOpen ? "chevron-open" : "chevron-closed"}
                        />
                      </div>
                    </button>

                    <div
                      id={`syllabus-panel-${mod.id}`}
                      className={`accordion-collapse ${isOpen ? "is-open" : ""}`}
                      aria-hidden={!isOpen}
                      inert={!isOpen || undefined}
                    >
                      <div className="accordion-collapse-inner">
                        <ul className="syllabus-lesson-list">
                          {mod.lessons.map((lesson) => {
                            const done = completedSet.has(lesson.id);
                            return (
                              <li key={lesson.id}>
                                <button
                                  type="button"
                                  className="syllabus-lesson-btn"
                                  onClick={() => onSelectLesson(activeCourse.id, lesson.id)}
                                >
                                  <span className={`lesson-status-dot ${done ? "is-done" : ""}`}>
                                    {done && <Icon name="check" size={12} />}
                                  </span>
                                  <span className="syllabus-lesson-text">
                                    <strong>{lesson.title}</strong>
                                    <small>{renderInlineRich(lesson.summary)}</small>
                                  </span>
                                  <span className="syllabus-lesson-time tabular">{lesson.estimatedMinutes} min</span>
                                </button>
                              </li>
                            );
                          })}
                          <li>
                            <button
                              type="button"
                              className="syllabus-lesson-btn is-quiz-row"
                              onClick={() => onSelectQuiz(activeCourse.id, mod.id, { tab: "practice" })}
                            >
                              <span
                                className={`lesson-status-dot ${assessmentDone ? "is-done" : ""}`}
                              >
                                {assessmentDone && <Icon name="check" size={12} />}
                              </span>
                              <span className="syllabus-lesson-text">
                                <strong>
                                  {isPracticeSetCourse && hasMcq
                                    ? `Module ${mod.number} Practice & Quiz`
                                    : isPracticeSetCourse
                                      ? `Module ${mod.number} Practice Set`
                                      : `Module ${mod.number} Stage Quiz`}
                                </strong>
                                <small>
                                  {isPracticeSetCourse
                                    ? quizRes && mcqRes
                                      ? `Practice ${quizRes.score}/${quizRes.total} · Quiz ${mcqRes.score}/${mcqRes.total}`
                                      : quizRes
                                        ? `Solved ${quizRes.score}/${quizRes.total} problems${
                                            hasMcq ? ` · ${mod.quizCount}-Q quiz available` : ""
                                          }`
                                        : mcqRes
                                          ? `${setCount} problems · Quiz score ${mcqRes.score}/${mcqRes.total}`
                                          : `${setCount} mixed problems${
                                              hasMcq
                                                ? ` + ${mod.quizCount}-question conceptual quiz`
                                                : ` applying Module ${mod.number}`
                                            }`
                                    : quizRes
                                      ? `Last score: ${quizRes.score}/${quizRes.total} (review or retake)`
                                      : `${setCount} questions checking Module ${mod.number}`}
                                </small>
                              </span>
                              <span className="syllabus-lesson-time tabular">
                                {isPracticeSetCourse && hasMcq
                                  ? `${setCount} probs · ${mod.quizCount} Qs`
                                  : isPracticeSetCourse
                                    ? `${setCount} probs`
                                    : `${setCount} Qs`}
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  // SHARED LEFT MODULE SIDEBAR FOR STUDY & QUIZ MODES
  const normalizedQuery = lessonFilter.trim().toLowerCase();
  const bundle = bundles[activeCourse.id];
  const content: LessonContent | undefined = bundle?.lessons[currentLesson.id];
  const activeQuiz: ModuleQuiz | undefined = bundle?.quizzes[activeQuizMod.id];
  const activePracticeSet: ModulePracticeSet | undefined = bundle?.practiceSets?.[activeQuizMod.id];

  const isLastLessonInModule =
    currentMeta.module.lessons[currentMeta.module.lessons.length - 1]?.id === currentLesson.id;

  const renderSidebar = () => (
    <>
      <div className="study-mobile-bar">
        <button
          ref={mobileMenuBtnRef}
          type="button"
          className="btn btn-secondary btn-sm study-mobile-menu-btn"
          aria-expanded={mobileModulesOpen}
          aria-controls="course-modules-drawer"
          onClick={() => setMobileModulesOpen((v) => !v)}
        >
          <Icon name="menu" size={15} />
          <span>Modules</span>
        </button>
        <span className="study-mobile-count tabular">
          {subView === "quiz"
            ? isPracticeSetCourse
              ? `Mod ${activeQuizMod.number} · ${activeQuizMod.practiceSetCount ?? 4} probs`
              : `Mod ${activeQuizMod.number} · ${activeQuizMod.quizCount ?? 10} Qs`
            : `Mod ${currentMeta.module.number} · ${currentMeta.index + 1}/${flatLessons.length}`}
        </span>
      </div>

      {mobileModulesOpen && (
        <button
          type="button"
          className="drawer-scrim"
          aria-label="Close course module list"
          onClick={() => {
            setMobileModulesOpen(false);
            window.requestAnimationFrame(() => mobileMenuBtnRef.current?.focus());
          }}
        />
      )}

      <aside
        id="course-modules-drawer"
        className={`course-sidebar ${mobileModulesOpen ? "is-mobile-open" : ""}`}
        aria-label="Course modules navigation"
      >
        <div className="course-sidebar-inner">
        <div className="course-sidebar-top">
          <button
            type="button"
            className="sidebar-back-btn"
            onClick={() => onSelectCourseOverview(activeCourse.id)}
          >
            <Icon name="chevron" size={14} strokeWidth={2} className="icon-chevron-left" />
            <span>{activeCourse.title}</span>
          </button>
          <button
            type="button"
            className="sidebar-collapse-btn"
            aria-label={sidebarOpen ? "Collapse course sidebar" : "Expand course sidebar"}
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Icon name="chevrons-left" size={16} strokeWidth={1.75} />
          </button>
          <button
            ref={mobileCloseBtnRef}
            type="button"
            className="sidebar-mobile-close"
            aria-label="Close module menu"
            onClick={() => {
              setMobileModulesOpen(false);
              window.requestAnimationFrame(() => mobileMenuBtnRef.current?.focus());
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="sidebar-search-box">
          <Icon name="search" size={14} />
          <input
            type="search"
            value={lessonFilter}
            onChange={(e) => setLessonFilter(e.target.value)}
            placeholder="Filter lessons"
            aria-label="Filter course lessons"
            autoComplete="off"
            spellCheck={false}
          />
          {lessonFilter && (
            <button
              type="button"
              className="sidebar-search-clear"
              aria-label="Clear lesson filter"
              onClick={() => setLessonFilter("")}
            >
              <Icon name="close" size={13} />
            </button>
          )}
        </div>

        <div className="course-module-tree">
          {(() => {
            const visibleEntries = activeCourse.modules
              .map((mod) => {
                const modMatches =
                  Boolean(normalizedQuery) &&
                  (mod.title.toLowerCase().includes(normalizedQuery) ||
                    mod.number.toLowerCase().includes(normalizedQuery));
                const filtered = modMatches
                  ? mod.lessons
                  : mod.lessons.filter(
                      (l) =>
                        !normalizedQuery ||
                        l.title.toLowerCase().includes(normalizedQuery) ||
                        l.summary.replace(/`/g, "").toLowerCase().includes(normalizedQuery),
                    );
                const quizMatches =
                  Boolean(normalizedQuery) &&
                  (normalizedQuery.includes("quiz") || normalizedQuery.includes("practice"));
                if (normalizedQuery && filtered.length === 0 && !modMatches && !quizMatches) {
                  return null;
                }
                return { mod, filtered };
              })
              .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

            if (visibleEntries.length === 0) {
              return (
                <p className="sidebar-empty-copy">
                  No lessons match &ldquo;{lessonFilter.trim()}&rdquo;.
                </p>
              );
            }

            return visibleEntries.map(({ mod, filtered }) => {
            const isOpen = isModuleExpanded(mod.id) || Boolean(normalizedQuery);
            const quizScore = progress.quizResults[mod.id];
            const mcqScore = progress.conceptualQuizResults?.[mod.id];
            const hasMcq = isPracticeSetCourse && Boolean(mod.quizCount && mod.quizCount > 0);
            const assessmentCount = mod.practiceSetCount ?? mod.quizCount ?? 0;
            const sidebarScoreText = hasMcq
              ? quizScore && mcqScore
                ? `${quizScore.score}/${quizScore.total} · ${mcqScore.score}/${mcqScore.total}`
                : quizScore
                  ? `${quizScore.score}/${quizScore.total}`
                  : mcqScore
                    ? `Q ${mcqScore.score}/${mcqScore.total}`
                    : null
              : quizScore
                ? `${quizScore.score}/${quizScore.total}`
                : null;

            return (
              <div key={mod.id} className="module-group">
                <button
                  type="button"
                  className="module-group-head"
                  aria-expanded={isOpen}
                  aria-controls={`sidebar-mod-${mod.id}`}
                  onClick={() => toggleModuleCollapse(mod)}
                >
                  <span>
                    {mod.number} {mod.title}
                  </span>
                  <Icon
                    name="chevron"
                    size={14}
                    className={isOpen ? "chevron-open" : "chevron-closed"}
                  />
                </button>

                <div
                  id={`sidebar-mod-${mod.id}`}
                  className={`accordion-collapse ${isOpen ? "is-open" : ""}`}
                  aria-hidden={!isOpen}
                  inert={!isOpen || undefined}
                >
                  <div className="accordion-collapse-inner">
                    <ul className="module-lesson-list">
                      {filtered.map((lesson) => {
                        const active = subView === "lesson" && lesson.id === currentLesson.id;
                        const done = completedSet.has(lesson.id);
                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              className={`module-lesson-item ${active ? "is-active" : ""} ${done ? "is-done" : ""}`}
                              onClick={() => onSelectLesson(activeCourse.id, lesson.id)}
                            >
                              <span className="lesson-rail-dot" aria-hidden="true">
                                {done && <Icon name="check" size={12} className="lesson-done-check" />}
                              </span>
                              <span className="lesson-item-title">{lesson.title}</span>
                            </button>
                          </li>
                        );
                      })}
                      <li>
                        <button
                          type="button"
                          className={`module-lesson-item is-quiz-nav ${
                            subView === "quiz" && activeQuizMod.id === mod.id ? "is-active" : ""
                          }`}
                          onClick={() => onSelectQuiz(activeCourse.id, mod.id, { tab: "practice" })}
                        >
                          <span className="lesson-rail-dot is-quiz" aria-hidden="true">
                            <Icon name="check-circle" size={13} />
                          </span>
                          <span className="lesson-item-title">
                            {isPracticeSetCourse && hasMcq
                              ? `Module ${mod.number} Practice & Quiz`
                              : isPracticeSetCourse
                                ? `Module ${mod.number} Practice Set (${assessmentCount})`
                                : `Module ${mod.number} Quiz (${assessmentCount} Q)`}
                          </span>
                          {sidebarScoreText && (
                            <span className="quiz-nav-score tabular">{sidebarScoreText}</span>
                          )}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            );
            });
          })()}
        </div>
        </div>
      </aside>
    </>
  );

  // 3. MODULE PRACTICE SET / STAGE QUIZ VIEW
  const hasQuizQuestions = Boolean(activeQuiz?.questions.length);

  if (subView === "quiz" && isPracticeSetCourse && quizAssessmentTab === "practice") {
    const problems = activePracticeSet?.problems ?? [];
    const problemIds = problems.map((p, idx) => p.id ?? `${activeQuizMod.id}-p${idx + 1}`);
    const savedSet = progress.quizResults[activeQuizMod.id];
    const missedLookup = new Set(savedSet?.missedIds ?? []);
    const solvedIds = new Set(
      savedSet
        ? problemIds.filter((pid, idx) => idx < savedSet.total && !missedLookup.has(pid))
        : [],
    );
    const activeProbIdx = Math.min(challengeTab, Math.max(0, problems.length - 1));
    const activeProb = problems[activeProbIdx];
    const activeProbId = problemIds[activeProbIdx];
    const isActiveProbSolved = Boolean(activeProbId && solvedIds.has(activeProbId));
    const nextModIdx = activeCourse.modules.findIndex((m) => m.id === activeQuizMod.id) + 1;
    const nextMod = activeCourse.modules[nextModIdx];
    const setPct = problems.length === 0 ? 0 : Math.round((solvedIds.size / problems.length) * 100);

    const toggleProblemSolved = (pid: string) => {
      const nextSolved = new Set(solvedIds);
      if (nextSolved.has(pid)) nextSolved.delete(pid);
      else nextSolved.add(pid);
      const unsolved = problemIds.filter((id) => !nextSolved.has(id));
      onSaveQuizResult(
        activeQuizMod.id,
        {
          score: nextSolved.size,
          total: problemIds.length,
          missedIds: unsolved,
        },
        { label: "Practice set" },
      );
    };

    return (
      <div className={`study-workspace ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        {renderSidebar()}

        <article
          key={`pset-${activeQuizMod.id}`}
          className="lesson-main view-enter"
          inert={mobileModulesOpen || undefined}
        >
          <header className="lesson-header">
            <div className="lesson-breadcrumb tabular">
              <span className="lesson-breadcrumb-lead">
                {!sidebarOpen && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm reopen-sidebar-btn"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Icon name="menu" size={14} /> Modules
                  </button>
                )}
                <span>
                  {!sidebarOpen ? `${activeCourse.title} · ` : ""}Module {activeQuizMod.number} · {activeQuizMod.title}
                </span>
              </span>
              <span>{problems.length || activeQuizMod.practiceSetCount || 4} mixed problems</span>
            </div>
            <h1>{activePracticeSet?.title ?? `Module ${activeQuizMod.number} Practice Set`}</h1>
            <p className="lesson-subtitle">
              {renderInlineRich(activePracticeSet?.description ?? activeQuizMod.summary)}
            </p>
            {problems.length > 0 && (
              <div className="overview-progress-bar">
                <div className="progress-track">
                  <div className="progress-fill" style={{ transform: `scaleX(${setPct / 100})` }} />
                </div>
                <span className="tabular">
                  {solvedIds.size} / {problems.length} solved ({setPct}%)
                </span>
              </div>
            )}
            {hasQuizQuestions && activeQuiz && (
              <div className="lab-pill-row" role="tablist" aria-label="Module assessment mode">
                <button
                  id={`${practiceTabBaseId}-mode-practice`}
                  type="button"
                  role="tab"
                  aria-selected
                  aria-controls={`${practiceTabBaseId}-mode-panel`}
                  tabIndex={0}
                  className="lab-pill-btn is-active"
                  onClick={() => selectQuizTab("practice")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "End" || e.key === "Home") {
                      e.preventDefault();
                      selectQuizTab("mcq");
                    }
                  }}
                >
                  Practice set ({problems.length || 4} problems)
                </button>
                <button
                  id={`${practiceTabBaseId}-mode-mcq`}
                  type="button"
                  role="tab"
                  aria-selected={false}
                  aria-controls={`${practiceTabBaseId}-mode-panel`}
                  tabIndex={-1}
                  className="lab-pill-btn"
                  onClick={() => selectQuizTab("mcq")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                      e.preventDefault();
                      selectQuizTab("practice");
                    }
                  }}
                >
                  Conceptual quiz ({activeQuiz.questions.length} Qs)
                </button>
              </div>
            )}
          </header>

          {activePracticeSet && activeProb && activeProbId ? (
            <section
              id={`${practiceTabBaseId}-mode-panel`}
              role={hasQuizQuestions && activeQuiz ? "tabpanel" : undefined}
              aria-labelledby={hasQuizQuestions && activeQuiz ? `${practiceTabBaseId}-mode-practice` : undefined}
              className="practice-card"
            >
              <div className="practice-card-head">
                <div>
                  <h2>Mixed problem set</h2>
                  <p className="practice-meta tabular">
                    Pattern names are hidden until you reveal Pattern hint · solve in your own editor
                  </p>
                </div>
                <button
                  type="button"
                  className={`btn btn-sm ${isActiveProbSolved ? "btn-success" : "btn-primary"}`}
                  onClick={() => toggleProblemSolved(activeProbId)}
                >
                  <Icon name="check" size={15} />
                  <span>{isActiveProbSolved ? "Solved" : "Mark solved"}</span>
                </button>
              </div>

              {problems.length > 1 && (
                <div className="lab-pill-row" role="tablist" aria-label="Module practice problems">
                  {problems.map((prob, pIdx) => {
                    const pid = problemIds[pIdx];
                    const selected = pIdx === activeProbIdx;
                    const probDone = solvedIds.has(pid);
                    const diff = resolveChallengeDifficulty(prob.tier, true, pIdx, problems.length);
                    return (
                      <button
                        key={pid}
                        id={`${practiceTabBaseId}-pset-tab-${pIdx}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls={`${practiceTabBaseId}-pset-panel`}
                        tabIndex={selected ? 0 : -1}
                        className={`lab-pill-btn ${selected ? "is-active" : ""}`}
                        onClick={() => setChallengeTab(pIdx)}
                        onKeyDown={(e) => handleTabKeyDown(e, pIdx, problems.length, setChallengeTab)}
                      >
                        {`P${pIdx + 1}${diff ? ` · ${diff.label}` : ""}${probDone ? " ✓" : ""}`}
                      </button>
                    );
                  })}
                </div>
              )}

              <div
                key={`${activeQuizMod.id}-pset-${activeProbIdx}`}
                id={`${practiceTabBaseId}-pset-panel`}
                role="tabpanel"
                aria-labelledby={`${practiceTabBaseId}-pset-tab-${activeProbIdx}`}
                className="practice-panel-body panel-swap-enter"
              >
                <PracticeChallengeBody
                  challenge={activeProb}
                  challengeIndex={activeProbIdx}
                  challengeTotal={problems.length}
                  isDsa={activeCourse.id === "dsa"}
                  showHint={Boolean(openHints[activeProbIdx])}
                  onToggleHint={() =>
                    setOpenHints((prev) => ({ ...prev, [activeProbIdx]: !prev[activeProbIdx] }))
                  }
                  showSolution={Boolean(openSolutions[activeProbIdx])}
                  onToggleSolution={() =>
                    setOpenSolutions((prev) => ({ ...prev, [activeProbIdx]: !prev[activeProbIdx] }))
                  }
                  showPatternHint={Boolean(openPatternHints[activeProbIdx])}
                  onTogglePatternHint={() =>
                    setOpenPatternHints((prev) => ({ ...prev, [activeProbIdx]: !prev[activeProbIdx] }))
                  }
                  onRevisitLesson={(lessonId) => onSelectLesson(activeCourse.id, lessonId)}
                />
              </div>

              {nextMod && solvedIds.size === problems.length && (
                <div className="module-quiz-callout">
                  <div>
                    <h3>Module {activeQuizMod.number} Practice Set complete</h3>
                    <p>You solved every problem in this set. Move forward when ready.</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onSelectLesson(activeCourse.id, nextMod.lessons[0].id)}
                  >
                    Start Module {nextMod.number}
                  </button>
                </div>
              )}
            </section>
          ) : bundleError ? (
            <div className="loading-card">
              <span>Could not load the module practice set. Check your connection and retry.</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setBundleError(false);
                  setBundleAttempt((n) => n + 1);
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="loading-card">Loading module practice set...</div>
          )}

          <nav className="lesson-bottom-nav" aria-label="Module practice navigation">
            <button
              type="button"
              className="bottom-nav-card is-prev"
              onClick={() =>
                onSelectLesson(
                  activeCourse.id,
                  activeQuizMod.lessons[activeQuizMod.lessons.length - 1].id,
                )
              }
            >
              <span className="bottom-nav-dir">
                <Icon name="chevron" size={13} strokeWidth={2} className="icon-chevron-left" />
                <span>Last lesson</span>
              </span>
              <strong>{activeQuizMod.lessons[activeQuizMod.lessons.length - 1].title}</strong>
            </button>
            {nextMod && (
              <button
                type="button"
                className="bottom-nav-card is-next"
                onClick={() => onSelectLesson(activeCourse.id, nextMod.lessons[0].id)}
              >
                <span className="bottom-nav-dir">
                  <span>Next module</span>
                  <Icon name="chevron" size={13} strokeWidth={2} />
                </span>
                <strong>{nextMod.number} {nextMod.title}</strong>
              </button>
            )}
          </nav>
        </article>
      </div>
    );
  }

  if (subView === "quiz") {
    const questions = activeQuiz?.questions ?? [];
    const answeredCount = questions.filter((q) => Boolean(quizAnswers[q.id])).length;
    const score = questions.filter((q) => quizAnswers[q.id] === q.correctId).length;
    const missed = questions.filter((q) => quizAnswers[q.id] !== q.correctId);
    const savedQuiz = isPracticeSetCourse
      ? progress.conceptualQuizResults?.[activeQuizMod.id]
      : progress.quizResults[activeQuizMod.id];
    const nextModIdx = activeCourse.modules.findIndex((m) => m.id === activeQuizMod.id) + 1;
    const nextMod = activeCourse.modules[nextModIdx];

    const submitQuiz = () => {
      setQuizSubmitted(true);
      const payload = {
        score,
        total: questions.length,
        missedIds: missed.map((q) => q.id),
      };
      if (isPracticeSetCourse) {
        onSaveConceptualQuizResult(activeQuizMod.id, payload, { label: "Conceptual quiz" });
      } else {
        onSaveQuizResult(activeQuizMod.id, payload);
      }
    };

    return (
      <div className={`study-workspace ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        {renderSidebar()}

        <article
          key={`quiz-${activeQuizMod.id}`}
          className="lesson-main view-enter"
          inert={mobileModulesOpen || undefined}
        >
          <header className="lesson-header">
            <div className="lesson-breadcrumb tabular">
              <span className="lesson-breadcrumb-lead">
                {!sidebarOpen && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm reopen-sidebar-btn"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Icon name="menu" size={14} /> Modules
                  </button>
                )}
                <span>
                  {!sidebarOpen ? `${activeCourse.title} · ` : ""}Module {activeQuizMod.number} · {activeQuizMod.title}
                </span>
              </span>
              <span>{questions.length || activeQuizMod.quizCount} questions</span>
            </div>
            <h1>{activeQuiz?.title ?? `Module ${activeQuizMod.number} Quiz`}</h1>
            <p className="lesson-subtitle">
              {renderInlineRich(activeQuiz?.description ?? activeQuizMod.summary)}
            </p>
            {savedQuiz && !quizSubmitted && (
              <p className="quiz-saved-banner tabular">
                Previous saved score: <strong>{savedQuiz.score}/{savedQuiz.total}</strong> ({Math.round((savedQuiz.score / savedQuiz.total) * 100)}%)
              </p>
            )}
            {isPracticeSetCourse && activePracticeSet && (
              <div className="lab-pill-row" role="tablist" aria-label="Module assessment mode">
                <button
                  id={`${practiceTabBaseId}-mode-practice`}
                  type="button"
                  role="tab"
                  aria-selected={false}
                  aria-controls={`${practiceTabBaseId}-mode-panel`}
                  tabIndex={-1}
                  className="lab-pill-btn"
                  onClick={() => selectQuizTab("practice")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                      e.preventDefault();
                      selectQuizTab("mcq");
                    }
                  }}
                >
                  Practice set ({activePracticeSet.problems.length} problems)
                </button>
                <button
                  id={`${practiceTabBaseId}-mode-mcq`}
                  type="button"
                  role="tab"
                  aria-selected
                  aria-controls={`${practiceTabBaseId}-mode-panel`}
                  tabIndex={0}
                  className="lab-pill-btn is-active"
                  onClick={() => selectQuizTab("mcq")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                      e.preventDefault();
                      selectQuizTab("practice");
                    }
                  }}
                >
                  Conceptual quiz ({questions.length} Qs)
                </button>
              </div>
            )}
          </header>

          {activeQuiz ? (
            <div
              id={`${practiceTabBaseId}-mode-panel`}
              role={isPracticeSetCourse && activePracticeSet ? "tabpanel" : undefined}
              aria-labelledby={isPracticeSetCourse && activePracticeSet ? `${practiceTabBaseId}-mode-mcq` : undefined}
              className="quiz-stack"
            >
              {quizSubmitted && (
                <div
                  ref={quizBannerRef}
                  tabIndex={-1}
                  className={`quiz-score-banner ${score / Math.max(1, questions.length) >= QUIZ_PASS_THRESHOLD ? "is-pass" : "is-review"}`}
                >
                  <div>
                    <h2 className="tabular">
                      You scored {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
                    </h2>
                    <p>
                      {missed.length === 0
                        ? "You answered every question correctly."
                        : `Review the ${missed.length} highlighted question${missed.length > 1 ? "s" : ""} below and open any lesson you want to revisit.`}
                    </p>
                  </div>
                  <div className="quiz-result-actions">
                    <button
                      type="button"
                      className={`btn btn-sm ${confirmRetake ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => {
                        if (!confirmRetake) {
                          setConfirmRetake(true);
                          return;
                        }
                        setConfirmRetake(false);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                    >
                      {confirmRetake ? "Confirm reset quiz" : "Retake quiz"}
                    </button>
                    {nextMod && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectLesson(activeCourse.id, nextMod.lessons[0].id)}
                      >
                        Start Module {nextMod.number}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {questions.map((q, qIdx) => {
                const chosen = quizAnswers[q.id];
                const isRight = chosen === q.correctId;
                const refLesson = q.lessonRefId
                  ? flatLessons.find((f) => f.lesson.id === q.lessonRefId)?.lesson
                  : undefined;
                const compactOpts = q.options.every((o) => o.label.length <= 28);

                return (
                  <section id={`quiz-q-${q.id}`} key={q.id} className="quiz-question-card">
                    <div className="quiz-q-head">
                      <span className="quiz-q-num tabular">Question {qIdx + 1} of {questions.length}</span>
                      {quizSubmitted && (
                        <span className={`quiz-q-badge ${isRight ? "is-right" : "is-wrong"}`}>
                          {isRight ? "Correct" : "Missed"}
                        </span>
                      )}
                    </div>
                    <h2>{renderInlineRich(q.prompt)}</h2>
                    {q.code && (
                      <pre className="predict-code">
                        <code>{q.code}</code>
                      </pre>
                    )}

                    <div
                      className={`predict-options ${compactOpts ? "is-compact-grid" : ""}`}
                      role="radiogroup"
                      aria-label={`Question ${qIdx + 1} options`}
                    >
                      {q.options.map((opt, oIdx) => {
                        const selected = chosen === opt.id;
                        const optTone = quizSubmitted
                          ? opt.id === q.correctId
                            ? "is-correct"
                            : selected
                              ? "is-wrong"
                              : ""
                          : selected
                            ? "is-selected"
                            : "";
                        return (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            tabIndex={selected || (!chosen && oIdx === 0) ? 0 : -1}
                            key={opt.id}
                            disabled={quizSubmitted}
                            className={`predict-option ${optTone}`}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                            onKeyDown={(e) => {
                              if (quizSubmitted) return;
                              const radios = Array.from(
                                e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
                              );
                              let nextIdx = -1;
                              if (e.key === "ArrowDown" || e.key === "ArrowRight") nextIdx = (oIdx + 1) % q.options.length;
                              else if (e.key === "ArrowUp" || e.key === "ArrowLeft") nextIdx = (oIdx - 1 + q.options.length) % q.options.length;
                              else if (e.key === "Home") nextIdx = 0;
                              else if (e.key === "End") nextIdx = q.options.length - 1;
                              if (nextIdx >= 0) {
                                e.preventDefault();
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: q.options[nextIdx].id }));
                                radios[nextIdx]?.focus();
                              }
                            }}
                          >
                            <span className="opt-letter">{opt.id.toUpperCase()}</span>
                            <span className="opt-label-text">{renderInlineRich(opt.label)}</span>
                            {quizSubmitted && opt.id === q.correctId && (
                              <Icon name="check" size={14} className="opt-status-icon is-right" />
                            )}
                            {quizSubmitted && selected && opt.id !== q.correctId && (
                              <Icon name="close" size={14} className="opt-status-icon is-wrong" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="predict-feedback">
                        <strong>Explanation:</strong> {renderInlineRich(q.explanation)}
                        {refLesson && !isRight && (
                          <div className="quiz-review-link-row">
                            <button
                              type="button"
                              className="text-link-btn"
                              onClick={() => onSelectLesson(activeCourse.id, refLesson.id)}
                            >
                              Revisit &quot;{refLesson.title}&quot;
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                );
              })}

              {!quizSubmitted && (
                <div className="quiz-submit-bar">
                  <div className="quiz-submit-meta">
                    <span className="tabular">
                      Answered {answeredCount} of {questions.length} questions
                    </span>
                    {answeredCount < questions.length ? (
                      <button
                        type="button"
                        className="text-link-btn"
                        onClick={() => {
                          const firstUnanswered = questions.find((q) => !quizAnswers[q.id]);
                          if (!firstUnanswered) return;
                          const reduced =
                            typeof window !== "undefined" &&
                            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                          document
                            .getElementById(`quiz-q-${firstUnanswered.id}`)
                            ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
                        }}
                      >
                        Answer {questions.length - answeredCount} remaining to submit · Jump to next
                      </button>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={answeredCount < questions.length}
                    title={
                      answeredCount < questions.length
                        ? `Answer ${questions.length - answeredCount} remaining question${questions.length - answeredCount === 1 ? "" : "s"} first`
                        : undefined
                    }
                    onClick={submitQuiz}
                  >
                    Submit module quiz
                  </button>
                </div>
              )}

              <nav className="lesson-bottom-nav" aria-label="Module quiz navigation">
                <button
                  type="button"
                  className="bottom-nav-card is-prev"
                  onClick={() =>
                    onSelectLesson(
                      activeCourse.id,
                      activeQuizMod.lessons[activeQuizMod.lessons.length - 1].id,
                    )
                  }
                >
                  <span className="bottom-nav-dir">
                    <Icon name="chevron" size={13} strokeWidth={2} className="icon-chevron-left" />
                    <span>Last lesson</span>
                  </span>
                  <strong>{activeQuizMod.lessons[activeQuizMod.lessons.length - 1].title}</strong>
                </button>
                {nextMod && (
                  <button
                    type="button"
                    className="bottom-nav-card is-next"
                    onClick={() => onSelectLesson(activeCourse.id, nextMod.lessons[0].id)}
                  >
                    <span className="bottom-nav-dir">
                      <span>Next module</span>
                      <Icon name="chevron" size={13} strokeWidth={2} />
                    </span>
                    <strong>{nextMod.number} {nextMod.title}</strong>
                  </button>
                )}
              </nav>
            </div>
          ) : bundleError ? (
            <div className="loading-card">
              <span>Could not load the module quiz. Check your connection and retry.</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setBundleError(false);
                  setBundleAttempt((n) => n + 1);
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="loading-card">Loading module quiz...</div>
          )}
        </article>
      </div>
    );
  }

  // 4. FOCUSED GUIDED LESSON VIEW
  const steps = content?.walkthrough?.steps ?? [];
  const safeStepIndex = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const currentStep = steps[safeStepIndex];
  const prevStep =
    stepNav.prevIndex !== null &&
    stepNav.prevIndex !== safeStepIndex &&
    stepNav.prevIndex >= 0 &&
    stepNav.prevIndex < steps.length
      ? steps[stepNav.prevIndex]
      : undefined;
  const nextStep = safeStepIndex < steps.length - 1 ? steps[safeStepIndex + 1] : undefined;
  const isVisualFirstWalkthrough = content?.walkthrough?.layout === "visual-first";
  const isDone = completedSet.has(currentLesson.id);
  const isPracticeDone = practiceSet.has(currentLesson.id);
  const prevLesson = currentMeta.index > 0 ? flatLessons[currentMeta.index - 1]?.lesson : null;
  const nextLesson =
    currentMeta.index < flatLessons.length - 1 ? flatLessons[currentMeta.index + 1]?.lesson : null;

  const predictList = content
    ? content.predictChecks && content.predictChecks.length > 0
      ? content.predictChecks
      : content.predictCheck
        ? [content.predictCheck]
        : []
    : [];
  const rawChallenges = content ? [content.practiceTask, ...(content.practiceChallenges ?? [])] : [];
  const challengeList = rawChallenges.filter(
    (ch, idx) => rawChallenges.findIndex((other) => other.title === ch.title) === idx,
  );
  const activeChallengeIdx = Math.min(challengeTab, Math.max(0, challengeList.length - 1));
  const activeChallenge = challengeList[activeChallengeIdx];

  const jumpLinks = [
    ...(content?.intro ? [{ id: "lesson-intro", label: "Overview" }] : []),
    ...(content ? [{ id: "lesson-guide", label: "Guide" }] : []),
    ...(currentStep ? [{ id: "lesson-trace", label: "Walkthrough" }] : []),
    ...(content?.trickyPoints?.length ? [{ id: "lesson-traps", label: "Traps" }] : []),
    ...(predictList.length > 0
      ? [{ id: "lesson-checks", label: `Checks (${predictList.length})` }]
      : []),
    ...(challengeList.length > 0 ? [{ id: "lesson-practice", label: `Practice (${challengeList.length})` }] : []),
  ];

  const jumpToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const stepVisualKey = currentStep?.visual
    ? [
        "operator-lab",
        "type-cast-lab",
        "slice-explorer",
        "loop-stepper",
        "memory-sim",
        "async-timeline",
        "regex-lab",
      ].includes(currentStep.visual.kind)
      ? `${currentLesson.id}-step-${currentStep.visual.kind}-${safeStepIndex}`
      : `${currentLesson.id}-step-${currentStep.visual.kind}`
    : undefined;

  const stripInlineCodeTicks = (text: string) => text.replace(/`([^`]+)`/g, "$1");

  const walkthroughSection = currentStep ? (
    <section id="lesson-trace" ref={stepperCardRef} className="lesson-stepper-card">
      <div className="stepper-head-wrap">
        <div className="stepper-top-bar">
          <div className="stepper-title-col">
            <strong>
              {content?.walkthrough?.title ? renderInlineRich(content.walkthrough.title) : "Execution trace"}
            </strong>
          </div>
          <div className="stepper-top-actions">
            {steps.length > 1 && (
              <div className="stepper-playback-group">
                <button
                  type="button"
                  className={`lab-pill-btn ${isPlayingSteps ? "is-active" : ""}`}
                  aria-pressed={isPlayingSteps}
                  onClick={() => {
                    if (isPlayingSteps) {
                      setIsPlayingSteps(false);
                      return;
                    }
                    if (safeStepIndex >= steps.length - 1) {
                      goToStep(0);
                    }
                    ensureStageVisible();
                    setIsPlayingSteps(true);
                  }}
                >
                  <Icon name={isPlayingSteps ? "pause" : "play"} size={12} />
                  <span>{isPlayingSteps ? "Pause" : "Play"}</span>
                </button>
                <button
                  type="button"
                  className="lab-pill-btn stepper-speed-btn tabular"
                  aria-label={`Playback speed ${playSpeed}x. Click to change.`}
                  title="Change playback speed"
                  onClick={() =>
                    setPlaySpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))
                  }
                >
                  {playSpeed}x
                </button>
              </div>
            )}
            <div className="stepper-nav-cluster">
              {steps.length > 1 && (
                <button
                  type="button"
                  className="stepper-nav-btn"
                  disabled={safeStepIndex === 0}
                  aria-label={
                    prevStep ? `Previous step: ${stripInlineCodeTicks(prevStep.title)}` : "Previous step"
                  }
                  title={prevStep ? `Prev: ${stripInlineCodeTicks(prevStep.title)}` : "Previous step"}
                  onClick={() => {
                    setIsPlayingSteps(false);
                    goToStep((i) => Math.max(0, i - 1));
                    ensureStageVisible();
                  }}
                >
                  <Icon name="chevron" size={14} className="icon-flip-x" />
                </button>
              )}
              <div className="step-dots" role="tablist" aria-label="Walkthrough steps">
                {steps.map((s, idx) => {
                  const isActive = idx === safeStepIndex;
                  const isDoneStep = idx < safeStepIndex;
                  const cleanTitle = stripInlineCodeTicks(s.title);
                  return (
                    <button
                      type="button"
                      key={`${s.title}-${idx}`}
                      id={`walkthrough-tab-${idx}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="walkthrough-step-panel"
                      aria-label={`Step ${idx + 1}: ${cleanTitle}`}
                      title={`Step ${idx + 1}: ${cleanTitle}`}
                      tabIndex={isActive ? 0 : -1}
                      className={`step-tab ${isActive ? "is-active" : ""} ${
                        isDoneStep ? "is-done" : ""
                      }`}
                      onClick={() => {
                        setIsPlayingSteps(false);
                        goToStep(idx);
                        ensureStageVisible();
                      }}
                      onKeyDown={(e) =>
                        handleTabKeyDown(e, idx, steps.length, (nextIdx) => {
                          setIsPlayingSteps(false);
                          goToStep(nextIdx, "keyboard");
                          ensureStageVisible();
                        })
                      }
                    >
                      <span className="step-tab-num tabular">{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
              {steps.length > 1 && (
                <>
                  <button
                    type="button"
                    className="stepper-nav-btn"
                    disabled={safeStepIndex >= steps.length - 1}
                    aria-label={
                      nextStep ? `Next step: ${stripInlineCodeTicks(nextStep.title)}` : "Next step"
                    }
                    title={nextStep ? `Next: ${stripInlineCodeTicks(nextStep.title)}` : "Last step"}
                    onClick={() => {
                      setIsPlayingSteps(false);
                      goToStep((i) => Math.min(steps.length - 1, i + 1));
                      ensureStageVisible();
                    }}
                  >
                    <Icon name="chevron" size={14} />
                  </button>
                  <span className="stepper-compact-count tabular" aria-hidden="true">
                    {safeStepIndex + 1}/{steps.length}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        {steps.length > 1 && (
          <div className="stepper-progress-rail" aria-hidden="true">
            <div
              className="stepper-progress-fill"
              style={{ transform: `scaleX(${(safeStepIndex + 1) / steps.length})` }}
            />
          </div>
        )}
      </div>

      <div
        key={currentLesson.id}
        id="walkthrough-step-panel"
        className="step-body"
        role="tabpanel"
        aria-labelledby={`walkthrough-tab-${safeStepIndex}`}
      >
        {isVisualFirstWalkthrough && currentStep.visual && (
          <div className="step-visual-col is-pinned-stage">
            <LessonVisualRenderer
              key={stepVisualKey}
              visual={currentStep.visual}
            />
          </div>
        )}

        <div
          key={`${currentLesson.id}-copy-${safeStepIndex}`}
          className={stepNav.dir === "instant" ? "" : `panel-swap-enter is-${stepNav.dir}`}
        >
          <div className="step-heading-row">
            <h2>{renderInlineRich(currentStep.title)}</h2>
          </div>

          <div className="step-prose">{renderParagraphs(currentStep.explanation)}</div>
        </div>

        {!isVisualFirstWalkthrough && currentStep.callout && (
          <div className={`lesson-callout callout-${currentStep.callout.kind.toLowerCase().replace(/\s+/g, "-")}`}>
            <strong>{currentStep.callout.kind}</strong>
            <p>{renderInlineRich(currentStep.callout.text)}</p>
          </div>
        )}

        {(currentStep.code || (!isVisualFirstWalkthrough && currentStep.visual)) && (
          <div
            className={`step-stage ${currentStep.code && !isVisualFirstWalkthrough && currentStep.visual ? "is-split" : ""} ${
              isVisualFirstWalkthrough ? "is-visual-first" : ""
            }`}
          >
            {currentStep.code && (() => {
              const hasAlt = Boolean(currentStep.altCode);
              const usingAlt = hasAlt && stepCodeTab === "alt" && currentStep.altCode;
              const shownLines = usingAlt ? usingAlt.lines : currentStep.code;
              const shownActive = usingAlt ? usingAlt.activeLines : currentStep.activeLines;
              const distinctStepCodes = new Set(
                steps.filter((s) => s.code && s.code.length > 0).map((s) => s.code!.join("\n")),
              ).size;
              const rawLabel = usingAlt
                ? usingAlt.label
                : (currentStep.codeLabel ?? (activeCourse.id === "dsa" ? "Pseudocode" : "Python 3 · Trace"));
              const shownLabel =
                !usingAlt && activeCourse.id === "dsa" && rawLabel === "Pseudocode"
                  ? distinctStepCodes <= 1
                    ? "Main algorithm · Pseudocode"
                    : "Step trace · Pseudocode"
                  : rawLabel;

              return (
                <div className={`step-code-col ${isVisualFirstWalkthrough ? "is-visual-first-strip" : ""}`}>
                  <div className="step-code-panel-wrap">
                    {hasAlt && currentStep.altCode && (
                      <div className="code-lang-switch" role="tablist" aria-label="Code notation">
                        <button
                          id={`${practiceTabBaseId}-code-primary`}
                          type="button"
                          role="tab"
                          aria-selected={stepCodeTab === "primary"}
                          aria-controls={`${practiceTabBaseId}-code-panel`}
                          tabIndex={stepCodeTab === "primary" ? 0 : -1}
                          className={`lab-pill-btn ${stepCodeTab === "primary" ? "is-active" : ""}`}
                          onClick={() => setStepCodeTab("primary")}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                              e.preventDefault();
                              setStepCodeTab("alt");
                              (e.currentTarget.nextElementSibling as HTMLButtonElement | null)?.focus();
                            }
                          }}
                        >
                          {currentStep.codeLabel ?? "Pseudocode"}
                        </button>
                        <button
                          id={`${practiceTabBaseId}-code-alt`}
                          type="button"
                          role="tab"
                          aria-selected={stepCodeTab === "alt"}
                          aria-controls={`${practiceTabBaseId}-code-panel`}
                          tabIndex={stepCodeTab === "alt" ? 0 : -1}
                          className={`lab-pill-btn ${stepCodeTab === "alt" ? "is-active" : ""}`}
                          onClick={() => setStepCodeTab("alt")}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                              e.preventDefault();
                              setStepCodeTab("primary");
                              (e.currentTarget.previousElementSibling as HTMLButtonElement | null)?.focus();
                            }
                          }}
                        >
                          {currentStep.altCode.label}
                        </button>
                      </div>
                    )}
                    <div
                      id={`${practiceTabBaseId}-code-panel`}
                      role={hasAlt ? "tabpanel" : undefined}
                      aria-labelledby={
                        hasAlt
                          ? `${practiceTabBaseId}-code-${stepCodeTab === "alt" ? "alt" : "primary"}`
                          : undefined
                      }
                    >
                      <LineCodePanel
                        lines={shownLines}
                        label={shownLabel}
                        activeLines={shownActive}
                        subgoals={usingAlt ? undefined : currentStep.subgoals}
                      />
                    </div>
                  </div>
                  {(currentStep.state?.length || currentStep.output) && (
                    <div className="step-state-col">
                      {currentStep.state && currentStep.state.length > 0 && (
                        <StateChips
                          title="Values at this step"
                          items={currentStep.state}
                          prevItems={prevStep?.state}
                        />
                      )}
                      <OutputStrip title="Output so far" output={currentStep.output} />
                    </div>
                  )}
                </div>
              );
            })()}

            {!isVisualFirstWalkthrough && currentStep.visual && (
              <div className="step-visual-col">
                <LessonVisualRenderer
                  key={stepVisualKey}
                  visual={currentStep.visual}
                />
              </div>
            )}
          </div>
        )}

        {isVisualFirstWalkthrough && currentStep.callout && (
          <div className={`lesson-callout callout-${currentStep.callout.kind.toLowerCase().replace(/\s+/g, "-")}`}>
            <strong>{currentStep.callout.kind}</strong>
            <p>{renderInlineRich(currentStep.callout.text)}</p>
          </div>
        )}
      </div>
    </section>
  ) : null;

  const guideSection = content ? (
    <div id="lesson-guide" className="lesson-sections-flow">
      {content.sections.map((sec, sIdx) => (
        <section key={`${currentLesson.id}-sec-${sIdx}`} className="guided-section">
          <h2>{renderInlineRich(sec.heading)}</h2>
          <div className="step-prose">{renderParagraphs(sec.paragraphs)}</div>

          {sec.code && (
            <LineCodePanel
              lines={sec.code}
              label={
                activeCourse.id === "dsa" && (!sec.codeLabel || sec.codeLabel === "Pseudocode")
                  ? sIdx === 0
                    ? "Main reference · Pseudocode"
                    : "Related pattern · Pseudocode"
                  : sec.codeLabel
              }
            />
          )}

          {sec.output && sec.predictOutput ? (
            <SectionPredictOutput
              key={`${currentLesson.id}-pred-out-${sIdx}`}
              output={sec.output}
              predictOutput={sec.predictOutput}
            />
          ) : (
            <OutputStrip title="Sample output" output={sec.output} />
          )}

          {sec.contextTabs && (
            <ContextTabsView key={`${currentLesson.id}-ctx-${sIdx}`} group={sec.contextTabs} />
          )}

          {sec.table && <ReferenceTableView table={sec.table} />}

          {sec.visual && (
            <div className="section-visual-box">
              <LessonVisualRenderer key={`${currentLesson.id}-vis-${sIdx}`} visual={sec.visual} />
            </div>
          )}

          {sec.deepDive && sec.deepDive.length > 0 && (
            <DeepDiveAccordion items={sec.deepDive} />
          )}

          {sec.callout && (
            <div className={`lesson-callout callout-${sec.callout.kind.toLowerCase().replace(/\s+/g, "-")}`}>
              <strong>{sec.callout.kind}</strong>
              <p>{renderInlineRich(sec.callout.text)}</p>
            </div>
          )}

          {sec.microCheck && (
            <SectionMicroCheck
              key={`${currentLesson.id}-micro-${sIdx}`}
              check={sec.microCheck}
              labelId={`${currentLesson.id}-micro-${sIdx}-lbl`}
            />
          )}
        </section>
      ))}

      {content.guidedBuildUp && (
        <GuidedBuildUpCard key={currentLesson.id} buildUp={content.guidedBuildUp} />
      )}
    </div>
  ) : bundleError ? (
    <div className="loading-card">
      <span>Could not load this lesson guide. Check your connection and retry.</span>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => {
          setBundleError(false);
          setBundleAttempt((n) => n + 1);
        }}
      >
        Retry
      </button>
    </div>
  ) : (
    <div className="loading-card">Loading lesson guide...</div>
  );

  return (
    <div className={`study-workspace ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      {renderSidebar()}

      <article
        key={`lesson-${currentLesson.id}`}
        className={`lesson-main view-enter ${isVisualFirstWalkthrough ? "is-visual-first" : ""}`}
        inert={mobileModulesOpen || undefined}
      >
        <header className="lesson-header">
          <div className="lesson-breadcrumb tabular">
            <span className="lesson-breadcrumb-lead">
              {!sidebarOpen && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm reopen-sidebar-btn"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Icon name="menu" size={14} /> Modules
                </button>
              )}
              <span>
                {!sidebarOpen ? `${activeCourse.title} · ` : ""}Module {currentMeta.module.number} · {currentMeta.module.title}
              </span>
            </span>
            <span>
              Lesson {currentMeta.index + 1} of {flatLessons.length} · ~{currentLesson.estimatedMinutes} min
            </span>
          </div>

          <h1>{currentLesson.title}</h1>
          <p className="lesson-subtitle">
            {renderInlineRich(content?.subtitle ?? currentLesson.summary)}
          </p>

          <div className="lesson-quick-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              aria-expanded={notesOpen}
              aria-controls="lesson-note-drawer"
              onClick={() => {
                if (notesOpen && isNoteDirty) {
                  onSaveNote(currentLesson.id, noteDraft, confidenceDraft, { silent: true });
                  pendingNoteRef.current = null;
                }
                setNotesOpen((v) => !v);
              }}
            >
              <Icon name="edit" size={15} />
              <span>{notesOpen ? "Hide note" : hasStoredNote ? "View note" : "Add note"}</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onStartTimerForLesson(activeCourse.id, currentLesson.id, currentLesson.title)}
            >
              <Icon name="clock" size={15} />
              <span>Focus timer</span>
            </button>
          </div>
        </header>

        {/* Inline Personal Note Drawer directly under header actions */}
        {notesOpen && (
          <section id="lesson-note-drawer" className="lesson-note-card" aria-label="Lesson notes">
            <div className="note-card-head">
              <h2>Your note & confidence</h2>
              <div className="confidence-pills" role="group" aria-label="Confidence level">
                {(["learning", "shaky", "solid"] as ConfidenceLevel[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    aria-pressed={confidenceDraft === lvl}
                    className={`conf-pill ${confidenceDraft === lvl ? "is-selected" : ""}`}
                    onClick={() => {
                      setConfidenceDraft(lvl);
                      const dirty = noteDraft.trim() !== existingNote.note.trim() || lvl !== existingNote.confidence;
                      pendingNoteRef.current = dirty
                        ? { lessonId: currentLesson.id, note: noteDraft, confidence: lvl }
                        : null;
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <label htmlFor={noteInputId} className="visually-hidden">
              Lesson note
            </label>
            <textarea
              id={noteInputId}
              rows={3}
              value={noteDraft}
              onChange={(e) => {
                const next = e.target.value;
                setNoteDraft(next);
                const dirty = next.trim() !== existingNote.note.trim() || confidenceDraft !== existingNote.confidence;
                pendingNoteRef.current = dirty
                  ? { lessonId: currentLesson.id, note: next, confidence: confidenceDraft }
                  : null;
              }}
              placeholder="Write the concept in your own words or flag what to revisit..."
            />
            <div className="note-card-actions">
              <span className={`note-status-chip ${isNoteDirty ? "is-dirty" : "is-saved"}`}>
                {isNoteDirty ? "Saving locally…" : hasStoredNote ? "Saved locally" : "Auto-saves locally"}
              </span>
            </div>
          </section>
        )}

        {jumpLinks.length > 1 && (
          <nav className="lesson-jump-nav" aria-label="Lesson sections">
            {jumpLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                className="lesson-jump-link"
                onClick={() => jumpToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {content?.intro && (
          <section id="lesson-intro" className="lesson-intro-card" aria-label="Concept overview">
            <h2>{renderInlineRich(content.intro.heading)}</h2>
            <div className="lesson-intro-body">
              {content.intro.explanation.map((p, i) => (
                <p key={i}>{renderInlineRich(p)}</p>
              ))}
            </div>
            {content.intro.analogy && (
              <p className="lesson-intro-analogy">
                <strong>Mental model:</strong> {renderInlineRich(content.intro.analogy)}
              </p>
            )}
            {content.intro.realWorldUses && content.intro.realWorldUses.length > 0 && (
              <div className="lesson-intro-uses">
                <span>Practical uses</span>
                <ul>
                  {content.intro.realWorldUses.map((use, idx) => (
                    <li key={idx}>{renderInlineRich(use)}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {guideSection}
        {walkthroughSection}

        {/* Tricky Points */}
        {content?.trickyPoints && content.trickyPoints.length > 0 && (
          <section id="lesson-traps" className="tricky-section">
            <h2>
              <Icon name="info" size={18} /> Common traps
            </h2>
            <div className="tricky-grid">
              {content.trickyPoints.map((tp) => (
                <div key={tp.title} className="tricky-card">
                  <strong>{renderInlineRich(tp.title)}</strong>
                  <p>{renderInlineRich(tp.detail)}</p>
                  {tp.code && (
                    <pre className="tricky-code">
                      <code>{tp.code}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Predict Checks */}
        {predictList.length > 0 && (
          <div id="lesson-checks" className="checks-group">
            {predictList.map((check, qIdx) => {
              const chosenId = predictChoices[qIdx] ?? null;
              const compactOpts = check.options.every((o) => o.label.length <= 28);
              return (
                <section key={`${currentLesson.id}-predict-${qIdx}`} className="predict-card">
                  <div className="quiz-q-head">
                    <span className="quiz-q-num tabular">
                      {predictList.length > 1
                        ? `Quick check ${qIdx + 1} of ${predictList.length}`
                        : "Quick check"}
                    </span>
                  </div>
                  <h2>{renderInlineRich(check.prompt)}</h2>
                  <pre className="predict-code">
                    <code>{check.code}</code>
                  </pre>

                  <div
                    className={`predict-options ${compactOpts ? "is-compact-grid" : ""}`}
                    role="radiogroup"
                    aria-label={`Quick check ${qIdx + 1} options`}
                  >
                    {check.options.map((opt, oIdx) => {
                      const chosen = chosenId === opt.id;
                      const answered = chosenId !== null;
                      const isCorrect = opt.id === check.correctId;
                      const tone = answered
                        ? isCorrect
                          ? "is-correct"
                          : chosen
                            ? "is-wrong"
                            : ""
                        : "";
                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={chosen}
                          tabIndex={chosen || (!chosenId && oIdx === 0) ? 0 : -1}
                          key={opt.id}
                          className={`predict-option ${tone}`}
                          onClick={() => setPredictChoices((prev) => ({ ...prev, [qIdx]: opt.id }))}
                          onKeyDown={(e) => {
                            const radios = Array.from(
                              e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
                            );
                            let nextIdx = -1;
                            if (e.key === "ArrowDown" || e.key === "ArrowRight") nextIdx = (oIdx + 1) % check.options.length;
                            else if (e.key === "ArrowUp" || e.key === "ArrowLeft") nextIdx = (oIdx - 1 + check.options.length) % check.options.length;
                            else if (e.key === "Home") nextIdx = 0;
                            else if (e.key === "End") nextIdx = check.options.length - 1;
                            if (nextIdx >= 0) {
                              e.preventDefault();
                              setPredictChoices((prev) => ({ ...prev, [qIdx]: check.options[nextIdx].id }));
                              radios[nextIdx]?.focus();
                            }
                          }}
                        >
                          <span className="opt-letter">{opt.id.toUpperCase()}</span>
                          <span className="opt-label-text">{renderInlineRich(opt.label)}</span>
                          {answered && isCorrect && (
                            <Icon name="check" size={14} className="opt-status-icon is-right" />
                          )}
                          {answered && chosen && !isCorrect && (
                            <Icon name="close" size={14} className="opt-status-icon is-wrong" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {chosenId !== null && (
                    <div className="predict-feedback">
                      <strong>{chosenId === check.correctId ? "Correct:" : "Takeaway:"}</strong>{" "}
                      {renderInlineRich(check.explanation)}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {/* Unified Tabbed Hands-On Practice Challenges */}
        {activeChallenge && (
          <section id="lesson-practice" className="practice-card">
            <div className="practice-card-head">
              <div>
                <h2>Hands-on practice</h2>
                <p className="practice-meta tabular">
                  {challengeList.length} {challengeList.length === 1 ? "challenge" : "challenges"} · apply in your own editor
                </p>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${isPracticeDone ? "btn-success" : "btn-secondary"}`}
                onClick={() => onTogglePractice(currentLesson.id)}
              >
                <Icon name="check" size={15} />
                <span>{isPracticeDone ? "Done" : "Mark done"}</span>
              </button>
            </div>

            {challengeList.length > 1 && (
              <div className="lab-pill-row" role="tablist" aria-label="Lesson practice challenges">
                {challengeList.map((ch, cIdx) => {
                  const selected = cIdx === activeChallengeIdx;
                  const diff = resolveChallengeDifficulty(
                    ch.tier,
                    activeCourse.id === "dsa",
                    cIdx,
                    challengeList.length,
                  );
                  const tabLabel =
                    activeCourse.id === "dsa"
                      ? `${cIdx + 1}. ${diff?.label ?? `Problem ${cIdx + 1}`}`
                      : ch.tier
                        ? `${cIdx + 1}. ${ch.tier}`
                        : `Challenge ${cIdx + 1}`;
                  return (
                    <button
                      key={`${ch.title}-${cIdx}`}
                      id={`${practiceTabBaseId}-tab-${cIdx}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={`${practiceTabBaseId}-panel`}
                      tabIndex={selected ? 0 : -1}
                      className={`lab-pill-btn ${selected ? "is-active" : ""}`}
                      onClick={() => setChallengeTab(cIdx)}
                      onKeyDown={(e) => handleTabKeyDown(e, cIdx, challengeList.length, setChallengeTab)}
                    >
                      {tabLabel}
                    </button>
                  );
                })}
              </div>
            )}

            <div
              key={`${currentLesson.id}-p-${activeChallengeIdx}`}
              id={`${practiceTabBaseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${practiceTabBaseId}-tab-${activeChallengeIdx}`}
              className="practice-panel-body panel-swap-enter"
            >
              <PracticeChallengeBody
                challenge={activeChallenge}
                challengeIndex={activeChallengeIdx}
                challengeTotal={challengeList.length}
                isDsa={activeCourse.id === "dsa"}
                showHint={Boolean(openHints[activeChallengeIdx])}
                onToggleHint={() =>
                  setOpenHints((prev) => ({
                    ...prev,
                    [activeChallengeIdx]: !prev[activeChallengeIdx],
                  }))
                }
                showSolution={Boolean(openSolutions[activeChallengeIdx])}
                onToggleSolution={() =>
                  setOpenSolutions((prev) => ({
                    ...prev,
                    [activeChallengeIdx]: !prev[activeChallengeIdx],
                  }))
                }
              />
            </div>
          </section>
        )}

        {/* Stage Assessment Prompt Banner when reaching end of an intermediate module */}
        {isLastLessonInModule && nextLesson && (
          <div className="module-quiz-callout">
            <div>
              <h3>
                {isPracticeSetCourse
                  ? `Apply ${currentMeta.module.title}`
                  : `Ready to test ${currentMeta.module.title}?`}
              </h3>
              <p>
                {isPracticeSetCourse
                  ? currentMeta.module.quizCount
                    ? `Solve the ${currentMeta.module.practiceSetCount ?? 4}-problem practice set and take the ${currentMeta.module.quizCount}-question conceptual quiz before moving on.`
                    : `Solve the ${currentMeta.module.practiceSetCount ?? 4}-problem mixed practice set before moving into the next module.`
                  : `Take the ${currentMeta.module.quizCount}-question quiz before moving into the next module.`}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onSelectQuiz(activeCourse.id, currentMeta.module.id, { tab: "practice" })}
            >
              {isPracticeSetCourse && currentMeta.module.quizCount
                ? `Open Module ${currentMeta.module.number} Practice & Quiz`
                : isPracticeSetCourse
                  ? `Open Module ${currentMeta.module.number} Practice Set`
                  : `Take Module ${currentMeta.module.number} quiz`}
            </button>
          </div>
        )}

        {/* Bottom Completion Toggle & Prev / Next Navigation */}
        <div className="lesson-complete-bar">
          <div>
            <strong>{isDone ? "Lesson completed" : "Finished reading & practicing?"}</strong>
            <span>
              {isDone
                ? "Saved in your study tracker."
                : "Record this lesson as complete in your tracker."}
            </span>
          </div>
          <button
            type="button"
            className={`btn btn-sm ${isDone ? "btn-success" : "btn-primary"}`}
            aria-pressed={isDone}
            onClick={() => onToggleComplete(currentLesson.id)}
          >
            <Icon name="check" size={15} />
            <span>{isDone ? "Completed" : "Mark lesson done"}</span>
          </button>
        </div>

        <nav className="lesson-bottom-nav" aria-label="Lesson navigation">
          {prevLesson && (
            <button
              type="button"
              className="bottom-nav-card is-prev"
              onClick={() => onSelectLesson(activeCourse.id, prevLesson.id)}
            >
              <span className="bottom-nav-dir">
                <Icon name="chevron" size={13} strokeWidth={2} className="icon-chevron-left" />
                <span>Previous</span>
              </span>
              <strong>{prevLesson.title}</strong>
            </button>
          )}

          {nextLesson ? (
            <button
              type="button"
              className="bottom-nav-card is-next"
              onClick={() => onSelectLesson(activeCourse.id, nextLesson.id)}
            >
              <span className="bottom-nav-dir">
                <span>Next</span>
                <Icon name="chevron" size={13} strokeWidth={2} />
              </span>
              <strong>{nextLesson.title}</strong>
            </button>
          ) : (
            <button
              type="button"
              className="bottom-nav-card is-next"
              onClick={() => onSelectQuiz(activeCourse.id, currentMeta.module.id, { tab: "practice" })}
            >
              <span className="bottom-nav-dir">
                <span>
                  {isPracticeSetCourse && currentMeta.module.quizCount
                    ? "Practice & Quiz"
                    : isPracticeSetCourse
                      ? "Practice Set"
                      : "Stage Quiz"}
                </span>
                <Icon name="chevron" size={13} strokeWidth={2} />
              </span>
              <strong>
                {isPracticeSetCourse && currentMeta.module.quizCount
                  ? `Module ${currentMeta.module.number} Practice & Quiz`
                  : isPracticeSetCourse
                    ? `Module ${currentMeta.module.number} Practice Set`
                    : `Take Module ${currentMeta.module.number} Quiz`}
              </strong>
            </button>
          )}
        </nav>
      </article>
    </div>
  );
}
