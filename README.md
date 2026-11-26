# Fieldnote Learning Hub

Interactive coding courses and a browser-based study tracker built with Next.js and TypeScript.

## Courses Included

Currently ships two complete tracks under `src/data/`:

| Course | Scope | Highlights |
|---|---|---|
| Python | 13 modules, 85 lessons | Setup through OOP, data model, `asyncio`/GIL, typing (`Protocol`, `mypy`), `pytest`/mocking, and a streaming CLI capstone (`m00`–`m12`) |
| Data Structures & Algorithms | 25 modules, 91 lessons, 25 practice sets | Memory/Big-O, arrays, hashing, sorting including Cyclic Sort, trees, heaps, graphs, DP, tries, Fenwick/Segment trees, plus an Interview Playbook & mixed mock set (`m00`–`m24`) |

Every lesson pairs written explanations and reference tables with multi-step code build-ups (`guidedBuildUp`), line-by-line visual walkthroughs (`pipeline`, `memory`, `trace`, `dsa-array`, `dsa-structure`, `dsa-graph`, `dsa-dp-grid`, `loop-stepper`, `memory-sim`, `async-timeline`), quick prediction checks, and hands-on exercises. Each module closes with a practice set (and a 10–12 question quiz in Python).

## Local Study Tracker

Progress, quiz scores, confidence-tagged notes (`learning`, `shaky`, `solid`), focus-timer sessions, and a 12-week study activity heatmap are saved directly in browser `localStorage` under `fieldnote-learning-progress-v7` (older v4–v6 saves migrate forward on load).

You can filter stats per course and export or import full JSON backups from the Tracker tab without creating an account or setting up a database.

## Adding a New Course

1. Create a folder under `src/data/<course>/` exporting your `LessonContent` records and `ModulePracticeSet` objects matching [src/lib/lesson-types.ts](src/lib/lesson-types.ts).
2. Wire its lazy module loader inside `loadModuleBundle` and `loadCourseBundle` in [src/data/python/index.ts](src/data/python/index.ts).
3. Register the course metadata, module list, and lesson IDs in [src/lib/curriculum.ts](src/lib/curriculum.ts).
4. Run `npm test` to verify all schema, active-line, diagram, and sample-output invariants across the new track.

## Project Structure

```text
src/
  app/                 App Router shell, global styles, typography, metadata, icon
  components/          Home, Courses, Tracker, TopNav, and diagram/widget renderers
  data/
    python/            m00-setup-cli.ts .. m12-production-capstone.ts + index.ts
    dsa/               m00-foundations.ts .. m24-interview-prep.ts + index.ts
  lib/
    curriculum.ts      Course registry, module metadata, and lookup helpers
    lesson-types.ts    TypeScript interfaces for lessons, visuals, quizzes, practice sets
    progress.ts        localStorage persistence engine, stats, and backup validation
    __tests__/         Curriculum invariant and progress store tests
public/
  images/              Course cover artwork
```

## Local Setup

Requires Node.js `20.9+` (`22` pinned in `.nvmrc`) and npm `10+`.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks & Build

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm test            # curriculum & progress store tests
npm run check       # typecheck + lint + tests
npm run build       # production build (next build)
```

## Deploy

Push the repository to GitHub and import it in Vercel using the default Next.js build settings. No environment variables or external services are needed; local book PDFs (`*.pdf`), caches, `node_modules`, and `.next` stay excluded via `.gitignore`.
