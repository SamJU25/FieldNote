"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { getCourseLessons, type Course } from "@/lib/curriculum";
import {
  formatDuration,
  getActivityHeatmap,
  getCurrentStreak,
  getDailyActivitySeries,
  getDayKey,
  getModuleStats,
  getWeekMinutes,
  QUIZ_PASS_THRESHOLD,
  type ProgressState,
} from "@/lib/progress";

export type FocusTimerControls = {
  mode: "stopwatch" | "pomodoro";
  pomodoroMinutes: number;
  running: boolean;
  seconds: number;
  elapsedSeconds: number;
  display: string;
  focusLabel: string;
  courseId: string;
  setMode: (m: "stopwatch" | "pomodoro") => void;
  setPomodoroMinutes: (mins: number) => void;
  setFocusLabel: (val: string) => void;
  setCourseId: (cid: string) => void;
  startPause: () => void;
  reset: () => void;
  saveToLog: () => void;
};

type TrackerViewProps = {
  courses: Course[];
  progress: ProgressState;
  todayKey: string;
  showBackupReminder: boolean;
  timer: FocusTimerControls;
  onOpenLesson: (courseId: string, lessonId: string, options?: { openNotes?: boolean }) => void;
  onOpenQuiz: (courseId: string, moduleId: string, options?: { tab?: "practice" | "mcq" }) => void;
  onOpenCourseOverview: (courseId: string) => void;
  onOpenLogModal: (defaultCourseId?: string) => void;
  onOpenGoalModal: () => void;
  onDeleteSession: (id: string) => void;
  onExportBackup: () => void;
  onTriggerImport: () => void;
};

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatShortIsoDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  return `${SHORT_MONTHS[m - 1] ?? parts[1]} ${d}`;
}

function buildSmoothAreaPaths(pts: Array<{ x: number; y: number }>, baselineY: number) {
  if (pts.length === 0) return { line: "", area: "" };
  if (pts.length === 1) {
    return {
      line: `M ${pts[0].x} ${pts[0].y}`,
      area: `M ${pts[0].x} ${baselineY} L ${pts[0].x} ${pts[0].y} L ${pts[0].x} ${baselineY} Z`,
    };
  }
  let line = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i += 1) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const midX = ((prev.x + curr.x) / 2).toFixed(1);
    line += ` C ${midX} ${prev.y.toFixed(1)}, ${midX} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${baselineY.toFixed(1)} L ${pts[0].x.toFixed(1)} ${baselineY.toFixed(1)} Z`;
  return { line, area };
}

type FlaggedNoteEntry = {
  id: string;
  meta: {
    courseId: string;
    courseTitle: string;
    module: { number: string; title: string };
    lesson: { title: string };
  };
  entry: ProgressState["lessonNotes"][string];
};

function SavedNotesList({
  notes,
  showCourseContext,
  onOpenLesson,
}: {
  notes: FlaggedNoteEntry[];
  showCourseContext: boolean;
  onOpenLesson: (courseId: string, lessonId: string, options?: { openNotes?: boolean }) => void;
}) {
  return (
    <div className="saved-notes-list">
      {notes.map(({ id, meta, entry }) => (
        <div key={id} className="saved-note-item">
          <div className="saved-note-top">
            <div>
              <strong>{meta.lesson.title}</strong>
              <small className="saved-note-course">
                {showCourseContext
                  ? `${meta.courseTitle} · Module ${meta.module.number}`
                  : `Module ${meta.module.number} · ${meta.module.title}`}
              </small>
            </div>
            <span className={`conf-badge conf-${entry.confidence}`}>{entry.confidence}</span>
          </div>
          {entry.note && <p>{entry.note}</p>}
          <button
            type="button"
            className="text-link-btn"
            onClick={() => onOpenLesson(meta.courseId, id, { openNotes: true })}
          >
            Open lesson &amp; note
          </button>
        </div>
      ))}
    </div>
  );
}

type ReviewQueueItem = {
  id: string;
  title: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
};

