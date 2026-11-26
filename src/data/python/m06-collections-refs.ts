import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m06Lessons: Record<string, LessonContent> = {
  "py-tuples-unpacking": {
    lessonId: "py-tuples-unpacking",
    subtitle: "Pack fixed records into immutable `tuple`s, swap variables without temporaries, and unpack with `*rest`.",
    intro: {
      heading: "Fixed Records and Unpacking With Tuples",
      explanation: [
        "Unpacking a tuple like `name, score = row` crashes with `ValueError: too many values to unpack` the moment a row has an extra field (`(\"Noor\", 88, 91)`), and writing `(42)` without a comma silently gives you a plain `int` instead of a 1-item tuple. Storing fixed data such as `(lat, lng)` coordinates in a `list` also leaves it exposed to stray `.append()` calls.",
        "Tuples lock slot count and slot assignments after creation, build from commas (`pt = 10, 25`), swap two variables in one line (`x, y = y, x`), and let a single `*rest` target collect extra items into a list so variable-length records unpack without errors.",
      ],
      analogy:
        "A tuple acts like a sealed boarding pass with fixed Seat and Gate slots: you cannot add or swap slots on the card, though if one slot holds a reference to a mutable list, that inner list can still change.",
      realWorldUses: [
        "Returning multiple values from a function (`return low, high`) and unpacking `(name, score)` rows in loops",
        "Storing fixed `(lat, lng)` coordinates or `(row, col)` grid keys that stay hashable inside dicts and sets",
      ],
    },
    sections: [
      {
        heading: "Broken vs Working: Comma Rules & Immutable Slots",
        paragraphs: [
          "The comma builds a tuple rather than the parentheses. `(42)` evaluates to the integer `42`, whereas `(42,)` constructs a 1-element tuple.",
          "Immutability locks which object sits in each slot: `t[0] = 9` raises `TypeError: 'tuple' object does not support item assignment`, though a mutable list placed inside a tuple (`box = ([1, 2], \"ok\")`) still allows `box[0].append(3)`.",
        ],
        code: [
          "point = 10, 25",
          "single = (42,)        # valid 1-tuple",
          "not_tuple = (42)      # plain int, not a tuple",
          "box = ([1, 2], \"ok\")",
          "# box[0] = []         # Error -> TypeError (slot is locked)",
          "box[0].append(3)      # valid: inner list mutates",
          "print(type(point), type(single), type(not_tuple), box)",
        ],
        output: "<class 'tuple'> <class 'tuple'> <class 'int'> ([1, 2, 3], 'ok')",
      },
      {
        heading: "Swapping & Starred Sequence Unpacking (`*rest`)",
        paragraphs: [
          "Unpacking assigns items left to right into separate names. Mismatched counts raise `ValueError` (`a, b = (1, 2, 3)` crashes), unless one target uses `*` (`head, *tail = nums`) to sweep leftover elements into a `list`.",
          "Swapping `x, y = y, x` evaluates `(y, x)` on the right first, then rebinds both names at once without a temporary variable.",
        ],
        visual: {
          kind: "memory-sim",
          caption: "Watch tuple swap (x, y = y, x) and starred unpacking (head, *tail) update frame bindings",
          scenarios: [
            {
              label: "Tuple Swap (x, y = y, x)",
              code: ["x, y = 10, 99", "x, y = y, x"],
              steps: [
                {
                  line: 1,
                  note: "Tuple unpacking binds `x` to `10` and `y` to `99`.",
                  frames: [
                    {
                      name: "Frame",
                      bindings: [
                        { label: "x", targetId: "v10", highlight: true },
                        { label: "y", targetId: "v99", highlight: true },
                      ],
                    },
                  ],
                  objects: [
                    { id: "v10", typeLabel: "int", value: "10" },
                    { id: "v99", typeLabel: "int", value: "99" },
                  ],
                },
                {
                  line: 2,
                  note: "Right side builds `(99, 10)` first, then swaps `x -> 99` and `y -> 10`.",
                  frames: [
                    {
                      name: "Frame",
                      bindings: [
                        { label: "x", targetId: "v99", highlight: true },
                        { label: "y", targetId: "v10", highlight: true },
                      ],
                    },
                  ],
                  objects: [
                    { id: "v10", typeLabel: "int", value: "10", highlight: true },
                    { id: "v99", typeLabel: "int", value: "99", highlight: true },
                  ],
                },
              ],
            },
            {
              label: "Starred Unpack (head, *tail)",
              code: ["nums = [10, 20, 30, 40]", "head, *tail = nums"],
              steps: [
                {
                  line: 1,
                  note: "`nums` points to the 4-item list `[10, 20, 30, 40]`.",
                  frames: [{ name: "Frame", bindings: [{ label: "nums", targetId: "src", highlight: true }] }],
                  objects: [
                    {
                      id: "src",
                      typeLabel: "list",
                      value: "[10, 20, 30, 40]",
                      mutable: true,
                      cells: [
                        { index: "0", value: "10" },
                        { index: "1", value: "20" },
                        { index: "2", value: "30" },
                        { index: "3", value: "40" },
                      ],
                    },
                  ],
                },
                {
                  line: 2,
                  note: "`head` gets `10` (`int`) and `*tail` collects `[20, 30, 40]` as a `list`.",
                  frames: [
                    {
                      name: "Frame",
                      bindings: [
                        { label: "nums", targetId: "src" },
                        { label: "head", targetId: "h10", highlight: true },
                        { label: "tail", targetId: "t_list", highlight: true },
                      ],
                    },
                  ],
                  objects: [
                    { id: "src", typeLabel: "list", value: "[10, 20, 30, 40]", mutable: true },
                    { id: "h10", typeLabel: "int", value: "10", highlight: true },
                    {
                      id: "t_list",
                      typeLabel: "list",
                      value: "[20, 30, 40]",
                      mutable: true,
                      highlight: true,
                      cells: [
                        { index: "0", value: "20" },
                        { index: "1", value: "30" },
                        { index: "2", value: "40" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        table: {
          caption: "Tuple & Unpacking Quick Reference",
          headers: ["Syntax", "Result", "Watch Out"],
          rows: [
            ["`pt = 10, 20`", "Immutable 2-tuple", "Cannot reassign `pt[0]` (`TypeError`)"],
            ["`one = (42,)`", "1-item tuple", "Missing comma makes `(42)` plain `int`"],
            ["`a, b = b, a`", "Swap without temp variable", "Mismatched length raises `ValueError`"],
            ["`first, *rest = seq`", "`rest` is a `list` of extras", "`rest` is always `list` (even `[]`)"],
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Variable-Length Record Unpacker Step by Step",
      subtitle: "Move from fixed 2-field unpacking to `*scores` capture with a 1-item guard.",
      steps: [
        {
          label: "Unpack fixed 2-field tuples",
          explanation: "Assign `(name, score)` directly into two names; adding a third item here would raise `ValueError`.",
          code: [
            "row = (\"Ada\", 92)",
            "name, score = row",
            "print(name, score)",
          ],
          activeLines: [1, 2, 3],
          output: "Ada 92",
        },
        {
          label: "Sweep variable-length scores with `*scores`",
          explanation: "Starred unpacking binds the first slot to `name` and gathers any number of trailing scores into a `list`.",
          code: [
            "row = (\"Noor\", 88, 92, 90)",
            "name, *scores = row",
            "print(name, scores, sum(scores) / len(scores))",
          ],
          activeLines: [2, 3],
          output: "Noor [88, 92, 90] 90.0",
        },
        {
          label: "Guard 1-item tuples like `('Kai',)` against empty `*scores`",
          explanation: "A 1-element tuple needs a trailing comma and sets `scores = []`, so check `if not scores` before dividing.",
          code: [
            "def format_avg(row):",
            "    name, *scores = row",
            "    if not scores:",
            "        return f\"{name}: no scores\"",
            "    return f\"{name}: {sum(scores) / len(scores):.1f}\"",
            "print(format_avg((\"Kai\",)))",
          ],
          activeLines: [2, 3, 4],
          output: "Kai: no scores",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Trailing Commas, Loop Unpacking, and `*rest` Capture",
      steps: [
        {
          title: "Distinguish `(\"py\")` (`str`) vs `(\"py\",)` (`tuple`)",
          tag: "CONCEPT",
          explanation: ["Without the comma, parentheses only group an expression instead of constructing a tuple."],
          code: ["a = (\"py\")", "b = (\"py\",)", "print(type(a), type(b))"],
          activeLines: [1, 2, 3],
          state: [
            { name: "type(a)", value: "<class 'str'>", changed: true },
            { name: "type(b)", value: "<class 'tuple'>", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "The trailing comma makes b a 1-item tuple, while a stays a plain str.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "a", targetId: "sa" },
                  { label: "b", targetId: "tb", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "sa", typeLabel: "str", value: "'py'" },
              { id: "tb", typeLabel: "tuple", value: "('py',)", highlight: true, cells: [{ index: "0", value: "'py'", active: true }] },
            ],
          },
        },
        {
          title: "Unpack `(name, score)` directly in a `for` header",
          tag: "PATTERN",
          explanation: ["Each 2-tuple unpacks per iteration without writing `pair[0]` and `pair[1]`."],
          code: ["for name, score in [(\"Ada\", 92), (\"Sam\", 74)]:","    print(name, score)"],
          activeLines: [1, 2],
          state: [
            { name: "name", value: "'Ada' -> 'Sam'", changed: true },
            { name: "score", value: "92 -> 74", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Each 2-tuple unpacks directly into name and score each loop iteration.",
            frames: [
              {
                name: "Loop Header",
                bindings: [
                  { label: "name", targetId: "u_n", highlight: true },
                  { label: "score", targetId: "u_s", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "u_tup", typeLabel: "tuple", value: "('Ada', 92)", cells: [{ index: "0", value: "'Ada'" }, { index: "1", value: "92" }] },
              { id: "u_n", typeLabel: "str", value: "'Ada' -> 'Sam'", highlight: true },
              { id: "u_s", typeLabel: "int", value: "92 -> 74", highlight: true },
            ],
          },
        },
        {
          title: "Sweep variable-length grades into `*grades` list",
          tag: "TRACE",
          explanation: ["Starred target `grades` gathers remaining elements into `[88, 91, 95]`, ready for `sum(grades)`."],
          code: ["row = (\"Noor\", 88, 91, 95)", "name, *grades = row"],
          activeLines: [1, 2],
          state: [
            { name: "name", value: "'Noor'", changed: true },
            { name: "grades", value: "[88, 91, 95]", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "name takes index 0 while *grades collects indices 1..3 as a new list.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "name", targetId: "r_n" },
                  { label: "grades", targetId: "r_g", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "r_n", typeLabel: "str", value: "'Noor'" },
              {
                id: "r_g",
                typeLabel: "list",
                value: "[88, 91, 95]",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "0", value: "88", active: true },
                  { index: "1", value: "91", active: true },
                  { index: "2", value: "95", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "Catch tuple slot mutation (`TypeError`) vs inner list mutation",
          tag: "PITFALL",
          explanation: ["Slot rebinding fails, yet a mutable list stored inside a tuple still responds to `.append()`."],
          code: ["box = ([1, 2], \"ok\")", "# box[0] = []  -> TypeError", "box[0].append(3)"],
          activeLines: [2, 3],
          state: [{ name: "box", value: "([1, 2, 3], 'ok')", changed: true }],
          visual: {
            kind: "memory",
            caption: "Tuple box keeps fixed slot references, yet inner list slot 0 mutates in place.",
            frames: [{ name: "Globals", bindings: [{ label: "box", targetId: "tup" }] }],
            objects: [
              { id: "tup", typeLabel: "tuple (fixed slots)", value: "slot 0 -> inner list", cells: [{ index: "0", value: "ref -> list" }, { index: "1", value: "'ok'" }] },
              { id: "inner", typeLabel: "list (mutable)", value: "[1, 2, 3]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }, { index: "2", value: "3", active: true }] },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Missing trailing comma in `(\"admin\")` creates a `str`, not a `tuple`",
        detail: "Write `(\"admin\",)` whenever constructing a single-item tuple.",
      },
      {
        title: "Length mismatch in unpacking (`ValueError`) & mutable nested items",
        detail: "`a, b = (1, 2, 3)` raises `ValueError` unless `*` sweeps leftovers, and nested lists inside tuples remain mutable.",
      },
    ],
    predictChecks: [
      {
        prompt: "What happens if `t = (1, 2, 3)` and `t[0] = 9` runs?",
        code: "t = (1, 2, 3)\nt[0] = 9",
        options: [
          { id: "a", label: "`TypeError`: tuples do not support item assignment" },
          { id: "b", label: "`t` becomes `(9, 2, 3)`" },
          { id: "c", label: "`t` converts to a list" },
        ],
        correctId: "a",
        explanation: "Tuples are immutable sequences.",
      },
      {
        prompt: "What types are `(\"py\")` vs `(\"py\",)`?",
        code: "print(type((\"py\")), type((\"py\",)))",
        options: [
          { id: "a", label: "`tuple` and `tuple`" },
          { id: "b", label: "`str` and `tuple`" },
          { id: "c", label: "`SyntaxError`" },
        ],
        correctId: "b",
        explanation: "The comma creates a 1-element tuple.",
      },
    ],
    practiceTask: {
      title: "Warmup: Unpack High-Scoring Record Tuples",
      tier: "Warmup",
      goal: "Unpack `(name, score)` tuples from `students` and return formatted strings `\"<name>: <score>\"` for students scoring `>= min_score`.",
      constraints: ["Use tuple unpacking in the for loop"],
      examples: [
        { input: "students = [(\"Ada\", 92), (\"Sam\", 74), (\"Kai\", 85)], min_score = 80", output: "['Ada: 92', 'Kai: 85']" },
        { input: "students = [], min_score = 80", output: "[]" },
      ],
      tasks: [
        "Loop `for name, score in students:`.",
        "Filter `score >= min_score` and append `f\"{name}: {score}\"`.",
      ],
      starterCode: "# Exercise M06.1 Warmup: tuple loop unpacking\ndef high_scorers(students, min_score=80):\n    # TODO: unpack (name, score) pairs >= min_score\n    return []\n",
      expectedOutput: "['Ada: 92', 'Kai: 85']\n[]",
      hint: "Unpack directly in the `for` header instead of indexing `row[0]`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "def high_scorers(students, min_score=80):\n    out = []\n    for name, score in students:\n        if score >= min_score:\n            out.append(f\"{name}: {score}\")\n    return out\n\nprint(high_scorers([(\"Ada\", 92), (\"Sam\", 74), (\"Kai\", 85)], 80))\nprint(high_scorers([], 80))",
    },
    practiceChallenges: [
      {
        title: "Core: Starred Record Average (`name, *scores`)",
        tier: "Core",
        goal: "Unpack `row` into `(name, *scores)` and return `\"<name> avg: <mean:.2f>\"` (`\"<name> avg: 0.00\"` if zero scores follow).",
        constraints: ["Handle 1-element row (name only) without dividing by zero"],
        examples: [
          { input: "row = (\"Noor\", 88, 91, 95)", output: "Noor avg: 91.33" },
          { input: "row = (\"Kai\",)", output: "Kai avg: 0.00" },
        ],
        tasks: [
          "Unpack `name, *scores = row`.",
          "Guard `not scores` returning `f\"{name} avg: 0.00\"`.",
        ],
        starterCode: "# Exercise M06.1 Core: starred record unpacking\ndef record_average(row):\n    # TODO: unpack name, *scores and format mean\n    return \"\"\n",
        expectedOutput: "Noor avg: 91.33\nKai avg: 0.00",
        hint: "When `row` is a 1-tuple `(\"Kai\",)`, `scores` becomes `[]`.",
        complexity: { time: "O(k)", space: "O(k)" },
        solutionCode:
          "def record_average(row):\n    name, *scores = row\n    if not scores:\n        return f\"{name} avg: 0.00\"\n    return f\"{name} avg: {sum(scores) / len(scores):.2f}\"\n\nprint(record_average((\"Noor\", 88, 91, 95)))\nprint(record_average((\"Kai\",)))",
      },
      {
        title: "Stretch: Rotate Trio Without Temporary Variable",
        tier: "Stretch",
        goal: "Given 3-tuple `(a, b, c)` and direction `left=True`, rotate left `(b, c, a)` or right `(c, a, b)` in a single tuple unpacking assignment.",
        constraints: ["Use simultaneous tuple rebinding"],
        examples: [
          { input: "triple = (1, 2, 3), left = True", output: "(2, 3, 1)" },
          { input: "triple = (1, 2, 3), left = False", output: "(3, 1, 2)" },
        ],
        tasks: [
          "Unpack `a, b, c = triple`.",
          "Rotate simultaneously with `(b, c, a)` or `(c, a, b)`.",
        ],
        starterCode: "# Exercise M06.1 Stretch: simultaneous tuple rotation\ndef rotate_three(triple, left=True):\n    # TODO: unpack a, b, c and rotate left/right\n    return triple\n",
        expectedOutput: "(2, 3, 1)\n(3, 1, 2)",
        hint: "Right rotation moves the last item `c` to the front: `(c, a, b)`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def rotate_three(triple, left=True):\n    a, b, c = triple\n    return (b, c, a) if left else (c, a, b)\n\nprint(rotate_three((1, 2, 3), left=True))\nprint(rotate_three((1, 2, 3), left=False))",
      },
    ],
  },

  "py-dicts-basics": {
    lessonId: "py-dicts-basics",
    subtitle: "Map hashable keys to values with `O(1)` lookup, `.get()`, `.items()`, `.setdefault()`, and `|` merging.",
    intro: {
      heading: "Fast Key-Value Maps With Dictionaries",
      explanation: [
        "Reading `counts[word]` on an unseen word crashes right away with `KeyError`, and deleting zero-stock entries inside `for k in stock:` throws `RuntimeError: dictionary changed size during iteration`. Searching a list of `(key, value)` pairs by scanning from index `0` also slows down as your data grows.",
        "Dictionaries hash keys directly to storage slots so lookups stay `O(1)` (constant average time whether the table holds 10 keys or 100,000). Using `.get(key, default)`, `.setdefault()`, `.pop(key, default)`, `list(d.keys())` snapshots during deletion, and `a | b` merges keeps lookups and updates crash-free.",
      ],
      analogy:
        "A dictionary works like a coat-check counter: instead of walking down the entire rack checking every tag, the attendant reads your ticket number and steps straight to that hook.",
      realWorldUses: [
        "Merging default settings with user overrides (`defaults | user_cfg`) and reading API JSON fields",
        "Building frequency counters, grouping buckets with `.setdefault()`, and `O(1)` ID-to-record indexes",
      ],
    },
    sections: [
      {
        heading: "Broken vs Working: Hashable Keys, Missing Lookups & Loop Deletion",
        paragraphs: [
          "Keys must be immutable/hashable (`str`, `int`, or a `tuple` of immutables); passing a mutable `list` key like `{[1, 2]: 1}` raises `TypeError: unhashable type: 'list'`. `k in d` checks keys in `O(1)` average time.",
          "Calling `users[\"guest\"]` or `del users[\"guest\"]` raises `KeyError` when `\"guest\"` is absent, whereas `.get(\"guest\")` and `.pop(\"guest\", None)` return your fallback. To delete matching keys inside a loop without triggering `RuntimeError`, iterate a snapshot `for k in list(d.keys()):`.",
        ],
        visual: {
          kind: "complexity",
          caption: "Hash-table dict lookup vs linear list scan across 100,000 items",
          inputSizeLabel: "N = 100,000 entries",
          bars: [
            { label: "dict[key] hash", formula: "O(1) direct slot", steps: 1, maxSteps: 100, active: true },
            { label: "x in list scan", formula: "O(n) sequential", steps: 100, maxSteps: 100 },
          ],
        },
        code: [
          "users = {\"ada\": {\"role\": \"admin\"}, \"sam\": {\"role\": \"user\"}}",
          "# users[\"guest\"]          # Error -> KeyError",
          "# {[1, 2]: \"bad\"}         # Error -> TypeError (list is unhashable)",
          "role = users.get(\"guest\", {}).get(\"role\", \"none\")",
          "removed = users.pop(\"guest\", None)",
          "print(\"ada\" in users, users[\"ada\"][\"role\"], role, removed)",
        ],
        output: "True admin none None",
      },
      {
        heading: "`.get()`, `.setdefault()`, `dict.fromkeys()`, and `|` Merge",
        paragraphs: [
          "`.get(key, default)` prevents `KeyError` during reads and frequency counting (`counts[v] = counts.get(v, 0) + 1`). `.setdefault(k, [])` creates grouping buckets in one line without overwriting existing lists.",
          "Avoid passing a mutable `[]` as the second value to `dict.fromkeys(keys, [])`, because every key shares that single list object; reserve `fromkeys` for immutable values like `0`.",
        ],
        table: {
          caption: "Dictionary Operations Reference",
          headers: ["Operation", "Behavior", "Example"],
          rows: [
            ["`d[k]` / `d[k] = v`", "Read (`KeyError` if missing) or assign", "`cfg[\"port\"] = 8080`"],
            ["`d.get(k, default)`", "Read with fallback if missing", "`counts.get(\"py\", 0)`"],
            ["`d.items()` / `.keys()` / `.values()`", "View of pairs, keys, or values", "`for k, v in d.items():`"],
            ["`d.pop(k, default)` / `del d[k]`", "Remove entry with fallback or raise `KeyError`", "`cfg.pop(\"tmp\", 0)`"],
            ["`d.setdefault(k, [])`", "Init bucket once if missing", "`groups.setdefault(k, []).append(v)`"],
            ["`a | b`", "New merged dict (`b` overrides `a`)", "`defaults | user_cfg`"],
          ],
        },
        visual: {
          kind: "loop-stepper",
          caption: "Step through frequency counting with counts.get(v, 0) + 1",
          code: [
            "votes = [\"py\", \"sql\", \"py\"]",
            "counts = {}",
            "for v in votes:",
            "    counts[v] = counts.get(v, 0) + 1",
            "print(counts)",
          ],
          iterations: [
            { label: "Init {}", activeLine: 2, vars: [{ name: "counts", value: "{}", changed: true }], output: "", status: "Start empty" },
            { label: "v='py' (1st)", activeLine: 4, vars: [{ name: "v", value: "'py'", changed: true }, { name: "counts", value: "{'py': 1}", changed: true }], output: "", status: "get returns 0 -> 1" },
            { label: "v='sql'", activeLine: 4, vars: [{ name: "v", value: "'sql'", changed: true }, { name: "counts", value: "{'py': 1, 'sql': 1}", changed: true }], output: "", status: "get returns 0 -> 1" },
            { label: "v='py' (2nd)", activeLine: 4, vars: [{ name: "v", value: "'py'", changed: true }, { name: "counts", value: "{'py': 2, 'sql': 1}", changed: true }], output: "", status: "get returns 1 -> 2" },
            { label: "Print counts", activeLine: 5, vars: [{ name: "counts", value: "{'py': 2, 'sql': 1}" }], output: "{'py': 2, 'sql': 1}", status: "Loop complete" },
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Word Counter & Config Merger Step by Step",
      subtitle: "Fix missing-key crashes with `.get()`, group into lists via `.setdefault()`, and merge configs without mutating inputs.",
      steps: [
        {
          label: "Count unseen words without KeyError using `.get(w, 0)`",
          explanation: "Direct `counts[w] += 1` crashes on the first `'py'`; `.get(w, 0)` returns `0` when the key is missing.",
          code: [
            "counts = {}",
            "for w in [\"py\", \"sql\", \"py\"]:",
            "    counts[w] = counts.get(w, 0) + 1",
            "print(counts)",
          ],
          activeLines: [2, 3],
          output: "{'py': 2, 'sql': 1}",
        },
        {
          label: "Group pairs into lists with `.setdefault()`",
          explanation: "Initialize an empty bucket once per new department, then append every member onto that bucket.",
          code: [
            "groups = {}",
            "for dept, name in [(\"eng\", \"Ada\"), (\"eng\", \"Sam\")]:",
            "    groups.setdefault(dept, []).append(name)",
            "print(groups)",
          ],
          activeLines: [2, 3],
          output: "{'eng': ['Ada', 'Sam']}",
        },
        {
          label: "Merge defaults and overrides using `|`",
          explanation: "Dict union creates a brand-new dictionary where right-side keys win, leaving `defaults` untouched.",
          code: [
            "defaults = {\"port\": 8000, \"debug\": False}",
            "user_cfg = {\"debug\": True}",
            "cfg = defaults | user_cfg",
            "print(cfg, defaults[\"debug\"])",
          ],
          activeLines: [3, 4],
          output: "{'port': 8000, 'debug': True} False",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `.get()`, `.setdefault()`, `|` Override, and Snapshot Key Deletion",
      steps: [
        {
          title: "Count frequencies without `KeyError` via `counts.get(w, 0) + 1`",
          tag: "PATTERN",
          explanation: ["First visit gets default `0 + 1 = 1`; repeat visits add `1` onto the stored total."],
          code: ["counts = {}","for w in [\"py\", \"sql\", \"py\"]:","    counts[w] = counts.get(w, 0) + 1"],
          activeLines: [2, 3],
          state: [{ name: "counts", value: "{'py': 2, 'sql': 1}", changed: true }],
          visual: {
            kind: "memory",
            caption: ".get(w, 0) supplies 0 on missing keys so + 1 never raises KeyError.",
            frames: [{ name: "Globals", bindings: [{ label: "counts", targetId: "cnt", highlight: true }] }],
            objects: [
              {
                id: "cnt",
                typeLabel: "dict",
                value: "2 keys",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "'py'", value: "2", active: true },
                  { index: "'sql'", value: "1", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "Group pairs with `groups.setdefault(dept, []).append(name)`",
          tag: "TRACE",
          explanation: ["First `'eng'` creates `['Ada']`; second `'eng'` reuses the same list -> `['Ada', 'Sam']`."],
          code: ["groups = {}","for d, n in [(\"eng\", \"Ada\"), (\"eng\", \"Sam\")]:","    groups.setdefault(d, []).append(n)"],
          activeLines: [2, 3],
          state: [{ name: "groups", value: "{'eng': ['Ada', 'Sam']}", changed: true }],
          visual: {
            kind: "memory",
            caption: "setdefault initializes [] once per new key and returns that shared list for .append.",
            frames: [{ name: "Globals", bindings: [{ label: "groups", targetId: "grp", highlight: true }] }],
            objects: [
              { id: "grp", typeLabel: "dict", value: "{'eng': -> list}", mutable: true, cells: [{ index: "'eng'", value: "ref -> lst", active: true }] },
              { id: "lst", typeLabel: "list", value: "['Ada', 'Sam']", mutable: true, highlight: true, cells: [{ index: "0", value: "'Ada'" }, { index: "1", value: "'Sam'", active: true }] },
            ],
          },
        },
        {
          title: "Snapshot keys with `list(stock.keys())` before `del` inside loop",
          tag: "PITFALL",
          explanation: ["Iterating `for k in stock:` while deleting raises `RuntimeError`; copying keys avoids shrinking under the iterator."],
          code: ["stock = {\"pen\": 5, \"mug\": 0}","for item in list(stock.keys()):","    if stock[item] == 0:","        del stock[item]"],
          activeLines: [2, 3, 4],
          state: [{ name: "stock", value: "{'pen': 5}", changed: true }],
          visual: {
            kind: "memory",
            caption: "Looping over a list(stock.keys()) snapshot lets del remove 'mug' from stock without RuntimeError.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "stock", targetId: "stk", highlight: true },
                  { label: "snapshot", targetId: "snap" },
                ],
              },
            ],
            objects: [
              { id: "stk", typeLabel: "dict", value: "{'pen': 5}", mutable: true, highlight: true, cells: [{ index: "'pen'", value: "5", active: true }] },
              { id: "snap", typeLabel: "list", value: "['pen', 'mug']", mutable: true, cells: [{ index: "0", value: "'pen'" }, { index: "1", value: "'mug' (deleted)", active: true }] },
            ],
          },
        },
        {
          title: "Merge defaults with user overrides (`defaults | user`)",
          tag: "CHECK",
          explanation: ["Right-hand keys win on conflict while preserving left-hand defaults."],
          code: ["cfg = {\"port\": 8000, \"debug\": False} | {\"debug\": True}"],
          activeLines: [1],
          state: [{ name: "cfg", value: "{'port': 8000, 'debug': True}", changed: true }],
          visual: {
            kind: "memory",
            caption: "Dict union (|) builds a new dict and lets matching keys from user overwrite defaults.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "defaults", targetId: "d_def" },
                  { label: "user", targetId: "d_usr" },
                  { label: "cfg", targetId: "d_cfg", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "d_def", typeLabel: "dict", value: "port=8000, debug=False" },
              { id: "d_usr", typeLabel: "dict", value: "debug=True" },
              {
                id: "d_cfg",
                typeLabel: "dict",
                value: "2 keys",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "'port'", value: "8000" },
                  { index: "'debug'", value: "True (wins)", active: true },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using mutable lists as dictionary keys (`{[1, 2]: 1}` -> `TypeError`)",
        detail: "Convert mutable key sequences into immutable `tuple` keys like `(row, col)`.",
      },
      {
        title: "Deleting keys while iterating `for k in d:` raises `RuntimeError`",
        detail: "Iterate `list(d.keys())` or build a new filtered dict with a loop (dict comprehensions arrive in Module 9).",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(inv.get(\"pear\", 0), \"apple\" in inv)` print?",
        code: "inv = {\"apple\": 5, \"mango\": 2}\nprint(inv.get(\"pear\", 0), \"apple\" in inv)",
        options: [
          { id: "a", label: "`None True`" },
          { id: "b", label: "`0 True`" },
          { id: "c", label: "`KeyError`" },
        ],
        correctId: "b",
        explanation: "`.get` returns `0` when missing; `in` inspects keys.",
      },
      {
        prompt: "What happens if `{[1, 2]: \"ok\"}` runs?",
        code: "d = {[1, 2]: \"ok\"}",
        options: [
          { id: "a", label: "Valid 1-key dictionary" },
          { id: "b", label: "`TypeError: unhashable type: 'list'`" },
          { id: "c", label: "Turns `[1, 2]` into a tuple automatically" },
        ],
        correctId: "b",
        explanation: "Dictionary keys must be hashable.",
      },
    ],
    practiceTask: {
      title: "Warmup: Word Frequency Counter Dict",
      tier: "Warmup",
      goal: "Count word occurrences in lowercase `text` and return a sorted list of `(word, count)` pairs appearing `>= min_count`.",
      constraints: ["Case-insensitive counting via .lower().split()"],
      examples: [
        { input: "text = \"Code test run code debug test code\", min_count = 2", output: "[('code', 3), ('test', 2)]" },
        { input: "text = \"\", min_count = 1", output: "[]" },
      ],
      tasks: [
        "Split `text.lower().split()` and count with `freq.get(w, 0) + 1`.",
        "Collect `(w, n)` where `n >= min_count` sorted by `w`.",
      ],
      starterCode: "# Exercise M06.2 Warmup: frequency dictionary\ndef word_counts(text, min_count=1):\n    # TODO: count words with .get() and sort filtered pairs\n    return []\n",
      expectedOutput: "[('code', 3), ('test', 2)]\n[]",
      hint: "Wrap final list in `sorted(...)` so output order stays deterministic.",
      complexity: { time: "O(n log k)", space: "O(k)" },
      solutionCode:
        "def word_counts(text, min_count=1):\n    freq = {}\n    for w in text.lower().split():\n        freq[w] = freq.get(w, 0) + 1\n    pairs = []\n    for w, n in freq.items():\n        if n >= min_count:\n            pairs.append((w, n))\n    return sorted(pairs)\n\nprint(word_counts(\"Code test run code debug test code\", 2))\nprint(word_counts(\"\", 1))",
    },
    practiceChallenges: [
      {
        title: "Core: Merge Config Overrides & Safe Read",
        tier: "Core",
        goal: "Merge `base | overrides` without mutating either input dict, then return `(cfg.get(\"port\", 80), cfg.get(\"timeout\", 30))`.",
        constraints: ["Do not mutate base or overrides"],
        examples: [
          { input: "base = {\"host\": \"a\", \"port\": 8000}, overrides = {\"port\": 443}", output: "(443, 30)" },
          { input: "base = {}, overrides = {\"timeout\": 15}", output: "(80, 15)" },
        ],
        tasks: [
          "Compute `cfg = base | overrides`.",
          "Read `port` and `timeout` via `.get(..., default)`.",
        ],
        starterCode: "# Exercise M06.2 Core: non-mutating dict merge\ndef resolve_net(base, overrides):\n    # TODO: merge dicts with | and extract (port, timeout)\n    return (80, 30)\n",
        expectedOutput: "(443, 30)\n(80, 15)",
        hint: "`base | overrides` allocates a brand-new dictionary.",
        complexity: { time: "O(len(base) + len(overrides))", space: "O(len)" },
        solutionCode:
          "def resolve_net(base, overrides):\n    cfg = base | overrides\n    return (cfg.get(\"port\", 80), cfg.get(\"timeout\", 30))\n\nprint(resolve_net({\"host\": \"a\", \"port\": 8000}, {\"port\": 443}))\nprint(resolve_net({}, {\"timeout\": 15}))",
      },
      {
        title: "Stretch: Group Records & Prune Zero-Count Keys With Snapshot",
        tier: "Stretch",
        goal: "Given `(dept, name)` pairs, group names into `dept -> list` using `.setdefault`, then delete any keys from `stock` whose count is `<= 0` (via `list(stock.keys())`), returning `(groups, stock)`.",
        constraints: ["Mutate a copy of stock without RuntimeError"],
        examples: [
          { input: "pairs = [(\"eng\", \"Ada\"), (\"eng\", \"Sam\"), (\"ops\", \"Bo\")], stock = {\"pen\": 5, \"mug\": 0}", output: "({'eng': ['Ada', 'Sam'], 'ops': ['Bo']}, {'pen': 5})" },
          { input: "pairs = [], stock = {\"a\": 0, \"b\": -1}", output: "({}, {})" },
        ],
        tasks: [
          "Populate `groups` using `groups.setdefault(dept, []).append(name)`.",
          "Copy `s = stock.copy()` and iterate `list(s.keys())` deleting entries `<= 0`.",
        ],
        starterCode: "# Exercise M06.2 Stretch: group + snapshot key pruning\ndef group_and_prune(pairs, stock):\n    # TODO: group via setdefault and prune stock <= 0 without RuntimeError\n    return ({}, {})\n",
        expectedOutput: "({'eng': ['Ada', 'Sam'], 'ops': ['Bo']}, {'pen': 5})\n({}, {})",
        hint: "Snapshotting `list(s.keys())` lets you call `del s[k]` without changing the iterated list.",
        complexity: { time: "O(p + k)", space: "O(p + k)" },
        solutionCode:
          "def group_and_prune(pairs, stock):\n    groups = {}\n    for dept, name in pairs:\n        groups.setdefault(dept, []).append(name)\n    cleaned = stock.copy()\n    for k in list(cleaned.keys()):\n        if cleaned[k] <= 0:\n            del cleaned[k]\n    return (groups, cleaned)\n\nprint(group_and_prune([(\"eng\", \"Ada\"), (\"eng\", \"Sam\"), (\"ops\", \"Bo\")], {\"pen\": 5, \"mug\": 0}))\nprint(group_and_prune([], {\"a\": 0, \"b\": -1}))",
      },
    ],
  },

  "py-sets-unique": {
    lessonId: "py-sets-unique",
    subtitle: "Store unique hashable elements with `set()`, update with `.add()`/`.discard()`, and compare groups with `&`, `|`, `-`.",
    intro: {
      heading: "Unordered Unique Elements and Set Math",
      explanation: [
        "Checking `if uid in seen_list:` inside a loop forces Python to scan `seen_list` from start to finish on every single check, which stalls once lists grow past a few thousand items. Writing `seen = {}` also tricks beginners into creating an empty `dict` (`AttributeError` on `.add()`), and calling `.remove(x)` on a missing item crashes with `KeyError`.",
        "A `set` keeps unique hashable elements with `O(1)` membership tests, silent `.discard(x)` removal when an item is absent, and direct group math (`&`, `|`, `-`). When duplicate removal also needs to preserve original order, `list(dict.fromkeys(items))` keeps first-seen positions intact.",
      ],
      analogy:
        "A set works like a venue check-in stamp pad: it tracks whether a name has arrived without keeping arrival order, and stamping the same name twice leaves a single entry.",
      realWorldUses: [
        "Deduplicating user IDs, tags, or visited coordinates with `O(1)` membership checks",
        "Comparing cohorts or skill gaps in one expression using `&` (shared), `|` (combined), and `-` (missing)",
      ],
    },
    sections: [
      {
        heading: "Broken vs Working: `set()` vs `{}`, `.discard()` vs `.remove()`, & Hashability",
        paragraphs: [
          "Empty braces `{}` create a `dict`, so calling `{}.add(\"py\")` raises `AttributeError`. Always start an empty set with `set()`. To drop an element without crashing when it is absent, call `.discard(x)` instead of `.remove(x)` (which raises `KeyError`).",
          "Elements must be hashable (`str`, `int`, `tuple` of immutables); placing `[1, 2]` inside a set raises `TypeError: unhashable type: 'list'`.",
        ],
        code: [
          "# bad = {}; bad.add(\"py\")    # Error -> AttributeError ({} is a dict)",
          "# {[1, 2]}                   # Error -> TypeError (list is unhashable)",
          "seen = set()",
          "seen.add(\"py\")",
          "seen.update([\"sql\", \"py\", \"git\"])",
          "seen.discard(\"missing\")      # no-op; .remove(\"missing\") raises KeyError",
          "print(sorted(seen), len(seen))",
        ],
        output: "['git', 'py', 'sql'] 3",
      },
      {
        heading: "Set Operations (`&`, `|`, `-`) vs Order-Preserving `dict.fromkeys()`",
        paragraphs: [
          "Compare two sets directly: `a & b` finds shared elements, `a | b` merges unique items from either side, and `a - b` keeps elements present in `a` that are missing from `b`.",
          "Because `set` has no guaranteed order, `list(dict.fromkeys(events))` is the standard idiom when you want unique entries kept in first-seen sequence.",
        ],
        visual: {
          kind: "compare",
          leftTitle: "Set Operators & Dedup Tools",
          rightTitle: "Result / Guarantee",
          rows: [
            { left: "a & b (intersection)", right: "Items present in both a and b", highlight: true },
            { left: "a | b (union)", right: "Unique items in either a or b", highlight: true },
            { left: "a - b (difference)", right: "Items in a that are not in b" },
            { left: "set(items) vs dict.fromkeys(items)", right: "set() drops order; dict.fromkeys() preserves order" },
          ],
        },
        table: {
          caption: "Set Operations Quick Reference",
          headers: ["Syntax", "Meaning", "If Item Missing"],
          rows: [
            ["`seen = set()`", "Empty set constructor (`{}` is dict)", "Always use `set()`"],
            ["`s.add(x)` / `.update(seq)`", "Inserts one / many unique hashables", "No-op on duplicates"],
            ["`s.discard(x)` vs `.remove(x)`", "Deletes `x`", "`.discard` is a no-op; `.remove` raises `KeyError`"],
            ["`a & b`, `a | b`, `a - b`", "Intersection, union, difference", "Always returns new `set`"],
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build an Order-Safe Skill Gap & Dedup Helper Step by Step",
      subtitle: "Initialize with `set()`, avoid `KeyError` on removal, then compare cohorts and preserve order.",
      steps: [
        {
          label: "Initialize with `set()` and drop missing tags via `.discard()`",
          explanation: "Start with `set()` (never `{}`), add items with `.update()`, and remove optional tags with `.discard()` so missing keys cause no crash.",
          code: [
            "seen = set()",
            "seen.update([\"py\", \"sql\", \"py\"])",
            "seen.discard(\"rust\")",
            "print(sorted(seen))",
          ],
          activeLines: [1, 3],
          output: "['py', 'sql']",
        },
        {
          label: "Compute shared (`&`) and missing (`-`) skills in one line",
          explanation: "`alice & job` finds matching skills while `job - alice` isolates missing requirements.",
          code: [
            "alice = {\"py\", \"sql\", \"git\"}",
            "job = {\"py\", \"sql\", \"docker\"}",
            "print(sorted(alice & job), sorted(job - alice))",
          ],
          activeLines: [3],
          output: "['py', 'sql'] ['docker']",
        },
        {
          label: "Deduplicate an event log while preserving first-seen order",
          explanation: "When arrival order matters, `list(dict.fromkeys(events))` keeps unique items in their original sequence.",
          code: [
            "events = [\"login\", \"click\", \"login\", \"buy\"]",
            "ordered = list(dict.fromkeys(events))",
            "print(ordered)",
          ],
          activeLines: [2],
          output: "['login', 'click', 'buy']",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `set()` vs `{}`, `.discard()` No-Op & Set Differences",
      steps: [
        {
          title: "Distinguish `set()` from `{}` (empty `dict` trap)",
          tag: "PITFALL",
          explanation: ["Calling `{}.add(\"py\")` fails with `AttributeError`; always call `set()`."],
          code: ["bad = {}     # type is dict", "good = set() # type is set", "good.add(\"py\")"],
          activeLines: [1, 2, 3],
          state: [
            { name: "type(bad)", value: "dict", changed: true },
            { name: "good", value: "{'py'}", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Empty braces {} create a dict; set() creates an empty set.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "bad", targetId: "dbad" },
                  { label: "good", targetId: "sgood", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "dbad", typeLabel: "dict", value: "{} (no .add)" },
              { id: "sgood", typeLabel: "set", value: "{'py'}", mutable: true, highlight: true },
            ],
          },
        },
        {
          title: "Remove absent item without `KeyError` via `.discard()`",
          tag: "PATTERN",
          explanation: ["`.discard(\"rust\")` skips absent items instead of crashing with `KeyError` like `.remove()`."],
          code: ["skills = {\"py\", \"sql\"}", "skills.discard(\"rust\")  # no-op if absent"],
          activeLines: [1, 2],
          state: [{ name: "skills", value: "{'py', 'sql'}" }],
          visual: {
            kind: "memory",
            caption: ".discard checks the hash table for 'rust' and leaves the set unchanged without KeyError.",
            frames: [{ name: "Globals", bindings: [{ label: "skills", targetId: "sk_set", highlight: true }] }],
            objects: [
              {
                id: "sk_set",
                typeLabel: "set",
                value: "{'py', 'sql'}",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "hash", value: "'py'" },
                  { index: "hash", value: "'sql'" },
                  { index: "missing", value: "'rust' (no-op)", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "Compute shared (`&`) and missing (`-`) skills in 1 operator",
          tag: "TRACE",
          explanation: ["`alice & job` yields overlap; `job - alice` finds gaps directly."],
          code: ["alice = {\"py\", \"sql\", \"git\"}", "job = {\"py\", \"sql\", \"docker\"}", "shared = alice & job", "gaps = job - alice"],
          activeLines: [3, 4],
          state: [
            { name: "shared", value: "{'py', 'sql'}", changed: true },
            { name: "gaps", value: "{'docker'}", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Set intersection (&) extracts overlap; difference (-) keeps elements missing from alice.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "shared (alice & job)", targetId: "s_and", highlight: true },
                  { label: "gaps (job - alice)", targetId: "s_diff", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "s_and", typeLabel: "set", value: "{'py', 'sql'}", highlight: true },
              { id: "s_diff", typeLabel: "set", value: "{'docker'}", highlight: true },
            ],
          },
        },
        {
          title: "Keep original order when deduplicating via `dict.fromkeys`",
          tag: "CONCEPT",
          explanation: ["`list(dict.fromkeys(events))` removes later repeats without scrambling positions."],
          code: ["events = [\"login\", \"click\", \"login\", \"buy\"]", "ordered = list(dict.fromkeys(events))"],
          activeLines: [1, 2],
          state: [{ name: "ordered", value: "['login', 'click', 'buy']", changed: true }],
          visual: {
            kind: "memory",
            caption: "dict.fromkeys preserves first-seen order while skipping the duplicate second 'login'.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "events", targetId: "ev_lst" },
                  { label: "ordered", targetId: "ord_lst", highlight: true },
                ],
              },
            ],
            objects: [
              {
                id: "ev_lst",
                typeLabel: "list",
                value: "4 items",
                cells: [
                  { index: "0", value: "'login'" },
                  { index: "1", value: "'click'" },
                  { index: "2", value: "'login' (dup)" },
                  { index: "3", value: "'buy'" },
                ],
              },
              {
                id: "ord_lst",
                typeLabel: "list",
                value: "['login', 'click', 'buy']",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "0", value: "'login'", active: true },
                  { index: "1", value: "'click'", active: true },
                  { index: "2", value: "'buy'", active: true },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `{}` instead of `set()` to create an empty set",
        detail: "`{}` is always an empty dict; `set()` constructs an empty set.",
      },
      {
        title: "Expecting `list(set(items))` to preserve insertion order",
        detail: "Sets have hash-based arbitrary order; use `list(dict.fromkeys(items))` when order matters.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `len(set(\"banana\"))` return?",
        code: "print(len(set(\"banana\")))",
        options: [
          { id: "a", label: "`6`" },
          { id: "b", label: "`1`" },
          { id: "c", label: "`3`" },
        ],
        correctId: "c",
        explanation: "Distinct characters are `'b'`, `'a'`, and `'n'`.",
      },
      {
        prompt: "What is `sorted({1, 2, 3} & {3, 4})`?",
        code: "print(sorted({1, 2, 3} & {3, 4}))",
        options: [
          { id: "a", label: "`[3]`" },
          { id: "b", label: "`[1, 2, 3, 4]`" },
          { id: "c", label: "`[1, 2]`" },
        ],
        correctId: "a",
        explanation: "`&` keeps elements common to both sets (`3`).",
      },
    ],
    practiceTask: {
      title: "Warmup: Returning vs New Today Visitors",
      tier: "Warmup",
      goal: "Given `yesterday` and `today` visitor lists, return `(sorted(returning), sorted(new_today))` using set `&` and `-`.",
      constraints: ["Return deterministic sorted lists inside the tuple"],
      examples: [
        { input: "yesterday = [\"Ada\", \"Sam\", \"Ada\"], today = [\"Sam\", \"Noor\", \"Noor\"]", output: "(['Sam'], ['Noor'])" },
        { input: "yesterday = [], today = [\"Kai\"]", output: "([], ['Kai'])" },
      ],
      tasks: [
        "Convert both inputs to `set`.",
        "Return `(sorted(y_set & t_set), sorted(t_set - y_set))`.",
      ],
      starterCode: "# Exercise M06.3 Warmup: set intersection and difference\ndef compare_visitors(yesterday, today):\n    # TODO: compute returning and new_today via sets\n    return ([], [])\n",
      expectedOutput: "(['Sam'], ['Noor'])\n([], ['Kai'])",
      hint: "`t_set - y_set` gives people in `today` not seen `yesterday`.",
      complexity: { time: "O(n log n)", space: "O(n)" },
      solutionCode:
        "def compare_visitors(yesterday, today):\n    y_set, t_set = set(yesterday), set(today)\n    return (sorted(y_set & t_set), sorted(t_set - y_set))\n\nprint(compare_visitors([\"Ada\", \"Sam\", \"Ada\"], [\"Sam\", \"Noor\", \"Noor\"]))\nprint(compare_visitors([], [\"Kai\"]))",
    },
    practiceChallenges: [
      {
        title: "Core: Order-Preserving Deduplicator",
        tier: "Core",
        goal: "Remove repeated entries from `events` while keeping exact first-seen insertion order.",
        constraints: ["Do not use set() for final ordering"],
        examples: [
          { input: "events = [\"login\", \"click\", \"login\", \"buy\"]", output: "['login', 'click', 'buy']" },
          { input: "events = []", output: "[]" },
        ],
        tasks: [
          "Use `list(dict.fromkeys(events))`.",
          "Verify empty input returns `[]`.",
        ],
        starterCode: "# Exercise M06.3 Core: ordered deduplication\ndef dedupe_ordered(events):\n    # TODO: preserve first-seen order without duplicates\n    return []\n",
        expectedOutput: "['login', 'click', 'buy']\n[]",
        hint: "In Python 3.7+, dictionary keys retain insertion order.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def dedupe_ordered(events):\n    return list(dict.fromkeys(events))\n\nprint(dedupe_ordered([\"login\", \"click\", \"login\", \"buy\"]))\nprint(dedupe_ordered([]))",
      },
      {
        title: "Stretch: Remove Missing Tags With `.discard()` & Symmetric Gap",
        tier: "Stretch",
        goal: "Start from `a` as a set copy of `base`, discard every tag in `drop` without raising `KeyError`, add tags in `add`, and return `sorted(a ^ set(baseline))` (`^` = elements in one set only).",
        constraints: ["drop may contain items absent from base"],
        examples: [
          { input: "base = [\"py\", \"git\"], drop = [\"rust\", \"git\"], add = [\"sql\"], baseline = [\"py\", \"ml\"]", output: "['ml', 'sql']" },
          { input: "base = [\"a\"], drop = [], add = [], baseline = [\"a\"]", output: "[]" },
        ],
        tasks: [
          "Start with `cur = set(base)`, `.discard(d)` for each `drop`, `.update(add)`.",
          "Return `sorted(cur ^ set(baseline))`.",
        ],
        starterCode: "# Exercise M06.3 Stretch: discard, update & symmetric difference\ndef patch_and_diff(base, drop, add, baseline):\n    # TODO: patch cur set and return symmetric diff sorted\n    return []\n",
        expectedOutput: "['ml', 'sql']\n[]",
        hint: "Symmetric difference `A ^ B` equals `(A - B) | (B - A)`.",
        complexity: { time: "O(n log n)", space: "O(n)" },
        solutionCode:
          "def patch_and_diff(base, drop, add, baseline):\n    cur = set(base)\n    for d in drop:\n        cur.discard(d)\n    cur.update(add)\n    return sorted(cur ^ set(baseline))\n\nprint(patch_and_diff([\"py\", \"git\"], [\"rust\", \"git\"], [\"sql\"], [\"py\", \"ml\"]))\nprint(patch_and_diff([\"a\"], [], [], [\"a\"]))",
      },
    ],
  },

  "py-collection-tradeoffs": {
    lessonId: "py-collection-tradeoffs",
    subtitle: "Pick the right Python collection (`list`, `tuple`, `set`, `dict`) by ordering, mutability, lookup speed, and nesting needs.",
    intro: {
      heading: "Choosing Between list, tuple, set, and dict",
      explanation: [
        "Filtering 10,000 user IDs with `if uid not in banned_list:` scans up to 50,000 list entries per user—hundreds of millions of comparisons when a `set` checks each ID in one hash step. Using `[row, col]` as a dict key crashes with `TypeError: unhashable type: 'list'`, while dumping a click log into a `set` erases duplicate clicks and arrival order.",
        "Each of Python's four core containers solves a specific shape of data: `list` keeps indexed duplicates in order, `tuple` locks fixed fields into hashable keys, `set` gives `O(1)` uniqueness without order, and `dict` maps hashable keys to values in `O(1)` time.",
      ],
      analogy:
        "Choosing a container is like picking kitchen storage: a numbered spice rack (list) keeps order, a sealed spice pack (tuple) stays fixed, a stamp card (set) tracks unique entries, and a labelled jar shelf (dict) jumps straight to any ingredient by name.",
      realWorldUses: [
        "Replacing slow nested `O(n^2)` list scans with `O(1)` `set` or `dict` indexes",
        "Combining hashable `(row, col)` tuple keys with sparse `dict` grids or `dict` of `set` role indexes",
      ],
    },
    sections: [
      {
        heading: "All 4 Core Collections Side by Side",
        paragraphs: [
          "Ask three questions before picking a container: do items need numeric positions and duplicates (`list`), fixed unchangeable fields (`tuple`), fast deduplication and membership checks (`set`), or key-to-value lookup (`dict`)?",
          "In the table below, **Big-O** describes how work grows as item count `n` grows. `O(1)` takes constant time regardless of size (jumping straight to a hash slot), whereas `O(n)` walks item by item across all `n` entries.",
          "Broken vs working composite keys: `visited.add([1, 2])` fails with `TypeError: unhashable type: 'list'`, while `visited.add((1, 2))` succeeds because tuples of integers are immutable and hashable.",
        ],
        table: {
          caption: "Python Built-In Collections: list vs tuple vs set vs dict",
          headers: ["Collection", "Ordered?", "Mutable?", "Duplicates?", "Lookup `x in c`", "Best For"],
          rows: [
            ["`list` (`[1, 2]`)", "Yes (indexed)", "Yes", "Allowed", "`O(n)` scan", "Ordered queues, logs, sorting"],
            ["`tuple` (`(1, 2)`)", "Yes (indexed)", "No", "Allowed", "`O(n)` scan", "Fixed coordinates, dict keys"],
            ["`set` (`{1, 2}`)", "No", "Yes", "Unique only", "`O(1)` hash", "Fast deduplication & membership"],
            ["`dict` (`{\"a\": 1}`)", "Yes (insertion)", "Yes", "Unique keys", "`O(1)` hash (keys)", "Indexes, JSON records, counters"],
          ],
          highlightCol: 4,
        },
        visual: {
          kind: "complexity",
          caption: "Checking 50,000 banned IDs across 10,000 requests: set lookup vs list scan",
          inputSizeLabel: "M = 10,000 checks against N = 50,000 IDs",
          bars: [
            { label: "id in banned_set", formula: "O(1) per check", steps: 1, maxSteps: 100, active: true },
            { label: "id in banned_list", formula: "O(n) per check", steps: 100, maxSteps: 100 },
          ],
        },
        code: [
          "visited = {(0, 0), (1, 2)}     # valid: tuple keys are hashable",
          "# visited.add([1, 2])           # Error -> TypeError: unhashable type: 'list'",
          "records = {\"ada\": [90, 95]}      # dict mapping id -> list of scores",
          "print((1, 2) in visited, records[\"ada\"][-1])",
        ],
        output: "True 95",
      },
    ],
    guidedBuildUp: {
      title: "Upgrade a Slow List Filter Into a Hybrid Dict + Set Index",
      subtitle: "Move from `O(n)` list checks to `O(1)` set membership, tuple keys, and a `dict` of `set`s.",
      steps: [
        {
          label: "Convert a banned list to a `set` once for `O(1)` filtering",
          explanation: "Converting `banned` into `banned_set` outside the loop turns every `u not in banned_set` check into a single hash lookup.",
          code: [
            "banned_set = set([\"Bob\", \"Eve\"])",
            "kept = []",
            "for u in [\"Ada\", \"Bob\", \"Kai\"]:",
            "    if u not in banned_set:",
            "        kept.append(u)",
            "print(kept)",
          ],
          activeLines: [1, 4],
          output: "['Ada', 'Kai']",
        },
        {
          label: "Store sparse coordinates using hashable `(row, col)` tuple keys",
          explanation: "A `list` coordinate `[0, 2]` raises `TypeError` as a dict key; a `tuple` `(0, 2)` hashes without error.",
          code: [
            "board = {}",
            "board[(0, 2)] = \"X\"",
            "print(board[(0, 2)])",
          ],
          activeLines: [2],
          output: "X",
        },
        {
          label: "Combine `dict` + `set` to map each user ID to unique roles",
          explanation: "Nesting a `set` inside a `dict` gives `O(1)` user lookup plus automatic role deduplication.",
          code: [
            "roles = {}",
            "for uid, role in [(\"u1\", \"read\"), (\"u1\", \"write\"), (\"u1\", \"read\")]:",
            "    roles.setdefault(uid, set()).add(role)",
            "print(sorted(roles.get(\"u1\", set())))",
          ],
          activeLines: [3, 4],
          output: "['read', 'write']",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Match Real Tasks to list, tuple, set, or dict",
      steps: [
        {
          title: "Lookup ID -> profile? Choose `dict` (`O(1)` key index)",
          tag: "PATTERN",
          explanation: ["Searching a list of dicts takes `O(n)`; keying a `dict` by `id` makes every lookup `O(1)`."],
          code: ["by_id = {101: \"Ada\", 102: \"Sam\"}", "name = by_id.get(102)"],
          activeLines: [1, 2],
          state: [{ name: "name", value: "'Sam' in O(1)", changed: true }],
          visual: {
            kind: "memory",
            caption: "dict indexes directly by key hash in O(1) instead of scanning every entry.",
            frames: [{ name: "Globals", bindings: [{ label: "by_id", targetId: "d1", highlight: true }] }],
            objects: [
              {
                id: "d1",
                typeLabel: "dict (O(1) lookup)",
                value: "2 keys",
                mutable: true,
                cells: [
                  { index: "101", value: "'Ada'" },
                  { index: "102", value: "'Sam'", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "Repeatedly test `uid in banned`? Convert list to `set` once",
          tag: "TRACE",
          explanation: ["Converting `banned_list` to `banned_set = set(banned_list)` turns repeated `in` checks from `O(n)` to `O(1)`."],
          code: ["banned_set = set(banned_list)", "valid = []", "for u in users:", "    if u not in banned_set:", "        valid.append(u)"],
          activeLines: [1, 4],
          state: [{ name: "lookup", value: "O(1) hash check", changed: true }],
          visual: {
            kind: "memory",
            caption: "Build set(banned_list) once so every filter lookup is O(1) instead of O(n).",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "banned_list", targetId: "b_lst" },
                  { label: "banned_set", targetId: "b_set", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "b_lst", typeLabel: "list (O(n) scan)", value: "linear entries" },
              { id: "b_set", typeLabel: "set (O(1) hash)", value: "indexed elements", mutable: true, highlight: true },
            ],
          },
        },
        {
          title: "Need grid cell `(r, c)` inside a `set`? Use `tuple`, never `list`",
          tag: "CONCEPT",
          explanation: ["`[r, c]` is unhashable (`TypeError`); `(r, c)` tuple coordinates hash."],
          code: ["seen = set()", "seen.add((2, 3))"],
          activeLines: [1, 2],
          state: [{ name: "seen", value: "{(2, 3)}", changed: true }],
          visual: {
            kind: "memory",
            caption: "Sets and dict keys require immutable hashable elements like tuple (2, 3), whereas [2, 3] fails.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "coord", targetId: "coord_t", highlight: true },
                  { label: "seen", targetId: "seen_s", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "coord_t", typeLabel: "tuple (hashable)", value: "(2, 3)", highlight: true },
              { id: "seen_s", typeLabel: "set", value: "{(2, 3)}", mutable: true, highlight: true, cells: [{ index: "hash", value: "(2, 3) ok; [2, 3] TypeError", active: true }] },
            ],
          },
        },
        {
          title: "Need duplicate chronological events? Stick to `list`",
          tag: "CHECK",
          explanation: ["A `set` drops duplicate clicks and insertion order; `list` retains every event in sequence."],
          code: ["clicks = [\"home\", \"docs\", \"home\"]"],
          activeLines: [1],
          state: [{ name: "len(clicks)", value: "3 (duplicates preserved)", changed: true }],
          visual: {
            kind: "memory",
            caption: "A list keeps duplicates and arrival order; index 0 and index 2 both stay 'home'.",
            frames: [{ name: "Globals", bindings: [{ label: "clicks", targetId: "clk_l", highlight: true }] }],
            objects: [
              {
                id: "clk_l",
                typeLabel: "list",
                value: "3 items",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "0", value: "'home'", active: true },
                  { index: "1", value: "'docs'" },
                  { index: "2", value: "'home'", active: true },
                ],
              },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Scanning a large `list` in a loop when `set` or `dict` gives `O(1)` checks",
        detail: "Pre-build a `set` before running membership filters inside loops.",
      },
      {
        title: "Using `list` keys inside sparse dict maps (`grid[[0, 1]]` fails)",
        detail: "Use hashable tuples `(0, 1)` for composite dictionary or set keys.",
      },
    ],
    predictChecks: [
      {
        prompt: "Which type lets you use a `(row, col)` grid coordinate as a dictionary key?",
        code: "# grid[???] = 'ship'",
        options: [
          { id: "a", label: "`[row, col]` (`list`)" },
          { id: "b", label: "`(row, col)` (`tuple`)" },
          { id: "c", label: "`{row, col}` (`set`)" },
        ],
        correctId: "b",
        explanation: "Tuples of integers are immutable and hashable; lists and sets are mutable and unhashable.",
      },
      {
        prompt: "You need to filter `10,000` user IDs against `50,000` banned IDs quickly. What should `banned` be?",
        code: "for uid in users:\n    if uid not in banned:\n        kept.append(uid)",
        options: [
          { id: "a", label: "A `set` (`O(1)` lookup)" },
          { id: "b", label: "A `list` (`O(n)` scan)" },
          { id: "c", label: "A `tuple` (`O(n)` scan)" },
        ],
        correctId: "a",
        explanation: "A `set` keeps membership tests `O(1)` per user ID instead of scanning all 50,000 entries every pass.",
      },
    ],
    practiceTask: {
      title: "Warmup: Fast Allowed-Users Filter via Set",
      tier: "Warmup",
      goal: "Filter `users` keeping order, dropping any user appearing in `banned` by converting `banned` to a `set` first.",
      constraints: ["Must handle duplicates in users (keep non-banned order)"],
      examples: [
        { input: "users = [\"Ada\", \"Bob\", \"Kai\", \"Bob\"], banned = [\"Bob\"]", output: "['Ada', 'Kai']" },
        { input: "users = [\"Ada\"], banned = []", output: "['Ada']" },
      ],
      tasks: [
        "Build `banned_set = set(banned)`.",
        "Collect `u` where `u not in banned_set`.",
      ],
      starterCode: "# Exercise M06.4 Warmup: O(1) set-backed filter\ndef allowed_users(users, banned):\n    # TODO: convert banned to set and preserve user order\n    return []\n",
      expectedOutput: "['Ada', 'Kai']\n['Ada']",
      hint: "List iteration preserves order while `u not in banned_set` executes in `O(1)`.",
      complexity: { time: "O(u + b)", space: "O(u + b)" },
      solutionCode:
        "def allowed_users(users, banned):\n    banned_set = set(banned)\n    kept = []\n    for u in users:\n        if u not in banned_set:\n            kept.append(u)\n    return kept\n\nprint(allowed_users([\"Ada\", \"Bob\", \"Kai\", \"Bob\"], [\"Bob\"]))\nprint(allowed_users([\"Ada\"], []))",
    },
    practiceChallenges: [
      {
        title: "Core: Sparse 2D Board Dict With Tuple Keys",
        tier: "Core",
        goal: "Store `(row, col, val)` placements inside a sparse `dict` keyed by `(row, col)` (later placement overwrites earlier) and return sorted `[(coord, val), ...]`.",
        constraints: ["Use tuple keys (row, col) in dict"],
        examples: [
          { input: "moves = [(1, 2, \"X\"), (0, 0, \"O\"), (1, 2, \"O\")]", output: "[((0, 0), 'O'), ((1, 2), 'O')]" },
          { input: "moves = []", output: "[]" },
        ],
        tasks: [
          "Set `board[(r, c)] = val` while looping over `moves`.",
          "Return `sorted(board.items())`.",
        ],
        starterCode: "# Exercise M06.4 Core: tuple-key sparse dict\ndef build_board(moves):\n    # TODO: key dict by (r, c) tuple and return sorted items\n    return []\n",
        expectedOutput: "[((0, 0), 'O'), ((1, 2), 'O')]\n[]",
        hint: "Integers inside a 2-tuple compare lexicographically so `sorted(board.items())` sorts.",
        complexity: { time: "O(m log m)", space: "O(m)" },
        solutionCode:
          "def build_board(moves):\n    board = {}\n    for r, c, val in moves:\n        board[(r, c)] = val\n    return sorted(board.items())\n\nprint(build_board([(1, 2, \"X\"), (0, 0, \"O\"), (1, 2, \"O\")]))\nprint(build_board([]))",
      },
      {
        title: "Stretch: Build O(1) Lookup Index From Record List",
        tier: "Stretch",
        goal: "Convert a list of tuples `[(uid, role), ...]` into a `dict` mapping `uid -> set of roles` (maintaining unique roles per user), and return `sorted(index[query_uid])` or `[]` if missing.",
        constraints: ["One dict + set index handles arbitrary role duplicates"],
        examples: [
          { input: "entries = [(\"u1\", \"read\"), (\"u2\", \"admin\"), (\"u1\", \"write\"), (\"u1\", \"read\")], query_uid = \"u1\"", output: "['read', 'write']" },
          { input: "entries = [(\"u1\", \"read\")], query_uid = \"u9\"", output: "[]" },
        ],
        tasks: [
          "Populate `index.setdefault(uid, set()).add(role)`.",
          "Return `sorted(index.get(query_uid, set()))`.",
        ],
        starterCode: "# Exercise M06.4 Stretch: dict of sets hybrid index\ndef user_roles(entries, query_uid):\n    # TODO: index uid -> set(roles) and query without KeyError\n    return []\n",
        expectedOutput: "['read', 'write']\n[]",
        hint: "`.setdefault(uid, set()).add(role)` avoids missing-key errors and deduplicates roles in one pass.",
        complexity: { time: "O(e + k log k)", space: "O(e)" },
        solutionCode:
          "def user_roles(entries, query_uid):\n    index = {}\n    for uid, role in entries:\n        index.setdefault(uid, set()).add(role)\n    return sorted(index.get(query_uid, set()))\n\nprint(user_roles([(\"u1\", \"read\"), (\"u2\", \"admin\"), (\"u1\", \"write\"), (\"u1\", \"read\")], \"u1\"))\nprint(user_roles([(\"u1\", \"read\")], \"u9\"))",
      },
    ],
  },

  "py-refs-mutability": {
    lessonId: "py-refs-mutability",
    subtitle: "Trace how labels bind to heap objects (`id()`, `is` vs `==`), interning, and in-place `+=` vs `+` rebinding.",
    intro: {
      heading: "Variables as Labels Pointing to Memory Objects",
      explanation: [
        "Writing `b = a` on a list looks like creating an independent backup, until `b.append(3)` mutates `a` to `[1, 2, 3]` as well. Checking `x is 1000` after `x = int(\"1000\")` also catches learners off guard by returning `False` even when `x == 1000` is `True`, because Python caches small integers (`-5` to `256`) and builds separate objects for larger numbers.",
        "Variables in Python are labels attached to objects in memory, so `b = a` adds a second label onto the same object without copying. Immutable objects (`int`, `str`, `tuple`) allocate a fresh object on modification, while mutable objects (`list`, `dict`, `set`) edit contents in place under the same `id()`.",
      ],
      analogy:
        "Variable names act like sticky notes placed on storage boxes: `b = a` sticks a second note on the same box, while `a = [9]` moves note `a` onto a brand-new box without touching note `b`.",
      realWorldUses: [
        "Predicting when `b = a` or `+=` shares mutations across two names vs when `+` creates a separate list",
        "Checking `x is None` for object identity while always using `==` to compare numbers and strings",
      ],
    },
    sections: [
      {
        heading: "Object Identity (`id()`, `is` vs `==`) & Integer Caching",
        paragraphs: [
          "`==` checks value equality while `is` checks whether two names reference the exact same object in memory (`id(x) == id(y)`).",
          "CPython caches small integers (`-5..256`) and certain short strings (**interning**), so `10 is int(\"10\")` evaluates to `True` while `1000 is int(\"1000\")` evaluates to `False`. Compare values with `==` and reserve `is` for `None`.",
        ],
        code: [
          "a = 10",
          "b = a",
          "a = 99",
          "x = 1000",
          "y = int(\"1000\")",
          "print(a, b, a is b, x == y, x is y)",
        ],
        output: "99 10 False True False",
      },
      {
        heading: "Mutable vs Immutable Updates (`+=` vs `+`)",
        paragraphs: [
          "On an immutable `str`, `s += \"!\"` builds a new string and moves `s` onto it (`id(s)` changes). On a mutable `list`, `nums += [3]` mutates the existing list in place (`id(nums)` stays identical and aliases see the change), whereas `nums = nums + [4]` builds a new list and detaches `nums` from earlier aliases.",
        ],
        table: {
          caption: "Immutable vs Mutable Object Update Semantics",
          headers: ["Category", "Types", "`id()` After Update"],
          rows: [
            ["Immutable", "`int`, `float`, `str`, `bool`, `tuple`, `None`", "Changes (new object built)"],
            ["Mutable", "`list`, `dict`, `set`", "`.append()` / `+=` keeps same `id()`; `+` creates new `id()`"],
          ],
        },
        visual: {
          kind: "memory-sim",
          caption: "Compare shared list aliasing (b = a) vs separate copy (b = a.copy())",
          scenarios: [
            {
              label: "List Alias (b = a)",
              code: ["a = [1, 2]", "b = a", "b.append(3)"],
              steps: [
                {
                  line: 1,
                  note: "`a` binds to mutable `[1, 2]`.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "l1", highlight: true }] }],
                  objects: [{ id: "l1", typeLabel: "list", value: "[1, 2]", mutable: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }] }],
                },
                {
                  line: 2,
                  note: "`b = a` points `b` to the same list object (`id(a) == id(b)`).",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "l1" }, { label: "b", targetId: "l1", highlight: true }] }],
                  objects: [{ id: "l1", typeLabel: "list", value: "[1, 2]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }] }],
                },
                {
                  line: 3,
                  note: "`b.append(3)` mutates that single shared list, updating `a` too.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "l1" }, { label: "b", targetId: "l1", highlight: true }] }],
                  objects: [{ id: "l1", typeLabel: "list", value: "[1, 2, 3]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }, { index: "2", value: "3", active: true }] }],
                },
              ],
            },
            {
              label: "Independent Copy (b = a.copy())",
              code: ["a = [1, 2]", "b = a.copy()", "b.append(3)"],
              steps: [
                {
                  line: 1,
                  note: "`a` points to `[1, 2]`.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "c1", highlight: true }] }],
                  objects: [{ id: "c1", typeLabel: "list", value: "[1, 2]", mutable: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }] }],
                },
                {
                  line: 2,
                  note: "`a.copy()` creates a separate object `c2` for `b`.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "c1" }, { label: "b", targetId: "c2", highlight: true }] }],
                  objects: [
                    { id: "c1", typeLabel: "list", value: "[1, 2]", mutable: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }] },
                    { id: "c2", typeLabel: "list", value: "[1, 2]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }] },
                  ],
                },
                {
                  line: 3,
                  note: "Mutating `b` leaves `a` untouched.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "c1" }, { label: "b", targetId: "c2", highlight: true }] }],
                  objects: [
                    { id: "c1", typeLabel: "list", value: "[1, 2]", mutable: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }] },
                    { id: "c2", typeLabel: "list", value: "[1, 2, 3]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }, { index: "2", value: "3", active: true }] },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Trace Aliasing, Rebinding, and `+=` vs `+` Step by Step",
      subtitle: "See when two names share one list object and when an operation breaks that link.",
      steps: [
        {
          label: "`b = a` creates an alias to the same list",
          explanation: "Assigning `b = a` copies the reference, so `b.append(3)` modifies `a` as well.",
          code: [
            "a = [1, 2]",
            "b = a",
            "b.append(3)",
            "print(a, b, a is b)",
          ],
          activeLines: [2, 3, 4],
          output: "[1, 2, 3] [1, 2, 3] True",
        },
        {
          label: "`+=` mutates the shared list, while `+` creates a new list",
          explanation: "`a += [3]` edits the shared list seen by `b`; `a = a + [4]` builds a new list and moves `a` onto it.",
          code: [
            "a = [1, 2]",
            "b = a",
            "a += [3]",
            "a = a + [4]",
            "print(a, b)",
          ],
          activeLines: [3, 4, 5],
          output: "[1, 2, 3, 4] [1, 2, 3]",
        },
        {
          label: "Break aliasing with `.copy()` and compare values via `==`",
          explanation: "Copying creates a second independent list (`prices is sale` is `False`) so editing `sale` leaves `prices` intact.",
          code: [
            "prices = [20.0, 35.0]",
            "sale = prices.copy()",
            "sale.append(9.99)",
            "print(prices == sale, prices is sale, prices, sale)",
          ],
          activeLines: [2, 3, 4],
          output: "False False [20.0, 35.0] [20.0, 35.0, 9.99]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Label Binding, `+=` In-Place Mutation & Rebinding",
      steps: [
        {
          title: "`b = a` points both labels at the same `[1, 2]` list",
          tag: "MEMORY",
          explanation: ["Mutating through `b.append(3)` makes `[1, 2, 3]` visible through both `a` and `b`."],
          code: ["a = [1, 2]", "b = a", "b.append(3)", "a = [9]"],
          activeLines: [2, 3],
          visual: {
            kind: "memory",
            caption: "Both labels reference the same list",
            frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "lst0" }, { label: "b", targetId: "lst0", highlight: true }] }],
            objects: [{ id: "lst0", typeLabel: "list", value: "[1, 2, 3]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }, { index: "2", value: "3", active: true }] }],
          },
          state: [
            { name: "a", value: "[1, 2, 3]", changed: true },
            { name: "b", value: "[1, 2, 3]", changed: true },
          ],
        },
        {
          title: "`a = [9]` moves label `a` onto a new object while `b` stays `[1, 2, 3]`",
          tag: "MEMORY",
          explanation: ["Assignment (`=`) rebinds a name; it does not overwrite memory pointed to by `b`."],
          code: ["a = [1, 2]", "b = a", "b.append(3)", "a = [9]"],
          activeLines: [4],
          visual: {
            kind: "memory",
            caption: "Rebinding a moves only label a",
            frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "lst1", highlight: true }, { label: "b", targetId: "lst0" }] }],
            objects: [
              { id: "lst0", typeLabel: "list", value: "[1, 2, 3]", mutable: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }, { index: "2", value: "3" }] },
              { id: "lst1", typeLabel: "list", value: "[9]", mutable: true, highlight: true, cells: [{ index: "0", value: "9", active: true }] },
            ],
          },
          state: [
            { name: "a", value: "[9]", changed: true },
            { name: "b", value: "[1, 2, 3]" },
          ],
        },
        {
          title: "Watch `b += [4]` mutate in place vs `b = b + [5]` rebind",
          tag: "TRACE",
          explanation: ["`+=` keeps `id(b)` unchanged on lists, whereas `b + [5]` constructs a brand-new list."],
          code: ["x = [1]; y = x", "x += [2]     # y becomes [1, 2]", "x = x + [3]  # y stays [1, 2]"],
          activeLines: [2, 3],
          state: [
            { name: "x", value: "[1, 2, 3]", changed: true },
            { name: "y", value: "[1, 2]" },
          ],
          visual: {
            kind: "memory",
            caption: "x += [2] mutates the shared list seen by y; x = x + [3] moves x onto a new list.",
            frames: [
              {
                name: "Frame",
                bindings: [
                  { label: "y", targetId: "orig" },
                  { label: "x", targetId: "added", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "orig", typeLabel: "list (from +=)", value: "[1, 2]", mutable: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }] },
              { id: "added", typeLabel: "list (from +)", value: "[1, 2, 3]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2" }, { index: "2", value: "3", active: true }] },
            ],
          },
        },
        {
          title: "Avoid `x is 1000` (interning trap)",
          tag: "PITFALL",
          explanation: ["`x == y` is guaranteed `True`; `x is y` depends on implementation caching."],
          code: ["x = 1000; y = int(\"1000\")", "print(x == y, x is y)  # True False"],
          activeLines: [1, 2],
          state: [{ name: "result", value: "True False", changed: true }],
          visual: {
            kind: "memory",
            caption: "x and y hold equal int values (== True) at two distinct objects (is False).",
            frames: [
              {
                name: "Frame",
                bindings: [
                  { label: "x", targetId: "i1", highlight: true },
                  { label: "y", targetId: "i2", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "i1", typeLabel: "int (id 1)", value: "1000", highlight: true },
              { id: "i2", typeLabel: "int (id 2)", value: "1000", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `is` to compare numbers, booleans, or strings (`x is 1000`)",
        detail: "Always use `==` for value equality; save `is` for `None`.",
      },
      {
        title: "Expecting `lst += [x]` and `lst = lst + [x]` to share aliasing behavior",
        detail: "`+=` mutates the list in place (shared by aliases), whereas `+` creates a new list.",
      },
    ],
    predictChecks: [
      {
        prompt: "What prints here?",
        code: "a = [10, 20]\nb = a\nb.append(30)\nprint(a, b)",
        options: [
          { id: "a", label: "`[10, 20, 30] [10, 20, 30]`" },
          { id: "b", label: "`[10, 20] [10, 20, 30]`" },
          { id: "c", label: "`[10, 20] [30]`" },
        ],
        correctId: "a",
        explanation: "Both labels point to one shared list object.",
      },
      {
        prompt: "If `a = [1, 2]` and `b = a.copy()`, what does `print(a == b, a is b)` output?",
        code: "a = [1, 2]\nb = a.copy()\nprint(a == b, a is b)",
        options: [
          { id: "a", label: "`True True`" },
          { id: "b", label: "`True False`" },
          { id: "c", label: "`False False`" },
        ],
        correctId: "b",
        explanation: "Equal contents (`==` True), distinct heap objects (`is` False).",
      },
    ],
    practiceTask: {
      title: "Warmup: Observe `id()` on Immutable `str` vs Mutable `list`",
      tier: "Warmup",
      goal: "Verify whether `id()` changes after updating a string (`s += \"!\"`) vs mutating a list (`lst.append(99)`), returning `(str_same_id, list_same_id)`.",
      constraints: ["Measure id() before and after each update"],
      examples: [
        { input: "s = \"hi\", lst = [1, 2]", output: "(False, True)" },
        { input: "s = \"\", lst = []", output: "(False, True)" },
      ],
      tasks: [
        "Save `s0 = id(s)` and `l0 = id(lst)`.",
        "Run `s = s + \"!\"` and `lst.append(99)` and compare IDs.",
      ],
      starterCode: "# Exercise M06.5 Warmup: object identity checks\ndef id_behavior(s, lst):\n    # TODO: return (id(s) unchanged?, id(lst) unchanged?)\n    return (False, False)\n",
      expectedOutput: "(False, True)\n(False, True)",
      hint: "Immutable strings allocate new IDs on concatenation while `.append()` edits lists in place.",
      complexity: { time: "O(len(s))", space: "O(len(s))" },
      solutionCode:
        "def id_behavior(s, lst):\n    s0 = id(s)\n    s = s + \"!\"\n    work = lst.copy()\n    l0 = id(work)\n    work.append(99)\n    return (id(s) == s0, id(work) == l0)\n\nprint(id_behavior(\"hi\", [1, 2]))\nprint(id_behavior(\"\", []))",
    },
    practiceChallenges: [
      {
        title: "Core: Break Unintended List Aliasing",
        tier: "Core",
        goal: "Copy `prices` before appending `extra`, returning `(prices, sale_prices, prices is not sale_prices)` so `prices` never mutates.",
        constraints: ["prices must remain identical to input"],
        examples: [
          { input: "prices = [20.0, 35.0], extra = 9.99", output: "([20.0, 35.0], [20.0, 35.0, 9.99], True)" },
          { input: "prices = [], extra = 5.0", output: "([], [5.0], True)" },
        ],
        tasks: [
          "Create `sale_prices = prices.copy()`.",
          "Append `extra` to `sale_prices` and verify `prices is not sale_prices`.",
        ],
        starterCode: "# Exercise M06.5 Core: separate copy vs alias\ndef build_sale_list(prices, extra):\n    # TODO: copy prices, append extra, verify distinct identity\n    return ([], [], False)\n",
        expectedOutput: "([20.0, 35.0], [20.0, 35.0, 9.99], True)\n([], [5.0], True)",
        hint: "Never assign `sale_prices = prices`, because that aliases the original list.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def build_sale_list(prices, extra):\n    sale_prices = prices.copy()\n    sale_prices.append(extra)\n    return (prices, sale_prices, prices is not sale_prices)\n\nprint(build_sale_list([20.0, 35.0], 9.99))\nprint(build_sale_list([], 5.0))",
      },
      {
        title: "Stretch: Predict `+=` vs `+` Aliasing Effect",
        tier: "Stretch",
        goal: "Given initial `base = [1, 2]`, create `alias = base`, perform in-place `+= [tail1]`, then rebind `base = base + [tail2]`, returning `(base, alias)`.",
        constraints: ["Simulate both += in-place and + rebind carefully"],
        examples: [
          { input: "tail1 = 3, tail2 = 4", output: "([1, 2, 3, 4], [1, 2, 3])" },
          { input: "tail1 = 0, tail2 = 9", output: "([1, 2, 0, 9], [1, 2, 0])" },
        ],
        tasks: [
          "Set `base = [1, 2]`, `alias = base`.",
          "Run `base += [tail1]`, then `base = base + [tail2]`, and return `(base, alias)`.",
        ],
        starterCode: "# Exercise M06.5 Stretch: += in-place vs + rebind\ndef trace_iadd_vs_add(tail1, tail2):\n    # TODO: apply += [tail1] then = + [tail2] on base with alias\n    return ([], [])\n",
        expectedOutput: "([1, 2, 3, 4], [1, 2, 3])\n([1, 2, 0, 9], [1, 2, 0])",
        hint: "`alias` sees `tail1` from `+=` yet misses `tail2` because `+` reassigned `base` to a new list.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def trace_iadd_vs_add(tail1, tail2):\n    base = [1, 2]\n    alias = base\n    base += [tail1]\n    base = base + [tail2]\n    return (base, alias)\n\nprint(trace_iadd_vs_add(3, 4))\nprint(trace_iadd_vs_add(0, 9))",
      },
    ],
  },

  "py-aliasing-copy": {
    lessonId: "py-aliasing-copy",
    subtitle: "Protect nested structures across functions using shallow `.copy()`, `copy.deepcopy()`, and loop-built grids.",
    intro: {
      heading: "Caller Aliasing, Shallow Copy, and Deep Copy",
      explanation: [
        "Calling `b = a.copy()` on a nested list like `[[1], [2]]` still lets `b[0].append(9)` corrupt `a[0]`, and creating a 2D board with `[[0] * 2] * 3` causes `grid[0][0] = 9` to overwrite column `0` in all three rows at once. Passing a list into a function also passes a reference, so in-place edits leak straight back to the caller.",
        "Shallow copies (`.copy()`, `[:]`, `list(a)`) duplicate only the outer container and leave inner nested containers shared. Calling `copy.deepcopy(a)` clones every nested level recursively, and allocating 2D grids inside a `for _ in range(rows):` loop builds an independent list object for each row.",
      ],
      analogy:
        "A shallow copy photocopies a folder's cover sheet while linking to the same shared binders inside; a deep copy photocopies the folder and every binder inside it.",
      realWorldUses: [
        "Building 2D game boards or DP tables row by row so updating one row leaves every other row untouched",
        "Cloning nested JSON configs with `copy.deepcopy()` before previewing edits or rolling back changes",
      ],
    },
    sections: [
      {
        heading: "Broken vs Working: Shallow `.copy()`, `copy.deepcopy()`, & `[[]] * n`",
        paragraphs: [
          "`.copy()`, `[:]`, and `list(...)` copy only the outer container; inner lists stay shared between original and copy (`s = g.copy(); s[0].append(5)` changes `g[0]` too). Similarly, `[[0] * 2] * 3` repeats three pointers to one single `[0, 0]` row.",
          "`copy.deepcopy()` recursively clones all nested mutable objects, and `for _ in range(rows): grid.append([0] * cols)` creates independent inner rows so edits stay isolated.",
        ],
        table: {
          caption: "Copy Depth & Grid Allocation",
          headers: ["Technique", "Outer Container", "Inner Nested Containers"],
          rows: [
            ["`b = a`", "Shared", "Shared"],
            ["`b = a.copy()` / `a[:]` / `list(a)`", "New", "Shared (shallow)"],
            ["`copy.deepcopy(a)`", "New", "New recursively"],
          ],
        },
        visual: {
          kind: "memory-sim",
          caption: "Compare shallow .copy() sharing inner rows vs copy.deepcopy() cloning every row",
          scenarios: [
            {
              label: "Shallow b = a.copy()",
              code: ["a = [[1], [2]]", "b = a.copy()", "b[0].append(9)"],
              steps: [
                {
                  line: 1,
                  note: "`a` holds pointers to inner lists `row0` (`[1]`) and `row1` (`[2]`).",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "outer_a", highlight: true }] }],
                  objects: [
                    { id: "outer_a", typeLabel: "list (outer a)", value: "[row0, row1]", mutable: true, cells: [{ index: "0", value: "-> row0" }, { index: "1", value: "-> row1" }] },
                    { id: "row0", typeLabel: "list (row0)", value: "[1]", mutable: true, cells: [{ index: "0", value: "1" }] },
                    { id: "row1", typeLabel: "list (row1)", value: "[2]", mutable: true, cells: [{ index: "0", value: "2" }] },
                  ],
                },
                {
                  line: 2,
                  note: "`a.copy()` allocates `outer_b`, still pointing at shared `row0` and `row1`.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "outer_a" }, { label: "b", targetId: "outer_b", highlight: true }] }],
                  objects: [
                    { id: "outer_a", typeLabel: "list (outer a)", value: "[row0, row1]", mutable: true, cells: [{ index: "0", value: "-> row0" }, { index: "1", value: "-> row1" }] },
                    { id: "outer_b", typeLabel: "list (outer b)", value: "[row0, row1]", mutable: true, highlight: true, cells: [{ index: "0", value: "-> row0", active: true }, { index: "1", value: "-> row1" }] },
                    { id: "row0", typeLabel: "list (row0 shared)", value: "[1]", mutable: true, cells: [{ index: "0", value: "1" }] },
                    { id: "row1", typeLabel: "list (row1 shared)", value: "[2]", mutable: true, cells: [{ index: "0", value: "2" }] },
                  ],
                },
                {
                  line: 3,
                  note: "Mutating `b[0]` updates `row0`, which changes `a[0]` to `[1, 9]` too!",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "outer_a" }, { label: "b", targetId: "outer_b", highlight: true }] }],
                  objects: [
                    { id: "outer_a", typeLabel: "list (outer a)", value: "[row0, row1]", mutable: true, cells: [{ index: "0", value: "-> row0" }, { index: "1", value: "-> row1" }] },
                    { id: "outer_b", typeLabel: "list (outer b)", value: "[row0, row1]", mutable: true, cells: [{ index: "0", value: "-> row0" }, { index: "1", value: "-> row1" }] },
                    { id: "row0", typeLabel: "list (row0 shared)", value: "[1, 9]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "9", active: true }] },
                    { id: "row1", typeLabel: "list (row1 shared)", value: "[2]", mutable: true, cells: [{ index: "0", value: "2" }] },
                  ],
                },
              ],
            },
            {
              label: "Deep copy.deepcopy(a)",
              code: ["import copy", "a = [[1], [2]]", "b = copy.deepcopy(a)", "b[0].append(9)"],
              steps: [
                {
                  line: 2,
                  note: "`a` holds `row_a0` and `row_a1`.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "outer_a", highlight: true }] }],
                  objects: [
                    { id: "outer_a", typeLabel: "list (outer a)", value: "[row_a0, row_a1]", mutable: true, cells: [{ index: "0", value: "-> row_a0" }, { index: "1", value: "-> row_a1" }] },
                    { id: "row_a0", typeLabel: "a[0]", value: "[1]", mutable: true },
                    { id: "row_a1", typeLabel: "a[1]", value: "[2]", mutable: true },
                  ],
                },
                {
                  line: 3,
                  note: "`deepcopy` clones outer list and creates separate `row_b0` and `row_b1`.",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "outer_a" }, { label: "b", targetId: "outer_b", highlight: true }] }],
                  objects: [
                    { id: "outer_a", typeLabel: "list (outer a)", value: "[row_a0, row_a1]", mutable: true },
                    { id: "outer_b", typeLabel: "list (outer b)", value: "[row_b0, row_b1]", mutable: true, highlight: true },
                    { id: "row_a0", typeLabel: "a[0]", value: "[1]", mutable: true },
                    { id: "row_a1", typeLabel: "a[1]", value: "[2]", mutable: true },
                    { id: "row_b0", typeLabel: "b[0] (clone)", value: "[1]", mutable: true, highlight: true },
                    { id: "row_b1", typeLabel: "b[1] (clone)", value: "[2]", mutable: true, highlight: true },
                  ],
                },
                {
                  line: 4,
                  note: "Editing `b[0]` modifies only `row_b0` (`[1, 9]`), leaving `a[0]` untouched (`[1]`).",
                  frames: [{ name: "Frame", bindings: [{ label: "a", targetId: "outer_a" }, { label: "b", targetId: "outer_b", highlight: true }] }],
                  objects: [
                    { id: "outer_a", typeLabel: "list (outer a)", value: "[row_a0, row_a1]", mutable: true },
                    { id: "outer_b", typeLabel: "list (outer b)", value: "[row_b0, row_b1]", mutable: true },
                    { id: "row_a0", typeLabel: "a[0]", value: "[1]", mutable: true },
                    { id: "row_a1", typeLabel: "a[1]", value: "[2]", mutable: true },
                    { id: "row_b0", typeLabel: "b[0] (clone)", value: "[1, 9]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "9", active: true }] },
                    { id: "row_b1", typeLabel: "b[1] (clone)", value: "[2]", mutable: true },
                  ],
                },
              ],
            },
          ],
        },
        code: [
          "import copy",
          "orig = [[1, 2], [3, 4]]",
          "cloned = copy.deepcopy(orig)",
          "cloned[0].append(99)",
          "print(orig, cloned)",
        ],
        output: "[[1, 2], [3, 4]] [[1, 2, 99], [3, 4]]",
      },
    ],
    guidedBuildUp: {
      title: "Isolate 2D Grids and Nested Structures Step by Step",
      subtitle: "Fix row aliasing with a loop, see shallow `.copy()` leak, then isolate nested lists with `copy.deepcopy()`.",
      steps: [
        {
          label: "Build independent 2D rows inside a loop",
          explanation: "Appending `[0] * 2` on each iteration creates 3 distinct row lists so changing row `0` leaves rows `1` and `2` untouched.",
          code: [
            "grid = []",
            "for _ in range(3):",
            "    grid.append([0] * 2)",
            "grid[0][0] = 9",
            "print(grid)",
          ],
          activeLines: [2, 3, 4],
          output: "[[9, 0], [0, 0], [0, 0]]",
        },
        {
          label: "Observe shallow `.copy()` leaking nested edits",
          explanation: "Shallow `.copy()` allocates a new outer list, yet `shallow[0]` still points at the same inner `[1, 2]` list as `orig[0]`.",
          code: [
            "orig = [[1, 2], [3, 4]]",
            "shallow = orig.copy()",
            "shallow[0].append(99)",
            "print(orig, shallow)",
          ],
          activeLines: [2, 3, 4],
          output: "[[1, 2, 99], [3, 4]] [[1, 2, 99], [3, 4]]",
        },
        {
          label: "Clone every nested level with `copy.deepcopy()`",
          explanation: "`copy.deepcopy()` duplicates both the outer list and every nested inner list so `orig` stays unmodified.",
          code: [
            "import copy",
            "orig = [[1, 2], [3, 4]]",
            "deep = copy.deepcopy(orig)",
            "deep[0].append(99)",
            "print(orig, deep)",
          ],
          activeLines: [3, 4, 5],
          output: "[[1, 2], [3, 4]] [[1, 2, 99], [3, 4]]",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Shallow Row Leaks, Deep Copy Isolation & Grid Construction",
      steps: [
        {
          title: "Avoid `grid = [[0] * 2] * 3` (all 3 rows share one object)",
          tag: "PITFALL",
          explanation: ["`* 3` repeats references to a single inner list, so setting `grid[0][0] = 9` updates every row."],
          code: ["bad = [[0] * 2] * 3", "bad[0][0] = 9", "print(bad)  # [[9, 0], [9, 0], [9, 0]]"],
          activeLines: [1, 2, 3],
          state: [{ name: "bad", value: "[[9, 0], [9, 0], [9, 0]]", changed: true }],
          visual: {
            kind: "memory",
            caption: "All 3 slots in bad point to the exact same inner list object.",
            frames: [{ name: "bad (outer list)", bindings: [{ label: "bad[0]", targetId: "row_shared", highlight: true }, { label: "bad[1]", targetId: "row_shared", highlight: true }, { label: "bad[2]", targetId: "row_shared", highlight: true }] }],
            objects: [
              { id: "row_shared", typeLabel: "list (shared 3x)", value: "[9, 0]", mutable: true, highlight: true, cells: [{ index: "0", value: "9", active: true }, { index: "1", value: "0" }] },
            ],
          },
        },
        {
          title: "Allocate distinct inner rows with `for _ in range(rows):`",
          tag: "PATTERN",
          explanation: ["Looping allocates a fresh `[0] * cols` object per row, isolating each row."],
          code: ["good = []","for _ in range(3):","    good.append([0] * 2)","good[0][0] = 9"],
          activeLines: [1, 2, 3, 4],
          state: [{ name: "good", value: "[[9, 0], [0, 0], [0, 0]]", changed: true }],
          visual: {
            kind: "memory",
            caption: "Creating rows inside a loop gives good[0], good[1], and good[2] separate lists.",
            frames: [{ name: "good (outer list)", bindings: [{ label: "good[0]", targetId: "r0", highlight: true }, { label: "good[1]", targetId: "r1" }, { label: "good[2]", targetId: "r2" }] }],
            objects: [
              { id: "r0", typeLabel: "list #1", value: "[9, 0]", mutable: true, highlight: true, cells: [{ index: "0", value: "9", active: true }, { index: "1", value: "0" }] },
              { id: "r1", typeLabel: "list #2", value: "[0, 0]", mutable: true },
              { id: "r2", typeLabel: "list #3", value: "[0, 0]", mutable: true },
            ],
          },
        },
        {
          title: "Protect 1-level lists in helpers with `list(items)`",
          tag: "TRACE",
          explanation: ["Copying before `.append()` keeps caller lists safe when purity is expected."],
          code: ["def with_extra(items, val):", "    out = list(items)", "    out.append(val)", "    return out"],
          activeLines: [2, 3, 4],
          state: [{ name: "caller items", value: "Unmodified", changed: false }],
          visual: {
            kind: "memory",
            caption: "list(items) builds a fresh outer list out so .append(val) leaves items untouched.",
            frames: [
              {
                name: "Frames",
                bindings: [
                  { label: "items", targetId: "l_in" },
                  { label: "out", targetId: "l_out", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "l_in", typeLabel: "list (caller)", value: "['a', 'b']", mutable: true },
              { id: "l_out", typeLabel: "list (copy)", value: "['a', 'b', val]", mutable: true, highlight: true },
            ],
          },
        },
        {
          title: "Use `copy.deepcopy(matrix)` before mutating inner cells",
          tag: "CHECK",
          explanation: ["Cloning nested structures recursively keeps caller's original inner rows intact."],
          code: ["next_grid = copy.deepcopy(grid)", "next_grid[r][c] = val"],
          activeLines: [1, 2],
          state: [{ name: "grid[r][c]", value: "Protected", changed: true }],
          visual: {
            kind: "memory",
            caption: "deepcopy clones both outer list and every inner row so original grid is isolated.",
            frames: [
              {
                name: "Frames",
                bindings: [
                  { label: "grid", targetId: "g_orig" },
                  { label: "next_grid", targetId: "g_deep", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "g_orig", typeLabel: "list (original inner rows)", value: "untouched", mutable: true },
              { id: "g_deep", typeLabel: "list (cloned inner rows)", value: "safe to edit [r][c]", mutable: true, highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "`[[]] * 3` creates 3 aliases pointing at one list",
        detail: "Always construct multi-row grids inside a loop (`for _ in range(3): grid.append([])`).",
      },
      {
        title: "Trusting `.copy()` on 2D lists or nested dicts",
        detail: "Shallow copies share inner mutable containers; call `copy.deepcopy()` whenever mutating nested elements.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(g[0])` print?",
        code: "g = [[1, 2], [3, 4]]\ns = g.copy()\ns[0].append(5)\nprint(g[0])",
        options: [
          { id: "a", label: "`[1, 2, 5]` (shallow copy shares inner lists)" },
          { id: "b", label: "`[1, 2]`" },
          { id: "c", label: "`TypeError`" },
        ],
        correctId: "a",
        explanation: "`.copy()` duplicates the outer list only; `g[0]` and `s[0]` still point to `[1, 2]`.",
      },
      {
        prompt: "Why does `grid = [[0] * 2] * 3; grid[0][0] = 9` alter all three rows?",
        code: "grid = [[0] * 2] * 3\ngrid[0][0] = 9",
        options: [
          { id: "a", label: "All 3 rows reference the exact same inner list" },
          { id: "b", label: "Integers propagate across slices" },
          { id: "c", label: "`[0] * 2` is immutable" },
        ],
        correctId: "a",
        explanation: "`* 3` duplicates references to one inner `[0, 0]` list.",
      },
    ],
    practiceTask: {
      title: "Warmup: Build Independent 2D Zero Grid",
      tier: "Warmup",
      goal: "Create an independent `rows x cols` grid initialized to `0`, then set cell `(0, 0) = top_left` without affecting other rows.",
      constraints: ["Do not alias inner rows with [[0] * cols] * rows"],
      examples: [
        { input: "rows = 3, cols = 2, top_left = 9", output: "[[9, 0], [0, 0], [0, 0]]" },
        { input: "rows = 1, cols = 2, top_left = 5", output: "[[5, 0]]" },
      ],
      tasks: [
        "Append `[0] * cols` inside `for _ in range(rows):`.",
        "Assign `grid[0][0] = top_left` and return `grid`.",
      ],
      starterCode: "# Exercise M06.6 Warmup: non-aliased 2D grid\ndef make_grid(rows, cols, top_left):\n    # TODO: build independent rows and set (0, 0)\n    return []\n",
      expectedOutput: "[[9, 0], [0, 0], [0, 0]]\n[[5, 0]]",
      hint: "Integers like `0` are immutable, so `[0] * cols` is safe for the inner values when built freshly per row.",
      complexity: { time: "O(rows * cols)", space: "O(rows * cols)" },
      solutionCode:
        "def make_grid(rows, cols, top_left):\n    grid = []\n    for _ in range(rows):\n        grid.append([0] * cols)\n    grid[0][0] = top_left\n    return grid\n\nprint(make_grid(3, 2, 9))\nprint(make_grid(1, 2, 5))",
    },
    practiceChallenges: [
      {
        title: "Core: Deep-Copy Matrix Row Appender",
        tier: "Core",
        goal: "Write `with_added_row(matrix, row)` returning a deep-copied matrix with a fresh copy of `row` appended so mutating the return value cannot affect `matrix` or `row`.",
        constraints: ["Preserve matrix and row untouched"],
        examples: [
          { input: "matrix = [[1]], row = [2]", output: "([[1]], [[1], [2]])" },
          { input: "matrix = [], row = [7, 8]", output: "([], [[7, 8]])" },
        ],
        tasks: [
          "Deep-copy `matrix` with `copy.deepcopy(matrix)`.",
          "Append `list(row)` and return `(matrix, out)`.",
        ],
        starterCode: "# Exercise M06.6 Core: deepcopy isolation\nimport copy\n\ndef with_added_row(matrix, row):\n    # TODO: deepcopy matrix, append copy of row\n    return (matrix, [])\n",
        expectedOutput: "([[1]], [[1], [2]])\n([], [[7, 8]])",
        hint: "Return `(matrix, out)` so tests verify `matrix` stayed intact.",
        complexity: { time: "O(elements)", space: "O(elements)" },
        solutionCode:
          "import copy\n\ndef with_added_row(matrix, row):\n    out = copy.deepcopy(matrix)\n    out.append(list(row))\n    return (matrix, out)\n\nprint(with_added_row([[1]], [2]))\nprint(with_added_row([], [7, 8]))",
      },
      {
        title: "Stretch: Pure Nested Move Update",
        tier: "Stretch",
        goal: "Write `apply_move(board, r, c, mark)` cloning `board` via `copy.deepcopy` and updating cell `(r, c)` only if within bounds and currently `\".\"`, returning `(orig_first_cell, updated_board)`.",
        constraints: ["Must not modify original board", "Guard out-of-bounds indices"],
        examples: [
          { input: "board = [[\".\", \".\"], [\".\", \".\"]], r = 0, c = 1, mark = \"X\"", output: "('.', [['.', 'X'], ['.', '.']])" },
          { input: "board = [[\"O\"]], r = 0, c = 0, mark = \"X\"", output: "('O', [['O']])" },
        ],
        tasks: [
          "Deep-copy `board` first.",
          "Check bounds `0 <= r < len(out) and 0 <= c < len(out[r])` and `out[r][c] == \".\"` before assigning `mark`.",
        ],
        starterCode: "# Exercise M06.6 Stretch: guarded pure 2D deepcopy\nimport copy\n\ndef apply_move(board, r, c, mark):\n    # TODO: deepcopy, check bounds and '.', return (board[0][0], updated)\n    return (board[0][0], board)\n",
        expectedOutput: "('.', [['.', 'X'], ['.', '.']])\n('O', [['O']])",
        hint: "Check `board[0][0]` stays unchanged after returning.",
        complexity: { time: "O(r * c)", space: "O(r * c)" },
        solutionCode:
          "import copy\n\ndef apply_move(board, r, c, mark):\n    out = copy.deepcopy(board)\n    if 0 <= r < len(out) and 0 <= c < len(out[r]) and out[r][c] == \".\":\n        out[r][c] = mark\n    return (board[0][0], out)\n\nprint(apply_move([[\".\", \".\"], [\".\", \".\"]], 0, 1, \"X\"))\nprint(apply_move([[\"O\"]], 0, 0, \"X\"))",
      },
    ],
  },

  "py-mutable-defaults": {
    lessonId: "py-mutable-defaults",
    subtitle: "Understand why `def f(box=[]):` leaks state across calls and fix it with immutable `None` defaults.",
    intro: {
      heading: "Fixing Shared Mutable Default Arguments (`box=[]`)",
      explanation: [
        "Writing `def add_item(x, items=[]):` looks harmless, yet calling `add_item(\"a\")` and then `add_item(\"b\")` returns `[\"a\", \"b\"]` on the second call and mutates the first call's returned list to `[\"a\", \"b\"]` too. Every call that omits `items` appends onto the exact same persistent list.",
        "Python evaluates default arguments once when `def` executes, not on each function call. Defaulting to `None` (`items=None`) and checking `if items is None: items = []` inside the function body gives every call its own isolated list while still honoring an explicit `[]` passed by a caller.",
      ],
      analogy:
        "A mutable default `items=[]` is like bolting one shared shopping basket to the store wall for every customer to use; `items=None` hands each arriving customer a fresh empty basket.",
      realWorldUses: [
        "Writing helper functions with optional accumulator lists, log buckets, or cache dicts (`cache=None`)",
        "Accepting an optional caller-owned output list (`if out is None: out = []`) without breaking when the caller passes `[]`",
      ],
    },
    sections: [
      {
        heading: "Broken vs Working: Why `box=[]` Leaks State & How `box=None` Fixes It",
        paragraphs: [
          "When `def add_item(x, box=[]):` runs, Python builds one list object and stores it on the function's default slot. Call 1 appends `'a'`; Call 2 appends `'b'` onto that same stored list.",
          "With `box=None`, `None` is immutable; each call seeing `box is None` creates a fresh `[]` inside its own local frame. Always check `if box is None:` rather than `if not box:`, because `if not box:` treats an explicit empty list `caller = []` as missing and stops appending into `caller`.",
        ],
        table: {
          caption: "Default Parameter Patterns",
          headers: ["Pattern", "Evaluated When", "Call Isolation"],
          rows: [
            ["`def f(x, box=[]):`", "Once at `def` time", "Broken: shares single list forever"],
            ["`def f(x, cfg={}):`", "Once at `def` time", "Broken: mutates shared dict across calls"],
            ["`def f(x, box=None):`", "Fresh list created inside call if `box is None`", "Isolated per call; keeps explicit `[]`"],
          ],
          highlightCol: 2,
        },
        visual: {
          kind: "memory-sim",
          caption: "Compare broken def add_item(x, box=[]) against the isolated box=None idiom",
          scenarios: [
            {
              label: "Buggy Default (box=[])",
              code: [
                "def add_item(x, box=[]):",
                "    box.append(x)",
                "    return box",
                "r1 = add_item('a')",
                "r2 = add_item('b')",
              ],
              steps: [
                {
                  line: 1,
                  note: "At `def` time, Python creates one default list `def_box = []`.",
                  frames: [{ name: "add_item defaults", bindings: [{ label: "default box", targetId: "def_box", highlight: true }] }],
                  objects: [{ id: "def_box", typeLabel: "list (shared default)", value: "[]", mutable: true, highlight: true }],
                },
                {
                  line: 4,
                  note: "Call 1 appends `'a'` onto `def_box` and returns it into `r1`.",
                  frames: [
                    { name: "Global Frame", bindings: [{ label: "r1", targetId: "def_box", highlight: true }] },
                    { name: "add_item defaults", bindings: [{ label: "default box", targetId: "def_box" }] },
                  ],
                  objects: [{ id: "def_box", typeLabel: "list (shared default)", value: "['a']", mutable: true, highlight: true, cells: [{ index: "0", value: "'a'", active: true }] }],
                },
                {
                  line: 5,
                  note: "Call 2 reuses the same `def_box`: both `r1` and `r2` now see `['a', 'b']`!",
                  frames: [
                    { name: "Global Frame", bindings: [{ label: "r1", targetId: "def_box" }, { label: "r2", targetId: "def_box", highlight: true }] },
                    { name: "add_item defaults", bindings: [{ label: "default box", targetId: "def_box" }] },
                  ],
                  objects: [{ id: "def_box", typeLabel: "list (shared default)", value: "['a', 'b']", mutable: true, highlight: true, cells: [{ index: "0", value: "'a'" }, { index: "1", value: "'b'", active: true }] }],
                },
              ],
            },
            {
              label: "Isolated Default (box=None)",
              code: [
                "def add_isolated(x, box=None):",
                "    if box is None:",
                "        box = []",
                "    box.append(x)",
                "    return box",
                "r1 = add_isolated('a')",
                "r2 = add_isolated('b')",
              ],
              steps: [
                {
                  line: 1,
                  note: "`def` stores immutable `None` in the default slot.",
                  frames: [{ name: "add_isolated defaults", bindings: [{ label: "default box", targetId: "none_obj" }] }],
                  objects: [{ id: "none_obj", typeLabel: "NoneType", value: "None" }],
                },
                {
                  line: 6,
                  note: "Call 1 allocates fresh list `['a']` for `r1`.",
                  frames: [{ name: "Global Frame", bindings: [{ label: "r1", targetId: "l_a", highlight: true }] }],
                  objects: [{ id: "l_a", typeLabel: "list", value: "['a']", mutable: true, highlight: true, cells: [{ index: "0", value: "'a'", active: true }] }],
                },
                {
                  line: 7,
                  note: "Call 2 allocates fresh list `['b']` for `r2`; `r1` remains `['a']`.",
                  frames: [{ name: "Global Frame", bindings: [{ label: "r1", targetId: "l_a" }, { label: "r2", targetId: "l_b", highlight: true }] }],
                  objects: [
                    { id: "l_a", typeLabel: "list", value: "['a']", mutable: true },
                    { id: "l_b", typeLabel: "list", value: "['b']", mutable: true, highlight: true, cells: [{ index: "0", value: "'b'", active: true }] },
                  ],
                },
              ],
            },
          ],
        },
        code: [
          "def add_isolated(item, box=None):",
          "    if box is None:",
          "        box = []",
          "    box.append(item)",
          "    return box",
          "print(add_isolated(\"a\"), add_isolated(\"b\"))",
        ],
        output: "['a'] ['b']",
        callout: {
          kind: "RULE OF THUMB",
          text: "Never place `=[]`, `={}`, or `=set()` in a `def` signature; always default to `=None` and check `is None`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Fix a Leaking Mutable Default Step by Step",
      subtitle: "Reproduce the shared-list leak, switch the signature to `=None`, and verify explicit empty lists.",
      steps: [
        {
          label: "Reproduce the leak: `items=[]` persists across calls",
          explanation: "Because `[]` is created once at `def` time, calling `add_buggy(\"a\")` and `add_buggy(\"b\")` mutates and returns the same list.",
          code: [
            "def add_buggy(x, items=[]):",
            "    items.append(x)",
            "    return items",
            "print(add_buggy(\"a\"), add_buggy(\"b\"))",
          ],
          activeLines: [1, 2, 4],
          output: "['a', 'b'] ['a', 'b']",
        },
        {
          label: "Default to `items=None` and allocate `[]` inside the call",
          explanation: "Each call that omits `items` now runs `items = []` and receives its own independent list.",
          code: [
            "def add_fixed(x, items=None):",
            "    if items is None:",
            "        items = []",
            "    items.append(x)",
            "    return items",
            "print(add_fixed(\"a\"), add_fixed(\"b\"))",
          ],
          activeLines: [1, 2, 3, 6],
          output: "['a'] ['b']",
        },
        {
          label: "Check `is None` (not `if not items:`) for caller-owned `[]`",
          explanation: "Checking `is None` leaves an explicit empty list `caller_box = []` intact so `\"go\"` appends directly into `caller_box`.",
          code: [
            "def add_fixed(x, items=None):",
            "    if items is None:",
            "        items = []",
            "    items.append(x)",
            "    return items",
            "caller_box = []",
            "add_fixed(\"go\", caller_box)",
            "print(caller_box)",
          ],
          activeLines: [2, 6, 7, 8],
          output: "['go']",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `def`-Time Default Allocation vs Per-Call Allocation",
      steps: [
        {
          title: "`def f(val, items=[]):` evaluates `[]` once when `def` executes",
          tag: "CONCEPT",
          explanation: ["Before any call happens, `f` already saves one persistent list inside `f.__defaults__` (Python's internal tuple of default argument values created when `def` runs)."],
          code: ["def f(val, items=[]):","    items.append(val)","    return items"],
          activeLines: [1],
          state: [{ name: "f.__defaults__", value: "([],)", changed: true }],
          visual: {
            kind: "memory",
            caption: "Running def f creates one default list object stored on the function itself.",
            frames: [{ name: "Function f", bindings: [{ label: "__defaults__[0]", targetId: "def_list", highlight: true }] }],
            objects: [{ id: "def_list", typeLabel: "list (shared default)", value: "[]", mutable: true, highlight: true }],
          },
        },
        {
          title: "Call 1 (`f(1)`) mutates that stored list to `[1]`",
          tag: "TRACE",
          explanation: ["`f(1)` skips creating a list and appends directly onto the default list."],
          code: ["a = f(1)  # default list becomes [1]"],
          activeLines: [1],
          state: [{ name: "a", value: "[1]", changed: true }],
          visual: {
            kind: "memory",
            caption: "Call 1 mutates the function's stored default list and returns it to a.",
            frames: [
              { name: "Function f", bindings: [{ label: "__defaults__[0]", targetId: "def_list" }] },
              { name: "Globals", bindings: [{ label: "a", targetId: "def_list", highlight: true }] },
            ],
            objects: [{ id: "def_list", typeLabel: "list (shared default)", value: "[1]", mutable: true, highlight: true, cells: [{ index: "0", value: "1", active: true }] }],
          },
        },
        {
          title: "Call 2 (`f(2)`) reuses `[1]` and mutates `a` too (`[1, 2]`)",
          tag: "PITFALL",
          explanation: ["Because `a` and `b` point to that exact same default list, both show `[1, 2]`."],
          code: ["b = f(2)  # both a and b are [1, 2]"],
          activeLines: [1],
          state: [
            { name: "a", value: "[1, 2]", changed: true },
            { name: "b", value: "[1, 2]", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Call 2 appends onto the exact same list object, so a and b both show [1, 2].",
            frames: [
              { name: "Function f", bindings: [{ label: "__defaults__[0]", targetId: "def_list" }] },
              { name: "Globals", bindings: [{ label: "a", targetId: "def_list", highlight: true }, { label: "b", targetId: "def_list", highlight: true }] },
            ],
            objects: [{ id: "def_list", typeLabel: "list (shared default)", value: "[1, 2]", mutable: true, highlight: true, cells: [{ index: "0", value: "1" }, { index: "1", value: "2", active: true }] }],
          },
        },
        {
          title: "Fix with `items=None` -> `if items is None: items = []`",
          tag: "PATTERN",
          explanation: ["Now `a` receives `[1]` and `b` receives `[2]`, while callers can still pass an explicit `items` list if wanted."],
          code: ["def safe(val, items=None):","    if items is None:","        items = []","    items.append(val)","    return items"],
          activeLines: [1, 2, 3, 4, 5],
          state: [
            { name: "safe(1)", value: "[1]", changed: true },
            { name: "safe(2)", value: "[2]", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "items=None runs items = [] fresh per call, returning two separate lists.",
            frames: [
              { name: "Globals", bindings: [{ label: "a", targetId: "la", highlight: true }, { label: "b", targetId: "lb", highlight: true }] },
            ],
            objects: [
              { id: "la", typeLabel: "list #1", value: "[1]", mutable: true, highlight: true, cells: [{ index: "0", value: "1", active: true }] },
              { id: "lb", typeLabel: "list #2", value: "[2]", mutable: true, highlight: true, cells: [{ index: "0", value: "2", active: true }] },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Putting `={}` or `=set()` as a default has the exact same leak as `=[]`",
        detail: "Use `=None` for any mutable collection default (`list`, `dict`, `set`).",
      },
      {
        title: "Using `box = box or []` swallows an explicit empty list passed by caller",
        detail: "Always check `if box is None:` so a caller explicitly passing `existing = []` still gets `existing` populated.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(b)` print?",
        code: "def f(val, items=[]):\n    items.append(val)\n    return items\n\na = f(1)\nb = f(2)\nprint(b)",
        options: [
          { id: "a", label: "`[2]`" },
          { id: "b", label: "`[1]`" },
          { id: "c", label: "`[1, 2]`" },
        ],
        correctId: "c",
        explanation: "The default list `items` evaluates once at `def` time and persists across calls.",
      },
      {
        prompt: "Why write `if box is None:` instead of `if not box:` inside `def push(x, box=None):`?",
        code: "def push(x, box=None):\n    if box is None:\n        box = []\n    box.append(x)\n    return box",
        options: [
          { id: "a", label: "If the caller explicitly passes an empty list `caller = []`, `if not box:` would ignore it instead of mutating `caller`" },
          { id: "b", label: "`if not box:` raises `TypeError` on `None`" },
          { id: "c", label: "`is None` is slower" },
        ],
        correctId: "a",
        explanation: "`[]` is falsy, so `if box is None:` distinguishes omitted argument from an explicit empty list.",
      },
    ],
    practiceTask: {
      title: "Warmup: Fix Mutable Default Tag Collector",
      tier: "Warmup",
      goal: "Fix `add_tag(tag, tags=None)` so two separate default calls stay isolated while passing an explicit list mutates that explicit list.",
      constraints: ["Check if tags is None inside body"],
      examples: [
        { input: "call 1: add_tag(\"py\"), call 2: add_tag(\"sql\")", output: "(['py'], ['sql'])" },
        { input: "existing = []; add_tag(\"go\", existing)", output: "['go']" },
      ],
      tasks: [
        "Default `tags=None`.",
        "Allocate `tags = []` only when `tags is None`.",
      ],
      starterCode: "# Exercise M06.7 Warmup: isolated None default\ndef add_tag(tag, tags=None):\n    # TODO: replace mutable default with None\n    return []\n",
      expectedOutput: "(['py'], ['sql'])\n['go']",
      hint: "Checking `if tags is None:` ensures passing `existing = []` appends straight into `existing`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags\n\nprint((add_tag(\"py\"), add_tag(\"sql\")))\nexisting = []\nprint(add_tag(\"go\", existing))",
    },
    practiceChallenges: [
      {
        title: "Core: Safe Per-Call Counter Dict (`record_hit`)",
        tier: "Core",
        goal: "Write `record_hit(event, counts=None)` using safe `None` initialization (`if counts is None: counts = {}`) so separate calls don't leak dictionary state.",
        constraints: ["Default dict calls remain isolated", "Explicit dict updates in place"],
        examples: [
          { input: "c1 = record_hit(\"open\"); c2 = record_hit(\"save\")", output: "({'open': 1}, {'save': 1})" },
          { input: "shared = {}; record_hit(\"a\", shared); record_hit(\"a\", shared)", output: "{'a': 2}" },
        ],
        tasks: [
          "Default `counts=None` and initialize `{}` inside if `None`.",
          "Increment `counts[event] = counts.get(event, 0) + 1` and return `counts`.",
        ],
        starterCode: "# Exercise M06.7 Core: safe dict None default\ndef record_hit(event, counts=None):\n    # TODO: increment hit on per-call or caller-supplied dict\n    return {}\n",
        expectedOutput: "({'open': 1}, {'save': 1})\n{'a': 2}",
        hint: "Use `counts[event] = counts.get(event, 0) + 1`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def record_hit(event, counts=None):\n    if counts is None:\n        counts = {}\n    counts[event] = counts.get(event, 0) + 1\n    return counts\n\nprint((record_hit(\"open\"), record_hit(\"save\")))\nshared = {}\nrecord_hit(\"a\", shared)\nprint(record_hit(\"a\", shared))",
      },
      {
        title: "Stretch: Copy-on-Default Batch Accumulator (`append_batch`)",
        tier: "Stretch",
        goal: "Write `append_batch(items, dest=None)` returning a fresh list (`list(items)`) when `dest is None`, or extending `dest` in place when caller supplies `dest` (even when `dest = []`), without ever aliasing `items`.",
        constraints: ["Do not return direct alias to items", "Mutate explicit dest=[] in place"],
        examples: [
          { input: "a = append_batch([1, 2]); b = append_batch([3])", output: "([1, 2], [3])" },
          { input: "out = []; append_batch([5, 6], out)", output: "[5, 6]" },
        ],
        tasks: [
          "Check `if dest is None: dest = []`.",
          "Extend `dest.extend(items)` and return `dest`.",
        ],
        starterCode: "# Exercise M06.7 Stretch: copy-safe batch accumulator\ndef append_batch(items, dest=None):\n    # TODO: distinguish dest is None from explicit dest=[]\n    return []\n",
        expectedOutput: "([1, 2], [3])\n[5, 6]",
        hint: "Using `if not dest:` here would wrongly create a new list when caller passed `out = []`!",
        complexity: { time: "O(len(items))", space: "O(len(items))" },
        solutionCode:
          "def append_batch(items, dest=None):\n    if dest is None:\n        dest = []\n    dest.extend(items)\n    return dest\n\nprint((append_batch([1, 2]), append_batch([3])))\nout = []\nprint(append_batch([5, 6], out))",
      },
    ],
  },
};

export const m06Quiz: ModuleQuiz = {
  moduleId: "py-m6",
  title: "Module 06 Quiz · Collections, References & Mutability",
  description: "12 questions on tuples, unpacking, dictionaries, sets, collection choice, object references, shallow/deep copy, and mutable defaults.",
  questions: [
    {
      id: "m6-q1",
      prompt: "Which creates a valid 1-element tuple?",
      options: [
        { id: "a", label: "`(10)`" },
        { id: "b", label: "`(10,)`" },
        { id: "c", label: "`[10]`" },
      ],
      correctId: "b",
      explanation: "A single-element tuple requires a trailing comma.",
      lessonRefId: "py-tuples-unpacking",
    },
    {
      id: "m6-q2",
      prompt: "What does `a, *b = [1, 2, 3, 4]` assign to `b`?",
      options: [
        { id: "a", label: "`2`" },
        { id: "b", label: "`(2, 3, 4)`" },
        { id: "c", label: "`[2, 3, 4]`" },
      ],
      correctId: "c",
      explanation: "Starred unpacking gathers remaining items into a list.",
      lessonRefId: "py-tuples-unpacking",
    },
    {
      id: "m6-q3",
      prompt: "Why does `d.get(\"score\", 0)` beat `d[\"score\"]` when a key might be missing?",
      options: [
        { id: "a", label: "`.get()` returns `0` instead of crashing with `KeyError`" },
        { id: "b", label: "`.get()` deletes the key afterward" },
        { id: "c", label: "`.get()` sorts the dictionary" },
      ],
      correctId: "a",
      explanation: "`.get(key, default)` returns your fallback without raising `KeyError` if the key is absent.",
      lessonRefId: "py-dicts-basics",
    },
    {
      id: "m6-q4",
      prompt: "Why does `{[1, 2]: \"ok\"}` fail with `TypeError`?",
      options: [
        { id: "a", label: "Keys cannot have length 2" },
        { id: "b", label: "Values cannot be strings" },
        { id: "c", label: "Lists are mutable and therefore unhashable as dictionary keys" },
      ],
      correctId: "c",
      explanation: "Dictionary keys must be hashable (immutable).",
      lessonRefId: "py-dicts-basics",
    },
    {
      id: "m6-q5",
      prompt: "Why does calling `.add(\"py\")` on `seen = {}` raise `AttributeError`?",
      code: "seen = {}\nseen.add(\"py\")",
      options: [
        { id: "a", label: "Use `.append()` on dicts" },
        { id: "b", label: "`{}` creates an empty `dict` (use `set()` for an empty set)" },
        { id: "c", label: "Sets cannot store strings" },
      ],
      correctId: "b",
      explanation: "`{}` builds an empty `dict`; initialize empty sets with `set()`.",
      lessonRefId: "py-sets-unique",
    },
    {
      id: "m6-q6",
      prompt: "When checking 10,000 IDs against 50,000 banned IDs, which structure gives `O(1)` membership tests?",
      options: [
        { id: "a", label: "`set`" },
        { id: "b", label: "`list`" },
        { id: "c", label: "`tuple`" },
      ],
      correctId: "a",
      explanation: "Hashing lets sets check `uid in banned` in `O(1)` average time.",
      lessonRefId: "py-collection-tradeoffs",
    },
    {
      id: "m6-q7",
      prompt: "What does `x is y` check in Python?",
      options: [
        { id: "a", label: "Whether `x` comes after `y`" },
        { id: "b", label: "Whether `x` and `y` hold equal numeric values" },
        { id: "c", label: "Whether `x` and `y` point to the exact same object in memory" },
      ],
      correctId: "c",
      explanation: "`==` checks value equality; `is` checks object identity (`id(x) == id(y)`).",
      lessonRefId: "py-refs-mutability",
    },
    {
      id: "m6-q8",
      prompt: "What prints after running these 3 lines?",
      code: "a = \"hi\"\nb = a\na += \"!\"\nprint(a, b)",
      options: [
        { id: "a", label: "`hi! hi`" },
        { id: "b", label: "`hi! hi!`" },
        { id: "c", label: "`TypeError`" },
      ],
      correctId: "a",
      explanation: "`str` is immutable, so `a += \"!\"` builds a new string while `b` remains bound to `\"hi\"`.",
      lessonRefId: "py-refs-mutability",
    },
    {
      id: "m6-q9",
      prompt: "If `x = [1, 2]`, `y = x`, and `x = [9, 9]`, what is `y`?",
      options: [
        { id: "a", label: "`[9, 9]`" },
        { id: "b", label: "`[1, 2]`" },
        { id: "c", label: "`[]`" },
      ],
      correctId: "b",
      explanation: "Reassigning `x` moves only label `x`; `y` still points to `[1, 2]`.",
      lessonRefId: "py-refs-mutability",
    },
    {
      id: "m6-q10",
      prompt: "What prints here?",
      code: "g = [[1, 2], [3, 4]]\ns = g.copy()\ns[0].append(5)\nprint(g[0])",
      options: [
        { id: "a", label: "`[1, 2, 5]` (`.copy()` is shallow)" },
        { id: "b", label: "`[1, 2]`" },
        { id: "c", label: "`TypeError`" },
      ],
      correctId: "a",
      explanation: "Shallow `.copy()` shares inner sub-lists unless `copy.deepcopy()` is used.",
      lessonRefId: "py-aliasing-copy",
    },
    {
      id: "m6-q11",
      prompt: "Why does `grid = [[0] * 2] * 3` update all 3 rows on `grid[0][0] = 9`?",
      options: [
        { id: "a", label: "Python does not support 2D lists" },
        { id: "b", label: "All 3 rows reference the exact same inner list object" },
        { id: "c", label: "Lists cannot hold `9`" },
      ],
      correctId: "b",
      explanation: "`* 3` repeats references rather than allocating fresh inner lists.",
      lessonRefId: "py-aliasing-copy",
    },
    {
      id: "m6-q12",
      prompt: "Why default optional containers to `items=None` instead of `items=[]`?",
      options: [
        { id: "a", label: "`items=[]` raises a SyntaxError" },
        { id: "b", label: "`None` saves disk space" },
        { id: "c", label: "`items=[]` is created once at `def` time and shared across separate calls" },
      ],
      correctId: "c",
      explanation: "Default values evaluate once when `def` runs; `None` isolates separate calls.",
      lessonRefId: "py-mutable-defaults",
    },
  ],
};

export const m06PracticeSet: ModulePracticeSet = {
  moduleId: "py-m6",
  title: "Module 06 Practice Set: Dicts, Sets, Trade-offs & Memory",
  description:
    "Four exercises combining dict+set indexing, sparse tuple keys, deep copy isolation, and safe None-default state.",
  problems: [
    {
      id: "py-m6-p1",
      title: "Build Tag-to-Docs Inverted Index",
      patternHint: "Use a dict mapping tag -> set of doc IDs (with tuple/hashable keys), then return sorted matching IDs.",
      lessonRefId: "py-collection-tradeoffs",
      goal: "Given `(doc_id, tags_list)` pairs and two required tags `(t1, t2)`, return sorted `doc_id`s carrying both `t1` and `t2` using `set` intersection (`&`).",
      constraints: ["Convert to sorted list; empty list if either tag is missing"],
      examples: [
        { input: "docs = [(\"d1\", [\"py\", \"ml\"]), (\"d2\", [\"py\"]), (\"d3\", [\"ml\", \"py\"])], t1 = \"py\", t2 = \"ml\"", output: "['d1', 'd3']" },
        { input: "docs = [(\"d1\", [\"py\"])], t1 = \"py\", t2 = \"sql\"", output: "[]" },
      ],
      tasks: [
        "Populate `idx.setdefault(tag, set()).add(doc_id)`.",
        "Return `sorted(idx.get(t1, set()) & idx.get(t2, set()))`.",
      ],
      starterCode: "# Practice M06.1: inverted index with set intersection\ndef search_both(docs, t1, t2):\n    # TODO: map tag -> set(doc_ids) and intersect\n    return []\n",
      expectedOutput: "['d1', 'd3']\n[]",
      hint: "`.get(t, set())` returns `set()` without raising `KeyError` on missing tags.",
      complexity: { time: "O(n + k log k)", space: "O(n)" },
      solutionCode:
        "def search_both(docs, t1, t2):\n    idx = {}\n    for doc_id, tags in docs:\n        for tag in tags:\n            idx.setdefault(tag, set()).add(doc_id)\n    return sorted(idx.get(t1, set()) & idx.get(t2, set()))\n\nprint(search_both([(\"d1\", [\"py\", \"ml\"]), (\"d2\", [\"py\"]), (\"d3\", [\"ml\", \"py\"])], \"py\", \"ml\"))\nprint(search_both([(\"d1\", [\"py\"])], \"py\", \"sql\"))",
    },
    {
      id: "py-m6-p2",
      title: "First-Seen Order-Preserving Diff",
      patternHint: "Convert exclusion list to O(1) set while scanning primary list with dict.fromkeys/seen set.",
      lessonRefId: "py-sets-unique",
      goal: "Return unique items from `primary` that do not appear in `exclude`, preserving first-seen order from `primary`.",
      constraints: ["Must preserve primary order", "O(n + m) time"],
      examples: [
        { input: "primary = [\"b\", \"a\", \"b\", \"c\", \"a\"], exclude = [\"a\"]", output: "['b', 'c']" },
        { input: "primary = [\"x\", \"x\"], exclude = [\"x\"]", output: "[]" },
      ],
      tasks: [
        "Seed `seen = set(exclude)` so excluded items count as already seen.",
        "Scan `primary`: if `item not in seen`, `seen.add(item)` and append `item` to `out`.",
      ],
      starterCode: "# Practice M06.2: ordered diff via seen set\ndef unique_minus(primary, exclude):\n    # TODO: preserve primary order minus exclude items\n    return []\n",
      expectedOutput: "['b', 'c']\n[]",
      hint: "Putting `exclude` directly into initial `seen` handles both deduplication and filtering in one loop.",
      complexity: { time: "O(n + m)", space: "O(n + m)" },
      solutionCode:
        "def unique_minus(primary, exclude):\n    seen = set(exclude)\n    out = []\n    for x in primary:\n        if x not in seen:\n            seen.add(x)\n            out.append(x)\n    return out\n\nprint(unique_minus([\"b\", \"a\", \"b\", \"c\", \"a\"], [\"a\"]))\nprint(unique_minus([\"x\", \"x\"], [\"x\"]))",
    },
    {
      id: "py-m6-p3",
      title: "Deep-Copied Nested Snapshot Editor",
      patternHint: "Use copy.deepcopy on nested dicts/lists so snapshot rollback leaves original data intact.",
      lessonRefId: "py-aliasing-copy",
      goal: "Given `cfg = {\"users\": [\"ada\"]}` and `new_user`, return `(cfg[\"users\"], clone[\"users\"])` after appending `new_user` onto `clone[\"users\"]` without altering `cfg`.",
      constraints: ["Original cfg must stay unmodified"],
      examples: [
        { input: "cfg = {\"users\": [\"ada\"]}, new_user = \"sam\"", output: "(['ada'], ['ada', 'sam'])" },
        { input: "cfg = {\"users\": []}, new_user = \"bo\"", output: "([], ['bo'])" },
      ],
      tasks: [
        "Deep-copy `cfg` into `clone`.",
        "Append `new_user` to `clone[\"users\"]` and return both lists.",
      ],
      starterCode: "# Practice M06.3: deepcopy nested dict edit\nimport copy\n\ndef add_user_snapshot(cfg, new_user):\n    # TODO: deepcopy cfg then append to clone['users']\n    return (cfg[\"users\"], [])\n",
      expectedOutput: "(['ada'], ['ada', 'sam'])\n([], ['bo'])",
      hint: "Shallow `cfg.copy()` would share `cfg[\"users\"]` and mutate both.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "import copy\n\ndef add_user_snapshot(cfg, new_user):\n    clone = copy.deepcopy(cfg)\n    clone[\"users\"].append(new_user)\n    return (cfg[\"users\"], clone[\"users\"])\n\nprint(add_user_snapshot({\"users\": [\"ada\"]}, \"sam\"))\nprint(add_user_snapshot({\"users\": []}, \"bo\"))",
    },
    {
      id: "py-m6-p4",
      title: "Isolated Log Bucket Builder (No Mutable Default)",
      patternHint: "Use bucket=None in signature and test bucket is None explicitly.",
      lessonRefId: "py-mutable-defaults",
      goal: "Write `push_log(msg, bucket=None)` stripping outer spaces on `msg`, appending only if non-empty, and keeping omitted-default calls independent.",
      constraints: ["Skip empty/whitespace msgs", "Do not share list across omitted calls"],
      examples: [
        { input: "a = push_log(\" start \"); b = push_log(\"  \"); b = push_log(\"ok\", b)", output: "(['start'], ['ok'])" },
        { input: "out = []; push_log(\"hi\", out)", output: "['hi']" },
      ],
      tasks: [
        "Check `if bucket is None: bucket = []`.",
        "Strip `clean = msg.strip()`; if `clean`: `bucket.append(clean)`.",
      ],
      starterCode: "# Practice M06.4: safe None default log bucket\ndef push_log(msg, bucket=None):\n    # TODO: init bucket if None, append stripped msg if non-empty\n    return []\n",
      expectedOutput: "(['start'], ['ok'])\n['hi']",
      hint: "Return `bucket` even when `msg.strip()` is empty so caller keeps its reference.",
      complexity: { time: "O(len(msg))", space: "O(1)" },
      solutionCode:
        "def push_log(msg, bucket=None):\n    if bucket is None:\n        bucket = []\n    clean = msg.strip()\n    if clean:\n        bucket.append(clean)\n    return bucket\n\na = push_log(\" start \")\nb = push_log(\"  \")\nb = push_log(\"ok\", b)\nprint((a, b))\nout = []\nprint(push_log(\"hi\", out))",
    },
  ],
};
