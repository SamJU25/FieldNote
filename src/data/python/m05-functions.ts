import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m05Lessons: Record<string, LessonContent> = {
  "py-functions-intro": {
    lessonId: "py-functions-intro",
    subtitle: "Package reusable steps with `def`, parameters, arguments, and docstrings.",
    intro: {
      heading: "Packaging Reusable Steps Into Functions",
      explanation: [
        "Copying the same formatting lines for every receipt item breaks as soon as a currency symbol or label changes across five places.",
        "Writing `def greet(name):` saves a named block of steps without running it immediately. Calling `greet(\"Ada\")` with parentheses runs those steps once per call, avoiding duplicate code.",
      ],
      analogy: "A coffee machine preset stores the grind and pour steps under one button; pressing that button runs the whole sequence with whichever cup size you pass in.",
      realWorldUses: [
        "Wrapping repeated calculations like tax or unit conversions in one named `def`",
        "Giving every file a tested helper (`format_badge(name)`) so display rules stay consistent",
      ],
    },
    sections: [
      {
        heading: "Defining & Calling Functions (`def`)",
        paragraphs: [
          "Define a function above the lines that call it (`NameError` happens if you call it earlier). Calling `greet_user(\"Ada\")` runs the indented lines inside `def` top to bottom, then picks back up on the next line of the caller.",
          "Writing `greet_user` without parentheses only inspects the function object instead of running it, and leaving out a required argument raises `TypeError`.",
        ],
        visual: {
          kind: "loop-stepper",
          caption: "Step through def registration, jumping into greet_user, and returning to the module",
          code: [
            "def greet_user(name):",
            "    msg = f\"Hi, {name}!\"",
            "    print(msg)",
            "print(\"Start\")",
            "greet_user(\"Ada\")",
            "print(\"Done\")",
          ],
          iterations: [
            {
              label: "Define function",
              activeLine: 1,
              vars: [],
              output: "",
              status: "Python stores greet_user without running lines 2-3",
              callStack: [{ fn: "<module>", line: 1, status: "active" }],
            },
            {
              label: "Caller line 4",
              activeLine: 4,
              vars: [],
              output: "Start",
              status: "Top-level print runs first",
              callStack: [{ fn: "<module>", line: 4, status: "active" }],
            },
            {
              label: "Call greet_user",
              activeLine: 5,
              vars: [{ name: "name", value: "'Ada'", changed: true }],
              output: "Start",
              status: "<module> pauses at line 5 and enters greet_user",
              callStack: [
                { fn: "<module>", line: 5, status: "suspended" },
                { fn: "greet_user('Ada')", line: 1, status: "active" },
              ],
            },
            {
              label: "Run body",
              activeLine: 3,
              vars: [
                { name: "name", value: "'Ada'" },
                { name: "msg", value: "'Hi, Ada!'", changed: true },
              ],
              output: "Start\nHi, Ada!",
              status: "Body builds msg and prints it",
              callStack: [
                { fn: "<module>", line: 5, status: "suspended" },
                { fn: "greet_user('Ada')", line: 3, status: "unwinding" },
              ],
            },
            {
              label: "Resume caller",
              activeLine: 6,
              vars: [],
              output: "Start\nHi, Ada!\nDone",
              status: "greet_user finishes; execution continues at line 6",
              callStack: [{ fn: "<module>", line: 6, status: "active" }],
            },
          ],
        },
        code: [
          "def greet_user(name):",
          "    \"\"\"Print a personal greeting.\"\"\"",
          "    msg = f\"Hi, {name}!\"",
          "    print(msg)",
          "",
          "greet_user(\"Ada\")      # valid -> prints: Hi, Ada!",
          "# greet_user           # TRAP: prints function reference, does NOT run",
          "# greet_user()         # INVALID -> TypeError: missing argument 'name'",
        ],
        output: "Hi, Ada!",
      },
      {
        heading: "Parameters, Arguments, Verb Naming & Docstrings",
        paragraphs: [
          "Names listed inside `def show_price(item, cost):` are **parameters** (local placeholder variables); actual values passed at the call site (`\"Book\"`, `12`) are **arguments**.",
          "Name functions using `snake_case` verbs (`show_price`, `send_alert`) and place a triple-quoted docstring on line 1 inside `def`.",
        ],
        table: {
          caption: "Function Vocabulary",
          headers: ["Term", "Meaning", "Example"],
          rows: [
            ["`def` header", "Registers callable function without running body", "`def show_price(item, cost):`"],
            ["Docstring", "Triple-quoted summary string on first body line", "`\"\"\"Display price label.\"\"\"`"],
            ["Parameter", "Placeholder variable in `def (...)`", "`item`, `cost`"],
            ["Argument", "Value supplied in the call expression", "`\"Book\"`, `12`"],
            ["Call expression", "Runs the function via `()`", "`show_price(\"Book\", 12)`"],
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Reusable Price Line Helper Step by Step",
      steps: [
        {
          label: "Step 1: Parameterless header",
          explanation: "Define a parameterless helper `show_header()` and call it once with `()`.",
          code: [
            "def show_header():",
            "    print(\"--- ITEM LIST ---\")",
            "",
            "show_header()",
          ],
          activeLines: [1, 2, 4],
          output: "--- ITEM LIST ---",
        },
        {
          label: "Step 2: Add parameters `(item, amount)`",
          explanation: "Pass `item` and `amount` as parameters so the same block formats any item.",
          code: [
            "def show_line(item, amount):",
            "    print(f\"{item}: ${amount:.2f}\")",
            "",
            "show_line(\"Pen\", 1.5)",
          ],
          activeLines: [1, 2, 4],
          output: "Pen: $1.50",
        },
        {
          label: "Step 3: Reuse across multiple items",
          explanation: "Call `show_line(...)` repeatedly instead of duplicating `print(f\"...\")` lines.",
          code: [
            "def show_line(item, amount):",
            "    print(f\"{item}: ${amount:.2f}\")",
            "",
            "show_line(\"Pen\", 1.5)",
            "show_line(\"Book\", 12)",
            "show_line(\"Bag\", 45)",
          ],
          activeLines: [4, 5, 6],
          output: "Pen: $1.50\nBook: $12.00\nBag: $45.00",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `def` Registration vs Execution Jumps",
      steps: [
        {
          title: "`def welcome():` defines the body without printing `\"B\"`",
          tag: "CONCEPT",
          explanation: ["Reading lines 1-2 saves `welcome` in memory; zero output happens yet."],
          code: ["def welcome():", "    print(\"B\")", "", "print(\"A\")", "welcome()", "print(\"C\")"],
          activeLines: [1, 2],
          state: [{ name: "welcome", value: "<function>", changed: true }],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack",
            caption: "def registers welcome in the module without running its body yet.",
            items: [
              { id: "mod", label: "<module>", sub: "welcome = <fn>", state: "active" },
            ],
          },
        },
        {
          title: "Top-level `print(\"A\")` executes first",
          tag: "TRACE",
          explanation: ["Line 4 runs directly, printing `A`."],
          code: ["def welcome():", "    print(\"B\")", "", "print(\"A\")", "welcome()", "print(\"C\")"],
          activeLines: [4],
          state: [{ name: "printed", value: "A", changed: true }],
          output: "A",
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack",
            caption: "Top-level frame runs line 4 and prints A.",
            items: [
              { id: "mod", label: "<module>", sub: "line 4: print('A')", state: "active" },
            ],
          },
        },
        {
          title: "`welcome()` jumps into line 2 and prints `\"B\"`",
          tag: "TRACE",
          explanation: ["Calling `welcome()` pauses line 5, enters line 2, prints `B`, then pops back."],
          code: ["def welcome():", "    print(\"B\")", "", "print(\"A\")", "welcome()", "print(\"C\")"],
          activeLines: [5, 2],
          state: [{ name: "printed", value: "A -> B", changed: true }],
          output: "A\nB",
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack",
            caption: "Calling welcome() pauses line 5 and pushes welcome()'s frame onto the stack.",
            items: [
              { id: "mod", label: "<module>", sub: "paused at line 5", state: "default" },
              { id: "wel", label: "welcome()", sub: "line 2: print('B')", state: "active" },
            ],
          },
        },
        {
          title: "Caller resumes at `print(\"C\")`",
          tag: "CHECK",
          explanation: ["After `welcome()` finishes, line 6 prints `C`."],
          code: ["def welcome():", "    print(\"B\")", "", "print(\"A\")", "welcome()", "print(\"C\")"],
          activeLines: [6],
          state: [{ name: "printed", value: "A -> B -> C", changed: true }],
          output: "A\nB\nC",
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack",
            caption: "welcome() pops off the stack and <module> resumes at line 6.",
            items: [
              { id: "mod", label: "<module>", sub: "line 6: print('C')", state: "done" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Writing `greet_user` without parentheses `()` does not call it",
        detail: "Always include `()` when invoking a function.",
      },
      {
        title: "Calling a function above its `def` raises `NameError`",
        detail: "Python reads scripts top-to-bottom, so place definitions before caller code.",
      },
    ],
    predictChecks: [
      {
        prompt: "In what order do lines print?",
        code: "def welcome():\n    print(\"B\")\n\nprint(\"A\")\nwelcome()\nprint(\"C\")",
        options: [
          { id: "a", label: "`B`, `A`, `C`" },
          { id: "b", label: "`A`, `B`, `C`" },
          { id: "c", label: "`A`, `C`" },
        ],
        correctId: "b",
        explanation: "`def` stores the body; top-level execution prints `A`, jumps to `welcome()` for `B`, then prints `C`.",
      },
      {
        prompt: "What happens if `def greet(name):` is called as `greet()`?",
        code: "def greet(name):\n    print(name)\ngreet()",
        options: [
          { id: "a", label: "`name` defaults to `\"\"`" },
          { id: "b", label: "`TypeError`: missing 1 required positional argument" },
          { id: "c", label: "Prints `None`" },
        ],
        correctId: "b",
        explanation: "Required parameters without `= default` must receive an argument on every call.",
      },
    ],
    practiceTask: {
      title: "Warmup: Greeting Helper With Docstring",
      tier: "Warmup",
      goal: "Write `show_greeting(name)` with a docstring that prints `f\"Hi, {name}!\"` when called.",
      constraints: ["Include a 1-line docstring inside the function", "Call the function for 'Ada' and 'Sam'"],
      examples: [
        { input: "show_greeting(\"Ada\")", output: "Hi, Ada!" },
        { input: "show_greeting(\"Sam\")", output: "Hi, Sam!" },
      ],
      tasks: [
        "Define `def show_greeting(name):` with a 1-line docstring.",
        "Call `print(f\"Hi, {name}!\")` inside the body and test it with `'Ada'` and `'Sam'`.",
      ],
      starterCode: "# Exercise M05.1 Warmup: basic def with parameter\ndef show_greeting(name):\n    \"\"\"Print greeting text for name.\"\"\"\n    # TODO: print Hi, <name>!\n\nshow_greeting(\"Ada\")\nshow_greeting(\"Sam\")\n",
      expectedOutput: "Hi, Ada!\nHi, Sam!",
      hint: "Indent `print(f\"Hi, {name}!\")` 4 spaces inside `def`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def show_greeting(name):\n    \"\"\"Print greeting text for name.\"\"\"\n    print(f\"Hi, {name}!\")\n\nshow_greeting(\"Ada\")\nshow_greeting(\"Sam\")",
    },
    practiceChallenges: [
      {
        title: "Core: Price Tag Printer Function",
        tier: "Core",
        goal: "Write `show_tag(item, price)` printing `\"<item>: $<price:.2f>\"`.",
        constraints: ["Round price to 2 decimal places"],
        examples: [
          { input: "show_tag(\"Pen\", 1.5)", output: "Pen: $1.50" },
          { input: "show_tag(\"Book\", 12)", output: "Book: $12.00" },
        ],
        tasks: [
          "Accept parameters `(item, price)`.",
          "Print `f\"{item}: ${price:.2f}\"`.",
        ],
        starterCode: "# Exercise M05.1 Core: multi-parameter printer\ndef show_tag(item, price):\n    # TODO: print <item>: $<price:.2f>\n    pass\n\nshow_tag(\"Pen\", 1.5)\nshow_tag(\"Book\", 12)\n",
        expectedOutput: "Pen: $1.50\nBook: $12.00",
        hint: "Use `:.2f` inside the f-string placeholder inside `print(...)`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def show_tag(item, price):\n    \"\"\"Print a price-tag line formatted to cents.\"\"\"\n    print(f\"{item}: ${price:.2f}\")\n\nshow_tag(\"Pen\", 1.5)\nshow_tag(\"Book\", 12)",
      },
      {
        title: "Stretch: Reusable Banner Helper",
        tier: "Stretch",
        goal: "Write `print_banner(label, width)` printing a centered border `= <label> =` padded with `\"=\"` up to `width` (`f\" {label} \".center(width, \"=\")` if `width >= len(label) + 4`, else `label`).",
        constraints: ["Print `label` unchanged when `width < len(label) + 4`"],
        examples: [
          { input: "print_banner(\"START\", 11)", output: "== START ==" },
          { input: "print_banner(\"LONGTEXT\", 5)", output: "LONGTEXT" },
        ],
        tasks: [
          "Check `if width < len(label) + 4:` and print `label`.",
          "Otherwise print `f\" {label} \".center(width, \"=\")`.",
        ],
        starterCode: "# Exercise M05.1 Stretch: reusable banner helper\ndef print_banner(label, width):\n    # TODO: center label in '=' or print label unchanged\n    pass\n\nprint_banner(\"START\", 11)\nprint_banner(\"LONGTEXT\", 5)\n",
        expectedOutput: "== START ==\nLONGTEXT",
        hint: "`f\" {label} \".center(width, \"=\")` pads evenly on left and right.",
        complexity: { time: "O(width)", space: "O(width)" },
        solutionCode:
          "def print_banner(label, width):\n    if width < len(label) + 4:\n        print(label)\n    else:\n        print(f\" {label} \".center(width, \"=\"))\n\nprint_banner(\"START\", 11)\nprint_banner(\"LONGTEXT\", 5)",
      },
    ],
  },

  "py-return-vs-print": {
    lessonId: "py-return-vs-print",
    subtitle: "Send values back to callers with `return` instead of trapping answers on screen with `print()`, and avoid falling through to `None`.",
    intro: {
      heading: "Handing Data Back With `return`",
      explanation: [
        "`print()` displays characters to the terminal and returns nothing (`None`). `return` hands the computed Python value back to the caller so other functions, formulas, and tests can store and reuse it.",
        "Every branch inside a value-returning function needs a `return`; any path that falls off the bottom returns `None` implicitly.",
      ],
      analogy: "A kitchen scale with `print()` flashes a number on its screen and forgets it, while `return` hands the measured weight back in a bowl so the baker can mix it into the next step.",
      realWorldUses: [
        "Returning computed totals, booleans, or parsed records so callers can chain math and `if` checks",
        "Writing unit tests that assert `calc_tax(100) == 10.0` against returned values",
      ],
    },
    sections: [
      {
        heading: "`print()` Displays Text; `return` Sends Values Back",
        paragraphs: [
          "A function that ends without executing `return` sends `None` back to its caller, causing `TypeError` if the caller tries math (`res + 1`).",
          "Once Python executes `return`, the function exits immediately and skips any lines underneath it. You can return one value (`return price * 1.1`) or return two comma-separated values (`return a, b`) and unpack them into two variables (`low, high = pair(5)`).",
        ],
        code: [
          "def add_tax_print_only(price):",
          "    print(price * 1.1)     # shows on screen, returns None!",
          "",
          "def add_tax(price):",
          "    return price * 1.1     # hands the number back to caller",
          "",
          "bill = add_tax(100)",
          "print(bill + 20)           # 130.0 (reusable!)",
          "# bad = add_tax_print_only(100)",
          "# print(bad + 20)          # INVALID -> TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'",
        ],
        table: {
          caption: "`return` vs `print()` Inside Helper Functions",
          headers: ["Behavior", "With `return`", "With `print()` Only"],
          rows: [
            ["`x = f()` captures value?", "Yes (`x` receives object)", "No (`x` becomes `None`)"],
            ["Composable in `f(x) + 2`?", "Yes", "Crashes with `TypeError`"],
            ["Best role", "Computing results in helpers", "Top-level output to user"],
          ],
        },
        output: "130.0",
        callout: {
          kind: "WATCH OUT",
          text: "Verify every conditional branch ends in `return` so unexpected inputs never drop off the end and produce `None`.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Fix a Print-Only Function Using `return`",
      steps: [
        {
          label: "Step 1: The print-only trap",
          explanation: "Calling `double(5)` prints `10`, yet saving `x = double(5)` stores `None`.",
          code: [
            "def double(n):",
            "    print(n * 2)",
            "",
            "x = double(5)",
            "print(\"Stored:\", x)",
          ],
          activeLines: [2, 4, 5],
          output: "10\nStored: None",
        },
        {
          label: "Step 2: Swap `print()` for `return`",
          explanation: "Returning `n * 2` passes `10` back into `x` without printing early.",
          code: [
            "def double(n):",
            "    return n * 2",
            "",
            "x = double(5)",
            "print(\"Stored:\", x)",
          ],
          activeLines: [2, 4],
          output: "Stored: 10",
        },
        {
          label: "Step 3: Reuse returned values in formulas",
          explanation: "Now `double(5) + double(3)` adds the two returned numbers (`16`).",
          code: [
            "def double(n):",
            "    return n * 2",
            "",
            "total = double(5) + double(3)",
            "print(\"Combined:\", total)",
          ],
          activeLines: [4, 5],
          output: "Combined: 16",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Contrast `print()`-Only vs `return` and Spot Missing-Branch `None`",
      steps: [
        {
          title: "Side-by-side comparison: terminal output vs returned integer",
          tag: "CONCEPT",
          explanation: ["`double_bad` writes to screen and hands back `None`; `double_good` returns `10`."],
          code: [
            "def double_bad(n):  print(n * 2)",
            "def double_good(n): return n * 2",
            "bad_res  = double_bad(5)",
            "good_res = double_good(5)",
          ],
          activeLines: [3, 4],
          state: [
            { name: "bad_res", value: "None (print-only)", changed: true },
            { name: "good_res", value: "10 (returned)", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "print() writes to terminal and gives back None; return gives back an int object.",
            frames: [
              {
                name: "Caller Frame",
                bindings: [
                  { label: "bad_res", targetId: "none_val" },
                  { label: "good_res", targetId: "int_10", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "none_val", typeLabel: "NoneType (print)", value: "None" },
              { id: "int_10", typeLabel: "int (return)", value: "10", highlight: true },
            ],
          },
        },
        {
          title: "`double_bad(5)` prints `10`, binding `res = None`",
          tag: "MEMORY",
          explanation: ["Because no `return` ran, caller receives `None`."],
          code: ["def double_bad(n):", "    print(n * 2)", "res = double_bad(5)"],
          activeLines: [2, 3],
          state: [
            { name: "screen output", value: "10", changed: true },
            { name: "res", value: "None", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "res binds to None when no return executes",
            frames: [{ name: "Caller Frame", bindings: [{ label: "res", targetId: "none_val", highlight: true }] }],
            objects: [{ id: "none_val", typeLabel: "NoneType", value: "None", highlight: true }],
          },
        },
        {
          title: "`double_good(5)` hands `10` back to `res`",
          tag: "MEMORY",
          explanation: ["Caller stores `10` and computes `res + 1 == 11`."],
          code: ["def double_good(n):", "    return n * 2", "res = double_good(5)", "print(res + 1)"],
          activeLines: [2, 3, 4],
          state: [
            { name: "res", value: "10", changed: true },
            { name: "res + 1", value: "11", changed: true },
          ],
          output: "11",
          visual: {
            kind: "memory",
            caption: "return hands the int 10 object back to caller",
            frames: [{ name: "Caller Frame", bindings: [{ label: "res", targetId: "int_10", highlight: true }] }],
            objects: [{ id: "int_10", typeLabel: "int", value: "10", highlight: true }],
          },
        },
        {
          title: "Catch fall-through `None` when a branch misses `return`",
          tag: "PITFALL",
          explanation: ["In `if x > 0: return x`, passing `x = -1` skips `if`, hits end-of-function, and returns `None`."],
          code: ["def pos_only(x):", "    if x > 0:", "        return x", "print(pos_only(-1))  # prints None!"],
          activeLines: [2, 4],
          state: [{ name: "pos_only(-1)", value: "None", changed: true }],
          visual: {
            kind: "memory",
            caption: "When x = -1 skips the if block, caller binds None implicitly returned by fall-through.",
            frames: [{ name: "Caller Frame", bindings: [{ label: "pos_only(-1)", targetId: "none_fall", highlight: true }] }],
            objects: [{ id: "none_fall", typeLabel: "NoneType (implicit)", value: "None", highlight: true }],
          },
          output: "None",
        },
      ],
    },
    trickyPoints: [
      {
        title: "Missing fallback `return` returns `None`",
        detail: "Always ensure the fall-through path returns an explicit fallback value.",
      },
      {
        title: "Lines placed below an unconditional `return` never execute",
        detail: "As soon as `return` runs, Python pops the function frame immediately.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(calc(4))` output?",
        code: "def calc(x):\n    y = x * 2\n\nprint(calc(4))",
        options: [
          { id: "a", label: "`8`" },
          { id: "b", label: "`None`" },
          { id: "c", label: "`4`" },
        ],
        correctId: "b",
        explanation: "Because `calc` assigns `y` locally without returning it, `calc(4)` returns `None`.",
      },
      {
        prompt: "What does `print(b - a)` output?",
        code: "def pair(n):\n    return n, n * n\na, b = pair(5)\nprint(b - a)",
        options: [
          { id: "a", label: "`20`" },
          { id: "b", label: "`25`" },
          { id: "c", label: "`None`" },
        ],
        correctId: "a",
        explanation: "`pair(5)` returns `(5, 25)`, so `b - a` is `25 - 5 = 20`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Return Multiplied Number",
      tier: "Warmup",
      goal: "Write `double_val(n)` returning `n * 2`, so callers can compose `double_val(7) + 1` -> `15`.",
      constraints: ["Do not call print() inside double_val"],
      examples: [
        { input: "n = 7 -> double_val(7) + 1", output: "15" },
        { input: "n = -3 -> double_val(-3) + 1", output: "-5" },
      ],
      tasks: [
        "Return `n * 2` from `double_val(n)`.",
        "Test caller arithmetic `double_val(n) + 1`.",
      ],
      starterCode: "# Exercise M05.2 Warmup: return vs print\ndef double_val(n):\n    # TODO: return n * 2\n    return 0\n",
      expectedOutput: "15\n-5",
      hint: "Only `return` passes the integer back to caller math.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def double_val(n):\n    return n * 2\n\nprint(double_val(7) + 1)\nprint(double_val(-3) + 1)",
    },
    practiceChallenges: [
      {
        title: "Core: Rectangle Area & Perimeter Pair",
        tier: "Core",
        goal: "Write `rect_stats(width, height)` returning `(area, perimeter)` so callers can unpack `a, p = rect_stats(...)`.",
        constraints: ["Return (0, 0) if either side <= 0"],
        examples: [
          { input: "width = 5, height = 3", output: "(15, 16)" },
          { input: "width = 0, height = 3", output: "(0, 0)" },
        ],
        tasks: [
          "Return `(0, 0)` when `width <= 0 or height <= 0`.",
          "Return `(width * height, 2 * (width + height))`.",
        ],
        starterCode: "# Exercise M05.2 Core: multi-value return\ndef rect_stats(width, height):\n    # TODO: return (area, perimeter)\n    return (0, 0)\n",
        expectedOutput: "(15, 16)\n(0, 0)",
        hint: "Comma-separated values in `return a, p` pack into a 2-value pair (officially called a tuple, covered in Module 6).",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def rect_stats(width, height):\n    if width <= 0 or height <= 0:\n        return (0, 0)\n    return (width * height, 2 * (width + height))\n\nprint(rect_stats(5, 3))\nprint(rect_stats(0, 3))",
      },
      {
        title: "Stretch: Composable Discount Helper + Fallthrough Fix",
        tier: "Stretch",
        goal: "Fix a helper so every path explicitly returns a float (no fallthrough `None`), applying `rate` discount when `price > 0` else returning `0.0`.",
        constraints: ["Never return None on zero or negative prices"],
        examples: [
          { input: "price = 100, rate = 0.2", output: "80.0" },
          { input: "price = -10, rate = 0.2", output: "0.0" },
        ],
        tasks: [
          "Ensure non-positive `price` returns `0.0` explicitly.",
          "Return `round(price * (1 - rate), 2)` for valid prices.",
        ],
        starterCode: "# Exercise M05.2 Stretch: eliminate implicit None return\ndef calc_discount(price, rate):\n    # TODO: return rounded discounted float on every path\n    return 0.0\n",
        expectedOutput: "80.0\n0.0",
        hint: "Check `if price <= 0: return 0.0` at the top.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def calc_discount(price, rate):\n    if price <= 0:\n        return 0.0\n    return round(price * (1 - rate), 2)\n\nprint(calc_discount(100, 0.2))\nprint(calc_discount(-10, 0.2))",
      },
    ],
  },

  "py-default-keyword-args": {
    lessonId: "py-default-keyword-args",
    subtitle: "Design flexible function signatures using default parameter values and keyword arguments without ordering bugs.",
    intro: {
      heading: "Default Parameters and Keyword Call Syntax",
      explanation: [
        "Passing arguments in the wrong order—or writing `format_price(currency=\"EUR\", 25)`—triggers an immediate `SyntaxError` before your script even runs. Forcing every caller to repeat standard flags like `\"$\"` or `True` across twenty call sites clutters code and invites mix-ups.",
        "Giving optional parameters `= default` values lets common calls omit them (`format_price(25)`), while keyword arguments (`format_price(25, cents=False)`) target a single option by name. Python enforces one ordering rule in both places: required parameters stay left of defaulted ones in `def`, and positional arguments stay left of keyword ones at the call site.",
      ],
      analogy: "Ordering at a sandwich counter defaults to standard bread and cheese unless you name a swap (`bread='rye'`), saving you from listing unchanged toppings on every order.",
      realWorldUses: [
        "Formatting helpers and report generators with standard defaults like `currency=\"$\"` or `decimals=2`",
        "Configuration flags like `timeout=5` or `dry_run=False` that callers override only when needed",
      ],
    },
    sections: [
      {
        heading: "Default Parameters (`=`) & Keyword Argument Rules",
        paragraphs: [
          "Required parameters sit before `= default` parameters in `def` (`def send(msg=\"ok\", to):` raises `SyntaxError`).",
          "At a call site, keyword arguments let you override any subset of optional parameters without relying on position (`apply_coupon(50, free_ship=True)`). Once a keyword appears in a call, any arguments after it must also be keywords, and passing the same parameter twice raises `TypeError`.",
        ],
        table: {
          caption: "Parameter & Call-Site Ordering Rules",
          headers: ["Rule", "Valid Example", "Invalid -> Error"],
          rows: [
            ["Required before defaulted in `def`", "`def f(price, tax=0.1):`", "`def f(tax=0.1, price):` -> `SyntaxError`"],
            ["Positional before keyword at call", "`f(25, tax=0.2)`", "`f(tax=0.2, 25)` -> `SyntaxError`"],
            ["No duplicate parameter", "`f(25, tax=0.2)`", "`f(25, price=30)` -> `TypeError`"],
            ["Immutable defaults only", "`tax=0.1`, `currency=\"$\"`, `box=None`", "`box=[]` leaks across calls (M06)"],
          ],
        },
        code: [
          "def format_price(amount, currency=\"$\", cents=True):",
          "    if cents:",
          "        return f\"{currency}{amount:.2f}\"",
          "    return f\"{currency}{int(amount)}\"",
          "",
          "print(format_price(25))                               # valid -> $25.00",
          "print(format_price(25, currency=\"EUR \", cents=False))  # valid -> EUR 25",
          "# format_price(currency=\"EUR \", 25)                   # INVALID -> SyntaxError: positional follows keyword",
          "# format_price(25, amount=30)                         # INVALID -> TypeError: multiple values for 'amount'",
        ],
        output: "$25.00\nEUR 25",
        callout: {
          kind: "WATCH OUT",
          text: "Use immutable defaults (`None`, `0`, `False`, `\"\"`). Avoid mutable defaults like `items=[]`, which are shared across every call.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Flexible Price Formatter Step by Step",
      steps: [
        {
          label: "Step 1: Positional-only parameters",
          explanation: "Start with required parameters `(amount, currency)`—every caller has to pass both values in fixed order.",
          code: [
            "def format_price(amount, currency):",
            "    return f\"{currency}{amount:.2f}\"",
            "",
            "print(format_price(25, \"$\"))",
          ],
          activeLines: [1, 4],
          output: "$25.00",
        },
        {
          label: "Step 2: Add `= default` values",
          explanation: "Give `currency=\"$\"` and `cents=True` defaults on the right so `format_price(25)` works with one argument.",
          code: [
            "def format_price(amount, currency=\"$\", cents=True):",
            "    if cents:",
            "        return f\"{currency}{amount:.2f}\"",
            "    return f\"{currency}{int(amount)}\"",
            "",
            "print(format_price(25))",
          ],
          activeLines: [1, 6],
          output: "$25.00",
        },
        {
          label: "Step 3: Override one option by keyword",
          explanation: "Pass `cents=False` by name after positional `25` to skip `currency` and avoid positional-after-keyword `SyntaxError`.",
          code: [
            "def format_price(amount, currency=\"$\", cents=True):",
            "    if cents:",
            "        return f\"{currency}{amount:.2f}\"",
            "    return f\"{currency}{int(amount)}\"",
            "",
            "print(format_price(25))",
            "print(format_price(25, cents=False))",
          ],
          activeLines: [6, 7],
          output: "$25.00\n$25",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Positional Binding, Default Fill-In, and Keyword Overrides",
      steps: [
        {
          title: "Call `format_price(25)` binds only required `amount`",
          tag: "TRACE",
          explanation: ["`amount` gets `25`; `currency` and `cents` take their defaults (`\"$\"`, `True`)."],
          code: ["def format_price(amount, currency=\"$\", cents=True):", "    return f\"{currency}{amount:.2f}\" if cents else f\"{currency}{int(amount)}\"", "print(format_price(25))", "print(format_price(25, cents=False))"],
          activeLines: [1, 3],
          state: [
            { name: "amount", value: "25", changed: true },
            { name: "currency", value: "\"$\" (default)", changed: true },
            { name: "cents", value: "True (default)", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Missing optional parameters receive their default objects.",
            frames: [
              {
                name: "format_price(25)",
                bindings: [
                  { label: "amount", targetId: "a25", highlight: true },
                  { label: "currency", targetId: "cur" },
                  { label: "cents", targetId: "ct" },
                ],
              },
            ],
            objects: [
              { id: "a25", typeLabel: "int", value: "25", highlight: true },
              { id: "cur", typeLabel: "str (default)", value: "'$'" },
              { id: "ct", typeLabel: "bool (default)", value: "True" },
            ],
          },
          output: "$25.00",
        },
        {
          title: "Call `format_price(25, cents=False)` skips `currency` by keyword",
          tag: "PATTERN",
          explanation: ["Passing `cents=False` by name overrides the 3rd parameter while keeping the 2nd parameter's default `\"$\"`."],
          code: ["def format_price(amount, currency=\"$\", cents=True):", "    return f\"{currency}{amount:.2f}\" if cents else f\"{currency}{int(amount)}\"", "print(format_price(25))", "print(format_price(25, cents=False))"],
          activeLines: [4],
          state: [
            { name: "currency", value: "\"$\" (default)" },
            { name: "cents", value: "False (keyword)", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Keyword cents=False targets parameter 3 directly while parameter 2 keeps its default.",
            frames: [
              {
                name: "format_price(25, cents=False)",
                bindings: [
                  { label: "amount", targetId: "a25" },
                  { label: "currency", targetId: "cur" },
                  { label: "cents", targetId: "cf", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "a25", typeLabel: "int", value: "25" },
              { id: "cur", typeLabel: "str (default)", value: "'$'" },
              { id: "cf", typeLabel: "bool (keyword)", value: "False", highlight: true },
            ],
          },
          output: "$25.00\n$25",
        },
        {
          title: "Catch positional-after-keyword `SyntaxError`",
          tag: "PITFALL",
          explanation: ["Writing `format_price(currency=\"EUR\", 25)` fails to parse because positional `25` follows keyword `currency=...`."],
          code: ["# format_price(currency=\"EUR\", 25) -> SyntaxError", "# format_price(25, amount=30)      -> TypeError"],
          activeLines: [1],
          state: [{ name: "error", value: "SyntaxError", changed: true }],
          visual: {
            kind: "memory",
            caption: "Positional 25 cannot follow keyword currency='EUR', rejecting at parse time.",
            frames: [
              {
                name: "Invalid Call",
                bindings: [
                  { label: "currency (kw)", targetId: "eur" },
                  { label: "25 (pos after kw!)", targetId: "err_syn", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "eur", typeLabel: "str", value: "'EUR'" },
              { id: "err_syn", typeLabel: "parse error", value: "SyntaxError", highlight: true },
            ],
          },
        },
        {
          title: "Catch duplicate argument `TypeError`",
          tag: "PITFALL",
          explanation: ["Passing `25` positionally and `amount=30` by keyword provides two values for one parameter (`TypeError`)."],
          code: ["# format_price(currency=\"EUR\", 25) -> SyntaxError", "# format_price(25, amount=30)      -> TypeError"],
          activeLines: [2],
          state: [{ name: "error", value: "TypeError: multiple values", changed: true }],
          visual: {
            kind: "memory",
            caption: "Positional 25 and keyword amount=30 collide on the same amount slot.",
            frames: [
              {
                name: "Binding Collision",
                bindings: [
                  { label: "pos[0] -> amount", targetId: "dup_err", highlight: true },
                  { label: "kw amount=30", targetId: "dup_err", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "dup_err", typeLabel: "TypeError", value: "multiple values for 'amount'", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Putting `def f(a=1, b):` fails at parse time (`SyntaxError`)",
        detail: "Move all required parameters left of any `=` parameter.",
      },
      {
        title: "Positional after keyword (`f(currency='€', 25)`) fails",
        detail: "Place positional arguments first, then keyword arguments.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `greet(\"Sam\")` print?",
        code: "def greet(name, greeting=\"Hi\"):\n    return f\"{greeting}, {name}\"\n\nprint(greet(\"Sam\"))",
        options: [
          { id: "a", label: "`Hi, Sam`" },
          { id: "b", label: "`TypeError`" },
          { id: "c", label: "`Sam, Hi`" },
        ],
        correctId: "a",
        explanation: "`name` receives `\"Sam\"` positionally and `greeting` falls back to `\"Hi\"`.",
      },
      {
        prompt: "What happens if a required parameter follows a default parameter (`def f(tax=0.1, price):`)?",
        code: "def f(tax=0.1, price):\n    return price * (1 + tax)",
        options: [
          { id: "a", label: "`SyntaxError`: parameter without default follows parameter with default" },
          { id: "b", label: "`price` defaults to `0`" },
          { id: "c", label: "Valid if called with keyword `price=`" },
        ],
        correctId: "a",
        explanation: "Python requires non-default parameters to precede default parameters.",
      },
    ],
    practiceTask: {
      title: "Warmup: Shipping Fee With Express Default",
      tier: "Warmup",
      goal: "Write `shipping_fee(weight_kg, express=False)` returning `$5` base (`$15` if `express`) plus `$2` per kg.",
      constraints: ["weight_kg >= 0", "Express defaults to False"],
      examples: [
        { input: "shipping_fee(3)", output: "11" },
        { input: "shipping_fee(3, express=True)", output: "21" },
      ],
      tasks: [
        "Set default `express=False` in signature.",
        "Compute `base + weight_kg * 2`.",
      ],
      starterCode: "# Exercise M05.3 Warmup: boolean default flag\ndef shipping_fee(weight_kg, express=False):\n    # TODO: $5 standard or $15 express + $2/kg\n    return 0\n",
      expectedOutput: "11\n21",
      hint: "Ternary `base = 15 if express else 5` keeps the body short.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def shipping_fee(weight_kg, express=False):\n    base = 15 if express else 5\n    return base + weight_kg * 2\n\nprint(shipping_fee(3))\nprint(shipping_fee(3, express=True))",
    },
    practiceChallenges: [
      {
        title: "Core: Multi-Option Greeting Formatter",
        tier: "Core",
        goal: "Write `badge(name, role=\"Member\", uppercase=False)` returning `\"<name> (<role>)\"` (uppercased if `uppercase=True`).",
        constraints: ["Allow overriding role or uppercase independently by keyword"],
        examples: [
          { input: "badge(\"Ada\")", output: "Ada (Member)" },
          { input: "badge(\"Sam\", uppercase=True)", output: "SAM (MEMBER)" },
        ],
        tasks: [
          "Build `text = f\"{name} ({role})\"`.",
          "Return `text.upper()` if `uppercase` else `text`.",
        ],
        starterCode: "# Exercise M05.3 Core: independent keyword overrides\ndef badge(name, role=\"Member\", uppercase=False):\n    # TODO: format badge with optional uppercase\n    return \"\"\n",
        expectedOutput: "Ada (Member)\nSAM (MEMBER)",
        hint: "Calling `badge(\"Sam\", uppercase=True)` keeps default `role=\"Member\"`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def badge(name, role=\"Member\", uppercase=False):\n    text = f\"{name} ({role})\"\n    return text.upper() if uppercase else text\n\nprint(badge(\"Ada\"))\nprint(badge(\"Sam\", uppercase=True))",
      },
      {
        title: "Stretch: Coupon Price Calculator With Immutable `None` Cap",
        tier: "Stretch",
        goal: "Write `apply_coupon(price, discount=0.0, free_ship=False, max_off=None)` applying percentage discount capped at `max_off` when provided, then adding `$5.00` unless `free_ship=True`, rounded to 2 decimals.",
        constraints: ["max_off is None or >= 0", "price >= 0"],
        examples: [
          { input: "apply_coupon(100, discount=0.3, max_off=20, free_ship=True)", output: "80.0" },
          { input: "apply_coupon(50, discount=0.2)", output: "45.0" },
        ],
        tasks: [
          "Compute `off = price * discount`, and clamp `if max_off is not None and off > max_off: off = max_off`.",
          "Subtract `off`, add `0 if free_ship else 5.0`, and `round(..., 2)`.",
        ],
        starterCode: "# Exercise M05.3 Stretch: None-default cap + keyword flags\ndef apply_coupon(price, discount=0.0, free_ship=False, max_off=None):\n    # TODO: apply capped discount + optional shipping\n    return 0.0\n",
        expectedOutput: "80.0\n45.0",
        hint: "Default `max_off=None` lets callers omit a cap.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def apply_coupon(price, discount=0.0, free_ship=False, max_off=None):\n    off = price * discount\n    if max_off is not None and off > max_off:\n        off = max_off\n    total = price - off + (0.0 if free_ship else 5.0)\n    return round(total, 2)\n\nprint(apply_coupon(100, discount=0.3, max_off=20, free_ship=True))\nprint(apply_coupon(50, discount=0.2))",
      },
    ],
  },

  "py-guard-clauses": {
    lessonId: "py-guard-clauses",
    subtitle: "Validate invalid inputs up front with early `return` guard clauses to keep the main logic flat and readable.",
    intro: {
      heading: "Flat Validation With Guard Clauses",
      explanation: [
        "Nested arrow-shaped `if / else` ladders push the real calculation three or four tabs to the right, bury `else` branches dozens of lines below their `if`, and still crash with `AttributeError` or `ZeroDivisionError` when a `None` or `0` slips past.",
        "Guard clauses flip each invalid check (`if amount <= 0: return False`) and exit right away at indent level 1 before the main work starts. Every line below the guards can assume inputs are valid with zero nested `else:` blocks.",
      ],
      analogy: "Airport security checks your boarding pass and ID at the front door before letting you into the terminal, keeping the rest of the walk to your gate free of repeated ticket checks.",
      realWorldUses: [
        "API request and form validation before database writes or billing math",
        "Preventing `None`, empty-list, and zero-division bugs at the top of helper functions",
      ],
    },
    sections: [
      {
        heading: "Nested Pyramids vs Early-Return Guard Clauses",
        paragraphs: [
          "Each guard clause handles one invalid edge case and exits right away. Because bad states have already exited, every line below the guards can assume inputs are valid without nested `else:` blocks.",
        ],
        visual: {
          kind: "compare",
          leftTitle: "Nested if/else pyramid",
          rightTitle: "Flat guard clauses (early return)",
          rows: [
            { left: "if amount > 0 (indent 1)", right: "Guard: if amount <= 0: return False", highlight: true },
            { left: "if amount <= balance (indent 2)", right: "Guard: if amount > balance: return False", highlight: true },
            { left: "Main return True at indent 3", right: "Main return True at indent 1" },
            { left: "Multiple matching else arms", right: "Zero else arms needed" },
          ],
        },
        code: [
          "# Nested arrow shape: happy path sits 3 indents deep",
          "def can_withdraw_nested(balance, amount):",
          "    if amount > 0:",
          "        if amount <= balance:",
          "            return True",
          "        else:",
          "            return False",
          "    else:",
          "        return False",
          "",
          "# Flat guard clauses: exit bad cases first at indent 1",
          "def can_withdraw(balance, amount):",
          "    if amount <= 0:",
          "        return False",
          "    if amount > balance:",
          "        return False",
          "    return True",
          "",
          "print(can_withdraw(100, 40), can_withdraw(100, 150))",
        ],
        table: {
          caption: "Guard Clause Ordering & Anti-Patterns",
          headers: ["Guard Check", "Must Precede", "Why"],
          rows: [
            ["`if x is None:`", "Any `.strip()`, `len()`, or `in` check", "Prevents `AttributeError` / `TypeError` on `None`"],
            ["`if not items:`", "Indexing `items[0]` or `len` division", "Prevents `IndexError` / `ZeroDivisionError`"],
            ["No trailing `else:` after `return`", "Remaining happy-path body", "Keeps function indentation flat at level 1"],
          ],
        },
        output: "True False",
      },
    ],
    guidedBuildUp: {
      title: "Flatten a Nested Validator With Guard Clauses",
      steps: [
        {
          label: "Step 1: Nested `if/else` pyramid",
          explanation: "Checking valid `price` and valid `rate` inside nested `if` blocks pushes the formula two levels deep.",
          code: [
            "def discount_price(price, rate):",
            "    if price > 0:",
            "        if 0 <= rate < 1:",
            "            return round(price * (1 - rate), 2)",
            "        else:",
            "            return price",
            "    return 0.0",
            "print(discount_price(100, 0.2))",
          ],
          activeLines: [2, 3, 4],
          output: "80.0",
        },
        {
          label: "Step 2: Flip the first check into a guard",
          explanation: "Reject `price <= 0` at the top with an early `return 0.0` so the rest of the body drops one indent level.",
          code: [
            "def discount_price(price, rate):",
            "    if price <= 0:",
            "        return 0.0",
            "    if 0 <= rate < 1:",
            "        return round(price * (1 - rate), 2)",
            "    return price",
            "",
            "print(discount_price(-10, 0.2))",
          ],
          activeLines: [2, 3],
          output: "0.0",
        },
        {
          label: "Step 3: Stack all guards flat at indent level 1",
          explanation: "Flip the invalid `rate` check into a second guard too, leaving the happy-path calculation at the bottom.",
          code: [
            "def discount_price(price, rate):",
            "    if price <= 0:",
            "        return 0.0",
            "    if rate < 0 or rate >= 1:",
            "        return price",
            "    return round(price * (1 - rate), 2)",
            "",
            "print(discount_price(100, 0.2))",
            "print(discount_price(-10, 0.2))",
          ],
          activeLines: [4, 5, 6],
          output: "80.0\n0.0",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Early Guard Exits vs Normal Flow in `place_order`",
      steps: [
        {
          title: "Guard 1: reject missing/non-positive quantity at line 2",
          tag: "PATTERN",
          explanation: ["`qty = 0` immediately exits with `\"invalid\"`, skipping stock and fee math."],
          code: ["def place_order(stock, qty, express=False):", "    if qty <= 0:", "        return \"invalid\"", "    if qty > stock:", "        return \"out_of_stock\"", "    fee = 10 if express else 0", "    return f\"ok:{qty}:fee={fee}\""],
          activeLines: [2, 3],
          state: [{ name: "place_order(5, 0)", value: "\"invalid\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "First guard rejects qty <= 0 immediately and skips remaining lines.",
            branches: [
              { id: "g1", label: "if qty <= 0 -> True (return 'invalid')", status: "true" },
              { id: "g2", label: "if qty > stock -> skipped", status: "skipped" },
              { id: "ok", label: "fee & ok return -> skipped", status: "skipped" },
            ],
          },
        },
        {
          title: "Guard 2: reject over-stock order at line 4",
          tag: "TRACE",
          explanation: ["`qty = 9 > stock = 5` exits at line 5 without deeply nested `else:` blocks."],
          code: ["def place_order(stock, qty, express=False):", "    if qty <= 0:", "        return \"invalid\"", "    if qty > stock:", "        return \"out_of_stock\"", "    fee = 10 if express else 0", "    return f\"ok:{qty}:fee={fee}\""],
          activeLines: [4, 5],
          state: [{ name: "place_order(5, 9)", value: "\"out_of_stock\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "qty = 9 clears Guard 1, then triggers Guard 2 (qty > stock).",
            branches: [
              { id: "g1", label: "if qty <= 0 -> False", status: "false" },
              { id: "g2", label: "if qty > stock -> True (return 'out_of_stock')", status: "true" },
              { id: "ok", label: "fee & ok return -> skipped", status: "skipped" },
            ],
          },
        },
        {
          title: "Happy path executes flat at indent level 1",
          tag: "CHECK",
          explanation: ["When both guards pass (`stock=5, qty=2`), lines 6-7 run with zero `else:` nesting."],
          code: ["def place_order(stock, qty, express=False):", "    if qty <= 0:", "        return \"invalid\"", "    if qty > stock:", "        return \"out_of_stock\"", "    fee = 10 if express else 0", "    return f\"ok:{qty}:fee={fee}\""],
          activeLines: [6, 7],
          state: [{ name: "place_order(5, 2, True)", value: "\"ok:2:fee=10\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "Both guards fail for qty = 2, letting execution flow straight to the happy path.",
            branches: [
              { id: "g1", label: "if qty <= 0 -> False", status: "false" },
              { id: "g2", label: "if qty > stock -> False", status: "false" },
              { id: "ok", label: "return 'ok:2:fee=10'", status: "true" },
            ],
          },
        },
        {
          title: "Keep guard order safe (`None` check before `len()`)",
          tag: "PITFALL",
          explanation: ["Always put `if text is None:` above `if len(text) == 0:`, otherwise `len(None)` raises `TypeError`."],
          code: ["if text is None:", "    return False", "if not text.strip():", "    return False"],
          activeLines: [1, 2],
          state: [{ name: "order", value: "None guard must come first", changed: true }],
          visual: {
            kind: "trace",
            caption: "Place the None check before any method or len() call on text.",
            branches: [
              { id: "n", label: "1. if text is None -> return False", status: "true" },
              { id: "s", label: "2. text.strip() -> safe only after None guard", status: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Calling methods or `len()` before checking `is None`",
        detail: "Put `if x is None:` as the very first guard so later checks never crash on `NoneType`.",
      },
      {
        title: "Keeping redundant `else:` after a `return`",
        detail: "Once `if bad: return ...` executes, control has left the function; write the next step directly below at the same indent.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `score_tier(-5)` return?",
        code: "def score_tier(s):\n    if s < 0 or s > 100:\n        return \"invalid\"\n    if s >= 60:\n        return \"pass\"\n    return \"retry\"\n\nprint(score_tier(-5))",
        options: [
          { id: "a", label: "`retry`" },
          { id: "b", label: "`invalid`" },
          { id: "c", label: "`None`" },
        ],
        correctId: "b",
        explanation: "The guard `s < 0` matches `-5` first and exits immediately with `\"invalid\"`.",
      },
      {
        prompt: "Why do guards come in `if text is None:` then `if text.strip() == \"\":` order?",
        code: "def valid(text):\n    if text is None:\n        return False\n    if text.strip() == \"\":\n        return False\n    return True",
        options: [
          { id: "a", label: "Calling `None.strip()` would raise `AttributeError` if checked first" },
          { id: "b", label: "Strings cannot be compared to `None`" },
          { id: "c", label: "Order does not matter" },
        ],
        correctId: "a",
        explanation: "Guarding `None` first guarantees `text` is a string before calling `.strip()`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Guard Non-Positive Width/Price",
      tier: "Warmup",
      goal: "Use guard clauses in `unit_cost(total, qty)` to return `None` if `total < 0` or `qty <= 0`, otherwise return `round(total / qty, 2)`.",
      constraints: ["Never divide by 0", "Negative totals return None"],
      examples: [
        { input: "total = 25.0, qty = 4", output: "6.25" },
        { input: "total = 25.0, qty = 0", output: "None" },
      ],
      tasks: [
        "Guard `total < 0` and `qty <= 0` at the top.",
        "Return `round(total / qty, 2)` at indent level 1.",
      ],
      starterCode: "# Exercise M05.4 Warmup: division guard clause\ndef unit_cost(total, qty):\n    # TODO: guard invalid total/qty then divide\n    return None\n",
      expectedOutput: "6.25\nNone",
      hint: "Return `None` before reaching `total / qty`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def unit_cost(total, qty):\n    if total < 0 or qty <= 0:\n        return None\n    return round(total / qty, 2)\n\nprint(unit_cost(25.0, 4))\nprint(unit_cost(25.0, 0))",
    },
    practiceChallenges: [
      {
        title: "Core: Username Guard Pipeline",
        tier: "Core",
        goal: "Return `\"ok\"` only if `name` is not `None`, has no spaces, and has stripped length `3..15`; otherwise return `\"missing\"`, `\"has_space\"`, or `\"bad_length\"`.",
        constraints: ["Check missing -> has_space -> bad_length in priority order"],
        examples: [
          { input: "name = None", output: "missing" },
          { input: "name = \" sam_99  \"", output: "ok" },
        ],
        tasks: [
          "Return `\"missing\"` if `name is None`.",
          "Strip outer whitespace (`clean = name.strip()`), reject inner spaces (`\" \" in clean`), reject length outside `3..15`.",
        ],
        starterCode: "# Exercise M05.4 Core: ordered guard validation\ndef check_username(name):\n    # TODO: validate None, inner spaces, length\n    return \"missing\"\n",
        expectedOutput: "missing\nok",
        hint: "Strip outer spaces first so leading/trailing padding doesn't count as an inner space.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def check_username(name):\n    if name is None:\n        return \"missing\"\n    clean = name.strip()\n    if \" \" in clean:\n        return \"has_space\"\n    if not (3 <= len(clean) <= 15):\n        return \"bad_length\"\n    return \"ok\"\n\nprint(check_username(None))\nprint(check_username(\" sam_99  \"))",
      },
      {
        title: "Stretch: Flat Clean-Registration Parser",
        tier: "Stretch",
        goal: "Parse `\" priya nair , python  \"` into `\"Priya Nair (PYTHON)\"` using guard clauses returning `None` if `raw_line is None`, no comma exists, or either trimmed part is empty.",
        constraints: ["Check None, comma presence, and empty parts using flat guards"],
        examples: [
          { input: "raw_line = \" priya nair , python  \"", output: "Priya Nair (PYTHON)" },
          { input: "raw_line = \"missing-comma\"", output: "None" },
        ],
        tasks: [
          "Guard `if raw_line is None:` then `clean = raw_line.strip()`.",
          "Guard `if \",\" not in clean: return None`, split once `split(\",\", 1)`, guard empty name or track.",
        ],
        starterCode: "# Exercise M05.4 Stretch: flat CSV line guard\ndef clean_registration(raw_line):\n    # TODO: guard None, comma, empty fields -> '<Title> (<UPPER>)'\n    return None\n",
        expectedOutput: "Priya Nair (PYTHON)\nNone",
        hint: "Use `split(\",\", 1)` so extra commas inside later fields don't split further, then unpack `a, b = parts` directly into two variables.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def clean_registration(raw_line):\n    if raw_line is None:\n        return None\n    text = raw_line.strip()\n    if \",\" not in text:\n        return None\n    name_part, track_part = text.split(\",\", 1)\n    name = \" \".join(name_part.split()).title()\n    track = track_part.strip().upper()\n    if not name or not track:\n        return None\n    return f\"{name} ({track})\"\n\nprint(clean_registration(\" priya nair , python  \"))\nprint(clean_registration(\"missing-comma\"))",
      },
    ],
  },

  "py-scope-basics": {
    lessonId: "py-scope-basics",
    subtitle: "Follow Python's LEGB name lookup (Local -> Enclosing -> Global -> Built-in) and avoid `UnboundLocalError` or shadowed built-ins.",
    intro: {
      heading: "Local Frames and LEGB Lookup Order",
      explanation: [
        "Writing `points += 10` inside a function to update a module-level `points = 100` crashes with `UnboundLocalError: cannot access local variable 'points'`. Naming a local counter `sum = 0` causes a subtler bug: later calls to `sum([1, 2])` fail with `TypeError` because `sum` now holds an integer instead of Python's built-in function.",
        "Every function call builds an isolated local frame that disappears once the call returns. When reading any variable, Python searches four scopes in order—Local, Enclosing, Global, then Built-in (`LEGB`)—while any assignment (`=`, `+=`) inside `def` binds that name locally by default.",
      ],
      analogy: "Scratch paper on your desk holds numbers for the math problem you are solving right now, and gets cleared once you hand the final answer back to the folder on the shelf.",
      realWorldUses: [
        "Keeping helper functions isolated so temporary loop variables never collide across files",
        "Preventing `UnboundLocalError` and built-in shadowing (`sum`, `list`, `id`) in data pipelines",
      ],
    },
    sections: [
      {
        heading: "Local Frames, LEGB Priority & `UnboundLocalError`",
        paragraphs: [
          "Assignments inside a function create local variables unless marked `global` (which couples functions to shared state and breaks testability). Passing inputs as parameters and returning the new value avoids both global coupling and accidental mutations.",
          "Because `points += 10` expands to `points = points + 10`, Python marks `points` local across the whole function body and raises `UnboundLocalError` when the right-hand side tries to read `points` before any local value exists.",
        ],
        table: {
          caption: "Python LEGB Scope Resolution",
          headers: ["Order", "Scope", "Where It Lives", "Rule"],
          rows: [
            ["1", "Local (`L`)", "Active function call frame", "Default scope for assignments inside `def`"],
            ["2", "Enclosing (`E`)", "Outer `def` around a nested `def`", "Inner helper can read outer parameters"],
            ["3", "Global (`G`)", "Module top level", "Use for constants (`MAX_RETRIES`); pass state via args"],
            ["4", "Built-in (`B`)", "`print`, `len`, `sum`, `range`", "Never overwrite with variable names like `sum = 0`"],
          ],
        },
        visual: {
          kind: "memory-sim",
          caption: "Step through local call frame creation and destruction vs module globals",
          scenarios: [
            {
              label: "Isolated Local Scope",
              code: ["x = 50", "def demo():", "    x = 10", "demo()", "print(x)"],
              steps: [
                {
                  line: 1,
                  note: "Module namespace binds global `x` -> `50`.",
                  frames: [{ name: "Global Frame", bindings: [{ label: "x", targetId: "gx", highlight: true }] }],
                  objects: [{ id: "gx", typeLabel: "int", value: "50" }],
                },
                {
                  line: 3,
                  note: "Inside `demo()`, assigning `x = 10` creates a separate local `x`; global `x` stays `50`.",
                  frames: [
                    { name: "Global Frame", bindings: [{ label: "x", targetId: "gx" }] },
                    { name: "demo() Frame", bindings: [{ label: "x", targetId: "lx", highlight: true }] },
                  ],
                  objects: [
                    { id: "gx", typeLabel: "int", value: "50" },
                    { id: "lx", typeLabel: "int", value: "10", highlight: true },
                  ],
                },
                {
                  line: 4,
                  note: "When `demo()` finishes, its local frame pops.",
                  frames: [{ name: "Global Frame", bindings: [{ label: "x", targetId: "gx" }] }],
                  objects: [{ id: "gx", typeLabel: "int", value: "50" }],
                },
                {
                  line: 5,
                  note: "`print(x)` reads `50` from Global Frame.",
                  frames: [{ name: "Global Frame", bindings: [{ label: "x", targetId: "gx", highlight: true }] }],
                  objects: [{ id: "gx", typeLabel: "int", value: "50", highlight: true }],
                },
              ],
            },
          ],
        },
        code: [
          "STORE = \"Northstar\"",
          "points = 100",
          "",
          "# def bump_broken():",
          "#     points += 10         # INVALID -> UnboundLocalError (write marks points local)",
          "",
          "def add_bonus(current, bonus=10):",
          "    return current + bonus # valid -> parameter in, new value out",
          "",
          "def invoice(sub, ship, currency=\"$\"):",
          "    def fmt(lbl, amt):",
          "        return f\"{lbl}: {currency}{amt:.2f}\"  # reads Enclosing currency",
          "    return f\"{STORE} | {fmt('Total', sub + ship)}\"",
          "",
          "print(add_bonus(points))",
          "print(invoice(40, 5, currency=\"EUR \"))",
        ],
        output: "110\nNorthstar | Total: EUR 45.00",
        callout: {
          kind: "RULE OF THUMB",
          text: "Pass inputs as parameters and hand outputs back with `return` instead of mutating module globals.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Fix UnboundLocalError and Built-In Shadowing Step by Step",
      steps: [
        {
          label: "Step 1: The `UnboundLocalError` trap",
          explanation: "Inside `bump()`, `points += 10` marks `points` as a local variable, so reading `points` before any local assignment crashes.",
          code: [
            "points = 100",
            "def bump():",
            "    points += 10",
            "    return points",
            "print(bump())",
          ],
          activeLines: [3, 5],
          output: "UnboundLocalError: cannot access local variable 'points'",
        },
        {
          label: "Step 2: Pass state in and return the updated value",
          explanation: "Accept `points` as a parameter and return `points + 10`; the local frame stays isolated and global `points` stays `100`.",
          code: [
            "points = 100",
            "def add_bonus(points, bonus=10):",
            "    return points + bonus",
            "",
            "print(add_bonus(points), points)",
          ],
          activeLines: [2, 3, 5],
          output: "110 100",
        },
        {
          label: "Step 3: Keep built-in names unshadowed",
          explanation: "Name your local accumulator `total` rather than `sum`, leaving built-in `sum()` intact in `B` scope.",
          code: [
            "def average_scores(items):",
            "    total = sum(items)",
            "    return total / len(items)",
            "",
            "print(average_scores([10, 20, 30]))",
          ],
          activeLines: [2, 3],
          output: "20.0",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Local Shadowing, Built-In Shadowing & `UnboundLocalError`",
      steps: [
        {
          title: "Local `x = 10` inside `demo()` leaves global `x = 50` untouched",
          tag: "MEMORY",
          explanation: ["`demo()` binds its own local `x` inside its stack frame; outside `x` stays `50`."],
          code: ["x = 50", "def demo():", "    x = 10", "    return x", "print(demo(), x)"],
          activeLines: [1, 3, 5],
          state: [
            { name: "local x", value: "10", changed: true },
            { name: "global x", value: "50" },
          ],
          visual: {
            kind: "memory",
            caption: "Assignment inside demo() creates a separate local x without touching global x.",
            frames: [
              { name: "Globals (G)", bindings: [{ label: "x", targetId: "gx" }] },
              { name: "demo() (L)", bindings: [{ label: "x", targetId: "lx", highlight: true }] },
            ],
            objects: [
              { id: "gx", typeLabel: "int", value: "50" },
              { id: "lx", typeLabel: "int", value: "10", highlight: true },
            ],
          },
          output: "10 50",
        },
        {
          title: "Enclosing lookup: nested helper reads outer `currency` (`E`)",
          tag: "CONCEPT",
          explanation: ["When `fmt` needs `currency`, it misses `L` and finds it in outer function `E`."],
          code: ["def outer(currency):", "    def inner(v):", "        return f\"{currency}{v}\"", "    return inner(10)"],
          activeLines: [1, 3],
          state: [{ name: "E lookup", value: "currency from outer()", changed: true }],
          visual: {
            kind: "memory",
            caption: "LEGB checks Local first, misses, then finds currency in the Enclosing outer() frame.",
            frames: [
              { name: "outer() (E)", bindings: [{ label: "currency", targetId: "ecur", highlight: true }] },
              { name: "inner() (L)", bindings: [{ label: "v", targetId: "iv" }, { label: "currency -> E", targetId: "ecur", highlight: true }] },
            ],
            objects: [
              { id: "ecur", typeLabel: "str", value: "'$'", highlight: true },
              { id: "iv", typeLabel: "int", value: "10" },
            ],
          },
        },
        {
          title: "`points += 1` inside function triggers `UnboundLocalError`",
          tag: "PITFALL",
          explanation: ["Python sees assignment `points = points + 1`, marks `points` local, and crashes reading before write."],
          code: ["points = 100", "def bump():", "    points += 1  # UnboundLocalError!"],
          activeLines: [3],
          state: [{ name: "error", value: "UnboundLocalError", changed: true }],
          visual: {
            kind: "memory",
            caption: "points = points + 1 marks points as Local inside bump(), leaving local points unbound on read.",
            frames: [
              { name: "Globals (G)", bindings: [{ label: "points", targetId: "gp" }] },
              { name: "bump() (L)", bindings: [{ label: "points (local!)", targetId: "unb", highlight: true }] },
            ],
            objects: [
              { id: "gp", typeLabel: "int", value: "100 (blocked)" },
              { id: "unb", typeLabel: "UnboundLocalError", value: "accessed before write", highlight: true },
            ],
          },
        },
        {
          title: "`sum = 0` shadows Built-in (`B`) `sum()` function",
          tag: "PITFALL",
          explanation: ["Assigning `sum = 0` puts integer `0` in scope ahead of `B`, breaking `sum(nums)` with `TypeError`."],
          code: ["sum = 0", "# sum([1, 2]) -> TypeError: 'int' object is not callable"],
          activeLines: [1, 2],
          state: [{ name: "sum", value: "0 (hides built-in)", changed: true }],
          visual: {
            kind: "memory",
            caption: "Globals sum = 0 intercepts LEGB lookup before reaching Built-in sum().",
            frames: [
              { name: "Globals (G)", bindings: [{ label: "sum", targetId: "s0", highlight: true }] },
              { name: "Built-ins (B)", bindings: [{ label: "sum (hidden)", targetId: "sfn" }] },
            ],
            objects: [
              { id: "s0", typeLabel: "int", value: "0", highlight: true },
              { id: "sfn", typeLabel: "builtin fn", value: "<built-in sum>" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Running `points += 10` on a global variable without passing it as a parameter",
        detail: "Accept `points` as a parameter and return `points + 10` instead of mutating a global.",
      },
      {
        title: "Naming variables `sum`, `list`, `dict`, `str`, or `id`",
        detail: "Assigning those names hides Python's built-in (`B`) functions in that scope.",
      },
    ],
    predictChecks: [
      {
        prompt: "What prints on the last line?",
        code: "x = 50\ndef demo():\n    x = 10\n    print(x)\ndemo()\nprint(x)",
        options: [
          { id: "a", label: "`10` then `10`" },
          { id: "b", label: "`10` then `50`" },
          { id: "c", label: "`50` then `50`" },
        ],
        correctId: "b",
        explanation: "Assignment inside `demo()` creates a local `x`, leaving global `x` at `50`.",
      },
      {
        prompt: "What happens when `count = 1` is global and `bump()` runs `count += 1`?",
        code: "count = 1\ndef bump():\n    count += 1\nbump()",
        options: [
          { id: "a", label: "`count` becomes `2`" },
          { id: "b", label: "`UnboundLocalError`" },
          { id: "c", label: "`SyntaxError`" },
        ],
        correctId: "b",
        explanation: "`count += 1` assigns to `count`, marking it local across `bump()` before it is initialized.",
      },
    ],
    practiceTask: {
      title: "Warmup: Replace Global State With Pure Parameter Return",
      tier: "Warmup",
      goal: "Write `apply_deposits(balance, deposits)` updating a local running total without touching any global variable.",
      constraints: ["Do not use the global keyword"],
      examples: [
        { input: "balance = 100, deposits = [50, 50]", output: "200" },
        { input: "balance = 0, deposits = []", output: "0" },
      ],
      tasks: [
        "Use local variable `curr = balance`.",
        "Add each deposit and return `curr`.",
      ],
      starterCode: "# Exercise M05.5 Warmup: pure local parameter balance\ndef apply_deposits(balance, deposits):\n    # TODO: sum deposits onto local copy of balance\n    return balance\n",
      expectedOutput: "200\n0",
      hint: "Keep all accumulator variables strictly inside `apply_deposits`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "def apply_deposits(balance, deposits):\n    curr = balance\n    for d in deposits:\n        curr += d\n    return curr\n\nprint(apply_deposits(100, [50, 50]))\nprint(apply_deposits(0, []))",
    },
    practiceChallenges: [
      {
        title: "Core: Un-Shadow Built-In `sum()` and `len()`",
        tier: "Core",
        goal: "Compute the average of `items` using a helper without shadowing built-in names (`sum`, `list`, `len`), returning `0.0` for `[]`.",
        constraints: ["Use sum(items) / len(items)", "Never shadow built-ins"],
        examples: [
          { input: "items = [10, 20, 30]", output: "20.0" },
          { input: "items = []", output: "0.0" },
        ],
        tasks: [
          "Guard empty `items` returning `0.0`.",
          "Return `sum(items) / len(items)` without creating a local variable named `sum`.",
        ],
        starterCode: "# Exercise M05.5 Core: avoid shadowing built-in sum\ndef average_scores(items):\n    # TODO: guard empty then compute sum(items) / len(items)\n    return 0.0\n",
        expectedOutput: "20.0\n0.0",
        hint: "Use `total` if storing an intermediate sum, leaving built-in `sum` untouched.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "def average_scores(items):\n    if not items:\n        return 0.0\n    return sum(items) / len(items)\n\nprint(average_scores([10, 20, 30]))\nprint(average_scores([]))",
      },
      {
        title: "Stretch: Enclosing Helper Formatting (LEGB `E` Scope)",
        tier: "Stretch",
        goal: "Write `format_receipt(prices, currency=\"$\", tax=0.05)` containing a nested helper `line(label, val)` that runs inside `format_receipt` and reads enclosing `currency` (`E` scope) to format `[Subtotal, Total]`.",
        constraints: ["Nested helper reads enclosing currency without passing it explicitly"],
        examples: [
          { input: "prices = [40, 60], currency = \"$\", tax = 0.05", output: "['Subtotal: $100.00', 'Total: $105.00']" },
          { input: "prices = [10], currency = \"EUR \", tax = 0.1", output: "['Subtotal: EUR 10.00', 'Total: EUR 11.00']" },
        ],
        tasks: [
          "Define `def fmt(label, val): return f\"{label}: {currency}{val:.2f}\"` inside `format_receipt`.",
          "Return `[fmt(\"Subtotal\", sub), fmt(\"Total\", total)]`.",
        ],
        starterCode: "# Exercise M05.5 Stretch: enclosing scope helper\ndef format_receipt(prices, currency=\"$\", tax=0.05):\n    # TODO: nest fmt(label, val) reading enclosing currency\n    return []\n",
        expectedOutput: "['Subtotal: $100.00', 'Total: $105.00']\n['Subtotal: EUR 10.00', 'Total: EUR 11.00']",
        hint: "Enclosing `E` scope automatically makes `currency` visible inside nested `fmt` while `format_receipt` runs (returning a nested function to keep after return is covered under closures in Module 9).",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "def format_receipt(prices, currency=\"$\", tax=0.05):\n    def fmt(label, val):\n        return f\"{label}: {currency}{val:.2f}\"\n    sub = sum(prices)\n    total = sub * (1 + tax)\n    return [fmt(\"Subtotal\", sub), fmt(\"Total\", total)]\n\nprint(format_receipt([40, 60], currency=\"$\", tax=0.05))\nprint(format_receipt([10], currency=\"EUR \", tax=0.1))",
      },
    ],
  },

  "py-decomposition": {
    lessonId: "py-decomposition",
    subtitle: "Break multi-step tasks into small single-purpose helper functions that compose in a readable pipeline.",
    intro: {
      heading: "Splitting Workflows Into Single-Purpose Helpers",
      explanation: [
        "Stuffing text cleanup, tax math, grading thresholds, and string formatting into one 80-line monolith makes every change brittle: you cannot unit-test the math without parsing raw strings, and returning a formatted `\"25.0C\"` string from a calculation helper breaks any caller that needs to check `temp >= 22`.",
        "Function decomposition assigns each distinct job to its own small helper that returns a typed data value (`float`, `bool`, `str`) rather than calling `print()`. A short coordinator function then composes those helpers step by step.",
      ],
      analogy: "A restaurant kitchen splits prep and plating across separate stations so each cook finishes one clear step and passes a ready plate down the line.",
      realWorldUses: [
        "ETL pipelines splitting `parse_row`, `validate_record`, and `format_summary` into testable pieces",
        "Sharing one `with_tax` or `normalize_name` helper across multiple endpoints without copy-pasting",
      ],
    },
    sections: [
      {
        heading: "Single-Job Helpers & Composing Return Values",
        paragraphs: [
          "Separate math calculation (`to_celsius`) from threshold logic (`weather_label`) and text formatting (`summarize_f`). Returning raw numbers from math helpers lets downstream helpers compare values directly; formatting belongs only at the outer caller.",
        ],
        visual: {
          kind: "compare",
          leftTitle: "Monolith / string-mixing helper",
          rightTitle: "Single-job composable helpers",
          rows: [
            { left: "to_celsius returns '25.0C' string", right: "to_celsius returns float 25.0", highlight: true },
            { left: "weather_label('25.0C') -> TypeError on >= 22", right: "weather_label(25.0) compares numbers directly", highlight: true },
            { left: "Parsing, math, and print() in one 80-line block", right: "Each helper does one job and returns a value" },
          ],
        },
        code: [
          "def to_celsius_broken(f):",
          "    return f\"{(f - 32) * 5 / 9:.1f}C\"   # TRAP: string breaks >= 22 check",
          "",
          "def to_celsius(f):",
          "    return (f - 32) * 5 / 9              # valid -> returns float for reuse",
          "",
          "def weather_label(temp_c):",
          "    return \"Warm\" if temp_c >= 22 else \"Cool\"",
          "",
          "def summarize_f(temp_f):",
          "    c = to_celsius(temp_f)",
          "    return f\"{c:.1f}C ({weather_label(c)})\"",
          "",
          "print(summarize_f(77))",
          "# weather_label(to_celsius_broken(77)) # INVALID -> TypeError: '>=' not supported between 'str' and 'int'",
        ],
        table: {
          caption: "Signs You Should Split a Function Into Helpers",
          headers: ["Symptom", "Refactor"],
          rows: [
            ["Function both parses raw text and computes totals", "Extract `parse_line(...)` helper"],
            ["Same discount math copy-pasted in 2 functions", "Extract shared `with_tax(...)` helper"],
            ["Coordinator mixes math with print formatting", "Keep math pure and format at the outer caller"],
          ],
        },
        output: "25.0C (Warm)",
      },
    ],
    guidedBuildUp: {
      title: "Refactor a Monolith Into 3 Single-Job Helpers",
      steps: [
        {
          label: "Step 1: Everything stuffed into one function",
          explanation: "Average math, grade thresholds, and output formatting live in one tangled block that cannot be tested or reused piece by piece.",
          code: [
            "def report(name, scores):",
            "    avg = sum(scores) / len(scores)",
            "    grade = \"A\" if avg >= 90 else (\"B\" if avg >= 80 else \"C\")",
            "    return f\"{name}: {avg:.1f} ({grade})\"",
            "",
            "print(report(\"Nadia\", [88, 92, 90]))",
          ],
          activeLines: [2, 3, 4],
          output: "Nadia: 90.0 (A)",
        },
        {
          label: "Step 2: Extract `average(scores)` returning a float",
          explanation: "Move the math into `average(scores)` returning a raw `float` so other calculations can reuse it without stripping text.",
          code: [
            "def average(scores):",
            "    return sum(scores) / len(scores)",
            "",
            "def report(name, scores):",
            "    avg = average(scores)",
            "    grade = \"A\" if avg >= 90 else (\"B\" if avg >= 80 else \"C\")",
            "    return f\"{name}: {avg:.1f} ({grade})\"",
            "print(report(\"Nadia\", [88, 92, 90]))",
          ],
          activeLines: [1, 2, 5],
          output: "Nadia: 90.0 (A)",
        },
        {
          label: "Step 3: Extract `letter_grade(avg)` and guard empty input",
          explanation: "With `letter_grade` extracted too, `format_report` guards `[]` up front and composes both helpers.",
          code: [
            "def average(scores):",
            "    return sum(scores) / len(scores)",
            "def letter_grade(avg):",
            "    return \"A\" if avg >= 90 else (\"B\" if avg >= 80 else \"C\")",
            "def format_report(name, scores):",
            "    if not scores:",
            "        return f\"{name}: N/A\"",
            "    avg = average(scores)",
            "    return f\"{name}: {avg:.1f} ({letter_grade(avg)})\"",
            "",
            "print(format_report(\"Nadia\", [88, 92, 90]))",
            "print(format_report(\"Kai\", []))",
          ],
          activeLines: [6, 7, 8, 9],
          output: "Nadia: 90.0 (A)\nKai: N/A",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Data Flowing Through 3 Single-Job Helpers",
      steps: [
        {
          title: "`format_report` starts by passing `scores` to `average`",
          tag: "TRACE",
          explanation: ["`average([88, 92, 90])` sums to `270` and returns `90.0`."],
          code: ["def average(scores):", "    return sum(scores) / len(scores)", "def letter_grade(avg):", "    return \"A\" if avg >= 90 else (\"B\" if avg >= 80 else \"C\")", "def format_report(name, scores):", "    avg = average(scores)", "    grade = letter_grade(avg)", "    return f\"{name}: {avg:.1f} ({grade})\""],
          activeLines: [6, 2],
          state: [{ name: "avg", value: "90.0", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Step 1 computes a raw float from scores without adding text formatting.",
            nodes: [
              { id: "avg", label: "average(scores)", sublabel: "90.0", active: true, tone: "accent" },
              { id: "grd", label: "letter_grade(avg)", sublabel: "waiting" },
              { id: "fmt", label: "format_report()", sublabel: "waiting" },
            ],
            links: [
              { from: "avg", to: "grd" },
              { from: "grd", to: "fmt" },
            ],
          },
        },
        {
          title: "Coordinator passes `avg` into `letter_grade(90.0)`",
          tag: "TRACE",
          explanation: ["`letter_grade(90.0)` applies threshold checks and returns `\"A\"`."],
          code: ["def average(scores):", "    return sum(scores) / len(scores)", "def letter_grade(avg):", "    return \"A\" if avg >= 90 else (\"B\" if avg >= 80 else \"C\")", "def format_report(name, scores):", "    avg = average(scores)", "    grade = letter_grade(avg)", "    return f\"{name}: {avg:.1f} ({grade})\""],
          activeLines: [7, 4],
          state: [{ name: "grade", value: "\"A\"", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Numeric avg passes straight into letter_grade() threshold checks.",
            nodes: [
              { id: "avg", label: "average(scores)", sublabel: "90.0", tone: "ok" },
              { id: "grd", label: "letter_grade(90.0)", sublabel: "'A'", active: true, tone: "accent" },
              { id: "fmt", label: "format_report()", sublabel: "waiting" },
            ],
            links: [
              { from: "avg", to: "grd", label: "90.0", active: true },
              { from: "grd", to: "fmt" },
            ],
          },
        },
        {
          title: "Coordinator formats final output string once at the end",
          tag: "PATTERN",
          explanation: ["Because helpers kept formatting out, `average` can be reused anywhere without stripping strings."],
          code: ["def average(scores):", "    return sum(scores) / len(scores)", "def letter_grade(avg):", "    return \"A\" if avg >= 90 else (\"B\" if avg >= 80 else \"C\")", "def format_report(name, scores):", "    avg = average(scores)", "    grade = letter_grade(avg)", "    return f\"{name}: {avg:.1f} ({grade})\""],
          activeLines: [8],
          state: [{ name: "return", value: "\"Nadia: 90.0 (A)\"", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Only the outer coordinator formats numbers into display text.",
            nodes: [
              { id: "avg", label: "90.0", sublabel: "float", tone: "ok" },
              { id: "grd", label: "'A'", sublabel: "str", tone: "ok" },
              { id: "fmt", label: "format_report", sublabel: "'Nadia: 90.0 (A)'", active: true, tone: "ok" },
            ],
            links: [
              { from: "avg", to: "fmt", active: true },
              { from: "grd", to: "fmt", active: true },
            ],
          },
        },
        {
          title: "Call `format_report` on empty list? Add guard in coordinator/helper",
          tag: "CHECK",
          explanation: ["Small single-job helpers let you isolate empty-list checks in one place."],
          code: ["if not scores:", "    return f\"{name}: N/A\""],
          activeLines: [1, 2],
          state: [{ name: "empty guard", value: "Protected once at top", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "An empty-input guard returns 'Nadia: N/A' immediately before invoking average().",
            nodes: [
              { id: "chk", label: "if not scores:", sublabel: "empty guard", active: true, tone: "warm" },
              { id: "avg", label: "average(scores)", sublabel: "skipped", tone: "muted" },
              { id: "fmt", label: "return 'Nadia: N/A'", sublabel: "safe exit", tone: "ok" },
            ],
            links: [
              { from: "chk", to: "fmt", label: "short-circuit", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Embedding `print()` or formatting inside math helpers",
        detail: "If `average()` returns `\"90.0%\"` instead of `90.0`, `letter_grade(avg)` can no longer compare it numerically.",
      },
      {
        title: "Duplicating cleanup rules across caller branches",
        detail: "Isolate parsing in one helper (`clean_registration`) and call it from every loop.",
      },
    ],
    predictChecks: [
      {
        prompt: "Why should `to_celsius(f)` return a `float` instead of `\"25.0C\"`?",
        code: "def to_celsius(f):\n    return (f - 32) * 5 / 9",
        options: [
          { id: "a", label: "So downstream helpers like `weather_label(c)` can still compare numbers (`c >= 22`)" },
          { id: "b", label: "Python functions cannot return strings" },
          { id: "c", label: "`round()` only works inside `def`" },
        ],
        correctId: "a",
        explanation: "Returning typed numeric results keeps helpers composable in pipelines.",
      },
      {
        prompt: "In `clean_line -> filter_valid -> format_row`, which helper should format currency `$`?",
        code: "# clean -> compute -> format",
        options: [
          { id: "a", label: "`clean_line`" },
          { id: "b", label: "Only `format_row` at the presentation boundary" },
          { id: "c", label: "All three" },
        ],
        correctId: "b",
        explanation: "Keep formatting at the outer presentation boundary so data steps stay pure.",
      },
    ],
    practiceTask: {
      title: "Warmup: Two-Helper Invoice Total",
      tier: "Warmup",
      goal: "Decompose an invoice into `subtotal(prices)` and `with_tax(amount, rate=0.05)`, then return `receipt_line(prices)` as `\"Subtotal: $<s:.2f> | Final: $<f:.2f>\"`.",
      constraints: ["receipt_line must call subtotal and with_tax"],
      examples: [
        { input: "prices = [40, 60]", output: "Subtotal: $100.00 | Final: $105.00" },
        { input: "prices = []", output: "Subtotal: $0.00 | Final: $0.00" },
      ],
      tasks: [
        "Implement `subtotal(prices)` using `sum(prices)`.",
        "Implement `with_tax(amount, rate=0.05)` and wire both inside `receipt_line(prices)`.",
      ],
      starterCode: "# Exercise M05.6 Warmup: two-helper composition\ndef subtotal(prices):\n    return 0\n\ndef with_tax(amount, rate=0.05):\n    return 0.0\n\ndef receipt_line(prices):\n    # TODO: compose subtotal + with_tax\n    return \"\"\n",
      expectedOutput: "Subtotal: $100.00 | Final: $105.00\nSubtotal: $0.00 | Final: $0.00",
      hint: "`sum([])` evaluates to `0` automatically.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "def subtotal(prices):\n    return sum(prices)\n\ndef with_tax(amount, rate=0.05):\n    return amount * (1 + rate)\n\ndef receipt_line(prices):\n    sub = subtotal(prices)\n    final = with_tax(sub)\n    return f\"Subtotal: ${sub:.2f} | Final: ${final:.2f}\"\n\nprint(receipt_line([40, 60]))\nprint(receipt_line([]))",
    },
    practiceChallenges: [
      {
        title: "Core: Average & Grade Pipeline Helpers",
        tier: "Core",
        goal: "Build `average(scores)`, `letter(avg)`, and coordinator `student_summary(name, scores)` returning `\"<name>: N/A\"` if empty else `\"<name>: <avg:.1f> (<grade>)\"`.",
        constraints: ["Grade thresholds: >=90 A, >=80 B, >=70 C, else F"],
        examples: [
          { input: "name = \"Nadia\", scores = [88, 92, 90]", output: "Nadia: 90.0 (A)" },
          { input: "name = \"Kai\", scores = []", output: "Kai: N/A" },
        ],
        tasks: [
          "Return `f\"{name}: N/A\"` when `not scores`.",
          "Compose `average(scores)` and `letter(avg)` inside `student_summary`.",
        ],
        starterCode: "# Exercise M05.6 Core: modular grade summary\ndef average(scores):\n    return sum(scores) / len(scores)\n\ndef letter(avg):\n    return \"F\"\n\ndef student_summary(name, scores):\n    # TODO: guard empty then compose average + letter\n    return \"\"\n",
        expectedOutput: "Nadia: 90.0 (A)\nKai: N/A",
        hint: "Order `letter(avg)` downward from `90` down to `70`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "def average(scores):\n    return sum(scores) / len(scores)\n\ndef letter(avg):\n    if avg >= 90:\n        return \"A\"\n    if avg >= 80:\n        return \"B\"\n    if avg >= 70:\n        return \"C\"\n    return \"F\"\n\ndef student_summary(name, scores):\n    if not scores:\n        return f\"{name}: N/A\"\n    avg = average(scores)\n    return f\"{name}: {avg:.1f} ({letter(avg)})\"\n\nprint(student_summary(\"Nadia\", [88, 92, 90]))\nprint(student_summary(\"Kai\", []))",
      },
      {
        title: "Stretch: Workshop Roster Filter Pipeline",
        tier: "Stretch",
        goal: "Compose `clean_signup(raw)` (returns `\"<Title> (<UPPER>)\"` or `None`) and `build_roster(entries, track=\"ALL\")` (filters invalid rows and optional track match).",
        constraints: ["Case-insensitive track_filter matching"],
        examples: [
          { input: "entries = [\" priya nair , python \", \"bad\", \" tomas , data \"], track = \"python\"", output: "['Priya Nair (PYTHON)']" },
          { input: "entries = [\" priya nair , python \", \" tomas , data \"], track = \"ALL\"", output: "['Priya Nair (PYTHON)', 'Tomas (DATA)']" },
        ],
        tasks: [
          "Delegate single-line validation to `clean_signup(raw)`.",
          "Filter `None` and match `(TRACK)` suffix when `track != \"ALL\"`.",
        ],
        starterCode: "# Exercise M05.6 Stretch: decomposed signup pipeline\ndef clean_signup(raw):\n    # TODO: validate and normalize '<Name> (<TRACK>)'\n    return None\n\ndef build_roster(entries, track=\"ALL\"):\n    # TODO: loop entries calling clean_signup\n    return []\n",
        expectedOutput: "['Priya Nair (PYTHON)']\n['Priya Nair (PYTHON)', 'Tomas (DATA)']",
        hint: "Let `clean_signup` handle commas, trimming, and blank checks so `build_roster` stays short.",
        complexity: { time: "O(n * m)", space: "O(n)" },
        solutionCode:
          "def clean_signup(raw):\n    text = raw.strip()\n    if not text or \",\" not in text:\n        return None\n    name_part, track_part = text.split(\",\", 1)\n    name = \" \".join(name_part.split()).title()\n    track = track_part.strip().upper()\n    if not name or not track:\n        return None\n    return f\"{name} ({track})\"\n\ndef build_roster(entries, track=\"ALL\"):\n    out = []\n    for row in entries:\n        cleaned = clean_signup(row)\n        if cleaned is None:\n            continue\n        if track != \"ALL\" and f\"({track.upper()})\" not in cleaned:\n            continue\n        out.append(cleaned)\n    return out\n\nprint(build_roster([\" priya nair , python \", \"bad\", \" tomas , data \"], track=\"python\"))\nprint(build_roster([\" priya nair , python \", \" tomas , data \"], track=\"ALL\"))",
      },
    ],
  },

  "py-recursion-basics": {
    lessonId: "py-recursion-basics",
    subtitle: "Solve self-similar problems using base cases, shrinking recursive steps, and call-stack unwinding.",
    intro: {
      heading: "Self-Calls With a Base Case and Shrinking Step",
      explanation: [
        "Calling a function inside itself without a stopping condition—or stepping the wrong way with `n + 1`—stacks active frames until Python crashes with `RecursionError: maximum recursion depth exceeded` around depth 1000. On flat lists, recursion also burns extra stack memory where a `for` loop finishes faster.",
        "Recursion fits problems that contain smaller copies of themselves, like `factorial(4) = 4 * factorial(3)` or nested folders of unknown depth. Every working recursive function pairs a base case that returns right away (`if n <= 1: return 1`) with a recursive step that moves strictly closer to it.",
      ],
      analogy: "Opening Russian nesting dolls works one layer at a time: each doll opens to reveal a smaller doll inside until you hit the solid tiny doll that stops the sequence.",
      realWorldUses: [
        "Walking nested directory trees, JSON objects, or comment threads of arbitrary depth",
        "Divide-and-conquer algorithms like merge sort, quicksort, and binary tree traversal",
      ],
    },
    sections: [
      {
        heading: "Base Case, Recursive Step & Stack Unwinding",
        paragraphs: [
          "Without a reachable base case, nested frames keep piling up until Python raises `RecursionError: maximum recursion depth exceeded`.",
        ],
        visual: {
          kind: "loop-stepper",
          caption: "Watch factorial(3) push frames down to base case factorial(1), then multiply back up to 6",
          code: [
            "def factorial(n):",
            "    if n <= 1:",
            "        return 1",
            "    return n * factorial(n - 1)",
            "",
            "print(factorial(3))",
          ],
          iterations: [
            {
              label: "Call factorial(3)",
              activeLine: 4,
              vars: [{ name: "n", value: "3", changed: true }],
              output: "",
              status: "3 <= 1 False -> waits for factorial(2)",
              callStack: [
                { fn: "<module>", line: 6, status: "suspended" },
                { fn: "factorial(3)", line: 4, status: "active" },
              ],
            },
            {
              label: "Call factorial(2)",
              activeLine: 4,
              vars: [{ name: "n", value: "2", changed: true }],
              output: "",
              status: "2 <= 1 False -> waits for factorial(1)",
              callStack: [
                { fn: "<module>", line: 6, status: "suspended" },
                { fn: "factorial(3)", line: 4, status: "suspended" },
                { fn: "factorial(2)", line: 4, status: "active" },
              ],
            },
            {
              label: "Base Case (n=1)",
              activeLine: 3,
              vars: [{ name: "n", value: "1", changed: true }],
              output: "",
              status: "1 <= 1 True -> returns 1 right away",
              callStack: [
                { fn: "<module>", line: 6, status: "suspended" },
                { fn: "factorial(3)", line: 4, status: "suspended" },
                { fn: "factorial(2)", line: 4, status: "suspended" },
                { fn: "factorial(1)", line: 3, status: "unwinding" },
              ],
            },
            {
              label: "Unwind to 2",
              activeLine: 4,
              vars: [{ name: "n", value: "2" }, { name: "returns", value: "2 * 1 = 2", changed: true }],
              output: "",
              status: "factorial(2) returns 2 to factorial(3)",
              callStack: [
                { fn: "<module>", line: 6, status: "suspended" },
                { fn: "factorial(3)", line: 4, status: "suspended" },
                { fn: "factorial(2)", line: 4, status: "unwinding" },
              ],
            },
            {
              label: "Result 6",
              activeLine: 6,
              vars: [{ name: "result", value: "3 * 2 = 6", changed: true }],
              output: "6",
              status: "factorial(3) returns 6",
              callStack: [{ fn: "<module>", line: 6, status: "active" }],
            },
          ],
        },
        table: {
          caption: "Loops vs Recursion",
          headers: ["Technique", "Strength", "Trade-Off"],
          rows: [
            ["`for` / `while` loop", "Flat sequences, totals, retries", "Zero stack depth limit, fastest in Python"],
            ["Recursion", "Trees, nested lists/folders, divide-and-conquer", "Uses `O(depth)` stack frames (capped ~1000)"],
          ],
        },
        code: [
          "def factorial(n):",
          "    if n <= 1:",
          "        return 1                  # valid base case stops chain",
          "    return n * factorial(n - 1)   # valid step shrinks toward 1",
          "",
          "# def forever(n):",
          "#     return forever(n + 1)       # INVALID -> RecursionError (no reachable base case)",
          "",
          "print(factorial(4))",
        ],
        output: "24",
      },
      {
        heading: "Two-Phase Dry-Run Trace: Going Down vs Coming Back Up",
        paragraphs: [
          "Tracing recursion on paper splits into two phases. Going down, each call pauses at `n * factorial(n - 1)` and stacks a new frame until `n <= 1` hits the base case.",
          "Coming back up, each paused frame receives the inner return value, finishes its waiting multiplication, and hands the product back to its caller.",
        ],
        table: {
          caption: "Dry-Run Trace of factorial(3): Going Down (Push) vs Coming Back Up (Unwind)",
          headers: ["Step", "Phase", "Active Call", "Check n <= 1", "Waiting Expression / Return"],
          rows: [
            ["1", "Going down", "`factorial(3)`", "`False` (`3 > 1`)", "Pauses at `3 * factorial(2)`"],
            ["2", "Going down", "`factorial(2)`", "`False` (`2 > 1`)", "Pauses at `2 * factorial(1)`"],
            ["3", "Base case", "`factorial(1)`", "`True` (`1 <= 1`)", "Stops calls -> returns `1`"],
            ["4", "Coming back up", "`factorial(2)`", "Resumes", "Computes `2 * 1` -> returns `2`"],
            ["5", "Coming back up", "`factorial(3)`", "Resumes", "Computes `3 * 2` -> returns `6`"],
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Recursive Sum With Base Case Protection",
      steps: [
        {
          label: "Step 1: Missing base case crashes with `RecursionError`",
          explanation: "Without an `if` stop condition, `sum_to(n - 1)` keeps calling `0`, `-1`, `-2`, ... until Python's ~1000-frame limit blows up.",
          code: [
            "def sum_to(n):",
            "    return n + sum_to(n - 1)",
            "",
            "print(sum_to(3))",
          ],
          activeLines: [2, 4],
          output: "RecursionError: maximum recursion depth exceeded",
        },
        {
          label: "Step 2: Add base case `if n <= 0: return 0`",
          explanation: "Checking `n <= 0` at the top stops recursion on `0` (or negative inputs) and hands `0` back to the caller.",
          code: [
            "def sum_to(n):",
            "    if n <= 0:",
            "        return 0",
            "    return n + sum_to(n - 1)",
            "",
            "print(sum_to(0))",
          ],
          activeLines: [2, 3, 6],
          output: "0",
        },
        {
          label: "Step 3: Trace both phases on `sum_to(3)`",
          explanation: "`sum_to(3)` pauses down to `sum_to(0)` (`0`), then adds back up `1 + 0 = 1`, `2 + 1 = 3`, `3 + 3 = 6`.",
          code: [
            "def sum_to(n):",
            "    if n <= 0:",
            "        return 0",
            "    return n + sum_to(n - 1)",
            "",
            "print(sum_to(3))",
            "print(sum_to(0))",
          ],
          activeLines: [4, 6, 7],
          output: "6\n0",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `factorial(3)` Call-Stack Push and Unwind",
      steps: [
        {
          title: "`factorial(3)` pauses and pushes `factorial(2)`",
          tag: "TRACE",
          explanation: ["`3 <= 1` is `False`, so `factorial(3)` suspends waiting on `factorial(2)`."],
          code: [
            "def factorial(n):",
            "    if n <= 1: return 1",
            "    return n * factorial(n - 1)",
            "print(factorial(3))",
          ],
          activeLines: [3],
          state: [{ name: "call", value: "factorial(3)", changed: true }, { name: "waiting_for", value: "3 * factorial(2)", changed: true }],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack",
            caption: "factorial(3) stays suspended while factorial(2) sits on top waiting on factorial(1).",
            items: [
              { id: "f3", label: "factorial(3)", sub: "paused: 3 * ?", state: "default" },
              { id: "f2", label: "factorial(2)", sub: "paused: 2 * ?", state: "active" },
            ],
          },
        },
        {
          title: "`factorial(1)` reaches Base Case and returns `1`",
          tag: "CHECK",
          explanation: ["`1 <= 1` is `True`, so `factorial(1)` returns `1` without another call."],
          code: [
            "def factorial(n):",
            "    if n <= 1: return 1",
            "    return n * factorial(n - 1)",
            "print(factorial(3))",
          ],
          activeLines: [2],
          state: [{ name: "call", value: "factorial(1)", changed: true }, { name: "returns", value: "1", changed: true }],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack",
            caption: "Base case reached with 3 frames stacked; top frame factorial(1) returns 1.",
            items: [
              { id: "f3", label: "factorial(3)", sub: "waiting", state: "default" },
              { id: "f2", label: "factorial(2)", sub: "waiting", state: "default" },
              { id: "f1", label: "factorial(1)", sub: "base case -> 1", state: "done" },
            ],
          },
        },
        {
          title: "Suspended frames unwind (`2 * 1 = 2`, then `3 * 2 = 6`)",
          tag: "TRACE",
          explanation: ["Answers multiply backward down the stack as frames pop."],
          code: [
            "def factorial(n):",
            "    if n <= 1: return 1",
            "    return n * factorial(n - 1)",
            "print(factorial(3))",
          ],
          activeLines: [3, 4],
          output: "6",
          state: [{ name: "factorial(2)", value: "2", changed: true }, { name: "factorial(3)", value: "6", changed: true }],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Call Stack",
            caption: "Frames unwind and pop off the top: 2 * 1 = 2, returning 3 * 2 = 6.",
            items: [
              { id: "f3", label: "factorial(3)", sub: "3 * 2 -> returns 6", state: "done" },
              { id: "f2", label: "factorial(2)", sub: "popped -> 2", state: "dim" },
            ],
          },
        },
        {
          title: "Missing base case causes `RecursionError`",
          tag: "PITFALL",
          explanation: ["Forgetting `if n <= 1:` or stepping `n + 1` instead of `n - 1` overflows Python's frame cap."],
          code: [
            "def forever(n):",
            "    return forever(n + 1)  # no shrinking base case!",
            "# forever(1) -> RecursionError",
          ],
          activeLines: [2],
          state: [{ name: "error", value: "RecursionError (~1000 depth)", changed: true }],
          visual: {
            kind: "dsa-structure",
            mode: "stack",
            title: "Runaway Call Stack",
            caption: "Without a shrinking step toward a base case, stack frames overflow at ~1000 calls.",
            items: [
              { id: "r1", label: "forever(1)", state: "default" },
              { id: "r2", label: "forever(2)", state: "default" },
              { id: "rdots", label: "...", sub: "no base case", state: "dim" },
              { id: "rerr", label: "RecursionError", sub: "max depth ~1000", state: "active" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Missing base case or diverging step (`RecursionError`)",
        detail: "Always prove every recursive branch reduces the argument strictly toward the base case.",
      },
      {
        title: "Choosing recursion for simple flat loops",
        detail: "Use `for`/`while` loops for plain linear totals and reserve recursion for nested trees.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `countdown(3)` print?",
        code: "def countdown(n):\n    if n == 0:\n        print(\"Go!\")\n        return\n    print(n)\n    countdown(n - 1)",
        options: [
          { id: "a", label: "`3`, `2`, `1`, `Go!`" },
          { id: "b", label: "`Go!`, `1`, `2`, `3`" },
          { id: "c", label: "Infinite recursion" },
        ],
        correctId: "a",
        explanation: "`print(n)` executes before descending into `countdown(n - 1)`.",
      },
      {
        prompt: "What happens if `forever(1)` calls `forever(n + 1)` without hitting a base case?",
        code: "def forever(n):\n    return forever(n + 1)\nforever(1)",
        options: [
          { id: "a", label: "Returns `None`" },
          { id: "b", label: "`RecursionError`" },
          { id: "c", label: "Stops automatically at `100`" },
        ],
        correctId: "b",
        explanation: "Python halts runaway stack growth around depth `1000` with `RecursionError`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Recursive `sum_to(n)`",
      tier: "Warmup",
      goal: "Compute `1 + 2 + ... + n` recursively (`0` when `n <= 0`), without loops or `sum()`.",
      constraints: ["Must use recursion with a base case n <= 0"],
      examples: [
        { input: "n = 4", output: "10" },
        { input: "n = 0", output: "0" },
      ],
      tasks: [
        "Return `0` when `n <= 0`.",
        "Otherwise return `n + sum_to(n - 1)`.",
      ],
      starterCode: "# Exercise M05.7 Warmup: linear recursion sum\ndef sum_to(n):\n    # TODO: base case n <= 0 + recursive step\n    return 0\n",
      expectedOutput: "10\n0",
      hint: "Shrink `n` by 1 each call so `sum_to(0)` is guaranteed.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "def sum_to(n):\n    if n <= 0:\n        return 0\n    return n + sum_to(n - 1)\n\nprint(sum_to(4))\nprint(sum_to(0))",
    },
    practiceChallenges: [
      {
        title: "Core: Recursive Power (`fast_pow` / `power_rec`)",
        tier: "Core",
        goal: "Compute integer `base ** exp` recursively without `**` or loops (`exp >= 0`, returning `1` when `exp == 0`).",
        constraints: ["exp >= 0", "Do not use ** or loops"],
        examples: [
          { input: "base = 2, exp = 5", output: "32" },
          { input: "base = 9, exp = 0", output: "1" },
        ],
        tasks: [
          "Return `1` when `exp == 0`.",
          "Return `base * power_rec(base, exp - 1)`.",
        ],
        starterCode: "# Exercise M05.7 Core: recursive exponentiation\ndef power_rec(base, exp):\n    # TODO: base case exp == 0 -> 1\n    return 1\n",
        expectedOutput: "32\n1",
        hint: "Every number to the `0` power equals `1`.",
        complexity: { time: "O(exp)", space: "O(exp)" },
        solutionCode:
          "def power_rec(base, exp):\n    if exp == 0:\n        return 1\n    return base * power_rec(base, exp - 1)\n\nprint(power_rec(2, 5))\nprint(power_rec(9, 0))",
      },
      {
        title: "Stretch: Recursive Nested-List Integer Sum",
        tier: "Stretch",
        goal: "Sum every integer inside an arbitrarily nested list `data` (for example `[1, [2, [3, 4]], 5]`) using `isinstance(x, list)` (returns `True` if `x` is a `list`, `False` otherwise) to recurse into sublists.",
        constraints: ["Handle empty sublists []"],
        examples: [
          { input: "data = [1, [2, [3, 4]], 5]", output: "15" },
          { input: "data = [[], [[]]]", output: "0" },
        ],
        tasks: [
          "Initialize `total = 0` inside `sum_nested(data)`.",
          "For each item: test `isinstance(item, list)`; if `True`, add `sum_nested(item)`, else add `item`.",
        ],
        starterCode: "# Exercise M05.7 Stretch: arbitrary-depth nested list sum\ndef sum_nested(data):\n    # TODO: sum ints recursively via isinstance(x, list)\n    return 0\n",
        expectedOutput: "15\n0",
        hint: "`isinstance(item, list)` checks whether `item` is a nested list (`True`) vs a plain number (`False`).",
        complexity: { time: "O(elements)", space: "O(depth)" },
        solutionCode:
          "def sum_nested(data):\n    total = 0\n    for item in data:\n        if isinstance(item, list):\n            total += sum_nested(item)\n        else:\n            total += item\n    return total\n\nprint(sum_nested([1, [2, [3, 4]], 5]))\nprint(sum_nested([[], [[]]]))",
      },
    ],
  },
};

export const m05Quiz: ModuleQuiz = {
  moduleId: "py-m5",
  title: "Module 05 Quiz · Functions & Problem Solving",
  description: "10 questions on `def`, `return` vs `print`, defaults, guard clauses, LEGB scope, decomposition, and recursion.",
  questions: [
    {
      id: "m5-q1",
      prompt: "When does the body inside `def hello():` run?",
      code: "def hello():\n    print(\"Hi\")",
      options: [
        { id: "a", label: "Only when `hello()` is called later" },
        { id: "b", label: "As soon as Python reads the `def` line" },
        { id: "c", label: "Twice automatically" },
      ],
      correctId: "a",
      explanation: "`def` stores the function definition; parentheses `hello()` execute it.",
      lessonRefId: "py-functions-intro",
    },
    {
      id: "m5-q2",
      prompt: "In `def power(base, exp):`, what are `base` and `exp` called?",
      options: [
        { id: "a", label: "Keywords only" },
        { id: "b", label: "Global constants" },
        { id: "c", label: "Parameters" },
      ],
      correctId: "c",
      explanation: "Placeholders inside a `def` header are parameters; values supplied in a call are arguments.",
      lessonRefId: "py-functions-intro",
    },
    {
      id: "m5-q3",
      prompt: "What does `x = square(3)` set `x` to if `def square(n): print(n * n)` has no `return`?",
      options: [
        { id: "a", label: "`9`" },
        { id: "b", label: "`None`" },
        { id: "c", label: "`3`" },
      ],
      correctId: "b",
      explanation: "Printing writes to the terminal, while the function returns `None`.",
      lessonRefId: "py-return-vs-print",
    },
    {
      id: "m5-q4",
      prompt: "What prints when `early(5)` runs?",
      code: "def early(n):\n    return n + 1\n    print(\"After return\")\n\nprint(early(5))",
      options: [
        { id: "a", label: "`6` only" },
        { id: "b", label: "`After return` then `6`" },
        { id: "c", label: "`None`" },
      ],
      correctId: "a",
      explanation: "`return n + 1` exits the function immediately, so lines after it never run.",
      lessonRefId: "py-return-vs-print",
    },
    {
      id: "m5-q5",
      prompt: "Which `def` signature is VALID in Python?",
      options: [
        { id: "a", label: "`def send(msg=\"ok\", to):`" },
        { id: "b", label: "`def send(to, msg=\"ok\"):`" },
        { id: "c", label: "Both" },
      ],
      correctId: "b",
      explanation: "Required parameters must sit before optional parameters with `=` defaults.",
      lessonRefId: "py-default-keyword-args",
    },
    {
      id: "m5-q6",
      prompt: "Why use guard clauses (`if invalid: return False`) near the top of a function?",
      options: [
        { id: "a", label: "Python requires `return` on line 2" },
        { id: "b", label: "They automatically save variables globally" },
        { id: "c", label: "They exit invalid edge cases early and keep main code flat and readable" },
      ],
      correctId: "c",
      explanation: "Early returns reduce nesting and isolate validation up front.",
      lessonRefId: "py-guard-clauses",
    },
    {
      id: "m5-q7",
      prompt: "Why does `print(secret)` fail outside `make()` after `secret = 7` is assigned inside `make()`?",
      options: [
        { id: "a", label: "`secret` is local to `make()` and disappears after `make()` returns" },
        { id: "b", label: "Numbers cannot be printed outside functions" },
        { id: "c", label: "`make()` must be called twice" },
      ],
      correctId: "a",
      explanation: "Local variables live strictly inside the active call frame.",
      lessonRefId: "py-scope-basics",
    },
    {
      id: "m5-q8",
      prompt: "When decomposing `average(scores)` and `format_report(name, scores)`, why keep formatting out of `average`?",
      options: [
        { id: "a", label: "Functions cannot return formatted strings" },
        { id: "b", label: "Returning a numeric float keeps `average` reusable in downstream comparisons and formulas" },
        { id: "c", label: "Printing inside helpers slows down `sum()`" },
      ],
      correctId: "b",
      explanation: "Keeping helpers focused on pure numbers or values makes them easy to test and reuse.",
      lessonRefId: "py-decomposition",
    },
    {
      id: "m5-q9",
      prompt: "What stops a recursive function from calling itself forever?",
      options: [
        { id: "a", label: "Indenting `def` twice" },
        { id: "b", label: "A `break` statement" },
        { id: "c", label: "A base case returning without another self-call" },
      ],
      correctId: "c",
      explanation: "Every recursion needs a stopping base case and steps moving toward it.",
      lessonRefId: "py-recursion-basics",
    },
    {
      id: "m5-q10",
      prompt: "What does `sum_down(3)` return?",
      code: "def sum_down(n):\n    if n <= 0:\n        return 0\n    return n + sum_down(n - 1)",
      options: [
        { id: "a", label: "`3`" },
        { id: "b", label: "`6`" },
        { id: "c", label: "`0`" },
      ],
      correctId: "b",
      explanation: "`3 + 2 + 1 + 0 = 6`.",
      lessonRefId: "py-recursion-basics",
    },
  ],
};

export const m05PracticeSet: ModulePracticeSet = {
  moduleId: "py-m5",
  title: "Module 05 Practice Set: Functions, Guards, Scope & Recursion",
  description:
    "Four exercises combining default/keyword parameters, flat guard validation, decomposed helper functions, and recursive nested traversal.",
  problems: [
    {
      id: "py-m5-p1",
      title: "Safe Order Quote With Keyword Options",
      patternHint: "Use guard clauses at the top for invalid qty/price, then apply optional express & discount defaults.",
      lessonRefId: "py-default-keyword-args",
      goal: "Write `order_quote(price, qty=1, discount=0.0, express=False)` returning `None` if `price <= 0 or qty <= 0`, else rounded total (`price * qty * (1 - discount) + (12 if express else 0)`).",
      constraints: ["Express defaults to False", "Returns float rounded to 2 decimals or None"],
      examples: [
        { input: "price = 40, qty = 2, discount = 0.25, express = True", output: "72.0" },
        { input: "price = 0, qty = 3", output: "None" },
      ],
      tasks: [
        "Guard `price <= 0 or qty <= 0` first returning `None`.",
        "Return `round(price * qty * (1 - discount) + (12 if express else 0), 2)`.",
      ],
      starterCode: "# Practice M05.1: guarded defaults quote\ndef order_quote(price, qty=1, discount=0.0, express=False):\n    # TODO: guard invalid inputs then compute quote\n    return None\n",
      expectedOutput: "72.0\nNone",
      hint: "Both `price <= 0` and `qty <= 0` must exit before math.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "def order_quote(price, qty=1, discount=0.0, express=False):\n    if price <= 0 or qty <= 0:\n        return None\n    total = price * qty * (1 - discount) + (12 if express else 0)\n    return round(total, 2)\n\nprint(order_quote(40, 2, 0.25, True))\nprint(order_quote(0, 3))",
    },
    {
      id: "py-m5-p2",
      title: "Pure Helper Normalization Pipeline",
      patternHint: "Split line cleaning from list filtering so neither helper mixes responsibilities.",
      lessonRefId: "py-decomposition",
      goal: "Keep only non-empty comma-joined `name, score` strings whose numeric score is `>= min_score`, formatting `\"<Title Name>: <score>\"`.",
      constraints: ["Ignore blank lines or missing comma"],
      examples: [
        { input: "lines = [\" ada , 92 \", \"bad\", \"sam , 55\"], min_score = 70", output: "['Ada: 92']" },
        { input: "lines = [\"\"], min_score = 0", output: "[]" },
      ],
      tasks: [
        "Define a small parser helper returning `(name, int(score))` or `None`.",
        "Collect formatted passing rows in the outer coordinator.",
      ],
      starterCode: "# Practice M05.2: decomposed score line pipeline\ndef parse_row(line):\n    return None\n\ndef passing_rows(lines, min_score=60):\n    # TODO: use parse_row and filter >= min_score\n    return []\n",
      expectedOutput: "['Ada: 92']\n[]",
      hint: "Strip whitespace around both `name` and `score` tokens.",
      complexity: { time: "O(n * m)", space: "O(n)" },
      solutionCode:
        "def parse_row(line):\n    text = line.strip()\n    if not text or \",\" not in text:\n        return None\n    name_part, score_part = text.split(\",\", 1)\n    name = \" \".join(name_part.split()).title()\n    s_txt = score_part.strip()\n    if not name or not s_txt:\n        return None\n    return (name, int(s_txt))\n\ndef passing_rows(lines, min_score=60):\n    kept = []\n    for row in lines:\n        parsed = parse_row(row)\n        if parsed is None:\n            continue\n        name, score = parsed\n        if score >= min_score:\n            kept.append(f\"{name}: {score}\")\n    return kept\n\nprint(passing_rows([\" ada , 92 \", \"bad\", \"sam , 55\"], 70))\nprint(passing_rows([\"\"], 0))",
    },
    {
      id: "py-m5-p3",
      title: "Pure Function State Transition (No Globals)",
      patternHint: "Pass state in as an argument and return the updated value without global mutation.",
      lessonRefId: "py-scope-basics",
      goal: "Process a list of operations `[(\"+\", 10), (\"*\", 3), (\"-\", 5)]` starting from `initial`, returning the final integer.",
      constraints: ["No global variables"],
      examples: [
        { input: "initial = 5, ops = [(\"+\", 10), (\"*\", 3), (\"-\", 5)]", output: "40" },
        { input: "initial = 7, ops = []", output: "7" },
      ],
      tasks: [
        "Track `val = initial` strictly inside `apply_ops`.",
        "Update `val` per `(op, num)` pair (`+`, `-`, `*`) and return `val`.",
      ],
      starterCode: "# Practice M05.3: pure local accumulator helper\ndef apply_ops(initial, ops):\n    # TODO: apply ('+', v), ('-', v), ('*', v) locally\n    return initial\n",
      expectedOutput: "40\n7",
      hint: "Unpack `for op, num in ops:` and branch with `if / elif`.",
      complexity: { time: "O(n)", space: "O(1)" },
      solutionCode:
        "def apply_ops(initial, ops):\n    val = initial\n    for op, num in ops:\n        if op == \"+\":\n            val += num\n        elif op == \"-\":\n            val -= num\n        elif op == \"*\":\n            val *= num\n    return val\n\nprint(apply_ops(5, [(\"+\", 10), (\"*\", 3), (\"-\", 5)]))\nprint(apply_ops(7, []))",
    },
    {
      id: "py-m5-p4",
      title: "Recursive Flatten & Count Leaves",
      patternHint: "Use isinstance(x, list) to recurse on nested lists and count 1 per scalar element.",
      lessonRefId: "py-recursion-basics",
      goal: "Count total non-list leaf values across any arbitrary nesting depth of `tree`.",
      constraints: ["Empty sublists contribute 0 leaves"],
      examples: [
        { input: "tree = [1, [2, [3, 4]], [], 5]", output: "5" },
        { input: "tree = [[]]", output: "0" },
      ],
      tasks: [
        "Initialize `count = 0`.",
        "Recurse on `isinstance(item, list)`, else increment `count += 1`.",
      ],
      starterCode: "# Practice M05.4: recursive leaf counter\ndef count_leaves(tree):\n    # TODO: count non-list elements across nested lists\n    return 0\n",
      expectedOutput: "5\n0",
      hint: "Base case happens naturally when a sublist is empty `[]` or holds only scalars.",
      complexity: { time: "O(elements)", space: "O(depth)" },
      solutionCode:
        "def count_leaves(tree):\n    count = 0\n    for item in tree:\n        if isinstance(item, list):\n            count += count_leaves(item)\n        else:\n            count += 1\n    return count\n\nprint(count_leaves([1, [2, [3, 4]], [], 5]))\nprint(count_leaves([[]]))",
    },
  ],
};
