import type { CourseModule } from "@/lib/curriculum";

export type ConfidenceLevel = "learning" | "shaky" | "solid";
export type ThemeMode = "light" | "dark";

export type LessonNote = {
  note: string;
  confidence: ConfidenceLevel;
  updatedAt: string;
};

export type QuizResult = {
  score: number;
  total: number;
  missedIds: string[];
  updatedAt: string;
};

export type StudySession = {
  id: string;
  date: string;
  focus: string;
  minutes: number;
  courseId?: string;
  lessonId?: string;
  note: string;
};

export type ProgressState = {
  version: 7;
  theme: ThemeMode;
  completedLessons: string[];
  completedPractice: string[];
  quizResults: Record<string, QuizResult>;
  conceptualQuizResults?: Record<string, QuizResult>;
  lessonNotes: Record<string, LessonNote>;
  sessions: StudySession[];
  weeklyGoalMinutes: number;
  lastExportedAt?: string;
};

export type ActivityDay = {
  date: string;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export const STORAGE_KEY = "fieldnote-learning-progress-v7";
export const QUIZ_PASS_THRESHOLD = 0.8;
export const LEGACY_STORAGE_KEYS = [
  "fieldnote-learning-progress-v6",
  "fieldnote-learning-progress-v5",
  "fieldnote-learning-progress-v4",
  "ai-ml-hub-progress-v3",
];

// Map earlier curriculum lesson IDs cleanly into the A-to-Z v7 curriculum.
const LEGACY_LESSON_MAP: Record<string, string> = {
  "py-execution": "py-tracebacks-debug",
  "py-variables-refs": "py-refs-mutability",
  "py-primitives-io": "py-strings-fstrings",
  "py-strings-io": "py-strings-fstrings",
  "py-operators-truthiness": "py-logical-ops",
  "py-strings": "py-string-tools",
  "py-conditionals": "py-elif-chains",
  "py-loops": "py-for-lists",
  "py-functions": "py-functions-intro",
  "py-args-guard-clauses": "py-default-keyword-args",
  "py-decomposition-recursion": "py-decomposition",
  "py-scope-defaults": "py-scope-basics",
  "py-closures-args": "py-closures",
  "py-lists-mutability": "py-aliasing-copy",
  "py-aliasing-copy-defaults": "py-aliasing-copy",
  "py-tuples-unpacking": "py-tuples-unpacking",
  "py-dicts-hashing": "py-dicts-basics",
  "py-sets": "py-sets-unique",
  "py-comprehensions-zip": "py-comprehensions",
  "py-exceptions": "py-exceptions-try",
  "py-files-pathlib": "py-files-pathlib",
  "py-json-csv": "py-json-csv",
  "py-iterators-generators": "py-generators",
  "py-decorators": "py-decorators",
  "py-classes-self": "py-classes-self",
  "py-dunder-properties": "py-dunders",
  "py-dunders-property": "py-dunders",
  "py-composition-inheritance": "py-composition",
  "py-dataclasses-enums": "py-dataclasses",
  "py-dataclasses-enum": "py-dataclasses",
  "py-mro-abc-descriptors": "py-mro-abc",
  "py-custom-exceptions-functools": "py-custom-exceptions",
  "py-type-hints": "py-type-hints",
  "py-modules-packages": "py-modules-packages",
  "py-env-packaging": "py-venv-packaging",
  "py-testing-pytest": "py-pytest-testing",
  "py-modules-venv-testing": "py-pytest-testing",
  "py-threads-processes": "py-thread-process-pools",
  "py-logging-cli": "py-logging-structured",
  "py-generics-typing-tools": "py-generics-callable",
  "p1-run": "py-hello-print",
  "p1-vars": "py-variables-basics",
  "p1-if": "py-if-else",
  "p1-for": "py-for-lists",
  "p1-while": "py-while-loops",
  "p1-lists": "py-lists-intro",
  "p1-dicts": "py-dicts-basics",
};

export function isValidDayKey(dayKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return false;
  const [y, m, d] = dayKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function getDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dayKey: string, deltaDays: number): string {
  if (!isValidDayKey(dayKey)) return "";
  const [y, m, d] = dayKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

export function createInitialProgress(): ProgressState {
  return {
    version: 7,
    theme: "light",
    completedLessons: [],
    completedPractice: [],
    quizResults: {},
    conceptualQuizResults: {},
    lessonNotes: {},
    sessions: [],
    weeklyGoalMinutes: 300,
  };
}

function normaliseQuizResultMap(raw: unknown, modSet: Set<string>): Record<string, QuizResult> {
  const out: Record<string, QuizResult> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [modId, val] of Object.entries(raw as Record<string, unknown>)) {
    if ((modSet.size > 0 && !modSet.has(modId)) || !val || typeof val !== "object") continue;
    const qr = val as Record<string, unknown>;
    const score = Number(qr.score);
    const total = Number(qr.total);
    if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) continue;
    out[modId] = {
      score: Math.max(0, Math.min(total, Math.round(score))),
      total: Math.round(total),
      missedIds: Array.isArray(qr.missedIds)
        ? qr.missedIds.filter((x): x is string => typeof x === "string")
        : [],
      updatedAt: typeof qr.updatedAt === "string" ? qr.updatedAt : "",
    };
  }
  return out;
}

