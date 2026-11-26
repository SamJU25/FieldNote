"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { TopNav, type AppSection } from "@/components/top-nav";
import { HomeView } from "@/components/home-view";
import { CoursesView, type CourseSubView } from "@/components/courses-view";
import { TrackerView, type FocusTimerControls } from "@/components/tracker-view";
import { courses, getAllValidLessonIds, getAllValidModuleIds, getCourseById } from "@/lib/curriculum";
import {
  createInitialProgress,
  getDayKey,
  isValidDayKey,
  LEGACY_STORAGE_KEYS,
  normaliseProgress,
  shouldRemindBackup,
  STORAGE_KEY,
  type ConfidenceLevel,
  type ProgressState,
  type QuizResult,
  type StudySession,
} from "@/lib/progress";

const TIMER_STORAGE_KEY = "fieldnote-timer-v1";
const DEFAULT_DOCUMENT_TITLE = "Fieldnote | Interactive Courses & Study Tracker";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function scrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

type ParsedHashState = {
  section?: AppSection;
  courseSubView?: CourseSubView;
  activeCourseId?: string;
  activeLessonId?: string;
  activeQuizModuleId?: string;
  quizTab?: "practice" | "mcq";
};

function parseHashState(
  rawHash: string,
  validLessonIds: string[],
  validModuleIds: string[],
): ParsedHashState {
  if (!rawHash) return {};
  const hp = new URLSearchParams(rawHash.replace(/^#/, ""));
  const out: ParsedHashState = {};
  const hashSection = hp.get("section");
  const hashSub = hp.get("mode");
  const hashCourse = hp.get("course");
  const hashLesson = hp.get("lesson");
  const hashModule = hp.get("module");
  const hashTab = hp.get("tab");

  if (hashSection === "home" || hashSection === "courses" || hashSection === "tracker") {
    out.section = hashSection;
  }
  if (hashSub === "catalog" || hashSub === "overview" || hashSub === "lesson" || hashSub === "quiz") {
    out.courseSubView = hashSub;
  } else if (hashSection === "courses") {
    out.courseSubView = "catalog";
  }
  if (hashCourse && courses.some((c) => c.id === hashCourse)) {
    out.activeCourseId = hashCourse;
  }
  if (hashLesson && validLessonIds.includes(hashLesson)) {
    out.activeLessonId = hashLesson;
  }
  if (hashModule && validModuleIds.includes(hashModule)) {
    out.activeQuizModuleId = hashModule;
  }
  if (hashSub === "quiz" && (hashTab === "practice" || hashTab === "mcq")) {
    out.quizTab = hashTab;
  }
  return out;
}

function resolveCourseForHash(
  parsed: ParsedHashState,
): string | undefined {
  if (parsed.activeLessonId) {
    const matched = courses.find((c) =>
      c.modules.some((m) => m.lessons.some((l) => l.id === parsed.activeLessonId)),
    );
    if (matched) return matched.id;
  }
  if (parsed.activeQuizModuleId) {
    const matched = courses.find((c) => c.modules.some((m) => m.id === parsed.activeQuizModuleId));
    if (matched) return matched.id;
  }
  return parsed.activeCourseId;
}

export function LearningWorkspace() {
  const validLessonIds = useMemo(() => getAllValidLessonIds(), []);
  const validModuleIds = useMemo(() => getAllValidModuleIds(), []);
  const [progress, setProgress] = useState<ProgressState>(() => createInitialProgress());
  const [ready, setReady] = useState(false);

  const [section, setSection] = useState<AppSection>("home");
  const [courseSubView, setCourseSubView] = useState<CourseSubView>("catalog");
  const [activeCourseId, setActiveCourseId] = useState<string>(courses[0].id);
  const [activeLessonId, setActiveLessonId] = useState<string>(courses[0].modules[0].lessons[0].id);
  const [activeQuizModuleId, setActiveQuizModuleId] = useState<string>(courses[0].modules[0].id);
  const [todayKey, setTodayKey] = useState("");
  const [toast, setToast] = useState<{
    text: string;
    id: number;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);
  const [toastPaused, setToastPaused] = useState(false);

  // Focus Timer
  const [timerMode, setTimerMode] = useState<"stopwatch" | "pomodoro">("stopwatch");
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerFocusLabel, setTimerFocusLabel] = useState("");
  const [timerCourseId, setTimerCourseId] = useState(courses[0].id);
  const [timerLessonId, setTimerLessonId] = useState("");
  const [lessonLaunchOpt, setLessonLaunchOpt] = useState<{
    lessonId: string;
    openNotes: boolean;
    nonce: number;
  } | null>(null);
  const [quizLaunchOpt, setQuizLaunchOpt] = useState<{
    moduleId: string;
    tab: "practice" | "mcq";
    nonce: number;
  } | null>(null);
  const [activeQuizTab, setActiveQuizTab] = useState<"practice" | "mcq">("practice");

  // Modals
  const [logOpen, setLogOpen] = useState(false);
  const [sessionCourseId, setSessionCourseId] = useState(courses[0].id);
  const [sessionFocus, setSessionFocus] = useState("");
  const [sessionMinutes, setSessionMinutes] = useState("30");
  const [sessionDate, setSessionDate] = useState("");
  const [logError, setLogError] = useState("");
  const [logErrorField, setLogErrorField] = useState<"" | "focus" | "minutes" | "date">("");
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalHours, setGoalHours] = useState("5");
  const [goalError, setGoalError] = useState("");

  const importRef = useRef<HTMLInputElement>(null);
  const logDialogRef = useRef<HTMLDialogElement>(null);
  const goalDialogRef = useRef<HTMLDialogElement>(null);
  const logInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const goalInputRef = useRef<HTMLInputElement>(null);
  const storageWarnedRef = useRef(false);
  const timerAnchorMsRef = useRef(0);
  const timerAnchorSecRef = useRef(0);
  const hashSyncedOnceRef = useRef(false);

  const showToast = useCallback(
    (text: string, action?: { label: string; onAction: () => void }) => {
      setToastPaused(false);
      setToast((prev) => ({
        text,
        id: (prev?.id ?? 0) + 1,
        actionLabel: action?.label,
        onAction: action?.onAction,
      }));
    },
    [],
  );

  const applyHashFromLocation = useCallback(() => {
    if (!window.location.hash) {
      setSection("home");
      setCourseSubView("catalog");
      return;
    }
    const parsed = parseHashState(window.location.hash, validLessonIds, validModuleIds);
    const resolvedCourseId = resolveCourseForHash(parsed);
    setSection(parsed.section ?? "home");
    setCourseSubView(parsed.courseSubView ?? "catalog");
    if (resolvedCourseId) setActiveCourseId(resolvedCourseId);
    if (parsed.activeLessonId) setActiveLessonId(parsed.activeLessonId);
    if (parsed.activeQuizModuleId) setActiveQuizModuleId(parsed.activeQuizModuleId);
    if (parsed.courseSubView === "quiz") {
      const nextTab = parsed.quizTab ?? "practice";
      setActiveQuizTab(nextTab);
      if (parsed.activeQuizModuleId) {
        const modId = parsed.activeQuizModuleId;
        setQuizLaunchOpt((prev) => ({
          moduleId: modId,
          tab: nextTab,
          nonce: (prev?.nonce ?? 0) + 1,
        }));
      }
    }
  }, [validLessonIds, validModuleIds]);

  useLayoutEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      let loaded = false;
      for (const key of [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]) {
        try {
          const raw = window.localStorage.getItem(key);
          if (!raw) continue;
          const normalized = normaliseProgress(JSON.parse(raw), validLessonIds, validModuleIds);
          if (normalized) {
            setProgress(normalized);
            loaded = true;
            break;
          }
        } catch {
          // Ignore malformed storage entries safely
        }
      }
      if (!loaded && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        setProgress((prev) => ({ ...prev, theme: "dark" }));
      }

      try {
        const rawTimer = window.localStorage.getItem(TIMER_STORAGE_KEY);
        if (rawTimer) {
          const parsedTimer = JSON.parse(rawTimer) as Record<string, unknown>;
          const mode = parsedTimer.mode === "pomodoro" ? "pomodoro" : "stopwatch";
          const pomo =
            typeof parsedTimer.pomodoroMinutes === "number" &&
            (parsedTimer.pomodoroMinutes === 25 || parsedTimer.pomodoroMinutes === 45)
              ? parsedTimer.pomodoroMinutes
              : 25;
          const anchorMs = typeof parsedTimer.anchorMs === "number" ? parsedTimer.anchorMs : 0;
          const anchorSec = typeof parsedTimer.anchorSec === "number" ? parsedTimer.anchorSec : 0;
          const storedSec = typeof parsedTimer.seconds === "number" ? Math.max(0, parsedTimer.seconds) : 0;
          const running = parsedTimer.running === true && anchorMs > 0;
          setTimerMode(mode);
          setPomodoroMinutes(pomo);
          if (typeof parsedTimer.focusLabel === "string") setTimerFocusLabel(parsedTimer.focusLabel);
          if (typeof parsedTimer.courseId === "string") setTimerCourseId(parsedTimer.courseId);
          if (typeof parsedTimer.lessonId === "string") setTimerLessonId(parsedTimer.lessonId);
          if (running) {
            const elapsed = Math.max(0, Math.floor((Date.now() - anchorMs) / 1000));
            const nextSec = mode === "stopwatch" ? anchorSec + elapsed : Math.max(0, anchorSec - elapsed);
            timerAnchorMsRef.current = anchorMs;
            timerAnchorSecRef.current = anchorSec;
            setTimerSeconds(nextSec);
            setTimerRunning(mode === "stopwatch" || nextSec > 0);
          } else {
            setTimerSeconds(storedSec);
          }
        }
      } catch {
        // Ignore malformed timer state safely
      }

      if (window.location.hash) {
        applyHashFromLocation();
      }

      const today = getDayKey(new Date());
      setTodayKey(today);
      setSessionDate(today);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [applyHashFromLocation, validLessonIds, validModuleIds]);

  useEffect(() => {
    const onHashChange = () => {
      applyHashFromLocation();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const synced = normaliseProgress(JSON.parse(e.newValue), validLessonIds, validModuleIds);
        if (synced) setProgress(synced);
      } catch {
        // Ignore invalid cross-tab storage payloads
      }
    };
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [applyHashFromLocation, validLessonIds, validModuleIds]);

  useEffect(() => {
    if (!ready) return;
    const syncDay = window.setInterval(() => {
      const nextDay = getDayKey(new Date());
      setTodayKey((prev) => (prev === nextDay ? prev : nextDay));
    }, 60000);
    return () => window.clearInterval(syncDay);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      storageWarnedRef.current = false;
    } catch {
      if (!storageWarnedRef.current) {
        storageWarnedRef.current = true;
        window.queueMicrotask(() => {
          showToast("Browser storage is full or blocked. Export a JSON backup to keep progress.");
        });
      }
    }
    document.documentElement.dataset.theme = progress.theme;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", progress.theme === "dark" ? "#090a0b" : "#f6f4ef");
    }
  }, [progress, ready, showToast]);

  useEffect(() => {
    if (!ready) return;
    const hp = new URLSearchParams();
    hp.set("section", section);
    if (section === "courses") {
      hp.set("mode", courseSubView);
      if (courseSubView !== "catalog") hp.set("course", activeCourseId);
      if (courseSubView === "lesson") hp.set("lesson", activeLessonId);
      if (courseSubView === "quiz") {
        hp.set("module", activeQuizModuleId);
        if (activeQuizTab === "mcq") hp.set("tab", "mcq");
      }
    }
    const nextHash = `#${hp.toString()}`;
    if (!hashSyncedOnceRef.current || !window.location.hash) {
      hashSyncedOnceRef.current = true;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
    } else if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  }, [section, courseSubView, activeCourseId, activeLessonId, activeQuizModuleId, activeQuizTab, ready]);

  useEffect(() => {
    if (!toast || toastPaused) return;
    const ms = toast.actionLabel ? 4600 : 3200;
    const t = window.setTimeout(() => setToast(null), ms);
    return () => window.clearTimeout(t);
  }, [toast, toastPaused]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          mode: timerMode,
          pomodoroMinutes,
          running: timerRunning,
          seconds: timerSeconds,
          anchorMs: timerAnchorMsRef.current,
          anchorSec: timerAnchorSecRef.current,
          focusLabel: timerFocusLabel,
          courseId: timerCourseId,
          lessonId: timerLessonId,
        }),
      );
    } catch {
      // Ignore storage quota blocks for ephemeral timer
    }
  }, [ready, timerMode, pomodoroMinutes, timerRunning, timerSeconds, timerFocusLabel, timerCourseId, timerLessonId]);

  useEffect(() => {
    if (!timerRunning) return;
    const syncElapsed = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - timerAnchorMsRef.current) / 1000));
      if (timerMode === "stopwatch") {
        setTimerSeconds(timerAnchorSecRef.current + elapsed);
        return;
      }
      const remaining = Math.max(0, timerAnchorSecRef.current - elapsed);
      setTimerSeconds(remaining);
      if (remaining === 0) {
        setTimerRunning(false);
        showToast("Focus timer complete. Log it when ready.");
      }
    };
    const interval = window.setInterval(syncElapsed, 1000);
    const onVisibility = () => {
      if (!document.hidden) syncElapsed();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [timerRunning, timerMode, showToast]);

  useEffect(() => {
    const dlg = logDialogRef.current;
    if (!dlg) return;
    if (logOpen && !dlg.open) {
      dlg.showModal();
      logInputRef.current?.focus();
    } else if (!logOpen && dlg.open) {
      dlg.close();
    }
  }, [logOpen]);

  useEffect(() => {
    const dlg = goalDialogRef.current;
    if (!dlg) return;
    if (goalOpen && !dlg.open) {
      dlg.showModal();
      goalInputRef.current?.focus();
    } else if (!goalOpen && dlg.open) {
      dlg.close();
    }
  }, [goalOpen]);

  const timerDisplay = useMemo(() => {
    if (timerMode === "stopwatch") return formatClock(timerSeconds);
    const total = pomodoroMinutes * 60;
    const showing = timerRunning || timerSeconds > 0 ? timerSeconds : total;
    return formatClock(showing);
  }, [timerMode, timerSeconds, pomodoroMinutes, timerRunning]);

  useEffect(() => {
    document.title = timerRunning ? `${timerDisplay} · Fieldnote` : DEFAULT_DOCUMENT_TITLE;
    return () => {
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, [timerRunning, timerDisplay]);

  const timerActive =
    timerRunning ||
    (timerMode === "stopwatch" ? timerSeconds > 0 : timerSeconds < pomodoroMinutes * 60);

  const startTimerClock = () => {
    const starting = timerMode === "pomodoro" && timerSeconds === 0 ? pomodoroMinutes * 60 : timerSeconds;
    timerAnchorMsRef.current = Date.now();
    timerAnchorSecRef.current = starting;
    if (starting !== timerSeconds) setTimerSeconds(starting);
    setTimerRunning(true);
  };

  const elapsedTimerSeconds =
    timerMode === "stopwatch" ? timerSeconds : Math.max(0, pomodoroMinutes * 60 - timerSeconds);

  const timerControls: FocusTimerControls = {
    mode: timerMode,
    pomodoroMinutes,
    running: timerRunning,
    seconds: timerSeconds,
    elapsedSeconds: elapsedTimerSeconds,
    display: timerDisplay,
    focusLabel: timerFocusLabel,
    courseId: timerCourseId,
    setMode: (m) => {
      setTimerRunning(false);
      setTimerMode(m);
      setTimerSeconds(m === "stopwatch" ? 0 : pomodoroMinutes * 60);
    },
    setPomodoroMinutes: (mins) => {
      setPomodoroMinutes(mins);
      if (!timerRunning && timerMode === "pomodoro") setTimerSeconds(mins * 60);
    },
    setFocusLabel: setTimerFocusLabel,
    setCourseId: (cid) => {
      if (courses.some((c) => c.id === cid)) {
        setTimerCourseId(cid);
        setTimerLessonId("");
      }
    },
    startPause: () => {
      if (timerRunning) {
        const elapsed = Math.max(0, Math.floor((Date.now() - timerAnchorMsRef.current) / 1000));
        const synced =
          timerMode === "stopwatch"
            ? timerAnchorSecRef.current + elapsed
            : Math.max(0, timerAnchorSecRef.current - elapsed);
        setTimerSeconds(synced);
        setTimerRunning(false);
      } else {
        startTimerClock();
      }
    },
    reset: () => {
      setTimerRunning(false);
      setTimerSeconds(timerMode === "stopwatch" ? 0 : pomodoroMinutes * 60);
    },
    saveToLog: () => {
      const elapsedSeconds =
        timerMode === "stopwatch" ? timerSeconds : Math.max(0, pomodoroMinutes * 60 - timerSeconds);
      if (elapsedSeconds < 60) {
        showToast("Run the timer for at least 1 minute before logging.");
        return;
      }
      const mins = Math.round(elapsedSeconds / 60);
      const newSession: StudySession = {
        id: createId("s"),
        date: todayKey || getDayKey(new Date()),
        focus: timerFocusLabel.trim() || "Focused study session",
        minutes: mins,
        courseId: timerCourseId,
        lessonId: timerLessonId || undefined,
        note: "",
      };
      setProgress((prev) => ({ ...prev, sessions: [newSession, ...prev.sessions] }));
      setTimerRunning(false);
      setTimerSeconds(timerMode === "stopwatch" ? 0 : pomodoroMinutes * 60);
      showToast(`Logged ${mins}m session.`);
    },
  };

  const navigateTop = (next: AppSection) => {
    if (next === "courses") {
      if (section === "courses" && courseSubView !== "catalog") {
        setCourseSubView("catalog");
      } else if (section !== "courses") {
        setCourseSubView("catalog");
      }
    }
    setSection(next);
    scrollToTop();
  };

  const openCourseOverview = (courseId: string) => {
    setActiveCourseId(courseId);
    setSection("courses");
    setCourseSubView("overview");
    scrollToTop();
  };

  const openLesson = (courseId: string, lessonId: string, options?: { openNotes?: boolean }) => {
    const course = getCourseById(courseId);
    setActiveCourseId(course.id);
    setActiveLessonId(lessonId);
    setLessonLaunchOpt((prev) => ({
      lessonId,
      openNotes: Boolean(options?.openNotes),
      nonce: (prev?.nonce ?? 0) + 1,
    }));
    setSection("courses");
    setCourseSubView("lesson");
    scrollToTop();
  };

  const openQuiz = (courseId: string, moduleId: string, options?: { tab?: "practice" | "mcq" }) => {
    const course = getCourseById(courseId);
    const nextTab = options?.tab ?? "practice";
    setActiveCourseId(course.id);
    setActiveQuizModuleId(moduleId);
    setActiveQuizTab(nextTab);
    setQuizLaunchOpt((prev) => ({
      moduleId,
      tab: nextTab,
      nonce: (prev?.nonce ?? 0) + 1,
    }));
    setSection("courses");
    setCourseSubView("quiz");
    scrollToTop();
  };

  const toggleLessonComplete = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: exists
          ? prev.completedLessons.filter((id) => id !== lessonId)
          : [...prev.completedLessons, lessonId],
      };
    });
  };

  const togglePracticeDone = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedPractice.includes(lessonId);
      return {
        ...prev,
        completedPractice: exists
          ? prev.completedPractice.filter((id) => id !== lessonId)
          : [...prev.completedPractice, lessonId],
      };
    });
  };

  const saveQuizResult = (
    moduleId: string,
    result: Omit<QuizResult, "updatedAt">,
    options?: { silent?: boolean; label?: string },
  ) => {
    setProgress((prev) => ({
      ...prev,
      quizResults: {
        ...prev.quizResults,
        [moduleId]: { ...result, updatedAt: todayKey || getDayKey(new Date()) },
      },
    }));
    if (!options?.silent) {
      showToast(`${options?.label ?? "Quiz"} saved: ${result.score}/${result.total}`);
    }
  };

  const saveConceptualQuizResult = (
    moduleId: string,
    result: Omit<QuizResult, "updatedAt">,
    options?: { silent?: boolean; label?: string },
  ) => {
    setProgress((prev) => ({
      ...prev,
      conceptualQuizResults: {
        ...(prev.conceptualQuizResults ?? {}),
        [moduleId]: { ...result, updatedAt: todayKey || getDayKey(new Date()) },
      },
    }));
    if (!options?.silent) {
      showToast(`${options?.label ?? "Conceptual quiz"} saved: ${result.score}/${result.total}`);
    }
  };

  const saveLessonNote = (
    lessonId: string,
    note: string,
    confidence: ConfidenceLevel,
    options?: { silent?: boolean },
  ) => {
    const trimmed = note.trim();
    const removing = !trimmed && confidence === "learning";
    setProgress((prev) => {
      const nextNotes = { ...prev.lessonNotes };
      if (removing) {
        delete nextNotes[lessonId];
      } else {
        nextNotes[lessonId] = {
          note: trimmed,
          confidence,
          updatedAt: todayKey || getDayKey(new Date()),
        };
      }
      return { ...prev, lessonNotes: nextNotes };
    });
    if (!options?.silent) {
      showToast(removing ? "Note cleared." : "Saved note.");
    }
  };

  const handleExportBackup = () => {
    const exportedAt = new Date().toISOString();
    const payload: ProgressState = { ...progress, lastExportedAt: exportedAt };
    setProgress(payload);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fieldnote-backup-${getDayKey(new Date())}.json`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("JSON backup exported.");
  };

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = normaliseProgress(JSON.parse(await file.text()), validLessonIds, validModuleIds);
      if (!parsed) {
        showToast("Invalid backup file.");
        return;
      }
      setProgress(parsed);
      showToast("Backup restored.");
    } catch {
      showToast("Could not read JSON file.");
    }
  };

  const submitManualSession = (e: FormEvent) => {
    e.preventDefault();
    const rawFocus = sessionFocus.trim();
    const rawMins = Number(sessionMinutes);
    const currentDay = todayKey || getDayKey(new Date());
    if (!rawFocus) {
      setLogErrorField("focus");
      setLogError("Enter what you practiced before saving.");
      logInputRef.current?.focus();
      return;
    }
    if (!Number.isFinite(rawMins) || rawMins < 1 || rawMins > 720) {
      setLogErrorField("minutes");
      setLogError("Minutes must be a whole number between 1 and 720.");
      minutesInputRef.current?.focus();
      return;
    }
    if (!isValidDayKey(sessionDate) || (currentDay && sessionDate > currentDay)) {
      setLogErrorField("date");
      setLogError("Select a valid study date up to today.");
      dateInputRef.current?.focus();
      return;
    }
    const mins = Math.round(rawMins);
    const entry: StudySession = {
      id: createId("s"),
      date: sessionDate,
      focus: rawFocus,
      minutes: mins,
      courseId: sessionCourseId,
      note: "",
    };
    setProgress((prev) => ({ ...prev, sessions: [entry, ...prev.sessions] }));
    setSessionFocus("");
    setLogError("");
    setLogErrorField("");
    setLogOpen(false);
    showToast(`Logged ${mins}m session.`);
  };

  const submitGoal = (e: FormEvent) => {
    e.preventDefault();
    const rawHrs = Number(goalHours);
    if (!Number.isFinite(rawHrs) || rawHrs < 1 || rawHrs > 70) {
      setGoalError("Weekly target must be between 1 and 70 hours.");
      goalInputRef.current?.focus();
      return;
    }
    const hrs = Math.round(rawHrs);
    setProgress((prev) => ({ ...prev, weeklyGoalMinutes: hrs * 60 }));
    setGoalError("");
    setGoalOpen(false);
    showToast(`Weekly goal updated to ${hrs}h.`);
  };

  const showBackupReminder = useMemo(() => shouldRemindBackup(progress, todayKey), [progress, todayKey]);

  return (
    <div className="app-root">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <TopNav
        section={section}
        theme={progress.theme}
        timerActive={timerActive}
        timer={timerControls}
        onNavigate={navigateTop}
        onToggleTheme={() =>
          setProgress((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" }))
        }
      />

      <main id="main-content" className="app-main" tabIndex={-1}>
        <div key={section} className={section !== "courses" ? "view-enter" : undefined}>
          {section === "home" && (
            <HomeView
              onBrowseCourses={() => navigateTop("courses")}
              onOpenTracker={() => navigateTop("tracker")}
            />
          )}

          {section === "courses" && (
            <CoursesView
              courses={courses}
              activeCourseId={activeCourseId}
              activeLessonId={activeLessonId}
              activeQuizModuleId={activeQuizModuleId}
              subView={courseSubView}
              progress={progress}
              lessonLaunchOpt={lessonLaunchOpt}
              quizLaunchOpt={quizLaunchOpt}
              onQuizTabChange={setActiveQuizTab}
              onSelectCatalog={() => {
                setCourseSubView("catalog");
                scrollToTop();
              }}
              onSelectCourseOverview={openCourseOverview}
              onSelectLesson={openLesson}
              onSelectQuiz={openQuiz}
              onToggleComplete={toggleLessonComplete}
              onTogglePractice={togglePracticeDone}
              onSaveQuizResult={saveQuizResult}
              onSaveConceptualQuizResult={saveConceptualQuizResult}
              onSaveNote={saveLessonNote}
              onStartTimerForLesson={(cid, lid, title) => {
                if (timerActive && timerLessonId !== lid && elapsedTimerSeconds >= 60) {
                  const savedMins = Math.round(elapsedTimerSeconds / 60);
                  const priorFocus = timerFocusLabel.trim() || "Focused study session";
                  const priorEntry: StudySession = {
                    id: createId("s"),
                    date: todayKey || getDayKey(new Date()),
                    focus: priorFocus,
                    minutes: savedMins,
                    courseId: timerCourseId,
                    lessonId: timerLessonId || undefined,
                    note: "",
                  };
                  setProgress((prev) => ({ ...prev, sessions: [priorEntry, ...prev.sessions] }));
                  const resetSec = timerMode === "stopwatch" ? 0 : pomodoroMinutes * 60;
                  timerAnchorMsRef.current = Date.now();
                  timerAnchorSecRef.current = resetSec;
                  setTimerSeconds(resetSec);
                  setTimerRunning(true);
                  setTimerCourseId(cid);
                  setTimerLessonId(lid);
                  setTimerFocusLabel(title);
                  showToast(`Logged ${savedMins}m from previous focus. Started "${title}"`);
                  return;
                }
                setTimerCourseId(cid);
                setTimerLessonId(lid);
                setTimerFocusLabel(title);
                if (!timerRunning) startTimerClock();
                showToast(`Focus timer started for "${title}"`);
              }}
            />
          )}

          {section === "tracker" && (
            <TrackerView
              courses={courses}
              progress={progress}
              todayKey={todayKey}
              showBackupReminder={showBackupReminder}
              timer={timerControls}
              onOpenLesson={openLesson}
              onOpenQuiz={openQuiz}
              onOpenCourseOverview={openCourseOverview}
              onOpenLogModal={(defaultCourseId) => {
                setSessionCourseId(
                  defaultCourseId && courses.some((c) => c.id === defaultCourseId)
                    ? defaultCourseId
                    : activeCourseId,
                );
                setSessionFocus("");
                setSessionMinutes("30");
                setSessionDate(todayKey || getDayKey(new Date()));
                setLogError("");
                setLogErrorField("");
                setLogOpen(true);
              }}
              onOpenGoalModal={() => {
                setGoalError("");
                setGoalHours(String(Math.round(progress.weeklyGoalMinutes / 60)));
                setGoalOpen(true);
              }}
              onDeleteSession={(id) => {
                const idx = progress.sessions.findIndex((s) => s.id === id);
                if (idx === -1) return;
                const removed = progress.sessions[idx];
                setProgress((prev) => ({
                  ...prev,
                  sessions: prev.sessions.filter((s) => s.id !== id),
                }));
                showToast(`Deleted "${removed.focus}".`, {
                  label: "Undo",
                  onAction: () => {
                    setProgress((prev) => {
                      if (prev.sessions.some((s) => s.id === removed.id)) return prev;
                      const next = [...prev.sessions];
                      next.splice(Math.min(idx, next.length), 0, removed);
                      return { ...prev, sessions: next };
                    });
                    setToast(null);
                  },
                });
              }}
              onExportBackup={handleExportBackup}
              onTriggerImport={() => importRef.current?.click()}
            />
          )}
        </div>
      </main>

      <input ref={importRef} type="file" accept="application/json" hidden onChange={handleImportFile} />

      <dialog
        ref={logDialogRef}
        className="modal-dialog"
        aria-labelledby="log-modal-title"
        onCancel={() => setLogOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLogOpen(false);
        }}
      >
        <div className="modal-head">
          <h2 id="log-modal-title">Log study session</h2>
          <button type="button" className="icon-close-btn" aria-label="Close dialog" onClick={() => setLogOpen(false)}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <form onSubmit={submitManualSession} className="modal-form" noValidate>
          <div className="form-field">
            <label htmlFor="session-course-select">Course</label>
            <div className="tracker-select-wrap is-full">
              <select
                id="session-course-select"
                className="tracker-select"
                value={sessionCourseId}
                onChange={(e) => setSessionCourseId(e.target.value)}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <Icon name="chevron" size={14} strokeWidth={1.9} className="tracker-select-chevron" />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="session-focus-input">What did you study?</label>
            <input
              ref={logInputRef}
              id="session-focus-input"
              type="text"
              value={sessionFocus}
              onChange={(e) => {
                setSessionFocus(e.target.value);
                if (logError) {
                  setLogError("");
                  setLogErrorField("");
                }
              }}
              placeholder="Module 03 accumulators & practice"
              aria-invalid={logErrorField === "focus"}
              aria-describedby={logError ? "log-form-error" : undefined}
              required
            />
          </div>
          <div className="modal-row">
            <div className="form-field">
              <label htmlFor="session-minutes-input">Minutes</label>
              <input
                ref={minutesInputRef}
                id="session-minutes-input"
                type="number"
                step={1}
                min={1}
                max={720}
                value={sessionMinutes}
                onChange={(e) => {
                  setSessionMinutes(e.target.value);
                  if (logError) {
                    setLogError("");
                    setLogErrorField("");
                  }
                }}
                aria-invalid={logErrorField === "minutes"}
                aria-describedby={logError ? "log-form-error" : undefined}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="session-date-input">Date</label>
              <input
                ref={dateInputRef}
                id="session-date-input"
                type="date"
                max={todayKey || undefined}
                value={sessionDate}
                onChange={(e) => {
                  setSessionDate(e.target.value);
                  if (logError) {
                    setLogError("");
                    setLogErrorField("");
                  }
                }}
                aria-invalid={logErrorField === "date"}
                aria-describedby={logError ? "log-form-error" : undefined}
                required
              />
            </div>
          </div>
          {logError && (
            <p id="log-form-error" className="form-error" role="alert">
              {logError}
            </p>
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLogOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save session
            </button>
          </div>
        </form>
      </dialog>

      <dialog
        ref={goalDialogRef}
        className="modal-dialog"
        aria-labelledby="goal-modal-title"
        onCancel={() => setGoalOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setGoalOpen(false);
        }}
      >
        <div className="modal-head">
          <h2 id="goal-modal-title">Weekly study goal</h2>
          <button type="button" className="icon-close-btn" aria-label="Close dialog" onClick={() => setGoalOpen(false)}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <form onSubmit={submitGoal} className="modal-form" noValidate>
          <div className="form-field">
            <label htmlFor="goal-hours-input">Target hours per week</label>
            <input
              ref={goalInputRef}
              id="goal-hours-input"
              type="number"
              step={1}
              min={1}
              max={70}
              value={goalHours}
              onChange={(e) => {
                setGoalHours(e.target.value);
                if (goalError) setGoalError("");
              }}
              aria-invalid={Boolean(goalError)}
              aria-describedby={goalError ? "goal-form-error" : undefined}
              required
            />
          </div>
          {goalError && (
            <p id="goal-form-error" className="form-error" role="alert">
              {goalError}
            </p>
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setGoalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Update goal
            </button>
          </div>
        </form>
      </dialog>

      {toast && (
        <div
          key={toast.id}
          className="toast-pill"
          role="status"
          aria-live="polite"
          onMouseEnter={() => setToastPaused(true)}
          onMouseLeave={() => setToastPaused(false)}
          onFocus={() => setToastPaused(true)}
          onBlur={() => setToastPaused(false)}
        >
          <Icon name="check-circle" size={15} />
          <span>{toast.text}</span>
          {toast.actionLabel && toast.onAction && (
            <button type="button" className="toast-action-btn" onClick={toast.onAction}>
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