export function TrackerView({
  courses,
  progress,
  todayKey,
  showBackupReminder,
  timer,
  onOpenLesson,
  onOpenQuiz,
  onOpenCourseOverview,
  onOpenLogModal,
  onOpenGoalModal,
  onDeleteSession,
  onExportBackup,
  onTriggerImport,
}: TrackerViewProps) {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [backupNoticeDismissed, setBackupNoticeDismissed] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  const [courseTabs, setCourseTabs] = useState<Record<string, "modules" | "notes">>({});
  const [courseFilters, setCourseFilters] = useState<Record<string, "focus" | "all" | "done">>({});
  const [courseNoteQueries, setCourseNoteQueries] = useState<Record<string, string>>({});
  const [courseShakyOnly, setCourseShakyOnly] = useState<Record<string, boolean>>({});
  const [showAllCourseNotes, setShowAllCourseNotes] = useState<Record<string, boolean>>({});
  const [chartRange, setChartRange] = useState<"14d" | "12w">("14d");
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [selectedHeatDate, setSelectedHeatDate] = useState<string | null>(null);

  const doneSet = useMemo(() => new Set(progress.completedLessons), [progress.completedLessons]);
  const practiceSet = useMemo(() => new Set(progress.completedPractice), [progress.completedPractice]);

  const visibleCourses = useMemo(
    () =>
      selectedCourseFilter === "all"
        ? courses
        : courses.filter((c) => c.id === selectedCourseFilter),
    [courses, selectedCourseFilter],
  );

  const allFlatLessons = useMemo(
    () =>
      courses.flatMap((course) =>
        getCourseLessons(course).map((item) => ({
          courseId: course.id,
          courseTitle: course.title,
          ...item,
        })),
      ),
    [courses],
  );
  const filteredFlatLessons = useMemo(
    () =>
      selectedCourseFilter === "all"
        ? allFlatLessons
        : allFlatLessons.filter((item) => item.courseId === selectedCourseFilter),
    [allFlatLessons, selectedCourseFilter],
  );
  const filteredModules = useMemo(
    () =>
      visibleCourses.flatMap((course) =>
        course.modules.map((mod) => ({ course, mod })),
      ),
    [visibleCourses],
  );
  const filteredSessions = useMemo(
    () =>
      selectedCourseFilter === "all"
        ? progress.sessions
        : progress.sessions.filter((s) => (s.courseId ?? "python") === selectedCourseFilter),
    [progress.sessions, selectedCourseFilter],
  );

  const completedCount = useMemo(
    () => filteredFlatLessons.filter((item) => doneSet.has(item.lesson.id)).length,
    [filteredFlatLessons, doneSet],
  );
  const practiceCount = useMemo(
    () => filteredFlatLessons.filter((item) => practiceSet.has(item.lesson.id)).length,
    [filteredFlatLessons, practiceSet],
  );
  const totalCount = filteredFlatLessons.length;
  const overallPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const quizzesPassed = useMemo(
    () =>
      filteredModules.filter(({ mod }) => {
        const q = progress.quizResults[mod.id];
        return q && q.score / q.total >= QUIZ_PASS_THRESHOLD;
      }).length,
    [filteredModules, progress.quizResults],
  );
  const conceptualModules = useMemo(
    () => filteredModules.filter(({ mod }) => Boolean(mod.quizCount && mod.quizCount > 0)),
    [filteredModules],
  );
  const conceptualPassed = useMemo(
    () =>
      conceptualModules.filter(({ course, mod }) => {
        const q =
          course.assessmentKind === "practice-set"
            ? progress.conceptualQuizResults?.[mod.id]
            : progress.quizResults[mod.id];
        return q && q.score / q.total >= QUIZ_PASS_THRESHOLD;
      }).length,
    [conceptualModules, progress.conceptualQuizResults, progress.quizResults],
  );
  const effectiveToday = todayKey || getDayKey(new Date());
  const weekMinutes = useMemo(
    () => getWeekMinutes(filteredSessions, effectiveToday),
    [filteredSessions, effectiveToday],
  );
  const streak = useMemo(
    () => getCurrentStreak(filteredSessions, effectiveToday),
    [filteredSessions, effectiveToday],
  );
  const totalStudyMinutes = useMemo(
    () => filteredSessions.reduce((sum, s) => sum + s.minutes, 0),
    [filteredSessions],
  );
  const weeklyPercent = Math.min(100, Math.round((weekMinutes / Math.max(1, progress.weeklyGoalMinutes)) * 100));

  const heatmapDays = useMemo(
    () => getActivityHeatmap(filteredSessions, 12, effectiveToday),
    [filteredSessions, effectiveToday],
  );
  const weeks = useMemo(() => {
    const out: typeof heatmapDays[] = [];
    for (let i = 0; i < heatmapDays.length; i += 7) {
      out.push(heatmapDays.slice(i, i + 7));
    }
    return out;
  }, [heatmapDays]);
  const dailySeries = useMemo(
    () =>
      getDailyActivitySeries(filteredSessions, 14, effectiveToday).map((d, i, arr) => ({
        key: d.date,
        axisLabel: i === arr.length - 1 ? "Today" : formatShortIsoDate(d.date),
        detailLabel: d.date,
        minutes: d.minutes,
      })),
    [filteredSessions, effectiveToday],
  );
  const inspectedHeatDay =
    heatmapDays.find((d) => d.date === (selectedHeatDate ?? effectiveToday)) ??
    heatmapDays.find((d) => d.date === effectiveToday) ??
    heatmapDays[heatmapDays.length - 1];
  const pastHeatDays = heatmapDays.filter((d) => d.date <= effectiveToday);
  const activeHeatDays = pastHeatDays.filter((d) => d.minutes > 0).length;
  const heatmapTotalMinutes = pastHeatDays.reduce((sum, d) => sum + d.minutes, 0);
  const bestHeatMinutes = pastHeatDays.reduce((max, d) => Math.max(max, d.minutes), 0);
  const weeklySeries = useMemo(
    () =>
      weeks.map((w, idx) => {
        const firstDate = w[0]?.date ?? effectiveToday;
        return {
          key: firstDate,
          axisLabel: `W${idx + 1}`,
          detailLabel: `Week of ${firstDate}`,
          minutes: w.reduce((sum, d) => sum + d.minutes, 0),
        };
      }),
    [weeks, effectiveToday],
  );
  const activeSeries = chartRange === "14d" ? dailySeries : weeklySeries;
  const safePointIdx =
    activePointIndex !== null && activePointIndex >= 0 && activePointIndex < activeSeries.length
      ? activePointIndex
      : Math.max(0, activeSeries.length - 1);
  const activePoint = activeSeries[safePointIdx];
  const periodMinutes = activeSeries.reduce((sum, pt) => sum + pt.minutes, 0);

  const chartW = 600;
  const chartH = 200;
  const padL = 44;
  const padR = 16;
  const padT = 18;
  const padB = 28;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const baselineY = padT + plotH;

  const seriesMax = Math.max(...activeSeries.map((pt) => pt.minutes), 0);
  const goalMinutesInView =
    chartRange === "12w"
      ? progress.weeklyGoalMinutes
      : Math.max(30, Math.round(progress.weeklyGoalMinutes / 7));
  const yMax =
    chartRange === "12w"
      ? Math.max(60, Math.ceil(Math.max(seriesMax, goalMinutesInView) / 60) * 60)
      : Math.max(60, Math.ceil(seriesMax / 30) * 30);
  const goalLineY =
    goalMinutesInView <= yMax ? baselineY - (goalMinutesInView / yMax) * plotH : null;

  const dailyCoords = dailySeries.map((pt, i) => ({
    x: padL + (i / Math.max(1, dailySeries.length - 1)) * plotW,
    y: baselineY - (pt.minutes / yMax) * plotH,
    ...pt,
  }));
  const { line: dailyLinePath, area: dailyAreaPath } = buildSmoothAreaPaths(dailyCoords, baselineY);
  const activeDailyPt = chartRange === "14d" ? dailyCoords[safePointIdx] : undefined;

  const weekSlotW = plotW / Math.max(1, weeklySeries.length);
  const weekBarW = Math.min(28, Math.max(14, weekSlotW - 10));

  const sortedSessions = useMemo(
    () => [...filteredSessions].sort((a, b) => b.date.localeCompare(a.date)),
    [filteredSessions],
  );
  const visibleSessions = showAllSessions ? sortedSessions : sortedSessions.slice(0, 5);

  const courseTitleMap = useMemo(
    () => new Map(courses.map((c) => [c.id, c.title])),
    [courses],
  );
  const lessonMap = useMemo(
    () => new Map(allFlatLessons.map((item) => [item.lesson.id, item])),
    [allFlatLessons],
  );
  const flaggedNotes: FlaggedNoteEntry[] = useMemo(() => {
    const confidenceRank: Record<string, number> = { shaky: 0, learning: 1, solid: 2 };
    return Object.entries(progress.lessonNotes)
      .flatMap(([id, entry]) => {
        const meta = lessonMap.get(id);
        if (!meta || (entry.confidence !== "shaky" && entry.note.trim().length === 0)) {
          return [];
        }
        if (selectedCourseFilter !== "all" && meta.courseId !== selectedCourseFilter) {
          return [];
        }
        return [{ id, meta, entry }];
      })
      .sort((a, b) => {
        const rankDiff =
          (confidenceRank[a.entry.confidence] ?? 3) - (confidenceRank[b.entry.confidence] ?? 3);
        if (rankDiff !== 0) return rankDiff;
        return b.entry.updatedAt.localeCompare(a.entry.updatedAt);
      });
  }, [progress.lessonNotes, lessonMap, selectedCourseFilter]);

  const shakyNotes = useMemo(
    () => flaggedNotes.filter((item) => item.entry.confidence === "shaky"),
    [flaggedNotes],
  );

  const reviewQueue: ReviewQueueItem[] = useMemo(
    () => [
      ...shakyNotes.map(({ id, meta }) => ({
        id: `note-${id}`,
        title: meta.lesson.title,
        detail: `${meta.courseTitle} · Module ${meta.module.number} · Marked shaky`,
        actionLabel: "Open note",
        onAction: () => onOpenLesson(meta.courseId, id, { openNotes: true }),
      })),
      ...filteredModules.flatMap(({ course, mod }) => {
        const items: ReviewQueueItem[] = [];
        const setRes = progress.quizResults[mod.id];
        if (setRes && setRes.missedIds.length > 0) {
          items.push({
            id: `set-${mod.id}`,
            title: `Module ${mod.number} ${course.assessmentKind === "practice-set" ? "Practice set" : "Quiz"}`,
            detail: `${course.title} · ${setRes.score}/${setRes.total} solved (${setRes.missedIds.length} remaining)`,
            actionLabel: course.assessmentKind === "practice-set" ? "Finish problems" : "Review quiz",
            onAction: () => onOpenQuiz(course.id, mod.id, { tab: "practice" }),
          });
        }
        const mcqRes =
          course.assessmentKind === "practice-set" ? progress.conceptualQuizResults?.[mod.id] : undefined;
        if (mcqRes && (mcqRes.missedIds.length > 0 || mcqRes.score / mcqRes.total < QUIZ_PASS_THRESHOLD)) {
          items.push({
            id: `mcq-${mod.id}`,
            title: `Module ${mod.number} Conceptual quiz`,
            detail: `${course.title} · Scored ${mcqRes.score}/${mcqRes.total} (${mcqRes.missedIds.length} missed)`,
            actionLabel: "Retake quiz",
            onAction: () => onOpenQuiz(course.id, mod.id, { tab: "mcq" }),
          });
        }
        return items;
      }),
    ],
    [shakyNotes, filteredModules, progress.quizResults, progress.conceptualQuizResults, onOpenLesson, onOpenQuiz],
  );
  const visibleReviewQueue = showAllReviews ? reviewQueue : reviewQueue.slice(0, 5);

  return (
    <div className="tracker-container">
      <header className="tracker-header">
        <div>
          <h1>Progress & focus</h1>
          <p>Local lesson completion, flagged notes, and study logs.</p>
        </div>
        <div className="tracker-header-actions">
          <div className="tracker-select-wrap">
            <label htmlFor="tracker-course-filter" className="visually-hidden">
              Filter tracker by course
            </label>
            <select
              id="tracker-course-filter"
              className="tracker-select is-compact"
              aria-label="Filter tracker by course"
              value={selectedCourseFilter}
              onChange={(e) => {
                const next = e.target.value;
                setSelectedCourseFilter(next);
                if (next !== "all") {
                  timer.setCourseId(next);
                }
              }}
            >
              <option value="all">All courses ({courses.length})</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={14} strokeWidth={1.9} className="tracker-select-chevron" />
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onExportBackup}>
            <Icon name="download" size={14} /> Export JSON
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onTriggerImport}>
            <Icon name="upload" size={14} /> Import JSON
          </button>
        </div>
      </header>

      {showBackupReminder && !backupNoticeDismissed && (
        <div className="notice-banner" role="status">
          <div className="notice-banner-copy">
            <Icon name="info" size={16} />
            <span>
              Progress is stored in this browser.{" "}
              <button type="button" className="text-link-btn inline-nudge-link" onClick={onExportBackup}>
                Export a JSON backup
              </button>{" "}
              so clearing site data does not erase it.
            </span>
          </div>
          <button
            type="button"
            className="icon-close-btn"
            aria-label="Dismiss backup reminder"
            onClick={() => setBackupNoticeDismissed(true)}
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      )}

      {/* Top Metrics */}
      <div className="tracker-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Overall completion</span>
          <strong className="tabular">{overallPercent}%</strong>
          <small className="tabular">{completedCount} of {totalCount} lessons · {practiceCount} tasks done</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Module checks</span>
          <strong className="tabular">{quizzesPassed}/{filteredModules.length}</strong>
          <small className="tabular">
            Practice sets passed
            {conceptualModules.length > 0 ? ` · ${conceptualPassed}/${conceptualModules.length} quizzes` : ""}
          </small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label-row">
            <span className="kpi-label">This week</span>
            <button type="button" className="text-link-btn" onClick={onOpenGoalModal}>
              Edit goal
            </button>
          </div>
          <strong className="tabular">{formatDuration(weekMinutes)}</strong>
          <small className="tabular">{weeklyPercent}% of {formatDuration(progress.weeklyGoalMinutes)} weekly target</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Study streak</span>
          <strong className="tabular">{streak} {streak === 1 ? "day" : "days"}</strong>
          <small>{totalStudyMinutes > 0 ? "Consecutive active days" : "Log a session to start"}</small>
        </div>
      </div>

      {reviewQueue.length > 0 && (
        <section className="tracker-card" aria-label="Recommended review">
          <div className="tracker-card-head">
            <h2>Recommended review</h2>
            <span className="tabular">
              {reviewQueue.length} {reviewQueue.length === 1 ? "item" : "items"} needing attention
            </span>
          </div>
          <ul className="review-queue-list">
            {visibleReviewQueue.map((item) => (
              <li key={item.id} className="review-queue-item">
                <div className="review-queue-copy">
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </div>
                <button type="button" className="btn btn-secondary btn-sm" onClick={item.onAction}>
                  {item.actionLabel}
                </button>
              </li>
            ))}
          </ul>
          {reviewQueue.length > 5 && (
            <button
              type="button"
              className="text-link-btn"
              onClick={() => setShowAllReviews((prev) => !prev)}
            >
              {showAllReviews ? "Show fewer review items" : `Show all ${reviewQueue.length} review items`}
            </button>
          )}
        </section>
      )}

      {/* Row 2: Study Activity + Focus Timer */}
      <div className="tracker-analytics-grid">
        <section className="tracker-card activity-chart-card">
          <div className="tracker-card-head">
            <h2>Study activity</h2>
            <div className="timer-mode-tabs" role="group" aria-label="Study activity range">
              <button
                type="button"
                aria-pressed={chartRange === "14d"}
                className={chartRange === "14d" ? "is-active" : ""}
                onClick={() => {
                  setChartRange("14d");
                  setActivePointIndex(null);
                }}
              >
                14 days
              </button>
              <button
                type="button"
                aria-pressed={chartRange === "12w"}
                className={chartRange === "12w" ? "is-active" : ""}
                onClick={() => {
                  setChartRange("12w");
                  setActivePointIndex(null);
                }}
              >
                12 weeks
              </button>
            </div>
          </div>

          <div className="activity-chart-wrap">
            <svg
              key={chartRange}
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="activity-chart-svg"
              role="img"
              aria-label={
                chartRange === "14d"
                  ? `Daily study minutes over the last 14 days, total ${formatDuration(periodMinutes)}`
                  : `Weekly study minutes over the last 12 weeks, total ${formatDuration(periodMinutes)}`
              }
            >
              {[0, 0.5, 1].map((frac) => {
                const y = baselineY - frac * plotH;
                const tickMinutes = Math.round(yMax * frac);
                return (
                  <g key={frac}>
                    <line x1={padL} y1={y} x2={chartW - padR} y2={y} className="chart-grid-line" />
                    <text x={padL - 8} y={y + 3.5} textAnchor="end" className="chart-axis-text">
                      {tickMinutes === 0 ? "0m" : formatDuration(tickMinutes)}
                    </text>
                  </g>
                );
              })}

              {goalLineY !== null && chartRange === "12w" && (
                <g>
                  <line x1={padL} y1={goalLineY} x2={chartW - padR} y2={goalLineY} className="chart-goal-line" />
                  <text x={chartW - padR} y={goalLineY - 4} textAnchor="end" className="chart-goal-label">
                    Goal: {formatDuration(goalMinutesInView)}
                  </text>
                </g>
              )}

              {chartRange === "14d" ? (
                <>
                  <path d={dailyAreaPath} className="chart-area-fill" />
                  <path d={dailyLinePath} className="chart-line-path" pathLength={1} />
                  {activeDailyPt && (
                    <line
                      x1={activeDailyPt.x}
                      y1={padT}
                      x2={activeDailyPt.x}
                      y2={baselineY}
                      className="chart-guide-line"
                    />
                  )}
                  {dailyCoords.map((pt, i) => {
                    const isActive = i === safePointIdx;
                    const showTick = i === 0 || i === 3 || i === 6 || i === 9 || i === dailyCoords.length - 1;
                    return (
                      <g key={pt.key}>
                        {showTick && (
                          <text x={pt.x} y={chartH - 6} textAnchor="middle" className="chart-axis-text">
                            {pt.axisLabel}
                          </text>
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isActive ? 5 : pt.minutes > 0 ? 3.5 : 2.5}
                          className={`chart-dot ${isActive ? "is-active" : ""}`}
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={16}
                          className="chart-hit-target"
                          role="button"
                          tabIndex={0}
                          aria-label={`${pt.detailLabel}: ${pt.minutes} minutes`}
                          onMouseEnter={() => setActivePointIndex(i)}
                          onFocus={() => setActivePointIndex(i)}
                          onClick={() => setActivePointIndex(i)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActivePointIndex(i);
                            }
                          }}
                        />
                      </g>
                    );
                  })}
                </>
              ) : (
                weeklySeries.map((pt, i) => {
                  const slotX = padL + i * weekSlotW;
                  const barX = slotX + (weekSlotW - weekBarW) / 2;
                  const centerX = slotX + weekSlotW / 2;
                  const barHeight = pt.minutes === 0 ? 3 : Math.max(4, (pt.minutes / yMax) * plotH);
                  const barY = baselineY - barHeight;
                  const isCurrent = i === weeklySeries.length - 1;
                  const isSelected = i === safePointIdx;
                  const showTick = i === 0 || i % 2 === 1 || isCurrent;
                  return (
                    <g key={pt.key}>
                      <rect
                        x={barX}
                        y={barY}
                        width={weekBarW}
                        height={barHeight}
                        rx={pt.minutes === 0 ? 1.5 : 4}
                        className={`chart-bar ${pt.minutes === 0 ? "is-empty" : ""} ${isCurrent ? "is-current" : ""} ${isSelected ? "is-selected" : ""}`}
                      />
                      {showTick && (
                        <text x={centerX} y={chartH - 6} textAnchor="middle" className="chart-axis-text">
                          {pt.axisLabel}
                        </text>
                      )}
                      <rect
                        x={slotX}
                        y={padT}
                        width={weekSlotW}
                        height={plotH}
                        className="chart-hit-target"
                        role="button"
                        tabIndex={0}
                        aria-label={`${pt.detailLabel}: ${pt.minutes} minutes`}
                        onMouseEnter={() => setActivePointIndex(i)}
                        onFocus={() => setActivePointIndex(i)}
                        onClick={() => setActivePointIndex(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setActivePointIndex(i);
                          }
                        }}
                      />
                    </g>
                  );
                })
              )}
            </svg>
          </div>

          <div className="activity-chart-footer tabular">
            <span>
              {activePoint ? (
                <>
                  <strong>{activePoint.detailLabel}</strong> · {formatDuration(activePoint.minutes)}
                </>
              ) : (
                "No study days recorded"
              )}
            </span>
            <span>
              {chartRange === "14d" ? "Last 14 days" : "Last 12 weeks"} · {formatDuration(periodMinutes)}
            </span>
          </div>
        </section>

        <section className="tracker-card timer-card-balanced">
          <div className="tracker-card-head">
            <h2>Focus timer</h2>
            <div className="timer-head-controls">
              {timer.mode === "pomodoro" && !timer.running && (
                <div className="timer-preset-inline" role="group" aria-label="Timer duration preset">
                  {[25, 45].map((m) => (
                    <button
                      type="button"
                      key={m}
                      aria-pressed={timer.pomodoroMinutes === m}
                      className={`lab-pill-btn ${timer.pomodoroMinutes === m ? "is-active" : ""}`}
                      onClick={() => timer.setPomodoroMinutes(m)}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              )}
              <div className="timer-mode-tabs" role="tablist" aria-label="Timer mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={timer.mode === "stopwatch"}
                  tabIndex={timer.mode === "stopwatch" ? 0 : -1}
                  className={timer.mode === "stopwatch" ? "is-active" : ""}
                  onClick={() => timer.setMode("stopwatch")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "End" || e.key === "Home") {
                      e.preventDefault();
                      timer.setMode("pomodoro");
                      (e.currentTarget.nextElementSibling as HTMLButtonElement | null)?.focus();
                    }
                  }}
                >
                  Stopwatch
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={timer.mode === "pomodoro"}
                  tabIndex={timer.mode === "pomodoro" ? 0 : -1}
                  className={timer.mode === "pomodoro" ? "is-active" : ""}
                  onClick={() => timer.setMode("pomodoro")}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                      e.preventDefault();
                      timer.setMode("stopwatch");
                      (e.currentTarget.previousElementSibling as HTMLButtonElement | null)?.focus();
                    }
                  }}
                >
                  {timer.pomodoroMinutes}m
                </button>
              </div>
            </div>
          </div>

          <div className={`timer-clock-face tabular ${timer.running ? "is-running" : ""}`}>{timer.display}</div>
          <div className="form-field">
            <label htmlFor="timer-focus-input" className="visually-hidden">
              What are you practicing right now?
            </label>
            <input
              id="timer-focus-input"
              type="text"
              className="timer-label-input"
              value={timer.focusLabel}
              onChange={(e) => timer.setFocusLabel(e.target.value)}
              placeholder="Focus topic (optional)"
            />
          </div>
          <div className="timer-btn-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={timer.startPause}>
              <Icon name={timer.running ? "pause" : "play"} size={15} />
              <span>{timer.running ? "Pause" : "Start"}</span>
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={timer.reset}>
              Reset
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={timer.elapsedSeconds === 0}
              onClick={timer.saveToLog}
            >
              <Icon name="save" size={15} /> Log
            </button>
          </div>
        </section>
      </div>

      {/* Row 3: 12-Week Consistency + Recent Sessions */}
      <div className="tracker-analytics-grid">
        <section className="tracker-card heatmap-card">
          <div className="tracker-card-head">
            <h2>12-week consistency</h2>
            <span className="heatmap-readout tabular">
              {inspectedHeatDay
                ? `${inspectedHeatDay.date === effectiveToday ? "Today" : formatShortIsoDate(inspectedHeatDay.date)} · ${formatDuration(inspectedHeatDay.minutes)}`
                : "12 weeks"}
            </span>
          </div>
          <div className="heatmap-layout">
            <div className="heatmap-grid-scroll">
              <div className="heatmap-grid" role="group" aria-label="12-week daily study consistency">
                {weeks.map((week, wIdx) => (
                  <div key={week[0]?.date ?? wIdx} className="heatmap-col">
                    {week.map((day) => {
                      const isFuture = day.date > effectiveToday;
                      const isSelected = inspectedHeatDay?.date === day.date;
                      return (
                        <button
                          key={day.date}
                          type="button"
                          disabled={isFuture}
                          aria-pressed={isSelected}
                          aria-label={`${day.date}: ${day.minutes} minutes`}
                          title={`${day.date} · ${formatDuration(day.minutes)}`}
                          className={`heatmap-cell level-${day.level} ${isFuture ? "is-future" : ""} ${isSelected ? "is-selected" : ""}`}
                          onMouseEnter={() => setSelectedHeatDate(day.date)}
                          onFocus={() => setSelectedHeatDate(day.date)}
                          onClick={() => setSelectedHeatDate(day.date)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="heatmap-side">
              <dl className="heatmap-stats tabular">
                <div>
                  <dt>Active days</dt>
                  <dd>{activeHeatDays} / {pastHeatDays.length}</dd>
                </div>
                <div>
                  <dt>12w total</dt>
                  <dd>{formatDuration(heatmapTotalMinutes)}</dd>
                </div>
                <div>
                  <dt>Best day</dt>
                  <dd>{bestHeatMinutes > 0 ? formatDuration(bestHeatMinutes) : "—"}</dd>
                </div>
              </dl>
              <div className="heatmap-legend">
                <span>Less</span>
                <div className="heatmap-legend-cells" aria-hidden="true">
                  {([0, 1, 2, 3, 4] as const).map((lvl) => (
                    <span key={lvl} className={`heatmap-cell level-${lvl}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tracker-card sessions-card">
          <div className="tracker-card-head">
            <h2>Recent sessions</h2>
            <button
              type="button"
              className="text-link-btn"
              onClick={() =>
                onOpenLogModal(selectedCourseFilter === "all" ? undefined : selectedCourseFilter)
              }
            >
              + Log session
            </button>
          </div>

          {sortedSessions.length === 0 ? (
            <div className="sessions-empty-box">
              <p className="empty-copy">
                No study sessions logged yet. Start the focus timer above or log a completed session to build your streak.
              </p>
            </div>
          ) : (
            <>
              <ul className="session-list">
                {visibleSessions.map((s) => {
                  const cTitle = s.courseId ? courseTitleMap.get(s.courseId) : undefined;
                  const targetCourseId = s.courseId ?? "python";
                  return (
                    <li key={s.id} className="session-item">
                      <div>
                        <button
                          type="button"
                          className="session-link-btn"
                          onClick={() =>
                            s.lessonId
                              ? onOpenLesson(targetCourseId, s.lessonId)
                              : onOpenCourseOverview(targetCourseId)
                          }
                        >
                          {s.focus}
                        </button>
                        <small className="tabular">
                          {cTitle ? `${cTitle} · ` : ""}
                          {s.date} · {formatDuration(s.minutes)}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="icon-delete-btn"
                        aria-label={`Delete ${s.focus}`}
                        onClick={() => onDeleteSession(s.id)}
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {sortedSessions.length > 5 && (
                <button
                  type="button"
                  className="text-link-btn"
                  onClick={() => setShowAllSessions((prev) => !prev)}
                >
                  {showAllSessions ? "Show fewer sessions" : `Show all ${sortedSessions.length} sessions`}
                </button>
              )}
            </>
          )}
        </section>
      </div>

      {/* Row 4: Full-Width Expandable Courses */}
      <div className="tracker-stack">
        <section className="tracker-card">
          <div className="tracker-card-head">
            <h2>Courses</h2>
            <span className="tabular">{visibleCourses.length} {visibleCourses.length === 1 ? "track" : "tracks"}</span>
          </div>

          <div className="tracker-courses-list">
              {visibleCourses.map((course) => {
                const cLessons = getCourseLessons(course);
                const cDone = cLessons.filter((l) => doneSet.has(l.lesson.id)).length;
                const cPct = cLessons.length === 0 ? 0 : Math.round((cDone / cLessons.length) * 100);
                const cQuizzes = course.modules.filter((m) => {
                  const qr = progress.quizResults[m.id];
                  return qr && qr.score / qr.total >= QUIZ_PASS_THRESHOLD;
                }).length;
                const cNotes = flaggedNotes.filter((item) => item.meta?.courseId === course.id);
                const cShaky = cNotes.filter((item) => item.entry.confidence === "shaky").length;
                const nextLesson =
                  cLessons.find((l) => !doneSet.has(l.lesson.id))?.lesson ?? cLessons[0]?.lesson;
                const isExpanded = expandedCourses[course.id] ?? visibleCourses.length === 1;
                const activeTab = courseTabs[course.id] ?? "modules";
                const activeFilter = courseFilters[course.id] ?? "focus";
                const cShakyOnly = Boolean(courseShakyOnly[course.id]);
                const cNoteQuery = (courseNoteQueries[course.id] ?? "").trim().toLowerCase();
                const cFilteredNotes = cNotes.filter((item) => {
                  if (cShakyOnly && item.entry.confidence !== "shaky") return false;
                  if (cNoteQuery) {
                    const hay = `${item.meta?.lesson.title ?? ""} ${item.meta?.module.title ?? ""} ${item.entry.note}`.toLowerCase();
                    if (!hay.includes(cNoteQuery)) return false;
                  }
                  return true;
                });
                const cShowAllNotes = Boolean(showAllCourseNotes[course.id]);
                const cDisplayedNotes = cShowAllNotes ? cFilteredNotes : cFilteredNotes.slice(0, 4);

                const firstIncompleteModId = course.modules.find((mod) => {
                  const stats = getModuleStats(mod, progress.completedLessons);
                  return stats.done < stats.total;
                })?.id;

                const visibleMods = course.modules.filter((mod) => {
                  const stats = getModuleStats(mod, progress.completedLessons);
                  if (activeFilter === "done") return stats.done === stats.total;
                  if (activeFilter === "focus") {
                    const isPartial = stats.done > 0 && stats.done < stats.total;
                    const isNextUp = mod.id === firstIncompleteModId;
                    return isPartial || isNextUp;
                  }
                  return true;
                });

                return (
                  <div
                    key={course.id}
                    className={`tracker-course-item ${isExpanded ? "is-expanded" : ""}`}
                  >
                    <div className="tracker-course-row">
                      <button
                        type="button"
                        className="tracker-course-select"
                        aria-expanded={isExpanded}
                        aria-controls={`tracker-details-${course.id}`}
                        onClick={() =>
                          setExpandedCourses((prev) => ({
                            ...prev,
                            [course.id]: !(prev[course.id] ?? visibleCourses.length === 1),
                          }))
                        }
                      >
                        <Icon
                          name="chevron"
                          size={15}
                          className={isExpanded ? "chevron-open" : "chevron-closed"}
                        />
                        <div>
                          <strong>{course.title}</strong>
                          <small className="tabular">
                            {cDone}/{cLessons.length} lessons · {cQuizzes}/{course.modules.length}{" "}
                            {course.assessmentKind === "practice-set" ? "practice sets" : "quizzes"}
                            {cShaky > 0
                              ? ` · ${cShaky} shaky`
                              : cNotes.length > 0
                                ? ` · ${cNotes.length} ${cNotes.length === 1 ? "note" : "notes"}`
                                : ""}
                          </small>
                        </div>
                      </button>
                      <div className="tracker-course-actions">
                        <span className="tracker-course-pct tabular">{cPct}%</span>
                        {nextLesson && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenLesson(course.id, nextLesson.id)}
                          >
                            {cDone > 0 ? "Resume" : "Start"}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ transform: `scaleX(${cPct / 100})` }} />
                    </div>

                    <div
                      id={`tracker-details-${course.id}`}
                      className={`accordion-collapse ${isExpanded ? "is-open" : ""}`}
                      aria-hidden={!isExpanded}
                      inert={!isExpanded || undefined}
                    >
                      <div className="accordion-collapse-inner">
                        <div className="tracker-course-details">
                        <div className="tracker-details-head">
                          <div className="timer-mode-tabs" role="tablist" aria-label={`${course.title} details`}>
                            <button
                              id={`tracker-tab-mod-${course.id}`}
                              type="button"
                              role="tab"
                              aria-selected={activeTab === "modules"}
                              aria-controls={`tracker-panel-${course.id}`}
                              tabIndex={activeTab === "modules" ? 0 : -1}
                              className={activeTab === "modules" ? "is-active" : ""}
                              onClick={() =>
                                setCourseTabs((prev) => ({ ...prev, [course.id]: "modules" }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "End" || e.key === "Home") {
                                  e.preventDefault();
                                  setCourseTabs((prev) => ({ ...prev, [course.id]: "notes" }));
                                  (e.currentTarget.nextElementSibling as HTMLButtonElement | null)?.focus();
                                }
                              }}
                            >
                              Modules
                            </button>
                            <button
                              id={`tracker-tab-notes-${course.id}`}
                              type="button"
                              role="tab"
                              aria-selected={activeTab === "notes"}
                              aria-controls={`tracker-panel-${course.id}`}
                              tabIndex={activeTab === "notes" ? 0 : -1}
                              className={activeTab === "notes" ? "is-active" : ""}
                              onClick={() =>
                                setCourseTabs((prev) => ({ ...prev, [course.id]: "notes" }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
                                  e.preventDefault();
                                  setCourseTabs((prev) => ({ ...prev, [course.id]: "modules" }));
                                  (e.currentTarget.previousElementSibling as HTMLButtonElement | null)?.focus();
                                }
                              }}
                            >
                              Notes ({cNotes.length})
                            </button>
                          </div>

                          {activeTab === "notes" && cShaky > 0 && (
                            <button
                              type="button"
                              aria-pressed={cShakyOnly}
                              className={`lab-pill-btn ${cShakyOnly ? "is-active" : ""}`}
                              onClick={() =>
                                setCourseShakyOnly((prev) => ({ ...prev, [course.id]: !prev[course.id] }))
                              }
                            >
                              Shaky only ({cShaky})
                            </button>
                          )}
                        </div>

                        <div
                          id={`tracker-panel-${course.id}`}
                          role="tabpanel"
                          aria-labelledby={
                            activeTab === "modules"
                              ? `tracker-tab-mod-${course.id}`
                              : `tracker-tab-notes-${course.id}`
                          }
                        >
                        {activeTab === "modules" ? (
                          <>
                            <div className="tracker-filter-row" role="group" aria-label={`Filter ${course.title} modules`}>
                              {(
                                [
                                  { id: "focus", label: "Up next" },
                                  { id: "all", label: `All (${course.modules.length})` },
                                  { id: "done", label: "Completed" },
                                ] as const
                              ).map((tab) => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  aria-pressed={activeFilter === tab.id}
                                  className={`lab-pill-btn ${activeFilter === tab.id ? "is-active" : ""}`}
                                  onClick={() =>
                                    setCourseFilters((prev) => ({ ...prev, [course.id]: tab.id }))
                                  }
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            {visibleMods.length === 0 ? (
                              <p className="empty-copy">
                                {activeFilter === "done"
                                  ? "No completed modules yet."
                                  : "All modules in this course are complete."}
                              </p>
                            ) : (
                              <div key={`${course.id}-${activeFilter}`} className="module-compact-list panel-swap-enter">
                                {visibleMods.map((mod) => {
                                  const stats = getModuleStats(mod, progress.completedLessons);
                                  const nextInMod =
                                    mod.lessons.find((l) => !doneSet.has(l.id)) ?? mod.lessons[0];
                                  const quizRes = progress.quizResults[mod.id];
                                  const mcqRes =
                                    course.assessmentKind === "practice-set" && mod.quizCount
                                      ? progress.conceptualQuizResults?.[mod.id]
                                      : undefined;
                                  return (
                                    <div key={mod.id} className="module-compact-row">
                                      <div className="module-compact-info">
                                        <div className="module-compact-title">
                                          <span className="mod-num tabular">{mod.number}</span>
                                          <strong>{mod.title}</strong>
                                        </div>
                                        <div className="module-compact-meta">
                                          <div className="progress-track is-mini">
                                            <div className="progress-fill" style={{ transform: `scaleX(${stats.percent / 100})` }} />
                                          </div>
                                          <small className="tabular">
                                            {stats.done}/{stats.total}
                                            {quizRes
                                              ? course.assessmentKind === "practice-set"
                                                ? ` · Set ${quizRes.score}/${quizRes.total}`
                                                : ` · Quiz ${quizRes.score}/${quizRes.total}`
                                              : ""}
                                            {mcqRes ? ` · Quiz ${mcqRes.score}/${mcqRes.total}` : ""}
                                          </small>
                                        </div>
                                      </div>
                                      <div className="tracker-mod-btns">
                                        <button
                                          type="button"
                                          className="btn btn-ghost btn-sm"
                                          onClick={() => onOpenQuiz(course.id, mod.id, { tab: "practice" })}
                                        >
                                          {course.assessmentKind === "practice-set" &&
                                          Boolean(mod.quizCount && mod.quizCount > 0)
                                            ? "Practice & Quiz"
                                            : course.assessmentKind === "practice-set"
                                              ? "Practice"
                                              : quizRes
                                                ? "Retake"
                                                : "Quiz"}
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-secondary btn-sm"
                                          onClick={() => onOpenLesson(course.id, nextInMod.id)}
                                        >
                                          {stats.done === stats.total ? "Review" : "Study"}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {cNotes.length > 4 && (
                              <div className="sidebar-search-box">
                                <Icon name="search" size={14} />
                                <input
                                  type="search"
                                  value={courseNoteQueries[course.id] ?? ""}
                                  onChange={(e) =>
                                    setCourseNoteQueries((prev) => ({ ...prev, [course.id]: e.target.value }))
                                  }
                                  placeholder={`Search ${course.title} notes...`}
                                  aria-label={`Search ${course.title} notes`}
                                />
                              </div>
                            )}

                            {cNotes.length === 0 ? (
                              <p className="empty-copy">
                                No notes or shaky flags saved in {course.title} yet. Flag a concept inside any lesson to review it here.
                              </p>
                            ) : cFilteredNotes.length === 0 ? (
                              <p className="empty-copy">No notes match this filter.</p>
                            ) : (
                              <>
                                <SavedNotesList
                                  notes={cDisplayedNotes}
                                  showCourseContext={false}
                                  onOpenLesson={onOpenLesson}
                                />
                                {cFilteredNotes.length > 4 && (
                                  <button
                                    type="button"
                                    className="text-link-btn"
                                    onClick={() =>
                                      setShowAllCourseNotes((prev) => ({
                                        ...prev,
                                        [course.id]: !prev[course.id],
                                      }))
                                    }
                                  >
                                    {cShowAllNotes
                                      ? "Show fewer notes"
                                      : `Show all ${cFilteredNotes.length} notes`}
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </section>
      </div>
    </div>
  );
}
