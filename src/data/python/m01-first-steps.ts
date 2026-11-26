import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m01Lessons: Record<string, LessonContent> = {
  "py-hello-print": {
    lessonId: "py-hello-print",
    subtitle: "Write your first working `.py` scripts using `print()`, quotes vs numbers, `sep=` / `end=` options, and `#` comments.",
    intro: {
      heading: "Printing Output & Writing Readable Lines",
      explanation: [
        "A `.py` script can calculate `10 + 5` in memory and display nothing in your terminal until you pass it to `print(...)`. Wrapping `\"10 + 5\"` in quotes prints the literal characters instead of `15`.",
        "Python reads a `.py` file top to bottom, one instruction per line, while `#` adds plain-English notes for human readers that Python skips.",
      ],
      analogy:
        "A `.py` file acts like a numbered recipe card: Python reads each line from top to bottom, `print()` speaks a result aloud into your terminal, and `#` notes are pencil margin reminders the cook skips.",
      realWorldUses: [
        "Printing labeled status lines, calculated totals, and date stamps (`sep=\"-\"`) in terminal scripts",
        "Writing `#` comments to document why a formula, tax rate, or edge-case rule exists",
      ],
    },
    sections: [
      {
        heading: "Top-to-Bottom Execution & `print()`",
        paragraphs: [
          "A Python program is a plain list of instructions saved inside a `.py` file (such as `hello.py`). When you press Run, Python executes your file from the top line downward, one line at a time.",
          "Your first instruction is `print(...)`. Everything inside the parentheses appears in your terminal window.",
        ],
        code: [
          "print(\"Hello, world!\")",
          "print(\"Welcome to Python.\")",
        ],
        output: "Hello, world!\nWelcome to Python.",
      },
      {
        heading: "Strings vs Numbers",
        paragraphs: [
          "`\"Hello, world!\"` has quotes around it. Quotes tell Python: treat these characters literally as text (**string**). Single quotes `'...'` and double quotes `\"...\"` both work, as long as both ends match.",
          "Numbers like `42` or `3.5` have no quotes. Writing `\"42\"` makes text characters `4` and `2`, whereas `42` is a real numeric value Python can add, subtract, or multiply.",
        ],
        code: [
          "print(\"Python version:\")",
          "print(3)",
          "print(10 + 5)",
          "print(\"10 + 5\")",
        ],
        output: "Python version:\n3\n15\n10 + 5",
        callout: {
          kind: "KEY IDEA",
          text: "`\"10 + 5\"` inside quotes prints literally as text. `10 + 5` without quotes tells Python to calculate `15` first, then print it.",
        },
      },
      {
        heading: "Print Arguments (`sep=`, `end=`) & `#` Comments",
        paragraphs: [
          "Separating items with commas inside `print(...)` joins them with one space by default. Passing `sep=\"-\"` changes the separator between items, and passing `end=\" \"` keeps the next `print()` on the same line instead of starting a new line.",
          "Any text starting with `#` is a **comment** for human readers. Python skips comments completely when running code.",
        ],
        table: {
          caption: "Common `print()` Options & Comments (`#`)",
          headers: ["Syntax", "What It Does", "Example", "Real-Life Use"],
          rows: [
            ["`print(a, b)`", "Prints items separated by a space, then starts a new line", "`print(\"Age:\", 20)` -> `Age: 20`", "Daily"],
            ["`sep=\"...\"`", "Customizes the separator between comma items", "`print(2026, 11, 24, sep=\"-\")` -> `2026-11-24`", "Situational (dates, CSV rows)"],
            ["`end=\"...\"`", "Replaces the trailing newline at the end", "`print(\"Loading\", end=\"...\")`", "Situational (progress bars, grids)"],
            ["`# comment`", "Ignored by Python; explains *why* to humans", "`# Tax rate for 2026`", "Daily"],
          ],
          highlightCol: 3,
        },
        code: [
          "# Show a formatted receipt row",
          "print(\"Apples:\", 4, \"Price:\", 120)",
          "print(2026, 11, 24, sep=\"-\")",
          "print(\"Loading\", end=\"...\")",
          "print(\"Done!\")",
        ],
        output: "Apples: 4 Price: 120\n2026-11-24\nLoading...Done!",
      },
    ],
    guidedBuildUp: {
      title: "Build a 3-Line Receipt Script Step by Step",
      subtitle: "Click through each step to see how one small `.py` file grows line by line.",
      steps: [
        {
          label: "Header comment + banner",
          explanation: "Start with a `#` comment noting the script goal, then print a clear header banner.",
          code: [
            "# Store receipt card",
            "print(\"=== RECEIPT ===\")",
          ],
          activeLines: [1, 2],
          output: "=== RECEIPT ===",
        },
        {
          label: "Add calculation line",
          explanation: "Pass label text in quotes, comma, and let Python compute `3 * 15` right inside `print()`.",
          code: [
            "# Store receipt card",
            "print(\"=== RECEIPT ===\")",
            "print(\"Apples total:\", 3 * 15)",
          ],
          activeLines: [3],
          output: "=== RECEIPT ===\nApples total: 45",
        },
        {
          label: "Format date with `sep=`",
          explanation: "Use `sep=\"-\"` on year, month, and day to print a hyphenated date on the final line.",
          code: [
            "# Store receipt card",
            "print(\"=== RECEIPT ===\")",
            "print(\"Apples total:\", 3 * 15)",
            "print(2026, 11, 24, sep=\"-\")",
          ],
          activeLines: [4],
          output: "=== RECEIPT ===\nApples total: 45\n2026-11-24",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Python Running Top-to-Bottom",
      steps: [
        {
          title: "Line 1 is skipped because it starts with `#`",
          tag: "TRACE",
          explanation: [
            "Python checks line 1, sees `#`, and moves straight on without displaying anything.",
          ],
          code: ["# First greeting script", "print(\"Step 1\")", "print(\"Step 2\", 10 + 2)", "print(2026, 11, 24, sep=\"-\")"],
          activeLines: [1],
          visual: {
            kind: "pipeline",
            caption: "Line 1 is skipped as a comment before Line 2 runs.",
            nodes: [
              { id: "l1", label: "Line 1", sublabel: "# comment (skip)", active: true, tone: "warm" },
              { id: "l2", label: "Line 2", sublabel: "print('Step 1')" },
              { id: "l3", label: "Line 3", sublabel: "eval 10 + 2" },
              { id: "l4", label: "Line 4", sublabel: "sep='-'" },
            ],
            links: [
              { from: "l1", to: "l2" },
              { from: "l2", to: "l3" },
              { from: "l3", to: "l4" },
            ],
          },
        },
        {
          title: "Line 2 displays `Step 1`",
          tag: "TRACE",
          explanation: [
            "Next, Python runs line 2 and sends `Step 1` to the terminal window.",
          ],
          code: ["# First greeting script", "print(\"Step 1\")", "print(\"Step 2\", 10 + 2)", "print(2026, 11, 24, sep=\"-\")"],
          activeLines: [2],
          output: "Step 1",
          visual: {
            kind: "pipeline",
            caption: "Line 2 sends 'Step 1' to stdout and advances to a new line.",
            nodes: [
              { id: "l1", label: "Line 1", sublabel: "skipped" },
              { id: "l2", label: "Line 2", sublabel: "stdout: Step 1", active: true, tone: "ok" },
              { id: "l3", label: "Line 3", sublabel: "eval 10 + 2" },
              { id: "l4", label: "Line 4", sublabel: "sep='-'" },
            ],
            links: [
              { from: "l1", to: "l2", active: true },
              { from: "l2", to: "l3" },
              { from: "l3", to: "l4" },
            ],
          },
        },
        {
          title: "Line 3 calculates `10 + 2` first, then prints both items",
          tag: "TRACE",
          explanation: [
            "Inside `print(\"Step 2\", 10 + 2)`, Python calculates `10 + 2` (`12`) before displaying both separated by a space.",
          ],
          code: ["# First greeting script", "print(\"Step 1\")", "print(\"Step 2\", 10 + 2)", "print(2026, 11, 24, sep=\"-\")"],
          activeLines: [3],
          state: [{ name: "Evaluated", value: "10 + 2 -> 12", changed: true }],
          output: "Step 1\nStep 2 12",
          visual: {
            kind: "pipeline",
            caption: "Python evaluates 10 + 2 to 12 before printing both arguments.",
            nodes: [
              { id: "l1", label: "Line 1", sublabel: "skipped" },
              { id: "l2", label: "Line 2", sublabel: "Step 1", tone: "ok" },
              { id: "l3", label: "Line 3", sublabel: "10+2 -> 12", active: true, tone: "accent" },
              { id: "l4", label: "Line 4", sublabel: "sep='-'" },
            ],
            links: [
              { from: "l1", to: "l2" },
              { from: "l2", to: "l3", active: true },
              { from: "l3", to: "l4" },
            ],
          },
        },
        {
          title: "Line 4 swaps the default space for `sep=\"-\"`",
          tag: "PATTERN",
          explanation: [
            "Passing `sep=\"-\"` joins all comma-separated arguments on line 4 with `-` instead of a blank space.",
          ],
          code: ["# First greeting script", "print(\"Step 1\")", "print(\"Step 2\", 10 + 2)", "print(2026, 11, 24, sep=\"-\")"],
          activeLines: [4],
          state: [{ name: "sep", value: "\"-\"", changed: true }],
          output: "Step 1\nStep 2 12\n2026-11-24",
          visual: {
            kind: "pipeline",
            caption: "Keyword argument sep='-' replaces spaces between printed values.",
            nodes: [
              { id: "l1", label: "Line 1", sublabel: "skipped" },
              { id: "l2", label: "Line 2", sublabel: "Step 1", tone: "ok" },
              { id: "l3", label: "Line 3", sublabel: "Step 2 12", tone: "ok" },
              { id: "l4", label: "Line 4", sublabel: "stdout: 2026-11-24", active: true, tone: "ok" },
            ],
            links: [
              { from: "l1", to: "l2" },
              { from: "l2", to: "l3" },
              { from: "l3", to: "l4", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Mismatched quotes (`\"Hello'`) raise `SyntaxError`",
        detail: "Always close a string with the exact same quote style you opened it with (`\"...\"` or `'...'`).",
      },
      {
        title: "Uppercase `Print(...)` fails",
        detail: "Python is case-sensitive. The built-in function name is always lowercase `print`, never `Print` or `PRINT`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(\"Score:\", 7 + 3)` display?",
        code: "print(\"Score:\", 7 + 3)",
        options: [
          { id: "a", label: "`Score: 7 + 3`" },
          { id: "b", label: "`Score: 10`" },
          { id: "c", label: "`\"Score:\" 10`" },
        ],
        correctId: "b",
        explanation: "Quotes are stripped when printing text, commas add one space, and unquoted `7 + 3` calculates `10`.",
      },
      {
        prompt: "What does `print(\"A\", \"B\", sep=\"-\")` output?",
        code: "print(\"A\", \"B\", sep=\"-\")",
        options: [
          { id: "a", label: "`A-B`" },
          { id: "b", label: "`A B`" },
          { id: "c", label: "`A - B`" },
        ],
        correctId: "a",
        explanation: "`sep=\"-\"` replaces the default single space between `print` arguments with a single `-`.",
      },
    ],
    practiceTask: {
      title: "Print Your First 2 Lines & Comment",
      tier: "Warmup",
      goal: "Write a script with a top `#` comment that prints a name pair and an arithmetic sum.",
      constraints: ["Use # comment on line 1", "Evaluate sum without quotes"],
      examples: [
        { input: 'print("Name:", "Sam")', output: "Name: Sam" },
        { input: "print(10 + 25)", output: "35" },
      ],
      tasks: [
        "Add a `#` comment describing the script on line 1.",
        "Print your name on line 2, and print `10 + 25` on line 3.",
      ],
      starterCode: "# Exercise M01.1 Warmup\nprint(\"Name:\", \"Sam\")\n",
      expectedOutput: "Name: Sam\n35",
      hint: "Write `print(10 + 25)` without quotes around `10 + 25`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "# Exercise M01.1 Warmup\nprint(\"Name:\", \"Sam\")\nprint(10 + 25)",
    },
    practiceChallenges: [
      {
        title: "Print Your First 2 Lines & Comment",
        tier: "Warmup",
        goal: "Write a script with a `#` comment printing text and an arithmetic result.",
        constraints: ["Keep arithmetic unquoted"],
        examples: [
          { input: 'print("Name:", "Sam")', output: "Name: Sam" },
          { input: "print(10 + 25)", output: "35" },
        ],
        tasks: ["Print `Name: Sam` and `35`."],
        starterCode: "# Exercise M01.1 Warmup\nprint(\"Name:\", \"Sam\")\n",
        expectedOutput: "Name: Sam\n35",
        hint: "Commas inside `print()` add one space automatically.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "# Exercise M01.1 Warmup\nprint(\"Name:\", \"Sam\")\nprint(10 + 25)",
      },
      {
        title: "Terminal Profile Card",
        tier: "Core",
        goal: "Build a 3-line intro card using text strings, commas, and calculated numbers.",
        constraints: ["Print 3 lines", "Evaluate 3 * 7 dynamically"],
        examples: [
          { input: "Banner + city line", output: "--- PROFILE ---\nName: Sam City: Dhaka" },
          { input: "Weeks math (3 * 7)", output: "Days in 3 weeks: 21" },
        ],
        tasks: [
          "Print a title banner line `--- PROFILE ---`.",
          "Print labels and values on one line using commas (`print(\"Name:\", \"Sam\", \"City:\", \"Dhaka\")`).",
          "Print `Days in 3 weeks:` followed by `3 * 7` (`21`).",
        ],
        starterCode: "# Exercise M01.1 Core: profile card\nprint(\"--- PROFILE ---\")\n",
        expectedOutput: "--- PROFILE ---\nName: Sam City: Dhaka\nDays in 3 weeks: 21",
        hint: "Separate labels and values inside `print(...)` with commas: `print(\"Days in 3 weeks:\", 3 * 7)`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "# Exercise M01.1 Core: profile card\nprint(\"--- PROFILE ---\")\nprint(\"Name:\", \"Sam\", \"City:\", \"Dhaka\")\nprint(\"Days in 3 weeks:\", 3 * 7)",
      },
      {
        title: "Same-Line Progress & Date with `sep=` and `end=`",
        tier: "Stretch",
        goal: "Format `2026`, `11`, `24` with `sep=\"/\"` and join two `print()` calls onto one output line with `end=\" \"`.",
        constraints: ["Use sep=\"/\"", "Use end=\" \" on first status line"],
        examples: [
          { input: "print(2026, 11, 24, sep=\"/\")", output: "2026/11/24" },
          { input: "print(\"Ready\", end=\" \") then print(\"to code!\")", output: "Ready to code!" },
        ],
        tasks: [
          "Print `2026`, `11`, `24` separated by `/` using `sep=\"/\"`.",
          "Print `\"Ready\"` with `end=\" \"`, then print `\"to code!\"` on the next line.",
        ],
        starterCode: "# Exercise M01.1 Stretch: custom sep & end\n",
        expectedOutput: "2026/11/24\nReady to code!",
        hint: "Put `end=\" \"` on the first `print(\"Ready\", end=\" \")` call so the cursor stays on that line.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "print(2026, 11, 24, sep=\"/\")\nprint(\"Ready\", end=\" \")\nprint(\"to code!\")",
      },
    ],
  },

  "py-numbers-math": {
    lessonId: "py-numbers-math",
    subtitle: "Learn Python's core data types (`int`, `float`, `str`, `bool`, `NoneType`), check types with `type()`, and calculate with `+ - * /` and `(...)`.",
    intro: {
      heading: "Core Data Types & Basic Arithmetic",
      explanation: [
        "Mixing text and numbers like `\"10\" + 5` stops Python with a `TypeError`, and dividing `8 / 2` hands back `4.0` instead of `4`. Every Python value has a type (`int`, `float`, `str`, `bool`, or `NoneType`) that dictates which operations work, and calling `type(val)` inspects it.",
        "Standard arithmetic follows math precedence (`(...)` then `* /` then `+ -`), and single-slash `/` always returns a `float` even when dividing evenly.",
      ],
      analogy:
        "Data types work like labeled kitchen jars: `\"42\"` in quotes is a text label whose characters you can join, while unquoted `42` is a weighed number you can add, divide, or round.",
      realWorldUses: [
        "Computing invoices, discounts, and averages while rounding binary float totals (`round(..., 2)`) for currency",
        "Checking unexpected `str` vs `int` values with `type()` before arithmetic throws `TypeError`",
      ],
    },
    sections: [
      {
        heading: "Python Core Data Types & `type()`",
        paragraphs: [
          "Every value in Python belongs to a specific **data type**, which controls what operations work on it (you can multiply two numbers, or uppercase text, but not subtract text from a number).",
          "Call the built-in **`type(value)`** function anytime you want Python to show what kind of data a value holds. (Ignore the extra word `class` in `<class 'int'>`: it just tells you the value is an `int`.) Most beginner programs rely on four daily types (`int`, `float`, `str`, `bool`) plus `None` when a value is missing.",
        ],
        table: {
          caption: "Python Core Data Types Quick Chart",
          headers: ["Type Name", "Category", "Example Values", "When Used in Real Projects"],
          rows: [
            ["`int`", "Whole number", "`42`, `0`, `-7`, `1_000_000`", "Daily: counts, IDs, indexes, loop limits"],
            ["`float`", "Decimal number", "`19.99`, `3.0`, `-0.5`", "Daily: prices, averages, measurements"],
            ["`str`", "Text characters", "`\"Ada\"`, `'hello'`, `\"\"`", "Daily: names, messages, file lines, labels"],
            ["`bool`", "Yes / No flag", "`True`, `False`", "Daily: `if` checks, on/off switches, validation"],
            ["`NoneType`", "Empty / missing", "`None`", "Daily: default empty result or optional field"],
            ["`complex`", "Complex math", "`3 + 4j`", "**Rare**: signal processing / scientific math"],
          ],
          highlightCol: 3,
        },
        code: [
          "print(type(42))       # <class 'int'>",
          "print(type(3.5))      # <class 'float'>",
          "print(type(\"Sam\"))    # <class 'str'>",
          "print(type(True))     # <class 'bool'>",
          "# Bug: print(\"10\" + 5)  -> TypeError: can only concatenate str (not \"int\") to str",
          "# Fix: keep both values numeric (or convert \"10\" with int(\"10\"))",
          "print(10 + 5)         # 15",
          "print(1_000_000)      # _ separators make big ints readable",
        ],
        output: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n15\n1000000",
      },
      {
        heading: "Basic Arithmetic (`+`, `-`, `*`, `/`), Float Precision & Numeric Helpers",
        paragraphs: [
          "Use `+` to add, `-` to subtract, `*` to multiply, and `/` for standard decimal division. Whenever an expression includes `/` (even `8 / 2`) or any `float` (`5 + 2.0`), Python returns a `float` (`4.0`, `7.0`).",
          "Python runs `*` and `/` *before* `+` and `-`. Add parentheses `(...)` whenever addition or subtraction should happen first, and reach for built-ins like `round()`, `abs()`, `min()`, and `max()` whenever you format numbers.",
          "Watch two `float` quirks early: (1) computers store decimals in binary, so `0.1 + 0.2` prints `0.30000000000000004` (use `round(..., 2)` when formatting money); (2) on exact `.5` halves, `round()` picks the nearest **even** whole number (`round(2.5)` -> `2`, while `round(3.5)` -> `4`).",
        ],
        table: {
          caption: "Built-in numeric helpers",
          headers: ["Function", "What It Returns", "Example", "Output"],
          rows: [
            ["`round(x, ndigits)`", "Rounds `float` (exact `.5` ties round to even)", "`round(3.14159, 2)`, `round(2.5)`", "`3.14`, `2`"],
            ["`abs(x)`", "Absolute distance from zero (drops negative sign)", "`abs(-15)`", "`15`"],
            ["`min(a, b, ...)`", "Smallest argument passed", "`min(18, 7, 25)`", "`7`"],
            ["`max(a, b, ...)`", "Largest argument passed", "`max(18, 7, 25)`", "`25`"],
          ],
          highlightCol: 2,
        },
        code: [
          "print(12 + 8)                 # 20 (int)",
          "# Bug: expecting 8 / 2 to be int 4 -> single-slash / always returns float 4.0",
          "print(8 / 2, type(8 / 2))     # 4.0 <class 'float'>",
          "# Bug: 2 + 3 * 4 gives 14 when you wanted (2 + 3) * 4 = 20",
          "print(2 + 3 * 4)              # 14 (3 * 4 runs first)",
          "print((2 + 3) * 4)            # 20 (parentheses run first)",
          "print(0.1 + 0.2)              # 0.30000000000000004",
          "print(round(0.1 + 0.2, 2))    # 0.3",
          "print(round(2.5), round(3.5)) # 2 4 (banker's rounding)",
        ],
        output: "20\n4.0 <class 'float'>\n14\n20\n0.30000000000000004\n0.3\n2 4",
        callout: {
          kind: "RULE OF THUMB",
          text: "Do not guess tricky operator precedence: wrap subexpressions in `(...)` so both Python and human readers see the order immediately.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Freelance Quote Calculator Line by Line",
      steps: [
        {
          label: "Step 1: Labor blocks",
          explanation: "Multiply design hours (`4 * 85`) and review hours (`2 * 30`) separately.",
          code: ["print(4 * 85)", "print(2 * 30)"],
          activeLines: [1, 2],
          output: "340\n60",
        },
        {
          label: "Step 2: Combined base quote",
          explanation: "Add both blocks together on one line; `*` runs before `+`, giving `400`.",
          code: ["print(4 * 85 + 2 * 30)"],
          activeLines: [1],
          output: "400",
        },
        {
          label: "Step 3: Apply 10% early-bird discount with `(...)`",
          explanation: "Wrap the base quote inside `(...)` before multiplying by `0.9` (`10%` off).",
          code: [
            "print(4 * 85 + 2 * 30)",
            "print(round((4 * 85 + 2 * 30) * 0.9, 2))",
          ],
          activeLines: [2],
          output: "400\n360.0",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Watch How Parentheses Change Expression Evaluation",
      steps: [
        {
          title: "Step 1: Without parentheses (`2 + 3 * 4`), `*` runs first",
          tag: "TRACE",
          explanation: [
            "Python evaluates `3 * 4` (`12`) before `+`, so `2 + 12` produces `14`.",
          ],
          code: ["print(2 + 3 * 4)", "print((2 + 3) * 4)"],
          activeLines: [1],
          output: "14",
          visual: {
            kind: "pipeline",
            caption: "Multiplication has higher precedence than addition, so 3 * 4 runs first.",
            nodes: [
              { id: "m", label: "3 * 4", sublabel: "12 (higher prec)", active: true, tone: "accent" },
              { id: "a", label: "2 + 12", sublabel: "int 14", tone: "ok" },
            ],
            links: [{ from: "m", to: "a", label: "substitute 12", active: true }],
          },
        },
        {
          title: "Step 2: With parentheses (`(2 + 3) * 4`), `(...)` runs first",
          tag: "TRACE",
          explanation: [
            "Parentheses force `2 + 3` (`5`) to run first, then `5 * 4` produces `20`.",
          ],
          code: ["print(2 + 3 * 4)", "print((2 + 3) * 4)", "print(8 / 2)", "print(round(0.1 + 0.2, 2))"],
          activeLines: [2],
          state: [{ name: "Group (2+3)", value: "5 * 4 = 20", changed: true }],
          output: "14\n20",
          visual: {
            kind: "pipeline",
            caption: "Parentheses force 2 + 3 to finish before multiplying by 4.",
            nodes: [
              { id: "m", label: "(2 + 3)", sublabel: "5 (grouped)", active: true, tone: "accent" },
              { id: "a", label: "5 * 4", sublabel: "int 20", tone: "ok" },
            ],
            links: [{ from: "m", to: "a", label: "then * 4", active: true }],
          },
        },
        {
          title: "Step 3: Division `/` always yields a `float`",
          tag: "CONCEPT",
          explanation: [
            "Even when `8` divides evenly by `2`, `/` produces `4.0` (`float`) rather than `4` (`int`).",
          ],
          code: ["print(2 + 3 * 4)", "print((2 + 3) * 4)", "print(8 / 2)", "print(round(0.1 + 0.2, 2))"],
          activeLines: [3],
          state: [{ name: "type(8 / 2)", value: "float (4.0)", changed: true }],
          output: "14\n20\n4.0",
          visual: {
            kind: "pipeline",
            caption: "Single-slash / always returns a float even when two integers divide evenly.",
            nodes: [
              { id: "in", label: "8 / 2", sublabel: "int / int", active: true, tone: "accent" },
              { id: "out", label: "4.0 (float)", sublabel: "<class 'float'>", tone: "ok" },
            ],
            links: [{ from: "in", to: "out", label: "always float", active: true }],
          },
        },
        {
          title: "Step 4: Clean binary decimal jitter with `round(..., 2)`",
          tag: "CHECK",
          explanation: [
            "In binary floating-point, `0.1 + 0.2` has trailing bits (`0.30000000000000004`); `round(..., 2)` rounds to `0.3`.",
          ],
          code: ["print(2 + 3 * 4)", "print((2 + 3) * 4)", "print(8 / 2)", "print(round(0.1 + 0.2, 2))"],
          activeLines: [4],
          state: [{ name: "round(0.1+0.2, 2)", value: "0.3", changed: true }],
          output: "14\n20\n4.0\n0.3",
          visual: {
            kind: "pipeline",
            caption: "round(x, 2) trims trailing binary float jitter to two decimal places.",
            nodes: [
              { id: "raw", label: "0.1 + 0.2", sublabel: "0.30000000000000004", tone: "warm" },
              { id: "rnd", label: "round(..., 2)", sublabel: "0.3", active: true, tone: "ok" },
            ],
            links: [{ from: "raw", to: "rnd", label: "round to 2 dp", active: true }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Comma trap: `1,000` is not one thousand",
        detail: "In `print(1, 000)`, the comma passes two separate arguments (`1` and `000`), so Python prints `1 0` instead of `1000`. Always use `_` separators (`1_000_000`) for large numbers.",
      },
      {
        title: "Binary float quirk (`0.1 + 0.2`) & banker's rounding (`round(2.5)`)",
        detail: "`0.1 + 0.2` produces `0.30000000000000004` in binary floating point, and `round(2.5)` returns `2` (rounds `.5` ties to the nearest even integer).",
      },
      {
        title: "Missing `*` before parentheses (`2(3 + 4)` fails)",
        detail: "Algebra omits multiplication signs, but Python always needs `*`: write `2 * (3 + 4)`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(10 - 2 * 3 + 4)` output?",
        code: "print(10 - 2 * 3 + 4)",
        options: [
          { id: "a", label: "`28`" },
          { id: "b", label: "`8`" },
          { id: "c", label: "`0`" },
        ],
        correctId: "b",
        explanation: "`2 * 3` runs first (`6`), then `10 - 6 + 4` evaluates left-to-right to produce `8`.",
      },
      {
        prompt: "What does `print(type(12 / 3), 12 / 3)` display?",
        code: "print(type(12 / 3), 12 / 3)",
        options: [
          { id: "a", label: "`<class 'int'> 4`" },
          { id: "b", label: "`<class 'str'> 4.0`" },
          { id: "c", label: "`<class 'float'> 4.0`" },
        ],
        correctId: "c",
        explanation: "Single-slash division `/` always produces a `float` (`4.0`), even when division is exact.",
      },
    ],
    practiceTask: {
      title: "Inspect Data Types with `type()`",
      tier: "Warmup",
      goal: "Print the `type(...)` of an `int`, a `float`, and a `str` to verify how Python classifies values.",
      constraints: ["Use type() built-in"],
      examples: [
        { input: "type(25), type(9.5)", output: "<class 'int'>\n<class 'float'>" },
        { input: "type(\"hello\")", output: "<class 'str'>" },
      ],
      tasks: [
        "Print `type(25)` on line 1.",
        "Print `type(9.5)` on line 2 and `type(\"hello\")` on line 3.",
      ],
      starterCode: "# Exercise M01.2 Warmup: type inspection\n",
      expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>",
      hint: "Call `print(type(...))` directly for each value.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "print(type(25))\nprint(type(9.5))\nprint(type(\"hello\"))",
    },
    practiceChallenges: [
      {
        title: "Inspect Data Types with `type()`",
        tier: "Warmup",
        goal: "Verify `type()` output across `int`, `float`, and `str`.",
        constraints: ["Pass literal values directly to type()"],
        examples: [
          { input: "type(25), type(9.5)", output: "<class 'int'>\n<class 'float'>" },
          { input: "type(\"hello\")", output: "<class 'str'>" },
        ],
        tasks: ["Print `<class 'int'>`, `<class 'float'>`, and `<class 'str'>`."],
        starterCode: "# Exercise M01.2 Warmup: type inspection\n",
        expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>",
        hint: "Strings require quotes (`\"hello\"`), while `25` and `9.5` stay unquoted.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "print(type(25))\nprint(type(9.5))\nprint(type(\"hello\"))",
      },
      {
        title: "Shopping Bill Split with Grouping",
        tier: "Core",
        goal: "Compute the total cost of 3 items at `45.5` each and 2 items at `12` each, then divide equally among 2 friends.",
        constraints: ["Use parentheses to group sum before / 2"],
        examples: [
          { input: "3 * 45.5 + 2 * 12", output: "160.5" },
          { input: "(3 * 45.5 + 2 * 12) / 2", output: "80.25" },
        ],
        tasks: [
          "Print the subtotal `3 * 45.5 + 2 * 12`.",
          "Wrap the sum in `(...)` and divide by `2` on line 2.",
        ],
        starterCode: "# Exercise M01.2 Core: shopping bill split\n",
        expectedOutput: "160.5\n80.25",
        hint: "Use `(3 * 45.5 + 2 * 12) / 2` for the second line.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "print(3 * 45.5 + 2 * 12)\nprint((3 * 45.5 + 2 * 12) / 2)",
      },
      {
        title: "Fix Separators, Missing Multiply & Rounding",
        tier: "Stretch",
        goal: "Fix comma separators (`1,000,000`), missing `*` (`2(500 + 250)`), and print `round(0.1 + 0.2, 2)` on line 2.",
        constraints: ["Use _ digit separator", "Include explicit * operator"],
        examples: [
          { input: "1_000_000 + 2 * (500 + 250)", output: "1001500" },
          { input: "round(0.1 + 0.2, 2)", output: "0.3" },
        ],
        tasks: [
          "Replace `1,000,000` with `1_000_000` and insert `*` in `2 * (500 + 250)`.",
          "Print `round(0.1 + 0.2, 2)` on line 2.",
        ],
        starterCode: "# Exercise M01.2 Stretch: fix syntax bugs\nprint(1,000,000 + 2(500 + 250))\n",
        expectedOutput: "1001500\n0.3",
        hint: "Underscores (`_`) improve readability without splitting `print()` arguments like commas do.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "print(1_000_000 + 2 * (500 + 250))\nprint(round(0.1 + 0.2, 2))",
      },
    ],
  },

  "py-variables-basics": {
    lessonId: "py-variables-basics",
    subtitle: "Name values using legal variable rules, avoid built-in shadowing, and update values with all assignment operators (`=`, `+=`, `-=`, `*=`, `/=`).",
    intro: {
      heading: "Variables as Name Labels & Shorthand Updates",
      explanation: [
        "Without variables, changing a single item price in a bill script means hunting down and editing that number on every line. Naming values once (`price = 120`) lets you update one line and reuse it everywhere.",
        "When Python runs `b = a * 3`, it computes the right side of `=` first and points the name `b` at that result (`12`), so changing `a` later leaves `b` unchanged. Shorthand operators like `+=` and `-=` update a variable without writing its name twice.",
      ],
      analogy:
        "A variable works like a name tag stuck onto a value: moving the `a` tag to `10` later leaves the `b` tag stuck onto `12` where you placed it earlier.",
      realWorldUses: [
        "Storing configuration constants (`TAX_RATE`, `MAX_RETRIES`) in one place so edits cascade through a script",
        "Tracking running wallet balances, game scores, and inventory counts with `+=` and `-=`",
      ],
    },
    sections: [
      {
        heading: "Variable Assignment (`=`), `NameError` & Reassignment",
        paragraphs: [
          "Compare hard-coding `120` in three places (`120`, `120 * 3`, `120 * 3 * 1.1`) against storing `price = 120` once: changing `price` from `120` to `135` updates every calculation below it automatically.",
          "If you read a variable before creating it, or misspell its name (`print(totl)` instead of `total`), Python stops with `NameError: name '...' is not defined`. You can also point an existing name at a new value (`x = 10`, then `x = \"ten\"`), though keeping one consistent type per variable is easier to read.",
        ],
        visual: {
          kind: "memory",
          caption: "After running a = 4, b = a * 3, and a = 10, label a moves to 10 while b stays pointed at 12",
          frames: [
            {
              name: "Variables",
              bindings: [
                { label: "a", targetId: "val_10", highlight: true },
                { label: "b", targetId: "val_12" },
              ],
            },
          ],
          objects: [
            { id: "val_4", typeLabel: "int (old)", value: "4" },
            { id: "val_12", typeLabel: "int", value: "12" },
            { id: "val_10", typeLabel: "int", value: "10", highlight: true },
          ],
        },
        code: [
          "price = 120                  # change here once to update every line",
          "cups = 3",
          "subtotal = price * cups",
          "print(\"With tip:\", subtotal * 1.1)",
          "a = 4",
          "b = a * 3     # 12",
          "a = 10        # b stays 12",
          "print(a, b)",
        ],
        output: "With tip: 396.0\n10 12",
      },
      {
        heading: "Variable Naming Rules & Overwriting Built-In Names",
        paragraphs: [
          "Variable names may use letters, digits, and `_`, cannot start with a digit, cannot contain spaces or `-`, and cannot match Python keywords (`if`, `for`, `class`). Write variable names in lowercase `snake_case` (`total_bill`) and constants in `UPPER_CASE` (`TAX_RATE`).",
        ],
        table: {
          caption: "Variable Naming Rules (Valid vs Invalid & Naming Styles)",
          headers: ["Name", "Valid?", "Rule / Outcome"],
          rows: [
            ["`user_age`, `_count`, `item2`", "Valid", "Letters, digits, and `_` (`snake_case` standard)"],
            ["`MAX_RETRIES = 3`", "Valid", "`UPPER_CASE` signals a constant value to other humans"],
            ["`2nd_place`", "Invalid", "`SyntaxError`: cannot start with a digit"],
            ["`user-age`, `user age`", "Invalid", "`SyntaxError`: hyphens subtract (`user - age`), spaces split words apart"],
            ["`class = 5`, `for = 1`", "Invalid", "`SyntaxError`: reserved Python keyword"],
            ["`print = 5`", "Trap", "Valid syntax, yet overwrites `print()` so later `print(...)` calls raise `TypeError`."],
          ],
          highlightCol: 1,
        },
        code: [
          "hourly_wage = 25             # valid: lowercase words joined with _",
          "hours2 = 8                   # valid: digits allowed after first letter",
          "# 2nd_shift = 8              # INVALID -> SyntaxError: invalid decimal literal",
          "# hourly-wage = 25           # INVALID -> SyntaxError: Python reads '-' as minus",
          "daily_pay = hourly_wage * hours2",
          "print(daily_pay)",
        ],
        output: "200",
      },
      {
        heading: "All Assignment & Augmented Operators (`=`, `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`)",
        paragraphs: [
          "Writing `score = score + 10` reads the *old* value of `score`, adds `10`, and saves the result back into `score`. Shorthand **augmented assignment** operators write that update once (`score += 10`).",
        ],
        table: {
          caption: "Complete Python Assignment Operators Chart",
          headers: ["Operator", "Same As", "Example (`x` starts at `10`)", "Real-Life Priority"],
          rows: [
            ["`=`", "Assign value", "`x = 10` -> `10`", "Daily"],
            ["`+=`", "`x = x + n`", "`x += 5` -> `15`", "Daily: running totals, counters"],
            ["`-=`", "`x = x - n`", "`x -= 3` -> `7`", "Daily: inventory, health, balances"],
            ["`*=`", "`x = x * n`", "`x *= 2` -> `20`", "Common: doubling, interest rates"],
            ["`/=`", "`x = x / n`", "`x /= 4` -> `2.5`", "Situational: scaling values down by a divisor"],
            ["`//=`", "`x = x // n` (`//` taught next lesson)", "`x //= 3` -> `3`", "Rare: repeated halving (`n //= 2`)"],
            ["`%=`", "`x = x % n` (`%` taught next lesson)", "`x %= 4` -> `2`", "Rare: wrapping a counter back around (like clock hours)"],
            ["`**=`", "`x = x ** n` (`**` taught next lesson)", "`x **= 2` -> `100`", "Rare: math growth formulas"],
          ],
          highlightCol: 3,
        },
        code: [
          "score = 10",
          "score += 5    # 15",
          "score *= 2    # 30",
          "score -= 4    # 26",
          "print(\"Final score:\", score)",
        ],
        output: "Final score: 26",
      },
    ],
    guidedBuildUp: {
      title: "Track a Delivery Order Total Step by Step",
      steps: [
        {
          label: "Step 1: Starting cart",
          explanation: "Assign clear `snake_case` names `subtotal` and `delivery_fee`, then print the starting `subtotal`.",
          code: ["subtotal = 400", "delivery_fee = 50", "print(\"Items:\", subtotal)"],
          activeLines: [1, 2, 3],
          output: "Items: 400",
        },
        {
          label: "Step 2: Double items (`*=`) & compute `total`",
          explanation: "Double `subtotal` via `*= 2`, then add `delivery_fee` into a separate `total` variable.",
          code: [
            "subtotal = 400",
            "delivery_fee = 50",
            "subtotal *= 2",
            "total = subtotal + delivery_fee",
            "print(\"Before coupon:\", total)",
          ],
          activeLines: [3, 4, 5],
          output: "Before coupon: 850",
        },
        {
          label: "Step 3: Subtract coupon (`-=`) & print",
          explanation: "Subtract a `100` discount via `-=` and print the final payable amount (`750`).",
          code: [
            "subtotal = 400",
            "delivery_fee = 50",
            "subtotal *= 2",
            "total = subtotal + delivery_fee",
            "total -= 100",
            "print(\"Payable:\", total)",
          ],
          activeLines: [5, 6],
          output: "Payable: 750",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Watch Variable Values Update Line by Line",
      steps: [
        {
          title: "Step 1: Initialize starting value",
          tag: "TRACE",
          explanation: ["`coins = 50` creates a variable named `coins` holding `50`."],
          code: ["coins = 50", "coins = coins + 20", "coins *= 2", "coins -= 15", "print(coins)"],
          activeLines: [1],
          state: [{ name: "coins", value: "50", changed: true }],
          visual: {
            kind: "memory",
            caption: "Assignment creates the name coins and binds it to int 50.",
            frames: [
              { name: "Globals", bindings: [{ label: "coins", targetId: "o50", highlight: true }] },
            ],
            objects: [{ id: "o50", typeLabel: "int", value: "50", highlight: true }],
          },
        },
        {
          title: "Step 2: Add 20 -> 70",
          tag: "TRACE",
          explanation: ["The right side `coins + 20` evaluates to `70` first, then overwrites `coins`."],
          code: ["coins = 50", "coins = coins + 20", "coins *= 2", "coins -= 15", "print(coins)"],
          activeLines: [2],
          state: [{ name: "coins", value: "70", changed: true }],
          visual: {
            kind: "memory",
            caption: "coins rebinds to the new int object 70; 50 is left unreferenced.",
            frames: [
              { name: "Globals", bindings: [{ label: "coins", targetId: "o70", highlight: true }] },
            ],
            objects: [
              { id: "o50", typeLabel: "int", value: "50 (unreferenced)" },
              { id: "o70", typeLabel: "int", value: "70", highlight: true },
            ],
          },
        },
        {
          title: "Step 3: Double with `*=` -> 140",
          tag: "TRACE",
          explanation: ["`coins *= 2` multiplies `70 * 2` and saves `140` back into `coins`."],
          code: ["coins = 50", "coins = coins + 20", "coins *= 2", "coins -= 15", "print(coins)"],
          activeLines: [3],
          state: [{ name: "coins", value: "140", changed: true }],
          visual: {
            kind: "memory",
            caption: "coins *= 2 rebinds coins to int 140.",
            frames: [
              { name: "Globals", bindings: [{ label: "coins", targetId: "o140", highlight: true }] },
            ],
            objects: [
              { id: "o70", typeLabel: "int", value: "70 (unreferenced)" },
              { id: "o140", typeLabel: "int", value: "140", highlight: true },
            ],
          },
        },
        {
          title: "Step 4: Subtract `15` (`-=`) & print `125`",
          tag: "TRACE",
          explanation: ["`coins -= 15` drops `coins` to `125`, and line 5 prints `125`."],
          code: ["coins = 50", "coins = coins + 20", "coins *= 2", "coins -= 15", "print(coins)"],
          activeLines: [4, 5],
          state: [{ name: "coins", value: "125", changed: true }],
          output: "125",
          visual: {
            kind: "memory",
            caption: "Final rebind moves coins to int 125.",
            frames: [
              { name: "Globals", bindings: [{ label: "coins", targetId: "o125", highlight: true }] },
            ],
            objects: [
              { id: "o140", typeLabel: "int", value: "140 (unreferenced)" },
              { id: "o125", typeLabel: "int", value: "125", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Case sensitivity: `score` and `Score` are two different variables",
        detail: "Always spell a variable name with the exact same capitalization every time you read or update it.",
      },
      {
        title: "Changing `a` later does not recalculate `b = a * 2`",
        detail: "`b` stores the result computed at that moment in time, so reassigning `a` later will not automatically update `b`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(a, b)` display at the end?",
        code: "a = 4\nb = a * 3\na = 10\nprint(a, b)",
        options: [
          { id: "a", label: "`10 30`" },
          { id: "b", label: "`10 12`" },
          { id: "c", label: "`4 12`" },
        ],
        correctId: "b",
        explanation: "When line 2 ran, `a` was `4`, so `b` stored `12`. Changing `a` to `10` on line 3 does not re-run line 2.",
      },
      {
        prompt: "Which variable name raises a `SyntaxError`?",
        code: "# Test each name below",
        options: [
          { id: "a", label: "`total_price_2`" },
          { id: "b", label: "`_temp_value`" },
          { id: "c", label: "`2nd_total`" },
        ],
        correctId: "c",
        explanation: "Variable names can include digits after the first character, but cannot start with a digit.",
      },
    ],
    practiceTask: {
      title: "Compute & Print Rectangle Area with Variables",
      tier: "Warmup",
      goal: "Store `width` and `height` in variables, calculate `area`, and print it.",
      constraints: ["width, height >= 0"],
      examples: [
        { input: "width = 12, height = 5", output: "60" },
        { input: "width = 0, height = 9", output: "0" },
      ],
      tasks: [
        "Create `width` and `height`.",
        "Store `area = width * height` and print `area`.",
      ],
      starterCode: "# Exercise M01.4 Warmup: rectangle area\nwidth = 12\nheight = 5\n# TODO: store area = width * height and print area\n",
      expectedOutput: "60\n0",
      hint: "Multiply `width * height` before passing `area` to `print()`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "width = 12\nheight = 5\narea = width * height\nprint(area)\n\nwidth = 0\nheight = 9\narea = width * height\nprint(area)",
    },
    practiceChallenges: [
      {
        title: "Compute & Print Rectangle Area with Variables",
        tier: "Warmup",
        goal: "Store dimensions in variables and print `width * height`.",
        constraints: ["width, height >= 0"],
        examples: [
          { input: "width = 12, height = 5", output: "60" },
          { input: "width = 0, height = 9", output: "0" },
        ],
        tasks: ["Create `width` and `height`, store `area = width * height`, and print `area`."],
        starterCode: "# Exercise M01.4 Warmup: rectangle area\nwidth = 12\nheight = 5\n# TODO: store area = width * height and print area\n",
        expectedOutput: "60\n0",
        hint: "Multiplying any dimension by `0` gives area `0`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "width = 12\nheight = 5\narea = width * height\nprint(area)\n\nwidth = 0\nheight = 9\narea = width * height\nprint(area)",
      },
      {
        title: "Fix a Broken Wallet Balance Tracker",
        tier: "Core",
        goal: "Fix a wallet script where `=` overwrote `balance` instead of adding via `+=`, and handle zero expenses too.",
        constraints: ["Use += and -="],
        examples: [
          { input: "start=500, deposit=250, spend=120, spend=45", output: "Remaining balance: 585" },
          { input: "start=100, deposit=0, spend=100", output: "Remaining balance: 0" },
        ],
        tasks: [
          "Use `balance += deposit` instead of `balance = deposit`.",
          "Subtract expenses with `-=` and print `Remaining balance: <amount>`.",
        ],
        starterCode: "# Exercise M01.4 Core: wallet update bug\nbalance = 500\nbalance = 250   # Bug: overwrote 500\n",
        expectedOutput: "Remaining balance: 585\nRemaining balance: 0",
        hint: "Replace `balance = 250` with `balance += 250` so `500` is preserved.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "balance = 500\nbalance += 250\nbalance -= 120\nbalance -= 45\nprint(\"Remaining balance:\", balance)\nb = 100\nb -= 100\nprint(\"Remaining balance:\", b)",
      },
      {
        title: "Chain Augmented Assignment Updates",
        tier: "Stretch",
        goal: "Start `xp`, double it (`*=`), add a bonus (`+=`), subtract a penalty (`-=`), and print the result.",
        constraints: ["Apply *=, +=, -= in order"],
        examples: [
          { input: "xp = 100, bonus = 50, penalty = 30", output: "220" },
          { input: "xp = 0, bonus = 25, penalty = 5", output: "20" },
        ],
        tasks: [
          "Update `xp` across three lines with `*=`, `+=`, `-=`.",
          "Print final `xp`.",
        ],
        starterCode: "# Exercise M01.4 Stretch: chained updates\nxp = 100\n",
        expectedOutput: "220\n20",
        hint: "Doubling `0` (`0 *= 2`) stays `0` before adding `25`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "xp = 100\nxp *= 2\nxp += 50\nxp -= 30\nprint(xp)\nxp = 0\nxp *= 2\nxp += 25\nxp -= 5\nprint(xp)",
      },
    ],
  },

  "py-div-mod-power": {
    lessonId: "py-div-mod-power",
    subtitle: "Compare all 7 arithmetic operators (`+ - * / // % **`), trace operator precedence, and see which ones matter most in daily work.",
    intro: {
      heading: "Floor Division, Modulo & Exponents",
      explanation: [
        "Standard division `/` produces decimals (`23 / 4 = 5.75`). When dividing items into whole groups or splitting minutes into hours and leftover minutes, Python gives you floor division (`//`) for the whole quotient and modulo (`%`) for the remainder.",
        "Exponents use `**` (`2 ** 3 = 8`), never `^`.",
      ],
      analogy:
        "Packing 17 cookies into 5-cookie boxes shows both operators at once: `17 // 5` gives `3` sealed boxes, and `17 % 5` gives the `2` loose cookies left on the tray.",
      realWorldUses: [
        "Pagination math (`total_items // page_size`) and wrapping clock or calendar indices (`% 24`, `% 7`)",
        "Checking even/odd numbers (`n % 2 == 0`) and extracting trailing digits (`n % 10`)",
      ],
    },
    sections: [
      {
        heading: "Complete Arithmetic Operators Chart & Real-Life Frequency",
        paragraphs: [
          "Python has 7 arithmetic operators. Standard `+`, `-`, `*`, and `/` handle most day-to-day code, while `//`, `%`, and `**` solve specific whole-number, remainder, and exponent problems directly.",
        ],
        table: {
          caption: "All 7 Python Arithmetic Operators & Real-Life Priority",
          headers: ["Operator", "Name", "Example -> Result", "Real-Life Priority"],
          rows: [
            ["`+`", "Addition", "`7 + 3` -> `10`", "Daily: totals, counters, strings"],
            ["`-`", "Subtraction", "`7 - 3` -> `4`", "Daily: differences, balances"],
            ["`*`", "Multiplication", "`7 * 3` -> `21`", "Daily: pricing, scaling"],
            ["`/`", "True division (always `float`)", "`7 / 2` -> `3.5`", "Daily: averages, ratios"],
            ["`//`", "Floor division (rounds down toward negative infinity)", "`7 // 2` -> `3`, `-7 // 2` -> `-4`", "Situational: splitting lists into pages (pagination), hours/minutes, grids"],
            ["`%`", "Modulo (remainder)", "`7 % 2` -> `1`, `-7 % 2` -> `1`", "Common: even/odd, wrapping clocks, cycling"],
            ["`**`", "Exponentiation (power)", "`2 ** 3` -> `8`", "Situational: math formulas (`** 0.5` root)"],
          ],
          highlightCol: 3,
        },
        visual: {
          kind: "operator-lab",
          caption: "Click any expression to compare division, floor division, modulo, powers, and the ^ trap",
          presets: [
            {
              label: "23 / 4",
              left: "23",
              op: "/",
              right: "4",
              result: "5.75",
              typeName: "float",
              frequency: "Daily",
              note: "Exact decimal division. Always returns a float even when evenly divisible (8 / 2 -> 4.0).",
            },
            {
              label: "23 // 4",
              left: "23",
              op: "//",
              right: "4",
              result: "5",
              typeName: "int",
              frequency: "Situational",
              note: "Floor division rounds down toward negative infinity (23 // 4 -> 5, and -7 // 2 -> -4).",
            },
            {
              label: "23 % 4",
              left: "23",
              op: "%",
              right: "4",
              result: "3",
              typeName: "int",
              frequency: "Common",
              note: "Modulo returns the leftover remainder after floor division (23 - 20 = 3, and -7 % 2 -> 1).",
            },
            {
              label: "2 ** 3",
              left: "2",
              op: "**",
              right: "3",
              result: "8",
              typeName: "int",
              frequency: "Situational",
              note: "Exponentiation raises 2 to the 3rd power (2 * 2 * 2). Use ** 0.5 for square root.",
            },
            {
              label: "2 ^ 3 (Trap)",
              left: "2",
              op: "^",
              right: "3",
              result: "1",
              typeName: "int",
              frequency: "Rare",
              note: "Careful: ^ is not a power operator in Python (2 ^ 3 evaluates to 1, not 8). Always use ** for powers.",
            },
          ],
        },
      },
      {
        heading: "Floor Division (`//`), Modulo (`%`), Negatives & Powers (`**`)",
        paragraphs: [
          "Using integer division, splitting `total_minutes = 145` is direct: `hours = total_minutes // 60` gives `2` full hours, and `leftover_minutes = total_minutes % 60` gives `25` leftover minutes. Modulo also tests even/odd (`18 % 2` gives `0`) or grabs a last digit (`248 % 10` gives `8`).",
          "Compare `7 / 2` (`3.5`) against `7 // 2` (`3`) and `-7 // 2` (`-4`): `//` rounds down toward negative infinity (not toward zero), so `-7 / 2 = -3.5` drops down to `-4`, and `-7 % 2` gives `1` (`-4 * 2 + 1 = -7`).",
          "For powers, Python uses `**` (`2 ** 3` gives `8`), whereas `2 ^ 3` runs bitwise XOR and returns `1`. You can also take a square root with `25 ** 0.5` (`5.0`).",
        ],
        code: [
          "total_minutes = 145",
          "hours = total_minutes // 60",
          "leftover_minutes = total_minutes % 60",
          "print(hours, \"hours and\", leftover_minutes, \"minutes\")",
          "# Compare /, //, and negative floor division:",
          "print(7 / 2, 7 // 2, -7 // 2, -7 % 2)   # 3.5 3 -4 1",
          "# Bug: 2 ^ 3 is bitwise XOR in Python -> prints 1 instead of 8",
          "print(2 ^ 3)                             # 1 (trap)",
          "# Fix: use ** for powers (and ** 0.5 for square root)",
          "print(2 ** 3, 25 ** 0.5)                 # 8 5.0",
        ],
        output: "2 hours and 25 minutes\n3.5 3 -4 1\n1\n8 5.0",
      },
      {
        heading: "Operator Precedence Table (What Runs First)",
        paragraphs: [
          "When multiple operators share one expression, Python evaluates highest priority first (`()` -> `**` -> `* / // %` -> `+ -`) and walks left-to-right within the same tier (`2 + 3 * 4` -> `14`).",
        ],
        table: {
          caption: "Arithmetic Operator Precedence (Highest to Lowest)",
          headers: ["Priority", "Operators", "Notes"],
          rows: [
            ["1 (First)", "`(...)`", "Parentheses always force inner grouping first"],
            ["2", "`**`", "Exponents run before a leading minus sign (`-2 ** 2` -> `-4`, use `(-2) ** 2` -> `4`)"],
            ["3", "`*`, `/`, `//`, `%`", "Equal priority; evaluated left to right"],
            ["4 (Last here)", "`+`, `-`", "Evaluated left to right after multiply/divide"],
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Coin & Dollar Change Splitter Step by Step",
      subtitle: "Break `total_cents = 387` into dollars, quarters, dimes, and leftover cents using integer arithmetic.",
      steps: [
        {
          label: "Step 1: Whole dollars (`// 100`)",
          explanation: "Store `total_cents = 387`, then use `// 100` to find whole dollars (`3`) and `% 100` to keep the leftover cents (`87`).",
          code: [
            "total_cents = 387",
            "dollars = total_cents // 100",
            "rem_cents = total_cents % 100",
            "print(\"Dollars:\", dollars, \"Remaining cents:\", rem_cents)",
          ],
          activeLines: [1, 2, 3, 4],
          output: "Dollars: 3 Remaining cents: 87",
        },
        {
          label: "Step 2: Quarters (`// 25`) & remaining cents",
          explanation: "Divide `rem_cents` by `25` with `//` for quarters (`3`) and `%` for the cents left after quarters (`12`).",
          code: [
            "total_cents = 387",
            "dollars = total_cents // 100",
            "rem_cents = total_cents % 100",
            "quarters = rem_cents // 25",
            "after_quarters = rem_cents % 25",
            "print(dollars, \"dollars,\", quarters, \"quarters, left:\", after_quarters)",
          ],
          activeLines: [4, 5, 6],
          output: "3 dollars, 3 quarters, left: 12",
        },
        {
          label: "Step 3: Dimes (`// 10`) & leftover pennies (`% 10`)",
          explanation: "Split `after_quarters` (`12`) into `dimes = 1` and `pennies = 2` so every cent is accounted for.",
          code: [
            "total_cents = 387",
            "dollars = total_cents // 100",
            "rem_cents = total_cents % 100",
            "quarters = rem_cents // 25",
            "after_quarters = rem_cents % 25",
            "dimes = after_quarters // 10",
            "pennies = after_quarters % 10",
            "print(dollars, \"dollars,\", quarters, \"quarters,\", dimes, \"dimes,\", pennies, \"cents\")",
          ],
          activeLines: [6, 7, 8],
          output: "3 dollars, 3 quarters, 1 dimes, 2 cents",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `//`, `%` and `**` Evaluation Order",
      steps: [
        {
          title: "Split `145` total minutes with `// 60`",
          tag: "TRACE",
          explanation: ["`145 // 60` counts full `60`-minute chunks, assigning `hours = 2` (`int`)."],
          code: ["total_minutes = 145", "hours = total_minutes // 60", "rem = total_minutes % 60", "print(-7 // 2, -7 % 2)", "print(2 ** 3 * 2)"],
          activeLines: [1, 2],
          state: [
            { name: "total_minutes", value: "145", changed: true },
            { name: "hours", value: "2", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "145 splits into two full 60-minute chunks (hours = 2) with 25 minutes left over.",
            nodes: [
              { id: "tot", label: "145 mins", sublabel: "input total", tone: "muted" },
              { id: "div", label: "145 // 60", sublabel: "2 full 60-min hours", active: true, tone: "accent" },
              { id: "rem", label: "25 left over", sublabel: "not a full hour", tone: "warm" },
            ],
            links: [
              { from: "tot", to: "div", label: "floor div", active: true },
              { from: "div", to: "rem", label: "remainder" },
            ],
          },
        },
        {
          title: "Capture leftover minutes with `% 60`",
          tag: "TRACE",
          explanation: ["`145 % 60` returns the remaining `25` minutes after subtracting `2 * 60`."],
          code: ["total_minutes = 145", "hours = total_minutes // 60", "rem = total_minutes % 60", "print(-7 // 2, -7 % 2)", "print(2 ** 3 * 2)"],
          activeLines: [3],
          state: [
            { name: "hours", value: "2" },
            { name: "rem", value: "25", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Modulo (%) isolates the remaining 25 minutes after full hours are removed.",
            nodes: [
              { id: "tot", label: "145 mins", sublabel: "minus 2 x 60 = 120", tone: "muted" },
              { id: "mod", label: "145 % 60", sublabel: "extracts remainder", active: true, tone: "accent" },
              { id: "res", label: "rem = 25", sublabel: "remaining mins", tone: "ok", active: true },
            ],
            links: [
              { from: "tot", to: "mod", active: true },
              { from: "mod", to: "res", label: "keeps 25", active: true },
            ],
          },
        },
        {
          title: "Watch negative floor division round toward `-infinity`",
          tag: "PITFALL",
          explanation: ["`-7 / 2` is `-3.5`, so rounding down toward negative infinity gives `-7 // 2 = -4`, leaving remainder `1` (`-4 * 2 + 1 = -7`)."],
          code: ["total_minutes = 145", "hours = total_minutes // 60", "rem = total_minutes % 60", "print(-7 // 2, -7 % 2)", "print(2 ** 3 * 2)"],
          activeLines: [4],
          state: [
            { name: "-7 // 2", value: "-4", changed: true },
            { name: "-7 % 2", value: "1", changed: true },
          ],
          output: "-4 1",
          visual: {
            kind: "pipeline",
            caption: "Floor division steps down from -3.5 toward negative infinity (-4), leaving remainder +1.",
            nodes: [
              { id: "ex", label: "-7 / 2 = -3.5", sublabel: "exact value", tone: "muted" },
              { id: "fl", label: "-7 // 2 -> -4", sublabel: "rounds down", active: true, tone: "warm" },
              { id: "md", label: "-7 % 2 -> +1", sublabel: "-4 * 2 + 1 = -7", tone: "ok", active: true },
            ],
            links: [
              { from: "ex", to: "fl", label: "floor", active: true },
              { from: "fl", to: "md", label: "remainder", active: true },
            ],
          },
        },
        {
          title: "Power `**` runs before multiply `*`",
          tag: "CHECK",
          explanation: ["`2 ** 3` evaluates first (`8`), then multiplies by `2` (`16`)."],
          code: ["total_minutes = 145", "hours = total_minutes // 60", "rem = total_minutes % 60", "print(-7 // 2, -7 % 2)", "print(2 ** 3 * 2)"],
          activeLines: [5],
          state: [{ name: "2 ** 3 * 2", value: "16", changed: true }],
          output: "-4 1\n16",
          visual: {
            kind: "pipeline",
            caption: "Exponentiation binds tighter than multiplication, so 2 ** 3 (8) runs before * 2 (16).",
            nodes: [
              { id: "pw", label: "2 ** 3", sublabel: "evaluates first -> 8", active: true, tone: "accent" },
              { id: "ml", label: "8 * 2", sublabel: "multiplies -> 16", tone: "ok", active: true },
            ],
            links: [
              { from: "pw", to: "ml", label: "feeds into * 2", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `^` instead of `**` for exponents",
        detail: "In Python, `2 ^ 3` returns `1` because `^` is not an exponent operator. Always write `2 ** 3`.",
      },
      {
        title: "Division or modulo by zero (`10 / 0`, `10 % 0`)",
        detail: "Both raise `ZeroDivisionError` and crash immediately unless guarded.",
      },
    ],
    predictChecks: [
      {
        prompt: "If a 24-hour clock reads `21:00` and `6` hours pass, which expression computes `3` (`03:00`)?",
        code: "# Pick the expression evaluating to 3",
        options: [
          { id: "a", label: "`(21 + 6) // 24`" },
          { id: "b", label: "`(21 + 6) % 24`" },
          { id: "c", label: "`(21 + 6) / 24`" },
        ],
        correctId: "b",
        explanation: "`21 + 6 = 27`. `27 % 24` gives remainder `3` (`03:00`).",
      },
      {
        prompt: "What does `print(2 ** 3 * 2)` print?",
        code: "print(2 ** 3 * 2)",
        options: [
          { id: "a", label: "`64`" },
          { id: "b", label: "`12`" },
          { id: "c", label: "`16`" },
        ],
        correctId: "c",
        explanation: "`**` has higher precedence than `*`, so `2 ** 3` (`8`) runs first, then `8 * 2 = 16`.",
      },
    ],
    practiceTask: {
      title: "Pack Boxes & Check Leftovers",
      tier: "Warmup",
      goal: "Compute full boxes and leftover items using `//` and `%`.",
      constraints: ["box_size >= 1"],
      examples: [
        { input: "cookies = 17, box_size = 5", output: "3 2" },
        { input: "cookies = 10, box_size = 5", output: "2 0" },
      ],
      tasks: [
        "Assign `cookies` and `box_size`.",
        "Compute `full_boxes = cookies // box_size` and `leftover = cookies % box_size`.",
      ],
      starterCode: "# Exercise M01.3 Warmup: pack boxes\ncookies = 17\nbox_size = 5\n",
      expectedOutput: "3 2\n2 0",
      hint: "Write `full_boxes = cookies // box_size` and `leftover = cookies % box_size`, then `print(full_boxes, leftover)`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "cookies = 17\nbox_size = 5\nprint(cookies // box_size, cookies % box_size)\ncookies = 10\nprint(cookies // box_size, cookies % box_size)",
    },
    practiceChallenges: [
      {
        title: "Pack Boxes & Check Leftovers",
        tier: "Warmup",
        goal: "Compute whole boxes and leftover items with `//` and `%`.",
        constraints: ["box_size >= 1"],
        examples: [
          { input: "cookies = 17, box_size = 5", output: "3 2" },
          { input: "cookies = 10, box_size = 5", output: "2 0" },
        ],
        tasks: ["Print `cookies // box_size` and `cookies % box_size`."],
        starterCode: "# Exercise M01.3 Warmup: pack boxes\ncookies = 17\nbox_size = 5\n",
        expectedOutput: "3 2\n2 0",
        hint: "Evenly divisible counts give remainder `0`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "cookies = 17\nbox_size = 5\nprint(cookies // box_size, cookies % box_size)\ncookies = 10\nprint(cookies // box_size, cookies % box_size)",
      },
      {
        title: "Convert Minutes to Hours + Minutes",
        tier: "Core",
        goal: "Convert `total_minutes` into whole hours and remaining minutes (`0..59`).",
        constraints: ["total_minutes >= 0"],
        examples: [
          { input: "total_minutes = 200", output: "3 hours 20 minutes" },
          { input: "total_minutes = 45", output: "0 hours 45 minutes" },
        ],
        tasks: [
          "Compute `hours = total_minutes // 60` and `minutes = total_minutes % 60`.",
          "Print `<hours> hours <minutes> minutes`.",
        ],
        starterCode: "# Exercise M01.3 Core: minutes to hours\ntotal_minutes = 200\n# TODO: compute hours and minutes using // and %\n",
        expectedOutput: "3 hours 20 minutes\n0 hours 45 minutes",
        hint: "When `total_minutes < 60`, `// 60` evaluates to `0`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "total_minutes = 200\nprint(total_minutes // 60, \"hours\", total_minutes % 60, \"minutes\")\n\ntotal_minutes = 45\nprint(total_minutes // 60, \"hours\", total_minutes % 60, \"minutes\")",
      },
      {
        title: "Convert Seconds into Hours, Minutes & Seconds",
        tier: "Stretch",
        goal: "Break `total_seconds` into whole hours, remaining minutes (`0..59`), and leftover seconds (`0..59`).",
        constraints: ["total_seconds >= 0"],
        examples: [
          { input: "total_seconds = 3675", output: "1 hours, 1 minutes, 15 seconds" },
          { input: "total_seconds = 59", output: "0 hours, 0 minutes, 59 seconds" },
        ],
        tasks: [
          "Compute `hours = total_seconds // 3600`.",
          "Compute `minutes = (total_seconds % 3600) // 60` and `seconds = total_seconds % 60`.",
        ],
        starterCode: "# Exercise M01.3 Stretch: HMS duration breakdown\ntotal_seconds = 3675\n# TODO: extract hours, minutes, seconds and print\n",
        expectedOutput: "1 hours, 1 minutes, 15 seconds\n0 hours, 0 minutes, 59 seconds",
        hint: "Mod by `3600` first to isolate remaining seconds inside the current hour.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "total_seconds = 3675\nhours = total_seconds // 3600\nminutes = (total_seconds % 3600) // 60\nseconds = total_seconds % 60\nprint(hours, \"hours,\", minutes, \"minutes,\", seconds, \"seconds\")\n\ntotal_seconds = 59\nhours = total_seconds // 3600\nminutes = (total_seconds % 3600) // 60\nseconds = total_seconds % 60\nprint(hours, \"hours,\", minutes, \"minutes,\", seconds, \"seconds\")",
      },
    ],
  },

  "py-strings-fstrings": {
    lessonId: "py-strings-fstrings",
    subtitle: "Build text with `+`, escapes (`\\n`, `\\t`), raw strings (`r\"...\"`), and f-string formatting (`:.2f`, `:,`).",
    intro: {
      heading: "Readable Strings and f-String Templates",
      explanation: [
        "Building output strings with `+` breaks as soon as a number appears (`\"Age: \" + 25` raises `TypeError`), and Windows file paths like `\"C:\\new\\log.txt\"` silently turn `\\n` into a line break.",
        "Raw strings (`r\"...\"`) keep backslashes literal, while an `f\"...\"` template places any variable or calculation inside `{...}` braces with display formatting like `{price:,.2f}`.",
      ],
      analogy:
        "An f-string works like a printed shipping label with blank boxes (`{name}`, `{total:,.2f}`): you write the layout once and Python fills each box with formatted values.",
      realWorldUses: [
        "Formatting currency totals (`:,.2f`), pass rates (`:.1%`), and summary reports in automated scripts",
        "Keeping Windows file paths (`r\"C:\\new\\data.csv\"`) intact without `\\n` or `\\t` turning into whitespace",
      ],
    },
    sections: [
      {
        heading: "Concatenation (`+`), Quotes, Escapes (`\\n`, `\\t`) & Raw Strings",
        paragraphs: [
          "Characters inside quotes form a `str`. Join strings with `+`, repeat symbols with `*`, and count characters with `len(...)` (`\"text\"` has `4`). Note the difference between an empty string `\"\"` (`len(\"\") == 0`) and a single space `\" \"` (`len(\" \") == 1`).",
          "Wrap apostrophes in double quotes (`\"It's fine\"`), use backslash escapes (`\\n` newline, `\\t` tab, `\\\"` literal quote) inside text, and use triple quotes `\"\"\"...\"\"\"` for multi-line blocks. For Windows paths (`C:\\new\\file`), prefix with `r` (`r\"C:\\new\\file\"`) so backslashes stay literal instead of becoming newlines.",
        ],
        code: [
          "full = \"Ada\" + \" \" + \"Lovelace\"",
          "print(full, len(full))",
          "print(len(\"\"), len(\" \"))",
          "print(\"It's fine!\", \"She said \\\"hi\\\"\")",
          "print(r\"C:\\new\\file\")",
          "print(\"Line 1\\nLine 2\")",
          "print(\"-\" * 10)",
        ],
        output: "Ada Lovelace 12\n0 1\nIt's fine! She said \"hi\"\nC:\\new\\file\nLine 1\nLine 2\n----------",
      },
      {
        heading: "f-Strings & Format Specifiers (`:.2f`, `:,`, Align)",
        paragraphs: [
          "Place `f` right before the opening quote (`f\"...\"`) and drop any variable or expression inside `{...}` curly braces. f-strings convert values automatically, avoiding `TypeError`.",
          "After a colon `:` inside `{...}`, format numbers clearly: `:.2f` fixes 2 decimal places (`3.85`), `:,` inserts thousands separators (`12,500`), and `:,.2f` combines both (`1,250.50`).",
        ],
        table: {
          caption: "Common f-String Format Specifiers",
          headers: ["Pattern", "Input Value", "Formatted Output", "Common Use"],
          rows: [
            ["`{val:.2f}`", "`3.846`", "`3.85`", "Prices, GPAs, averages"],
            ["`{val:,}`", "`12500`", "`12,500`", "Counts, views, totals"],
            ["`{val:,.2f}`", "`1250.5`", "`1,250.50`", "Currency totals"],
            ["`{val:.1%}`", "`0.875`", "`87.5%`", "Ratios and pass rates"],
          ],
          highlightCol: 2,
        },
        code: [
          "name = \"Sam\"",
          "gpa = 3.846",
          "views = 12500",
          "print(f\"{name}: GPA {gpa:.2f} | Views: {views:,}\")",
          "print(f\"Ratio: {7 / 8:.1%}\")",
        ],
        output: "Sam: GPA 3.85 | Views: 12,500\nRatio: 87.5%",
      },
    ],
    guidedBuildUp: {
      title: "Build a Formatted Report Line Step by Step",
      subtitle: "Combine literal raw paths with formatted numeric fields in one f-string.",
      steps: [
        {
          label: "Step 1: Store name, raw path & GPA",
          explanation: "Prefix Windows paths with `r` so `\\n` stays a literal backslash + `n` instead of breaking onto a new line.",
          code: [
            "name = \"Sam\"",
            "path = r\"C:\\new\\log.txt\"",
            "gpa = 3.846",
            "print(path)",
          ],
          activeLines: [1, 2, 3, 4],
          output: "C:\\new\\log.txt",
        },
        {
          label: "Step 2: Format GPA with `f\"...\"` & `:.2f`",
          explanation: "Place `{name}`, `{gpa:.2f}`, and `{path}` inside one `f\"...\"` template so numbers convert without `TypeError`.",
          code: [
            "name = \"Sam\"",
            "path = r\"C:\\new\\log.txt\"",
            "gpa = 3.846",
            "print(f\"{name}: {gpa:.2f} -> {path}\")",
          ],
          activeLines: [4],
          output: "Sam: 3.85 -> C:\\new\\log.txt",
        },
        {
          label: "Step 3: Add `:,` thousands grouping & border line",
          explanation: "Add `views = 12500` formatted as `{views:,}` and repeat `\"-\"` with `*` to frame the report line.",
          code: [
            "name = \"Sam\"",
            "path = r\"C:\\new\\log.txt\"",
            "gpa = 3.846",
            "views = 12500",
            "print(\"-\" * 44)",
            "print(f\"{name}: {gpa:.2f} | {views:,} views -> {path}\")",
          ],
          activeLines: [4, 5, 6],
          output: "--------------------------------------------\nSam: 3.85 | 12,500 views -> C:\\new\\log.txt",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Raw Strings, f-String Expressions & Format Specifiers",
      steps: [
        {
          title: "Concatenate strings with a space separator",
          tag: "CONCEPT",
          explanation: ["`\"Ada\" + \" \" + \"Lovelace\"` builds a `12`-character `str` including the middle space."],
          code: ["full = \"Ada\" + \" \" + \"Lovelace\"", "path = r\"C:\\new\\notes.txt\"", "gpa = 3.846", "views = 12500", "print(f\"{full} ({gpa:.2f}) -> {views:,}\")"],
          activeLines: [1],
          state: [
            { name: "full", value: "\"Ada Lovelace\"", changed: true },
            { name: "len(full)", value: "12", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Concatenation builds a new str object from three pieces.",
            nodes: [
              { id: "p1", label: "'Ada'", sublabel: "len 3" },
              { id: "p2", label: "' ' + 'Lovelace'", sublabel: "len 9" },
              { id: "full", label: "full", sublabel: "'Ada Lovelace' (len 12)", active: true, tone: "ok" },
            ],
            links: [
              { from: "p1", to: "full", active: true },
              { from: "p2", to: "full", active: true },
            ],
          },
        },
        {
          title: "Keep Windows backslashes literal with `r\"...\"`",
          tag: "CONCEPT",
          explanation: ["Without `r`, `\\n` inside `\"C:\\new\"` splits across lines. With `r`, both backslashes stay intact."],
          code: ["full = \"Ada\" + \" \" + \"Lovelace\"", "path = r\"C:\\new\\notes.txt\"", "gpa = 3.846", "views = 12500", "print(f\"{full} ({gpa:.2f}) -> {views:,}\")"],
          activeLines: [2],
          state: [{ name: "path", value: "\"C:\\\\new\\\\notes.txt\"", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Prefixing r keeps \\n as literal characters instead of turning it into a newline.",
            nodes: [
              { id: "raw", label: "r\"C:\\new\\notes.txt\"", sublabel: "raw prefix", active: true, tone: "accent" },
              { id: "out", label: "C:\\new\\notes.txt", sublabel: "backslashes kept", tone: "ok" },
            ],
            links: [{ from: "raw", to: "out", label: "no escape", active: true }],
          },
        },
        {
          title: "Evaluate `:.2f` rounding and `:,` grouping inside `{...}`",
          tag: "CONCEPT",
          explanation: ["`3.846` rounds to `3.85` at display time while `gpa` itself remains `3.846`."],
          code: ["full = \"Ada\" + \" \" + \"Lovelace\"", "path = r\"C:\\new\\notes.txt\"", "gpa = 3.846", "views = 12500", "print(f\"{full} ({gpa:.2f}) -> {views:,}\")"],
          activeLines: [3, 4],
          state: [
            { name: "gpa", value: "3.846", changed: true },
            { name: "views", value: "12500", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Format specifiers round 3.846 -> 3.85 and group 12500 -> 12,500 when formatted.",
            nodes: [
              { id: "g", label: "gpa = 3.846", sublabel: ":.2f -> 3.85", active: true, tone: "accent" },
              { id: "v", label: "views = 12500", sublabel: ":, -> 12,500", active: true, tone: "ok" },
            ],
            links: [{ from: "g", to: "v", label: "inputs ready", active: true }],
          },
        },
        {
          title: "Assemble final formatted output line",
          tag: "CHECK",
          explanation: ["Every `{...}` slot formats independently into one string."],
          code: ["full = \"Ada\" + \" \" + \"Lovelace\"", "path = r\"C:\\new\\notes.txt\"", "gpa = 3.846", "views = 12500", "print(f\"{full} ({gpa:.2f}) -> {views:,}\")"],
          activeLines: [5],
          state: [{ name: "printed", value: "\"Ada Lovelace (3.85) -> 12,500\"", changed: true }],
          output: "Ada Lovelace (3.85) -> 12,500",
          visual: {
            kind: "pipeline",
            caption: "Specifiers :.2f and :, format numbers into the final output string.",
            nodes: [
              { id: "in", label: "{full}, {gpa:.2f}, {views:,}", sublabel: "3 placeholders", active: true, tone: "accent" },
              { id: "out", label: "stdout", sublabel: "Ada Lovelace (3.85) -> 12,500", tone: "ok" },
            ],
            links: [{ from: "in", to: "out", label: "render", active: true }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Forgetting `f` before `\"Hello {name}\"`",
        detail: "Without the leading `f`, Python prints curly braces literally (`Hello {name}`).",
      },
      {
        title: "Using `\\n` inside a Windows file path without `r`",
        detail: "`\"C:\\new\"` interprets `\\n` as a newline break; always prefix raw paths with `r\"...\"`.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(len(\"\"), len(\" \"))` print?",
        code: "print(len(\"\"), len(\" \"))",
        options: [
          { id: "a", label: "`0 0`" },
          { id: "b", label: "`0 1`" },
          { id: "c", label: "`1 1`" },
        ],
        correctId: "b",
        explanation: "`\"\"` has zero characters (`0`), while a single space `\" \"` has length `1`.",
      },
      {
        prompt: "What does `print(f\"${1234.5:,.2f}\")` output?",
        code: "print(f\"${1234.5:,.2f}\")",
        options: [
          { id: "a", label: "`$1,234.50`" },
          { id: "b", label: "`$1234.5`" },
          { id: "c", label: "`$1,234.5`" },
        ],
        correctId: "a",
        explanation: "`,.2f` adds a thousands comma and forces 2 decimal places (`1,234.50`).",
      },
    ],
    practiceTask: {
      title: "Warmup: f-String Profile Line",
      tier: "Warmup",
      goal: "Format `(name, score)` into `\"<name> scored <score:.2f>%\"`.",
      constraints: ["Round score with :.2f inside an f-string"],
      examples: [
        { input: "name = \"Sam\", score = 94.567", output: "Sam scored 94.57%" },
        { input: "name = \"Ada\", score = 100", output: "Ada scored 100.00%" },
      ],
      tasks: [
        "Assign `name = \"Sam\"` and `score = 94.567`.",
        "Print `f\"{name} scored {score:.2f}%\"` for both test cases.",
      ],
      starterCode: "# Exercise M01.5 Warmup: formatted percentage\nname = \"Sam\"\nscore = 94.567\n# TODO: print formatted percentage using :.2f\n",
      expectedOutput: "Sam scored 94.57%\nAda scored 100.00%",
      hint: "Place `:.2f` directly after `score` inside `{score:.2f}`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "name = \"Sam\"\nscore = 94.567\nprint(f\"{name} scored {score:.2f}%\")\n\nname = \"Ada\"\nscore = 100\nprint(f\"{name} scored {score:.2f}%\")",
    },
    practiceChallenges: [
      {
        title: "Core: Raw Path & Escape Label",
        tier: "Core",
        goal: "Print a formatted summary pairing a user label, view count (`:,`), and raw file path without escape corruption.",
        constraints: ["Do not alter backslashes in path"],
        examples: [
          { input: "user = \"Mia\", views = 14200, path = r\"C:\\notes\\todo.txt\"", output: "Mia | 14,200 | C:\\notes\\todo.txt" },
          { input: "user = \"Bo\", views = 0, path = r\"D:\\log.txt\"", output: "Bo | 0 | D:\\log.txt" },
        ],
        tasks: [
          "Assign `user`, `views`, and a raw string `path = r\"C:\\notes\\todo.txt\"`.",
          "Print `f\"{user} | {views:,} | {path}\"` for both sample inputs.",
        ],
        starterCode: "# Exercise M01.5 Core: raw path + view count\nuser = \"Mia\"\nviews = 14200\npath = r\"C:\\notes\\todo.txt\"\n# TODO: print summary with thousands separator\n",
        expectedOutput: "Mia | 14,200 | C:\\notes\\todo.txt\nBo | 0 | D:\\log.txt",
        hint: "Interpolate `{path}` directly; raw string literals already store literal backslashes.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "user = \"Mia\"\nviews = 14200\npath = r\"C:\\notes\\todo.txt\"\nprint(f\"{user} | {views:,} | {path}\")\n\nuser = \"Bo\"\nviews = 0\npath = r\"D:\\log.txt\"\nprint(f\"{user} | {views:,} | {path}\")",
      },
      {
        title: "Stretch: Invoice Banner Builder",
        tier: "Stretch",
        goal: "Print a dashed border (`\"-\" * width`), an item total formatted as `:,.2f`, and another dashed border on 3 lines using escapes.",
        constraints: ["1 <= width <= 40", "Format price with :,.2f"],
        examples: [
          { input: "item = \"Monitor\", total = 1299.5, width = 20", output: "--------------------\nMonitor: $1,299.50\n--------------------" },
          { input: "item = \"USB\", total = 9.0, width = 5", output: "-----\nUSB: $9.00\n-----" },
        ],
        tasks: [
          "Build `line = \"-\" * width`.",
          "Print `f\"{line}\\n{item}: ${total:,.2f}\\n{line}\"`.",
        ],
        starterCode: "# Exercise M01.5 Stretch: multi-line receipt banner\nitem = \"Monitor\"\ntotal = 1299.5\nwidth = 20\n# TODO: print 3-line bordered receipt\n",
        expectedOutput: "--------------------\nMonitor: $1,299.50\n--------------------\n-----\nUSB: $9.00\n-----",
        hint: "Join the 3 lines using `\\n` inside one f-string.",
        complexity: { time: "O(w)", space: "O(w)" },
        solutionCode:
          "item = \"Monitor\"\ntotal = 1299.5\nwidth = 20\nline = \"-\" * width\nprint(f\"{line}\\n{item}: ${total:,.2f}\\n{line}\")\n\nitem = \"USB\"\ntotal = 9.0\nwidth = 5\nline = \"-\" * width\nprint(f\"{line}\\n{item}: ${total:,.2f}\\n{line}\")",
      },
    ],
  },

  "py-input-casting": {
    lessonId: "py-input-casting",
    subtitle: "Read user text with `input()` and convert between `str`, `int`, `float`, and `bool`.",
    intro: {
      heading: "Converting User Input Into Typed Values",
      explanation: [
        "Calling `input()` when a user types `3` returns the text `\"3\"`, so `\"3\" * 2` produces `\"33\"` instead of `6` and `\"5\" + \"3\"` produces `\"53\"`. Passing decimal text like `\"24.50\"` straight to `int()` also crashes with `ValueError`.",
        "Explicitly casting at the input boundary with `int()`, `float()`, or `bool()` converts raw text into real numeric and boolean values before calculations run.",
      ],
      analogy:
        "`input()` works like a paper order slip where every entry arrives written in pencil text: `\"3\"` looks like a number to humans, so `int()` or `float()` translates that text into a quantity before arithmetic runs.",
      realWorldUses: [
        "CLI forms and prompt scripts parsing numeric flags or prices",
        "Cleaning CSV/JSON string fields before arithmetic or comparisons",
      ],
    },
    sections: [
      {
        heading: "`input()` Always Returns `str`",
        paragraphs: [
          "`input(\"Age: \")` prints the prompt, waits for Enter, and returns a `str`. Keeping a trailing space inside `\"Age: \"` prevents typed text from colliding with the colon.",
          "Because `+` joins two strings (`\"5\" + \"3\" == \"53\"`), convert text into `int` or `float` before arithmetic.",
        ],
        code: [
          "raw_qty = \"3\"             # input() returns str, even for digits",
          "# Bug: multiplying raw str \"3\" repeats text instead of multiplying numbers",
          "print(raw_qty * 2)        # \"33\" (string repetition trap!)",
          "# Fix: cast with int() and float() before arithmetic",
          "raw_price = \"4.50\"",
          "qty = int(raw_qty)",
          "price = float(raw_price)",
          "print(f\"Total: ${qty * price:.2f}\")",
        ],
        output: "33\nTotal: $13.50",
      },
      {
        heading: "Type Casting Rules & Classic Traps (`int`, `float`, `str`, `bool`)",
        paragraphs: [
          "`int(x)` truncates floats toward zero (`int(3.9) == 3`) and parses integer strings (`int(\"42\") == 42`), but raises `ValueError` on decimal strings like `int(\"3.5\")`.",
          "`bool(x)` returns `False` only for zero numbers (`0`, `0.0`), empty text (`\"\"`), and `None` (later in Modules 3 and 6, empty lists `[]` and dicts `{}` are also `False`). Any non-empty string, including `\"0\"` and `\"False\"`, casts to `True`.",
        ],
        table: {
          caption: "Type Casting Functions (`int`, `float`, `str`, `bool`) Reference",
          headers: ["Cast Function", "Works On", "Trap / Edge Case", "Typical Use"],
          rows: [
            ["`int(x)`", "`\"42\"` -> `42`, `3.9` -> `3`", "`int(\"3.5\")` raises `ValueError`", "Counts, IDs, indices"],
            ["`float(x)`", "`\"3.5\"` -> `3.5`, `4` -> `4.0`", "`float(\"abc\")` raises `ValueError`", "Prices, ratios, metrics"],
            ["`str(x)`", "Any object (`42` -> `\"42\"`)", "Needed with `+` concatenation", "Text building, logging"],
            ["`bool(x)`", "`0`, `\"\"`, `None` -> `False`", "`bool(\"0\")` is `True`", "Emptiness & presence checks"],
          ],
          highlightCol: 2,
        },
        code: [
          "# Bug: int(\"24.50\") -> ValueError: invalid literal for int() with base 10: '24.50'",
          "# Fix: parse decimal text with float() first (then int() if you want truncation)",
          "bill = float(\"24.50\")",
          "print(bill, int(bill))     # 24.5 24",
          "print(bool(\"0\"), bool(0))  # True False (non-empty str is True)",
        ],
        output: "24.5 24\nTrue False",
        visual: {
          kind: "type-cast-lab",
          caption: "Click each sample value to inspect outputs and ValueError edge cases across int(), float(), str(), and bool()",
          items: [
            {
              raw: "\"42\"",
              typeLabel: "str",
              asInt: "42",
              asFloat: "42.0",
              asStr: "'42'",
              asBool: "True",
              note: "Whole-number strings convert with int() and float(). Any non-empty string gives bool() == True.",
            },
            {
              raw: "\"3.5\"",
              typeLabel: "str",
              asInt: "ValueError!",
              asFloat: "3.5",
              asStr: "'3.5'",
              asBool: "True",
              note: "Trap: int('3.5') raises ValueError. Convert with float('3.5') first (then int() if truncating).",
            },
            {
              raw: "3.9",
              typeLabel: "float",
              asInt: "3",
              asFloat: "3.9",
              asStr: "'3.9'",
              asBool: "True",
              note: "int(3.9) drops the decimal part (3) rather than rounding up to 4.",
            },
            {
              raw: "\"\"",
              typeLabel: "str",
              asInt: "ValueError!",
              asFloat: "ValueError!",
              asStr: "''",
              asBool: "False",
              note: "An empty string is falsy (bool('') == False) and cannot parse as a number.",
            },
            {
              raw: "0",
              typeLabel: "int",
              asInt: "0",
              asFloat: "0.0",
              asStr: "'0'",
              asBool: "False",
              note: "Numeric 0 is falsy, whereas string '0' has length 1 so bool('0') is True.",
            },
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build a Tip & Cost Input Calculator Step by Step",
      subtitle: "Turn raw string inputs into numeric math without string-repeat bugs or ValueError.",
      steps: [
        {
          label: "Step 1: Inspect raw strings from `input()`",
          explanation: "`input()` always hands back `str`, so `raw_qty * 2` repeats `\"33\"` instead of multiplying.",
          code: [
            "raw_qty = \"3\"       # from input()",
            "raw_price = \"4.50\"  # from input()",
            "print(raw_qty * 2)  # Bug if uncast: prints \"33\"",
          ],
          activeLines: [1, 2, 3],
          output: "33",
        },
        {
          label: "Step 2: Cast to `int` and `float` before arithmetic",
          explanation: "Convert `raw_qty` with `int()` and `raw_price` with `float()`, then compute the real numeric subtotal.",
          code: [
            "raw_qty = \"3\"",
            "raw_price = \"4.50\"",
            "qty = int(raw_qty)",
            "price = float(raw_price)",
            "subtotal = qty * price",
            "print(subtotal)",
          ],
          activeLines: [3, 4, 5, 6],
          output: "13.5",
        },
        {
          label: "Step 3: Add tip percentage (`int`) & format output",
          explanation: "Parse `raw_tip = \"10\"` with `int()`, compute the tip, and format the grand total to 2 decimals.",
          code: [
            "raw_qty = \"3\"",
            "raw_price = \"4.50\"",
            "raw_tip = \"10\"",
            "qty = int(raw_qty)",
            "price = float(raw_price)",
            "subtotal = qty * price",
            "tip = subtotal * (int(raw_tip) / 100)",
            "print(f\"Total with tip: ${subtotal + tip:.2f}\")",
          ],
          activeLines: [3, 7, 8],
          output: "Total with tip: $14.85",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Numeric Input Parsing and Truthiness",
      steps: [
        {
          title: "Receive raw strings from input",
          tag: "CONCEPT",
          explanation: ["Simulate user text arriving as `str`: `raw_qty = \"3\"`, `raw_bill = \"24.50\"`, `raw_flag = \"0\"`."],
          code: ["raw_qty = \"3\"", "raw_bill = \"24.50\"", "qty = int(raw_qty)", "bill = float(raw_bill)", "flag = bool(\"0\")", "print(qty, bill, flag)"],
          activeLines: [1, 2],
          state: [
            { name: "raw_qty", value: "\"3\"", changed: true },
            { name: "raw_bill", value: "\"24.50\"", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "input() always delivers str objects even when the characters are digits.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "raw_qty", targetId: "sq", highlight: true },
                  { label: "raw_bill", targetId: "sb", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "sq", typeLabel: "str", value: "'3'", highlight: true },
              { id: "sb", typeLabel: "str", value: "'24.50'", highlight: true },
            ],
          },
        },
        {
          title: "Parse whole count with `int()` and decimal with `float()`",
          tag: "CONCEPT",
          explanation: ["`\"24.50\"` contains a decimal point, so `float()` parses it while `int(\"24.50\")` raises `ValueError`."],
          code: ["raw_qty = \"3\"", "raw_bill = \"24.50\"", "qty = int(raw_qty)", "bill = float(raw_bill)", "flag = bool(\"0\")", "print(qty, bill, flag)"],
          activeLines: [3, 4],
          state: [
            { name: "qty", value: "3 (int)", changed: true },
            { name: "bill", value: "24.5 (float)", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "int() and float() create numeric objects while raw_qty and raw_bill stay str.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "raw_qty", targetId: "sq" },
                  { label: "raw_bill", targetId: "sb" },
                  { label: "qty", targetId: "iq", highlight: true },
                  { label: "bill", targetId: "fb", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "sq", typeLabel: "str", value: "'3'" },
              { id: "sb", typeLabel: "str", value: "'24.50'" },
              { id: "iq", typeLabel: "int", value: "3", highlight: true },
              { id: "fb", typeLabel: "float", value: "24.5", highlight: true },
            ],
          },
        },
        {
          title: "Watch `bool(\"0\")` stay `True`",
          tag: "PITFALL",
          explanation: ["`\"0\"` is a 1-character string, not empty `\"\"`, so `bool(\"0\")` evaluates to `True`."],
          code: ["raw_qty = \"3\"", "raw_bill = \"24.50\"", "qty = int(raw_qty)", "bill = float(raw_bill)", "flag = bool(\"0\")", "print(qty, bill, flag)"],
          activeLines: [5],
          state: [{ name: "flag", value: "True", changed: true }],
          visual: {
            kind: "memory",
            caption: "bool('0') checks string length (1 char -> True), not numeric value.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "qty", targetId: "iq" },
                  { label: "bill", targetId: "fb" },
                  { label: "flag", targetId: "bf", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "iq", typeLabel: "int", value: "3" },
              { id: "fb", typeLabel: "float", value: "24.5" },
              { id: "bf", typeLabel: "bool (from '0')", value: "True", highlight: true },
            ],
          },
        },
        {
          title: "Print typed values",
          tag: "CHECK",
          explanation: ["All three variables hold their converted Python types."],
          code: ["raw_qty = \"3\"", "raw_bill = \"24.50\"", "qty = int(raw_qty)", "bill = float(raw_bill)", "flag = bool(\"0\")", "print(qty, bill, flag)"],
          activeLines: [6],
          state: [{ name: "output", value: "3 24.5 True", changed: true }],
          output: "3 24.5 True",
          visual: {
            kind: "memory",
            caption: "All three converted objects keep their typed values ready for arithmetic or display.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "qty", targetId: "iq", highlight: true },
                  { label: "bill", targetId: "fb", highlight: true },
                  { label: "flag", targetId: "bf", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "iq", typeLabel: "int", value: "3", highlight: true },
              { id: "fb", typeLabel: "float", value: "24.5", highlight: true },
              { id: "bf", typeLabel: "bool", value: "True", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Calling `int(\"3.5\")` on decimal text",
        detail: "`int()` parses integer strings only (`\"42\"`). Parse decimals with `float(\"3.5\")` first.",
      },
      {
        title: "Expecting `bool(\"0\")` or `bool(\"False\")` to be `False`",
        detail: "Non-empty strings always evaluate to `True` under `bool()`. Compare exact expected text (`s == \"true\"` or `s == \"True\"`) when parsing flags; in Module 4 you will normalize mixed casing with `.lower()`.",
      },
    ],
    predictChecks: [
      {
        prompt: "Suppose the user enters `5` then `3`. What does `print(a + b)` print?",
        code: "a = \"5\"   # from input()\nb = \"3\"   # from input()\nprint(a + b)",
        options: [
          { id: "a", label: "`8`" },
          { id: "b", label: "`53`" },
          { id: "c", label: "`5 + 3`" },
        ],
        correctId: "b",
        explanation: "`input()` always returns `str`, so `\"5\" + \"3\"` concatenates strings to `\"53\"`.",
      },
      {
        prompt: "What does `print(int(3.9), bool(\"0\"))` output?",
        code: "print(int(3.9), bool(\"0\"))",
        options: [
          { id: "a", label: "`4 False`" },
          { id: "b", label: "`3 False`" },
          { id: "c", label: "`3 True`" },
        ],
        correctId: "c",
        explanation: "`int(3.9)` truncates toward zero (`3`), and non-empty `\"0\"` has `bool(\"0\") == True`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Cast String Inputs for Total Cost",
      tier: "Warmup",
      goal: "Convert string inputs `raw_qty` (`int`) and `raw_price` (`float`) to compute `f\"${qty * price:.2f}\"`.",
      constraints: ["raw_qty holds digits only", "raw_price may contain decimals"],
      examples: [
        { input: "raw_qty = \"4\", raw_price = \"2.5\"", output: "$10.00" },
        { input: "raw_qty = \"0\", raw_price = \"9.99\"", output: "$0.00" },
      ],
      tasks: [
        "Cast `raw_qty` with `int()` and `raw_price` with `float()`.",
        "Print `f\"${qty * price:.2f}\"` for both cases.",
      ],
      starterCode: "# Exercise M01.6 Warmup: string to number casting\nraw_qty = \"4\"\nraw_price = \"2.5\"\n# TODO: cast inputs and print formatted cost\n",
      expectedOutput: "$10.00\n$0.00",
      hint: "Compute `int(raw_qty) * float(raw_price)` inside the f-string or a temporary variable.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "print(f\"${int(\"4\") * float(\"2.5\"):.2f}\")\nprint(f\"${int(\"0\") * float(\"9.99\"):.2f}\")",
    },
    practiceChallenges: [
      {
        title: "Core: Safe Decimal-String Truncation",
        tier: "Core",
        goal: "Convert numeric text that may contain decimals (like `\"19.8\"` or `\"7\"`) into a truncated `int` without raising `ValueError`.",
        constraints: ["Do not use if/else or try/except yet; chain casts"],
        examples: [
          { input: "raw = \"19.8\"", output: "19" },
          { input: "raw = \"7\"", output: "7" },
        ],
        tasks: [
          "Chain `int(float(raw))` so both decimal and whole-number strings work.",
          "Print each resulting `int`.",
        ],
        starterCode: "# Exercise M01.6 Core: truncate decimal string\nraw = \"19.8\"\n# TODO: convert raw to an int without raising ValueError and print\n",
        expectedOutput: "19\n7",
        hint: "`float(\"19.8\")` yields `19.8`, then `int(19.8)` drops `.8`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "print(int(float(\"19.8\")))\nprint(int(float(\"7\")))",
      },
      {
        title: "Stretch: Tip & Total Calculator",
        tier: "Stretch",
        goal: "Convert meal bill (`str`) and tip percentage (`str`), compute tip and grand total, and print `Tip: $<tip> | Total: $<total>`.",
        constraints: ["Bill can have decimals", "Tip percentage is a whole number string"],
        examples: [
          { input: "raw_bill = \"24.00\", raw_tip = \"15\"", output: "Tip: $3.60 | Total: $27.60" },
          { input: "raw_bill = \"10\", raw_tip = \"0\"", output: "Tip: $0.00 | Total: $10.00" },
        ],
        tasks: [
          "Convert `raw_bill` via `float()` and `raw_tip` via `int()`.",
          "Compute `tip = bill * (tip_pct / 100)` and `total = bill + tip`.",
          "Print both values formatted with `:.2f`.",
        ],
        starterCode: "# Exercise M01.6 Stretch: bill and tip formatter\nraw_bill = \"24.00\"\nraw_tip = \"15\"\n# TODO: compute and print tip + total\n",
        expectedOutput: "Tip: $3.60 | Total: $27.60\nTip: $0.00 | Total: $10.00",
        hint: "Watch operator precedence: `bill * (tip_pct / 100)`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "bill = float(\"24.00\")\ntip = bill * (int(\"15\") / 100)\nprint(f\"Tip: ${tip:.2f} | Total: ${bill + tip:.2f}\")\n\nbill = float(\"10\")\ntip = bill * (int(\"0\") / 100)\nprint(f\"Tip: ${tip:.2f} | Total: ${bill + tip:.2f}\")",
      },
    ],
  },
};

export const m01Quiz: ModuleQuiz = {
  moduleId: "py-m1",
  title: "Module 01 Quiz: First Steps",
  description: "10 questions checking `print()` options, core data types, type casting, naming rules, all arithmetic/assignment operators, and `input()`.",
  questions: [
    {
      id: "m1-q1",
      prompt: "What does Python print when you run this line?",
      code: "print(\"2 + 3 =\", 2 + 3)",
      options: [
        { id: "a", label: "`2 + 3 = 2 + 3`" },
        { id: "b", label: "`5 = 5`" },
        { id: "c", label: "`2 + 3 = 5`" },
      ],
      correctId: "c",
      explanation: "Text in quotes prints literally (`2 + 3 =`), comma adds a space, and unquoted `2 + 3` calculates `5`.",
      lessonRefId: "py-hello-print",
    },
    {
      id: "m1-q2",
      prompt: "What does `type(10 / 2)` return in Python?",
      options: [
        { id: "a", label: "`<class 'float'>`" },
        { id: "b", label: "`<class 'int'>`" },
        { id: "c", label: "`<class 'str'>`" },
      ],
      correctId: "a",
      explanation: "Single-slash division `/` always returns a `float` (`5.0`), even when division is exact.",
      lessonRefId: "py-numbers-math",
    },
    {
      id: "m1-q3",
      prompt: "What does `print((4 + 2) * 3 - 1)` output?",
      options: [
        { id: "a", label: "`9`" },
        { id: "b", label: "`17`" },
        { id: "c", label: "`12`" },
      ],
      correctId: "b",
      explanation: "Parentheses evaluate `4 + 2 = 6` first, then `6 * 3 = 18`, then `18 - 1 = 17`.",
      lessonRefId: "py-numbers-math",
    },
    {
      id: "m1-q4",
      prompt: "You have 29 students and vans that hold 6 students each. Which expression gives the `5` leftover students without a full van?",
      options: [
        { id: "a", label: "`29 % 6`" },
        { id: "b", label: "`29 // 6`" },
        { id: "c", label: "`29 / 6`" },
      ],
      correctId: "a",
      explanation: "`29 // 6` gives `4` full vans (24 students); `29 % 6` gives the remainder `5`.",
      lessonRefId: "py-div-mod-power",
    },
    {
      id: "m1-q5",
      prompt: "Which operator computes `3` raised to the power `4` (`81`)?",
      options: [
        { id: "a", label: "`3 ^ 4`" },
        { id: "b", label: "`3 // 4`" },
        { id: "c", label: "`3 ** 4`" },
      ],
      correctId: "c",
      explanation: "Python uses `**` for exponents (`3 ** 4` gives `81`), while `^` is a different operator.",
      lessonRefId: "py-div-mod-power",
    },
    {
      id: "m1-q6",
      prompt: "Which variable name follows valid Python naming rules without overwriting a built-in function?",
      options: [
        { id: "a", label: "`2nd_score`" },
        { id: "b", label: "`user_score`" },
        { id: "c", label: "`first-name`" },
      ],
      correctId: "b",
      explanation: "Variable names cannot start with a digit or contain hyphens (`-`). `snake_case` like `user_score` is standard.",
      lessonRefId: "py-variables-basics",
    },
    {
      id: "m1-q7",
      prompt: "What is printed at the end of these 3 lines?",
      code: "points = 10\npoints += 15\npoints *= 2\nprint(points)",
      options: [
        { id: "a", label: "`25`" },
        { id: "b", label: "`40`" },
        { id: "c", label: "`50`" },
      ],
      correctId: "c",
      explanation: "`10 + 15 = 25`, then `25 * 2 = 50`.",
      lessonRefId: "py-variables-basics",
    },
    {
      id: "m1-q8",
      prompt: "What does `print(a, b)` output after line 3 runs?",
      code: "a = 5\nb = a + 2\na = 10\nprint(a, b)",
      options: [
        { id: "a", label: "`10 7`" },
        { id: "b", label: "`10 12`" },
        { id: "c", label: "`5 7`" },
      ],
      correctId: "a",
      explanation: "Line 2 calculated `b = 7` when `a` was `5`. Reassigning `a = 10` later does not recalculate `b`.",
      lessonRefId: "py-variables-basics",
    },
    {
      id: "m1-q9",
      prompt: "What happens when you run `int(\"3.5\")` vs `int(3.9)`?",
      options: [
        { id: "a", label: "Both return `3`" },
        { id: "b", label: "`int(\"3.5\")` raises `ValueError`, while `int(3.9)` truncates to `3`" },
        { id: "c", label: "Both return `4`" },
      ],
      correctId: "b",
      explanation: "`int()` cannot parse decimal-point strings directly (`ValueError`), and truncates floats toward zero.",
      lessonRefId: "py-input-casting",
    },
    {
      id: "m1-q10",
      prompt: "What type does `input(\"Enter price: \")` return when the user types `19.99`?",
      options: [
        { id: "a", label: "`str` (text)" },
        { id: "b", label: "`float`" },
        { id: "c", label: "`int`" },
      ],
      correctId: "a",
      explanation: "`input()` always returns a `str`; wrap it in `float(...)` before doing math.",
      lessonRefId: "py-input-casting",
    },
  ],
};

export const m01PracticeSet: ModulePracticeSet = {
  moduleId: "py-m1",
  title: "Module 01 Practice Set: Core Types, Math, Strings & Casting",
  description:
    "Four mixed exercises combining operator precedence, remainder division, f-string formatting, and safe numeric casting.",
  problems: [
    {
      id: "py-m1-p1",
      title: "Split Seconds into Calendar Time",
      patternHint: "Use floor division (//) and modulo (%) sequentially from largest unit down to seconds.",
      lessonRefId: "py-div-mod-power",
      goal: "Given integer `total_seconds`, print `<hours>h <minutes>m <seconds>s` without decimal division.",
      constraints: ["0 <= total_seconds <= 10^6"],
      examples: [
        { input: "total_seconds = 7384", output: "2h 3m 4s" },
        { input: "total_seconds = 45", output: "0h 0m 45s" },
      ],
      tasks: [
        "Extract `h = total_seconds // 3600`.",
        "Extract `m = (total_seconds % 3600) // 60` and `s = total_seconds % 60`, then print `f\"{h}h {m}m {s}s\"`.",
      ],
      starterCode: "# Practice M01.1: H/M/S formatter\ntotal_seconds = 7384\n# TODO: compute h, m, s and print formatted duration\n",
      expectedOutput: "2h 3m 4s\n0h 0m 45s",
      hint: "1 hour = 3,600 seconds; modulo `3600` leaves only sub-hour seconds.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "total_seconds = 7384\nh = total_seconds // 3600\nm = (total_seconds % 3600) // 60\ns = total_seconds % 60\nprint(f\"{h}h {m}m {s}s\")\n\ntotal_seconds = 45\nh = total_seconds // 3600\nm = (total_seconds % 3600) // 60\ns = total_seconds % 60\nprint(f\"{h}h {m}m {s}s\")",
    },
    {
      id: "py-m1-p2",
      title: "Safe Order Receipt With Grouping & Currency Formatting",
      patternHint: "Use parentheses before discount multiplication and format totals with :,.2f.",
      lessonRefId: "py-strings-fstrings",
      goal: "Given unit price (text), integer quantity, and discount percentage, print `<qty>x -> $<total>` rounded to 2 decimal places with comma grouping.",
      constraints: ["Parse raw_price via float()", "qty >= 1"],
      examples: [
        { input: "raw_price = \"499.5\", qty = 4, disc_pct = 10", output: "4x -> $1,798.20" },
        { input: "raw_price = \"12.0\", qty = 1, disc_pct = 0", output: "1x -> $12.00" },
      ],
      tasks: [
        "Cast `raw_price` to `float`.",
        "Apply `(price * qty) * (1 - disc_pct / 100)` and print with `:,.2f`.",
      ],
      starterCode: "# Practice M01.2: receipt calculator\nraw_price = \"499.5\"\nqty = 4\ndisc_pct = 10\n# TODO: parse, discount, and print formatted receipt line\n",
      expectedOutput: "4x -> $1,798.20\n1x -> $12.00",
      hint: "Keep `:,.2f` inside the f-string braces to include both commas and 2 decimals.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "total = float(\"499.5\") * 4 * (1 - 10 / 100)\nprint(f\"4x -> ${total:,.2f}\")\n\ntotal = float(\"12.0\") * 1 * (1 - 0 / 100)\nprint(f\"1x -> ${total:,.2f}\")",
    },
    {
      id: "py-m1-p3",
      title: "Fix Shadowed Variable & Augmented Balance Updates",
      patternHint: "Reassign with += and -= rather than overwriting the starting balance or shadowing print.",
      lessonRefId: "py-variables-basics",
      goal: "Compute ending store credit starting from `credit = 200`, adding `deposit`, and spending `cost`.",
      constraints: ["Use augmented assignments", "Do not overwrite starting credit"],
      examples: [
        { input: "start = 200, deposit = 50, cost = 80", output: "170" },
        { input: "start = 0, deposit = 40, cost = 40", output: "0" },
      ],
      tasks: [
        "Update `credit += deposit`, then `credit -= cost`.",
        "Print final `credit`.",
      ],
      starterCode: "# Practice M01.3: running credit balance\ncredit = 200\ndeposit = 50\ncost = 80\n# TODO: apply += and -= and print credit\n",
      expectedOutput: "170\n0",
      hint: "Print `credit` right after applying `+=` and `-=`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "credit = 200\ncredit += 50\ncredit -= 80\nprint(credit)\n\ncredit = 0\ncredit += 40\ncredit -= 40\nprint(credit)",
    },
    {
      id: "py-m1-p4",
      title: "Clean Mixed String Booleans & Numeric Casts",
      patternHint: "Convert decimal strings through float() first and remember any non-empty string has bool(s) == True.",
      lessonRefId: "py-input-casting",
      goal: "Given numeric string `raw_num` and flag string `raw_flag`, compute `int(float(raw_num))` and `bool(raw_flag)` and print both.",
      constraints: ["raw_num represents a valid int or float string"],
      examples: [
        { input: "raw_num = \"42.8\", raw_flag = \"0\"", output: "42 True" },
        { input: "raw_num = \"7\", raw_flag = \"\"", output: "7 False" },
      ],
      tasks: [
        "Parse `raw_num` via `int(float(raw_num))` so both `\"42.8\"` and `\"7\"` succeed.",
        "Print `whole` and `bool(raw_flag)` side by side.",
      ],
      starterCode: "# Practice M01.4: mixed cast & truthiness\nraw_num = \"42.8\"\nraw_flag = \"0\"\n# TODO: safe numeric cast + bool check, then print\n",
      expectedOutput: "42 True\n7 False",
      hint: "`bool(\"0\")` evaluates to `True` because the string has length 1.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "print(int(float(\"42.8\")), bool(\"0\"))\nprint(int(float(\"7\")), bool(\"\"))",
    },
  ],
};
