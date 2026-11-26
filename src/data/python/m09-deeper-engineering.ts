import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m09Lessons: Record<string, LessonContent> = {
  "py-comprehensions": {
    lessonId: "py-comprehensions",
    subtitle: "Transform and filter sequences into lists, dictionaries, and sets using readable comprehensions.",
    intro: {
      heading: "Build collections declaratively in one expression",
      explanation: [
        "Allocating an empty list, writing a `for` loop, checking an `if` branch, and calling `.append()` repeats the same four lines everywhere. Worse, cramming `if/else` in the wrong spot inside a comprehension causes a `SyntaxError`, and nesting three `for` clauses creates an unreadable puzzle.",
        "Comprehensions pack output expression, loop source, and optional filter into one expression for lists (`[...]`), dicts (`{k: v ...}`), and sets (`{x ...}`), while keeping multi-step mutations in normal `for` loops.",
      ],
      analogy: "Sorting mail into labeled trays in one pass: every envelope gets checked at the door (`if` filter) or stamped (`a if c else b` transform) before landing in the output tray.",
      realWorldUses: [
        "Normalizing and filtering API records or tag lists before saving",
        "Indexing lookup dictionaries (`{row['id']: row for row in rows}`) and deduplicating domains with set comprehensions",
      ],
    },
    sections: [
      {
        heading: "List, dict, and set comprehensions",
        paragraphs: [
          "Put `if cond` at the end to skip non-matching items (`[n for n in nums if n > 0]`). Put `a if cond else b` at the front to map every item to one of two outputs.",
          "Stick to a plain `for` loop when a step mutates external state, needs `try/except`, or nests more than two clauses.",
        ],
        code: [
          "nums = [1, 2, 3, 4, 5]",
          "even_sq = [n * n for n in nums if n % 2 == 0]",
          "labels = [\"even\" if n % 2 == 0 else \"odd\" for n in nums[:3]]",
          "lengths = {w: len(w) for w in [\"Ada\", \"Sam\"]}",
          "domains = {e.split(\"@\")[1] for e in [\"a@x.io\", \"b@x.io\"]}",
          "print(even_sq, labels, lengths, domains)",
        ],
        output: "[4, 16] ['odd', 'even', 'odd'] {'Ada': 3, 'Sam': 3} {'x.io'}",
        table: {
          caption: "Comprehension forms",
          headers: ["Shape", "Produces", "Note"],
          rows: [
            ["`[expr for x in src if cond]`", "`list`", "Filter goes at the end"],
            ["`[a if c else b for x in src]`", "`list`", "Transform ternary goes before `for`"],
            ["`{k: v for x in src}`", "`dict`", "Key-value mapping"],
            ["`{expr for x in src}`", "`set`", "Unique deduplicated items"],
          ],
        },
      },
      {
        heading: "Working vs broken comprehensions",
        paragraphs: [
          "Placing `else` after `for` triggers a `SyntaxError` because trailing `if` only filters. Value-choosing `a if cond else b` always sits before `for`.",
          "Avoid side-effect comprehensions like `[print(x) for x in items]`: they allocate a throwaway list of `None` values just to run a loop.",
        ],
        code: [
          "nums = [-2, 3, -1, 4]",
          "",
          "# BUG: trailing else raises SyntaxError",
          "# clamped = [n for n in nums if n > 0 else 0]",
          "",
          "# FIX: ternary sits before 'for' to keep all items",
          "clamped = [n if n > 0 else 0 for n in nums]",
          "",
          "# BUG: allocates [None, None, None, None] as a side effect",
          "# [print(n) for n in clamped]",
          "",
          "# FIX: use a plain for loop for side effects",
          "print(clamped)",
        ],
        output: "[0, 3, 0, 4]",
        callout: {
          kind: "RULE OF THUMB",
          text: "If a comprehension wraps past one readable line or nests more than two `for` clauses, rewrite it as a `for` loop.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Filtered and Deduplicated Comprehension Step by Step",
      steps: [
        {
          label: "Step 1: Transform every item",
          explanation: "Start with `[n * n for n in nums]` to square each element without creating an empty list and calling `.append()`.",
          code: [
            "nums = [1, 2, 3, 4]",
            "squares = [n * n for n in nums]",
            "print(squares)",
          ],
          activeLines: [2],
          output: "[1, 4, 9, 16]",
        },
        {
          label: "Step 2: Add a trailing filter",
          explanation: "Append `if n % 2 == 0` after `nums` so odd numbers are skipped before `n * n` runs.",
          code: [
            "nums = [1, 2, 3, 4]",
            "even_sq = [n * n for n in nums if n % 2 == 0]",
            "print(even_sq)",
          ],
          activeLines: [2],
          output: "[4, 16]",
        },
        {
          label: "Step 3: Deduplicate with `{...}` and index with `{k: v}`",
          explanation: "Swap brackets for `{...}` to collapse duplicate hosts, then build a dictionary mapping each host to its uppercase label.",
          code: [
            "emails = [\"a@x.io\", \"b@x.io\", \"c@y.com\"]",
            "hosts = sorted({e.split(\"@\")[1] for e in emails})",
            "labels = {h: h.upper() for h in hosts}",
            "print(hosts, labels)",
          ],
          activeLines: [2, 3],
          output: "['x.io', 'y.com'] {'x.io': 'X.IO', 'y.com': 'Y.COM'}",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace filtering vs transforming in comprehensions",
      steps: [
        {
          title: "Evaluate filter clause before computing output",
          tag: "TRACE",
          explanation: ["`if n % 2 == 0` runs first on each `n`; `n = 1` fails so `n * n` is skipped."],
          code: [
            "nums = [1, 2, 3, 4]",
            "out = [n * n for n in nums if n % 2 == 0]",
            "print(out)",
          ],
          activeLines: [2],
          state: [
            { name: "n = 1", value: "filter False -> skipped" },
            { name: "n = 2", value: "filter True -> append 4", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Each item checks if n % 2 == 0 first; only passing items compute n * n.",
            nodes: [
              { id: "n1", label: "n = 1", sublabel: "1 % 2 == 1 (skip)", tone: "warm" },
              { id: "n2", label: "n = 2", sublabel: "2 % 2 == 0 (pass)", active: true, tone: "accent" },
              { id: "sq", label: "n * n -> 4", sublabel: "append to out", tone: "ok" },
            ],
            links: [{ from: "n2", to: "sq", active: true }],
          },
        },
        {
          title: "Collect matching values in order",
          tag: "CONCEPT",
          explanation: ["Continuing through `3` and `4` appends `16` (`4 * 4`), preserving source order."],
          code: [
            "nums = [1, 2, 3, 4]",
            "out = [n * n for n in nums if n % 2 == 0]",
            "print(out)",
          ],
          activeLines: [2, 3],
          state: [
            { name: "out", value: "[4, 16]", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Trailing if keeps only even inputs 2 and 4 before squaring into [4, 16].",
            nodes: [
              { id: "src", label: "nums = [1, 2, 3, 4]", sublabel: "source sequence" },
              { id: "flt", label: "if n % 2 == 0", sublabel: "keeps 2, 4", active: true, tone: "accent" },
              { id: "out", label: "[n*n ...]", sublabel: "[4, 16]", tone: "ok" },
            ],
            links: [
              { from: "src", to: "flt", active: true },
              { from: "flt", to: "out", label: "square", active: true },
            ],
          },
        },
        {
          title: "Deduplicate automatically with `{...}`",
          tag: "PATTERN",
          explanation: ["A set comprehension keeps only distinct transformed results in one pass."],
          code: [
            "emails = ['a@x.io', 'b@x.io', 'c@y.com']",
            "hosts = {e.split('@')[1] for e in emails}",
          ],
          activeLines: [2],
          state: [
            { name: "hosts", value: "{'x.io', 'y.com'}", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Set braces {...} collapse duplicate domain strings into a unique set.",
            nodes: [
              { id: "in", label: "x.io, x.io, y.com", sublabel: "3 extracted domains" },
              { id: "set", label: "{...} set comp", sublabel: "{'x.io', 'y.com'}", active: true, tone: "ok" },
            ],
            links: [{ from: "in", to: "set", label: "dedup", active: true }],
          },
        },
        {
          title: "Spot filter vs ternary position",
          tag: "PITFALL",
          explanation: ["Putting `else` after the `for` clause is a `SyntaxError`; value-choosing `if/else` always sits before `for`."],
          code: [
            "# BAD:  [n for n in nums if n > 0 else 0]",
            "# GOOD: [n if n > 0 else 0 for n in nums]",
          ],
          activeLines: [2],
          state: [
            { name: "rule", value: "if/else before for; filter if after for", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Leading if/else transforms every element; trailing if drops elements that fail.",
            nodes: [
              { id: "trn", label: "[a if c else b for x in xs]", sublabel: "ternary before for (keeps all)", active: true, tone: "ok" },
              { id: "flt", label: "[x for x in xs if c]", sublabel: "filter after for (drops false)", tone: "accent" },
            ],
            links: [{ from: "trn", to: "flt", label: "distinct roles", active: true }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Placement of `else` in comprehensions",
        detail: "Trailing `if` only filters; conditional `a if cond else b` goes before `for`.",
      },
      {
        title: "Side effects inside comprehensions (`[print(x) for x in xs]`)",
        detail: "This allocates a useless list of `None` values just to loop; use a regular `for` loop instead.",
      },
    ],
    predictChecks: [
      {
        prompt: "What is `{len(w) for w in ['hi', 'ok', 'yes']}`?",
        code: "print({len(w) for w in ['hi', 'ok', 'yes']})",
        options: [
          { id: "a", label: "`{2, 3}`" },
          { id: "b", label: "`[2, 2, 3]`" },
          { id: "c", label: "`{'hi': 2, 'ok': 2}`" },
        ],
        correctId: "a",
        explanation: "Without `:`, `{expr for ...}` creates a set with duplicates removed.",
      },
      {
        prompt: "What does `[x if x > 0 else 0 for x in [-2, 3, -1]]` produce?",
        code: "print([x if x > 0 else 0 for x in [-2, 3, -1]])",
        options: [
          { id: "a", label: "`[3]`" },
          { id: "b", label: "`[0, 3, 0]`" },
          { id: "c", label: "`[-2, 3, -1]`" },
        ],
        correctId: "b",
        explanation: "Leading `if/else` keeps all 3 elements, clamping negatives to `0`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Normalized non-empty tag list",
      tier: "Warmup",
      goal: "Write `clean_tags(tags)` stripping and lowercasing each tag while dropping empty strings.",
      constraints: ["Use a list comprehension with a trailing `if` filter"],
      examples: [
        { input: "[' Py ', '', ' SQL']", output: "['py', 'sql']" },
        { input: "[' ']", output: "[]" },
      ],
      tasks: [
        "Normalize with `.strip().lower()` and keep truthy strings.",
      ],
      starterCode: "# Exercise M09.1 Warmup: comprehension cleanup\ndef clean_tags(tags: list[str]) -> list[str]:\n    return []\n",
      expectedOutput: "['py', 'sql']\n[]",
      hint: "Filter with `if t.strip()` and transform with `t.strip().lower()`: `[t.strip().lower() for t in tags if t.strip()]`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "def clean_tags(tags: list[str]) -> list[str]:\n    return [t.strip().lower() for t in tags if t.strip()]\n\nprint(clean_tags([' Py ', '', ' SQL']))\nprint(clean_tags([' ']))",
    },
    practiceChallenges: [
      {
        title: "Core: Invert unique ID-to-name dictionary",
        tier: "Core",
        goal: "Write `invert_map(d)` returning `{v: k for k, v in d.items()}`.",
        constraints: ["Use a dictionary comprehension"],
        examples: [
          { input: "{1: 'a', 2: 'b'}", output: "{'a': 1, 'b': 2}" },
          { input: "{}", output: "{}" },
        ],
        tasks: [
          "Return `{v: k for k, v in d.items()}`.",
        ],
        starterCode: "# Exercise M09.1 Core: dict comprehension invert\ndef invert_map(d: dict[int, str]) -> dict[str, int]:\n    return {}\n",
        expectedOutput: "{'a': 1, 'b': 2}\n{}",
        hint: "Iterate `for k, v in d.items()` inside `{v: k ...}`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def invert_map(d: dict[int, str]) -> dict[str, int]:\n    return {v: k for k, v in d.items()}\n\nprint(invert_map({1: 'a', 2: 'b'}))\nprint(invert_map({}))",
      },
      {
        title: "Stretch: Unique passing lowercase usernames",
        tier: "Stretch",
        goal: "Given `(user, score)` pairs, return `sorted({u.lower() for u, s in rows if s >= 60})`.",
        constraints: ["Use a set comprehension to deduplicate before sorting"],
        examples: [
          { input: "[('Ada', 80), ('ada', 90), ('Bob', 40)]", output: "['ada']" },
          { input: "[('Sam', 60), ('Zoe', 95)]", output: "['sam', 'zoe']" },
        ],
        tasks: [
          "Filter by `s >= 60`, lowercase `u`, collect in a `set`, then `sorted(...)`.",
        ],
        starterCode: "# Exercise M09.1 Stretch: set comprehension dedup\ndef passing_users(rows: list[tuple[str, int]]) -> list[str]:\n    return []\n",
        expectedOutput: "['ada']\n['sam', 'zoe']",
        hint: "`sorted({u.lower() for u, s in rows if s >= 60})`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "def passing_users(rows: list[tuple[str, int]]) -> list[str]:\n    return sorted({u.lower() for u, s in rows if s >= 60})\n\nprint(passing_users([('Ada', 80), ('ada', 90), ('Bob', 40)]))\nprint(passing_users([('Sam', 60), ('Zoe', 95)]))",
      },
    ],
  },

  "py-enumerate-zip": {
    lessonId: "py-enumerate-zip",
    subtitle: "Track positions with `enumerate()` and walk parallel iterables using `zip(..., strict=True)`.",
    intro: {
      heading: "Avoid manual index counters in Python loops",
      explanation: [
        "Writing `for i in range(len(items)):` forces `items[i]` lookups on every line and invites off-by-one bugs. Even worse, plain `zip(names, scores)` silently stops at the shorter list and drops trailing records with no error if one list is missing an entry.",
        "`enumerate(seq, start=1)` pairs each item with its counter directly, and `zip(..., strict=True)` walks parallel sequences while raising `ValueError` on any length mismatch.",
      ],
      analogy: "Pairing row numbers on a spreadsheet with two side-by-side columns: `enumerate` stamps the line number, and `strict=True` sounds an alarm if Column B stops one row early.",
      realWorldUses: [
        "Formatting 1-based CLI menus, error line numbers, and ranked leaderboards with `enumerate(..., start=1)`",
        "Validating matching CSV columns or feature/label arrays with `zip(..., strict=True)`",
      ],
    },
    sections: [
      {
        heading: "`enumerate()` and `zip(..., strict=True)`",
        paragraphs: [
          "`enumerate(seq, start=1)` yields `(1, first), (2, second)` for menus, rankings, and line numbers.",
          "Plain `zip(a, b)` stops at the shorter iterable without warning, which can hide missing records. Pass `strict=True` (Python 3.10+) whenever lengths must match.",
        ],
        code: [
          "names = [\"Ada\", \"Sam\"]",
          "scores = [92, 88]",
          "for rank, (name, score) in enumerate(zip(names, scores, strict=True), start=1):",
          "    print(f\"{rank}. {name}: {score}\")",
        ],
        output: "1. Ada: 92\n2. Sam: 88",
        table: {
          caption: "Loop pairing tools",
          headers: ["Call", "Yields", "Mismatch behavior"],
          rows: [
            ["`enumerate(xs)`", "`(0, x0), (1, x1), ...`", "N/A"],
            ["`enumerate(xs, start=1)`", "`(1, x0), (2, x1), ...`", "N/A"],
            ["`zip(a, b)`", "`(a0, b0), (a1, b1), ...`", "Stops at shorter list"],
            ["`zip(a, b, strict=True)`", "Same pairs", "Raises `ValueError` on length difference"],
          ],
        },
      },
      {
        heading: "Silent truncation bug vs `strict=True`",
        paragraphs: [
          "Suppose `users` has 3 names and `balances` only loaded 2 values. Default `zip(users, balances)` drops the third user without raising anything.",
          "Adding `strict=True` turns that silent data loss into an immediate `ValueError` you can catch or fix.",
        ],
        code: [
          "users = [\"Ada\", \"Sam\", \"Zoe\"]",
          "balances = [100, 250]",
          "",
          "# BUG: silently drops 'Zoe' -> [('Ada', 100), ('Sam', 250)]",
          "truncated = list(zip(users, balances))",
          "print(\"truncated:\", truncated)",
          "",
          "# FIX: strict=True catches the missing balance",
          "try:",
          "    list(zip(users, balances, strict=True))",
          "except ValueError as err:",
          "    print(\"caught:\", type(err).__name__)",
        ],
        output: "truncated: [('Ada', 100), ('Sam', 250)]\ncaught: ValueError",
      },
    ],
    guidedBuildUp: {
      title: "Build a Ranked Parallel Loop Step by Step",
      steps: [
        {
          label: "Step 1: Number items with `enumerate(..., start=1)`",
          explanation: "Replace manual `i = 1` / `i += 1` bookkeeping with `enumerate(tasks, start=1)`.",
          code: [
            "tasks = [\"lint\", \"test\"]",
            "lines = [f\"{i}. {t}\" for i, t in enumerate(tasks, start=1)]",
            "print(lines)",
          ],
          activeLines: [2],
          output: "['1. lint', '2. test']",
        },
        {
          label: "Step 2: Pair aligned lists with `zip(..., strict=True)`",
          explanation: "Walk `names` and `scores` side by side while guarding against mismatched lengths.",
          code: [
            "names = [\"Ada\", \"Sam\"]",
            "scores = [92, 88]",
            "pairs = list(zip(names, scores, strict=True))",
            "print(pairs)",
          ],
          activeLines: [3],
          output: "[('Ada', 92), ('Sam', 88)]",
        },
        {
          label: "Step 3: Combine `enumerate` and `zip` with tuple unpacking",
          explanation: "Wrap `zip(...)` inside `enumerate(..., start=1)` and parenthesize `(n, s)` in the target list.",
          code: [
            "names = [\"Ada\", \"Sam\"]",
            "scores = [92, 88]",
            "ranked = [f\"{r}. {n}: {s}\" for r, (n, s) in enumerate(zip(names, scores, strict=True), start=1)]",
            "print(ranked)",
          ],
          activeLines: [3],
          output: "['1. Ada: 92', '2. Sam: 88']",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `enumerate()` and `zip(strict=True)`",
      steps: [
        {
          title: "`enumerate(..., start=1)` offsets index counter",
          tag: "CONCEPT",
          explanation: ["Starting at `1` turns raw 0-based positions into 1-based line or rank numbers without `i + 1` everywhere."],
          code: [
            "tasks = ['lint', 'test']",
            "for num, task in enumerate(tasks, start=1):",
            "    print(num, task)",
          ],
          activeLines: [2],
          state: [
            { name: "num", value: "1", changed: true },
            { name: "task", value: "'lint'", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "start=1 yields counter 1 alongside index 0 ('lint'), then 2 alongside index 1 ('test').",
            trays: [
              {
                label: "tasks",
                cells: [
                  { id: "t0", value: "'lint' (num=1)", index: 0, state: "active" },
                  { id: "t1", value: "'test' (num=2)", index: 1, state: "default" },
                ],
                pointers: [{ index: 0, label: "num = 1", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "`zip` pairs elements by position",
          tag: "TRACE",
          explanation: ["Each step pulls the next item from both `names` and `scores` into a tuple `(name, score)`."],
          code: [
            "names = ['Ada', 'Sam']",
            "scores = [92, 88]",
            "pairs = list(zip(names, scores, strict=True))",
          ],
          activeLines: [3],
          state: [
            { name: "step 0", value: "('Ada', 92)" },
            { name: "step 1", value: "('Sam', 88)", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "zip steps two aligned cursors across names and scores simultaneously.",
            trays: [
              {
                label: "names",
                cells: [
                  { id: "n0", value: "'Ada'", index: 0, state: "done" },
                  { id: "n1", value: "'Sam'", index: 1, state: "active" },
                ],
                pointers: [{ index: 1, label: "idx = 1", tone: "accent" }],
              },
              {
                label: "scores",
                cells: [
                  { id: "s0", value: "92", index: 0, state: "done" },
                  { id: "s1", value: "88", index: 1, state: "active" },
                ],
                pointers: [{ index: 1, label: "idx = 1", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Default `zip` truncates silently",
          tag: "PITFALL",
          explanation: ["Without `strict=True`, `zip([1, 2, 3], ['a'])` stops after `'a'` and drops `2` and `3` without warning."],
          code: [
            "print(list(zip([1, 2, 3], ['a'])))",
          ],
          activeLines: [1],
          state: [
            { name: "result", value: "[(1, 'a')]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Default zip stops at the shortest iterable and silently drops 2 and 3.",
            trays: [
              {
                label: "left [1, 2, 3]",
                cells: [
                  { id: "l0", value: "1", index: 0, state: "done" },
                  { id: "l1", value: "2 (dropped)", index: 1, state: "dim" },
                  { id: "l2", value: "3 (dropped)", index: 2, state: "dim" },
                ],
              },
              {
                label: "right ['a']",
                cells: [{ id: "r0", value: "'a'", index: 0, state: "done" }],
              },
            ],
          },
        },
        {
          title: "`strict=True` catches length bugs immediately",
          tag: "CHECK",
          explanation: ["Once the shorter iterable finishes while the other still has values, `zip(..., strict=True)` raises `ValueError`."],
          code: [
            "list(zip([1, 2], ['a'], strict=True))  # raises ValueError",
          ],
          activeLines: [1],
          state: [
            { name: "error", value: "ValueError: zip() argument 2 is shorter", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "strict=True checks trailing iterators after pairing (1, 'a') and raises ValueError on leftover 2.",
            trays: [
              {
                label: "arg 1 [1, 2]",
                cells: [
                  { id: "z10", value: "1", index: 0, state: "done" },
                  { id: "z11", value: "2 (extra!)", index: 1, state: "pivot" },
                ],
                pointers: [{ index: 1, label: "ValueError", tone: "coral" }],
              },
              {
                label: "arg 2 ['a']",
                cells: [
                  { id: "z20", value: "'a'", index: 0, state: "done" },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Silent truncation in default `zip(a, b)`",
        detail: "Always add `strict=True` unless intentionally pairing an infinite generator or unmatched trailing items.",
      },
      {
        title: "Unpacking nested tuples from `enumerate(zip(...))`",
        detail: "Parenthesize inner pairs: `for i, (a, b) in enumerate(zip(xs, ys)):`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `list(enumerate(['x', 'y'], start=10))` return?",
        code: "print(list(enumerate(['x', 'y'], start=10)))",
        options: [
          { id: "a", label: "`[(0, 'x'), (1, 'y')]`" },
          { id: "b", label: "`[(10, 'x'), (11, 'y')]`" },
          { id: "c", label: "`[(10, 'x')]`" },
        ],
        correctId: "b",
        explanation: "`start=10` begins the counter at `10` for all items in the list.",
      },
      {
        prompt: "What does `list(zip([1, 2], ['a'], strict=True))` do?",
        code: "list(zip([1, 2], ['a'], strict=True))",
        options: [
          { id: "a", label: "Returns `[(1, 'a'), (2, None)]`" },
          { id: "b", label: "Returns `[(1, 'a')]`" },
          { id: "c", label: "Raises `ValueError`" },
        ],
        correctId: "c",
        explanation: "`strict=True` raises `ValueError` when iterables differ in length.",
      },
    ],
    practiceTask: {
      title: "Warmup: Numbered checklist lines",
      tier: "Warmup",
      goal: "Write `format_lines(items)` returning `['1: first', '2: second', ...]` using `enumerate(items, start=1)`.",
      constraints: ["No manual `i += 1` counter"],
      examples: [
        { input: "['read', 'code']", output: "['1: read', '2: code']" },
        { input: "[]", output: "[]" },
      ],
      tasks: [
        "Use a comprehension over `enumerate(items, start=1)`.",
      ],
      starterCode: "# Exercise M09.2 Warmup: enumerate starting at 1\ndef format_lines(items: list[str]) -> list[str]:\n    return []\n",
      expectedOutput: "['1: read', '2: code']\n[]",
      hint: "Return `[f'{i}: {item}' for i, item in enumerate(items, start=1)]`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "def format_lines(items: list[str]) -> list[str]:\n    return [f\"{i}: {item}\" for i, item in enumerate(items, start=1)]\n\nprint(format_lines(['read', 'code']))\nprint(format_lines([]))",
    },
    practiceChallenges: [
      {
        title: "Core: Dot product using `zip(..., strict=True)`",
        tier: "Core",
        goal: "Write `dot(xs, ys)` multiplying aligned integers and summing them, letting `zip(xs, ys, strict=True)` raise `ValueError` on mismatched lengths.",
        constraints: ["Use `zip(..., strict=True)`"],
        examples: [
          { input: "[1, 2, 3], [4, 5, 6]", output: "32" },
          { input: "[1, 2], [4]", output: "mismatch" },
        ],
        tasks: [
          "Sum `[x * y for x, y in zip(xs, ys, strict=True)]`.",
        ],
        starterCode: "# Exercise M09.2 Core: strict zip dot product\ndef dot(xs: list[int], ys: list[int]) -> int:\n    return 0\n",
        expectedOutput: "32\nmismatch",
        hint: "Use `sum([x * y for x, y in zip(xs, ys, strict=True)])`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def dot(xs: list[int], ys: list[int]) -> int:\n    return sum([x * y for x, y in zip(xs, ys, strict=True)])\n\nprint(dot([1, 2, 3], [4, 5, 6]))\ntry:\n    dot([1, 2], [4])\nexcept ValueError:\n    print('mismatch')",
      },
      {
        title: "Stretch: Detect sorted inversions",
        tier: "Stretch",
        goal: "Write `first_drop(nums)` returning the index `i` (1-based of the element that dropped, i.e., `nums[i] < nums[i-1]`) or `-1` if non-decreasing, using `enumerate(zip(nums, nums[1:]), start=1)`.",
        constraints: ["Compare adjacent elements without index arithmetic bugs"],
        examples: [
          { input: "[1, 3, 2, 4]", output: "2" },
          { input: "[1, 2, 2, 5]", output: "-1" },
        ],
        tasks: [
          "Loop `for i, (prev, cur) in enumerate(zip(nums, nums[1:]), start=1):`.",
          "Return `i` when `cur < prev`, else `-1`.",
        ],
        starterCode: "# Exercise M09.2 Stretch: adjacent comparison with enumerate + zip\ndef first_drop(nums: list[int]) -> int:\n    return -1\n",
        expectedOutput: "2\n-1",
        hint: "`zip(nums, nums[1:])` pairs every `(nums[i-1], nums[i])`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def first_drop(nums: list[int]) -> int:\n    for i, (prev, cur) in enumerate(zip(nums, nums[1:]), start=1):\n        if cur < prev:\n            return i\n    return -1\n\nprint(first_drop([1, 3, 2, 4]))\nprint(first_drop([1, 2, 2, 5]))",
      },
    ],
  },

  "py-args-kwargs": {
    lessonId: "py-args-kwargs",
    subtitle: "Accept variable positional (`*args`) and keyword (`**kwargs`) arguments and unpack collections when calling functions.",
    intro: {
      heading: "Pack and unpack flexible argument lists",
      explanation: [
        "Hardcoding two parameters inside a helper or decorator breaks the moment an underlying function adds a new option. Even when developers write `def wrapper(*args, **kwargs):`, forwarding `fn(args, kwargs)` without stars passes a tuple and a dict as two positional arguments and crashes with `TypeError`.",
        "In a `def` header, `*args` packs extra positional arguments into a `tuple` and `**kwargs` packs extra keyword arguments into a `dict`; at a call site, `*seq` and `**mapping` unpack them back out.",
      ],
      analogy: "Like packing and unpacking a moving box: `*args` and `**kwargs` in `def` gather loose items into a box and label sheet, while `*` and `**` at the call site empty them back onto the table.",
      realWorldUses: [
        "Writing decorator and CLI wrappers that forward arbitrary arguments untouched",
        "Merging base configuration dictionaries with per-environment overrides (`{**defaults, **overrides}`)",
      ],
    },
    sections: [
      {
        heading: "Packing in definitions vs unpacking at calls",
        paragraphs: [
          "In a `def` header, `*args` collects positional extras into a `tuple`, and `**kwargs` collects keyword extras into a `dict`. Ordering inside `def` must be `positional, *args, keyword_only, **kwargs`.",
          "At a call site, `*items` and `**options` do the reverse: they unpack sequences and dictionaries into separate function arguments.",
        ],
        code: [
          "def log_call(label: str, *args, sep: str = \", \", **kwargs) -> str:",
          "    pos = sep.join([str(x) for x in args])",
          "    meta = \" \".join([f\"{k}={v}\" for k, v in sorted(kwargs.items())])",
          "    return f\"[{label}] {pos} | {meta}\".strip()",
          "",
          "extras = [10, 20]",
          "flags = {\"env\": \"prod\", \"ok\": True}",
          "print(log_call(\"RUN\", *extras, **flags))",
        ],
        output: "[RUN] 10, 20 | env=prod ok=True",
        table: {
          caption: "`*` and `**` syntax roles",
          headers: ["Location", "Syntax", "Meaning"],
          rows: [
            ["`def f(*args)`", "One star in header", "Packs extra positional args into a `tuple`"],
            ["`def f(**kwargs)`", "Two stars in header", "Packs extra keyword args into a `dict`"],
            ["`f(*seq)`", "One star in call", "Unpacks `seq` as positional arguments"],
            ["`f(**mapping)`", "Two stars in call", "Unpacks `mapping` as keyword arguments"],
          ],
        },
      },
      {
        heading: "Forwarding traps: missing `*` and duplicate keys",
        paragraphs: [
          "Calling `fn(args)` inside a wrapper hands `fn` a single `tuple` instead of separate arguments. Always keep `*args` and `**kwargs` at the forwarding call site.",
          "Passing the same keyword explicitly and inside `**flags` triggers `TypeError: got multiple values for keyword argument`.",
        ],
        code: [
          "def add(a, b): return a + b",
          "",
          "def bad_forward(fn, *args, **kwargs):",
          "    # BUG: passes (2, 5) as 'a' and {} as 'b' -> TypeError",
          "    return fn(args, kwargs)",
          "",
          "def good_forward(fn, *args, **kwargs):",
          "    # FIX: unpacks back into add(2, 5)",
          "    return fn(*args, **kwargs)",
          "",
          "print(good_forward(add, 2, 5))",
          "# add(2, b=5, **{'b': 9})  # BUG: duplicate 'b' -> TypeError",
        ],
        output: "7",
      },
    ],
    guidedBuildUp: {
      title: "Build a Forwarding Helper Step by Step",
      steps: [
        {
          label: "Step 1: Collect variable positional inputs with `*nums`",
          explanation: "Accept any count of positional numbers into the `nums` tuple and pass it to `sum`.",
          code: [
            "def add_all(*nums):",
            "    return sum(nums)",
            "",
            "print(add_all(2, 5, 8))",
          ],
          activeLines: [1, 2],
          output: "15",
        },
        {
          label: "Step 2: Add a keyword-only option after `*items`",
          explanation: "Because `*items` consumes all positional arguments, `sep` after it can only be passed by keyword.",
          code: [
            "def tag_items(label, *items, sep=\", \"):",
            "    joined = sep.join(str(x) for x in items)",
            "    return f\"[{label}] {joined}\"",
            "",
            "print(tag_items(\"IDS\", 10, 20, sep=\"-\"))",
          ],
          activeLines: [1, 2, 5],
          output: "[IDS] 10-20",
        },
        {
          label: "Step 3: Forward both `*args` and `**kwargs`",
          explanation: "Accept `*args, **kwargs` and unpack them into `fn(*args, **kwargs)` so any signature works.",
          code: [
            "def forward(fn, *args, **kwargs):",
            "    return fn(*args, **kwargs)",
            "",
            "def power(base, exp=2):",
            "    return base ** exp",
            "",
            "print(forward(power, 3, exp=4))",
          ],
          activeLines: [1, 2, 7],
          output: "81",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace packing vs unpacking `*args` and `**kwargs`",
      steps: [
        {
          title: "Call site unpacks list and dict",
          tag: "TRACE",
          explanation: ["`*extras` expands `[10, 20]` into two positional args; `**flags` expands keys into keyword args."],
          code: [
            "def f(a, *args, **kwargs):",
            "    return (a, args, kwargs)",
            "extras = [10, 20]",
            "flags = {'debug': True}",
            "print(f('go', *extras, **flags))",
          ],
          activeLines: [5],
          state: [
            { name: "call args", value: "('go', 10, 20, debug=True)", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "*extras unpacks positional items and **flags unpacks keyword pairs into the call to f.",
            frames: [
              {
                name: "Call Unpack",
                bindings: [
                  { label: "*extras", targetId: "u_lst", highlight: true },
                  { label: "**flags", targetId: "u_dct", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "u_lst", typeLabel: "list unpacked", value: "10, 20 -> positional", highlight: true },
              { id: "u_dct", typeLabel: "dict unpacked", value: "debug=True -> keyword", highlight: true },
            ],
          },
        },
        {
          title: "`def` packs leftovers by kind",
          tag: "MEMORY",
          explanation: ["`'go'` binds `a`; extra positionals `(10, 20)` pack into `args`; keyword `debug=True` packs into `kwargs`."],
          code: [
            "def f(a, *args, **kwargs):",
            "    return (a, args, kwargs)",
          ],
          activeLines: [1],
          state: [
            { name: "a", value: "'go'" },
            { name: "args (tuple)", value: "(10, 20)", changed: true },
            { name: "kwargs (dict)", value: "{'debug': True}", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "*args gathers extra positional args into a tuple; **kwargs gathers unknown keywords into a dict.",
            frames: [
              {
                name: "f(...) Frame",
                bindings: [
                  { label: "a", targetId: "va" },
                  { label: "args", targetId: "vargs", highlight: true },
                  { label: "kwargs", targetId: "vkw", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "va", typeLabel: "str", value: "'go'" },
              { id: "vargs", typeLabel: "tuple", value: "(10, 20)", highlight: true },
              { id: "vkw", typeLabel: "dict", value: "{'debug': True}", mutable: true, highlight: true },
            ],
          },
        },
        {
          title: "Parameters after `*args` become keyword-only",
          tag: "CONCEPT",
          explanation: ["In `def log(label, *args, sep=', ')`, callers must pass `sep=` by keyword because `*args` consumes all positional slots."],
          code: [
            "def log(label, *args, sep=', '):",
            "    return sep.join(str(x) for x in args)",
            "print(log('x', 1, 2, sep='-'))",
          ],
          activeLines: [1, 3],
          state: [
            { name: "args", value: "(1, 2)" },
            { name: "sep", value: "'-'", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "*args absorbs every trailing positional value, forcing sep to be bound by keyword only.",
            frames: [
              {
                name: "log() Frame",
                bindings: [
                  { label: "label", targetId: "l_lbl" },
                  { label: "args", targetId: "l_args" },
                  { label: "sep (kw-only)", targetId: "l_sep", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "l_lbl", typeLabel: "str", value: "'x'" },
              { id: "l_args", typeLabel: "tuple", value: "(1, 2)" },
              { id: "l_sep", typeLabel: "str", value: "'-'", highlight: true },
            ],
          },
        },
        {
          title: "Watch duplicate keyword unpack error",
          tag: "PITFALL",
          explanation: ["Passing both explicit `env='dev'` and `**{'env': 'prod'}` in the same call raises `TypeError: got multiple values for keyword argument`."],
          code: [
            "# f(env='dev', **{'env': 'prod'}) -> TypeError",
          ],
          activeLines: [1],
          state: [
            { name: "rule", value: "duplicate keyword keys raise TypeError", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Passing the same keyword key explicitly and via **dict raises TypeError on binding.",
            frames: [
              {
                name: "Call Bind Error",
                bindings: [
                  { label: "env (explicit)", targetId: "kw1", highlight: true },
                  { label: "**{'env': 'prod'}", targetId: "kw2", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "kw1", typeLabel: "kw slot 'env'", value: "already set to 'dev'" },
              { id: "kw2", typeLabel: "TypeError", value: "duplicate key 'env'", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Mutating `kwargs` affects only the callee's copy",
        detail: "Unpacking `**d` builds a fresh `kwargs` dict in the function, so `kwargs.pop(...)` does not mutate the caller's dictionary.",
      },
      {
        title: "Forgetting `*` when forwarding `args` (`fn(args)` vs `fn(*args)`)",
        detail: "Calling `fn(args)` passes one single tuple argument instead of forwarding the separate arguments.",
      },
    ],
    predictChecks: [
      {
        prompt: "What type is `args` inside `def total(*args):`?",
        code: "def total(*args): return type(args).__name__\nprint(total(1, 2))",
        options: [
          { id: "a", label: "`list`" },
          { id: "b", label: "`tuple`" },
          { id: "c", label: "`dict`" },
        ],
        correctId: "b",
        explanation: "`*args` always collects extra positional arguments as a `tuple`.",
      },
      {
        prompt: "What happens if `def f(a, *args, b=1):` is called as `f(10, 20, 30)`?",
        code: "def f(a, *args, b=1): return (a, args, b)\nprint(f(10, 20, 30))",
        options: [
          { id: "a", label: "`(10, (20,), 30)`" },
          { id: "b", label: "`(10, (20, 30), 1)`" },
          { id: "c", label: "Raises `TypeError`" },
        ],
        correctId: "b",
        explanation: "Because `b` comes after `*args`, `b` is keyword-only and stays `1` while `(20, 30)` goes into `args`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Weighted sum with `*nums` and keyword `scale`",
      tier: "Warmup",
      goal: "Write `scaled_sum(*nums, scale=1)` summing all numbers in `nums` and multiplying by `scale`.",
      constraints: ["`scale` is keyword-only after `*nums`"],
      examples: [
        { input: "scaled_sum(2, 3, 5, scale=2)", output: "20" },
        { input: "scaled_sum()", output: "0" },
      ],
      tasks: [
        "Return `sum(nums) * scale`.",
      ],
      starterCode: "# Exercise M09.3 Warmup: *nums with keyword-only scale\ndef scaled_sum(*nums: int, scale: int = 1) -> int:\n    return 0\n",
      expectedOutput: "20\n0",
      hint: "Sum `nums` (empty tuple sums to 0) and multiply by `scale`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "def scaled_sum(*nums: int, scale: int = 1) -> int:\n    return sum(nums) * scale\n\nprint(scaled_sum(2, 3, 5, scale=2))\nprint(scaled_sum())",
    },
    practiceChallenges: [
      {
        title: "Core: Override config defaults with `**overrides`",
        tier: "Core",
        goal: "Write `make_config(env='dev', **overrides)` combining `{'env': env, 'retries': 3}` with `overrides` (so overrides win) and returning sorted `(k, v)` pairs.",
        constraints: ["Do not mutate caller dicts"],
        examples: [
          { input: "env='prod', retries=5, tls=True", output: "[('env', 'prod'), ('retries', 5), ('tls', True)]" },
          { input: "no overrides", output: "[('env', 'dev'), ('retries', 3)]" },
        ],
        tasks: [
          "Merge `{ 'env': env, 'retries': 3, **overrides }` and return `sorted(cfg.items())`.",
        ],
        starterCode: "# Exercise M09.3 Core: merge defaults with **overrides\ndef make_config(env: str = 'dev', **overrides):\n    return []\n",
        expectedOutput: "[('env', 'prod'), ('retries', 5), ('tls', True)]\n[('env', 'dev'), ('retries', 3)]",
        hint: "Dict unpacking `{'env': env, 'retries': 3, **overrides}` lets later keys overwrite defaults.",
        complexity: { time: "O(k log k)", space: "O(k)" },
        solutionCode:
          "def make_config(env: str = 'dev', **overrides):\n    cfg = {'env': env, 'retries': 3, **overrides}\n    return sorted(cfg.items())\n\nprint(make_config('prod', retries=5, tls=True))\nprint(make_config())",
      },
      {
        title: "Stretch: Safe argument forwarding helper",
        tier: "Stretch",
        goal: "Write `forward(fn, *args, **kwargs)` that strips an optional `'dry_run'` flag via `kwargs.pop('dry_run', False)`: if `True` return `'DRY:' + fn.__name__`, else return `fn(*args, **kwargs)`.",
        constraints: ["Forward `*args` and remaining `**kwargs` untouched to `fn`"],
        examples: [
          { input: "forward(add, 2, 5)", output: "7" },
          { input: "forward(add, 2, 5, dry_run=True)", output: "DRY:add" },
        ],
        tasks: [
          "Pop `'dry_run'` from `kwargs`.",
          "Return `'DRY:' + fn.__name__` or `fn(*args, **kwargs)`.",
        ],
        starterCode: "# Exercise M09.3 Stretch: forwarding wrapper helper\ndef forward(fn, *args, **kwargs):\n    return None\n",
        expectedOutput: "7\nDRY:add",
        hint: "Use `if kwargs.pop('dry_run', False): return f'DRY:{fn.__name__}'`.",
        complexity: { time: "O(1) overhead", space: "O(1)" },
        solutionCode:
          "def add(a, b): return a + b\ndef forward(fn, *args, **kwargs):\n    if kwargs.pop('dry_run', False):\n        return f\"DRY:{fn.__name__}\"\n    return fn(*args, **kwargs)\n\nprint(forward(add, 2, 5))\nprint(forward(add, 2, 5, dry_run=True))",
      },
    ],
  },

  "py-closures": {
    lessonId: "py-closures",
    subtitle: "Pass functions as values (`key=`), capture outer state in closures with `nonlocal`, and avoid loop late-binding bugs.",
    intro: {
      heading: "Functions are objects that can build and return functions",
      explanation: [
        "Generating callbacks inside a loop like `[lambda: i for i in range(3)]` creates a notorious surprise: every function ends up returning `2` because all three look up `i` when called instead of when created. Similarly, writing `count += 1` inside an inner function crashes with `UnboundLocalError` unless `nonlocal` is declared.",
        "When an inner function keeps a reference to enclosing variables, Python wraps those variables in a closure cell. Freezing loop values with `i=i` and declaring `nonlocal` for rebinds keeps state isolated and predictable.",
      ],
      analogy: "Every call to `make_counter()` rents its own private locker (`__closure__` cell) that outlives the factory function, whereas loop lambdas without `i=i` all point at one shared chalkboard overwritten on every iteration.",
      realWorldUses: [
        "Building parameterized sort keys, UI callbacks, and validators without global variables",
        "Holding private per-instance state inside stateful counters, rate limiters, and memoizers",
      ],
    },
    sections: [
      {
        heading: "Closures, `nonlocal`, and late binding in loops",
        paragraphs: [
          "`lambda params: expr` writes an unnamed single-expression function in one line (`lambda x: x * 2` returns `x * 2` implicitly), ideal for tiny sort keys (`sorted(rows, key=lambda r: r['score'])`).",
          "An inner `def` or `lambda` can read outer variables automatically, yet rebinding an outer integer (`count += 1`) requires declaring `nonlocal count` so Python does not treat `count` as a brand-new local variable.",
          "Closures created inside a `for` loop look up loop variables when called, not when defined. Bind the current value with a default parameter like `lambda x, i=i: x + i` to freeze it per iteration.",
        ],
        code: [
          "def make_counter(start: int = 0):",
          "    count = start",
          "    def step(by: int = 1) -> int:",
          "        nonlocal count",
          "        count += by",
          "        return count",
          "    return step",
          "",
          "c = make_counter(10)",
          "print(c(), c(5))",
        ],
        output: "11 16",
        table: {
          caption: "Closure scoping behavior",
          headers: ["Rule", "Meaning", "Fix when wrong"],
          rows: [
            ["Read outer variable", "Works automatically via enclosing scope", "N/A"],
            ["Rebind outer variable (`n += 1`)", "Raises `UnboundLocalError` without `nonlocal`", "Add `nonlocal n`"],
            ["Loop closure capture", "Inner fn sees loop variable's final value", "Bind per-step via `def f(i=i):` or `lambda x, i=i:`"],
          ],
        },
      },
      {
        heading: "Late-binding trap vs eager capture (`i=i`)",
        paragraphs: [
          "Python resolves free variables inside a closure at call time. After `for i in range(3)` ends, `i` equals `2`, so every lambda created in that loop reads `2`.",
          "Adding a default parameter `i=i` forces Python to evaluate `i` once per iteration when each function object is constructed.",
        ],
        code: [
          "# BUG: all 3 lambdas share final loop variable i = 2",
          "bad = [lambda: i for i in range(3)]",
          "print(\"bad:\", [fn() for fn in bad])",
          "",
          "# FIX: default arg i=i freezes the value on each iteration",
          "good = [lambda i=i: i for i in range(3)]",
          "print(\"good:\", [fn() for fn in good])",
        ],
        output: "bad: [2, 2, 2]\ngood: [0, 1, 2]",
      },
    ],
    guidedBuildUp: {
      title: "Build Stateful and Loop-Captured Closures Step by Step",
      steps: [
        {
          label: "Step 1: Capture a read-only outer variable",
          explanation: "Define `add` inside `make_adder` so `offset` stays readable after `make_adder(10)` returns.",
          code: [
            "def make_adder(offset):",
            "    def add(x):",
            "        return x + offset",
            "    return add",
            "",
            "plus_ten = make_adder(10)",
            "print(plus_ten(5))",
          ],
          activeLines: [2, 3, 6],
          output: "15",
        },
        {
          label: "Step 2: Rebind outer state with `nonlocal`",
          explanation: "Declare `nonlocal count` so `count += 1` updates the enclosing closure cell instead of raising `UnboundLocalError`.",
          code: [
            "def make_counter(start=0):",
            "    count = start",
            "    def step():",
            "        nonlocal count",
            "        count += 1",
            "        return count",
            "    return step",
            "",
            "c = make_counter(10); print(c(), c())",
          ],
          activeLines: [4, 5, 9],
          output: "11 12",
        },
        {
          label: "Step 3: Freeze loop offsets with default parameters",
          explanation: "Use `off=off` inside the comprehension so each returned adder keeps its own offset.",
          code: [
            "adders = [lambda x, off=off: x + off for off in [1, 10, 100]]",
            "results = [fn(5) for fn in adders]",
            "print(results)",
          ],
          activeLines: [1, 2],
          output: "[6, 15, 105]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `nonlocal` state vs late-binding loops",
      steps: [
        {
          title: "Outer call allocates closure cell",
          tag: "MEMORY",
          explanation: ["Calling `make_counter(10)` creates `count = 10` inside a persistent cell referenced by the returned `step` function."],
          code: [
            "def make_counter(start=0):",
            "    count = start",
            "    def step(by=1):",
            "        nonlocal count",
            "        count += by",
            "        return count",
            "    return step",
            "c = make_counter(10)",
            "print(c(), c(5))",
          ],
          activeLines: [2, 7, 8],
          state: [
            { name: "c.__closure__[0]", value: "10", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Even after make_counter returns, c keeps pointing to the shared closure cell count.",
            frames: [
              { name: "c.__closure__", bindings: [{ label: "count cell", targetId: "cell", highlight: true }] },
            ],
            objects: [{ id: "cell", typeLabel: "cell", value: "10", mutable: true, highlight: true }],
          },
        },
        {
          title: "`nonlocal count` mutates the cell",
          tag: "TRACE",
          explanation: ["`c()` updates the shared cell from `10` to `11`, and `c(5)` updates the same cell to `16`."],
          code: [
            "def make_counter(start=0):",
            "    count = start",
            "    def step(by=1):",
            "        nonlocal count",
            "        count += by",
            "        return count",
            "    return step",
            "c = make_counter(10)",
            "print(c(), c(5))",
          ],
          activeLines: [4, 5, 9],
          state: [
            { name: "1st c()", value: "11" },
            { name: "2nd c(5)", value: "16", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Each c() call mutates the shared cell via nonlocal (10 -> 11 -> 16).",
            frames: [
              { name: "c.__closure__", bindings: [{ label: "count cell", targetId: "cell", highlight: true }] },
            ],
            objects: [{ id: "cell", typeLabel: "cell (updated)", value: "16", mutable: true, highlight: true }],
          },
        },
        {
          title: "Spot the late-binding loop bug",
          tag: "PITFALL",
          explanation: ["`[lambda: i for i in range(3)]` stores `i` by reference; after the loop finishes, all three lambdas return `2`."],
          code: [
            "bad = [lambda: i for i in range(3)]",
            "print([fn() for fn in bad])  # [2, 2, 2]",
          ],
          activeLines: [1, 2],
          state: [
            { name: "all calls", value: "[2, 2, 2]", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "All three lambdas read the same loop variable i, which holds final value 2.",
            frames: [
              {
                name: "bad lambdas",
                bindings: [
                  { label: "bad[0] -> i", targetId: "loop_i", highlight: true },
                  { label: "bad[1] -> i", targetId: "loop_i", highlight: true },
                  { label: "bad[2] -> i", targetId: "loop_i", highlight: true },
                ],
              },
            ],
            objects: [{ id: "loop_i", typeLabel: "int (after loop)", value: "2", highlight: true }],
          },
        },
        {
          title: "Freeze value with default argument `i=i`",
          tag: "CHECK",
          explanation: ["Default parameter expressions evaluate when the lambda is created, capturing `0`, `1`, and `2` separately."],
          code: [
            "good = [lambda i=i: i for i in range(3)]",
            "print([fn() for fn in good])  # [0, 1, 2]",
          ],
          activeLines: [1, 2],
          state: [
            { name: "frozen calls", value: "[0, 1, 2]", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Default parameter i=i captures the current integer object (0, 1, 2) per lambda.",
            frames: [
              {
                name: "good lambdas",
                bindings: [
                  { label: "good[0] (i=0)", targetId: "i0", highlight: true },
                  { label: "good[1] (i=1)", targetId: "i1", highlight: true },
                  { label: "good[2] (i=2)", targetId: "i2", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "i0", typeLabel: "int", value: "0", highlight: true },
              { id: "i1", typeLabel: "int", value: "1", highlight: true },
              { id: "i2", typeLabel: "int", value: "2", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Missing `nonlocal` raises `UnboundLocalError`",
        detail: "Assigning `count += 1` makes Python compile `count` as local unless `nonlocal count` is declared.",
      },
      {
        title: "Late binding inside `for` loops",
        detail: "Always capture loop variables eagerly with `i=i` (or a small factory function) when generating callbacks in a loop.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `[f() for f in [lambda: i for i in range(3)]]` print?",
        code: "fns = [lambda: i for i in range(3)]\nprint([f() for f in fns])",
        options: [
          { id: "a", label: "`[0, 1, 2]`" },
          { id: "b", label: "`[2, 2, 2]`" },
          { id: "c", label: "Raises `NameError`" },
        ],
        correctId: "b",
        explanation: "All three lambdas share the final loop value `i = 2`.",
      },
      {
        prompt: "What happens if `count += 1` inside an inner function omits `nonlocal count`?",
        code: "def outer():\n    count = 0\n    def inner(): count += 1\n    return inner",
        options: [
          { id: "a", label: "Updates outer `count`" },
          { id: "b", label: "Creates a new global variable" },
          { id: "c", label: "Raises `UnboundLocalError` when `inner()` runs" },
        ],
        correctId: "c",
        explanation: "Without `nonlocal`, `count` is treated as an unassigned local in `inner`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Multiplier closure factory",
      tier: "Warmup",
      goal: "Write `make_multiplier(factor)` returning a function that multiplies its integer argument by `factor`.",
      constraints: ["Keep `factor` captured in closure scope"],
      examples: [
        { input: "triple = make_multiplier(3); triple(7)", output: "21" },
        { input: "double = make_multiplier(2); double(9)", output: "18" },
      ],
      tasks: [
        "Define and return inner function `multiply(x: int) -> int`.",
      ],
      starterCode: "# Exercise M09.4 Warmup: multiplier factory closure\ndef make_multiplier(factor: int):\n    return lambda x: 0\n",
      expectedOutput: "21\n18",
      hint: "Define `def mul(x: int) -> int: return x * factor` and return `mul`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def make_multiplier(factor: int):\n    def mul(x: int) -> int:\n        return x * factor\n    return mul\n\nprint(make_multiplier(3)(7))\nprint(make_multiplier(2)(9))",
    },
    practiceChallenges: [
      {
        title: "Core: Moving average tracker with `nonlocal`",
        tier: "Core",
        goal: "Write `make_running_max()` returning `push(val)` that updates and returns the maximum value seen so far using `nonlocal`.",
        constraints: ["Maintain running maximum across calls without globals"],
        examples: [
          { input: "push 4, 2, 9", output: "4 4 9" },
          { input: "push -5, -1", output: "-5 -1" },
        ],
        tasks: [
          "Store `best = None` in `make_running_max`.",
          "Declare `nonlocal best` inside `push(val)` and update when larger.",
        ],
        starterCode: "# Exercise M09.4 Core: running max with nonlocal\ndef make_running_max():\n    return lambda v: v\n",
        expectedOutput: "4 4 9\n-5 -1",
        hint: "Initialize `best = None` and update `if best is None or val > best: best = val`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def make_running_max():\n    best = None\n    def push(val: int) -> int:\n        nonlocal best\n        if best is None or val > best:\n            best = val\n        return best\n    return push\n\np1 = make_running_max(); print(p1(4), p1(2), p1(9))\np2 = make_running_max(); print(p2(-5), p2(-1))",
      },
      {
        title: "Stretch: Fix late binding across offset callbacks",
        tier: "Stretch",
        goal: "Write `build_adders(offsets)` returning functions `[f0, f1, ...]` where `fi(x)` returns `x + offsets[i]` (with no late-binding bug).",
        constraints: ["Test with non-zero offsets such as `[1, 10, 100]`"],
        examples: [
          { input: "offsets = [1, 10, 100], x = 5", output: "[6, 15, 105]" },
          { input: "offsets = [0, -2], x = 10", output: "[10, 8]" },
        ],
        tasks: [
          "Capture each offset eagerly via `lambda x, off=off: x + off`.",
        ],
        starterCode: "# Exercise M09.4 Stretch: freeze loop variable in callbacks\ndef build_adders(offsets: list[int]):\n    return []\n",
        expectedOutput: "[6, 15, 105]\n[10, 8]",
        hint: "Bind `off=off` in the lambda default parameter.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def build_adders(offsets: list[int]):\n    return [lambda x, off=off: x + off for off in offsets]\n\nprint([fn(5) for fn in build_adders([1, 10, 100])])\nprint([fn(10) for fn in build_adders([0, -2])])",
      },
    ],
  },

  "py-decorators": {
    lessonId: "py-decorators",
    subtitle: "Wrap functions using `@decorator`, `*args/**kwargs` forwarding, and `@functools.wraps`.",
    intro: {
      heading: "Add cross-cutting behavior without editing wrapped functions",
      explanation: [
        "Copy-pasting timing, logging, or permission checks inside twenty functions guarantees drift when one copy gets updated and nineteen do not. Yet writing a naive decorator introduces two subtle bugs: forgetting `return` inside `wrapper` turns every result into `None`, and omitting `@functools.wraps(fn)` overwrites `fn.__name__` with `'wrapper'`.",
        "A decorator wraps `fn` once at definition time, forwards `*args` and `**kwargs` directly through `return fn(*args, **kwargs)`, and preserves function identity with `@wraps(fn)`.",
      ],
      analogy: "Slipping a clear shipping sleeve over a labeled parcel: extra stamps or tracking happen on the outer sleeve, while `@wraps(fn)` keeps the original recipient label visible.",
      realWorldUses: [
        "Adding timing, structured logging, retries, or auth checks around web handlers",
        "Caching repeated pure function calls with `@functools.lru_cache` or custom memoizers",
      ],
    },
    sections: [
      {
        heading: "How `@dec` syntax and `@wraps` work",
        paragraphs: [
          "`@my_dec` above `def greet():` is exact syntactic sugar for `greet = my_dec(greet)` immediately after defining `greet`.",
          "Without `@functools.wraps(fn)` on `wrapper`, `greet.__name__` becomes `'wrapper'`, breaking help tools, logs, and test output.",
        ],
        code: [
          "from functools import wraps",
          "",
          "def loud(fn):",
          "    @wraps(fn)",
          "    def wrapper(*args, **kwargs):",
          "        return str(fn(*args, **kwargs)).upper()",
          "    return wrapper",
          "",
          "@loud",
          "def greet(name: str) -> str:",
          "    return f\"hello {name}\"",
          "",
          "print(greet(\"ada\"), greet.__name__)",
        ],
        output: "HELLO ADA greet",
        table: {
          caption: "Decorator anatomy",
          headers: ["Piece", "Role", "Why needed"],
          rows: [
            ["`def dec(fn):`", "Outer decorator factory", "Called once at function definition time"],
            ["`@wraps(fn)`", "Copies `__name__`, `__doc__`, signature metadata", "Keeps debugger and pytest names intact"],
            ["`def wrapper(*args, **kwargs):`", "Intercepts each runtime call", "Forwards any positional or keyword signature"],
          ],
        },
      },
      {
        heading: "Missing `return` and missing `@wraps` bugs",
        paragraphs: [
          "Calling `fn(*args, **kwargs)` inside `wrapper` without `return` discards the original function's value and gives callers `None`.",
          "Omitting `@wraps(fn)` hides the wrapped function's name and docstring behind `'wrapper'` in logs and tracebacks.",
        ],
        code: [
          "from functools import wraps",
          "",
          "def broken_dec(fn):",
          "    def wrapper(*args, **kwargs):",
          "        fn(*args, **kwargs)  # BUG: forgot return -> caller gets None",
          "    return wrapper",
          "",
          "def fixed_dec(fn):",
          "    @wraps(fn)              # FIX: preserves __name__ and __doc__",
          "    def wrapper(*args, **kwargs):",
          "        return fn(*args, **kwargs)",
          "    return wrapper",
          "",
          "@broken_dec",
          "def f_bad(x): return x + 1",
          "@fixed_dec",
          "def f_good(x): return x + 1",
          "",
          "print(f_bad(5), f_bad.__name__, \"|\", f_good(5), f_good.__name__)",
        ],
        output: "None wrapper | 6 f_good",
      },
    ],
    guidedBuildUp: {
      title: "Build a Metadata-Safe Decorator Step by Step",
      steps: [
        {
          label: "Step 1: Wrap and return the inner result",
          explanation: "Accept `fn`, define `wrapper(*args, **kwargs)`, transform and return `fn(*args, **kwargs)`, and return `wrapper`.",
          code: [
            "def shout(fn):",
            "    def wrapper(*args, **kwargs):",
            "        return str(fn(*args, **kwargs)).upper()",
            "    return wrapper",
            "",
            "@shout",
            "def greet(name): return f\"hi {name}\"",
            "print(greet(\"ada\"))",
          ],
          activeLines: [1, 3, 6],
          output: "HI ADA",
        },
        {
          label: "Step 2: Preserve `__name__` with `@wraps(fn)`",
          explanation: "Add `@wraps(fn)` above `wrapper` so `greet.__name__` remains `'greet'` instead of `'wrapper'`.",
          code: [
            "from functools import wraps",
            "",
            "def shout(fn):",
            "    @wraps(fn)",
            "    def wrapper(*args, **kwargs):",
            "        return str(fn(*args, **kwargs)).upper()",
            "    return wrapper",
            "",
            "@shout",
            "def greet(name): return f\"hi {name}\"",
            "print(greet(\"ada\"), greet.__name__)",
          ],
          activeLines: [1, 4, 11],
          output: "HI ADA greet",
        },
        {
          label: "Step 3: Parameterize with a 3-level factory",
          explanation: "Wrap `decorator(fn)` inside `repeat(times)` so `@repeat(3)` configures how many times `wrapper` calls `fn`.",
          code: [
            "from functools import wraps",
            "",
            "def repeat(times):",
            "    def decorator(fn):",
            "        @wraps(fn)",
            "        def wrapper(*args, **kwargs):",
            "            return [fn(*args, **kwargs) for _ in range(times)]",
            "        return wrapper",
            "    return decorator",
            "",
            "@repeat(3)",
            "def ping(x): return f\"ok:{x}\"",
            "print(ping(\"a\"), ping.__name__)",
          ],
          activeLines: [3, 4, 7, 11],
          output: "['ok:a', 'ok:a', 'ok:a'] ping",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace decorator definition time vs runtime call",
      steps: [
        {
          title: "`@loud` runs once when `def greet` finishes",
          tag: "CONCEPT",
          explanation: ["Python defines `greet`, immediately calls `loud(greet)`, and rebinds the name `greet` to the returned `wrapper`."],
          code: [
            "def loud(fn):",
            "    @wraps(fn)",
            "    def wrapper(*args, **kwargs):",
            "        return str(fn(*args, **kwargs)).upper()",
            "    return wrapper",
            "@loud",
            "def greet(name):",
            "    return f'hello {name}'",
            "print(greet('ada'))",
          ],
          activeLines: [1, 6, 7],
          state: [
            { name: "greet", value: "-> wrapper (closing over original greet)", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "@loud intercepts function definition once and replaces greet with wrapper.",
            nodes: [
              { id: "orig", label: "def greet(name)", sublabel: "original fn" },
              { id: "dec", label: "loud(greet)", sublabel: "called at def time", active: true, tone: "accent" },
              { id: "wrap", label: "greet -> wrapper", sublabel: "holds fn in closure", tone: "ok" },
            ],
            links: [
              { from: "orig", to: "dec", active: true },
              { from: "dec", to: "wrap", active: true },
            ],
          },
        },
        {
          title: "`@wraps(fn)` preserves metadata",
          tag: "MEMORY",
          explanation: ["`@wraps(fn)` copies `__name__` (`'greet'`) and `__doc__` onto `wrapper` instead of leaving `'wrapper'`."],
          code: [
            "def loud(fn):",
            "    @wraps(fn)",
            "    def wrapper(*args, **kwargs):",
            "        return str(fn(*args, **kwargs)).upper()",
            "    return wrapper",
          ],
          activeLines: [2],
          state: [
            { name: "greet.__name__", value: "'greet'", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "@wraps(fn) copies __name__ and __doc__ from original fn onto wrapper.",
            nodes: [
              { id: "fn", label: "original greet", sublabel: "__name__ = 'greet'" },
              { id: "wr", label: "@wraps(fn)", sublabel: "copies metadata", active: true, tone: "accent" },
              { id: "wp", label: "wrapper", sublabel: "__name__ = 'greet'", tone: "ok" },
            ],
            links: [
              { from: "fn", to: "wr", active: true },
              { from: "wr", to: "wp", active: true },
            ],
          },
        },
        {
          title: "Calling `greet('ada')` invokes `wrapper`",
          tag: "TRACE",
          explanation: ["`wrapper` forwards `'ada'` to the original `fn`, gets `'hello ada'`, and uppercases it."],
          code: [
            "print(greet('ada'))",
          ],
          activeLines: [1],
          state: [
            { name: "fn('ada')", value: "'hello ada'" },
            { name: "wrapper returns", value: "'HELLO ADA'", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Runtime call passes through wrapper -> original fn -> .upper() transformation.",
            nodes: [
              { id: "c", label: "greet('ada')", sublabel: "calls wrapper" },
              { id: "f", label: "fn('ada')", sublabel: "'hello ada'", active: true, tone: "accent" },
              { id: "u", label: ".upper()", sublabel: "'HELLO ADA'", tone: "ok" },
            ],
            links: [
              { from: "c", to: "f", active: true },
              { from: "f", to: "u", active: true },
            ],
          },
        },
        {
          title: "Forgetting `return` inside `wrapper` returns `None`",
          tag: "PITFALL",
          explanation: ["Running `fn(*args, **kwargs)` without `return` silently drops the wrapped function's result."],
          code: [
            "def bad_wrapper(*args, **kwargs):",
            "    fn(*args, **kwargs)  # caller receives None!",
          ],
          activeLines: [2],
          state: [
            { name: "caller gets", value: "None", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Omitting return inside wrapper discards fn()'s result and returns None to the caller.",
            nodes: [
              { id: "f", label: "fn(*args)", sublabel: "computes 'hello ada'", tone: "accent" },
              { id: "w", label: "bad_wrapper", sublabel: "no return statement", active: true, tone: "warm" },
              { id: "r", label: "caller gets None", sublabel: "result dropped", tone: "muted" },
            ],
            links: [
              { from: "f", to: "w", active: true },
              { from: "w", to: "r", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting `return fn(*args, **kwargs)` inside `wrapper`",
        detail: "Even logging decorators must capture `res = fn(*args, **kwargs)` and `return res` at the end.",
      },
      {
        title: "Decorator with arguments needs 3 levels (`def repeat(n): def dec(fn): def wrapper(...)`)",
        detail: "Calling `@repeat(3)` executes `repeat(3)` first, which returns the actual decorator.",
      },
    ],
    predictChecks: [
      {
        prompt: "When does `loud` execute in `@loud\ndef greet(): ...` if `greet()` is never called?",
        code: "def loud(fn):\n    print('wrapping')\n    return fn\n@loud\ndef greet(): pass",
        options: [
          { id: "a", label: "Never" },
          { id: "b", label: "Once immediately when `def greet` executes" },
          { id: "c", label: "Twice" },
        ],
        correctId: "b",
        explanation: "`@loud` applies `greet = loud(greet)` at function definition time.",
      },
      {
        prompt: "Why put `@wraps(fn)` on `wrapper` inside a decorator?",
        code: "@wraps(fn)\ndef wrapper(*args, **kwargs): ...",
        options: [
          { id: "a", label: "It preserves `fn.__name__` and `__doc__`" },
          { id: "b", label: "It speeds up function calls" },
          { id: "c", label: "It catches exceptions automatically" },
        ],
        correctId: "a",
        explanation: "`functools.wraps` copies the wrapped function's metadata.",
      },
    ],
    practiceTask: {
      title: "Warmup: `strip_output` decorator with `@wraps`",
      tier: "Warmup",
      goal: "Write decorator `strip_result(fn)` that trims leading/trailing whitespace on `fn`'s string return value while preserving `__name__`.",
      constraints: ["Use `@functools.wraps(fn)`"],
      examples: [
        { input: "banner('hi')", output: "HI" },
        { input: "banner.__name__", output: "banner" },
      ],
      tasks: [
        "Apply `@wraps(fn)` on `wrapper(*args, **kwargs)` and return `fn(*args, **kwargs).strip()`.",
      ],
      starterCode: "# Exercise M09.5 Warmup: basic @wraps decorator\nfrom functools import wraps\n\ndef strip_result(fn):\n    return fn\n",
      expectedOutput: "HI\nbanner",
      hint: "Define `wrapper` decorated with `@wraps(fn)` returning `fn(*args, **kwargs).strip()`.",
      complexity: { time: "O(k)", space: "O(k)" },
      solutionCode:
        "from functools import wraps\n\ndef strip_result(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs).strip()\n    return wrapper\n\n@strip_result\ndef banner(s: str) -> str:\n    return f'  {s.upper()} '\n\nprint(banner('hi'))\nprint(banner.__name__)",
    },
    practiceChallenges: [
      {
        title: "Core: Count calls on a wrapper attribute",
        tier: "Core",
        goal: "Write `@count_calls` adding `wrapper.calls = 0` that increments on every invocation while returning `fn(*args, **kwargs)`.",
        constraints: ["Preserve `__name__` via `@wraps(fn)`"],
        examples: [
          { input: "double(3); double(4)", output: "8 2" },
          { input: "double.__name__", output: "double" },
        ],
        tasks: [
          "Set `wrapper.calls = 0` and increment `wrapper.calls += 1` inside `wrapper`.",
        ],
        starterCode: "# Exercise M09.5 Core: call-counting decorator\nfrom functools import wraps\n\ndef count_calls(fn):\n    return fn\n",
        expectedOutput: "8 2\ndouble",
        hint: "Functions are objects, so `wrapper.calls = 0` works directly.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "from functools import wraps\n\ndef count_calls(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return fn(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@count_calls\ndef double(x: int) -> int:\n    return x * 2\n\ndouble(3)\nprint(double(4), double.calls)\nprint(double.__name__)",
      },
      {
        title: "Stretch: Parameterized `@repeat(times)` decorator",
        tier: "Stretch",
        goal: "Write `repeat(times)` that returns a decorator running `fn(*args, **kwargs)` `times` times and returning the list of results.",
        constraints: ["Preserve `fn.__name__` with `@wraps(fn)`"],
        examples: [
          { input: "@repeat(3) def ping(x)", output: "['ok:a', 'ok:a', 'ok:a']" },
          { input: "ping.__name__", output: "ping" },
        ],
        tasks: [
          "Nest `repeat(times)` -> `decorator(fn)` -> `wrapper(*args, **kwargs)`.",
        ],
        starterCode: "# Exercise M09.5 Stretch: parameterized @repeat(times)\nfrom functools import wraps\n\ndef repeat(times: int):\n    def decorator(fn):\n        return fn\n    return decorator\n",
        expectedOutput: "['ok:a', 'ok:a', 'ok:a']\nping",
        hint: "Inside `wrapper`, return `[fn(*args, **kwargs) for _ in range(times)]`.",
        complexity: { time: "O(times)", space: "O(times)" },
        solutionCode:
          "from functools import wraps\n\ndef repeat(times: int):\n    def decorator(fn):\n        @wraps(fn)\n        def wrapper(*args, **kwargs):\n            return [fn(*args, **kwargs) for _ in range(times)]\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef ping(x: str) -> str:\n    return f'ok:{x}'\n\nprint(ping('a'))\nprint(ping.__name__)",
      },
    ],
  },

  "py-iterators": {
    lessonId: "py-iterators",
    subtitle: "Understand `__iter__`, `__next__`, `StopIteration`, and why exhausted iterators return empty on a second loop.",
    intro: {
      heading: "How `for` loops drive objects one step at a time",
      explanation: [
        "Looping over `zip(names, scores)` or a file handle once and then passing the same object to a second `for` loop yields `[]` with zero errors—and calling `next(it)` on an empty stream crashes with an uncaught `StopIteration`.",
        "Every `for` loop calls `iter(obj)` to obtain a cursor and advances it with `next(it)` until `StopIteration`. Separating reusable containers (iterables) from one-pass cursors (iterators) explains both bugs at once.",
      ],
      analogy: "A printed book (`list` iterable) lets ten people each open their own fresh page-1 bookmark (`iter(book)`), whereas a single shared bookmark (`iterator`) moves forward once and stays at the back cover when finished.",
      realWorldUses: [
        "Short-circuiting searches with `next((x for x in items if cond), None)` without scanning full lists",
        "Avoiding empty-result bugs when passing `zip`, `map`, or file iterators to multiple functions",
      ],
    },
    sections: [
      {
        heading: "Iterables vs iterators (`iter()` and `next()`)",
        paragraphs: [
          "A `list` is an **iterable** (`__iter__` returns a fresh cursor each time). Calling `iter(xs)` returns an **iterator** implementing `__next__()` (plus `__iter__` returning `self`).",
          "Once an iterator raises `StopIteration`, it stays exhausted; a second `for` loop over the same iterator prints zero items.",
        ],
        code: [
          "class Countdown:",
          "    def __init__(self, start: int):",
          "        self.cur = start",
          "    def __iter__(self):",
          "        return self",
          "    def __next__(self) -> int:",
          "        if self.cur <= 0:",
          "            raise StopIteration",
          "        val = self.cur",
          "        self.cur -= 1",
          "        return val",
          "",
          "it = Countdown(3)",
          "print(list(it), list(it))  # second pass is exhausted!",
        ],
        output: "[3, 2, 1] []",
        table: {
          caption: "Iterable vs Iterator",
          headers: ["Concept", "Required methods", "Multi-pass?"],
          rows: [
            ["Iterable (`list`, `str`, `range`)", "`__iter__()` returns a fresh iterator", "Yes"],
            ["Iterator (`iter(xs)`, file, `zip`)", "`__iter__()` returns `self`, `__next__()` advances", "No (single-pass cursor)"],
            ["`next(it, default)`", "Calls `it.__next__()`", "Returns `default` instead of `StopIteration`"],
          ],
        },
      },
      {
        heading: "Exhausted iterator bug vs reusable materialization",
        paragraphs: [
          "Passing a `zip(...)` iterator to `len` or two consecutive loops consumes it on the first pass, leaving `[]` on the second.",
          "Convert to a `list` or `tuple` when you need multiple passes, and pass a fallback to `next(it, None)` on possibly empty iterators.",
        ],
        code: [
          "pairs_iter = zip([1, 2], [\"a\", \"b\"])",
          "",
          "# BUG: second pass reads an already-exhausted iterator -> []",
          "first = list(pairs_iter)",
          "second = list(pairs_iter)",
          "print(\"bug:\", first, second)",
          "",
          "# FIX: materialize once when multiple passes are needed",
          "pairs = list(zip([1, 2], [\"a\", \"b\"]))",
          "print(\"fix:\", pairs, pairs)",
        ],
        output: "bug: [(1, 'a'), (2, 'b')] []\nfix: [(1, 'a'), (2, 'b')] [(1, 'a'), (2, 'b')]",
      },
    ],
    guidedBuildUp: {
      title: "Step Through the Iterator Protocol Manually",
      steps: [
        {
          label: "Step 1: Drive an iterator with `iter()` and `next(..., default)`",
          explanation: "Request a cursor with `iter(...)`, pull elements one by one, and pass `'done'` as the fallback so exhaustion does not raise `StopIteration`.",
          code: [
            "it = iter([10, 20])",
            "print(next(it))",
            "print(next(it))",
            "print(next(it, \"done\"))",
          ],
          activeLines: [1, 2, 4],
          output: "10\n20\ndone",
        },
        {
          label: "Step 2: Implement a one-pass iterator class",
          explanation: "Define `__iter__` returning `self` and `__next__` raising `StopIteration` at `0`; notice the second `list(c)` returns `[]`.",
          code: [
            "class Countdown:",
            "    def __init__(self, start): self.cur = start",
            "    def __iter__(self): return self",
            "    def __next__(self):",
            "        if self.cur <= 0: raise StopIteration",
            "        val = self.cur",
            "        self.cur -= 1",
            "        return val",
            "",
            "c = Countdown(2)",
            "print(list(c), list(c))",
          ],
          activeLines: [3, 4, 5, 11],
          output: "[2, 1] []",
        },
        {
          label: "Step 3: Return a fresh cursor for multi-pass iterables",
          explanation: "Return a new iterator from `__iter__` instead of `self` so every loop starts from the beginning.",
          code: [
            "class ReusableCountdown:",
            "    def __init__(self, start): self.start = start",
            "    def __iter__(self):",
            "        return iter(range(self.start, 0, -1))",
            "",
            "r = ReusableCountdown(2)",
            "print(list(r), list(r))",
          ],
          activeLines: [3, 4, 7],
          output: "[2, 1] [2, 1]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `iter()`, `next()`, and single-pass exhaustion",
      steps: [
        {
          title: "`for` calls `iter(nums)` to allocate a cursor",
          tag: "MEMORY",
          explanation: ["`list` creates an independent `list_iterator` pointing at index 0."],
          code: [
            "nums = [10, 20]",
            "it = iter(nums)",
            "print(next(it))",
            "print(next(it))",
            "print(next(it, 'done'))",
          ],
          activeLines: [2],
          state: [
            { name: "cursor index", value: "0", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "iter(nums) creates an iterator object with its cursor positioned at index 0.",
            trays: [
              {
                label: "nums",
                cells: [
                  { id: "it0", value: "10", index: 0, state: "active" },
                  { id: "it1", value: "20", index: 1, state: "default" },
                ],
                pointers: [{ index: 0, label: "it cursor = 0", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "First `next(it)` returns `10` and advances",
          tag: "TRACE",
          explanation: ["Calling `next(it)` yields `10` and moves the cursor forward to index `1`."],
          code: [
            "nums = [10, 20]",
            "it = iter(nums)",
            "print(next(it))",
            "print(next(it))",
            "print(next(it, 'done'))",
          ],
          activeLines: [3],
          state: [
            { name: "returned", value: "10", changed: true },
            { name: "cursor index", value: "1" },
          ],
          visual: {
            kind: "dsa-array",
            caption: "next(it) yields 10 and advances the cursor forward to index 1.",
            trays: [
              {
                label: "nums",
                cells: [
                  { id: "it0", value: "10", index: 0, state: "done" },
                  { id: "it1", value: "20", index: 1, state: "active" },
                ],
                pointers: [{ index: 1, label: "it cursor = 1", tone: "accent" }],
              },
            ],
          },
        },
        {
          title: "End of sequence raises `StopIteration` (or returns fallback)",
          tag: "CHECK",
          explanation: ["After `20`, `next(it, 'done')` catches `StopIteration` internally and returns `'done'`."],
          code: [
            "nums = [10, 20]",
            "it = iter(nums)",
            "print(next(it))",
            "print(next(it))",
            "print(next(it, 'done'))",
          ],
          activeLines: [5],
          state: [
            { name: "returned", value: "'done'", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Once all items are consumed, next(it, 'done') hits the end and returns 'done'.",
            trays: [
              {
                label: "iterator stream",
                cells: [
                  { id: "it0", value: "10 (seen)", index: 0, state: "done" },
                  { id: "it1", value: "20 (seen)", index: 1, state: "done" },
                  { id: "it2", value: "END -> 'done'", index: 2, state: "active" },
                ],
                pointers: [{ index: 2, label: "fallback", tone: "ok" }],
              },
            ],
          },
        },
        {
          title: "Second loop over an exhausted iterator yields nothing",
          tag: "PITFALL",
          explanation: ["Because `it` holds one cursor and never resets, `list(it)` is `[]` once consumed."],
          code: [
            "z = zip([1, 2], ['a', 'b'])",
            "first = list(z)   # [(1, 'a'), (2, 'b')]",
            "second = list(z)  # []",
          ],
          activeLines: [2, 3],
          state: [
            { name: "first", value: "[(1, 'a'), (2, 'b')]" },
            { name: "second", value: "[]", changed: true },
          ],
          visual: {
            kind: "dsa-array",
            caption: "Iterator z has a single forward cursor: after first consumes both pairs, second starts past EOF and yields [].",
            trays: [
              {
                label: "1st list(z)",
                cells: [
                  { id: "p0", value: "(1, 'a')", index: 0, state: "done" },
                  { id: "p1", value: "(2, 'b')", index: 1, state: "done" },
                ],
              },
              {
                label: "2nd list(z) -> []",
                cells: [
                  { id: "e0", value: "exhausted (empty)", index: 0, state: "dim" },
                ],
                pointers: [{ index: 0, label: "cursor at end", tone: "coral" }],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Consuming `zip(...)` or `map(...)` twice",
        detail: "Both return single-pass iterators; convert with `list(...)` only when you need a second pass.",
      },
      {
        title: "Calling `next(it)` without a default on empty streams",
        detail: "Use `next(it, None)` to avoid an uncaught `StopIteration` crash.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `it = iter([5]); print(list(it), list(it))` output?",
        code: "it = iter([5])\nprint(list(it), list(it))",
        options: [
          { id: "a", label: "`[5] [5]`" },
          { id: "b", label: "`[5] []`" },
          { id: "c", label: "Raises `StopIteration`" },
        ],
        correctId: "b",
        explanation: "The first `list(it)` consumes `it`; the second receives `StopIteration` immediately.",
      },
      {
        prompt: "What does `next(iter([]), 'empty')` return?",
        code: "print(next(iter([]), 'empty'))",
        options: [
          { id: "a", label: "Raises `StopIteration`" },
          { id: "b", label: "`None`" },
          { id: "c", label: "`'empty'`" },
        ],
        correctId: "c",
        explanation: "Passing a default argument to `next(it, default)` suppresses `StopIteration`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Safe first match with `next(..., None)`",
      tier: "Warmup",
      goal: "Write `first_even(nums)` returning the first even number using `next((n for n in nums if n % 2 == 0), None)`.",
      constraints: ["Short-circuit on the first match without scanning the whole list"],
      examples: [
        { input: "[1, 3, 4, 8]", output: "4" },
        { input: "[1, 3, 5]", output: "None" },
      ],
      tasks: [
        "Return `next((n for n in nums if n % 2 == 0), None)`.",
      ],
      starterCode: "# Exercise M09.6 Warmup: short-circuit next()\ndef first_even(nums: list[int]) -> int | None:\n    return None\n",
      expectedOutput: "4\nNone",
      hint: "Supply `None` as the second argument to `next(...)`.",
      complexity: { time: "O(n) worst", space: "O(1)" },
      solutionCode:
        "def first_even(nums: list[int]) -> int | None:\n    return next((n for n in nums if n % 2 == 0), None)\n\nprint(first_even([1, 3, 4, 8]))\nprint(first_even([1, 3, 5]))",
    },
    practiceChallenges: [
      {
        title: "Core: Custom `StepRange` iterator class",
        tier: "Core",
        goal: "Implement `StepRange(start, stop, step)` with `__iter__` returning `self` and `__next__` raising `StopIteration` once `cur >= stop`.",
        constraints: ["Assume `step > 0`"],
        examples: [
          { input: "list(StepRange(1, 8, 3))", output: "[1, 4, 7]" },
          { input: "list(StepRange(5, 5, 1))", output: "[]" },
        ],
        tasks: [
          "Return `self` from `__iter__`.",
          "Yield `cur` then advance `self.cur += self.step` inside `__next__`.",
        ],
        starterCode: "# Exercise M09.6 Core: manual iterator protocol\nclass StepRange:\n    def __init__(self, start: int, stop: int, step: int = 1):\n        self.cur = start\n        self.stop = stop\n        self.step = step\n",
        expectedOutput: "[1, 4, 7]\n[]",
        hint: "Raise `StopIteration` when `self.cur >= self.stop`, otherwise save `val = self.cur`, add `self.step`, and return `val`.",
        complexity: { time: "O(k)", space: "O(1)" },
        solutionCode:
          "class StepRange:\n    def __init__(self, start: int, stop: int, step: int = 1):\n        self.cur = start\n        self.stop = stop\n        self.step = step\n    def __iter__(self):\n        return self\n    def __next__(self) -> int:\n        if self.cur >= self.stop:\n            raise StopIteration\n        val = self.cur\n        self.cur += self.step\n        return val\n\nprint(list(StepRange(1, 8, 3)))\nprint(list(StepRange(5, 5, 1)))",
      },
      {
        title: "Stretch: Separate reusable `NumberBox` iterable",
        tier: "Stretch",
        goal: "Define `NumberBox(limit)` whose `__iter__` returns a fresh iterator each time so two `list(box)` calls both produce `[0..limit-1]`.",
        constraints: ["Returning `self` fails the second loop; return a fresh iterator inside `__iter__`"],
        examples: [
          { input: "b = NumberBox(3); list(b), list(b)", output: "[0, 1, 2] [0, 1, 2]" },
          { input: "list(NumberBox(0))", output: "[]" },
        ],
        tasks: [
          "Return `iter(range(self.limit))` or a fresh `_BoxIter(self.limit)` in `__iter__`.",
        ],
        starterCode: "# Exercise M09.6 Stretch: reusable iterable vs one-shot iterator\nclass NumberBox:\n    def __init__(self, limit: int):\n        self.limit = limit\n",
        expectedOutput: "[0, 1, 2] [0, 1, 2]\n[]",
        hint: "Returning a new iterator object inside `__iter__` makes the container multi-pass.",
        complexity: { time: "O(limit)", space: "O(1)" },
        solutionCode:
          "class NumberBox:\n    def __init__(self, limit: int):\n        self.limit = limit\n    def __iter__(self):\n        return iter(range(self.limit))\n\nb = NumberBox(3)\nprint(list(b), list(b))\nprint(list(NumberBox(0)))",
      },
    ],
  },

  "py-generators": {
    lessonId: "py-generators",
    subtitle: "Write lazy streaming sequences with `yield`, generator expressions, and `yield from` in O(1) memory.",
    intro: {
      heading: "Produce values on demand without buffering full lists",
      explanation: [
        "Loading 10 million log lines into a list (`lines = [f(x) for x in rows]`) reserves hundreds of megabytes of RAM before processing item #1, stalling pipelines or triggering `MemoryError` on big files and unbounded streams.",
        "Any function using `yield` or a `(...)` generator expression produces one value per `next()` call and pauses its stack frame in O(1) extra memory.",
      ],
      analogy: "A deli ticket dispenser: instead of printing ten million tickets into a pile on the floor before serving anyone, `yield` prints one ticket when the next customer pulls.",
      realWorldUses: [
        "Streaming multi-GB logs, CSV exports, and database cursors line by line",
        "Composing lazy filter/transform pipelines (`any()`, `sum()`, `islice()`)",
      ],
    },
    sections: [
      {
        heading: "`yield` functions and generator expressions",
        paragraphs: [
          "Calling a generator function returns a generator object immediately without running line 1 of its body yet. Each `next(gen)` runs until the next `yield`, pauses stack state, and returns that value.",
          "Replacing `[...]` with `(...)` creates a generator expression that streams items lazily into functions like `sum(...)` or `any(...)`.",
        ],
        code: [
          "def evens_up_to(limit: int):",
          "    for n in range(0, limit + 1, 2):",
          "        yield n",
          "",
          "g = evens_up_to(6)",
          "print(next(g), next(g), list(g))",
        ],
        output: "0 2 [4, 6]",
        visual: {
          kind: "compare",
          leftTitle: "List Comprehension [...]",
          rightTitle: "Generator (... / yield)",
          rows: [
            { left: "Builds all N items in RAM upfront", right: "Computes 1 item per next() step", highlight: true },
            { left: "Supports len(), indexing, re-looping", right: "Single-pass lazy stream", highlight: true },
            { left: "Cannot represent infinite streams", right: "Yields unbounded streams on demand" },
          ],
        },
        table: {
          caption: "Generator syntax tools",
          headers: ["Form", "Example", "Behavior"],
          rows: [
            ["`yield val`", "`yield line.strip()`", "Pauses frame, returns `val`, resumes later"],
            ["`(expr for x in xs)`", "`sum(x * x for x in xs)`", "Inline O(1)-memory lazy expression"],
            ["`yield from sub`", "`yield from flatten(item)`", "Delegates directly to a sub-iterable"],
          ],
        },
      },
      {
        heading: "Eager RAM buffering vs lazy `yield` streaming",
        paragraphs: [
          "When passing values into `sum(...)` or `any(...)`, square brackets `[...]` allocate every intermediate item in RAM first, whereas `(...)` streams items one by one.",
          "Remember that generators have no length or index: calling `len(gen)` or `gen[0]` raises `TypeError`.",
        ],
        code: [
          "# BUG: allocates a 100,000-element list in RAM just to find the first match",
          "eager = any([x > 50_000 for x in range(100_000)])",
          "",
          "# FIX: stops on x = 50_001 with O(1) memory",
          "lazy = any(x > 50_000 for x in range(100_000))",
          "print(eager, lazy)",
          "",
          "gen = (x * 2 for x in range(3))",
          "# len(gen)  # BUG: TypeError: object of type 'generator' has no len()",
          "print(next(gen), list(gen))",
        ],
        output: "True True\n0 [2, 4]",
      },
    ],
    guidedBuildUp: {
      title: "Build Streaming Generators Step by Step",
      steps: [
        {
          label: "Step 1: Pause and resume with `yield`",
          explanation: "Replace `list.append` with `yield n` so calling `evens(4)` returns a generator paused before the first item.",
          code: [
            "def evens(limit):",
            "    for n in range(0, limit + 1, 2):",
            "        yield n",
            "",
            "g = evens(4)",
            "print(next(g), next(g), list(g))",
          ],
          activeLines: [3, 5, 6],
          output: "0 2 [4]",
        },
        {
          label: "Step 2: Stream inline with `(expr for ...)`",
          explanation: "Pass generator expressions directly into `sum(...)` and `any(...)` without extra parentheses or list allocation.",
          code: [
            "total = sum(n * n for n in range(1, 5))",
            "has_big = any(n > 10 for n in [3, 8, 12, 99])",
            "print(total, has_big)",
          ],
          activeLines: [1, 2],
          output: "30 True",
        },
        {
          label: "Step 3: Delegate sub-iterables with `yield from`",
          explanation: "Use `yield from flatten(x)` to forward nested elements without writing an inner `for` loop.",
          code: [
            "def flatten(tree):",
            "    for x in tree:",
            "        if isinstance(x, list): yield from flatten(x)",
            "        else: yield x",
            "",
            "print(list(flatten([1, [2, [3, 4]], 5])))",
          ],
          activeLines: [3, 4, 6],
          output: "[1, 2, 3, 4, 5]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace generator pause and resume stack frames",
      steps: [
        {
          title: "Calling generator creates paused frame",
          tag: "CONCEPT",
          explanation: ["`g = count_up(2)` binds `limit = 2` and pauses before executing the loop."],
          code: [
            "def count_up(limit):",
            "    n = 1",
            "    while n <= limit:",
            "        yield n",
            "        n += 1",
            "g = count_up(2)",
            "print(next(g), next(g))",
          ],
          activeLines: [1, 6],
          state: [
            { name: "g", value: "<generator suspended @ line 2>", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Calling count_up(2) returns a suspended generator frame without running the body yet.",
            frames: [{ name: "count_up(2) [suspended]", bindings: [{ label: "limit", targetId: "lim2", highlight: true }] }],
            objects: [{ id: "lim2", typeLabel: "int", value: "2", highlight: true }],
          },
        },
        {
          title: "First `next(g)` runs to `yield n`",
          tag: "TRACE",
          explanation: ["Runs lines 2-4, yields `1`, and freezes local `n = 1` until the caller asks for more."],
          code: [
            "def count_up(limit):",
            "    n = 1",
            "    while n <= limit:",
            "        yield n",
            "        n += 1",
            "g = count_up(2)",
            "print(next(g), next(g))",
          ],
          activeLines: [2, 3, 4],
          state: [
            { name: "yielded", value: "1", changed: true },
            { name: "saved n", value: "1" },
          ],
          visual: {
            kind: "memory",
            caption: "First next(g) pauses at yield n = 1 while keeping locals n and limit alive.",
            frames: [
              {
                name: "count_up [paused @ line 4]",
                bindings: [
                  { label: "limit", targetId: "lim2" },
                  { label: "n", targetId: "vn1", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "lim2", typeLabel: "int", value: "2" },
              { id: "vn1", typeLabel: "int (yield 1)", value: "1", highlight: true },
            ],
          },
        },
        {
          title: "Second `next(g)` resumes right after `yield`",
          tag: "MEMORY",
          explanation: ["Execution continues on `n += 1` (`n = 2`), re-checks `2 <= 2`, and yields `2`."],
          code: [
            "def count_up(limit):",
            "    n = 1",
            "    while n <= limit:",
            "        yield n",
            "        n += 1",
            "g = count_up(2)",
            "print(next(g), next(g))",
          ],
          activeLines: [5, 3, 4],
          state: [
            { name: "yielded", value: "2", changed: true },
            { name: "saved n", value: "2" },
          ],
          visual: {
            kind: "memory",
            caption: "Second next(g) resumes at n += 1 (n -> 2) and yields 2.",
            frames: [
              {
                name: "count_up [paused @ line 4]",
                bindings: [
                  { label: "limit", targetId: "lim2" },
                  { label: "n", targetId: "vn2", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "lim2", typeLabel: "int", value: "2" },
              { id: "vn2", typeLabel: "int (yield 2)", value: "2", highlight: true },
            ],
          },
        },
        {
          title: "Returning ends the generator with `StopIteration`",
          tag: "CHECK",
          explanation: ["When `n` reaches `3`, the loop exits and raises `StopIteration` automatically."],
          code: [
            "print(next(g, 'done'))  # 'done'",
          ],
          activeLines: [1],
          state: [
            { name: "next(g, 'done')", value: "'done'", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "When n = 3 exits the while loop, the generator frame finishes (StopIteration) and next returns 'done'.",
            frames: [{ name: "Globals", bindings: [{ label: "g", targetId: "gen_done", highlight: true }] }],
            objects: [
              { id: "gen_done", typeLabel: "generator (closed)", value: "n=3 exited -> 'done'", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Body does not run until iterated",
        detail: "Exceptions or print statements before the first `yield` only fire when the first `next(g)` executes.",
      },
      {
        title: "No `len(gen)` or `gen[0]`",
        detail: "Generators stream one value at a time; use `next()` or `itertools.islice()`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What prints if you call `g = gen()` where `gen()` starts with `print('start'); yield 1`, without calling `next(g)`?",
        code: "def gen():\n    print('start')\n    yield 1\ng = gen()",
        options: [
          { id: "a", label: "`start`" },
          { id: "b", label: "Nothing prints yet" },
          { id: "c", label: "`1`" },
        ],
        correctId: "b",
        explanation: "A generator body stays paused at the top until the first `next(g)` or `for` iteration.",
      },
      {
        prompt: "Why use `sum(x * x for x in range(10_000_000))` instead of `sum([x * x for x in range(10_000_000)])`?",
        code: "sum(x * x for x in range(10_000_000))",
        options: [
          { id: "a", label: "It keeps memory usage O(1) instead of allocating a 10M-item list" },
          { id: "b", label: "It automatically parallelizes across CPU cores" },
          { id: "c", label: "It returns a list instead of an int" },
        ],
        correctId: "a",
        explanation: "Generator expressions yield values one at a time directly into `sum`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Generator `countdown(n)`",
      tier: "Warmup",
      goal: "Write generator `countdown(n)` yielding integers from `n` down to `1`.",
      constraints: ["Use `yield` inside a `while` or `range` loop"],
      examples: [
        { input: "list(countdown(3))", output: "[3, 2, 1]" },
        { input: "list(countdown(0))", output: "[]" },
      ],
      tasks: [
        "Yield numbers descending from `n` to `1`.",
      ],
      starterCode: "# Exercise M09.7 Warmup: lazy countdown generator\ndef countdown(n: int):\n    yield from ()\n",
      expectedOutput: "[3, 2, 1]\n[]",
      hint: "While `n > 0`, `yield n` then `n -= 1`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "def countdown(n: int):\n    while n > 0:\n        yield n\n        n -= 1\n\nprint(list(countdown(3)))\nprint(list(countdown(0)))",
    },
    practiceChallenges: [
      {
        title: "Core: Infinite Fibonacci prefix with `yield`",
        tier: "Core",
        goal: "Write `fib_stream()` yielding `0, 1, 1, 2, 3, ...` infinitely, and pull the first `k` values using `next(gen)` inside a loop or comprehension.",
        constraints: ["Never allocate the sequence in a list inside `fib_stream`"],
        examples: [
          { input: "k = 6", output: "[0, 1, 1, 2, 3, 5]" },
          { input: "k = 1", output: "[0]" },
        ],
        tasks: [
          "Initialize `a, b = 0, 1` and loop `while True: yield a; a, b = b, a + b`.",
        ],
        starterCode: "# Exercise M09.7 Core: unbounded Fibonacci generator\ndef fib_stream():\n    yield 0\n",
        expectedOutput: "[0, 1, 1, 2, 3, 5]\n[0]",
        hint: "Build `gen = fib_stream()` and pull `k` items with `[next(gen) for _ in range(k)]`.",
        complexity: { time: "O(k)", space: "O(1)" },
        solutionCode:
          "def fib_stream():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ng1 = fib_stream()\nprint([next(g1) for _ in range(6)])\ng2 = fib_stream()\nprint([next(g2) for _ in range(1)])",
      },
      {
        title: "Stretch: Recursive flatten via `yield from`",
        tier: "Stretch",
        goal: "Write `flatten(tree)` yielding integers from arbitrarily nested lists/tuples using `yield from`.",
        constraints: ["Handle non-empty and empty nested lists"],
        examples: [
          { input: "[1, [2, [3, 4]], 5]", output: "[1, 2, 3, 4, 5]" },
          { input: "[[], [9]]", output: "[9]" },
        ],
        tasks: [
          "If `isinstance(item, (list, tuple))`, run `yield from flatten(item)`; else `yield item`.",
        ],
        starterCode: "# Exercise M09.7 Stretch: yield from recursive flatten\ndef flatten(tree):\n    yield from ()\n",
        expectedOutput: "[1, 2, 3, 4, 5]\n[9]",
        hint: "Check `isinstance(x, (list, tuple))` inside the loop.",
        complexity: { time: "O(total elements)", space: "O(depth)" },
        solutionCode:
          "def flatten(tree):\n    for x in tree:\n        if isinstance(x, (list, tuple)):\n            yield from flatten(x)\n        else:\n            yield x\n\nprint(list(flatten([1, [2, [3, 4]], 5])))\nprint(list(flatten([[], [9]])))",
      },
    ],
  },

  "py-type-hints": {
    lessonId: "py-type-hints",
    subtitle: "Annotate function contracts with `list[str]`, `X | None`, `TypedDict`, and structural `Protocol` checks.",
    intro: {
      heading: "Document data shapes for editors and static checkers",
      explanation: [
        "When `lookup(uid)` returns `None` on a cache miss and a caller runs `name.upper()` without checking, dynamic Python accepts the code silently until that rare miss hits production and crashes with `AttributeError: 'NoneType' object has no attribute 'upper'`.",
        "Type hints (`str | None`, `TypedDict`, `Protocol`) let editors and static checkers (`mypy`, `pyright`) catch missing `None` guards and wrong dictionary keys before the code runs.",
      ],
      analogy: "Shipping crate labels inspected at the loading dock: `mypy` checks every label (`str | None`, `ItemRow`) before dispatch so mismatched boxes never leave the warehouse, even though Python itself ignores labels at runtime.",
      realWorldUses: [
        "Catching forgotten `None` checks across multi-file APIs with `mypy --strict`",
        "Typing JSON objects (`TypedDict`) and duck-typed interfaces (`Protocol`)",
      ],
    },
    sections: [
      {
        heading: "Modern Python annotations, `TypedDict`, and `Protocol`",
        paragraphs: [
          "Since Python 3.10+, built-in generics (`list[str]`, `dict[str, int]`) and union pipes (`User | None`) replace verbose `typing.List` and `typing.Optional` imports.",
          "Type annotations are metadata inspected by static analyzers; Python itself does not enforce them automatically at runtime.",
        ],
        code: [
          "from typing import Protocol, TypedDict",
          "",
          "class UserPayload(TypedDict):",
          "    name: str",
          "    active: bool",
          "",
          "class Writable(Protocol):",
          "    def write(self, text: str) -> int: ...",
          "",
          "def find_user(users: dict[int, UserPayload], uid: int) -> str | None:",
          "    row = users.get(uid)",
          "    return row[\"name\"] if row is not None else None",
          "",
          "print(find_user({1: {\"name\": \"Ada\", \"active\": True}}, 1))",
        ],
        output: "Ada",
        table: {
          caption: "Common type hint constructs",
          headers: ["Annotation", "Meaning", "Runtime effect"],
          rows: [
            ["`list[int]`, `dict[str, float]`", "Parameterized container elements", "None (checked statically)"],
            ["`str | None`", "Either `str` or `None`", "Forces `is None` guard in `mypy`"],
            ["`TypedDict`", "Dictionary with fixed keys and value types", "Creates plain `dict` at runtime"],
            ["`Protocol`", "Structural interface (duck typing)", "No inheritance needed"],
          ],
        },
      },
      {
        heading: "Missing `None` guard vs type narrowing",
        paragraphs: [
          "Calling `.upper()` directly on a `str | None` result passes syntax checks yet fails statically in `mypy` and crashes at runtime whenever a key is missing.",
          "Guarding with `if name is not None:` narrows the static type to `str`, and remember that annotations never convert `'1'` to `1` at runtime.",
        ],
        code: [
          "def find_label(labels: dict[int, str], uid: int) -> str | None:",
          "    return labels.get(uid)",
          "",
          "val = find_label({1: \"ok\"}, 99)",
          "",
          "# BUG: val is None -> AttributeError at runtime (flagged by mypy)",
          "# print(val.upper())",
          "",
          "# FIX: narrow str | None -> str before calling .upper()",
          "print(val.upper() if val is not None else \"MISSING\")",
        ],
        output: "MISSING",
      },
    ],
    guidedBuildUp: {
      title: "Add Static Contracts Step by Step",
      steps: [
        {
          label: "Step 1: Annotate optional returns with `str | None`",
          explanation: "Mark `get_user` as returning `str | None` so callers know a missing ID can yield `None`.",
          code: [
            "def get_user(rows: dict[int, str], uid: int) -> str | None:",
            "    return rows.get(uid)",
            "",
            "print(get_user({1: \"Ada\"}, 2))",
          ],
          activeLines: [1, 2],
          output: "None",
        },
        {
          label: "Step 2: Narrow `str | None` with `is not None`",
          explanation: "Check `if name is not None:` before calling `.upper()` so static checkers narrow `name` to `str`.",
          code: [
            "def get_user(rows: dict[int, str], uid: int) -> str | None:",
            "    return rows.get(uid)",
            "",
            "name = get_user({1: \"Ada\"}, 1)",
            "if name is not None:",
            "    print(name.upper())",
          ],
          activeLines: [5, 6],
          output: "ADA",
        },
        {
          label: "Step 3: Accept any matching shape via `Protocol`",
          explanation: "Define `Summarizer(Protocol)` so `Short` satisfies `show(s: Summarizer, ...)` without inheriting from a base class.",
          code: [
            "from typing import Protocol",
            "",
            "class Summarizer(Protocol):",
            "    def summarize(self, text: str) -> str: ...",
            "",
            "class Short:",
            "    def summarize(self, text: str) -> str: return text[:3]",
            "",
            "def show(s: Summarizer, text: str) -> None:",
            "    print(s.summarize(text))",
            "show(Short(), \"hello\")",
          ],
          activeLines: [3, 4, 9, 11],
          output: "hel",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace static type narrowing vs runtime behavior",
      steps: [
        {
          title: "Return union `str | None` signals optional absence",
          tag: "CONCEPT",
          explanation: ["Annotating `-> str | None` tells callers and `mypy` the return value may be `None`."],
          code: [
            "def get_name(rows: dict[int, str], uid: int) -> str | None:",
            "    return rows.get(uid)",
            "name = get_name({1: 'Ada'}, 2)",
            "if name is not None:",
            "    print(name.upper())",
          ],
          activeLines: [1, 2, 3],
          state: [
            { name: "name type before check", value: "str | None", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Type checker tracks union str | None and blocks .upper() until None is ruled out.",
            branches: [
              { id: "u", label: "name : str | None", status: "active" },
              { id: "call", label: "name.upper() here -> blocked by type checker", status: "false" },
            ],
          },
        },
        {
          title: "`is not None` narrows type to `str`",
          tag: "CHECK",
          explanation: ["Inside `if name is not None:`, the type checker narrows `name` from `str | None` down to `str`, allowing `.upper()` without crashing."],
          code: [
            "def get_name(rows: dict[int, str], uid: int) -> str | None:",
            "    return rows.get(uid)",
            "name = get_name({1: 'Ada'}, 2)",
            "if name is not None:",
            "    print(name.upper())",
          ],
          activeLines: [4, 5],
          state: [
            { name: "name type inside if", value: "str", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "After if name is not None:, static analysis narrows name to str inside the branch.",
            branches: [
              { id: "chk", label: "if name is not None -> narrows to str", status: "true" },
              { id: "up", label: "name.upper() -> verified safe", status: "true" },
            ],
          },
        },
        {
          title: "`Protocol` matches by methods, not inheritance",
          tag: "PATTERN",
          explanation: ["Any object exposing `def send(self, msg: str) -> None:` satisfies `Sender` without writing `class Email(Sender)`."],
          code: [
            "class Sender(Protocol):",
            "    def send(self, msg: str) -> None: ...",
            "class FakeSender:",
            "    def send(self, msg: str) -> None: print(msg)",
          ],
          activeLines: [1, 3, 4],
          state: [
            { name: "FakeSender", value: "valid Sender structurally", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Protocol checks method shape structurally instead of requiring inheritance from a base class.",
            branches: [
              { id: "sig", label: "FakeSender.send(self, msg: str) -> None matches", status: "true" },
              { id: "acc", label: "Accepted as Sender with zero base class", status: "active" },
            ],
          },
        },
        {
          title: "Type hints do not cast values at runtime",
          tag: "PITFALL",
          explanation: ["Calling `add('1', '2')` on `def add(a: int, b: int)` still concatenates strings unless `mypy` catches it statically."],
          code: [
            "def add(a: int, b: int) -> int:",
            "    return a + b",
            "print(add('1', '2'))  # '12' at runtime!",
          ],
          activeLines: [3],
          state: [
            { name: "runtime output", value: "'12' (unverified dynamically)", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Static type checkers flag mismatches early, while Python runtime ignores annotations and outputs '12'.",
            branches: [
              { id: "chk", label: "mypy/pyright: flags str passed to int param", status: "false" },
              { id: "run", label: "Python runtime: ignores hints -> returns '12'", status: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Assuming Python converts inputs to match type annotations",
        detail: "Annotations never call `int()` or validate types at runtime; use explicit parsing or runtime libraries like `pydantic` at boundaries.",
      },
      {
        title: "Using `dict[str, any]` (lowercase `any`) instead of `Any`",
        detail: "`any` is a built-in function, whereas `from typing import Any` is the special wildcard type.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `def double(x: int) -> int: return x * 2; print(double('hi'))` print at runtime?",
        code: "def double(x: int) -> int:\n    return x * 2\nprint(double('hi'))",
        options: [
          { id: "a", label: "Raises `TypeError`" },
          { id: "b", label: "`hihi`" },
          { id: "c", label: "Raises `ValueError`" },
        ],
        correctId: "b",
        explanation: "Type annotations are not enforced by CPython at runtime.",
      },
      {
        prompt: "When should a class satisfy a `Protocol` instead of inheriting from a base class?",
        code: "class Writer(Protocol):\n    def write(self, data: str) -> int: ...",
        options: [
          { id: "a", label: "When you want structural typing without coupling third-party or fake classes to a shared base" },
          { id: "b", label: "When you need automatic `__init__` generation" },
          { id: "c", label: "When replacing enums" },
        ],
        correctId: "a",
        explanation: "`Protocol` validates method signatures structurally.",
      },
    ],
    practiceTask: {
      title: "Warmup: Annotate `safe_divide` returning `float | None`",
      tier: "Warmup",
      goal: "Write `safe_divide(a: float, b: float) -> float | None` returning `None` when `b == 0` else `a / b`.",
      constraints: ["Include explicit parameter and return annotations"],
      examples: [
        { input: "10, 2", output: "5.0" },
        { input: "10, 0", output: "None" },
      ],
      tasks: [
        "Guard `if b == 0: return None` and return `a / b`.",
      ],
      starterCode: "# Exercise M09.8 Warmup: union float | None annotation\ndef safe_divide(a: float, b: float) -> float | None:\n    return None\n",
      expectedOutput: "5.0\nNone",
      hint: "Return `None if b == 0 else a / b`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def safe_divide(a: float, b: float) -> float | None:\n    if b == 0:\n        return None\n    return a / b\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))",
    },
    practiceChallenges: [
      {
        title: "Core: Structural `Protocol` formatter helper",
        tier: "Core",
        goal: "Define `class Summarizer(Protocol)` (`def summarize(self, text: str) -> str: ...`) and `run_summary(s: Summarizer, text: str) -> str` working on unrelated classes.",
        constraints: ["Do not inherit `Shortener` from `Summarizer`"],
        examples: [
          { input: "Shortener, 'hello world'", output: "hello..." },
          { input: "UpperSum, 'ok'", output: "OK" },
        ],
        tasks: [
          "Define `Summarizer(Protocol)` and call `s.summarize(text)`.",
        ],
        starterCode: "# Exercise M09.8 Core: Protocol duck typing\nfrom typing import Protocol\n\nclass Summarizer(Protocol):\n    def summarize(self, text: str) -> str: ...\n\ndef run_summary(s: Summarizer, text: str) -> str:\n    return ''\n",
        expectedOutput: "hello...\nOK",
        hint: "`run_summary` delegates to `s.summarize(text)`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "from typing import Protocol\n\nclass Summarizer(Protocol):\n    def summarize(self, text: str) -> str: ...\n\nclass Shortener:\n    def summarize(self, text: str) -> str: return text[:5] + '...'\n\nclass UpperSum:\n    def summarize(self, text: str) -> str: return text.upper()\n\ndef run_summary(s: Summarizer, text: str) -> str:\n    return s.summarize(text)\n\nprint(run_summary(Shortener(), 'hello world'))\nprint(run_summary(UpperSum(), 'ok'))",
      },
      {
        title: "Stretch: `TypedDict` payload validator",
        tier: "Stretch",
        goal: "Define `ItemRow(TypedDict)` (`sku: str`, `qty: int`) and `total_units(rows: list[ItemRow]) -> int` summing quantities where `qty > 0`.",
        constraints: ["Annotate parameters and return value"],
        examples: [
          { input: "[{'sku': 'a', 'qty': 3}, {'sku': 'b', 'qty': -1}]", output: "3" },
          { input: "[]", output: "0" },
        ],
        tasks: [
          "Return `sum(r['qty'] for r in rows if r['qty'] > 0)`.",
        ],
        starterCode: "# Exercise M09.8 Stretch: TypedDict row aggregation\nfrom typing import TypedDict\n\nclass ItemRow(TypedDict):\n    sku: str\n    qty: int\n\ndef total_units(rows: list[ItemRow]) -> int:\n    return 0\n",
        expectedOutput: "3\n0",
        hint: "`TypedDict` rows behave like normal dicts at runtime (`r['qty']`).",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "from typing import TypedDict\n\nclass ItemRow(TypedDict):\n    sku: str\n    qty: int\n\ndef total_units(rows: list[ItemRow]) -> int:\n    return sum(r['qty'] for r in rows if r['qty'] > 0)\n\nprint(total_units([{'sku': 'a', 'qty': 3}, {'sku': 'b', 'qty': -1}]))\nprint(total_units([]))",
      },
    ],
  },

  "py-modules-packages": {
    lessonId: "py-modules-packages",
    subtitle: "Organize code across `.py` modules and packages, prevent import shadowing, and guard scripts with `if __name__ == '__main__':`.",
    intro: {
      heading: "Separate reusable library functions from script execution",
      explanation: [
        "Running `python pkg/cli.py` inside a package folder fails with `ModuleNotFoundError` because `sys.path[0]` points inside `pkg/` instead of the repo root. Naming a scratch file `json.py` shadows Python's standard library, circular imports crash during module loading, and top-level script calls run automatically whenever a test file imports a helper.",
        "Guarding script entrypoints with `if __name__ == '__main__':`, running packages via `python -m pkg.cli`, and keeping dependencies acyclic turns flat scripts into reusable modules.",
      ],
      analogy: "A front-desk bell on a library door: `if __name__ == '__main__':` only rings when someone walks in directly (`python app.py`), staying quiet when another module borrows a book via `import app`.",
      realWorldUses: [
        "Importing helper functions into `pytest` suites without triggering CLI startup or network calls",
        "Running multi-file packages from the repo root with `python -m pkg.cli`",
      ],
    },
    sections: [
      {
        heading: "Modules, packages, and `__name__ == '__main__'`",
        paragraphs: [
          "When Python runs `python app.py` or `python -m pkg.cli`, that entrypoint module's `__name__` is `'__main__'`. When another module runs `import app`, `app.__name__` is `'app'`, skipping the `if __name__ == '__main__':` block.",
          "Never name a script after a standard library module (like `random.py` or `json.py`), because Python checks the current script directory first and imports your file instead of the standard library.",
        ],
        code: [
          "# math_utils.py",
          "def clamp(x: int, lo: int, hi: int) -> int:",
          "    return max(lo, min(hi, x))",
          "",
          "def main() -> None:",
          "    print(\"Demo clamp:\", clamp(15, 0, 10))",
          "",
          "if __name__ == \"__main__\":",
          "    main()",
        ],
        output: "Demo clamp: 10",
        table: {
          caption: "Import and execution patterns",
          headers: ["Pattern", "Value / Meaning", "Best practice"],
          rows: [
            ["`__name__` (run directly)", "`'__main__'`", "Put CLI code inside `if __name__ == '__main__':`"],
            ["`__name__` (imported)", "Module dotted name e.g. `'pkg.utils'`", "No side effects on import"],
            ["`python -m pkg.cli`", "Runs package module with project root on `sys.path`", "Prefer for multi-file packages"],
            ["Package directory", "Folder containing `__init__.py`", "Defines importable subpackages"],
          ],
        },
      },
      {
        heading: "Import shadowing, circular imports, and unguarded scripts",
        paragraphs: [
          "Top-level `main()` calls without `if __name__ == '__main__':` execute as soon as another module runs `import math_utils`.",
          "If `a.py` imports `b` at the top while `b.py` imports `a`, Python raises `ImportError` on the half-initialized module. Move shared helpers into a third `shared.py` module so imports flow one way.",
        ],
        code: [
          "# BUG 1: unguarded top-level call runs on import",
          "# print(clamp(15, 0, 10))",
          "",
          "# BUG 2: naming a file json.py shadows stdlib json",
          "# import json; json.loads('{}')  -> AttributeError",
          "",
          "# FIX: guard script entrypoints with __name__ == '__main__'",
          "def run_check(mod_name: str) -> str:",
          "    return \"execute\" if mod_name == \"__main__\" else \"import-only\"",
          "",
          "print(run_check(\"__main__\"), run_check(\"pkg.math_utils\"))",
        ],
        output: "execute import-only",
      },
    ],
    guidedBuildUp: {
      title: "Structure a Reusable Module Step by Step",
      steps: [
        {
          label: "Step 1: Isolate pure helper functions",
          explanation: "Define `clamp` with zero global side effects so tests and other files can import it.",
          code: [
            "def clamp(x: int, lo: int, hi: int) -> int:",
            "    return max(lo, min(hi, x))",
            "print(clamp(15, 0, 10))",
          ],
          activeLines: [1, 2],
          output: "10",
        },
        {
          label: "Step 2: Guard CLI execution with `if __name__ == '__main__':`",
          explanation: "Move demo prints behind `if __name__ == \"__main__\":` so `import` stays silent.",
          code: [
            "def clamp(x: int, lo: int, hi: int) -> int:",
            "    return max(lo, min(hi, x))",
            "",
            "if __name__ == \"__main__\":",
            "    print(clamp(15, 0, 10))",
          ],
          activeLines: [4, 5],
          output: "10",
        },
        {
          label: "Step 3: Launch package modules with `python -m`",
          explanation: "Use `python -m pkg.cli` from the project root so `sys.path[0]` points at the repo root and package imports resolve.",
          code: [
            "# pkg/cli.py imports from repo root:",
            "# from pkg.utils import clamp",
            "# Terminal: python -m pkg.cli",
            "mod_name = \"pkg.cli\"",
            "print(mod_name.replace(\".\", \"/\") + \".py\")",
          ],
          activeLines: [1, 2, 3],
          output: "pkg/cli.py",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace import paths and `__name__` guard behavior",
      steps: [
        {
          title: "Running directly sets `__name__ = '__main__'`",
          tag: "TRACE",
          explanation: ["Executing `python app.py` sets `__name__` to `'__main__'`, running `main()`."],
          code: [
            "def add(a, b): return a + b",
            "if __name__ == '__main__':",
            "    print(add(2, 3))",
          ],
          activeLines: [2, 3],
          state: [
            { name: "__name__", value: "'__main__'", changed: true },
            { name: "main()", value: "executes" },
          ],
          visual: {
            kind: "trace",
            caption: "Running python app.py directly sets __name__ to '__main__' so the guard executes.",
            branches: [
              { id: "nm", label: "__name__ == '__main__' -> True", status: "true" },
              { id: "run", label: "print(add(2, 3)) runs", status: "true" },
            ],
          },
        },
        {
          title: "Importing skips `if __name__ == '__main__'`",
          tag: "CHECK",
          explanation: ["When `test_app.py` runs `from app import add`, `app.__name__` is `'app'`, so `print(add(2, 3))` stays quiet."],
          code: [
            "# inside test_app.py:",
            "from app import add",
            "assert add(2, 3) == 5",
          ],
          activeLines: [2],
          state: [
            { name: "app.__name__", value: "'app'", changed: true },
            { name: "import side effects", value: "none" },
          ],
          visual: {
            kind: "trace",
            caption: "Importing app sets app.__name__ to 'app', skipping top-level CLI side effects.",
            branches: [
              { id: "nm", label: "app.__name__ == 'app' != '__main__'", status: "false" },
              { id: "sk", label: "__main__ block skipped", status: "skipped" },
            ],
          },
        },
        {
          title: "Spot module name shadowing",
          tag: "PITFALL",
          explanation: ["Saving a file as `json.py` next to `main.py` causes `import json` to load your local file, triggering `AttributeError: module 'json' has no attribute 'loads'`."],
          code: [
            "# BAD filename: json.py in project folder",
            "import json  # loads local json.py instead of stdlib!",
          ],
          activeLines: [2],
          state: [
            { name: "sys.path[0]", value: "shadows stdlib json", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "sys.path[0] (your project folder) is searched before the Python standard library.",
            branches: [
              { id: "p0", label: "1. ./json.py checked first (shadows stdlib!)", status: "false" },
              { id: "p1", label: "2. stdlib/json.py never reached", status: "skipped" },
            ],
          },
        },
        {
          title: "Use `python -m` for package subcommands",
          tag: "PATTERN",
          explanation: ["Running `python -m myapp.cli` anchors imports at the repo root instead of inside `myapp/`."],
          code: [
            "# terminal: python -m myapp.cli",
          ],
          activeLines: [1],
          state: [
            { name: "root on sys.path", value: "project root", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "python -m places the project root on sys.path so absolute imports like myapp.models resolve normally.",
            branches: [
              { id: "cmd", label: "python -m myapp.cli -> sys.path[0] = repo root", status: "true" },
              { id: "imp", label: "import myapp.models -> resolves sibling package", status: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Shadowing stdlib modules (`email.py`, `json.py`, `random.py`)",
        detail: "Always check that script filenames do not collide with Python standard library module names.",
      },
      {
        title: "Circular imports (`a` imports `b` while `b` imports `a`)",
        detail: "Extract shared types or helpers into a third module so dependencies form a directed acyclic graph.",
      },
    ],
    predictChecks: [
      {
        prompt: "If `helper.py` ends with `if __name__ == '__main__': print('ran')`, what happens when `main.py` runs `import helper`?",
        code: "# main.py\nimport helper",
        options: [
          { id: "a", label: "Prints `'ran'`" },
          { id: "b", label: "Nothing prints because `helper.__name__` is `'helper'`" },
          { id: "c", label: "Raises `ImportError`" },
        ],
        correctId: "b",
        explanation: "Only the directly executed script has `__name__ == '__main__'`.",
      },
      {
        prompt: "Why does `python -m myapp.cli` prevent `ModuleNotFoundError` on `from myapp import utils`?",
        code: "# terminal: python -m myapp.cli",
        options: [
          { id: "a", label: "`-m` adds the current working directory (package root) to `sys.path`" },
          { id: "b", label: "`-m` installs missing PyPI packages" },
          { id: "c", label: "`-m` disables `__init__.py`" },
        ],
        correctId: "a",
        explanation: "Running as a module puts the top-level project root on `sys.path` rather than the nested folder.",
      },
    ],
    practiceTask: {
      title: "Warmup: Simulate `__name__` execution guard",
      tier: "Warmup",
      goal: "Write `run_if_main(mod_name, fn)` that returns `fn()` only if `mod_name == '__main__'`, otherwise `'imported'`.",
      constraints: ["Match Python's script vs module execution guard rule"],
      examples: [
        { input: "'__main__', lambda: 'started'", output: "started" },
        { input: "'pkg.utils', lambda: 'started'", output: "imported" },
      ],
      tasks: [
        "Return `fn()` when `mod_name == '__main__'`, else `'imported'`.",
      ],
      starterCode: "# Exercise M09.9 Warmup: __name__ entrypoint guard\ndef run_if_main(mod_name: str, fn):\n    return ''\n",
      expectedOutput: "started\nimported",
      hint: "Compare `mod_name == '__main__'` explicitly.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def run_if_main(mod_name: str, fn):\n    if mod_name == '__main__':\n        return fn()\n    return 'imported'\n\nprint(run_if_main('__main__', lambda: 'started'))\nprint(run_if_main('pkg.utils', lambda: 'started'))",
    },
    practiceChallenges: [
      {
        title: "Core: Detect stdlib module name shadowing",
        tier: "Core",
        goal: "Write `find_shadowed(filenames, stdlib_names)` returning sorted stems without `.py` that collide with `stdlib_names`.",
        constraints: ["Handle mixed directory paths such as `'src/json.py'` by checking filename stem"],
        examples: [
          { input: "['app.py', 'json.py', 'random.py'], {'json', 'random', 'sys'}", output: "['json', 'random']" },
          { input: "['helper.py', 'utils/io.py'], {'json', 'os'}", output: "[]" },
        ],
        tasks: [
          "Extract filename stem with `Path(p).stem` and keep stems present in `stdlib_names`.",
        ],
        starterCode: "# Exercise M09.9 Core: detect stdlib shadowing\nfrom pathlib import Path\n\ndef find_shadowed(filenames: list[str], stdlib_names: set[str]) -> list[str]:\n    return []\n",
        expectedOutput: "['json', 'random']\n[]",
        hint: "Use `sorted(Path(f).stem for f in filenames if Path(f).stem in stdlib_names)`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "from pathlib import Path\n\ndef find_shadowed(filenames: list[str], stdlib_names: set[str]) -> list[str]:\n    return sorted(Path(f).stem for f in filenames if Path(f).stem in stdlib_names)\n\nprint(find_shadowed(['app.py', 'json.py', 'random.py'], {'json', 'random', 'sys'}))\nprint(find_shadowed(['helper.py', 'utils/io.py'], {'json', 'os'}))",
      },
      {
        title: "Stretch: Resolve dotted module path into file candidates",
        tier: "Stretch",
        goal: "Write `module_candidates(dotted)` returning `[dotted.replace('.', '/') + '.py', dotted.replace('.', '/') + '/__init__.py']`.",
        constraints: ["Work for top-level (`'os'`) and nested (`'pkg.sub.mod'`) modules"],
        examples: [
          { input: "'pkg.sub.mod'", output: "['pkg/sub/mod.py', 'pkg/sub/mod/__init__.py']" },
          { input: "'utils'", output: "['utils.py', 'utils/__init__.py']" },
        ],
        tasks: [
          "Convert dots to slashes once and return both `.py` and `/__init__.py` paths.",
        ],
        starterCode: "# Exercise M09.9 Stretch: dotted import to file paths\ndef module_candidates(dotted: str) -> list[str]:\n    return []\n",
        expectedOutput: "['pkg/sub/mod.py', 'pkg/sub/mod/__init__.py']\n['utils.py', 'utils/__init__.py']",
        hint: "Compute `rel = dotted.replace('.', '/')` first.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def module_candidates(dotted: str) -> list[str]:\n    rel = dotted.replace('.', '/')\n    return [f'{rel}.py', f'{rel}/__init__.py']\n\nprint(module_candidates('pkg.sub.mod'))\nprint(module_candidates('utils'))",
      },
    ],
  },

  "py-venv-packaging": {
    lessonId: "py-venv-packaging",
    subtitle: "Isolate project dependencies with `.venv`, `python -m pip`, and standard `pyproject.toml` manifests.",
    intro: {
      heading: "Keep each project's packages isolated and reproducible",
      explanation: [
        "Installing packages into global Python breaks older projects whenever a newer project upgrades a shared dependency like `httpx` or `pydantic`. Running bare `pip install pkg` also fails silently when `pip` on your `PATH` points to a different Python interpreter than the `.venv` running your script.",
        "Creating a per-project `.venv`, installing via `python -m pip`, and declaring versions inside `pyproject.toml` keeps every project isolated and reproducible across laptops and CI.",
      ],
      analogy: "Giving each workshop project its own locked toolbox (`.venv`) and printed parts manifest (`pyproject.toml`): upgrading a tool in Box B never removes the older version needed in Box A.",
      realWorldUses: [
        "Preventing dependency version clashes between client or microservice repos",
        "Declaring dependencies, scripts, and tooling config inside one `pyproject.toml`",
      ],
    },
    sections: [
      {
        heading: "`.venv` workflow, `python -m pip`, and `pyproject.toml`",
        paragraphs: [
          "Always run `python -m pip install ...` instead of bare `pip install ...` so packages install into the exact interpreter running your code.",
          "Modern Python projects declare metadata and runtime dependencies inside `pyproject.toml` rather than legacy `setup.py` files.",
        ],
        code: [
          "# 1. Create isolated environment:",
          "# python -m venv .venv",
          "# 2. Install via that interpreter:",
          "# .venv/bin/python -m pip install -e .[dev]",
          "",
          "# Minimal pyproject.toml parsed via tomllib (Python 3.11+):",
          "import tomllib",
          "toml = '''",
          "[project]",
          "name = \"logtool\"",
          "version = \"0.1.0\"",
          "dependencies = [\"httpx>=0.27\"]",
          "'''",
          "cfg = tomllib.loads(toml)",
          "print(cfg[\"project\"][\"name\"], cfg[\"project\"][\"dependencies\"])",
        ],
        output: "logtool ['httpx>=0.27']",
        table: {
          caption: "Environment and manifest commands",
          headers: ["Command / File", "Purpose", "Why it matters"],
          rows: [
            ["`python -m venv .venv`", "Creates isolated project interpreter", "Keep `.venv/` out of git via `.gitignore`"],
            ["`python -m pip install pkg`", "Installs using active Python executable", "Avoids mismatches between `pip` and `python`"],
            ["`pyproject.toml`", "Standard build + dependency manifest", "Replaces legacy `setup.py`"],
            ["`requirements.txt` / lockfile", "Pinned exact versions", "Reproducible deployments"],
          ],
        },
      },
      {
        heading: "Global `pip` drift vs `.venv` + `python -m pip`",
        paragraphs: [
          "When `pip` points to `/usr/local/bin/pip` while your editor runs `.venv/bin/python`, `pip install httpx` installs globally and your script still raises `ModuleNotFoundError`.",
          "Invoking `.venv/bin/python -m pip` (or activating `.venv` first) guarantees the installer and runtime match.",
        ],
        code: [
          "# BUG: bare pip can target global Python while script uses .venv",
          "# pip install httpx",
          "# .venv/bin/python app.py  -> ModuleNotFoundError: No module named 'httpx'",
          "",
          "# FIX: invoke pip as a module of the target interpreter",
          "cmd = [\".venv/bin/python\", \"-m\", \"pip\", \"install\", \"httpx>=0.27\"]",
          "print(\" \".join(cmd))",
        ],
        output: ".venv/bin/python -m pip install httpx>=0.27",
      },
    ],
    guidedBuildUp: {
      title: "Set Up an Isolated Project and Parse `pyproject.toml` Step by Step",
      steps: [
        {
          label: "Step 1: Create `.venv` and install via `-m pip`",
          explanation: "Create the `.venv` directory and invoke `-m pip` using that environment's Python binary.",
          code: [
            "# Create isolated environment:",
            "# python -m venv .venv",
            "# .venv/bin/python -m pip install httpx  (Windows: .venv\\Scripts\\python.exe)",
          ],
          activeLines: [2, 3],
        },
        {
          label: "Step 2: Parse `pyproject.toml` with stdlib `tomllib`",
          explanation: "Load TOML metadata into a nested dictionary using Python 3.11+ `tomllib.loads`.",
          code: [
            "import tomllib",
            "raw = '[project]\\nname = \"logtool\"\\ndependencies = [\"httpx>=0.27\"]'",
            "cfg = tomllib.loads(raw)",
            "print(cfg[\"project\"][\"name\"])",
          ],
          activeLines: [1, 3],
          output: "logtool",
        },
        {
          label: "Step 3: Read optional dependency lists with `.get` defaults",
          explanation: "Chain `.get(\"project\", {}).get(\"dependencies\", [])` so manifests without dependencies return `[]` instead of `KeyError`.",
          code: [
            "import tomllib",
            "cfg = tomllib.loads('[project]\\nname = \"logtool\"\\ndependencies = [\"httpx>=0.27\"]')",
            "deps = cfg.get(\"project\", {}).get(\"dependencies\", [])",
            "print(deps)",
          ],
          activeLines: [3, 4],
          output: "['httpx>=0.27']",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Walk through `.venv` isolation and `pyproject.toml` loading",
        steps: [
          {
            title: "Create and activate `.venv`",
            tag: "CONCEPT",
            explanation: ["`python -m venv .venv` creates an isolated directory with its own `python` binary and empty `site-packages`."],
            code: [
              "# macOS/Linux: source .venv/bin/activate",
              "# Windows PS:  .venv\\Scripts\\Activate.ps1",
            ],
            activeLines: [1, 2],
            state: [
              { name: "sys.prefix", value: "<repo>/.venv", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "Activating .venv points your shell python command to the project's isolated site-packages.",
              nodes: [
                { id: "v1", label: "python -m venv .venv", sublabel: "creates .venv/", active: true, tone: "accent" },
                { id: "v2", label: "Activate.ps1 / activate", sublabel: "updates shell PATH", tone: "ok" },
                { id: "v3", label: ".venv/site-packages", sublabel: "project-only packages", tone: "ok" },
              ],
              links: [
                { from: "v1", to: "v2", active: true },
                { from: "v2", to: "v3", label: "isolates" },
              ],
            },
          },
          {
            title: "Install packages with `python -m pip`",
            tag: "PATTERN",
            explanation: ["Prefixing `python -m` guarantees packages go into the active interpreter rather than a global one."],
            code: [
              "# python -m pip install pytest ruff",
            ],
            activeLines: [1],
            state: [
              { name: "install target", value: ".venv/site-packages", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "Running python -m pip installs packages inside the exact active environment.",
              nodes: [
                { id: "p1", label: "Active Python", sublabel: ".venv interpreter", active: true, tone: "accent" },
                { id: "p2", label: "-m pip install", sublabel: "fetches wheels", tone: "muted" },
                { id: "p3", label: ".venv/site-packages", sublabel: "ready to import", tone: "ok" },
              ],
              links: [
                { from: "p1", to: "p2", active: true },
                { from: "p2", to: "p3", label: "writes", active: true },
              ],
            },
          },
          {
            title: "Parse `pyproject.toml` via stdlib `tomllib`",
            tag: "TRACE",
            explanation: ["Python 3.11+ includes `tomllib` so tools can read project name and dependencies directly from `pyproject.toml`."],
            code: [
              "import tomllib",
              "data = tomllib.loads('[project]\\nname = \"app\"\\nversion = \"1.0\"')",
              "print(data['project']['name'])",
            ],
            activeLines: [2, 3],
            state: [
              { name: "data['project']['name']", value: "'app'", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "tomllib parses pyproject.toml sections directly into nested Python dicts.",
              nodes: [
                { id: "t1", label: "pyproject.toml", sublabel: "[project] metadata", tone: "muted" },
                { id: "t2", label: "tomllib.loads(...)", sublabel: "stdlib TOML parser", active: true, tone: "accent" },
                { id: "t3", label: "data['project']", sublabel: "{'name': 'app'}", tone: "ok" },
              ],
              links: [
                { from: "t1", to: "t2", active: true },
                { from: "t2", to: "t3", label: "dict", active: true },
              ],
            },
          },
          {
            title: "Never commit `.venv/` to version control",
            tag: "PITFALL",
            explanation: ["Commit `pyproject.toml` and lockfiles; list `.venv/` inside `.gitignore` because environments contain OS-specific binaries."],
            code: [
              "# .gitignore:",
              ".venv/",
            ],
            activeLines: [2],
            state: [
              { name: "git tracked", value: "pyproject.toml (not .venv/)", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "Keep pyproject.toml tracked in Git while ignoring OS-specific .venv binaries.",
              nodes: [
                { id: "g1", label: "pyproject.toml", sublabel: "track in git", tone: "ok", active: true },
                { id: "g2", label: ".gitignore", sublabel: "blocks .venv/", tone: "accent", active: true },
                { id: "g3", label: ".venv/", sublabel: "local rebuild only", tone: "warm" },
              ],
              links: [
                { from: "g1", to: "g2", label: "shared manifest" },
                { from: "g2", to: "g3", label: "excludes", active: true },
              ],
            },
          },
        ],
    },
    trickyPoints: [
      {
        title: "Bare `pip install` installing into global Python while IDE runs `.venv`",
        detail: "Always invoke `python -m pip` (or explicit `.venv/bin/python -m pip`) so installs match your runtime interpreter.",
      },
      {
        title: "Committing `.venv/` to git",
        detail: "`.venv` contains thousands of machine-specific symlinks and compiled binaries; commit `pyproject.toml` instead.",
      },
    ],
    predictChecks: [
      {
        prompt: "Why run `python -m pip install requests` instead of `pip install requests`?",
        code: "python -m pip install requests",
        options: [
          { id: "a", label: "It guarantees the active `python` interpreter installs into its own environment" },
          { id: "b", label: "It skips dependency checks" },
          { id: "c", label: "It installs globally for all users" },
        ],
        correctId: "a",
        explanation: "`python -m pip` eliminates ambiguity when multiple Python versions exist on `PATH`.",
      },
      {
        prompt: "Should the `.venv/` folder be committed to git?",
        code: "# .gitignore\n.venv/",
        options: [
          { id: "a", label: "Yes, for speed" },
          { id: "b", label: "No, commit `pyproject.toml` / lockfiles and ignore `.venv/`" },
          { id: "c", label: "Only on Windows" },
        ],
        correctId: "b",
        explanation: "Virtual environments are machine- and OS-specific; regenerate them from `pyproject.toml`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Parse `pyproject.toml` dependencies with `tomllib`",
      tier: "Warmup",
      goal: "Write `read_deps(toml_text)` parsing `[project].dependencies` with `tomllib.loads(...)` and returning the list (default `[]`).",
      constraints: ["Use stdlib `tomllib.loads`"],
      examples: [
        { input: "[project]\\nname='x'\\ndependencies=['httpx']", output: "['httpx']" },
        { input: "[project]\\nname='y'", output: "[]" },
      ],
      tasks: [
        "Read `data.get('project', {}).get('dependencies', [])` with empty fallbacks.",
      ],
      starterCode: "# Exercise M09.10 Warmup: parse pyproject.toml dependencies\nimport tomllib\n\ndef read_deps(toml_text: str) -> list[str]:\n    return []\n",
      expectedOutput: "['httpx']\n[]",
      hint: "Call `tomllib.loads(toml_text)` and chain `.get(...)`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "import tomllib\n\ndef read_deps(toml_text: str) -> list[str]:\n    data = tomllib.loads(toml_text)\n    return list(data.get('project', {}).get('dependencies', []))\n\nprint(read_deps(\"[project]\\nname = 'x'\\ndependencies = ['httpx']\"))\nprint(read_deps(\"[project]\\nname = 'y'\"))",
    },
    practiceChallenges: [
      {
        title: "Core: Normalize dependency package names",
        tier: "Core",
        goal: "Write `pkg_names(specs)` extracting lowercase package names before `>=`, `==`, `<`, or `[` (`'Flask[async]>=3.0'` -> `'flask'`).",
        constraints: ["Split or strip version operators"],
        examples: [
          { input: "['Requests>=2.31', 'Flask[async]==3.0']", output: "['requests', 'flask']" },
          { input: "['pytest']", output: "['pytest']" },
        ],
        tasks: [
          "Match leading `[A-Za-z0-9._-]+` and lowercase it.",
        ],
        starterCode: "# Exercise M09.10 Core: extract normalized package names\nimport re\n\ndef pkg_names(specs: list[str]) -> list[str]:\n    return []\n",
        expectedOutput: "['requests', 'flask']\n['pytest']",
        hint: "Use `re.match(r'^([A-Za-z0-9._-]+)', s.strip())` and lowercase group 1.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "import re\n\ndef pkg_names(specs: list[str]) -> list[str]:\n    out = []\n    for s in specs:\n        m = re.match(r'^([A-Za-z0-9._-]+)', s.strip())\n        if m:\n            out.append(m.group(1).lower())\n    return out\n\nprint(pkg_names(['Requests>=2.31', 'Flask[async]==3.0']))\nprint(pkg_names(['pytest']))",
      },
      {
        title: "Stretch: Build `.venv` command line",
        tier: "Stretch",
        goal: "Write `pip_cmd(is_windows, pkgs)` returning `['.venv\\\\Scripts\\\\python.exe', '-m', 'pip', 'install', *pkgs]` on Windows else `['.venv/bin/python', '-m', 'pip', 'install', *pkgs]`.",
        constraints: ["Always use `-m pip` rather than bare `pip`"],
        examples: [
          { input: "False, ['ruff', 'pytest']", output: "['.venv/bin/python', '-m', 'pip', 'install', 'ruff', 'pytest']" },
          { input: "True, ['httpx']", output: "['.venv\\\\Scripts\\\\python.exe', '-m', 'pip', 'install', 'httpx']" },
        ],
        tasks: [
          "Pick executable path by `is_windows`, then return command argument list.",
        ],
        starterCode: "# Exercise M09.10 Stretch: portable venv python -m pip command\ndef pip_cmd(is_windows: bool, pkgs: list[str]) -> list[str]:\n    return []\n",
        expectedOutput: "['.venv/bin/python', '-m', 'pip', 'install', 'ruff', 'pytest']\n['.venv\\\\Scripts\\\\python.exe', '-m', 'pip', 'install', 'httpx']",
        hint: "Choose `exe = '.venv\\\\Scripts\\\\python.exe' if is_windows else '.venv/bin/python'`.",
        complexity: { time: "O(k)", space: "O(k)" },
        solutionCode:
          "def pip_cmd(is_windows: bool, pkgs: list[str]) -> list[str]:\n    exe = '.venv\\\\Scripts\\\\python.exe' if is_windows else '.venv/bin/python'\n    return [exe, '-m', 'pip', 'install', *pkgs]\n\nprint(pip_cmd(False, ['ruff', 'pytest']))\nprint(pip_cmd(True, ['httpx']))",
      },
    ],
  },

  "py-pytest-testing": {
    lessonId: "py-pytest-testing",
    subtitle: "Write readable automated checks with plain `assert`, `pytest.raises`, `@pytest.mark.parametrize`, and `tmp_path`.",
    intro: {
      heading: "Verify behavior automatically on every edit",
      explanation: [
        "Manual terminal `print` checks test code only once, and stuffing ten inputs into a `for` loop stops at the first `AssertionError` so the remaining nine cases never run. Even worse, writing `assert (x > 0, 'bad')` with parentheses creates a non-empty tuple that evaluates to `True` and silently passes on broken values.",
        "`pytest` runs `test_*` functions with plain `assert` statements, reports every `@pytest.mark.parametrize` row independently, checks exact exception messages with `pytest.raises(..., match=...)`, and isolates file tests inside `tmp_path`.",
      ],
      analogy: "An automated pre-flight checklist: each parametrized row gets its own status indicator, `pytest.raises(..., match=...)` verifies the exact fault message, and `tmp_path` gives every test a clean disposable runway.",
      realWorldUses: [
        "Verifying edge cases across inputs with `@pytest.mark.parametrize`",
        "Testing file code against disposable folders via `tmp_path` without touching real user files",
      ],
    },
    sections: [
      {
        heading: "Core `pytest` features",
        paragraphs: [
          "Install `pytest`, place tests in `tests/test_*.py`, and assert directly (`assert total == 42`). On failure, pytest prints the exact left and right expressions.",
          "Use `with pytest.raises(ValueError, match='...')` for expected error paths and `tmp_path` (a `pathlib.Path` temp folder cleaned up automatically) when testing file I/O.",
        ],
        code: [
          "# tests/test_calc.py",
          "# import pytest",
          "",
          "def parse_port(raw: str) -> int:",
          "    port = int(raw)",
          "    if not 1 <= port <= 65535:",
          "        raise ValueError(\"port out of range\")",
          "    return port",
          "",
          "def test_parse_port_valid():",
          "    assert parse_port(\"8080\") == 8080",
          "    # with pytest.raises(ValueError, match='range'): parse_port('0')",
          "",
          "test_parse_port_valid()",
          "print(\"all checks ok\")",
        ],
        output: "all checks ok",
        table: {
          caption: "Essential pytest tools",
          headers: ["Tool", "Purpose", "Replaces"],
          rows: [
            ["`assert a == b`", "Asserts expected value with rich diffs", "`unittest.assertEqual`"],
            ["`pytest.raises(Err, match=...)`", "Fails unless `Err` matching pattern is raised", "Manual `try/except` flags"],
            ["`@pytest.mark.parametrize`", "Runs one test across N input/output rows", "Loops hiding which row failed"],
            ["`tmp_path` fixture", "Fresh per-test `Path` temp directory", "Hardcoded file paths polluting repo"],
          ],
        },
      },
      {
        heading: "Tuple-parentheses `assert` trap and un-matched `raises`",
        paragraphs: [
          "Wrapping the condition and message in parentheses (`assert (1 == 2, 'wrong')`) turns the expression into a 2-tuple, which is always truthy in Python so the test never fails.",
          "When checking error paths, always pass `match='...'` to `pytest.raises` so an unrelated `ValueError` does not fool the test into passing.",
        ],
        code: [
          "# BUG: non-empty tuple is always True -> never raises AssertionError!",
          "assert (1 == 2, \"wrong\")",
          "",
          "# FIX: omit outer parentheses so 1 == 2 is checked",
          "try:",
          "    assert 1 == 2, \"wrong\"",
          "except AssertionError as err:",
          "    print(\"caught:\", err)",
        ],
        output: "caught: wrong",
      },
    ],
    guidedBuildUp: {
      title: "Build Reliable Automated Tests Step by Step",
      steps: [
        {
          label: "Step 1: Assert expected return values directly",
          explanation: "Write a direct `assert expr == expected, 'message'` with no outer tuple parentheses.",
          code: [
            "def clamp(x: int, lo: int, hi: int) -> int:",
            "    return max(lo, min(hi, x))",
            "",
            "assert clamp(15, 0, 10) == 10, \"should cap at hi\"",
            "print(\"step 1 ok\")",
          ],
          activeLines: [4],
          output: "step 1 ok",
        },
        {
          label: "Step 2: Assert exception type and message with `match=`",
          explanation: "Verify that invalid inputs raise `ValueError` with the expected diagnostic text.",
          code: [
            "def parse_port(raw: str) -> int:",
            "    port = int(raw)",
            "    if not 1 <= port <= 65535:",
            "        raise ValueError(\"port out of range\")",
            "    return port",
            "# with pytest.raises(ValueError, match=\"range\"): parse_port(\"0\")",
          ],
          activeLines: [3, 4, 6],
        },
        {
          label: "Step 3: Parameterize input/output tables",
          explanation: "Keep test cases in `(input, expected)` pairs so `@pytest.mark.parametrize` runs and reports each row independently.",
          code: [
            "cases = [(\"80\", 80), (\"443\", 443)]",
            "for raw, want in cases:",
            "    assert int(raw) == want, f\"bad {raw}\"",
            "# In pytest: @pytest.mark.parametrize(\"raw,want\", cases)",
            "print(f\"verified {len(cases)} cases\")",
          ],
          activeLines: [1, 3, 4],
          output: "verified 2 cases",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Walk through test discovery and isolation",
        steps: [
          {
            title: "Discovery finds `test_*.py` and `test_*` functions",
            tag: "CONCEPT",
            explanation: ["Running `pytest` scans files named `test_*.py` and collects functions starting with `test_`."],
            code: [
              "def test_sum_empty():",
              "    assert sum([]) == 0",
            ],
            activeLines: [1, 2],
            state: [
              { name: "collected", value: "1 test item", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "pytest discovers test_*.py files and runs every test_* function.",
              nodes: [
                { id: "d1", label: "test_*.py", sublabel: "filename pattern", tone: "muted" },
                { id: "d2", label: "def test_*()", sublabel: "collected case", active: true, tone: "accent" },
                { id: "d3", label: "assert check", sublabel: "pass or rich diff", tone: "ok" },
              ],
              links: [
                { from: "d1", to: "d2", active: true },
                { from: "d2", to: "d3", active: true },
              ],
            },
          },
          {
            title: "`pytest.raises` asserts error type and message",
            tag: "CHECK",
            explanation: ["Passing `match=` verifies the right exception fired for the exact right reason rather than an accidental error."],
            code: [
              "# with pytest.raises(ValueError, match='negative'):",
              "# withdraw(-10)",
            ],
            activeLines: [1, 2],
            state: [
              { name: "caught", value: "ValueError matching 'negative'", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "pytest.raises checks both the exception class and the regex match pattern.",
              nodes: [
                { id: "r1", label: "withdraw(-10)", sublabel: "raises ValueError", tone: "warm", active: true },
                { id: "r2", label: "Class == ValueError", sublabel: "type matches", tone: "accent" },
                { id: "r3", label: "match='negative'", sublabel: "test passes", tone: "ok" },
              ],
              links: [
                { from: "r1", to: "r2", active: true },
                { from: "r2", to: "r3", active: true },
              ],
            },
          },
          {
            title: "Parametrize reports each row independently",
            tag: "PATTERN",
            explanation: ["Instead of stopping a `for` loop on the first failure, `@pytest.mark.parametrize` runs every row as its own test case."],
            code: [
              "# @pytest.mark.parametrize('raw,want', [('10', 10), ('0', 0)])",
              "# def test_parse(raw, want): assert int(raw) == want",
            ],
            activeLines: [1, 2],
            state: [
              { name: "test cases", value: "2 independent items", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "parametrize generates a separate pass/fail report line for each input row.",
              nodes: [
                { id: "pm1", label: "[('10',10), ('0',0)]", sublabel: "input table", tone: "muted" },
                { id: "pm2", label: "Row 0: '10' == 10", sublabel: "independent run", tone: "ok", active: true },
                { id: "pm3", label: "Row 1: '0' == 0", sublabel: "independent run", tone: "ok", active: true },
              ],
              links: [
                { from: "pm1", to: "pm2", active: true },
                { from: "pm1", to: "pm3", active: true },
              ],
            },
          },
          {
            title: "Never share mutable fixtures across tests",
            tag: "PITFALL",
            explanation: ["Each test gets a fresh `tmp_path` and default function-scoped fixtures so test order never alters outcomes."],
            code: [
              "def test_write(tmp_path):",
              "    p = tmp_path / 'out.txt'",
              "    p.write_text('ok', encoding='utf-8')",
            ],
            activeLines: [1, 2, 3],
            state: [
              { name: "isolation", value: "fresh tmp_path per test", changed: true },
            ],
            visual: {
              kind: "pipeline",
              caption: "Function-scoped tmp_path guarantees every test receives a fresh directory.",
              nodes: [
                { id: "f1", label: "test_a(tmp_path)", sublabel: "/tmp/test_a_0", tone: "ok", active: true },
                { id: "f2", label: "isolated teardown", sublabel: "no shared files", tone: "muted" },
                { id: "f3", label: "test_b(tmp_path)", sublabel: "/tmp/test_b_0", tone: "ok", active: true },
              ],
              links: [
                { from: "f1", to: "f2" },
                { from: "f2", to: "f3", label: "fresh dir" },
              ],
            },
          },
        ],
    },
    trickyPoints: [
      {
        title: "Writing `assert (a == b, 'msg')` with parentheses",
        detail: "A non-empty tuple is always truthy in Python, so `assert (False, 'bad')` silently passes! Never wrap `assert` condition + message in parentheses.",
      },
      {
        title: "Omitting `match=` in `pytest.raises(ValueError)`",
        detail: "Without `match=`, an unrelated `ValueError` inside helper parsing can fool your error test into passing.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `assert (1 == 2, 'wrong')` do in Python?",
        code: "assert (1 == 2, 'wrong')",
        options: [
          { id: "a", label: "Raises `AssertionError: wrong`" },
          { id: "b", label: "Silently passes because the tuple is non-empty and truthy" },
          { id: "c", label: "Raises `SyntaxError`" },
        ],
        correctId: "b",
        explanation: "Parentheses make `(1 == 2, 'wrong')` a 2-element tuple, which is always `True`!",
      },
      {
        prompt: "Why use `tmp_path` instead of `'test.txt'` when testing file code?",
        code: "def test_save(tmp_path):\n    save(tmp_path / 'a.json')",
        options: [
          { id: "a", label: "Each test receives an isolated temp folder so runs never collide or pollute the repo" },
          { id: "b", label: "`tmp_path` encrypts test files" },
          { id: "c", label: "`Path` does not work without `tmp_path`" },
        ],
        correctId: "a",
        explanation: "`tmp_path` gives every test a fresh temporary directory.",
      },
    ],
    practiceTask: {
      title: "Warmup: Table-driven test runner for `parse_port`",
      tier: "Warmup",
      goal: "Write `run_cases(fn, cases)` running `(arg, expected)` tuples, raising `AssertionError` on mismatch and returning `len(cases)` on success.",
      constraints: ["Do not use tuple parentheses around `assert`"],
      examples: [
        { input: "[( '80', 80 ), ( '443', 443 )]", output: "2" },
        { input: "mismatch case", output: "failed" },
      ],
      tasks: [
        "Loop over `arg, want` and check `got == want`.",
      ],
      starterCode: "# Exercise M09.11 Warmup: parametrize-style test helper\ndef run_cases(fn, cases):\n    return 0\n",
      expectedOutput: "2\nfailed",
      hint: "Assert `fn(arg) == want` for every pair, then return `len(cases)`.",
      complexity: { time: "O(k)", space: "O(1)" },
      solutionCode:
        "def run_cases(fn, cases):\n    for arg, want in cases:\n        got = fn(arg)\n        assert got == want, f'{arg}: got {got}, want {want}'\n    return len(cases)\n\nprint(run_cases(int, [('80', 80), ('443', 443)]))\ntry:\n    run_cases(int, [('80', 90)])\nexcept AssertionError:\n    print('failed')",
    },
    practiceChallenges: [
      {
        title: "Core: Mini `assert_raises` helper with `match`",
        tier: "Core",
        goal: "Write `assert_raises(exc_type, match, fn)` returning `True` if `fn()` raises `exc_type` whose message contains `match`, else raising `AssertionError`.",
        constraints: ["Fail whether no exception or wrong type/message occurred"],
        examples: [
          { input: "ValueError, 'bad', raises ValueError('bad input')", output: "True" },
          { input: "ValueError, 'missing', returns normally", output: "failed" },
        ],
        tasks: [
          "Try `fn()`; catch `exc_type as e` checking `match in str(e)`.",
          "Raise `AssertionError` if `fn()` finishes without raising.",
        ],
        starterCode: "# Exercise M09.11 Core: assert_raises helper with match\ndef assert_raises(exc_type, match: str, fn) -> bool:\n    return False\n",
        expectedOutput: "True\nfailed",
        hint: "Use `try: fn()` then `except exc_type as err:` checking `if match not in str(err): raise AssertionError(...)`, plus `raise AssertionError('did not raise')` after `fn()`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def assert_raises(exc_type, match: str, fn) -> bool:\n    try:\n        fn()\n    except exc_type as err:\n        if match not in str(err):\n            raise AssertionError(f'{match!r} not in {err!r}')\n        return True\n    raise AssertionError(f'{exc_type.__name__} not raised')\n\ndef boom():\n    raise ValueError('bad input')\n\ndef ok():\n    return 1\n\nprint(assert_raises(ValueError, 'bad', boom))\ntry:\n    assert_raises(ValueError, 'missing', ok)\nexcept AssertionError:\n    print('failed')",
      },
      {
        title: "Stretch: Test file save/load in `TemporaryDirectory`",
        tier: "Stretch",
        goal: "Write `verify_roundtrip(text)` creating a temp folder via `tempfile.TemporaryDirectory`, writing `note.txt`, reading it back, and asserting equality.",
        constraints: ["Clean up folder automatically via `with TemporaryDirectory() as tmp:`"],
        examples: [
          { input: "'hello\\nworld'", output: "True" },
          { input: "'utf8-ok'", output: "True" },
        ],
        tasks: [
          "Write and read `Path(tmp) / 'note.txt'` with `encoding='utf-8'`.",
        ],
        starterCode: "# Exercise M09.11 Stretch: isolated temp dir file test\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\n\ndef verify_roundtrip(text: str) -> bool:\n    return False\n",
        expectedOutput: "True\nTrue",
        hint: "Inside `with TemporaryDirectory() as d:`, write with `.write_text` and assert `.read_text() == text`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\ndef verify_roundtrip(text: str) -> bool:\n    with TemporaryDirectory() as d:\n        p = Path(d) / 'note.txt'\n        p.write_text(text, encoding='utf-8')\n        got = p.read_text(encoding='utf-8')\n        assert got == text\n        return True\n\nprint(verify_roundtrip('hello\\nworld'))\nprint(verify_roundtrip('utf8-ok'))",
      },
    ],
  },
};

export const m09Quiz: ModuleQuiz = {
  moduleId: "py-m9",
  title: "Module 09 Quiz: Deeper Python & Engineering",
  description: "Verify comprehensions, enumerate/zip, *args/**kwargs, closures, decorators, iterators, generators, type hints, modules, .venv, and pytest.",
  questions: [
    {
      id: "m9-q1",
      prompt: "Where does `a if cond else b` go in a list comprehension that transforms every element?",
      options: [
        { id: "a", label: "Before `for`: `[a if cond else b for x in xs]`" },
        { id: "b", label: "At the end after `for`" },
        { id: "c", label: "Outside the brackets" },
        { id: "d", label: "Inside `range()`" },
      ],
      correctId: "a",
      explanation: "Transforming ternaries go before `for`; trailing `if` filters elements out.",
      lessonRefId: "py-comprehensions",
    },
    {
      id: "m9-q2",
      prompt: "What happens when `zip([1, 2, 3], ['a'], strict=True)` iterates past `'a'`?",
      options: [
        { id: "a", label: "Pads with `None`" },
        { id: "b", label: "Stops without raising an error" },
        { id: "c", label: "Raises `ValueError`" },
        { id: "d", label: "Repeats `'a'`" },
      ],
      correctId: "c",
      explanation: "`strict=True` raises `ValueError` whenever input iterables have different lengths.",
      lessonRefId: "py-enumerate-zip",
    },
    {
      id: "m9-q3",
      prompt: "Inside `def f(x, *args, **kwargs):`, what types do `args` and `kwargs` hold?",
      options: [
        { id: "a", label: "`list` and `set`" },
        { id: "b", label: "`tuple` and `dict`" },
        { id: "c", label: "`dict` and `tuple`" },
        { id: "d", label: "`set` and `list`" },
      ],
      correctId: "b",
      explanation: "`*args` packs positional arguments into a `tuple`, and `**kwargs` packs keyword arguments into a `dict`.",
      lessonRefId: "py-args-kwargs",
    },
    {
      id: "m9-q4",
      prompt: "How do you avoid late-binding bugs in `[lambda: i for i in range(3)]`?",
      options: [
        { id: "a", label: "Add `global i`" },
        { id: "b", label: "Use `set()`" },
        { id: "c", label: "Wrap in `enumerate()`" },
        { id: "d", label: "Freeze each step with a default parameter `lambda i=i: i`" },
      ],
      correctId: "d",
      explanation: "Default arguments evaluate when the function object is constructed, binding each `i` eagerly.",
      lessonRefId: "py-closures",
    },
    {
      id: "m9-q5",
      prompt: "What problem does `@functools.wraps(fn)` solve on a decorator's `wrapper` function?",
      options: [
        { id: "a", label: "Preserves `fn.__name__`, `__doc__`, and signature metadata" },
        { id: "b", label: "Caches return values automatically" },
        { id: "c", label: "Prevents `TypeError` on missing arguments" },
        { id: "d", label: "Allows async execution" },
      ],
      correctId: "a",
      explanation: "`@wraps(fn)` copies identity attributes from `fn` onto `wrapper`.",
      lessonRefId: "py-decorators",
    },
    {
      id: "m9-q6",
      prompt: "What prints from `it = iter([1, 2]); print(sum(it), sum(it))`?",
      options: [
        { id: "a", label: "`3 3`" },
        { id: "b", label: "`3 0`" },
        { id: "c", label: "`0 0`" },
        { id: "d", label: "Raises `StopIteration`" },
      ],
      correctId: "b",
      explanation: "Iterators are single-pass cursors; the second `sum(it)` reads zero items.",
      lessonRefId: "py-iterators",
    },
    {
      id: "m9-q7",
      prompt: "When does a generator function containing `yield` start executing its body?",
      options: [
        { id: "a", label: "At `import` time" },
        { id: "b", label: "When called as `g = gen()`" },
        { id: "c", label: "Only when the first `next(g)` (or loop iteration) runs" },
        { id: "d", label: "When `len(g)` is called" },
      ],
      correctId: "c",
      explanation: "Calling a generator function immediately returns a suspended generator object.",
      lessonRefId: "py-generators",
    },
    {
      id: "m9-q8",
      prompt: "Which statement is true about `def add(a: int, b: int) -> int:` in standard CPython?",
      options: [
        { id: "a", label: "Annotations help static tools (`mypy`), not runtime coercion or rejection" },
        { id: "b", label: "CPython converts string arguments to `int` automatically" },
        { id: "c", label: "CPython raises `TypeError` if `'x'` is passed" },
        { id: "d", label: "Annotations remove `__init__` checks" },
      ],
      correctId: "a",
      explanation: "Type hints do not change runtime argument validation unless checked explicitly.",
      lessonRefId: "py-type-hints",
    },
    {
      id: "m9-q9",
      prompt: "What happens if your script directory contains `json.py` and `main.py` runs `import json`?",
      options: [
        { id: "a", label: "Python always loads stdlib `json` first" },
        { id: "b", label: "Python merges both files" },
        { id: "c", label: "Raises `SyntaxError`" },
        { id: "d", label: "Python loads local `json.py`, shadowing the standard library" },
      ],
      correctId: "d",
      explanation: "Python searches the script directory (`sys.path[0]`) before standard library folders.",
      lessonRefId: "py-modules-packages",
    },
    {
      id: "m9-q10",
      prompt: "Why place CLI startup code inside `if __name__ == '__main__':`?",
      options: [
        { id: "a", label: "It compiles code to bytecode" },
        { id: "b", label: "Tests and other modules can import functions without executing script I/O" },
        { id: "c", label: "It turns scripts into packages automatically" },
        { id: "d", label: "It activates `.venv`" },
      ],
      correctId: "b",
      explanation: "`__name__` equals `'__main__'` only when that file is executed directly.",
      lessonRefId: "py-modules-packages",
    },
    {
      id: "m9-q11",
      prompt: "Why prefer `python -m pip install pkg` over bare `pip install pkg`?",
      options: [
        { id: "a", label: "It skips TLS checks" },
        { id: "b", label: "It commits `.venv` to git" },
        { id: "c", label: "It guarantees installing into the exact `python` environment you invoked" },
        { id: "d", label: "It updates `pyproject.toml` automatically" },
      ],
      correctId: "c",
      explanation: "`python -m pip` avoids global/venv `PATH` mismatches.",
      lessonRefId: "py-venv-packaging",
    },
    {
      id: "m9-q12",
      prompt: "Why does `assert (x > 0, 'must be positive')` contain a bug?",
      options: [
        { id: "a", label: "A non-empty tuple is always truthy, so the assertion never fails" },
        { id: "b", label: "`pytest` ignores assertions with strings" },
        { id: "c", label: "Tuples raise `TypeError` inside `assert`" },
        { id: "d", label: "Comma must be semicolon" },
      ],
      correctId: "a",
      explanation: "Omit outer parentheses: write `assert x > 0, 'must be positive'`.",
      lessonRefId: "py-pytest-testing",
    },
  ],
};

export const m09PracticeSet: ModulePracticeSet = {
  moduleId: "py-m9",
  title: "Module 9 Mixed Engineering Practice",
  description: "Combine comprehensions, strict pairing, decorators, generators, and test/config tooling across four problems.",
  problems: [
    {
      id: "m9-p1",
      title: "Aligned score summary with `zip(..., strict=True)`",
      tier: "Warmup",
      patternHint: "Pair keys and scores strictly, then build a comprehension dict.",
      lessonRefId: "py-enumerate-zip",
      goal: "Write `grade_map(names, scores)` returning `{name: score for name, score in zip(names, scores, strict=True) if score >= 50}`.",
      constraints: ["Raise `ValueError` on length mismatch via `strict=True`"],
      examples: [
        { input: "['Ada', 'Bob'], [90, 40]", output: "{'Ada': 90}" },
        { input: "['Ada'], [90, 40]", output: "mismatch" },
      ],
      tasks: [
        "Use a dict comprehension with `zip(..., strict=True)` and `if score >= 50`.",
      ],
      starterCode: "# Practice M09.1: strict zip dict comprehension\ndef grade_map(names: list[str], scores: list[int]) -> dict[str, int]:\n    return {}\n",
      expectedOutput: "{'Ada': 90}\nmismatch",
      hint: "Return `{n: s for n, s in zip(names, scores, strict=True) if s >= 50}`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "def grade_map(names: list[str], scores: list[int]) -> dict[str, int]:\n    return {n: s for n, s in zip(names, scores, strict=True) if s >= 50}\n\nprint(grade_map(['Ada', 'Bob'], [90, 40]))\ntry:\n    grade_map(['Ada'], [90, 40])\nexcept ValueError:\n    print('mismatch')",
    },
    {
      id: "m9-p2",
      title: "Lazy line chunker generator",
      tier: "Core",
      patternHint: "Yield fixed-size slices without building nested copies when unneeded.",
      lessonRefId: "py-generators",
      goal: "Write generator `chunks(items, size)` yielding slices of length `size` (last slice may be shorter), raising `ValueError` if `size <= 0`.",
      constraints: ["Validate `size <= 0` immediately on call or iteration"],
      examples: [
        { input: "[1, 2, 3, 4, 5], 2", output: "[[1, 2], [3, 4], [5]]" },
        { input: "[], 3", output: "[]" },
      ],
      tasks: [
        "Guard `if size <= 0: raise ValueError(...)`.",
        "Yield `items[i:i + size]` for `i in range(0, len(items), size)`.",
      ],
      starterCode: "# Practice M09.2: lazy slice chunk generator\ndef chunks(items: list[int], size: int):\n    yield from ()\n",
      expectedOutput: "[[1, 2], [3, 4], [5]]\n[]",
      hint: "Step `range(0, len(items), size)` and `yield items[i:i + size]`.",
      complexity: { time: "O(n)", space: "O(size)" },
      solutionCode:
        "def chunks(items: list[int], size: int):\n    if size <= 0:\n        raise ValueError('size must be positive')\n    for i in range(0, len(items), size):\n        yield items[i:i + size]\n\nprint(list(chunks([1, 2, 3, 4, 5], 2)))\nprint(list(chunks([], 3)))",
    },
    {
      id: "m9-p3",
      title: "Caching decorator with `@wraps`",
      tier: "Core",
      patternHint: "Store computed results by positional `args` inside a closure dict.",
      lessonRefId: "py-decorators",
      goal: "Write `@memoize` caching results in a dict keyed by `args` (assume hashable positional args), keeping `__name__` via `@wraps`.",
      constraints: ["Do not re-run `fn` on repeat calls with same `args`"],
      examples: [
        { input: "call work(4) twice", output: "16 1" },
        { input: "work.__name__", output: "work" },
      ],
      tasks: [
        "Maintain `cache = {}` in `memoize`.",
        "Return cached value if `args in cache`, else compute, store, and return.",
      ],
      starterCode: "# Practice M09.3: simple @memoize decorator\nfrom functools import wraps\n\ndef memoize(fn):\n    return fn\n",
      expectedOutput: "16 1\nwork",
      hint: "Key `cache` by `args` tuple inside `wrapper(*args)`.",
      complexity: { time: "O(1) hit", space: "O(u)" },
      solutionCode:
        "from functools import wraps\n\ndef memoize(fn):\n    cache = {}\n    @wraps(fn)\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = fn(*args)\n        return cache[args]\n    return wrapper\n\ncalls = 0\n@memoize\ndef work(x: int) -> int:\n    global calls\n    calls += 1\n    return x * x\n\nwork(4)\nprint(work(4), calls)\nprint(work.__name__)",
    },
    {
      id: "m9-p4",
      title: "Parse `pyproject.toml` console scripts",
      tier: "Stretch",
      patternHint: "Combine `tomllib`, `TypedDict`-style lookup, and sorted entry points.",
      lessonRefId: "py-venv-packaging",
      goal: "Write `read_scripts(toml_text)` returning sorted `(cmd, target)` tuples from `[project.scripts]` (empty list if missing).",
      constraints: ["Use `tomllib.loads`"],
      examples: [
        { input: "[project.scripts] log='app.cli:main', fmt='app.fmt:run'", output: "[('fmt', 'app.fmt:run'), ('log', 'app.cli:main')]" },
        { input: "[project] name='plain'", output: "[]" },
      ],
      tasks: [
        "Navigate `data.get('project', {}).get('scripts', {})`.",
        "Return `sorted(scripts.items())`.",
      ],
      starterCode: "# Practice M09.4: extract sorted [project.scripts]\nimport tomllib\n\ndef read_scripts(toml_text: str) -> list[tuple[str, str]]:\n    return []\n",
      expectedOutput: "[('fmt', 'app.fmt:run'), ('log', 'app.cli:main')]\n[]",
      hint: "Use `tomllib.loads(toml_text)` and chain `.get('project', {}).get('scripts', {})`.",
      complexity: { time: "O(k log k)", space: "O(k)" },
      solutionCode:
        "import tomllib\n\ndef read_scripts(toml_text: str) -> list[tuple[str, str]]:\n    data = tomllib.loads(toml_text)\n    scripts = data.get('project', {}).get('scripts', {})\n    return sorted(scripts.items())\n\nprint(read_scripts(\"[project.scripts]\\nlog = 'app.cli:main'\\nfmt = 'app.fmt:run'\"))\nprint(read_scripts(\"[project]\\nname = 'plain'\"))",
    },
  ],
};