function normaliseLessonIdList(raw: unknown, validSet: Set<string>): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const mapped = validSet.has(item) ? item : LEGACY_LESSON_MAP[item];
    if (mapped && validSet.has(mapped) && !seen.has(mapped)) {
      seen.add(mapped);
      out.push(mapped);
    }
  }
  return out;
}

export function normaliseProgress(
  raw: unknown,
  validLessonIds: string[],
  validModuleIds: string[] = [],
): ProgressState | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const base = createInitialProgress();
  const validSet = new Set(validLessonIds);
  const modSet = new Set(validModuleIds);

  const completedLessons = normaliseLessonIdList(
    Array.isArray(obj.completedLessons) ? obj.completedLessons : obj.completedTopics,
    validSet,
  );
  const completedPractice = normaliseLessonIdList(obj.completedPractice, validSet);

  const quizResults = normaliseQuizResultMap(obj.quizResults, modSet);
  const conceptualQuizResults = normaliseQuizResultMap(obj.conceptualQuizResults, modSet);

  const rawNotes =
    obj.lessonNotes && typeof obj.lessonNotes === "object"
      ? (obj.lessonNotes as Record<string, unknown>)
      : obj.topicNotes && typeof obj.topicNotes === "object"
        ? (obj.topicNotes as Record<string, unknown>)
        : {};

  const lessonNotes: Record<string, LessonNote> = {};
  for (const [k, val] of Object.entries(rawNotes)) {
    const mappedKey = validSet.has(k) ? k : LEGACY_LESSON_MAP[k];
    if (!mappedKey || !validSet.has(mappedKey) || !val || typeof val !== "object") continue;
    const rec = val as Record<string, unknown>;
    const confidence =
      rec.confidence === "learning" || rec.confidence === "shaky" || rec.confidence === "solid"
        ? rec.confidence
        : "learning";
    const note = typeof rec.note === "string" ? rec.note.slice(0, 4000) : "";
    const updatedAt = typeof rec.updatedAt === "string" ? rec.updatedAt : "";
    if (note || confidence !== "learning") {
      lessonNotes[mappedKey] = { note, confidence, updatedAt };
    }
  }

  const sessions: StudySession[] = [];
  const seenSessionIds = new Set<string>();
  if (Array.isArray(obj.sessions)) {
    for (const s of obj.sessions) {
      if (!s || typeof s !== "object") continue;
      const item = s as Record<string, unknown>;
      const mins = Number(item.minutes);
      if (
        typeof item.id !== "string" ||
        !item.id ||
        seenSessionIds.has(item.id) ||
        typeof item.date !== "string" ||
        !isValidDayKey(item.date) ||
        !Number.isFinite(mins) ||
        mins <= 0
      ) {
        continue;
      }
      seenSessionIds.add(item.id);
      const rawLesson = typeof item.lessonId === "string" ? item.lessonId : typeof item.topicId === "string" ? item.topicId : "";
      const mappedLesson = validSet.has(rawLesson) ? rawLesson : LEGACY_LESSON_MAP[rawLesson];
      sessions.push({
        id: item.id,
        date: item.date,
        focus: typeof item.focus === "string" ? item.focus.slice(0, 120) : "Study session",
        minutes: Math.min(720, Math.round(mins)),
        courseId: typeof item.courseId === "string" ? item.courseId : "python",
        lessonId: mappedLesson,
        note: typeof item.note === "string" ? item.note.slice(0, 1000) : "",
      });
    }
  }

  sessions.sort((a, b) => b.date.localeCompare(a.date));

  const profileTheme =
    obj.theme === "dark" || obj.theme === "light"
      ? obj.theme
      : obj.profile && typeof obj.profile === "object" && (obj.profile as Record<string, unknown>).theme === "dark"
        ? "dark"
        : "light";

  const weeklyGoalMinutes =
    typeof obj.weeklyGoalMinutes === "number" && Number.isFinite(obj.weeklyGoalMinutes)
      ? Math.max(60, Math.min(4200, Math.round(obj.weeklyGoalMinutes)))
      : base.weeklyGoalMinutes;

  const lastExportedAt =
    typeof obj.lastExportedAt === "string" &&
    Number.isFinite(Date.parse(obj.lastExportedAt)) &&
    isValidDayKey(obj.lastExportedAt.slice(0, 10))
      ? obj.lastExportedAt
      : undefined;

  return {
    version: 7,
    theme: profileTheme,
    completedLessons,
    completedPractice,
    quizResults,
    conceptualQuizResults,
    lessonNotes,
    sessions: sessions.slice(0, 500),
    weeklyGoalMinutes,
    lastExportedAt,
  };
}

