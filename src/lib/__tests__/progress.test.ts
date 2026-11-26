import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { courses, getAllValidLessonIds, getAllValidModuleIds } from "../curriculum";
import { loadCourseBundle } from "../../data/python/index";
import {
  addDays,
  getActivityHeatmap,
  getCurrentStreak,
  getDailyActivitySeries,
  getModuleStats,
  getWeekMinutes,
  normaliseProgress,
  QUIZ_PASS_THRESHOLD,
  shouldRemindBackup,
  type ProgressState,
} from "../progress";

describe("Progressive A-to-Z Python curriculum & progress store", () => {
  const validIds = getAllValidLessonIds();
  const validModIds = getAllValidModuleIds();

  it("keeps 85 Python lessons (13 modules) and validates registered DSA pilot module", async () => {
    const py = courses.find((c) => c.id === "python");
    assert.ok(py);
    const pyLessonIds = py.modules.flatMap((m) => m.lessons.map((l) => l.id));
    assert.equal(py.modules.length, 13);
    assert.equal(pyLessonIds.length, 85);
    assert.equal(new Set(pyLessonIds).size, pyLessonIds.length);
    assert.equal(new Set(validIds).size, validIds.length);
    assert.equal(QUIZ_PASS_THRESHOLD, 0.8);

    const dsa = courses.find((c) => c.id === "dsa");
    assert.equal(py.assessmentKind, "practice-set");
    assert.ok(dsa);
    assert.equal(dsa.assessmentKind, "practice-set");
    assert.ok(dsa.modules.length >= 1);
    for (const mod of py.modules) {
      assert.ok((mod.practiceSetCount ?? 0) >= 4, `Expected >=4 practice set problems in ${mod.id}`);
    }
    for (const mod of dsa.modules) {
      assert.ok((mod.practiceSetCount ?? 0) >= 4, `Expected >=4 practice set problems in ${mod.id}`);
    }
  });

  it("provides valid content, quizzes, predictCheck options, activeLines, and diagram IDs across all courses", async () => {
    const validSet = new Set(validIds);

    for (const course of courses) {
      const courseIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const bundle = await loadCourseBundle(course.id);

      for (const id of courseIds) {
        const content = bundle.lessons[id];
        assert.ok(content, `Missing lesson content for ${id}`);
        assert.ok(content.sections.length >= 1, `No sections in ${id}`);
        assert.ok(content.practiceTask.tasks.length >= 1, `No practice tasks in ${id}`);
        assert.ok(content.practiceTask.solutionCode.length > 0, `No solution in ${id}`);
        assert.ok(!content.practiceTask.expectedOutput?.includes("`"), `Raw backtick in expectedOutput for ${id}`);
        if (course.id === "python") {
          assert.ok(content.intro && content.intro.explanation.length >= 1, `Missing intro in ${id}`);
        }
        if (course.id === "dsa") {
          assert.ok(content.intro && content.intro.explanation.length >= 1, `Missing beginner intro in ${id}`);
          assert.ok((content.intro.realWorldUses?.length ?? 0) >= 2, `Missing real-world uses in ${id}`);
          assert.ok((content.practiceChallenges?.length ?? 0) >= 3, `Expected 3 practice drills in ${id}`);
          for (const ch of content.practiceChallenges ?? []) {
            assert.ok((ch.constraints?.length ?? 0) >= 1, `Missing constraints in DSA drill ${ch.title}`);
            assert.ok((ch.examples?.length ?? 0) >= 1, `Missing examples in DSA drill ${ch.title}`);
            assert.ok(Boolean(ch.complexity?.time && ch.complexity?.space), `Missing complexity in DSA drill ${ch.title}`);
          }
        }
        for (const ch of content.practiceChallenges ?? []) {
          assert.ok(ch.tasks.length >= 1, `No extra drill tasks in ${id}`);
          assert.ok(ch.solutionCode.length > 0, `No extra drill solution in ${id}`);
          assert.ok(!ch.expectedOutput?.includes("`"), `Raw backtick in extra drill expectedOutput for ${id}`);
        }
        for (const sec of content.sections) {
          if (sec.output) {
            assert.ok(!sec.output.includes("`"), `Raw backtick in section output for ${id}`);
          }
          if (sec.visual && "caption" in sec.visual && sec.visual.caption) {
            assert.ok(!sec.visual.caption.includes("`"), `Raw backtick in visual.caption for ${id}`);
          }
          if (sec.visual?.kind === "operator-lab") {
            for (const preset of sec.visual.presets) {
              assert.ok(!preset.note.includes("`"), `Raw backtick in operator-lab note for ${id}`);
            }
          }
          if (sec.table) {
            assert.ok(sec.table.headers.length >= 2, `Narrow table in ${id}`);
            for (const row of sec.table.rows) {
              assert.equal(row.length, sec.table.headers.length, `Column count mismatch in ${id}`);
            }
          }
          if (sec.visual?.kind === "loop-stepper") {
            for (const it of sec.visual.iterations) {
              assert.ok(it.activeLine >= 1 && it.activeLine <= sec.visual.code.length, `Bad loop-stepper line in ${id}`);
            }
          }
          if (sec.visual?.kind === "memory-sim") {
            for (const sc of sec.visual.scenarios) {
              for (const st of sc.steps) {
                assert.ok(st.line >= 1 && st.line <= sc.code.length, `Bad memory-sim line in ${id}`);
                const objIds = new Set(st.objects.map((o) => o.id));
                for (const f of st.frames) {
                  for (const b of f.bindings) {
                    assert.ok(objIds.has(b.targetId), `Broken memory-sim targetId ${b.targetId} in ${id}`);
                  }
                }
              }
            }
          }
          if (sec.visual?.kind === "async-timeline") {
            assert.ok(sec.visual.scenarios.length >= 1, `Empty async-timeline scenarios in ${id}`);
            for (const sc of sec.visual.scenarios) {
              assert.ok(sc.lanes.length >= 1, `Empty async-timeline lanes in ${id}`);
              for (const lane of sc.lanes) {
                for (const seg of lane.segments) {
                  assert.ok(seg.endMs > seg.startMs && seg.endMs <= sc.totalMs, `Invalid async segment bounds in ${id}`);
                }
              }
            }
          }
          if (sec.visual?.kind === "regex-lab") {
            assert.ok(sec.visual.presets.length >= 1, `Empty regex-lab presets in ${id}`);
            for (const preset of sec.visual.presets) {
              for (const m of preset.matches) {
                assert.ok(m.start >= 0 && m.start <= m.end && m.end <= preset.text.length, `Invalid regex match bounds in ${id}`);
              }
            }
          }
          if (sec.contextTabs) {
            assert.ok(sec.contextTabs.tabs.length >= 2, `Expected >=2 contextTabs in ${id}`);
            for (const tab of sec.contextTabs.tabs) {
              assert.ok(tab.id.length > 0 && tab.label.length > 0, `Empty contextTab metadata in ${id}`);
              if (tab.output) {
                assert.ok(!tab.output.includes("`"), `Raw backtick in contextTab output for ${id}`);
              }
            }
          }
          if (sec.deepDive) {
            assert.ok(sec.deepDive.length >= 1, `Empty deepDive array in ${id}`);
            for (const dd of sec.deepDive) {
              assert.ok(dd.label.length > 0, `Missing deepDive label in ${id}`);
            }
          }
          if (sec.predictOutput) {
            assert.ok(Boolean(sec.output && sec.output.trim().length > 0), `predictOutput requires section output in ${id}`);
            assert.ok(sec.predictOutput.why.trim().length > 0, `predictOutput missing why in ${id}`);
          }
          if (sec.microCheck) {
            const mOptIds = new Set(sec.microCheck.options.map((o) => o.id));
            assert.ok(mOptIds.has(sec.microCheck.correctId), `Invalid microCheck.correctId in ${id}`);
          }
        }
        for (const step of content.guidedBuildUp?.steps ?? []) {
          if (step.activeLines) {
            for (const ln of step.activeLines) {
              assert.ok(ln >= 1 && ln <= step.code.length, `Out-of-range guidedBuildUp line ${ln} in ${id}`);
            }
          }
        }
        if (content.predictCheck) {
          const optIds = new Set(content.predictCheck.options.map((o) => o.id));
          assert.ok(optIds.has(content.predictCheck.correctId), `Invalid predictCheck.correctId in ${id}`);
        }
        for (const pc of content.predictChecks ?? []) {
          const optIds = new Set(pc.options.map((o) => o.id));
          assert.ok(optIds.has(pc.correctId), `Invalid predictChecks.correctId in ${id}`);
        }
        for (const step of content.walkthrough?.steps ?? []) {
          if (step.activeLines && step.code) {
            for (const lineNo of step.activeLines) {
              assert.ok(lineNo >= 1 && lineNo <= step.code.length, `Out-of-range activeLine ${lineNo} in ${id}`);
            }
          }
          if (step.altCode?.activeLines) {
            for (const lineNo of step.altCode.activeLines) {
              assert.ok(lineNo >= 1 && lineNo <= step.altCode.lines.length, `Out-of-range alt activeLine ${lineNo} in ${id}`);
            }
          }
          if (step.visual?.kind === "memory") {
            const objIds = new Set(step.visual.objects.map((o) => o.id));
            for (const frame of step.visual.frames) {
              for (const b of frame.bindings) {
                assert.ok(objIds.has(b.targetId), `Broken memory targetId ${b.targetId} in ${id}`);
              }
            }
          }
          if (step.visual?.kind === "pipeline") {
            const nodeIds = new Set(step.visual.nodes.map((n) => n.id));
            for (const link of step.visual.links) {
              assert.ok(nodeIds.has(link.from) && nodeIds.has(link.to), `Broken pipeline link in ${id}`);
            }
          }
          if (step.visual?.kind === "dsa-graph") {
            const nodeIds = new Set(step.visual.nodes.map((n) => n.id));
            for (const n of step.visual.nodes) {
              assert.ok(n.x >= 0 && n.x <= 100 && n.y >= 0 && n.y <= 100, `Out-of-bounds dsa-graph node (${n.x}, ${n.y}) in ${id}`);
            }
            for (const edge of step.visual.edges) {
              assert.ok(nodeIds.has(edge.from) && nodeIds.has(edge.to), `Broken dsa-graph edge in ${id}`);
            }
          }
        }
        const wtSteps = content.walkthrough?.steps ?? [];
        if (wtSteps.length > 0) {
          const stepKinds = wtSteps.map((st) => st.visual?.kind ?? "NONE");
          const uniqueKinds = new Set(stepKinds);
          assert.equal(
            uniqueKinds.size,
            1,
            `Walkthrough steps must keep one uniform diagram kind across all steps in ${id}, got [${stepKinds.join(", ")}]`,
          );
        }
      }

      const isPracticeCourse = course.assessmentKind === "practice-set";
      for (const id of Object.keys(bundle.lessons)) {
        const l = bundle.lessons[id];
        assert.ok(l.sections.some((s) => Boolean(s.table)), `Missing reference table in ${id}`);
        if (l.walkthrough?.layout !== "visual-first") {
          assert.ok(l.guidedBuildUp && l.guidedBuildUp.steps.length >= 2, `Expected >=2 guidedBuildUp steps in ${id}`);
        } else {
          assert.ok(l.walkthrough && l.walkthrough.steps.length >= 4, `Expected >=4 visual-first steps in ${id}`);
        }
        if (!isPracticeCourse) {
          const pCount = l.predictChecks?.length ?? (l.predictCheck ? 1 : 0);
          assert.ok(pCount >= 2, `Expected >=2 predictChecks in ${id}, got ${pCount}`);
        } else {
          const tierOrder: Record<string, number> = { Warmup: 0, Core: 1, Stretch: 2 };
          const rawDrills = [l.practiceTask, ...(l.practiceChallenges ?? [])].filter(Boolean);
          const uniqueDrills = rawDrills.filter(
            (ch, idx) => rawDrills.findIndex((other) => other.title === ch.title) === idx,
          );
          const starterHeads = new Set<string>();
          let prevRank = -1;
          for (const ch of uniqueDrills) {
            assert.ok(ch.tier && ch.tier in tierOrder, `Missing tier on ${ch.title} in ${id}`);
            const rank = tierOrder[ch.tier!];
            assert.ok(rank >= prevRank, `Non-progressive tier order in ${id}: ${uniqueDrills.map((d) => d.tier).join(" -> ")}`);
            prevRank = rank;
            const head = (ch.starterCode ?? "").split("\n")[0]?.trim() ?? "";
            assert.ok(head && !starterHeads.has(head), `Duplicate starter signature "${head}" in ${id}`);
            starterHeads.add(head);
          }
          for (const ch of rawDrills) {
            assert.ok((ch.examples?.length ?? 0) >= 2, `Expected >=2 examples on "${ch.title}" in ${id}`);
            assert.ok(!ch.expectedOutput?.includes("`"), `Raw backtick in expectedOutput for "${ch.title}" in ${id}`);
            const joined = (ch.examples ?? []).map((ex) => ex.output.trim()).join("\n");
            assert.equal(joined, (ch.expectedOutput ?? "").trim(), `Example/expectedOutput mismatch on "${ch.title}" in ${id}`);
          }
        }
        assert.ok((l.practiceChallenges?.length ?? 0) >= 1, `Expected >=2 challenges total in ${id}`);
      }

      for (const mod of course.modules) {
        if (isPracticeCourse) {
          const pSet = bundle.practiceSets?.[mod.id];
          assert.ok(pSet, `Missing practiceSet for ${mod.id}`);
          assert.equal(pSet.problems.length, mod.practiceSetCount);
          const pids = new Set<string>();
          for (const prob of pSet.problems) {
            assert.ok(prob.id && !pids.has(prob.id), `Duplicate or missing problem id in ${mod.id}`);
            pids.add(prob.id);
            assert.ok(prob.patternHint && prob.patternHint.length > 0, `Missing patternHint in ${prob.id}`);
            assert.ok((prob.constraints?.length ?? 0) >= 1, `Missing constraints in ${prob.id}`);
            assert.ok((prob.examples?.length ?? 0) >= 2, `Expected >=2 examples in ${prob.id}`);
            assert.ok(Boolean(prob.complexity?.time && prob.complexity?.space), `Missing complexity in ${prob.id}`);
            assert.ok(!prob.expectedOutput?.includes("`"), `Raw backtick in expectedOutput for ${prob.id}`);
            const joined = (prob.examples ?? []).map((ex) => ex.output.trim()).join("\n");
            assert.equal(joined, (prob.expectedOutput ?? "").trim(), `Example/expectedOutput mismatch in ${prob.id}`);
            if (prob.lessonRefId) {
              assert.ok(validSet.has(prob.lessonRefId), `Bad lessonRefId ${prob.lessonRefId} in ${prob.id}`);
            }
          }
          continue;
        }
        const quiz = bundle.quizzes[mod.id];
        assert.ok(quiz, `Missing quiz for ${mod.id}`);
        assert.equal(quiz.questions.length, mod.quizCount);
        const ansCounts: Record<string, number> = {};
        const seq: string[] = [];
        for (const q of quiz.questions) {
          const optIds = new Set(q.options.map((o) => o.id));
          assert.ok(optIds.has(q.correctId), `Invalid correctId in ${q.id}`);
          if (q.lessonRefId) {
            assert.ok(validSet.has(q.lessonRefId), `Bad lessonRefId ${q.lessonRefId} in ${q.id}`);
          }
          for (const o of q.options) {
            ansCounts[o.id] = ansCounts[o.id] ?? 0;
          }
          ansCounts[q.correctId] = (ansCounts[q.correctId] ?? 0) + 1;
          seq.push(q.correctId);
        }
        const tally = Object.values(ansCounts);
        assert.ok(Math.max(...tally) - Math.min(...tally) <= 2, `Skewed answer keys in ${mod.id}: ${JSON.stringify(ansCounts)}`);
        for (let i = 1; i < seq.length; i++) {
          assert.notEqual(seq[i], seq[i - 1], `Consecutive repeat in ${mod.id} at Q${i + 1}`);
        }
        const period = quiz.questions[0].options.length;
        const isPureCycle = seq.every((v, i) => v === seq[i % period]);
        assert.ok(!isPureCycle, `Pure periodic cycle in ${mod.id}: ${seq.join(",")}`);
      }
    }
  });

  it("migrates legacy v6/v5/v4 Python progress cleanly into v7", () => {
    const raw = {
      version: 6,
      theme: "dark",
      completedLessons: ["py-variables-refs", "py-decorators", "p1-if"],
      completedPractice: ["py-loops"],
      quizResults: {
        "py-m1": { score: 9, total: 10, missedIds: ["q4"], updatedAt: "2026-11-24" },
      },
      conceptualQuizResults: {
        "py-m0": { score: 8, total: 10, missedIds: ["py-m0-q1", "py-m0-q2"], updatedAt: "2026-11-25" },
        "invalid-mod": { score: 5, total: 5, missedIds: [] },
      },
      lessonNotes: {
        "py-variables-refs": { note: "Labels point to objects", confidence: "solid", updatedAt: "2026-11-20" },
      },
      sessions: [
        { id: "s1", date: "2026-11-24", focus: "Lists", minutes: 35, lessonId: "py-loops", note: "" },
      ],
      weeklyGoalMinutes: 360,
    };

    const normalized = normaliseProgress(raw, validIds, validModIds);
    assert.ok(normalized);
    assert.equal(normalized.version, 7);
    assert.equal(normalized.theme, "dark");
    assert.deepEqual(normalized.completedLessons, ["py-refs-mutability", "py-decorators", "py-if-else"]);
    assert.deepEqual(normalized.completedPractice, ["py-for-lists"]);
    assert.equal(normalized.quizResults["py-m1"]?.score, 9);
    assert.equal(normalized.conceptualQuizResults?.["py-m0"]?.score, 8);
    assert.deepEqual(normalized.conceptualQuizResults?.["py-m0"]?.missedIds, ["py-m0-q1", "py-m0-q2"]);
    assert.equal(normalized.conceptualQuizResults?.["invalid-mod"], undefined);
    assert.equal(normalized.lessonNotes["py-refs-mutability"]?.confidence, "solid");
    assert.equal(normalized.sessions[0].lessonId, "py-for-lists");
  });

  it("computes module stats, 12-week activity heatmap, and backup reminders", () => {
    const py = courses[0];
    const stats = getModuleStats(py.modules[1], ["py-hello-print", "py-numbers-math"]);
    assert.equal(stats.done, 2);
    assert.equal(stats.total, 6);
    assert.equal(stats.percent, 33);

    const state: ProgressState = {
      version: 7,
      theme: "light",
      completedLessons: ["py-hello-print", "py-numbers-math"],
      completedPractice: ["py-hello-print"],
      quizResults: {},
      lessonNotes: {},
      sessions: [{ id: "s1", date: "2026-11-24", focus: "Study", minutes: 45, note: "" }],
      weeklyGoalMinutes: 300,
    };

    assert.equal(shouldRemindBackup(state, "2026-11-24"), true);
    assert.equal(shouldRemindBackup(state, ""), false);
    assert.equal(
      shouldRemindBackup({ ...state, lastExportedAt: "2026-11-22T10:00:00Z" }, "2026-11-24"),
      false,
    );
    assert.equal(
      shouldRemindBackup({ ...state, lastExportedAt: "2026-11-10T10:00:00Z" }, "2026-11-24"),
      true,
    );

    const grid = getActivityHeatmap(state.sessions, 12, "2026-11-24");
    assert.equal(grid.length, 84);
    assert.equal(grid.find((d) => d.date === "2026-11-24")?.minutes, 45);
    assert.deepEqual(getActivityHeatmap(state.sessions, 12, ""), []);

    const daily = getDailyActivitySeries(state.sessions, 14, "2026-11-25");
    assert.equal(daily.length, 14);
    assert.equal(daily[0]?.date, "2026-11-12");
    assert.equal(daily[13]?.date, "2026-11-25");
    assert.equal(daily[12]?.minutes, 45);
    assert.deepEqual(getDailyActivitySeries(state.sessions, 14, ""), []);
  });

  it("handles date helpers, streaks, weekly minutes, and malformed backup inputs safely", () => {
    assert.equal(addDays("2026-12-31", 1), "2027-01-01");
    assert.equal(addDays("", -6), "");
    assert.equal(addDays("2026-02-30", 1), "");

    const sessions = [
      { id: "s1", date: "2026-11-24", focus: "OOP", minutes: 30, note: "" },
      { id: "s2", date: "2026-11-23", focus: "Files", minutes: 20, note: "" },
      { id: "s3", date: "2026-11-10", focus: "Old", minutes: 50, note: "" },
    ];
    assert.equal(getCurrentStreak(sessions, "2026-11-24"), 2);
    assert.equal(getCurrentStreak(sessions, ""), 0);
    assert.equal(getWeekMinutes(sessions, "2026-11-24"), 50);
    assert.equal(getWeekMinutes(sessions, ""), 0);

    const normalized = normaliseProgress(
      {
        weeklyGoalMinutes: 99999,
        lastExportedAt: "not-a-date",
        sessions: [
          { id: "dup", date: "2026-11-24", focus: "First", minutes: 25 },
          { id: "dup", date: "2026-11-24", focus: "Duplicate", minutes: 30 },
          { id: "bad-date", date: "bad", focus: "Invalid", minutes: 15 },
        ],
      },
      validIds,
      validModIds,
    );
    assert.ok(normalized);
    assert.equal(normalized.weeklyGoalMinutes, 4200);
    assert.equal(normalized.lastExportedAt, undefined);
    assert.equal(normalized.sessions.length, 1);
    assert.equal(normalized.sessions[0].focus, "First");
  });
});
