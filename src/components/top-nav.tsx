"use client";

import { useEffect, useRef, useState } from "react";
import { FieldnoteMark, Icon } from "@/components/icon";
import type { FocusTimerControls } from "@/components/tracker-view";
import type { ThemeMode } from "@/lib/progress";

export type AppSection = "home" | "courses" | "tracker";

type TopNavProps = {
  section: AppSection;
  theme: ThemeMode;
  timerActive: boolean;
  timer: FocusTimerControls;
  onNavigate: (next: AppSection) => void;
  onToggleTheme: () => void;
};

export function TopNav({
  section,
  theme,
  timerActive,
  timer,
  onNavigate,
  onToggleTheme,
}: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const timerWrapRef = useRef<HTMLDivElement>(null);
  const isPopoverOpen = menuOpen && timerActive;

  useEffect(() => {
    if (!isPopoverOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (timerWrapRef.current && !timerWrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopoverOpen]);

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <button
          type="button"
          className="brand-btn"
          aria-label="Fieldnote home"
          onClick={() => onNavigate("home")}
        >
          <span className="brand-mark" aria-hidden="true">
            <FieldnoteMark size={22} />
          </span>
          <span className="brand-title">Fieldnote</span>
        </button>

        <nav className="top-nav-links" aria-label="Primary">
          <button
            type="button"
            className={`top-link ${section === "home" ? "is-active" : ""}`}
            aria-current={section === "home" ? "page" : undefined}
            onClick={() => onNavigate("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={`top-link ${section === "courses" ? "is-active" : ""}`}
            aria-current={section === "courses" ? "page" : undefined}
            onClick={() => onNavigate("courses")}
          >
            Courses
          </button>
          <button
            type="button"
            className={`top-link ${section === "tracker" ? "is-active" : ""}`}
            aria-current={section === "tracker" ? "page" : undefined}
            onClick={() => onNavigate("tracker")}
          >
            Tracker
          </button>
        </nav>

        <div className="top-nav-right">
          {timerActive && (
            <div className="nav-timer-wrap" ref={timerWrapRef}>
              <button
                type="button"
                className={`nav-timer-badge ${timer.running ? "" : "is-paused"}`}
                aria-expanded={isPopoverOpen}
                aria-haspopup="dialog"
                aria-label={`Focus timer ${timer.running ? "running" : "paused"} at ${timer.display}. Open quick controls`}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <Icon name="clock" size={14} strokeWidth={1.75} />
                <span>{timer.display}</span>
              </button>

              {isPopoverOpen && (
                <div className="nav-timer-popover" role="dialog" aria-label="Focus timer controls">
                  <div className="nav-timer-meta">
                    <small className={`nav-timer-status ${timer.running ? "is-running" : ""}`}>
                      {timer.running ? "Running" : "Paused"} ·{" "}
                      {timer.mode === "pomodoro" ? `${timer.pomodoroMinutes}m timer` : "Stopwatch"}
                    </small>
                    <strong>{timer.focusLabel.trim() || "Focused study session"}</strong>
                  </div>
                  <div className="nav-timer-readout tabular">{timer.display}</div>
                  <div className="nav-timer-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={timer.startPause}
                    >
                      <Icon name={timer.running ? "pause" : "play"} size={14} />
                      <span>{timer.running ? "Pause" : "Resume"}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      disabled={timer.elapsedSeconds === 0}
                      onClick={() => {
                        timer.saveToLog();
                        setMenuOpen(false);
                      }}
                    >
                      <Icon name="save" size={14} />
                      <span>Log</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        timer.reset();
                        setMenuOpen(false);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                  {section !== "tracker" && (
                    <button
                      type="button"
                      className="text-link-btn"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("tracker");
                      }}
                    >
                      Open Tracker
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            className="theme-icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