export function getCurrentStreak(sessions: StudySession[], todayKey: string): number {
  if (!isValidDayKey(todayKey)) return 0;
  const days = new Set(sessions.filter((s) => s.minutes > 0 && isValidDayKey(s.date)).map((s) => s.date));
  let cursor = days.has(todayKey) ? todayKey : addDays(todayKey, -1);
  let streak = 0;
  while (cursor && days.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function getWeekMinutes(sessions: StudySession[], todayKey: string): number {
  if (!isValidDayKey(todayKey)) return 0;
  const start = addDays(todayKey, -6);
  return sessions
    .filter((s) => isValidDayKey(s.date) && s.date >= start && s.date <= todayKey)
    .reduce((sum, s) => sum + s.minutes, 0);
}

export function getActivityHeatmap(
  sessions: StudySession[],
  weeksCount: number,
  todayKey: string,
): ActivityDay[] {
  if (!isValidDayKey(todayKey)) return [];
  const dailyTotals = new Map<string, number>();
  for (const s of sessions) {
    if (!isValidDayKey(s.date)) continue;
    dailyTotals.set(s.date, (dailyTotals.get(s.date) ?? 0) + s.minutes);
  }
  const [y, m, d] = todayKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const mondayBased = (dt.getUTCDay() + 6) % 7;
  const endMonday = addDays(todayKey, -mondayBased);
  const startDay = addDays(endMonday, -(weeksCount - 1) * 7);

  const days: ActivityDay[] = [];
  for (let i = 0; i < weeksCount * 7; i += 1) {
    const date = addDays(startDay, i);
    const minutes = dailyTotals.get(date) ?? 0;
    const level: ActivityDay["level"] =
      minutes === 0 ? 0 : minutes < 25 ? 1 : minutes < 50 ? 2 : minutes < 90 ? 3 : 4;
    days.push({ date, minutes, level });
  }
  return days;
}

export function getDailyActivitySeries(
  sessions: StudySession[],
  daysCount: number,
  todayKey: string,
): ActivityDay[] {
  if (!isValidDayKey(todayKey) || daysCount <= 0) return [];
  const dailyTotals = new Map<string, number>();
  for (const s of sessions) {
    if (!isValidDayKey(s.date)) continue;
    dailyTotals.set(s.date, (dailyTotals.get(s.date) ?? 0) + s.minutes);
  }
  const startDay = addDays(todayKey, -(daysCount - 1));
  const days: ActivityDay[] = [];
  for (let i = 0; i < daysCount; i += 1) {
    const date = addDays(startDay, i);
    const minutes = dailyTotals.get(date) ?? 0;
    const level: ActivityDay["level"] =
      minutes === 0 ? 0 : minutes < 25 ? 1 : minutes < 50 ? 2 : minutes < 90 ? 3 : 4;
    days.push({ date, minutes, level });
  }
  return days;
}

export function getModuleStats(mod: CourseModule, completedLessons: string[]) {
  const doneSet = new Set(completedLessons);
  const total = mod.lessons.length;
  const done = mod.lessons.filter((l) => doneSet.has(l.id)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function shouldRemindBackup(progress: ProgressState, todayKey: string): boolean {
  const meaningful =
    progress.completedLessons.length +
    progress.completedPractice.length +
    Object.keys(progress.quizResults).length +
    Object.keys(progress.conceptualQuizResults ?? {}).length +
    Object.keys(progress.lessonNotes).length +
    progress.sessions.length;
  if (meaningful < 3) return false;
  if (!isValidDayKey(todayKey)) return false;
  if (!progress.lastExportedAt) return true;
  const exportedDay = progress.lastExportedAt.slice(0, 10);
  if (!isValidDayKey(exportedDay)) return true;
  return exportedDay <= addDays(todayKey, -7);
}
