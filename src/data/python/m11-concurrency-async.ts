import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m11Lessons: Record<string, LessonContent> = {
  "py-concurrency-gil": {
    lessonId: "py-concurrency-gil",
    subtitle: "Distinguish I/O-bound vs CPU-bound workloads, see what CPython's GIL locks, and pick threads, processes, or `asyncio`.",
    intro: {
      heading: "Why adding threads to Python math loops does not speed them up",
      explanation: [
        "Spinning up four threads for a pure-Python number-crunching loop often runs just as slow—or slower—than a single thread. In standard CPython, the Global Interpreter Lock (GIL) lets only one thread execute Python bytecode at a time, so CPU-heavy threads take turns instead of running in parallel.",
        "Waiting on networks, files, or `time.sleep` releases the GIL, allowing threads and `asyncio` to overlap I/O waits, while `ProcessPoolExecutor` launches separate OS processes with independent GILs for multi-core CPU work.",
      ],
      analogy: "The GIL acts like a single kitchen pass: chefs waiting on an oven timer (I/O) step aside so someone else can plate, while two chefs chopping at the same single cutting board (CPU bytecode) block each other unless you open a second kitchen (`ProcessPoolExecutor`).",
      realWorldUses: [
        "Overlapping hundreds of API requests without spawning extra interpreters",
        "Scaling heavy number crunching or image compression across multi-core CPUs",
      ],
    },
    sections: [
      {
        heading: "I/O-bound vs CPU-bound work and CPython's GIL",
        paragraphs: [
          "**I/O-bound** functions spend most wall time waiting on sockets, databases, or files; CPython releases the GIL during those OS waits so threads or `asyncio` run other work.",
          "**CPU-bound** pure-Python loops keep holding the GIL continuously. Use `ProcessPoolExecutor` with top-level picklable functions to spread pure-Python work across cores (`pickle.loads` should only touch trusted internal payloads, never untrusted input).",
        ],
        code: [
          "import time",
          "",
          "t0 = time.perf_counter()",
          "time.sleep(0.05)  # releases GIL while waiting",
          "elapsed = time.perf_counter() - t0",
          "print(f\"Wall time >= 0.04s: {elapsed >= 0.04}\")",
        ],
        output: "Wall time >= 0.04s: True",
        visual: {
          kind: "async-timeline",
          caption: "Compare CPU-bound GIL contention vs ProcessPoolExecutor vs I/O concurrency",
          scenarios: [
            {
              label: "CPU + Threads (GIL contention)",
              gilNote: "Standard CPython GIL",
              totalMs: 400,
              summary: "Two CPU-bound Python threads take turns holding one GIL, taking ~400 ms sequentially.",
              lanes: [
                {
                  name: "Thread 1 (CPU)",
                  segments: [
                    { startMs: 0, endMs: 100, state: "running", label: "holds GIL" },
                    { startMs: 100, endMs: 200, state: "blocked", label: "waits GIL" },
                    { startMs: 200, endMs: 300, state: "running", label: "holds GIL" },
                    { startMs: 300, endMs: 400, state: "blocked", label: "waits GIL" },
                  ],
                },
                {
                  name: "Thread 2 (CPU)",
                  segments: [
                    { startMs: 0, endMs: 100, state: "blocked", label: "waits GIL" },
                    { startMs: 100, endMs: 200, state: "running", label: "holds GIL" },
                    { startMs: 200, endMs: 300, state: "blocked", label: "waits GIL" },
                    { startMs: 300, endMs: 400, state: "running", label: "holds GIL" },
                  ],
                },
              ],
            },
            {
              label: "CPU + ProcessPoolExecutor",
              gilNote: "1 GIL per process",
              totalMs: 200,
              summary: "Separate OS processes compute truly in parallel across two CPU cores.",
              lanes: [
                {
                  name: "Worker PID 1",
                  segments: [{ startMs: 0, endMs: 200, state: "running", label: "Core 1 compute" }],
                },
                {
                  name: "Worker PID 2",
                  segments: [{ startMs: 0, endMs: 200, state: "running", label: "Core 2 compute" }],
                },
              ],
            },
            {
              label: "I/O + asyncio / Threads",
              gilNote: "GIL released on I/O",
              totalMs: 220,
              summary: "During socket waits, tasks suspend so both finish in ~220 ms.",
              lanes: [
                {
                  name: "Task A (HTTP)",
                  segments: [
                    { startMs: 0, endMs: 20, state: "running", label: "prep" },
                    { startMs: 20, endMs: 200, state: "waiting", label: "await socket" },
                    { startMs: 200, endMs: 220, state: "running", label: "parse" },
                  ],
                },
                {
                  name: "Task B (HTTP)",
                  segments: [
                    { startMs: 20, endMs: 40, state: "running", label: "prep" },
                    { startMs: 40, endMs: 210, state: "waiting", label: "await socket" },
                    { startMs: 210, endMs: 220, state: "running", label: "parse" },
                  ],
                },
              ],
            },
          ],
        },
        table: {
          caption: "Choosing Python's concurrency tool",
          headers: ["Workload", "Best tool", "Reason"],
          rows: [
            ["Many concurrent network waits", "`asyncio` (`TaskGroup`)", "Low RAM overhead on one thread"],
            ["Blocking sync libraries (`requests`)", "`ThreadPoolExecutor` / `asyncio.to_thread`", "OS waits release the GIL"],
            ["Heavy pure-Python CPU work", "`ProcessPoolExecutor`", "Each process has its own interpreter and GIL"],
          ],
        },
      },
      {
        heading: "Broken vs working: CPU threads vs overlapped I/O and picklable functions",
        paragraphs: [
          "Running `sum(i * i for i in range(100_000))` on two threads keeps both fighting for the single GIL, whereas running two `time.sleep(0.05)` calls in `ThreadPoolExecutor` releases the GIL and overlaps the waits.",
          "When moving CPU work to `ProcessPoolExecutor`, avoid `lambda` or nested inner functions because `pickle` rejects them with `PicklingError` or `AttributeError`; define a top-level `def` instead.",
        ],
        code: [
          "from concurrent.futures import ThreadPoolExecutor",
          "import time",
          "",
          "# Broken for ProcessPoolExecutor: lambda cannot be pickled across processes",
          "# pool.map(lambda n: n * n, [1, 2])  # PicklingError",
          "",
          "# Working I/O overlap with ThreadPoolExecutor (GIL released during sleep):",
          "t0 = time.perf_counter()",
          "with ThreadPoolExecutor(max_workers=3) as pool:",
          "    list(pool.map(time.sleep, [0.05, 0.05, 0.05]))",
          "wall_ms = (time.perf_counter() - t0) * 1000",
          "print(\"3x 50ms overlapped < 120ms:\", wall_ms < 120)",
        ],
        output: "3x 50ms overlapped < 120ms: True",
      },
    ],
    guidedBuildUp: {
      title: "Measure Bottlenecks and Pick the Right Concurrency Model",
      steps: [
        {
          label: "Step 1: Benchmark wall time with `time.perf_counter()`",
          explanation: "Record monotonic timestamps before and after work using `time.perf_counter()` instead of `time.time()`, which can jump on clock sync.",
          code: [
            "import time",
            "",
            "t0 = time.perf_counter()",
            "time.sleep(0.05)",
            "elapsed_ms = (time.perf_counter() - t0) * 1000",
            "print(elapsed_ms >= 40)",
          ],
          activeLines: [3, 5],
          output: "True",
        },
        {
          label: "Step 2: Overlap I/O waits with `ThreadPoolExecutor`",
          explanation: "Because `time.sleep` and sockets release the GIL, running three `0.05s` waits in `ThreadPoolExecutor` overlaps them instead of taking `0.15s`.",
          code: [
            "from concurrent.futures import ThreadPoolExecutor",
            "import time",
            "",
            "t0 = time.perf_counter()",
            "with ThreadPoolExecutor(max_workers=3) as pool:",
            "    list(pool.map(time.sleep, [0.05, 0.05, 0.05]))",
            "print((time.perf_counter() - t0) * 1000 < 120)",
          ],
          activeLines: [5, 6],
          output: "True",
        },
        {
          label: "Step 3: Isolate CPU math in a top-level `def` for processes",
          explanation: "Define pure-Python math in a top-level `def` so `ProcessPoolExecutor` under `if __name__ == '__main__':` can pickle and run it on separate cores.",
          code: [
            "from concurrent.futures import ProcessPoolExecutor",
            "",
            "def sum_sq(n: int) -> int:",
            "    return sum(i * i for i in range(n))",
            "",
            "if __name__ == \"__main__\":",
            "    with ProcessPoolExecutor(max_workers=2) as pool:",
            "        print(list(pool.map(sum_sq, [10, 20])))",
          ],
          activeLines: [3, 4, 6, 7],
          output: "[285, 2470]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Match workload bottleneck to concurrency model",
      steps: [
        {
          title: "Benchmark baseline with `time.perf_counter()`",
          tag: "TRACE",
          explanation: ["Use monotonic high-resolution `time.perf_counter()` instead of `time.time()` to measure wall duration accurately."],
          code: [
            "import time",
            "t0 = time.perf_counter()",
            "time.sleep(0.05)",
            "elapsed = time.perf_counter() - t0",
          ],
          activeLines: [2, 4],
          state: [
            { name: "clock", value: "perf_counter()", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Take perf_counter() timestamps before and after the block for monotonic elapsed time.",
            nodes: [
              { id: "t0", label: "t0 = perf_counter()", sublabel: "start timestamp" },
              { id: "wk", label: "work()", sublabel: "runs 0.05s", active: true, tone: "accent" },
              { id: "dt", label: "perf_counter() - t0", sublabel: "elapsed s", tone: "ok" },
            ],
            links: [
              { from: "t0", to: "wk", active: true },
              { from: "wk", to: "dt", active: true },
            ],
          },
        },
        {
          title: "CPU threads serialize under CPython's GIL",
          tag: "PITFALL",
          explanation: ["Two Python math threads fight over one bytecode lock, often matching or losing to single-threaded runtime."],
          code: [
            "# CPU loop on threads: 1 thread runs bytecode at a time",
            "total = sum(i * i for i in range(100_000))",
          ],
          activeLines: [1, 2],
          state: [
            { name: "GIL", value: "serializes CPU bytecode", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Under the GIL, only one thread executes Python bytecode at any instant.",
            nodes: [
              { id: "gil", label: "GIL Mutex", sublabel: "held by Thread A" },
              { id: "ta", label: "Thread A", sublabel: "runs bytecode slice", active: true, tone: "accent" },
              { id: "tb", label: "Thread B", sublabel: "waits for lock", tone: "warm" },
            ],
            links: [
              { from: "gil", to: "ta", label: "active", active: true },
              { from: "gil", to: "tb", label: "blocked" },
            ],
          },
        },
        {
          title: "Processes parallelize CPU across hardware cores",
          tag: "CONCEPT",
          explanation: ["`ProcessPoolExecutor` launches independent interpreters with separate GILs, passing top-level functions via pickle."],
          code: [
            "def sum_sq(n: int) -> int:",
            "    return sum(i * i for i in range(n))",
            "# Top-level def is picklable across processes",
          ],
          activeLines: [1, 2],
          state: [
            { name: "IPC", value: "picklable top-level def", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Separate worker processes have independent GILs running in parallel across CPU cores.",
            nodes: [
              { id: "main", label: "Main Process", sublabel: "pickles tasks" },
              { id: "p1", label: "Worker #1 (own GIL)", sublabel: "Core 1", active: true, tone: "ok" },
              { id: "p2", label: "Worker #2 (own GIL)", sublabel: "Core 2", active: true, tone: "ok" },
            ],
            links: [
              { from: "main", to: "p1", active: true },
              { from: "main", to: "p2", active: true },
            ],
          },
        },
        {
          title: "I/O releases the GIL so threads and async overlap waits",
          tag: "CHECK",
          explanation: ["When sockets or `sleep` wait on the OS, threads release the GIL and `asyncio` coroutines yield."],
          code: [
            "# Concurrent waits overlap:",
            "# wall_time ~= slowest_wait (not sum of all waits)",
          ],
          activeLines: [1, 2],
          state: [
            { name: "I/O scaling", value: "overlapped waits", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Concurrent I/O overlaps 3 x 0.10s waits (~0.10s total) instead of adding them sequentially (0.30s).",
            nodes: [
              { id: "seq", label: "Sequential I/O", sublabel: "0.30s (sum of waits)", tone: "warm" },
              { id: "con", label: "Concurrent Threads / Async", sublabel: "~0.10s (overlapped)", active: true, tone: "ok" },
            ],
            links: [{ from: "seq", to: "con", label: "overlap waits", active: true }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `pickle.loads` on untrusted network bytes",
        detail: "Unpickling untrusted data can execute arbitrary code; restrict `pickle` to trusted internal IPC and use `json` for external inputs.",
      },
      {
        title: "Measuring elapsed time with `time.time()`",
        detail: "Wall-clock time can jump backward during NTP adjustments; always benchmark with `time.perf_counter()`.",
      },
    ],
    predictChecks: [
      {
        prompt: "You need to scrape 50 independent web URLs concurrently. Which approach avoids spawning 50 Python interpreters?",
        code: "# 50 HTTP calls (~300ms network wait each)",
        options: [
          { id: "a", label: "`asyncio` or `ThreadPoolExecutor`" },
          { id: "b", label: "`ProcessPoolExecutor(max_workers=50)`" },
          { id: "c", label: "`functools.lru_cache`" },
        ],
        correctId: "a",
        explanation: "Network waits release the GIL (threads) or suspend cooperatively (`asyncio`).",
      },
      {
        prompt: "Which tool runs heavy pure-Python math loops across 4 CPU cores in standard CPython?",
        code: "def compute(n): return sum(i * i for i in range(n))",
        options: [
          { id: "a", label: "`asyncio.gather`" },
          { id: "b", label: "`ThreadPoolExecutor`" },
          { id: "c", label: "`ProcessPoolExecutor`" },
        ],
        correctId: "c",
        explanation: "Separate processes bypass single-process GIL contention.",
      },
    ],
    practiceTask: {
      title: "Warmup: Measure wall time with `perf_counter()`",
      tier: "Warmup",
      goal: "Write `elapsed_ms(fn)` using `time.perf_counter()` returning rounded milliseconds (`1 decimal`), and confirm sequential sleeps exceed 90 ms.",
      constraints: ["Use `time.perf_counter()`, not `time.time()`"],
      examples: [
        { input: "two sequential 0.05s sleeps", output: "True" },
        { input: "zero-sleep return check", output: "True" },
      ],
      tasks: [
        "Record `t0 = time.perf_counter()`, run `fn()`, return `round((time.perf_counter() - t0) * 1000, 1)`.",
      ],
      starterCode: "# Exercise M11.1 Warmup: monotonic wall timer\nimport time\n\ndef elapsed_ms(fn) -> float:\n    return 0.0\n",
      expectedOutput: "True\nTrue",
      hint: "Measure `(time.perf_counter() - t0) * 1000`.",
      complexity: { time: "O(1) overhead", space: "O(1)" },
      solutionCode:
        "import time\n\ndef elapsed_ms(fn) -> float:\n    t0 = time.perf_counter()\n    fn()\n    return round((time.perf_counter() - t0) * 1000, 1)\n\nprint(elapsed_ms(lambda: (time.sleep(0.05), time.sleep(0.05))) >= 90.0)\nprint(elapsed_ms(lambda: 1 + 1) < 50.0)",
    },
    practiceChallenges: [
      {
        title: "Core: Classify workload to right tool",
        tier: "Core",
        goal: "Write `choose_model(kind, concurrent_sockets)` returning `'asyncio'` (`kind == 'io'` and `concurrent_sockets > 20`), `'threads'` (`kind == 'io'`), or `'processes'` (`kind == 'cpu'`).",
        constraints: ["Raise `ValueError` for unknown `kind`"],
        examples: [
          { input: "'io', 100", output: "asyncio" },
          { input: "'cpu', 4", output: "processes" },
        ],
        tasks: [
          "Return exact concurrency tool strings based on I/O vs CPU profile.",
        ],
        starterCode: "# Exercise M11.1 Core: workload classifier\ndef choose_model(kind: str, concurrent_sockets: int) -> str:\n    return ''\n",
        expectedOutput: "asyncio\nprocesses",
        hint: "Check `kind == 'cpu'` vs `kind == 'io'` with threshold `concurrent_sockets > 20`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def choose_model(kind: str, concurrent_sockets: int) -> str:\n    if kind == 'cpu':\n        return 'processes'\n    if kind == 'io':\n        return 'asyncio' if concurrent_sockets > 20 else 'threads'\n    raise ValueError(f'unknown kind: {kind}')\n\nprint(choose_model('io', 100))\nprint(choose_model('cpu', 4))",
      },
      {
        title: "Stretch: Overlap sleeps with `ThreadPoolExecutor`",
        tier: "Stretch",
        goal: "Execute three `0.06s` sleeps in `ThreadPoolExecutor(max_workers=3)` and verify total wall duration stays below `140 ms`.",
        constraints: ["Compare boolean timing check only for deterministic stdout"],
        examples: [
          { input: "3x 60ms sequential wait check", output: "False" },
          { input: "3x 60ms threaded wait check (< 140ms)", output: "True" },
        ],
        tasks: [
          "Use `with ThreadPoolExecutor(max_workers=3) as pool: list(pool.map(time.sleep, [0.06, 0.06, 0.06]))`.",
        ],
        starterCode: "# Exercise M11.1 Stretch: concurrent ThreadPoolExecutor timing\nfrom concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef measure_three(threaded: bool) -> bool:\n    return False\n",
        expectedOutput: "False\nTrue",
        hint: "Return `(time.perf_counter() - t0) * 1000 < 140.0`.",
        complexity: { time: "O(1) tasks", space: "O(workers)" },
        solutionCode:
          "from concurrent.futures import ThreadPoolExecutor\nimport time\n\ndef measure_three(threaded: bool) -> bool:\n    t0 = time.perf_counter()\n    delays = [0.06, 0.06, 0.06]\n    if threaded:\n        with ThreadPoolExecutor(max_workers=3) as pool:\n            list(pool.map(time.sleep, delays))\n    else:\n        for d in delays:\n            time.sleep(d)\n    return (time.perf_counter() - t0) * 1000 < 140.0\n\nprint(measure_three(False))\nprint(measure_three(True))",
      },
    ],
  },

  "py-thread-process-pools": {
    lessonId: "py-thread-process-pools",
    subtitle: "Manage worker pools using `ThreadPoolExecutor`, `ProcessPoolExecutor`, `as_completed`, and `if __name__ == '__main__':`.",
    intro: {
      heading: "Stop leaking threads and crashing on recursive process spawns",
      explanation: [
        "Spawning raw `threading.Thread` objects inside a loop creates unbounded OS threads under load and risks leaving threads running if an error skips `.join()`. On the process side, calling `ProcessPoolExecutor()` at module top level on Windows or macOS crashes with a recursive spawn `RuntimeError` because each child imports the script again.",
        "`concurrent.futures` wraps thread and process pools in a `with` block that drains workers before exiting, lets `as_completed()` stream fast finishers first, and keeps `ProcessPoolExecutor` guarded under `if __name__ == '__main__':`.",
      ],
      analogy: "A worker pool works like a coffee counter with 4 baristas (`max_workers=4`): 100 orders queue up instead of crowding behind the machine, and `as_completed` calls out drinks as soon as each finishes rather than stalling behind one slow order.",
      realWorldUses: [
        "Fetching batches of independent URLs or running blocking file conversions with bounded `ThreadPoolExecutor` workers",
        "Distributing CPU-heavy parsing or scoring jobs across CPU cores with `ProcessPoolExecutor`",
      ],
    },
    sections: [
      {
        heading: "`pool.map` vs `as_completed` and the `__main__` process guard",
        paragraphs: [
          "`pool.map(fn, xs)` yields results in the original order of `xs`, even if later items finish earlier. When you want to stream results as fast as each worker finishes, submit futures and iterate `for fut in as_completed(futures):`.",
          "Because Windows and macOS spawn fresh Python worker processes that import your file, always put `ProcessPoolExecutor` inside `if __name__ == \"__main__\":` and pass top-level functions.",
        ],
        code: [
          "from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed",
          "",
          "def double_fast(x: int) -> int:",
          "    return x * 2",
          "",
          "with ThreadPoolExecutor(max_workers=3) as pool:",
          "    futs = [pool.submit(double_fast, n) for n in [1, 2, 3]]",
          "    done = sorted(f.result() for f in as_completed(futs))",
          "print(done)",
        ],
        output: "[2, 4, 6]",
        table: {
          caption: "`concurrent.futures` pool choices",
          headers: ["Call", "Yield order", "Requirement"],
          rows: [
            ["`pool.map(fn, xs)`", "Matches `xs` input order", "Simplest when order equals inputs"],
            ["`as_completed(futures)`", "Fastest finisher first", "Call `.result()` inside loop"],
            ["`ProcessPoolExecutor`", "Separate OS processes", "Must live under `if __name__ == '__main__':`"],
          ],
        },
      },
      {
        heading: "Broken vs working: hidden Future exceptions and `as_completed`",
        paragraphs: [
          "Exceptions raised inside `pool.submit(fn)` do not crash the main thread when submitted; they stay inside the `Future` until you call `fut.result()`. Ignoring `.result()` hides worker bugs.",
          "Calling `fut.result()` inside `try / except Exception:` isolates bad inputs while collecting every valid result.",
        ],
        code: [
          "from concurrent.futures import ThreadPoolExecutor, as_completed",
          "",
          "# Broken: never reading f.result() hides ZeroDivisionError silently",
          "# Broken: top-level ProcessPoolExecutor() without if __name__ == '__main__':",
          "",
          "# Working: read f.result() per future and catch worker failures",
          "with ThreadPoolExecutor(max_workers=2) as pool:",
          "    futs = [pool.submit(lambda x: 10 // x, n) for n in [2, 0, 5]]",
          "    ok = []",
          "    for f in as_completed(futs):",
          "        try:",
          "            ok.append(f.result())",
          "        except ZeroDivisionError:",
          "            pass",
          "print(sorted(ok))",
        ],
        output: "[2, 5]",
      },
    ],
    guidedBuildUp: {
      title: "Run Bounded Tasks and Stream Results with `ThreadPoolExecutor`",
      steps: [
        {
          label: "Step 1: Open a bounded `with ThreadPoolExecutor` block",
          explanation: "Use `with ThreadPoolExecutor(max_workers=2)` and `pool.map` when you want results back in input order and guaranteed pool shutdown on exit.",
          code: [
            "from concurrent.futures import ThreadPoolExecutor",
            "",
            "def square(x: int) -> int:",
            "    return x * x",
            "",
            "with ThreadPoolExecutor(max_workers=2) as pool:",
            "    out = list(pool.map(square, [2, 5, 3]))",
            "print(out)",
          ],
          activeLines: [6, 7],
          output: "[4, 25, 9]",
        },
        {
          label: "Step 2: Stream fastest finishers with `submit` and `as_completed`",
          explanation: "Switch to `pool.submit(...)` and `as_completed(futs)` when slow jobs should not block fast results from arriving first.",
          code: [
            "from concurrent.futures import ThreadPoolExecutor, as_completed",
            "import time",
            "",
            "def wait_tag(sec: float, name: str) -> str:",
            "    time.sleep(sec)",
            "    return name",
            "",
            "with ThreadPoolExecutor(max_workers=2) as pool:",
            "    futs = [pool.submit(wait_tag, 0.05, \"slow\"), pool.submit(wait_tag, 0.01, \"fast\")]",
            "    print([f.result() for f in as_completed(futs)])",
          ],
          activeLines: [9, 10],
          output: "['fast', 'slow']",
        },
        {
          label: "Step 3: Isolate per-future exceptions from `.result()`",
          explanation: "Wrap `f.result()` in `try/except Exception` inside the `as_completed` loop so one bad item never drops the remaining futures.",
          code: [
            "from concurrent.futures import ThreadPoolExecutor, as_completed",
            "",
            "with ThreadPoolExecutor(max_workers=2) as pool:",
            "    futs = [pool.submit(lambda x: 10 // x, n) for n in [2, 0, 5]]",
            "    ok, errs = [], 0",
            "    for f in as_completed(futs):",
            "        try:",
            "            ok.append(f.result())",
            "        except Exception:",
            "            errs += 1",
            "print(sorted(ok), errs)",
          ],
          activeLines: [7, 8, 9, 10],
          output: "[2, 5] 1",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `submit()` and `as_completed()` vs `map()`",
      steps: [
        {
          title: "`with ThreadPoolExecutor` bounds worker count",
          tag: "CONCEPT",
          explanation: ["`max_workers=2` keeps at most 2 active workers; queued tasks wait inside the pool's work queue."],
          code: [
            "with ThreadPoolExecutor(max_workers=2) as pool:",
            "    f1 = pool.submit(task, 'a', 0.05)",
            "    f2 = pool.submit(task, 'b', 0.01)",
            "    print([f.result() for f in as_completed([f1, f2])])",
          ],
          activeLines: [1, 2, 3],
          state: [
            { name: "max_workers", value: "2", changed: true },
            { name: "futures queued", value: "2" },
          ],
          visual: {
            kind: "pipeline",
            caption: "pool.submit queues tasks into a bounded 2-worker pool and immediately returns Future handles.",
            nodes: [
              { id: "sub", label: "pool.submit(f1), submit(f2)", sublabel: "enqueue tasks" },
              { id: "w1", label: "Worker 1 -> f1 ('a', 0.05s)", sublabel: "busy", active: true, tone: "accent" },
              { id: "w2", label: "Worker 2 -> f2 ('b', 0.01s)", sublabel: "busy", active: true, tone: "accent" },
            ],
            links: [
              { from: "sub", to: "w1", active: true },
              { from: "sub", to: "w2", active: true },
            ],
          },
        },
        {
          title: "`as_completed` emits fast futures first",
          tag: "TRACE",
          explanation: ["Because `f2` finishes in `0.01s` before `f1`, `as_completed` yields `'b'` first without waiting for `'a'`."],
          code: [
            "    print([f.result() for f in as_completed([f1, f2])])",
          ],
          activeLines: [1],
          state: [
            { name: "1st yielded", value: "'b'" },
            { name: "2nd yielded", value: "'a'", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "as_completed emits futures in completion order ('b' at 0.01s first, then 'a' at 0.05s).",
            nodes: [
              { id: "f2", label: "f2 (0.01s)", sublabel: "finishes 1st -> 'b'", active: true, tone: "ok" },
              { id: "f1", label: "f1 (0.05s)", sublabel: "finishes 2nd -> 'a'", tone: "accent" },
              { id: "ac", label: "as_completed", sublabel: "['b', 'a']", active: true, tone: "ok" },
            ],
            links: [
              { from: "f2", to: "ac", label: "1st", active: true },
              { from: "f1", to: "ac", label: "2nd" },
            ],
          },
        },
        {
          title: "`with` block calls `shutdown(wait=True)` on exit",
          tag: "CHECK",
          explanation: ["Leaving the `with` block waits until every submitted future finishes, preventing leaked background threads."],
          code: [
            "with ThreadPoolExecutor(max_workers=2) as pool:",
            "    ...",
          ],
          activeLines: [1],
          state: [
            { name: "pool state", value: "shutdown clean", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Exiting with ThreadPoolExecutor runs shutdown(wait=True) to drain running futures before returning.",
            nodes: [
              { id: "run", label: "Active futures", sublabel: "draining..." },
              { id: "sh", label: "shutdown(wait=True)", sublabel: "waits for all", active: true, tone: "accent" },
              { id: "cln", label: "Pool closed", sublabel: "0 leaked threads", tone: "ok" },
            ],
            links: [
              { from: "run", to: "sh", active: true },
              { from: "sh", to: "cln", active: true },
            ],
          },
        },
        {
          title: "Missing `__main__` guard breaks `ProcessPoolExecutor`",
          tag: "PITFALL",
          explanation: ["On Windows/macOS (`spawn`), module-level `ProcessPoolExecutor` re-imports the script in each child, spawning recursively until crashing."],
          code: [
            "if __name__ == '__main__':",
            "    with ProcessPoolExecutor() as pool:",
            "        ...",
          ],
          activeLines: [1, 2],
          state: [
            { name: "guard", value: "__name__ == '__main__'", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "The __main__ guard ensures only the parent starts the ProcessPoolExecutor while spawned children import without re-spawning.",
            nodes: [
              { id: "par", label: "__name__ == '__main__'", sublabel: "starts pool", active: true, tone: "ok" },
              { id: "chd", label: "__mp_main__ import", sublabel: "skips pool launch", tone: "muted" },
            ],
            links: [{ from: "par", to: "chd", label: "guarded spawn" }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Swallowing worker exceptions when ignoring `future.result()`",
        detail: "Exceptions raised inside `pool.submit(fn)` are stored inside the `Future` and only raise when you call `fut.result()`.",
      },
      {
        title: "Passing `lambda` or inner functions to `ProcessPoolExecutor`",
        detail: "Only top-level named `def` functions can be pickled to worker processes.",
      },
    ],
    predictChecks: [
      {
        prompt: "What is the key difference between `pool.map(fn, xs)` and `as_completed(futures)`?",
        code: "futs = [pool.submit(fn, x) for x in [1, 2, 3]]",
        options: [
          { id: "a", label: "`map` yields in input order; `as_completed` yields whichever future finishes first" },
          { id: "b", label: "`as_completed` runs sequentially" },
          { id: "c", label: "`map` disables exceptions" },
        ],
        correctId: "a",
        explanation: "Use `as_completed` when fast finishers should report immediately.",
      },
      {
        prompt: "Why must `ProcessPoolExecutor` calls live under `if __name__ == '__main__':` on Windows?",
        code: "if __name__ == '__main__':\n    with ProcessPoolExecutor() as pool: ...",
        options: [
          { id: "a", label: "Child workers import the module, which would spawn new pools endlessly otherwise" },
          { id: "b", label: "Windows disables threads outside `__main__`" },
          { id: "c", label: "Pickle ignores top-level imports" },
        ],
        correctId: "a",
        explanation: "`spawn` imports the module in each worker process.",
      },
    ],
    practiceTask: {
      title: "Warmup: Collect results via `pool.map` preserving input order",
      tier: "Warmup",
      goal: "Write `batch_square(nums)` using `ThreadPoolExecutor(max_workers=2)` and `pool.map` returning squares in original order.",
      constraints: ["Wrap the executor in `with`"],
      examples: [
        { input: "[2, 5, 3]", output: "[4, 25, 9]" },
        { input: "[]", output: "[]" },
      ],
      tasks: [
        "Return `list(pool.map(lambda x: x * x, nums))` inside `with ThreadPoolExecutor(max_workers=2) as pool:`.",
      ],
      starterCode: "# Exercise M11.2 Warmup: ordered ThreadPoolExecutor.map\nfrom concurrent.futures import ThreadPoolExecutor\n\ndef batch_square(nums: list[int]) -> list[int]:\n    return []\n",
      expectedOutput: "[4, 25, 9]\n[]",
      hint: "Open `with ThreadPoolExecutor(max_workers=2) as pool:` and return `list(pool.map(...))`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "from concurrent.futures import ThreadPoolExecutor\n\ndef batch_square(nums: list[int]) -> list[int]:\n    with ThreadPoolExecutor(max_workers=2) as pool:\n        return list(pool.map(lambda x: x * x, nums))\n\nprint(batch_square([2, 5, 3]))\nprint(batch_square([]))",
    },
    practiceChallenges: [
      {
        title: "Core: Stream fastest finisher first with `as_completed`",
        tier: "Core",
        goal: "Submit `(0.08, 'slow')` and `(0.01, 'fast')` to `ThreadPoolExecutor` and verify `as_completed` yields `['fast', 'slow']`.",
        constraints: ["Read `fut.result()` inside `for fut in as_completed(...)`"],
        examples: [
          { input: "[(0.08, 'slow'), (0.01, 'fast')]", output: "['fast', 'slow']" },
          { input: "[(0.06, 'b'), (0.01, 'a')]", output: "['a', 'b']" },
        ],
        tasks: [
          "Submit each `(delay, name)` to `wait_label` and collect completion order.",
        ],
        starterCode: "# Exercise M11.2 Core: as_completed fastest-first stream\nfrom concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndef fastest_first(jobs: list[tuple[float, str]]) -> list[str]:\n    return []\n",
        expectedOutput: "['fast', 'slow']\n['a', 'b']",
        hint: "Submit `pool.submit(wait_label, d, name)` and list `[f.result() for f in as_completed(futs)]`.",
        complexity: { time: "O(slowest)", space: "O(n)" },
        solutionCode:
          "from concurrent.futures import ThreadPoolExecutor, as_completed\nimport time\n\ndef wait_label(sec: float, name: str) -> str:\n    time.sleep(sec)\n    return name\n\ndef fastest_first(jobs: list[tuple[float, str]]) -> list[str]:\n    with ThreadPoolExecutor(max_workers=len(jobs)) as pool:\n        futs = [pool.submit(wait_label, sec, name) for sec, name in jobs]\n        return [f.result() for f in as_completed(futs)]\n\nprint(fastest_first([(0.08, 'slow'), (0.01, 'fast')]))\nprint(fastest_first([(0.06, 'b'), (0.01, 'a')]))",
      },
      {
        title: "Stretch: Capture worker failures from `.result()`",
        tier: "Stretch",
        goal: "Write `run_safe(fn, items)` submitting all items to `ThreadPoolExecutor` and returning `(ok_values, failed_count)` by calling `fut.result()` inside `try/except Exception`.",
        constraints: ["Sort `ok_values` deterministically"],
        examples: [
          { input: "[2, 0, 5] with 10 // x", output: "([2, 5], 1)" },
          { input: "[1, 2] with 10 // x", output: "([5, 10], 0)" },
        ],
        tasks: [
          "Try `fut.result()` for each future in `as_completed`; catch `Exception` to increment failures.",
        ],
        starterCode: "# Exercise M11.2 Stretch: isolate per-future exceptions\nfrom concurrent.futures import ThreadPoolExecutor, as_completed\n\ndef run_safe(fn, items: list[int]) -> tuple[list[int], int]:\n    return ([], 0)\n",
        expectedOutput: "([2, 5], 1)\n([5, 10], 0)",
        hint: "Catch `Exception` when reading `fut.result()` inside the `as_completed` loop.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "from concurrent.futures import ThreadPoolExecutor, as_completed\n\ndef run_safe(fn, items: list[int]) -> tuple[list[int], int]:\n    ok: list[int] = []\n    bad = 0\n    with ThreadPoolExecutor(max_workers=3) as pool:\n        futs = [pool.submit(fn, x) for x in items]\n        for f in as_completed(futs):\n            try:\n                ok.append(f.result())\n            except Exception:\n                bad += 1\n    return (sorted(ok), bad)\n\nprint(run_safe(lambda x: 10 // x, [2, 0, 5]))\nprint(run_safe(lambda x: 10 // x, [1, 2]))",
      },
    ],
  },

  "py-locks-queues": {
    lessonId: "py-locks-queues",
    subtitle: "Prevent race conditions with `threading.Lock` and coordinate producer-consumer workers via `queue.Queue` and `None` sentinels.",
    intro: {
      heading: "Fix silent lost updates and deadlocks across threads",
      explanation: [
        "Run two threads that each execute `count += 1` ten thousand times and the final count rarely reaches `20,000`. Even under CPython's GIL, `+= 1` splits into separate read, add, and write bytecode steps, letting threads overwrite each other's updates. Meanwhile, worker loops polling `while not q.empty():` race between checking and `q.get()`, hanging or crashing on shutdown.",
        "Guard shared writes with `with threading.Lock():` so only one thread updates at a time, and pass tasks through a thread-safe `queue.Queue` using `q.task_done()` in `finally:` and one `None` sentinel per worker.",
      ],
      analogy: "A `Lock` is a single-occupant room key: only the thread holding the key updates the counter before handing it off, while `queue.Queue` is a kitchen ticket rail where a `None` ticket tells each cook the shift has ended.",
      realWorldUses: [
        "Protecting shared in-memory counters, caches, or connection metrics updated by worker threads",
        "Coordinating multi-worker background pipelines (log shippers, image resizers) that drain and exit deterministically",
      ],
    },
    sections: [
      {
        heading: "`threading.Lock`, `queue.Queue`, and `None` sentinels",
        paragraphs: [
          "Acquire locks via `with lock:` so unlocks still run if an exception happens. Keep locked sections tiny and never acquire two locks in opposite order across threads.",
          "Prefer passing work over `queue.Queue` (built-in locking + `.task_done()` + `.join()`). Push one `None` sentinel per worker thread so consumers shut down without polling `.empty()`.",
        ],
        code: [
          "import queue",
          "import threading",
          "",
          "jobs: queue.Queue[int | None] = queue.Queue()",
          "lock = threading.Lock()",
          "results: list[int] = []",
          "",
          "def worker() -> None:",
          "    while True:",
          "        item = jobs.get()",
          "        try:",
          "            if item is None:",
          "                return",
          "            with lock:",
          "                results.append(item * 2)",
          "        finally:",
          "            jobs.task_done()",
          "",
          "ws = [threading.Thread(target=worker) for _ in range(2)]",
          "for w in ws: w.start()",
          "for n in [3, 5]: jobs.put(n)",
          "for _ in ws: jobs.put(None)",
          "jobs.join()",
          "for w in ws: w.join()",
          "print(sorted(results))",
        ],
        output: "[6, 10]",
        visual: {
          kind: "async-timeline",
          caption: "Lock serialization and Queue sentinel worker shutdown",
          scenarios: [
            {
              label: "Lock Serialization",
              gilNote: "Shared counter lock",
              totalMs: 240,
              summary: "Workers run prep in parallel outside the lock, then enter with lock one at a time.",
              lanes: [
                {
                  name: "Worker A",
                  segments: [
                    { startMs: 0, endMs: 80, state: "waiting", label: "work" },
                    { startMs: 80, endMs: 140, state: "running", label: "with lock: update" },
                  ],
                },
                {
                  name: "Worker B",
                  segments: [
                    { startMs: 0, endMs: 80, state: "waiting", label: "work" },
                    { startMs: 80, endMs: 140, state: "blocked", label: "wait lock" },
                    { startMs: 140, endMs: 200, state: "running", label: "with lock: update" },
                  ],
                },
              ],
            },
            {
              label: "Queue + Sentinel Pipeline",
              gilNote: "Producer / Workers",
              totalMs: 200,
              summary: "Producer pushes tasks then None; worker finishes with task_done() and exits.",
              lanes: [
                {
                  name: "Producer",
                  segments: [
                    { startMs: 0, endMs: 60, state: "running", label: "put items + None" },
                    { startMs: 60, endMs: 180, state: "waiting", label: "jobs.join()" },
                    { startMs: 180, endMs: 200, state: "running", label: "w.join()" },
                  ],
                },
                {
                  name: "Consumer",
                  segments: [
                    { startMs: 10, endMs: 180, state: "running", label: "get() -> task_done()" },
                    { startMs: 180, endMs: 200, state: "cancelled", label: "exits on None" },
                  ],
                },
              ],
            },
          ],
        },
        table: {
          caption: "Synchronization primitives",
          headers: ["Tool", "Purpose", "Critical rule"],
          rows: [
            ["`with threading.Lock():`", "Protects compound shared mutation", "Keep section minimal; consistent lock order"],
            ["`queue.Queue`", "Thread-safe FIFO task channel", "Call `q.task_done()` in `finally:`"],
            ["`None` sentinel", "Signals each consumer worker to exit", "Enqueue one `None` per worker thread"],
          ],
        },
      },
      {
        heading: "Broken vs working: interleaved `+= 1` vs `with lock:`",
        paragraphs: [
          "Because `count += 1` loads `count`, adds `1`, and writes back in separate bytecode instructions, two threads can both read `10` and both write `11`—losing an increment.",
          "Acquiring `lock` around the update ensures the second thread reads `11` and writes `12`. When acquiring two locks (such as source and destination vaults), sort them by a fixed key like `.vid` so two threads never deadlock waiting on each other.",
        ],
        code: [
          "from concurrent.futures import ThreadPoolExecutor",
          "import threading",
          "",
          "# Broken without lock: Thread A & B can both read 0 and write 1",
          "# state['n'] += 1  # race condition!",
          "",
          "# Working with Lock:",
          "lock = threading.Lock()",
          "state = {\"n\": 0}",
          "def bump(k: int) -> None:",
          "    for _ in range(k):",
          "        with lock:",
          "            state[\"n\"] += 1",
          "",
          "with ThreadPoolExecutor(max_workers=4) as pool:",
          "    list(pool.map(bump, [250, 250, 250, 250]))",
          "print(state[\"n\"])",
        ],
        output: "1000",
      },
    ],
    guidedBuildUp: {
      title: "Build a Race-Free Queue Worker Pipeline",
      steps: [
        {
          label: "Step 1: Guard shared writes with `with lock:`",
          explanation: "Wrap updates to the shared `results` list in `with lock:` so concurrent workers append one at a time.",
          code: [
            "import threading",
            "",
            "lock = threading.Lock()",
            "results: list[int] = []",
            "",
            "def record(val: int) -> None:",
            "    with lock:",
            "        results.append(val * 2)",
            "",
            "record(3)",
            "print(results)",
          ],
          activeLines: [3, 7, 8],
          output: "[6]",
        },
        {
          label: "Step 2: Balance every `get()` with `task_done()` in `finally:`",
          explanation: "Put `jobs.task_done()` inside `finally:` so even an early `return` on `None` decrements the queue's unfinished task counter.",
          code: [
            "import queue",
            "import threading",
            "",
            "jobs: queue.Queue[int | None] = queue.Queue()",
            "lock = threading.Lock()",
            "results: list[int] = []",
            "",
            "def worker() -> None:",
            "    while True:",
            "        item = jobs.get()",
            "        try:",
            "            if item is None:",
            "                return",
            "            with lock:",
            "                results.append(item * 2)",
            "        finally:",
            "            jobs.task_done()",
          ],
          activeLines: [10, 12, 13, 16, 17],
        },
        {
          label: "Step 3: Push one `None` sentinel per worker and join",
          explanation: "Enqueue all items, push one `None` for each worker thread, wait on `jobs.join()`, then join the threads.",
          code: [
            "import queue, threading",
            "jobs: queue.Queue[int | None] = queue.Queue()",
            "lock, results = threading.Lock(), []",
            "def worker():",
            "    while True:",
            "        item = jobs.get()",
            "        try:",
            "            if item is None: return",
            "            with lock: results.append(item * 2)",
            "        finally: jobs.task_done()",
            "ws = [threading.Thread(target=worker) for _ in range(2)]",
            "for w in ws: w.start()",
            "for n in [3, 5]: jobs.put(n)",
            "for _ in ws: jobs.put(None)",
            "jobs.join()",
            "for w in ws: w.join()",
            "print(sorted(results))",
          ],
          activeLines: [14, 15, 16],
          output: "[6, 10]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace race elimination and Queue sentinel handoff",
      steps: [
        {
          title: "Read-modify-write without Lock drops increments",
          tag: "PITFALL",
          explanation: ["Thread A and Thread B can both read `0` before either writes back `1`, losing one increment."],
          code: [
            "count += 1  # not atomic: read -> add -> write",
          ],
          activeLines: [1],
          state: [
            { name: "Thread A & B read", value: "0, 0 -> both write 1!", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Without a Lock, interleaved reads let two threads overwrite each other with 1.",
            branches: [
              { id: "a", label: "Thread A reads 0, computes 1", status: "active" },
              { id: "b", label: "Thread B reads 0 -> writes 1 (update lost!)", status: "false" },
            ],
          },
        },
        {
          title: "`with lock:` makes updates mutually exclusive",
          tag: "CONCEPT",
          explanation: ["Only one thread enters `with lock:` at a time, guaranteeing sequential read-modify-write updates."],
          code: [
            "with lock:",
            "    count += 1",
          ],
          activeLines: [1, 2],
          state: [
            { name: "Thread A writes", value: "1" },
            { name: "Thread B writes", value: "2", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "with lock forces Thread B to wait until Thread A releases the lock -> final count 2.",
            branches: [
              { id: "a", label: "Thread A acquires lock: 0 -> 1, releases", status: "true" },
              { id: "b", label: "Thread B acquires lock: 1 -> 2, releases", status: "true" },
            ],
          },
        },
        {
          title: "`try/finally: q.task_done()` unblocks `q.join()`",
          tag: "TRACE",
          explanation: ["Every `q.get()` (including the final `None` sentinel) must be paired with `q.task_done()` inside `finally:`."],
          code: [
            "item = q.get()",
            "try:",
            "    if item is None: return",
            "    process(item)",
            "finally:",
            "    q.task_done()",
          ],
          activeLines: [1, 3, 6],
          state: [
            { name: "unfinished_tasks", value: "reaches 0", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Each q.get() item calls q.task_done() inside finally so unfinished_tasks reaches 0 and unblocks q.join().",
            branches: [
              { id: "p", label: "q.get() processes item1 -> finally: q.task_done()", status: "true" },
              { id: "s", label: "q.get() pops None sentinel -> task_done() -> q.join() unblocks", status: "active" },
            ],
          },
        },
        {
          title: "Never replace sentinels with `while not q.empty():`",
          tag: "CHECK",
          explanation: ["Two workers checking `q.empty()` can race between checking and `get()`, hanging indefinitely."],
          code: [
            "# Put one None per worker instead of q.empty() polling",
            "for _ in workers: q.put(None)",
          ],
          activeLines: [2],
          state: [
            { name: "shutdown", value: "deterministic", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Sending one None sentinel per worker guarantees every thread shuts down deterministically without q.empty() races.",
            branches: [
              { id: "w1", label: "Worker 1 reads None -> task_done() -> returns", status: "true" },
              { id: "w2", label: "Worker 2 reads None -> task_done() -> returns", status: "true" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting `q.task_done()` on `None` sentinel exit",
        detail: "Always place `q.task_done()` in `finally:` so `return` on `None` still decrements unfinished tasks for `q.join()`.",
      },
      {
        title: "Acquiring Lock A then Lock B in one thread and B then A in another",
        detail: "Always acquire multiple locks in a globally consistent order to prevent deadlocks.",
      },
    ],
    predictChecks: [
      {
        prompt: "Why can `shared += 1` across two threads lose counts even with CPython's GIL?",
        code: "for _ in range(10_000):\n    shared += 1",
        options: [
          { id: "a", label: "`+= 1` compiles to multiple bytecode steps that threads can interleave between" },
          { id: "b", label: "Integers are mutable in Python" },
          { id: "c", label: "Threads disable the GIL automatically" },
        ],
        correctId: "a",
        explanation: "Bytecode context switches can occur between reading `shared` and storing the incremented value.",
      },
      {
        prompt: "What happens if a worker exits on `if item is None: return` without calling `q.task_done()`?",
        code: "item = q.get()\nif item is None:\n    return",
        options: [
          { id: "a", label: "`q.join()` blocks forever waiting on the unfinished sentinel count" },
          { id: "b", label: "`Queue` auto-closes" },
          { id: "c", label: "Raises `StopIteration`" },
        ],
        correctId: "a",
        explanation: "`q.join()` waits until `task_done()` equals every `put()`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Guard a shared counter with `threading.Lock`",
      tier: "Warmup",
      goal: "Run `add_n` across 4 `ThreadPoolExecutor` workers adding 250 each with `threading.Lock` and return exact total `1000`.",
      constraints: ["Protect increment with `with lock:`"],
      examples: [
        { input: "4 batches of 250", output: "1000" },
        { input: "2 batches of 50", output: "100" },
      ],
      tasks: [
        "Use `with lock:` around `state['count'] += 1`.",
      ],
      starterCode: "# Exercise M11.3 Warmup: thread-safe Lock counter\nfrom concurrent.futures import ThreadPoolExecutor\nimport threading\n\ndef safe_count(batches: list[int]) -> int:\n    return 0\n",
      expectedOutput: "1000\n100",
      hint: "Create `lock = threading.Lock()` inside `safe_count` and guard increments inside `add_n`.",
      complexity: { time: "O(sum(batches))", space: "O(1)" },
      solutionCode:
        "from concurrent.futures import ThreadPoolExecutor\nimport threading\n\ndef safe_count(batches: list[int]) -> int:\n    lock = threading.Lock()\n    state = {'n': 0}\n    def add_batch(k: int) -> None:\n        for _ in range(k):\n            with lock:\n                state['n'] += 1\n    with ThreadPoolExecutor(max_workers=4) as pool:\n        list(pool.map(add_batch, batches))\n    return state['n']\n\nprint(safe_count([250, 250, 250, 250]))\nprint(safe_count([50, 50]))",
    },
    practiceChallenges: [
      {
        title: "Core: Producer-consumer `queue.Queue` with `None` sentinel",
        tier: "Core",
        goal: "Process `items` across 2 worker threads using `queue.Queue`, a `None` sentinel per worker, `q.task_done()` in `finally:`, and `q.join()`.",
        constraints: ["Never call `q.empty()` for loop termination"],
        examples: [
          { input: "[1, 3, 5]", output: "[2, 6, 10]" },
          { input: "[]", output: "[]" },
        ],
        tasks: [
          "Put all items then two `None`s, join `q`, join worker threads, and return `sorted(out)`.",
        ],
        starterCode: "# Exercise M11.3 Core: Queue + None sentinel shutdown\nimport queue\nimport threading\n\ndef process_queue(items: list[int]) -> list[int]:\n    return []\n",
        expectedOutput: "[2, 6, 10]\n[]",
        hint: "Guard `out.append(item * 2)` with `with lock:` and put `q.task_done()` in `finally:`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "import queue\nimport threading\n\ndef process_queue(items: list[int]) -> list[int]:\n    q: queue.Queue[int | None] = queue.Queue()\n    lock = threading.Lock()\n    out: list[int] = []\n    def worker() -> None:\n        while True:\n            val = q.get()\n            try:\n                if val is None:\n                    return\n                with lock:\n                    out.append(val * 2)\n            finally:\n                q.task_done()\n    ws = [threading.Thread(target=worker) for _ in range(2)]\n    for w in ws: w.start()\n    for x in items: q.put(x)\n    for _ in ws: q.put(None)\n    q.join()\n    for w in ws: w.join()\n    return sorted(out)\n\nprint(process_queue([1, 3, 5]))\nprint(process_queue([]))",
      },
      {
        title: "Stretch: Transfer lock ordering without deadlock",
        tier: "Stretch",
        goal: "Implement `transfer(src, dst, amount)` on `Vault(id, balance, lock)` locking `min(id)` before `max(id)` so bidirectional transfers between two threads never deadlock.",
        constraints: ["Acquire locks in ascending `vault.vid` order"],
        examples: [
          { input: "a=100, b=100; 20 parallel opposite transfers", output: "True 200" },
          { input: "single transfer 30", output: "True 70 130" },
        ],
        tasks: [
          "Sort `(src, dst)` by `.vid` to acquire outer then inner `with` lock in consistent order.",
        ],
        starterCode: "# Exercise M11.3 Stretch: deadlock-free lock ordering\nfrom concurrent.futures import ThreadPoolExecutor\nimport threading\n\nclass Vault:\n    def __init__(self, vid: int, balance: int):\n        self.vid = vid\n        self.balance = balance\n        self.lock = threading.Lock()\n\ndef transfer(src: Vault, dst: Vault, amount: int) -> bool:\n    return False\n",
        expectedOutput: "True 200\nTrue 70 130",
        hint: "Set `first, second = (src, dst) if src.vid < dst.vid else (dst, src)` and nest `with first.lock: with second.lock:`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "from concurrent.futures import ThreadPoolExecutor\nimport threading\n\nclass Vault:\n    def __init__(self, vid: int, balance: int):\n        self.vid = vid\n        self.balance = balance\n        self.lock = threading.Lock()\n\ndef transfer(src: Vault, dst: Vault, amount: int) -> bool:\n    first, second = (src, dst) if src.vid < dst.vid else (dst, src)\n    with first.lock:\n        with second.lock:\n            if amount <= 0 or src.balance < amount:\n                return False\n            src.balance -= amount\n            dst.balance += amount\n            return True\n\na, b = Vault(1, 100), Vault(2, 100)\nwith ThreadPoolExecutor(max_workers=4) as p:\n    futs = [p.submit(transfer, a, b, 5) for _ in range(10)] + [p.submit(transfer, b, a, 5) for _ in range(10)]\n    ok = all(f.result() for f in futs)\nprint(ok, a.balance + b.balance)\nx, y = Vault(1, 100), Vault(2, 100)\nprint(transfer(x, y, 30), x.balance, y.balance)",
      },
    ],
  },

  "py-asyncio-basics": {
    lessonId: "py-asyncio-basics",
    subtitle: "Write cooperative coroutines with `async`/`await`, run concurrent tasks with `TaskGroup` + `except*`, and offload blocking work via `asyncio.to_thread`.",
    intro: {
      heading: "Avoid freezing the event loop and leaving orphaned tasks",
      explanation: [
        "Calling `time.sleep(1)` or `requests.get(url)` inside an `async def` function freezes the single event-loop thread, stalling every other coroutine until that synchronous call finishes. Forgetting `await` creates a `RuntimeWarning: coroutine ... was never awaited`, and firing bare `asyncio.create_task()` calls leaves orphaned background tasks when one sibling fails.",
        "Use `await asyncio.sleep(...)` for async waits, `await asyncio.to_thread(sync_fn, ...)` to offload blocking sync libraries, and Python 3.11+ `asyncio.TaskGroup()` so sibling tasks cancel together and errors surface via `except*`.",
      ],
      analogy: "An `asyncio` event loop works like one chess grandmaster playing 20 boards at once: at every `await`, the grandmaster moves to the next board while the opponent thinks, whereas calling `time.sleep` is staring at one board and refusing to budge.",
      realWorldUses: [
        "Concurrent HTTP API aggregators, WebSockets, and async database clients",
        "Running blocking sync SDKs from async handlers via `asyncio.to_thread`",
      ],
    },
    sections: [
      {
        heading: "`async`/`await`, `TaskGroup`, `except*`, and `to_thread`",
        paragraphs: [
          "Calling an `async def` returns an unstarted coroutine object; pass it to `await` or `asyncio.run(...)`. Never run `time.sleep` inside `async def` (it freezes the whole loop); use `await asyncio.sleep(...)` or `await asyncio.to_thread(sync_fn, arg)`.",
          "`TaskGroup` raises an `ExceptionGroup` if tasks fail; catch specific types selectively using `except* ValueError as eg:` or use `asyncio.gather(..., return_exceptions=True)` when failures should not abort siblings.",
        ],
        code: [
          "import asyncio",
          "",
          "async def job(n: int) -> int:",
          "    await asyncio.sleep(0.01)",
          "    if n < 0:",
          "        raise ValueError(f\"bad:{n}\")",
          "    return n * 2",
          "",
          "async def main() -> None:",
          "    try:",
          "        async with asyncio.TaskGroup() as tg:",
          "            t1 = tg.create_task(job(3))",
          "            tg.create_task(job(-1))",
          "    except* ValueError as eg:",
          "        print([str(e) for e in eg.exceptions])",
          "",
          "asyncio.run(main())",
        ],
        output: "['bad:-1']",
        visual: {
          kind: "async-timeline",
          caption: "Sequential await vs TaskGroup concurrency vs blocking time.sleep stall",
          scenarios: [
            {
              label: "Sequential await",
              gilNote: "No overlap",
              totalMs: 440,
              summary: "Awaiting each task sequentially sums both latencies (~440 ms).",
              lanes: [
                {
                  name: "Task A",
                  segments: [
                    { startMs: 0, endMs: 35, state: "running", label: "run" },
                    { startMs: 35, endMs: 185, state: "waiting", label: "await sleep" },
                    { startMs: 185, endMs: 220, state: "running", label: "ok" },
                  ],
                },
                {
                  name: "Task B",
                  segments: [
                    { startMs: 220, endMs: 255, state: "running", label: "run" },
                    { startMs: 255, endMs: 405, state: "waiting", label: "await sleep" },
                    { startMs: 405, endMs: 440, state: "running", label: "ok" },
                  ],
                },
              ],
            },
            {
              label: "TaskGroup (Concurrent)",
              gilNote: "Overlapped await",
              totalMs: 250,
              summary: "While Task A awaits, the loop schedules Task B immediately (~250 ms).",
              lanes: [
                {
                  name: "Task A",
                  segments: [
                    { startMs: 0, endMs: 30, state: "running", label: "run" },
                    { startMs: 30, endMs: 200, state: "waiting", label: "await sleep" },
                    { startMs: 200, endMs: 230, state: "running", label: "ok" },
                  ],
                },
                {
                  name: "Task B",
                  segments: [
                    { startMs: 30, endMs: 60, state: "running", label: "run" },
                    { startMs: 60, endMs: 220, state: "waiting", label: "await sleep" },
                    { startMs: 220, endMs: 250, state: "running", label: "ok" },
                  ],
                },
              ],
            },
            {
              label: "Blocking time.sleep Trap",
              gilNote: "Event loop frozen",
              totalMs: 400,
              summary: "Calling sync time.sleep stalls the single loop thread so Task B starves.",
              lanes: [
                {
                  name: "Task A",
                  segments: [
                    { startMs: 0, endMs: 200, state: "blocked", label: "time.sleep stalls loop" },
                    { startMs: 200, endMs: 235, state: "running", label: "ok" },
                  ],
                },
                {
                  name: "Task B",
                  segments: [
                    { startMs: 0, endMs: 200, state: "blocked", label: "starved" },
                    { startMs: 200, endMs: 400, state: "waiting", label: "runs late" },
                  ],
                },
              ],
            },
          ],
        },
        table: {
          caption: "`asyncio` concurrency patterns",
          headers: ["Tool", "Failure policy", "Use when"],
          rows: [
            ["`TaskGroup()` + `except*`", "Cancels siblings, raises `ExceptionGroup`", "Any failure should abort the group"],
            ["`gather(..., return_exceptions=True)`", "Returns exceptions inline in list", "Best-effort fan-out keeping partial wins"],
            ["`await asyncio.to_thread(fn, ...)`", "Runs blocking sync `fn` on thread pool", "Using synchronous clients inside `async def`"],
          ],
        },
      },
      {
        heading: "Broken vs working: unawaited coroutines and blocking `time.sleep`",
        paragraphs: [
          "Writing `res = job(3)` without `await` gives you a coroutine object instead of `6`, and Python warns when it is garbage-collected. Sequential awaits (`await job(3); await job(5)`) also serialize waits instead of overlapping them.",
          "Whenever a third-party library only offers synchronous blocking calls (`time.sleep`, `requests.get`, CPU parsing), bridge it via `await asyncio.to_thread(...)` so the event loop keeps running other tasks.",
        ],
        code: [
          "import asyncio, time",
          "",
          "# Broken inside async def: time.sleep(0.2) freezes ALL concurrent tasks",
          "# Broken call: job(3) without await returns <coroutine object job>",
          "",
          "# Working bridge for blocking functions:",
          "def sync_read(name: str) -> str:",
          "    time.sleep(0.02)",
          "    return f\"read:{name}\"",
          "",
          "async def main() -> None:",
          "    async with asyncio.TaskGroup() as tg:",
          "        t1 = tg.create_task(asyncio.to_thread(sync_read, \"a\"))",
          "        t2 = tg.create_task(asyncio.to_thread(sync_read, \"b\"))",
          "    print([t1.result(), t2.result()])",
          "",
          "asyncio.run(main())",
        ],
        output: "['read:a', 'read:b']",
      },
    ],
    guidedBuildUp: {
      title: "Schedule Concurrent Coroutines with `TaskGroup`",
      steps: [
        {
          label: "Step 1: Define and `await` one coroutine",
          explanation: "Define `async def job(n)` using `await asyncio.sleep(...)` and execute it through `asyncio.run(...)`.",
          code: [
            "import asyncio",
            "",
            "async def job(n: int) -> int:",
            "    await asyncio.sleep(0.01)",
            "    return n * 2",
            "",
            "print(asyncio.run(job(3)))",
          ],
          activeLines: [3, 4, 7],
          output: "6",
        },
        {
          label: "Step 2: Run multiple tasks concurrently with `TaskGroup`",
          explanation: "Schedule `t1` and `t2` inside `async with asyncio.TaskGroup() as tg:` so their `await` waits overlap and `.result()` is ready on exit.",
          code: [
            "import asyncio",
            "",
            "async def job(n: int) -> int:",
            "    await asyncio.sleep(0.01)",
            "    return n * 2",
            "",
            "async def main() -> None:",
            "    async with asyncio.TaskGroup() as tg:",
            "        t1 = tg.create_task(job(3))",
            "        t2 = tg.create_task(job(5))",
            "    print([t1.result(), t2.result()])",
            "",
            "asyncio.run(main())",
          ],
          activeLines: [8, 9, 10, 11],
          output: "[6, 10]",
        },
        {
          label: "Step 3: Handle grouped errors with `except*`",
          explanation: "When any task raises inside `TaskGroup`, `TaskGroup` cancels siblings and raises an `ExceptionGroup` handled by `except*`.",
          code: [
            "import asyncio",
            "",
            "async def job(n: int) -> int:",
            "    await asyncio.sleep(0.01)",
            "    if n < 0: raise ValueError(f\"bad:{n}\")",
            "    return n * 2",
            "",
            "async def main() -> None:",
            "    try:",
            "        async with asyncio.TaskGroup() as tg:",
            "            tg.create_task(job(3))",
            "            tg.create_task(job(-1))",
            "    except* ValueError as eg:",
            "        print([str(e) for e in eg.exceptions])",
            "",
            "asyncio.run(main())",
          ],
          activeLines: [5, 13, 14],
          output: "['bad:-1']",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace event-loop task switching at `await`",
      steps: [
        {
          title: "`TaskGroup` registers coroutines on event loop",
          tag: "CONCEPT",
          explanation: ["`tg.create_task(...)` schedules both tasks right away without awaiting either one line-by-line yet."],
          code: [
            "async with asyncio.TaskGroup() as tg:",
            "    t1 = tg.create_task(job(2))",
            "    t2 = tg.create_task(job(5))",
            "print([t1.result(), t2.result()])",
          ],
          activeLines: [1, 2, 3],
          state: [
            { name: "ready queue", value: "[t1, t2]", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "queue",
            title: "Event Loop Ready Queue",
            caption: "create_task registers t1 and t2 in the event loop queue right away.",
            items: [
              { id: "t1", label: "t1: job(2)", sub: "ready", state: "active" },
              { id: "t2", label: "t2: job(5)", sub: "ready", state: "default" },
            ],
          },
        },
        {
          title: "`await` suspends Task 1 and yields loop to Task 2",
          tag: "TRACE",
          explanation: ["When `t1` hits `await asyncio.sleep(...)`, it registers a wake timer and returns control so `t2` starts right away."],
          code: [
            "async def job(n):",
            "    await asyncio.sleep(0.01)  # yields control",
            "    return n * 2",
          ],
          activeLines: [2],
          state: [
            { name: "t1", value: "suspended @ await" },
            { name: "t2", value: "running", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "queue",
            title: "Event Loop Ready Queue",
            caption: "Hitting await pauses t1 so the single-threaded event loop immediately runs t2.",
            items: [
              { id: "t1", label: "t1: job(2)", sub: "suspended @ await", state: "dim" },
              { id: "t2", label: "t2: job(5)", sub: "running on loop", state: "active" },
            ],
          },
        },
        {
          title: "Exiting `async with TaskGroup` awaits all tasks",
          tag: "CHECK",
          explanation: ["After exiting the `TaskGroup` block, every task has finished so `.result()` is ready."],
          code: [
            "async with asyncio.TaskGroup() as tg:",
            "    t1 = tg.create_task(job(2))",
            "    t2 = tg.create_task(job(5))",
            "print([t1.result(), t2.result()])",
          ],
          activeLines: [4],
          state: [
            { name: "results", value: "[4, 10]", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "queue",
            title: "Event Loop Ready Queue",
            caption: "TaskGroup awaits every registered task before exiting so [4, 10] are both ready.",
            items: [
              { id: "t1", label: "t1 -> 4", sub: "completed", state: "done" },
              { id: "t2", label: "t2 -> 10", sub: "completed", state: "done" },
            ],
          },
        },
        {
          title: "Keep strong references if using bare `create_task`",
          tag: "PITFALL",
          explanation: ["The event loop keeps only weak references to tasks outside `TaskGroup`, so unreferenced background tasks can be garbage collected mid-flight."],
          code: [
            "# BAD: asyncio.create_task(bg())",
            "# GOOD: use TaskGroup or store in bg_tasks set",
          ],
          activeLines: [2],
          state: [
            { name: "lifetime", value: "managed by TaskGroup", changed: true },
          ],
          visual: {
            kind: "dsa-structure",
            mode: "queue",
            title: "TaskGroup Strong References",
            caption: "TaskGroup retains strong references to t1 and t2 so the garbage collector never drops running tasks early.",
            items: [
              { id: "t1", label: "t1 (retained)", sub: "strong ref in tg", state: "active" },
              { id: "t2", label: "t2 (retained)", sub: "strong ref in tg", state: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting `await` on coroutine calls (`fetch()` instead of `await fetch()`)",
        detail: "Emits `RuntimeWarning: coroutine '...' was never awaited` and leaves you holding an unexecuted coroutine object.",
      },
      {
        title: "Calling blocking `time.sleep` or `requests.get` directly in `async def`",
        detail: "Use `await asyncio.to_thread(sync_fn, ...)` whenever an async library is unavailable.",
      },
    ],
    predictChecks: [
      {
        prompt: "How long does `await asyncio.sleep(0.2)` followed by `await asyncio.sleep(0.2)` take?",
        code: "await asyncio.sleep(0.2)\nawait asyncio.sleep(0.2)",
        options: [
          { id: "a", label: "~0.2s" },
          { id: "b", label: "~0.4s (sequential awaits)" },
          { id: "c", label: "0.0s" },
        ],
        correctId: "b",
        explanation: "Awaiting one coroutine after another runs sequentially unless wrapped in `TaskGroup` or `gather`.",
      },
      {
        prompt: "What happens if `requests.get(url)` runs directly inside an `async def` handler?",
        code: "async def handler(): return requests.get(url).text",
        options: [
          { id: "a", label: "Blocks the event loop thread until the HTTP call finishes" },
          { id: "b", label: "Auto-converts to async" },
          { id: "c", label: "Raises `TypeError`" },
        ],
        correctId: "a",
        explanation: "Offload synchronous I/O via `await asyncio.to_thread(requests.get, url)`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Concurrent `TaskGroup` doubling",
      tier: "Warmup",
      goal: "Write `double_all(nums)` using `asyncio.TaskGroup()` and `await asyncio.sleep(0.01)` returning `[n * 2 for n in nums]`.",
      constraints: ["Schedule all tasks concurrently inside one `TaskGroup`"],
      examples: [
        { input: "[1, 2, 3]", output: "[2, 4, 6]" },
        { input: "[]", output: "[]" },
      ],
      tasks: [
        "Create tasks via `tg.create_task` and collect `[t.result() for t in tasks]` after exit.",
      ],
      starterCode: "# Exercise M11.4 Warmup: TaskGroup concurrency\nimport asyncio\n\nasync def double_one(n: int) -> int:\n    await asyncio.sleep(0.01)\n    return n * 2\n\nasync def double_all(nums: list[int]) -> list[int]:\n    return []\n",
      expectedOutput: "[2, 4, 6]\n[]",
      hint: "Build `tasks = [tg.create_task(double_one(n)) for n in nums]` inside `async with asyncio.TaskGroup() as tg:`.",
      complexity: { time: "O(1) sleep wall", space: "O(n)" },
      solutionCode:
        "import asyncio\n\nasync def double_one(n: int) -> int:\n    await asyncio.sleep(0.01)\n    return n * 2\n\nasync def double_all(nums: list[int]) -> list[int]:\n    async with asyncio.TaskGroup() as tg:\n        tasks = [tg.create_task(double_one(n)) for n in nums]\n    return [t.result() for t in tasks]\n\nprint(asyncio.run(double_all([1, 2, 3])))\nprint(asyncio.run(double_all([])))",
    },
    practiceChallenges: [
      {
        title: "Core: Tolerate partial errors via `gather(..., return_exceptions=True)`",
        tier: "Core",
        goal: "Write `fetch_ok(vals)` awaiting `fetch(v)` (`ValueError` on `v == 0`, else `v * 10`) with `asyncio.gather(..., return_exceptions=True)` and returning non-exception values.",
        constraints: ["Filter out exceptions with `isinstance(r, Exception)`"],
        examples: [
          { input: "[1, 0, 3]", output: "[10, 30]" },
          { input: "[0]", output: "[]" },
        ],
        tasks: [
          "Call `asyncio.gather(*(fetch(v) for v in vals), return_exceptions=True)`.",
        ],
        starterCode: "# Exercise M11.4 Core: gather return_exceptions\nimport asyncio\n\nasync def fetch(v: int) -> int:\n    await asyncio.sleep(0.01)\n    if v == 0:\n        raise ValueError('zero')\n    return v * 10\n\nasync def fetch_ok(vals: list[int]) -> list[int]:\n    return []\n",
        expectedOutput: "[10, 30]\n[]",
        hint: "Keep `[r for r in results if not isinstance(r, Exception)]`.",
        complexity: { time: "O(1) wait", space: "O(n)" },
        solutionCode:
          "import asyncio\n\nasync def fetch(v: int) -> int:\n    await asyncio.sleep(0.01)\n    if v == 0:\n        raise ValueError('zero')\n    return v * 10\n\nasync def fetch_ok(vals: list[int]) -> list[int]:\n    out = await asyncio.gather(*(fetch(v) for v in vals), return_exceptions=True)\n    return [r for r in out if not isinstance(r, Exception)]\n\nprint(asyncio.run(fetch_ok([1, 0, 3])))\nprint(asyncio.run(fetch_ok([0])))",
      },
      {
        title: "Stretch: Offload sync calls with `asyncio.to_thread`",
        tier: "Stretch",
        goal: "Write `async def run_sync_batch(fn, items)` awaiting all `asyncio.to_thread(fn, item)` calls concurrently inside `TaskGroup`.",
        constraints: ["Keep `fn` blocking synchronously without freezing the event loop"],
        examples: [
          { input: "['a', 'b'] with blocking prefix", output: "['sync:a', 'sync:b']" },
          { input: "[]", output: "[]" },
        ],
        tasks: [
          "Create tasks via `tg.create_task(asyncio.to_thread(fn, x))`.",
        ],
        starterCode: "# Exercise M11.4 Stretch: bridge blocking functions via to_thread\nimport asyncio\nimport time\n\ndef blocking_tag(s: str) -> str:\n    time.sleep(0.01)\n    return f'sync:{s}'\n\nasync def run_sync_batch(fn, items: list[str]) -> list[str]:\n    return []\n",
        expectedOutput: "['sync:a', 'sync:b']\n[]",
        hint: "Schedule `asyncio.to_thread(fn, x)` inside `asyncio.TaskGroup`.",
        complexity: { time: "O(1) wait", space: "O(n)" },
        solutionCode:
          "import asyncio\nimport time\n\ndef blocking_tag(s: str) -> str:\n    time.sleep(0.01)\n    return f'sync:{s}'\n\nasync def run_sync_batch(fn, items: list[str]) -> list[str]:\n    async with asyncio.TaskGroup() as tg:\n        tasks = [tg.create_task(asyncio.to_thread(fn, x)) for x in items]\n    return [t.result() for t in tasks]\n\nprint(asyncio.run(run_sync_batch(blocking_tag, ['a', 'b'])))\nprint(asyncio.run(run_sync_batch(blocking_tag, [])))",
      },
    ],
  },

  "py-async-safety-testing": {
    lessonId: "py-async-safety-testing",
    subtitle: "Bound concurrency using `Semaphore` and `asyncio.Queue`, enforce `asyncio.timeout`, respect `CancelledError`, and test with `AsyncMock`.",
    intro: {
      heading: "Stop socket exhaustion, hung requests, and swallowed cancellations",
      explanation: [
        "Launching 5,000 tasks into `TaskGroup` at once opens 5,000 sockets, triggering rate-limit bans or OS file-descriptor exhaustion. Leaving out `asyncio.timeout` lets one hung remote server pin a coroutine forever, and catching `except BaseException:` traps `CancelledError` so timeouts break.",
        "Pairing `asyncio.Semaphore` with `asyncio.timeout` caps active requests and enforces deadlines, `except Exception:` lets `CancelledError` propagate, and `unittest.mock.AsyncMock` tests async flows without real network calls.",
      ],
      analogy: "A `Semaphore(10)` acts like a venue with 10 entry wristbands, while `asyncio.timeout(0.5)` acts like a timer that cancels any overdue order and returns the wristband to the next coroutine waiting in line.",
      realWorldUses: [
        "Capping concurrent outbound API sockets (`Semaphore(10)`) and applying request deadlines (`asyncio.timeout`)",
        "Unit-testing retry and timeout flows rapidly with `unittest.mock.AsyncMock`",
      ],
    },
    sections: [
      {
        heading: "`Semaphore`, `asyncio.timeout`, `Queue` backpressure, and `AsyncMock`",
        paragraphs: [
          "Wrap outbound async operations in `async with sem:` (`asyncio.Semaphore(5)`) to bound simultaneous sockets, and add `async with asyncio.timeout(0.5):` so hung awaitables cancel and raise `TimeoutError`.",
          "Never swallow `asyncio.CancelledError` in a bare `except BaseException:` block (`except Exception:` lets `CancelledError` propagate in Python 3.8+). For unit testing, `unittest.mock.AsyncMock` acts as an awaitable stub (`await stub(...)`).",
        ],
        code: [
          "import asyncio",
          "",
          "async def limited_fetch(sem: asyncio.Semaphore, delay: float) -> str:",
          "    async with sem:",
          "        try:",
          "            async with asyncio.timeout(0.08):",
          "                await asyncio.sleep(delay)",
          "                return \"ok\"",
          "        except TimeoutError:",
          "            return \"timed_out\"",
          "",
          "async def main() -> None:",
          "    sem = asyncio.Semaphore(2)",
          "    print(await asyncio.gather(limited_fetch(sem, 0.01), limited_fetch(sem, 0.3)))",
          "",
          "asyncio.run(main())",
        ],
        output: "['ok', 'timed_out']",
        visual: {
          kind: "async-timeline",
          caption: "Semaphore(2) concurrency caps and asyncio.timeout cancellation",
          scenarios: [
            {
              label: "Semaphore(2) with 3 Tasks",
              gilNote: "Max 2 concurrent slots",
              totalMs: 220,
              summary: "Tasks A and B hold slots 1-2; Task C suspends until Task A finishes.",
              lanes: [
                {
                  name: "Task A",
                  segments: [{ startMs: 0, endMs: 100, state: "waiting", label: "slot 1 active" }],
                },
                {
                  name: "Task B",
                  segments: [{ startMs: 0, endMs: 120, state: "waiting", label: "slot 2 active" }],
                },
                {
                  name: "Task C",
                  segments: [
                    { startMs: 0, endMs: 100, state: "blocked", label: "awaits Semaphore" },
                    { startMs: 100, endMs: 200, state: "waiting", label: "slot 1 active" },
                  ],
                },
              ],
            },
            {
              label: "asyncio.timeout(100ms) Fires",
              gilNote: "Cancelled -> TimeoutError",
              totalMs: 220,
              summary: "Fast Task finishes at 60 ms; Hung Task cancels at 100 ms with TimeoutError.",
              lanes: [
                {
                  name: "Fast Task",
                  segments: [
                    { startMs: 0, endMs: 60, state: "waiting", label: "await 60ms" },
                    { startMs: 60, endMs: 80, state: "running", label: "ok" },
                  ],
                },
                {
                  name: "Hung Task",
                  segments: [
                    { startMs: 0, endMs: 100, state: "waiting", label: "await hung" },
                    { startMs: 100, endMs: 130, state: "cancelled", label: "TimeoutError" },
                  ],
                },
              ],
            },
          ],
        },
        table: {
          caption: "Async safety & testing tools",
          headers: ["Tool", "Purpose", "Guard / Note"],
          rows: [
            ["`asyncio.Semaphore(n)`", "Limits active in-flight coroutines", "Stops socket exhaustion & rate-limit bans"],
            ["`asyncio.timeout(sec)`", "Cancels slow calls after deadline (`3.11+`)", "Raises `TimeoutError`"],
            ["`asyncio.Queue(maxsize=n)`", "Applies backpressure when full", "Always pair `get()` with `task_done()`"],
            ["`AsyncMock` + `pytest-asyncio`", "Awaitable fake stubs for unit tests (`pip install pytest-asyncio`)", "In `pyproject.toml`: `[tool.pytest.ini_options]` -> `asyncio_mode = \"auto\"`"],
          ],
        },
      },
      {
        heading: "Broken vs working: swallowed `CancelledError` vs `AsyncMock` deadline test",
        paragraphs: [
          "Catching `except BaseException:` (or bare `except:`) inside a coroutine catches `asyncio.CancelledError`, preventing `asyncio.timeout` and `TaskGroup` from unwinding cancelled tasks. Catch `except Exception:` instead.",
          "In unit tests, pass an `AsyncMock(return_value='200 OK')` as the client function to verify call counts (`stub.await_count`) and timeout paths in milliseconds.",
        ],
        code: [
          "import asyncio",
          "from unittest.mock import AsyncMock",
          "",
          "# Broken handler: except BaseException swallows CancelledError!",
          "# Working test with AsyncMock:",
          "async def fetch_ok(client, path: str) -> str:",
          "    async with asyncio.timeout(0.05):",
          "        return await client(path)",
          "",
          "async def main() -> None:",
          "    stub = AsyncMock(return_value=\"200 OK\")",
          "    print(await fetch_ok(stub, \"/health\"), stub.await_count)",
          "",
          "asyncio.run(main())",
        ],
        output: "200 OK 1",
      },
    ],
    guidedBuildUp: {
      title: "Add Concurrency Caps, Deadlines, and `AsyncMock` Tests",
      steps: [
        {
          label: "Step 1: Cap concurrent coroutines with `Semaphore`",
          explanation: "Wrap the async work inside `async with sem:` so at most 2 coroutines enter the active section at once.",
          code: [
            "import asyncio",
            "",
            "async def limited_fetch(sem: asyncio.Semaphore, delay: float) -> str:",
            "    async with sem:",
            "        await asyncio.sleep(delay)",
            "        return \"ok\"",
            "",
            "sem = asyncio.Semaphore(2)",
            "print(asyncio.run(limited_fetch(sem, 0.01)))",
          ],
          activeLines: [4, 5, 8],
          output: "ok",
        },
        {
          label: "Step 2: Enforce a deadline inside `sem` with `asyncio.timeout`",
          explanation: "Place `async with asyncio.timeout(0.08):` inside `async with sem:` so slow awaits cancel with `TimeoutError` and still release the permit.",
          code: [
            "import asyncio",
            "",
            "async def limited_fetch(sem: asyncio.Semaphore, delay: float) -> str:",
            "    async with sem:",
            "        try:",
            "            async with asyncio.timeout(0.08):",
            "                await asyncio.sleep(delay)",
            "                return \"ok\"",
            "        except TimeoutError:",
            "            return \"timed_out\"",
            "",
            "async def main():",
            "    sem = asyncio.Semaphore(2)",
            "    print(await asyncio.gather(limited_fetch(sem, 0.01), limited_fetch(sem, 0.3)))",
            "asyncio.run(main())",
          ],
          activeLines: [6, 9, 10],
          output: "['ok', 'timed_out']",
        },
        {
          label: "Step 3: Stub the async client with `AsyncMock` in tests",
          explanation: "Pass `unittest.mock.AsyncMock` as the async dependency to test happy paths and call counts without live network sockets.",
          code: [
            "import asyncio",
            "from unittest.mock import AsyncMock",
            "",
            "async def fetch_with_deadline(client, path: str, limit: float = 0.05) -> str:",
            "    async with asyncio.timeout(limit):",
            "        return await client(path)",
            "",
            "async def check() -> None:",
            "    stub = AsyncMock(return_value=\"200 OK\")",
            "    res = await fetch_with_deadline(stub, \"/health\")",
            "    print(res, stub.await_count)",
            "asyncio.run(check())",
          ],
          activeLines: [9, 10, 11],
          output: "200 OK 1",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `Semaphore` queuing and `asyncio.timeout` cancellation",
      steps: [
        {
          title: "`Semaphore(2)` permits first two tasks immediately",
          tag: "CONCEPT",
          explanation: ["Tasks A and B decrement permits (`2 -> 1 -> 0`) and enter without waiting; Task C suspends politely."],
          code: [
            "sem = asyncio.Semaphore(2)",
            "async with sem:",
            "    await call_api()",
          ],
          activeLines: [1, 2],
          state: [
            { name: "permits left", value: "0", changed: true },
            { name: "waiting", value: "[Task C]" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Semaphore(2) gives permits to Task A and Task B while parking Task C in line.",
            trays: [
              {
                label: "Tasks",
                cells: [
                  { id: "ta", value: "Task A (running)", index: 0, state: "active" },
                  { id: "tb", value: "Task B (running)", index: 1, state: "active" },
                  { id: "tc", value: "Task C (queued)", index: 2, state: "pivot" },
                ],
                highlightRange: [0, 1],
              },
            ],
          },
        },
        {
          title: "`asyncio.timeout(0.08)` arms deadline cancellation",
          tag: "TRACE",
          explanation: ["If `await sleep(0.3)` exceeds `0.08s`, the event loop injects `CancelledError`, which `asyncio.timeout` turns into `TimeoutError`."],
          code: [
            "async with asyncio.timeout(0.08):",
            "    await asyncio.sleep(0.3)",
          ],
          activeLines: [1, 2],
          state: [
            { name: "after 0.08s", value: "TimeoutError raised", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Deadline cancels Task A's suspended sleep at 0.08s and turns cancellation into TimeoutError.",
            trays: [
              {
                label: "Tasks",
                cells: [
                  { id: "ta", value: "Task A (TimeoutError @ 0.08s)", index: 0, state: "pivot" },
                  { id: "tb", value: "Task B (running)", index: 1, state: "active" },
                  { id: "tc", value: "Task C (queued)", index: 2, state: "dim" },
                ],
                pointers: [{ index: 0, label: "deadline expired", tone: "coral" }],
              },
            ],
          },
        },
        {
          title: "`finally` releases semaphore slot even on timeout",
          tag: "CHECK",
          explanation: ["Exiting `async with sem:` restores the permit automatically so queued Task C immediately proceeds."],
          code: [
            "async with sem:",
            "    try:",
            "        async with asyncio.timeout(0.08): ...",
            "    except TimeoutError:",
            "        return 'timed_out'",
          ],
          activeLines: [1, 5],
          state: [
            { name: "permits restored", value: "1 -> wakes Task C", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Leaving async with sem restores a permit so Task C leaves the queue and runs.",
            trays: [
              {
                label: "Tasks",
                cells: [
                  { id: "ta", value: "Task A (done)", index: 0, state: "done" },
                  { id: "tb", value: "Task B (running)", index: 1, state: "active" },
                  { id: "tc", value: "Task C (woken!)", index: 2, state: "active" },
                ],
              },
            ],
          },
        },
        {
          title: "Never swallow `CancelledError`",
          tag: "PITFALL",
          explanation: ["Using `except Exception:` lets `CancelledError` propagate because `CancelledError` inherits from `BaseException`."],
          code: [
            "try: await work()",
            "except Exception: log()  # lets CancelledError propagate!",
          ],
          activeLines: [2],
          state: [
            { name: "CancelledError", value: "propagates", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Because CancelledError inherits from BaseException, except Exception lets cancellation bubble up without being caught.",
            trays: [
              {
                label: "Tasks",
                cells: [
                  { id: "ta", value: "Task A (TimeoutError caught)", index: 0, state: "done" },
                  { id: "tb", value: "Task B (CancelledError unwinds)", index: 1, state: "pivot" },
                  { id: "tc", value: "Task C (done)", index: 2, state: "done" },
                ],
                pointers: [{ index: 1, label: "propagates", tone: "coral" }],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Catching `BaseException` breaks `TaskGroup` and timeouts",
        detail: "Use `except Exception:` (or re-raise `CancelledError` inside `except BaseException:`) so cooperative cancellation still unwinds.",
      },
      {
        title: "Putting `asyncio.timeout` OUTSIDE `async with sem:` vs INSIDE",
        detail: "Outside includes semaphore queue wait time in the deadline; inside measures only the active request.",
      },
    ],
    predictChecks: [
      {
        prompt: "If 20 coroutines run under `sem = asyncio.Semaphore(3)`, how many enter `async with sem:` concurrently?",
        code: "sem = asyncio.Semaphore(3)\nasync with sem: await call_api()",
        options: [
          { id: "a", label: "At most 3; the rest await their turn without blocking the event loop" },
          { id: "b", label: "All 20 run; the 4th raises `ValueError`" },
          { id: "c", label: "Spawns 3 processes" },
        ],
        correctId: "a",
        explanation: "`Semaphore(3)` limits active entries to 3 and suspends extra callers asynchronously.",
      },
      {
        prompt: "Why does `except Exception:` let `asyncio.CancelledError` propagate?",
        code: "except Exception:\n    handle()",
        options: [
          { id: "a", label: "`CancelledError` subclasses `BaseException` rather than `Exception`" },
          { id: "b", label: "`asyncio` ignores `try/except`" },
          { id: "c", label: "`CancelledError` is a `SyntaxError`" },
        ],
        correctId: "a",
        explanation: "Inheriting from `BaseException` keeps cancellation intact through normal domain error handlers.",
      },
    ],
    practiceTask: {
      title: "Warmup: Rate-limited `safe_fetch` with `Semaphore` and `timeout`",
      tier: "Warmup",
      goal: "Write `safe_fetch(sem, delay)` using `async with sem:` and `asyncio.timeout(0.08)` returning `'ok'` or `'timed_out'`.",
      constraints: ["Always release the `Semaphore` slot on timeout"],
      examples: [
        { input: "delay = 0.01", output: "ok" },
        { input: "delay = 0.25", output: "timed_out" },
      ],
      tasks: [
        "Nest `try: async with asyncio.timeout(0.08): ... except TimeoutError:` inside `async with sem:`.",
      ],
      starterCode: "# Exercise M11.5 Warmup: Semaphore + asyncio.timeout\nimport asyncio\n\nasync def safe_fetch(sem: asyncio.Semaphore, delay: float) -> str:\n    return ''\n",
      expectedOutput: "ok\ntimed_out",
      hint: "Wrap `await asyncio.sleep(delay)` in `async with asyncio.timeout(0.08):`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "import asyncio\n\nasync def safe_fetch(sem: asyncio.Semaphore, delay: float) -> str:\n    async with sem:\n        try:\n            async with asyncio.timeout(0.08):\n                await asyncio.sleep(delay)\n                return 'ok'\n        except TimeoutError:\n            return 'timed_out'\n\nsem = asyncio.Semaphore(2)\nprint(asyncio.run(safe_fetch(sem, 0.01)))\nprint(asyncio.run(safe_fetch(sem, 0.25)))",
    },
    practiceChallenges: [
      {
        title: "Core: Bounded `asyncio.Queue` producer-consumer pipeline",
        tier: "Core",
        goal: "Run `pipeline(urls)` connecting an async producer and 2 async `TaskGroup` workers via `asyncio.Queue(maxsize=2)` and `None` sentinels.",
        constraints: ["Call `q.task_done()` in `finally:` and `await q.join()`"],
        examples: [
          { input: "['/a', '/b', '/c']", output: "['ok:/a', 'ok:/b', 'ok:/c']" },
          { input: "[]", output: "[]" },
        ],
        tasks: [
          "Use `try/finally: q.task_done()` in workers and return `sorted(out)`.",
        ],
        starterCode: "# Exercise M11.5 Core: bounded asyncio.Queue pipeline\nimport asyncio\n\nasync def pipeline(urls: list[str]) -> list[str]:\n    return []\n",
        expectedOutput: "['ok:/a', 'ok:/b', 'ok:/c']\n[]",
        hint: "Push each URL then 2 `None` sentinels into `q`, run 2 workers inside `TaskGroup`, and await `q.join()`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "import asyncio\n\nasync def pipeline(urls: list[str]) -> list[str]:\n    q: asyncio.Queue[str | None] = asyncio.Queue(maxsize=2)\n    out: list[str] = []\n    async def prod() -> None:\n        for u in urls:\n            await q.put(u)\n        for _ in range(2):\n            await q.put(None)\n    async def work() -> None:\n        while True:\n            u = await q.get()\n            try:\n                if u is None:\n                    return\n                await asyncio.sleep(0.01)\n                out.append(f'ok:{u}')\n            finally:\n                q.task_done()\n    async with asyncio.TaskGroup() as tg:\n        tg.create_task(prod())\n        tg.create_task(work())\n        tg.create_task(work())\n    await q.join()\n    return sorted(out)\n\nprint(asyncio.run(pipeline(['/a', '/b', '/c'])))\nprint(asyncio.run(pipeline([])))",
      },
      {
        title: "Stretch: Stub an async client using `AsyncMock`",
        tier: "Stretch",
        goal: "Write `fetch_with_deadline(client, path, limit=0.05)` returning `await client(path)` inside `asyncio.timeout(limit)`, verified against both an `AsyncMock` stub and a slow coroutine timing out.",
        constraints: ["Inspect `stub.await_count == 1`"],
        examples: [
          { input: "AsyncMock returning '200 OK'", output: "200 OK 1" },
          { input: "slow stub sleeping 0.2s", output: "timeout" },
        ],
        tasks: [
          "Return `await client(path)` inside `async with asyncio.timeout(limit):`.",
        ],
        starterCode: "# Exercise M11.5 Stretch: AsyncMock + timeout check\nimport asyncio\nfrom unittest.mock import AsyncMock\n\nasync def fetch_with_deadline(client, path: str, limit: float = 0.05) -> str:\n    return ''\n",
        expectedOutput: "200 OK 1\ntimeout",
        hint: "Wrap `await client(path)` in `async with asyncio.timeout(limit):` and catch `TimeoutError` in the test check.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "import asyncio\nfrom unittest.mock import AsyncMock\n\nasync def fetch_with_deadline(client, path: str, limit: float = 0.05) -> str:\n    async with asyncio.timeout(limit):\n        return await client(path)\n\nasync def check():\n    stub = AsyncMock(return_value='200 OK')\n    res = await fetch_with_deadline(stub, '/health')\n    print(res, stub.await_count)\n    async def slow(_p: str) -> str:\n        await asyncio.sleep(0.2)\n        return 'late'\n    try:\n        await fetch_with_deadline(slow, '/slow', limit=0.02)\n    except TimeoutError:\n        print('timeout')\n\nasyncio.run(check())",
      },
    ],
  },
};

export const m11Quiz: ModuleQuiz = {
  moduleId: "py-m11",
  title: "Module 11 Quiz: Concurrency & Async Python",
  description: "Verify GIL behavior, worker pools, locks and queues, TaskGroup concurrency, timeouts, and AsyncMock testing.",
  questions: [
    {
      id: "m11-q1",
      prompt: "Why does CPU-heavy pure Python arithmetic gain little speedup from `ThreadPoolExecutor` in standard CPython?",
      options: [
        { id: "a", label: "Python threads cannot return ints" },
        { id: "b", label: "`ThreadPoolExecutor` only accepts `async def`" },
        { id: "c", label: "The GIL allows only one thread at a time to execute Python bytecode" },
        { id: "d", label: "Threads always block on CPU loops forever" },
      ],
      correctId: "c",
      explanation: "Use `ProcessPoolExecutor` for multi-core pure-Python CPU computation.",
      lessonRefId: "py-concurrency-gil",
    },
    {
      id: "m11-q2",
      prompt: "When does CPython release the GIL inside a worker thread?",
      options: [
        { id: "a", label: "During blocking I/O waits (network sockets, disk reads, `time.sleep`)" },
        { id: "b", label: "Never until the process exits" },
        { id: "c", label: "Only inside `finally:`" },
        { id: "d", label: "After every integer addition" },
      ],
      correctId: "a",
      explanation: "Because threads release the GIL on blocking I/O, threads overlap network and file waits.",
      lessonRefId: "py-concurrency-gil",
    },
    {
      id: "m11-q3",
      prompt: "What happens if `ProcessPoolExecutor` runs at module top level without `if __name__ == '__main__':` on Windows?",
      options: [
        { id: "a", label: "Runs twice as fast" },
        { id: "b", label: "Falls back to `asyncio`" },
        { id: "c", label: "Returns `[]`" },
        { id: "d", label: "Child workers re-import the file and recursively spawn pools until `RuntimeError`" },
      ],
      correctId: "d",
      explanation: "On `spawn` platforms, always guard multiprocessing entrypoints under `if __name__ == '__main__':`.",
      lessonRefId: "py-thread-process-pools",
    },
    {
      id: "m11-q4",
      prompt: "How does `as_completed(futures)` differ from `pool.map(fn, items)`?",
      options: [
        { id: "a", label: "`as_completed` runs tasks sequentially" },
        { id: "b", label: "`as_completed` yields futures as soon as each finishes rather than strict input order" },
        { id: "c", label: "`pool.map` returns coroutines" },
        { id: "d", label: "They behave identically" },
      ],
      correctId: "b",
      explanation: "`pool.map` preserves input sequence order; `as_completed` surfaces fastest results immediately.",
      lessonRefId: "py-thread-process-pools",
    },
    {
      id: "m11-q5",
      prompt: "Why can `shared_count += 1` across threads still lose counts under the GIL?",
      options: [
        { id: "a", label: "Python skips loops in threads" },
        { id: "b", label: "Ints are mutable" },
        { id: "c", label: "`+= 1` spans separate read, add, and write bytecode steps that interleave" },
        { id: "d", label: "`global` disables locking" },
      ],
      correctId: "c",
      explanation: "Wrap compound shared updates in `with threading.Lock():`.",
      lessonRefId: "py-locks-queues",
    },
    {
      id: "m11-q6",
      prompt: "Why place `jobs.task_done()` inside `finally:` in a `queue.Queue` worker exiting on `None`?",
      options: [
        { id: "a", label: "So `jobs.join()` unblocks even when a worker returns on the `None` sentinel" },
        { id: "b", label: "To double worker count" },
        { id: "c", label: "To clear `lock`" },
        { id: "d", label: "Otherwise `jobs.get()` returns `None` forever" },
      ],
      correctId: "a",
      explanation: "Every `get()` must balance with `task_done()` so `join()` knows all queued entries finished.",
      lessonRefId: "py-locks-queues",
    },
    {
      id: "m11-q7",
      prompt: "What happens if an `async def` task calls `time.sleep(2)` instead of `await asyncio.sleep(2)`?",
      options: [
        { id: "a", label: "Converts automatically" },
        { id: "b", label: "Freezes the single event loop thread, blocking all other coroutines for 2 seconds" },
        { id: "c", label: "Spawns a thread pool" },
        { id: "d", label: "Raises `SyntaxError`" },
      ],
      correctId: "b",
      explanation: "Never call blocking sync sleeps or I/O directly inside an `async def`; use `asyncio.to_thread` when bridging sync APIs.",
      lessonRefId: "py-asyncio-basics",
    },
    {
      id: "m11-q8",
      prompt: "What happens when calling an `async def` function without `await` or `asyncio.run`?",
      options: [
        { id: "a", label: "Runs in background automatically" },
        { id: "b", label: "Prints result immediately" },
        { id: "c", label: "Raises `ValueError`" },
        { id: "d", label: "Returns an unstarted coroutine object without executing its body" },
      ],
      correctId: "d",
      explanation: "Coroutines only execute when awaited or scheduled on an event loop.",
      lessonRefId: "py-asyncio-basics",
    },
    {
      id: "m11-q9",
      prompt: "What does `async with asyncio.TaskGroup() as tg:` do if one task raises `ValueError`?",
      options: [
        { id: "a", label: "Cancels siblings, waits for cleanup, and surfaces an `ExceptionGroup`" },
        { id: "b", label: "Kills Python immediately" },
        { id: "c", label: "Retries the failing task" },
        { id: "d", label: "Ignores the failure silently" },
      ],
      correctId: "a",
      explanation: "`TaskGroup` enforces structured concurrency.",
      lessonRefId: "py-asyncio-basics",
    },
    {
      id: "m11-q10",
      prompt: "Why wrap `await fetch(url)` inside `async with asyncio.Semaphore(10):` when processing 5,000 URLs?",
      options: [
        { id: "a", label: "Runs tasks across 10 CPU cores" },
        { id: "b", label: "Replaces `asyncio.timeout`" },
        { id: "c", label: "Caps active sockets at 10 to avoid exhausting ports or triggering rate limits" },
        { id: "d", label: "Caches responses automatically" },
      ],
      correctId: "c",
      explanation: "`Semaphore` bounds active concurrency while keeping tasks cooperative.",
      lessonRefId: "py-async-safety-testing",
    },
    {
      id: "m11-q11",
      prompt: "What exception escapes `async with asyncio.timeout(0.5): await asyncio.sleep(2)`?",
      options: [
        { id: "a", label: "`KeyboardInterrupt`" },
        { id: "b", label: "`StopIteration`" },
        { id: "c", label: "Returns `None`" },
        { id: "d", label: "`TimeoutError`" },
      ],
      correctId: "d",
      explanation: "`asyncio.timeout` cancels the inner call and raises `TimeoutError` outside the block.",
      lessonRefId: "py-async-safety-testing",
    },
    {
      id: "m11-q12",
      prompt: "Why does `except Exception:` let `asyncio.CancelledError` still cancel a task without swallowing it?",
      options: [
        { id: "a", label: "It disables `try/except`" },
        { id: "b", label: "`CancelledError` inherits from `BaseException`, not `Exception`" },
        { id: "c", label: "`CancelledError` is a `SyntaxError`" },
        { id: "d", label: "Python skips exceptions in coroutines" },
      ],
      correctId: "b",
      explanation: "Keep using `except Exception:` (or re-raise `CancelledError`) so task cancellation unwinds properly.",
      lessonRefId: "py-async-safety-testing",
    },
  ],
};

export const m11PracticeSet: ModulePracticeSet = {
  moduleId: "py-m11",
  title: "Module 11 Mixed Concurrency Practice",
  description: "Apply pools, thread locks, TaskGroup, Semaphore, and timeouts across four practical problems.",
  problems: [
    {
      id: "m11-p1",
      title: "Thread-safe batch aggregator with `Lock`",
      tier: "Warmup",
      patternHint: "Compute pure results inside worker threads, then merge under a short `with lock:`.",
      lessonRefId: "py-locks-queues",
      goal: "Write `parallel_sum(chunks)` summing each integer list in `ThreadPoolExecutor(max_workers=3)` and merging into shared `total` under `threading.Lock`.",
      constraints: ["Acquire lock only once per chunk, not per number"],
      examples: [
        { input: "[[1, 2], [3, 4, 5]]", output: "15" },
        { input: "[[], [10]]", output: "10" },
      ],
      tasks: [
        "Compute `sub = sum(chunk)` outside lock, then update shared sum inside `with lock:`.",
      ],
      starterCode: "# Practice M11.1: parallel chunk sum with Lock\nfrom concurrent.futures import ThreadPoolExecutor\nimport threading\n\ndef parallel_sum(chunks: list[list[int]]) -> int:\n    return 0\n",
      expectedOutput: "15\n10",
      hint: "Compute `sub = sum(chunk)` first before acquiring `lock`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "from concurrent.futures import ThreadPoolExecutor\nimport threading\n\ndef parallel_sum(chunks: list[list[int]]) -> int:\n    lock = threading.Lock()\n    state = {'total': 0}\n    def work(chunk: list[int]) -> None:\n        sub = sum(chunk)\n        with lock:\n            state['total'] += sub\n    with ThreadPoolExecutor(max_workers=3) as pool:\n        list(pool.map(work, chunks))\n    return state['total']\n\nprint(parallel_sum([[1, 2], [3, 4, 5]]))\nprint(parallel_sum([[], [10]]))",
    },
    {
      id: "m11-p2",
      title: "Async fan-out with `Semaphore` and `timeout`",
      tier: "Core",
      patternHint: "Place `asyncio.timeout` inside `async with sem:` so permits always release.",
      lessonRefId: "py-async-safety-testing",
      goal: "Write `run_bounded(delays, max_conc=2, limit=0.06)` running sleeps via `TaskGroup`, `Semaphore`, and `asyncio.timeout`, returning `['ok' | 'timeout', ...]`.",
      constraints: ["Never let a timeout crash sibling tasks inside `TaskGroup`"],
      examples: [
        { input: "[0.01, 0.2, 0.01]", output: "['ok', 'timeout', 'ok']" },
        { input: "[0.01]", output: "['ok']" },
      ],
      tasks: [
        "Catch `TimeoutError` inside each task returning `'timeout'`.",
      ],
      starterCode: "# Practice M11.2: Semaphore + TaskGroup + timeout\nimport asyncio\n\nasync def run_bounded(delays: list[float], max_conc: int = 2, limit: float = 0.06) -> list[str]:\n    return []\n",
      expectedOutput: "['ok', 'timeout', 'ok']\n['ok']",
      hint: "Catch `TimeoutError` per task so `TaskGroup` receives strings instead of raising an `ExceptionGroup`.",
      complexity: { time: "O(limit)", space: "O(n)" },
      solutionCode:
        "import asyncio\n\nasync def run_bounded(delays: list[float], max_conc: int = 2, limit: float = 0.06) -> list[str]:\n    sem = asyncio.Semaphore(max_conc)\n    async def one(d: float) -> str:\n        async with sem:\n            try:\n                async with asyncio.timeout(limit):\n                    await asyncio.sleep(d)\n                    return 'ok'\n            except TimeoutError:\n                return 'timeout'\n    async with asyncio.TaskGroup() as tg:\n        tasks = [tg.create_task(one(d)) for d in delays]\n    return [t.result() for t in tasks]\n\nprint(asyncio.run(run_bounded([0.01, 0.2, 0.01])))\nprint(asyncio.run(run_bounded([0.01])))",
    },
    {
      id: "m11-p3",
      title: "Handle selective failures with `except*`",
      tier: "Core",
      patternHint: "Use `TaskGroup` + `except* ValueError as eg:` to gather matching errors.",
      lessonRefId: "py-asyncio-basics",
      goal: "Write `collect_errors(vals)` running `check_val(v)` (`ValueError` on negatives) inside `TaskGroup`, catching `except* ValueError as eg:` and returning sorted error messages.",
      constraints: ["Use Python 3.11+ `except* ValueError`"],
      examples: [
        { input: "[1, -2, -5]", output: "['bad:-2', 'bad:-5']" },
        { input: "[1, 2]", output: "[]" },
      ],
      tasks: [
        "Raise `ValueError(f'bad:{v}')` for `v < 0` and collect `sorted(str(e) for e in eg.exceptions)`.",
      ],
      starterCode: "# Practice M11.3: ExceptionGroup handling with except*\nimport asyncio\n\nasync def collect_errors(vals: list[int]) -> list[str]:\n    return []\n",
      expectedOutput: "['bad:-2', 'bad:-5']\n[]",
      hint: "Wrap `async with asyncio.TaskGroup() as tg:` inside `try ... except* ValueError as eg:`.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "import asyncio\n\nasync def check_val(v: int) -> int:\n    await asyncio.sleep(0.01)\n    if v < 0:\n        raise ValueError(f'bad:{v}')\n    return v\n\nasync def collect_errors(vals: list[int]) -> list[str]:\n    errs: list[str] = []\n    try:\n        async with asyncio.TaskGroup() as tg:\n            for v in vals:\n                tg.create_task(check_val(v))\n    except* ValueError as eg:\n        errs = sorted(str(e) for e in eg.exceptions)\n    return errs\n\nprint(asyncio.run(collect_errors([1, -2, -5])))\nprint(asyncio.run(collect_errors([1, 2])))",
    },
    {
      id: "m11-p4",
      title: "Bridge blocking sync SDK with `to_thread` + `AsyncMock` fallback",
      tier: "Stretch",
      patternHint: "Run sync functions inside `asyncio.to_thread` and await async clients (using `unittest.mock.AsyncMock` as an awaitable test stub, covered in Module 12).",
      lessonRefId: "py-thread-process-pools",
      goal: "Write `load_both(sync_fn, async_fn, key)` executing `asyncio.to_thread(sync_fn, key)` and `async_fn(key)` concurrently inside `TaskGroup` and returning `(sync_res, async_res)`.",
      constraints: ["Run both concurrently inside `TaskGroup`"],
      examples: [
        { input: "key='cfg'", output: "('sync:cfg', 'async:cfg')" },
        { input: "key='db'", output: "('sync:db', 'async:db')" },
      ],
      tasks: [
        "Create one task with `asyncio.to_thread(sync_fn, key)` and one with `async_fn(key)`.",
      ],
      starterCode: "# Practice M11.4: combine sync to_thread with AsyncMock\nimport asyncio\nfrom unittest.mock import AsyncMock\n\nasync def load_both(sync_fn, async_fn, key: str) -> tuple[str, str]:\n    return ('', '')\n",
      expectedOutput: "('sync:cfg', 'async:cfg')\n('sync:db', 'async:db')",
      hint: "Use `tg.create_task(asyncio.to_thread(sync_fn, key))` alongside `tg.create_task(async_fn(key))`.",
      complexity: { time: "O(1) wait", space: "O(1)" },
      solutionCode:
        "import asyncio\nfrom unittest.mock import AsyncMock\n\nasync def load_both(sync_fn, async_fn, key: str) -> tuple[str, str]:\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(asyncio.to_thread(sync_fn, key))\n        t2 = tg.create_task(async_fn(key))\n    return (t1.result(), t2.result())\n\nprint(asyncio.run(load_both(lambda k: f'sync:{k}', AsyncMock(return_value='async:cfg'), 'cfg')))\nprint(asyncio.run(load_both(lambda k: f'sync:{k}', AsyncMock(return_value='async:db'), 'db')))",
    },
  ],
};
