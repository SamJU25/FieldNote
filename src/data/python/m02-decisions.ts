import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m02Lessons: Record<string, LessonContent> = {
  "py-booleans-compare": {
    lessonId: "py-booleans-compare",
    subtitle: "Work with `bool` (`True` / `False`), the 6 comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`), and chained ranges.",
    intro: {
      heading: "True/False Checks and Comparisons",
      explanation: [
        "Write `if age = 18:` when you meant to test whether `age` equals `18`, and Python halts immediately with a `SyntaxError`. Sort numeric strings like `\"10\"` and `\"2\"` without converting them first, and `\"10\" < \"2\"` reports `True` because text compares character by character from the left.",
        "Every decision in Python reduces to a `bool` value: `True` or `False`. The six comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) test numbers and text explicitly, and you can chain bounds (`13 <= age <= 19`) without repeating the middle variable.",
      ],
      analogy: "A thermostat does not guess whether a room feels warm; it reads a sensor and flips a switch to on (`True`) or off (`False`) once the reading crosses a threshold.",
      realWorldUses: [
        "Validating numeric thresholds such as age limits, exam cutoffs, and free-shipping minimums",
        "Checking whether sensor readings or scores fall inside bounds using `0 <= score <= 100`",
      ],
    },
    sections: [
      {
        heading: "Booleans (`True` / `False`) & Comparison Operators",
        paragraphs: [
          "Answers to yes/no expressions belong to type `bool`, which holds only `True` or `False` (capital `T` and `F`, no quotes).",
          "Use Python's six comparison operators to compare numbers or text and receive a `bool`. Every operator below appears constantly across conditions and filters.",
        ],
        table: {
          caption: "Python Comparison Operators",
          headers: ["Operator", "Meaning", "Example", "Result"],
          rows: [
            ["`==`", "Equal to (value comparison)", "`10 == 10.0`", "`True`"],
            ["`!=`", "Not equal to", "`\"admin\" != \"guest\"`", "`True`"],
            ["`<`", "Less than", "`15 < 18`", "`True`"],
            ["`<=`", "Less than or equal to", "`18 <= 18`", "`True`"],
            ["`>`", "Greater than", "`4 > 9`", "`False`"],
            ["`>=`", "Greater than or equal to", "`60 >= 60`", "`True`"],
          ],
          highlightCol: 3,
        },
        code: [
          "age = 18",
          "print(age >= 18)             # True",
          "print(age == 21)             # False",
          "print(\"cat\" != \"dog\")        # True",
          "print(13 <= age <= 19)       # Chained range -> True",
          "print(\"10\" < \"2\")            # Broken for numbers -> True ('1' < '2')",
          "print(int(\"10\") < int(\"2\"))  # Working numeric check -> False",
        ],
        output: "True\nFalse\nTrue\nTrue\nTrue\nFalse",
        callout: {
          kind: "WATCH OUT",
          text: "`=` assigns a value (`x = 5`), whereas `==` checks equality (`x == 5`). Also cast numeric strings before comparing: `\"10\" < \"2\"` is `True` alphabetically because `'1'` comes before `'2'`.",
        },
      },
      {
        heading: "Chained Range Comparisons (`a <= x <= b`) & Valid vs Invalid Checks",
        paragraphs: [
          "Unlike many C-family languages, Python lets you chain comparisons (`18 <= temp <= 26`) just as you write them on paper.",
          "`18 <= temp <= 26` checks `18 <= temp` and `temp <= 26`, evaluating `temp` only once. Watch out for single `=` inside conditions (`SyntaxError`) and uncast numeric strings.",
        ],
        code: [
          "temp = 22",
          "print(18 <= temp <= 26)      # Valid range check -> True",
          "print(\"5\" == 5)              # False (str vs int never coerces)",
          "",
          "# Invalid: single '=' assigns instead of comparing",
          "# if temp = 22:              -> SyntaxError: invalid syntax",
          "",
          "# Valid: double '==' tests equality",
          "print(temp == 22)            # True",
        ],
        output: "True\nFalse\nTrue",
        visual: {
          kind: "operator-lab",
          caption: "Click each comparison preset to inspect value equality, mixed types, and string ordering",
          presets: [
            {
              label: "10 == 10.0",
              left: "10",
              op: "==",
              right: "10.0",
              result: "True",
              typeName: "bool",
              frequency: "Daily",
              note: "== checks numeric value equality, so int 10 equals float 10.0.",
            },
            {
              label: "\"5\" == 5",
              left: "\"5\"",
              op: "==",
              right: "5",
              result: "False",
              typeName: "bool",
              frequency: "Daily",
              note: "Text '5' and number 5 never compare equal because they belong to different types.",
            },
            {
              label: "18 <= 24 <= 26",
              left: "18 <= 24",
              op: "and",
              right: "24 <= 26",
              result: "True",
              typeName: "bool",
              frequency: "Daily",
              note: "Chained comparisons test both bounds without repeating the middle variable.",
            },
            {
              label: "\"10\" < \"2\"",
              left: "\"10\"",
              op: "<",
              right: "\"2\"",
              result: "True",
              typeName: "bool",
              frequency: "Classic Bug",
              note: "Strings compare left-to-right character by character; '1' comes before '2'. Cast to int first.",
            },
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build an Age & Score Eligibility Check Step by Step",
      subtitle: "Start with one threshold test, chain an inclusive range, then cast raw text before ordering.",
      steps: [
        {
          label: "Step 1: Test one threshold with >=",
          explanation: "Assign `age = 18` and check whether `age >= 18`. Use `==` or `>=` to compare values (`=` only assigns).",
          code: [
            "age = 18",
            "print(\"Adult:\", age >= 18)",
          ],
          activeLines: [1, 2],
          output: "Adult: True",
        },
        {
          label: "Step 2: Chain an inclusive range",
          explanation: "Test whether `score` sits between `60` and `100` inclusive with one chained comparison `60 <= score <= 100`.",
          code: [
            "age = 18",
            "score = 84",
            "print(\"Adult:\", age >= 18)",
            "print(\"Passing:\", 60 <= score <= 100)",
          ],
          activeLines: [2, 4],
          output: "Adult: True\nPassing: True",
        },
        {
          label: "Step 3: Cast raw text before comparing",
          explanation: "Convert text input `raw_rank = \"10\"` with `int()` before comparing against `2`, avoiding alphabetical string ordering.",
          code: [
            "age = 18",
            "score = 84",
            "raw_rank = \"10\"",
            "print(\"Adult:\", age >= 18)",
            "print(\"Passing:\", 60 <= score <= 100)",
            "print(\"Top 2:\", int(raw_rank) <= 2)",
          ],
          activeLines: [3, 6],
          output: "Adult: True\nPassing: True\nTop 2: False",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Numeric, Chained, and String Comparisons",
      steps: [
        {
          title: "Compare integers and floats with `==` and `>=`",
          tag: "TRACE",
          explanation: ["`10 == 10.0` evaluates numeric value equality (`True`); `score >= 60` tests the inclusive threshold."],
          code: ["score = 60", "print(score >= 60, 10 == 10.0)", "print(13 <= 18 <= 19)", "print(\"5\" == 5)", "print(\"10\" < \"2\")"],
          activeLines: [1, 2],
          state: [
            { name: "score >= 60", value: "True", changed: true },
            { name: "10 == 10.0", value: "True", changed: true },
          ],
          output: "True True",
          visual: {
            kind: "trace",
            caption: "Numeric comparisons ignore int vs float differences when comparing values.",
            branches: [
              { id: "c1", label: "60 >= 60 -> True", status: "true" },
              { id: "c2", label: "10 == 10.0 -> True (equal values)", status: "true" },
            ],
          },
        },
        {
          title: "Evaluate chained bounds left-to-right",
          tag: "CONCEPT",
          explanation: ["`13 <= 18 <= 19` is `True` only if both `13 <= 18` and `18 <= 19` hold."],
          code: ["score = 60", "print(score >= 60, 10 == 10.0)", "print(13 <= 18 <= 19)", "print(\"5\" == 5)", "print(\"10\" < \"2\")"],
          activeLines: [3],
          state: [{ name: "13 <= 18 <= 19", value: "True", changed: true }],
          output: "True True\nTrue",
          visual: {
            kind: "trace",
            caption: "Chained comparison expands to (13 <= 18) and (18 <= 19).",
            branches: [
              { id: "b1", label: "13 <= 18 -> True", status: "true" },
              { id: "b2", label: "18 <= 19 -> True", status: "true" },
            ],
          },
        },
        {
          title: "Compare incompatible types (`\"5\" == 5`)",
          tag: "CONCEPT",
          explanation: ["Comparing `str` to `int` with `==` returns `False` directly without converting either side (unlike JavaScript)."],
          code: ["score = 60", "print(score >= 60, 10 == 10.0)", "print(13 <= 18 <= 19)", "print(\"5\" == 5)", "print(\"10\" < \"2\")"],
          activeLines: [4],
          state: [{ name: "\"5\" == 5", value: "False", changed: true }],
          output: "True True\nTrue\nFalse",
          visual: {
            kind: "trace",
            caption: "== refuses to coerce '5' (str) into 5 (int), so it returns False.",
            branches: [
              { id: "t1", label: "'5' (str) == 5 (int) -> False", status: "false" },
            ],
          },
        },
        {
          title: "Catch lexicographic string ordering",
          tag: "PITFALL",
          explanation: ["`'1'` comes before `'2'` in Unicode order, so `\"10\" < \"2\"` evaluates to `True`."],
          code: ["score = 60", "print(score >= 60, 10 == 10.0)", "print(13 <= 18 <= 19)", "print(\"5\" == 5)", "print(\"10\" < \"2\")"],
          activeLines: [5],
          state: [{ name: "\"10\" < \"2\"", value: "True", changed: true }],
          output: "True True\nTrue\nFalse\nTrue",
          visual: {
            kind: "trace",
            caption: "Strings compare left-to-right at index 0 first: '1' (49) < '2' (50), so \"10\" < \"2\" returns True.",
            branches: [
              { id: "c0", label: "Index 0: '1' (49) < '2' (50) -> True (stops!)", status: "true" },
              { id: "c1", label: "Index 1 ('0') -> skipped", status: "skipped" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Comparing numeric strings (`\"10\" < \"2\"` is `True`)",
        detail: "Strings compare character by character from left to right. Convert strings with `int()` or `float()` before ordering.",
      },
      {
        title: "Case sensitivity (`\"Apple\" == \"apple\"` is `False`)",
        detail: "Uppercase and lowercase letters have different character codes, so casing must match exactly unless normalized with `.lower()` (introduced in Module 4).",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(10 == 10.0, 5 != 5)` print?",
        code: "print(10 == 10.0, 5 != 5)",
        options: [
          { id: "a", label: "`False True`" },
          { id: "b", label: "`True False`" },
          { id: "c", label: "`False False`" },
        ],
        correctId: "b",
        explanation: "`10` and `10.0` are equal in value (`True`), and `5 != 5` is `False`.",
      },
      {
        prompt: "What does `print(\"10\" < \"2\", 10 < 2)` output?",
        code: "print(\"10\" < \"2\", 10 < 2)",
        options: [
          { id: "a", label: "`False False`" },
          { id: "b", label: "`True True`" },
          { id: "c", label: "`True False`" },
        ],
        correctId: "c",
        explanation: "String `'1'` precedes `'2'` (`True`), while integer `10` is not less than `2` (`False`).",
      },
    ],
    practiceTask: {
      title: "Warmup: Chained Score Thresholds",
      tier: "Warmup",
      goal: "Check whether `score` sits inside `0 <= score <= 100` using a single chained comparison, then print the boolean result (`True` or `False`).",
      constraints: ["Use one chained comparison 0 <= score <= 100"],
      examples: [
        { input: "score = 72", output: "True" },
        { input: "score = -1", output: "False" },
      ],
      tasks: [
        "Set `score = 72` and print `0 <= score <= 100`.",
        "Update `score = -1` and print `0 <= score <= 100` again.",
      ],
      starterCode: "# Exercise M02.1 Warmup: chained inclusive bounds\nscore = 72\n# TODO: print whether 0 <= score <= 100\n",
      expectedOutput: "True\nFalse",
      hint: "Python evaluates `0 <= score <= 100` directly to a `bool` you can pass to `print(...)`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "score = 72\nprint(0 <= score <= 100)\n\nscore = -1\nprint(0 <= score <= 100)",
    },
    practiceChallenges: [
      {
        title: "Core: Age Comparison Flags",
        tier: "Core",
        goal: "Given integer `age`, compute three booleans (`is_teen`, `is_adult`, `non_zero`) and print them on one line.",
        constraints: ["All three values are bool", "Print the three flags separated by spaces"],
        examples: [
          { input: "age = 18", output: "True True True" },
          { input: "age = 0", output: "False False False" },
        ],
        tasks: [
          "Compute `is_teen = 13 <= age <= 19`, `is_adult = age >= 18`, and `non_zero = age != 0`.",
          "Print `is_teen, is_adult, non_zero` for `age = 18` and `age = 0`.",
        ],
        starterCode: "# Exercise M02.1 Core: age comparison flags\nage = 18\n# TODO: compute is_teen, is_adult, non_zero and print them\n",
        expectedOutput: "True True True\nFalse False False",
        hint: "Pass all three variables to `print(is_teen, is_adult, non_zero)` to print them space-separated.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "age = 18\nis_teen = 13 <= age <= 19\nis_adult = age >= 18\nnon_zero = age != 0\nprint(is_teen, is_adult, non_zero)\n\nage = 0\nis_teen = 13 <= age <= 19\nis_adult = age >= 18\nnon_zero = age != 0\nprint(is_teen, is_adult, non_zero)",
      },
      {
        title: "Stretch: Numeric String vs Number Order Fix",
        tier: "Stretch",
        goal: "Compare two version/rank strings (`a_str`, `b_str`) numerically by casting to `int`, printing `True` if `int(a_str) < int(b_str)` else `False`.",
        constraints: ["a_str and b_str hold valid base-10 integers"],
        examples: [
          { input: "a_str = \"2\", b_str = \"10\"", output: "True" },
          { input: "a_str = \"10\", b_str = \"2\"", output: "False" },
        ],
        tasks: [
          "Avoid lexicographic comparison by casting both variables with `int(...)`.",
          "Print `int(a_str) < int(b_str)` for both pairs.",
        ],
        starterCode: "# Exercise M02.1 Stretch: safe numeric string compare\na_str = \"2\"\nb_str = \"10\"\n# TODO: compare numeric values, not raw strings, and print\n",
        expectedOutput: "True\nFalse",
        hint: "Without `int(...)`, `\"10\" < \"2\"` evaluates to the wrong boolean.",
        complexity: { time: "O(d)", space: "O(1)" },
        solutionCode:
          "a_str = \"2\"\nb_str = \"10\"\nprint(int(a_str) < int(b_str))\n\na_str = \"10\"\nb_str = \"2\"\nprint(int(a_str) < int(b_str))",
      },
    ],
  },

  "py-none-identity": {
    lessonId: "py-none-identity",
    subtitle: "Check `None` with `is` / `is not`, separate identity from `==`, and test membership with `in` / `not in`.",
    intro: {
      heading: "Missing Values (None) and Membership Checks",
      explanation: [
        "Using `0` or `-1` to mean \"no discount set\" causes an immediate bug when a real discount of zero dollars (`0`) is valid. Checking `if discount:` treats `0` the same as missing and skips valid configurations, while calling `\"@\" in email` on an unset email crashes with `TypeError`.",
        "Python uses the singleton `None` to mark an absent value. Checking `is None` or `is not None` separates missing state from `0` or `\"\"`, and `in` / `not in` test whether a substring appears inside text.",
      ],
      analogy: "An empty seat on a flight manifest has no passenger assigned yet (`None`), whereas a passenger carrying zero checked bags still has a real number (`0`) on their ticket.",
      realWorldUses: [
        "Distinguishing missing optional config (`None`) from valid `0` or empty text",
        "Substring and domain/keyword filtering with `in` and `not in`",
      ],
    },
    sections: [
      {
        heading: "`None`, `is` vs `==`, and Membership (`in` / `not in`)",
        paragraphs: [
          "`None` (type `NoneType`) marks an unset or missing value. Because there is only one `None` object in Python, always check it with `is None` or `is not None` instead of `== None`.",
          "Identity (`is`) checks whether two expressions point to the exact same object in memory, whereas equality (`==`) compares contents. For numbers and strings, use `==`. To check whether a substring appears inside a string (or an item inside a sequence), use `in` and `not in`.",
        ],
        table: {
          caption: "`is None` & Membership Reference",
          headers: ["Pattern", "Meaning", "Example", "Rule"],
          rows: [
            ["`x is None`", "Is `x` the singleton `None`?", "`winner is None`", "Always prefer over `== None`"],
            ["`x is not None`", "Does `x` hold a real value (even `0` or `\"\"`)?", "`limit is not None`", "Guards missing state when `0` is valid"],
            ["`sub in text`", "Does `sub` occur inside `text`?", "`\"@\" in email`", "Case-sensitive substring scan"],
            ["`sub not in text`", "Is `sub` absent from `text`?", "`\" \" not in pw`", "Preferred over `not (sub in text)`"],
          ],
          highlightCol: 3,
        },
        visual: {
          kind: "operator-lab",
          caption: "Test is None, is not None, and membership checks interactively",
          presets: [
            {
              label: "winner is None",
              left: "None",
              op: "is",
              right: "None",
              result: "True",
              typeName: "bool",
              frequency: "Daily",
              note: "None is a singleton, so 'is None' checks identity directly and is standard PEP 8 style.",
            },
            {
              label: "0 is None",
              left: "0",
              op: "is",
              right: "None",
              result: "False",
              typeName: "bool",
              frequency: "Daily",
              note: "0 is a valid integer object, not None.",
            },
            {
              label: "\"@\" in email",
              left: "\"@\"",
              op: "in",
              right: "\"sam@x.com\"",
              result: "True",
              typeName: "bool",
              frequency: "Daily",
              note: "in checks whether substring '@' appears anywhere inside the string.",
            },
            {
              label: "\"!\" not in pw",
              left: "\"!\"",
              op: "not in",
              right: "\"abc123\"",
              result: "True",
              typeName: "bool",
              frequency: "Daily",
              note: "not in returns True when the substring is completely absent.",
            },
          ],
        },
        code: [
          "coupon = None",
          "email = \"sam@site.com\"",
          "print(coupon is None)        # True",
          "print(coupon is not None)    # False",
          "print(\"@\" in email)          # True",
          "print(\"spam\" not in email)   # True",
        ],
        output: "True\nFalse\nTrue\nTrue",
      },
      {
        heading: "Broken vs Working: Missing `None` vs Valid `0`",
        paragraphs: [
          "Testing `if limit:` breaks whenever `0` is a valid setting, because `bool(0)` is `False`. Write `if limit is not None:` so `0` passes through while `None` is caught.",
          "Calling `\"@\" in email` when `email` is `None` raises `TypeError: argument of type 'NoneType' is not iterable`. Guard with `email is not None` first, and prefer `is None` over `== None` so custom equality methods cannot mislead your check.",
        ],
        code: [
          "limit = 0",
          "# Broken: treats 0 the same as missing None",
          "print(\"if limit:\", bool(limit))            # False (bug when 0 is valid!)",
          "",
          "# Working: separates 0 from None",
          "print(\"is not None:\", limit is not None)   # True",
          "",
          "# Invalid on None:",
          "# \"@\" in None                              -> TypeError: argument of type 'NoneType' is not iterable",
          "email = \"sam@site.com\"",
          "print(email is not None and \"@\" in email)  # True",
        ],
        output: "if limit: False\nis not None: True\nTrue",
      },
    ],
    guidedBuildUp: {
      title: "Build an Optional Config & Email Guard Step by Step",
      subtitle: "Start with an unset value, preserve valid 0, then guard substring membership.",
      steps: [
        {
          label: "Step 1: Check missing state with is None",
          explanation: "Represent an unset retry limit with `None` and test it using `is None` instead of `== None`.",
          code: [
            "max_retries = None",
            "print(\"Unset:\", max_retries is None)",
          ],
          activeLines: [1, 2],
          output: "Unset: True",
        },
        {
          label: "Step 2: Accept 0 with is not None",
          explanation: "Change `max_retries` to `0` (zero retries allowed). Using `is not None` returns `True` even though `0` is falsy.",
          code: [
            "max_retries = 0",
            "print(\"Configured:\", max_retries is not None)",
          ],
          activeLines: [1, 2],
          output: "Configured: True",
        },
        {
          label: "Step 3: Guard None before testing in",
          explanation: "Test `email is not None` before running `\"@\" in email` so a missing email never raises `TypeError`.",
          code: [
            "email = \"sam@site.com\"",
            "has_at = email is not None and \"@\" in email",
            "no_spaces = \" \" not in email",
            "print(has_at, no_spaces)",
          ],
          activeLines: [2, 3, 4],
          output: "True True",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `is None`, `0` vs `None`, and Substring Membership",
      steps: [
        {
          title: "Test an unset variable with `is None`",
          tag: "CONCEPT",
          explanation: ["`winner` starts as `None`, so `winner is None` evaluates to `True`."],
          code: ["winner = None", "limit = 0", "print(winner is None)", "print(limit is not None)", "print(\"@\" in \"sam@site.com\")"],
          activeLines: [1, 3],
          state: [
            { name: "winner", value: "None", changed: true },
            { name: "winner is None", value: "True", changed: true },
          ],
          output: "True",
          visual: {
            kind: "memory",
            caption: "winner points to Python's single None singleton, so winner is None is True.",
            frames: [
              {
                name: "Globals",
                bindings: [{ label: "winner", targetId: "none_obj", highlight: true }],
              },
            ],
            objects: [{ id: "none_obj", typeLabel: "NoneType", value: "None", highlight: true }],
          },
        },
        {
          title: "Keep `0` distinct from `None`",
          tag: "PATTERN",
          explanation: ["`limit = 0` is falsy, yet `limit is not None` is `True` because `0` is present rather than missing."],
          code: ["winner = None", "limit = 0", "print(winner is None)", "print(limit is not None)", "print(\"@\" in \"sam@site.com\")"],
          activeLines: [2, 4],
          state: [
            { name: "limit", value: "0", changed: true },
            { name: "limit is not None", value: "True", changed: true },
          ],
          output: "True\nTrue",
          visual: {
            kind: "memory",
            caption: "limit points to int 0 (falsy, but not the None object), so limit is not None is True.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "winner", targetId: "none_obj" },
                  { label: "limit", targetId: "zero_obj", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "none_obj", typeLabel: "NoneType", value: "None" },
              { id: "zero_obj", typeLabel: "int", value: "0", highlight: true },
            ],
          },
        },
        {
          title: "Scan text for substrings using `in`",
          tag: "CONCEPT",
          explanation: ["`\"@\" in \"sam@site.com\"` scans the characters and finds `'@'` at index 3 (`True`)."],
          code: ["winner = None", "limit = 0", "print(winner is None)", "print(limit is not None)", "print(\"@\" in \"sam@site.com\")"],
          activeLines: [5],
          state: [{ name: "has_at", value: "True", changed: true }],
          output: "True\nTrue\nTrue",
          visual: {
            kind: "memory",
            caption: "in scans left-to-right through the string object and matches '@' at index 3.",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "winner", targetId: "none_obj" },
                  { label: "limit", targetId: "zero_obj" },
                  { label: "has_at", targetId: "email_obj", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "none_obj", typeLabel: "NoneType", value: "None" },
              { id: "zero_obj", typeLabel: "int", value: "0" },
              {
                id: "email_obj",
                typeLabel: "str ('@' in email)",
                value: "True",
                highlight: true,
                cells: [
                  { index: "0", value: "s", dim: true },
                  { index: "1", value: "a", dim: true },
                  { index: "2", value: "m", dim: true },
                  { index: "3", value: "@", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "Remember `is` checks identity, not equal values",
          tag: "PITFALL",
          explanation: ["Use `==` to check equal values (`a == b`), reserving `is` for `None` (`x is None`)."],
          code: ["winner = None", "limit = 0", "print(winner is None)", "print(limit is not None)", "print(\"@\" in \"sam@site.com\")"],
          activeLines: [3, 4],
          state: [{ name: "rule", value: "Use == for values, is for None", changed: true }],
          output: "True\nTrue\nTrue",
          visual: {
            kind: "memory",
            caption: "winner binds to the None singleton while limit binds to int 0 (two distinct non-None/None states).",
            frames: [
              {
                name: "Globals",
                bindings: [
                  { label: "winner", targetId: "obj_none", highlight: true },
                  { label: "limit", targetId: "obj_zero", highlight: true },
                ],
              },
            ],
            objects: [
              { id: "obj_none", typeLabel: "NoneType", value: "None (winner is None -> True)", highlight: true },
              { id: "obj_zero", typeLabel: "int", value: "0 (limit is not None -> True)", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `if limit:` when `limit = 0` is a valid setting",
        detail: "Both `None` and `0` are falsy. Write `if limit is not None:` when `0` must be accepted.",
      },
      {
        title: "Writing `not (\"@\" in email)` instead of `\"@\" not in email`",
        detail: "Python provides `not in` directly as a readable membership operator.",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `print(0 is None, 0 is not None)` print?",
        code: "print(0 is None, 0 is not None)",
        options: [
          { id: "a", label: "`True False`" },
          { id: "b", label: "`False True`" },
          { id: "c", label: "`False False`" },
        ],
        correctId: "b",
        explanation: "`0` is an integer, not `None`, so `0 is None` is `False` and `0 is not None` is `True`.",
      },
      {
        prompt: "What does `print(\"py\" not in \"python\", None is None)` output?",
        code: "print(\"py\" not in \"python\", None is None)",
        options: [
          { id: "a", label: "`False True`" },
          { id: "b", label: "`True True`" },
          { id: "c", label: "`False False`" },
        ],
        correctId: "a",
        explanation: "`\"py\"` sits inside `\"python\"`, so `not in` is `False`; `None is None` is `True`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Separate `None` from Zero (`0`)",
      tier: "Warmup",
      goal: "Print two booleans: whether `value is None`, and whether `value is not None`, contrasting `value = None` against falsy `value = 0`.",
      constraints: ["Use is and is not instead of == None"],
      examples: [
        { input: "value = None", output: "True False" },
        { input: "value = 0", output: "False True" },
      ],
      tasks: [
        "Evaluate `value is None` and `value is not None` for `value = None`.",
        "Repeat for `value = 0` and print both pairs.",
      ],
      starterCode: "# Exercise M02.2 Warmup: None vs 0 identity checks\nvalue = None\n# TODO: print (value is None) and (value is not None)\n",
      expectedOutput: "True False\nFalse True",
      hint: "`0` is falsy in boolean checks, yet `0 is None` is always `False`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "value = None\nprint(value is None, value is not None)\n\nvalue = 0\nprint(value is None, value is not None)",
    },
    practiceChallenges: [
      {
        title: "Core: Email Character & Substring Checks",
        tier: "Core",
        goal: "Given `email` (`\"sam@site.com\"`), check `is not None`, `\"@\" in email`, `\".\" in email`, and `\" \" not in email`; contrast with `empty_user = None`.",
        constraints: ["Use is not None, in, and not in"],
        examples: [
          { input: "email = \"sam@site.com\"", output: "True True True True" },
          { input: "empty_user = None", output: "True" },
        ],
        tasks: [
          "Print `email is not None`, `\"@\" in email`, `\".\" in email`, and `\" \" not in email` for `\"sam@site.com\"`.",
          "Check `empty_user is None` for `None`.",
        ],
        starterCode: "# Exercise M02.2 Core: None and membership checks\nemail = \"sam@site.com\"\nempty_user = None\n# TODO: print membership checks for email, then check empty_user is None\n",
        expectedOutput: "True True True True\nTrue",
        hint: "Test `empty_user is None` directly without calling `in` on `None`.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "email = \"sam@site.com\"\nprint(email is not None, \"@\" in email, \".\" in email, \" \" not in email)\n\nempty_user = None\nprint(empty_user is None)",
      },
      {
        title: "Stretch: Blocked Substring & Prefix Membership Check",
        tier: "Stretch",
        goal: "Test whether `blocked` appears in a valid command string (`\"sudo rm -rf\"`), and whether a role string (`\"viewer\"`) is excluded from `\"editor,admin\"`.",
        constraints: ["Use in and not in operators"],
        examples: [
          { input: "cmd = \"sudo rm -rf\", blocked = \"rm\"", output: "True False" },
          { input: "cmd = \"git status\", role = \"viewer\"", output: "False True" },
        ],
        tasks: [
          "Print `blocked in cmd` and `blocked not in cmd` for `\"sudo rm -rf\"`.",
          "Print `blocked in \"git status\"` and `\"viewer\" not in \"editor,admin\"`.",
        ],
        starterCode: "# Exercise M02.2 Stretch: in / not in substring guard\ncmd = \"sudo rm -rf\"\nblocked = \"rm\"\n# TODO: print substring membership flags\n",
        expectedOutput: "True False\nFalse True",
        hint: "`x not in s` returns `True` only when `x` is absent from `s`.",
        complexity: { time: "O(n * m)", space: "O(1)" },
        solutionCode:
          "blocked = \"rm\"\ncmd = \"sudo rm -rf\"\nprint(blocked in cmd, blocked not in cmd)\n\ncmd = \"git status\"\nrole = \"viewer\"\nprint(blocked in cmd, role not in \"editor,admin\")",
      },
    ],
  },

  "py-if-else": {
    lessonId: "py-if-else",
    subtitle: "Branch code into two paths using `if`, `else`, colons (`:`), and 4-space indentation.",
    intro: {
      heading: "Choosing Between Two Execution Paths",
      explanation: [
        "Without branching, Python runs every line from top to bottom—making it impossible to print either \"Entry allowed\" or \"Need guardian\" depending on input. Forget the colon `:` or leave the next line at column 0, and Python stops immediately with `SyntaxError` or `IndentationError`.",
        "`if` and `else:` split execution into two mutually exclusive blocks marked by 4-space indentation. When the `if` condition is `True`, its block runs and `else:` is skipped; when it is `False`, `else:` runs instead.",
      ],
      analogy: "At a railway junction, one switch blade sends a train onto either the express track or the local track—never both—before the tracks merge back into the main line.",
      realWorldUses: [
        "Enforcing two-way access gates such as age verification or login checks",
        "Applying conditional fee rules such as free shipping above a $50 cart total",
      ],
    },
    sections: [
      {
        heading: "`if` Statements, 4-Space Indentation & `IndentationError`",
        paragraphs: [
          "An `if` header checks a condition and ends with a colon `:`. All lines belonging inside that branch must share the same 4-space indentation.",
          "Python relies on indentation instead of curly braces `{}`. Forgetting to indent after `:`, or mixing tabs with spaces, raises `IndentationError` or `TabError`. Returning to the left margin runs code unconditionally after the branch.",
        ],
        code: [
          "battery = 12",
          "# Invalid (missing indent after colon):",
          "# if battery < 20:",
          "# print(\"Low battery!\")    -> IndentationError: expected an indented block",
          "",
          "# Valid (4-space indent inside block, column 0 afterward):",
          "if battery < 20:",
          "    print(\"Low battery!\")",
          "    print(\"Plug in charger.\")",
          "print(\"Status check finished.\")",
        ],
        output: "Low battery!\nPlug in charger.\nStatus check finished.",
      },
      {
        heading: "Two-Way Branching with `else`",
        paragraphs: [
          "Place `else:` directly aligned under `if` (no condition after `else`, just `:`) to run a fallback block whenever `if` is `False`.",
          "Exactly one of the two blocks runs: never both and never neither. Putting a condition on `else:` (`else age < 18:`) raises `SyntaxError`; use `elif` when you need a second test.",
        ],
        table: {
          caption: "`if / else` Syntax & Indentation Rules",
          headers: ["Part", "Rule", "Example"],
          rows: [
            ["Condition header", "Ends with colon `:`", "`if age >= 18:`"],
            ["Branch body", "Indented consistently with 4 spaces", "`    print(\"Allowed\")`"],
            ["`else:` fallback", "No condition on `else:`, aligned with `if`", "`else:`"],
            ["After the branch", "Unindented lines always execute afterward", "`print(\"Done\")`"],
          ],
        },
        code: [
          "age = 16",
          "# Invalid: else age < 18:  -> SyntaxError (else takes no condition)",
          "",
          "# Valid:",
          "if age >= 18:",
          "    print(\"Entry allowed\")",
          "else:",
          "    print(\"Need guardian\")",
        ],
        output: "Need guardian",
      },
    ],
    guidedBuildUp: {
      title: "Build a Pass/Fail Gate With Indentation Step by Step",
      subtitle: "Start with a single if block, add an else fallback, then place a shared print at column 0.",
      steps: [
        {
          label: "Step 1: Single if block with colon and 4-space indent",
          explanation: "End the `if` header with `:` and indent the action line by 4 spaces so it runs only when `score >= 60`.",
          code: [
            "score = 75",
            "if score >= 60:",
            "    print(\"Pass\")",
          ],
          activeLines: [2, 3],
          output: "Pass",
        },
        {
          label: "Step 2: Add a mutually exclusive else branch",
          explanation: "Align `else:` directly under `if` with no condition attached so failing scores run a fallback message.",
          code: [
            "score = 45",
            "if score >= 60:",
            "    print(\"Pass\")",
            "else:",
            "    print(\"Try again\")",
          ],
          activeLines: [4, 5],
          output: "Try again",
        },
        {
          label: "Step 3: Return to column 0 for shared follow-up",
          explanation: "Unindent back to column 0 for lines that should run after either branch finishes.",
          code: [
            "score = 45",
            "if score >= 60:",
            "    status = \"Pass\"",
            "else:",
            "    status = \"Try again\"",
            "print(\"Result:\", status)",
          ],
          activeLines: [6],
          output: "Result: Try again",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Branch Execution Step by Step (`score = 45` then `80`)",
      steps: [
        {
          title: "Test `score = 45` against `score >= 60`",
          tag: "TRACE",
          explanation: ["Python evaluates `45 >= 60`, which is `False`, so line 3 is skipped."],
          code: ["score = 45", "if score >= 60:", "    result = \"Pass\"", "else:", "    result = \"Try again\"", "print(result)"],
          activeLines: [1, 2],
          state: [
            { name: "score", value: "45", changed: true },
            { name: "score >= 60", value: "False", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "False skips the if block and routes to else",
            branches: [
              { id: "if", label: "score >= 60 -> False", status: "false" },
              { id: "else", label: "else -> pending", status: "true" },
            ],
          },
        },
        {
          title: "Execute `else` block for `score = 45`",
          tag: "TRACE",
          explanation: ["Inside `else:`, Python assigns `result = \"Try again\"`."],
          code: ["score = 45", "if score >= 60:", "    result = \"Pass\"", "else:", "    result = \"Try again\"", "print(result)"],
          activeLines: [4, 5],
          state: [{ name: "result", value: "\"Try again\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "else branch executes",
            branches: [
              { id: "if", label: "score >= 60 -> skipped", status: "skipped" },
              { id: "else", label: "else -> sets 'Try again'", status: "true" },
            ],
          },
        },
        {
          title: "Resume at outer margin for `print(result)`",
          tag: "CHECK",
          explanation: ["Line 6 sits at column 0, so it runs after whichever branch executed."],
          code: ["score = 45", "if score >= 60:", "    result = \"Pass\"", "else:", "    result = \"Try again\"", "print(result)"],
          activeLines: [6],
          state: [{ name: "result", value: "\"Try again\"" }],
          visual: {
            kind: "trace",
            caption: "Control rejoins column 0 after the chosen branch finishes.",
            branches: [
              { id: "if", label: "score >= 60 -> skipped", status: "skipped" },
              { id: "else", label: "else -> completed", status: "true" },
              { id: "out", label: "print(result) -> 'Try again'", status: "active" },
            ],
          },
          output: "Try again",
        },
        {
          title: "Re-run with `score = 80`: `if` runs and `else` is skipped",
          tag: "TRACE",
          explanation: ["When `80 >= 60` is `True`, Python assigns `result = \"Pass\"` and skips `else:` completely."],
          code: ["score = 80", "if score >= 60:", "    result = \"Pass\"", "else:", "    result = \"Try again\"", "print(result)"],
          activeLines: [2, 3, 6],
          state: [
            { name: "score", value: "80", changed: true },
            { name: "result", value: "\"Pass\"", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "True executes if and skips else",
            branches: [
              { id: "if", label: "score >= 60 -> True ('Pass')", status: "true" },
              { id: "else", label: "else -> skipped", status: "skipped" },
            ],
          },
          output: "Pass",
        },
      ],
    },
    trickyPoints: [
      {
        title: "`IndentationError` and mixing tabs with spaces",
        detail: "Use 4 spaces consistently inside blocks and never mix Tab characters with spaces.",
      },
      {
        title: "Leaving post-decision lines indented inside `else`",
        detail: "Unindent back to column 0 for lines that should run regardless of which branch was chosen.",
      },
      {
        title: "Writing a condition on `else:` (`else score < 60:`)",
        detail: "`else:` takes no condition; use `elif` when you need a second test.",
      },
    ],
    predictChecks: [
      {
        prompt: "If `rain = False`, what prints?",
        code: "rain = False\nif rain:\n    print(\"Take umbrella\")\nprint(\"Go outside\")",
        options: [
          { id: "a", label: "Nothing prints" },
          { id: "b", label: "`Go outside`" },
          { id: "c", label: "`Take umbrella` then `Go outside`" },
        ],
        correctId: "b",
        explanation: "Line 3 is indented inside `if rain:`, so it skips. Line 4 sits at column 0 and always runs.",
      },
      {
        prompt: "If `temp = 32`, which message prints?",
        code: "temp = 32\nif temp >= 30:\n    print(\"Hot\")\nelse:\n    print(\"Mild\")",
        options: [
          { id: "a", label: "`Hot`" },
          { id: "b", label: "`Mild`" },
          { id: "c", label: "Both `Hot` and `Mild`" },
        ],
        correctId: "a",
        explanation: "`32 >= 30` is `True`, so only the `if` block runs.",
      },
    ],
    practiceTask: {
      title: "Warmup: Low-Battery Status",
      tier: "Warmup",
      goal: "Print `\"Charge soon\"` when `battery < 20`, otherwise print `\"Battery ok\"`.",
      constraints: ["0 <= battery <= 100"],
      examples: [
        { input: "battery = 15", output: "Charge soon" },
        { input: "battery = 20", output: "Battery ok" },
      ],
      tasks: [
        "Check `if battery < 20:`.",
        "Print `\"Charge soon\"` or `\"Battery ok\"`.",
      ],
      starterCode: "# Exercise M02.3 Warmup: binary threshold branch\nbattery = 15\n# TODO: branch on battery < 20 and print status\n",
      expectedOutput: "Charge soon\nBattery ok",
      hint: "`20 < 20` is `False`, so exact `20` lands in `else:`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "battery = 15\nif battery < 20:\n    print(\"Charge soon\")\nelse:\n    print(\"Battery ok\")\n\nbattery = 20\nif battery < 20:\n    print(\"Charge soon\")\nelse:\n    print(\"Battery ok\")",
    },
    practiceChallenges: [
      {
        title: "Core: Parity Classifier (`Even` / `Odd`)",
        tier: "Core",
        goal: "Print `\"Even\"` when integer `num` is divisible by `2`, otherwise `\"Odd\"` (works for `0` and negatives too).",
        constraints: ["Works for negative and zero integers"],
        examples: [
          { input: "num = 8", output: "Even" },
          { input: "num = -3", output: "Odd" },
        ],
        tasks: [
          "Check `if num % 2 == 0:`.",
          "Print `\"Even\"` or `\"Odd\"`.",
        ],
        starterCode: "# Exercise M02.3 Core: parity decision\nnum = 8\n# TODO: use num % 2 == 0 and print Even or Odd\n",
        expectedOutput: "Even\nOdd",
        hint: "`-3 % 2` equals `1`, which is not `0`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "num = 8\nif num % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")\n\nnum = -3\nif num % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")",
      },
      {
        title: "Stretch: Shipping Fee Calculator",
        tier: "Stretch",
        goal: "Apply `$0` shipping when `subtotal >= 50.0`, otherwise add `$6.00`, printing `Total: $<amount:.2f>`.",
        constraints: ["subtotal >= 0"],
        examples: [
          { input: "subtotal = 38.0", output: "Total: $44.00" },
          { input: "subtotal = 50.0", output: "Total: $50.00" },
        ],
        tasks: [
          "Branch with `if subtotal >= 50:` vs `else:` to set `shipping`.",
          "Print `f\"Total: ${subtotal + shipping:.2f}\"`.",
        ],
        starterCode: "# Exercise M02.3 Stretch: subtotal + conditional shipping\nsubtotal = 38.0\n# TODO: apply free shipping at $50+ and print formatted total\n",
        expectedOutput: "Total: $44.00\nTotal: $50.00",
        hint: "Set `shipping = 0` or `6` inside the branches, then format and print once below.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "subtotal = 38.0\nif subtotal >= 50:\n    shipping = 0\nelse:\n    shipping = 6\nprint(f\"Total: ${subtotal + shipping:.2f}\")\n\nsubtotal = 50.0\nif subtotal >= 50:\n    shipping = 0\nelse:\n    shipping = 6\nprint(f\"Total: ${subtotal + shipping:.2f}\")",
      },
    ],
  },

  "py-elif-chains": {
    lessonId: "py-elif-chains",
    subtitle: "Route values through 3+ ordered thresholds using `if / elif / else` without condition shadowing.",
    intro: {
      heading: "Multi-Way Thresholds With `elif`",
      explanation: [
        "Putting `if score >= 70:` above `elif score >= 90:` creates a silent bug: a score of `95` satisfies `>= 70` first and prints `\"C\"`, turning the `\"A\"` branch into unreachable dead code. Writing separate `if` statements instead of `elif` triggers the opposite bug, firing multiple tiers for a single score.",
        "`if / elif / else` scans tiers from top to bottom and stops after the first `True` condition. Ordering overlapping checks strictly from narrowest to widest—highest-to-lowest with `>=`, or lowest-to-highest with `<`—ensures every input lands in the right bucket.",
      ],
      analogy: "Coin sorters pass coins over small holes before large holes so dimes do not drop through the quarter slot first.",
      realWorldUses: [
        "Routing exam grades, tax brackets, and tiered shipping rates into one matching bucket",
        "Classifying sensor readings into distinct severity bands (normal, warning, critical)",
      ],
    },
    sections: [
      {
        heading: "Multi-Way Branching with `elif`",
        paragraphs: [
          "Place any number of `elif` (*else if*) branches between `if` and an optional closing `else:`.",
          "Python scans top to bottom and runs only the first branch whose condition is `True`, skipping all lower `elif` and `else` arms.",
        ],
        code: [
          "score = 82",
          "if score >= 90:",
          "    grade = \"A\"",
          "elif score >= 80:",
          "    grade = \"B\"",
          "elif score >= 70:",
          "    grade = \"C\"",
          "else:",
          "    grade = \"Needs practice\"",
          "print(\"Grade:\", grade)",
        ],
        output: "Grade: B",
      },
      {
        heading: "Ordering Overlapping Thresholds (Broken vs Fixed)",
        paragraphs: [
          "If `if score >= 70:` appears above `elif score >= 90:`, a score of `95` satisfies `>= 70` first and receives `\"C\"` while `\"A\"` becomes unreachable dead code.",
          "Step downward from highest threshold to lowest (or upward from lowest to highest when using `<`). Use separate `if` statements only when multiple independent actions can fire at the same time.",
        ],
        table: {
          caption: "`if / elif / else` vs Independent `if` Statements",
          headers: ["Structure", "How Many Branches Run", "When to Pick It"],
          rows: [
            ["`if / elif / else`", "At most 1 branch (exactly 1 with `else:`)", "Mutually exclusive brackets (grades, fee tiers)"],
            ["Separate `if` blocks", "0, 1, or multiple", "Independent checks (alert when low battery and offline)"],
          ],
        },
        code: [
          "score = 95",
          "",
          "# Broken order: >= 70 shadows >= 90",
          "if score >= 70:",
          "    print(\"Broken:\", \"C\")   # catches 95 immediately",
          "elif score >= 90:",
          "    print(\"Broken:\", \"A\")   # unreachable",
          "",
          "# Working order: strictest threshold first",
          "if score >= 90:",
          "    print(\"Fixed:\", \"A\")",
          "elif score >= 70:",
          "    print(\"Fixed:\", \"C\")",
        ],
        output: "Broken: C\nFixed: A",
        callout: {
          kind: "KEY IDEA",
          text: "Use `if / elif / else` when outcomes exclude each other, ordered strictly monotonically.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Build an Ordered Grade Classifier Step by Step",
      subtitle: "Start with the highest cutoff, insert middle elif tiers in descending order, then close with else.",
      steps: [
        {
          label: "Step 1: Start with the strictest threshold (>= 90)",
          explanation: "Place `score >= 90` first so top scores are caught before broader rules run.",
          code: [
            "score = 95",
            "if score >= 90:",
            "    grade = \"A\"",
            "print(grade)",
          ],
          activeLines: [2, 3],
          output: "A",
        },
        {
          label: "Step 2: Chain middle tiers in descending order",
          explanation: "Add `elif score >= 80:` and `elif score >= 70:` below `90`. When `score = 82`, the first arm fails and the second matches.",
          code: [
            "score = 82",
            "if score >= 90:",
            "    grade = \"A\"",
            "elif score >= 80:",
            "    grade = \"B\"",
            "elif score >= 70:",
            "    grade = \"C\"",
            "print(grade)",
          ],
          activeLines: [4, 5, 6, 7],
          output: "B",
        },
        {
          label: "Step 3: Add closing else fallback for remaining scores",
          explanation: "Finish with `else:` so scores below `70` assign `grade` instead of leaving it undefined.",
          code: [
            "score = 55",
            "if score >= 90:",
            "    grade = \"A\"",
            "elif score >= 80:",
            "    grade = \"B\"",
            "elif score >= 70:",
            "    grade = \"C\"",
            "else:",
            "    grade = \"F\"",
            "print(grade)",
          ],
          activeLines: [8, 9],
          output: "F",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Broken vs Strictest-First Ordering (`score = 95` & `72`)",
      steps: [
        {
          title: "Broken order (`>= 70` first) grabs `95` early",
          tag: "PITFALL",
          explanation: ["`95 >= 70` is `True`, so Python returns `\"C\"` on branch 1 and never inspects `>= 90`."],
          code: ["score = 95", "if score >= 70:", "    grade = \"C\"", "elif score >= 90:", "    grade = \"A\""],
          activeLines: [2, 3],
          state: [{ name: "grade (broken)", value: "\"C\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "Loose threshold first shadows stricter branches below",
            branches: [
              { id: "b1", label: "if score >= 70 -> True ('C')", status: "true" },
              { id: "b2", label: "elif score >= 90 -> skipped", status: "skipped" },
            ],
          },
        },
        {
          title: "Strictest-first order (`>= 90` first) matches `'A'`",
          tag: "PATTERN",
          explanation: ["Placing `>= 90` first handles `95` properly before `>= 80` or `>= 70` are considered."],
          code: ["score = 95", "if score >= 90:", "    grade = \"A\"", "elif score >= 80:", "    grade = \"B\"", "else:", "    grade = \"C\""],
          activeLines: [2, 3],
          state: [{ name: "grade (fixed)", value: "\"A\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "Descending threshold order prevents overlap bugs",
            branches: [
              { id: "b1", label: "if score >= 90 -> True ('A')", status: "true" },
              { id: "b2", label: "elif score >= 80 -> skipped", status: "skipped" },
            ],
          },
        },
        {
          title: "Test middle value (`score = 82`) falling to second arm",
          tag: "TRACE",
          explanation: ["`82 >= 90` is `False`, so Python checks `82 >= 80` (`True`), sets `\"B\"`, and skips `else:`."],
          code: ["score = 82", "if score >= 90:", "    grade = \"A\"", "elif score >= 80:", "    grade = \"B\"", "else:", "    grade = \"C\""],
          activeLines: [2, 4, 5],
          state: [{ name: "grade", value: "\"B\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "82 skips >= 90, matches >= 80, and skips else.",
            branches: [
              { id: "b1", label: "if score >= 90 -> False", status: "false" },
              { id: "b2", label: "elif score >= 80 -> True ('B')", status: "true" },
              { id: "b3", label: "else -> skipped", status: "skipped" },
            ],
          },
        },
        {
          title: "Catch everything lower with closing `else:` (`score = 55`)",
          tag: "TRACE",
          explanation: ["All `if`/`elif` conditions fail for `55`, so `else:` supplies the default grade."],
          code: ["score = 55", "if score >= 90:", "    grade = \"A\"", "elif score >= 80:", "    grade = \"B\"", "else:", "    grade = \"C\""],
          activeLines: [6, 7],
          state: [{ name: "grade", value: "\"C\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "When earlier checks are False, the final else catches 55.",
            branches: [
              { id: "b1", label: "if score >= 90 -> False", status: "false" },
              { id: "b2", label: "elif score >= 80 -> False", status: "false" },
              { id: "b3", label: "else -> True ('C')", status: "true" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Writing `if` + `if` + `else` instead of `if` + `elif` + `else`",
        detail: "In `if` + `if` + `else`, the `else:` pairs only with the second `if`, so `else:` still runs when the first `if` already matched.",
      },
      {
        title: "Shadowing narrow branches behind wider ones",
        detail: "Always test `95`, boundary values (`90`, `80`), and low fallbacks after writing an `elif` chain.",
      },
    ],
    predictChecks: [
      {
        prompt: "If `x = 12`, what prints?",
        code: "x = 12\nif x > 10:\n    print(\"big\")\nelif x > 5:\n    print(\"medium\")\nif x % 2 == 0:\n    print(\"even\")",
        options: [
          { id: "a", label: "`big` only" },
          { id: "b", label: "`big` and `even`" },
          { id: "c", label: "`big`, `medium`, and `even`" },
        ],
        correctId: "b",
        explanation: "The `if/elif` stops after `big`. Line 6 starts an independent `if`, which is also `True`.",
      },
      {
        prompt: "If `n = 95`, what does `if n >= 70: print('C') elif n >= 90: print('A')` print?",
        code: "n = 95\nif n >= 70:\n    print(\"C\")\nelif n >= 90:\n    print(\"A\")",
        options: [
          { id: "a", label: "`A`" },
          { id: "b", label: "`C`" },
          { id: "c", label: "`C` and `A`" },
        ],
        correctId: "b",
        explanation: "Because `n >= 70` comes first and `95 >= 70` is `True`, Python prints `\"C\"` and skips `elif n >= 90`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Letter Grade Classifier",
      tier: "Warmup",
      goal: "Print `\"A\"` (`>= 90`), `\"B\"` (`>= 80`), `\"C\"` (`>= 70`), or `\"F\"` (`< 70`) using ordered `elif` branches.",
      constraints: ["0 <= score <= 100"],
      examples: [
        { input: "score = 92", output: "A" },
        { input: "score = 68", output: "F" },
      ],
      tasks: [
        "Order thresholds descending from `90` down to `70`.",
        "Print `\"F\"` in `else:`.",
      ],
      starterCode: "# Exercise M02.4 Warmup: ordered elif chain\nscore = 92\n# TODO: check >= 90, >= 80, >= 70, else F and print grade\n",
      expectedOutput: "A\nF",
      hint: "Start with `if score >= 90:` so `92` cannot fall into lower arms.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "score = 92\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"F\")\n\nscore = 68\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelif score >= 70:\n    print(\"C\")\nelse:\n    print(\"F\")",
    },
    practiceChallenges: [
      {
        title: "Core: Ticket Price Brackets",
        tier: "Core",
        goal: "Print `\"Free\"` (`< 5`), `\"$8\"` (`5..17`), `\"$15\"` (`18..64`), or `\"$10\"` (`65+`) from visitor `age`.",
        constraints: ["age >= 0"],
        examples: [
          { input: "age = 12", output: "$8" },
          { input: "age = 70", output: "$10" },
        ],
        tasks: [
          "Step upward with `if age < 5:`, `elif age <= 17:`, `elif age <= 64:`, `else:`.",
          "Print the bracket price string.",
        ],
        starterCode: "# Exercise M02.4 Core: ascending age brackets\nage = 12\n# TODO: print ticket label\n",
        expectedOutput: "$8\n$10",
        hint: "Stepping upward with `<` / `<=` guarantees each bracket only matches remaining ages.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "age = 12\nif age < 5:\n    print(\"Free\")\nelif age <= 17:\n    print(\"$8\")\nelif age <= 64:\n    print(\"$15\")\nelse:\n    print(\"$10\")\n\nage = 70\nif age < 5:\n    print(\"Free\")\nelif age <= 17:\n    print(\"$8\")\nelif age <= 64:\n    print(\"$15\")\nelse:\n    print(\"$10\")",
      },
      {
        title: "Stretch: Progressive Tax Rate Summary",
        tier: "Stretch",
        goal: "Given integer `income`, apply bracket fee (`<= 1000` -> `0%`, `<= 5000` -> `10%`, `> 5000` -> `20%`) on the whole income and print `Tax: $<amount:.2f>`.",
        constraints: ["income >= 0"],
        examples: [
          { input: "income = 3000", output: "Tax: $300.00" },
          { input: "income = 1000", output: "Tax: $0.00" },
        ],
        tasks: [
          "Pick `rate` using ascending `<= 1000` -> `0.0`, `<= 5000` -> `0.10`, else `0.20`.",
          "Print `f\"Tax: ${income * rate:.2f}\"`.",
        ],
        starterCode: "# Exercise M02.4 Stretch: threshold tax lookup\nincome = 3000\n# TODO: pick bracket rate via elif and print formatted result\n",
        expectedOutput: "Tax: $300.00\nTax: $0.00",
        hint: "Check boundary `1000`: `<= 1000` must include `1000` in the `0%` tier.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "income = 3000\nif income <= 1000:\n    rate = 0.0\nelif income <= 5000:\n    rate = 0.10\nelse:\n    rate = 0.20\nprint(f\"Tax: ${income * rate:.2f}\")\n\nincome = 1000\nif income <= 1000:\n    rate = 0.0\nelif income <= 5000:\n    rate = 0.10\nelse:\n    rate = 0.20\nprint(f\"Tax: ${income * rate:.2f}\")",
      },
    ],
  },

  "py-match-case": {
    lessonId: "py-match-case",
    subtitle: "Dispatch fixed commands, status codes, and literal patterns in Python 3.10+ using `match / case`.",
    intro: {
      heading: "Pattern Dispatch With `match / case`",
      explanation: [
        "Branching across eight fixed commands with `elif cmd == ...:` repeats `cmd ==` on every line. Switching to `match / case` introduces a different trap: writing an unquoted name like `case ok:` treats `ok` as a capture variable that matches every value and shadows every case below it (raising `SyntaxError`).",
        "Introduced in Python 3.10, `match / case` evaluates the subject once, matches literal arms from top to bottom without needing `break`, groups alternatives with `|`, and catches defaults with `case _:`.",
      ],
      analogy: "A mailroom sorting rack sends envelopes straight into labeled slots (`\"run\"`, `\"stop\"`, `404`) and drops anything unrecognized into the misc bin (`_`).",
      realWorldUses: [
        "CLI command routers (`start`, `stop`, `status`) and HTTP status handlers",
        "State-machine event dispatchers with wildcard fallback",
      ],
    },
    sections: [
      {
        heading: "`match / case`, Alternation (`|`), and Wildcard (`_`) vs `elif`",
        paragraphs: [
          "Introduced in Python 3.10, `match subject:` compares `subject` down each `case` pattern and executes the first matching arm (no `break` keyword needed, unlike C or JavaScript `switch`).",
          "Combine multiple literals in one arm using `|` (`case \"start\" | \"run\":`), and end with `case _:` as the default wildcard fallback. Reserve `if / elif / else` for numeric ranges (`score >= 80`) and compound comparisons.",
        ],
        table: {
          caption: "`match / case` vs `if / elif / else`",
          headers: ["Construct", "Best For", "Python Support", "Usage Note"],
          rows: [
            ["`if / elif / else`", "Numeric ranges (`>=`, `<`), compound `and`/`or` logic", "All Python 3 versions", "General-purpose conditions"],
            ["`match / case`", "Fixed literal commands, status codes, `|` patterns", "Python 3.10+", "Fixed value dispatch"],
          ],
          highlightCol: 3,
        },
        code: [
          "cmd = \"run\"",
          "match cmd:",
          "    case \"start\" | \"run\":",
          "        print(\"Worker starting\")",
          "    case \"stop\" | \"halt\":",
          "        print(\"Worker stopping\")",
          "    case _:",
          "        print(\"Unknown command\")",
        ],
        output: "Worker starting",
      },
      {
        heading: "Literal Patterns vs Variable Capture (`case \"ok\":` vs `case ok:`)",
        paragraphs: [
          "Inside `match`, an unquoted identifier such as `case ok:` is a variable pattern, not a string check. When placed before another `case` arm, Python raises `SyntaxError: name capture 'ok' makes remaining patterns unreachable`; when placed alone, it matches any value and binds it to `ok`.",
          "Always wrap text literals in quotes (`case \"ok\":`) and reserve the bare underscore (`case _:`) for the final fallback arm.",
        ],
        code: [
          "status = \"error\"",
          "",
          "# Invalid: unquoted name captures everything before remaining cases",
          "# match status:",
          "#     case ok:             -> SyntaxError: name capture 'ok' makes remaining patterns unreachable",
          "#     case \"error\":",
          "#         print(\"Alert\")",
          "",
          "# Valid: quoted literals match exact strings",
          "match status:",
          "    case \"ok\" | \"ready\":",
          "        print(\"Healthy\")",
          "    case \"error\":",
          "        print(\"Alert: error\")",
          "    case _:",
          "        print(\"Unknown\")",
        ],
        output: "Alert: error",
      },
    ],
    guidedBuildUp: {
      title: "Build an HTTP Status Dispatcher With match / case Step by Step",
      subtitle: "Match one literal code, group equivalents with |, then catch everything else with case _.",
      steps: [
        {
          label: "Step 1: Match a single literal status",
          explanation: "Evaluate `status` once in `match status:` and add an exact literal arm `case 404:`.",
          code: [
            "status = 404",
            "match status:",
            "    case 404:",
            "        print(\"Not Found\")",
          ],
          activeLines: [2, 3, 4],
          output: "Not Found",
        },
        {
          label: "Step 2: Group equivalent literals with |",
          explanation: "Combine `200` and `201` in one arm using `|` instead of duplicating the print body.",
          code: [
            "status = 201",
            "match status:",
            "    case 200 | 201:",
            "        print(\"OK\")",
            "    case 404:",
            "        print(\"Not Found\")",
          ],
          activeLines: [3, 4],
          output: "OK",
        },
        {
          label: "Step 3: Catch unrecognized values with case _:",
          explanation: "Add `case _:` at the bottom so unexpected codes like `503` hit a default handler.",
          code: [
            "status = 503",
            "match status:",
            "    case 200 | 201:",
            "        print(\"OK\")",
            "    case 404:",
            "        print(\"Not Found\")",
            "    case _:",
            "        print(\"Other error\")",
          ],
          activeLines: [7, 8],
          output: "Other error",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `match / case` Subject Dispatch",
      steps: [
        {
          title: "Evaluate the subject `status = 404` once",
          tag: "TRACE",
          explanation: ["`match status:` inspects `404` and tests literal `case` arms from top to bottom."],
          code: ["status = 404", "match status:", "    case 200 | 201:", "        msg = \"OK\"", "    case 404:", "        msg = \"Not Found\"", "    case _:", "        msg = \"Error\""],
          activeLines: [1, 2],
          state: [{ name: "status", value: "404", changed: true }],
          visual: {
            kind: "trace",
            caption: "match evaluates status = 404 once before checking case arms top-down.",
            branches: [
              { id: "c1", label: "case 200 | 201", status: "pending" },
              { id: "c2", label: "case 404", status: "pending" },
              { id: "c3", label: "case _", status: "pending" },
            ],
          },
        },
        {
          title: "Skip non-matching alternation pattern (`200 | 201`)",
          tag: "TRACE",
          explanation: ["`404` is neither `200` nor `201`, so the first `case` arm does not trigger."],
          code: ["status = 404", "match status:", "    case 200 | 201:", "        msg = \"OK\"", "    case 404:", "        msg = \"Not Found\"", "    case _:", "        msg = \"Error\""],
          activeLines: [3],
          visual: {
            kind: "trace",
            caption: "404 fails 200 | 201 and moves down to case 404.",
            branches: [
              { id: "c1", label: "case 200 | 201 -> False", status: "false" },
              { id: "c2", label: "case 404 -> next check", status: "active" },
              { id: "c3", label: "case _", status: "pending" },
            ],
          },
        },
        {
          title: "Match `case 404:` and exit `match` automatically",
          tag: "TRACE",
          explanation: ["Python runs `msg = \"Not Found\"` and exits the `match` block immediately without falling through to `case _:`."],
          code: ["status = 404", "match status:", "    case 200 | 201:", "        msg = \"OK\"", "    case 404:", "        msg = \"Not Found\"", "    case _:", "        msg = \"Error\""],
          activeLines: [5, 6],
          state: [{ name: "msg", value: "\"Not Found\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "case 404 matches and skips the wildcard case below.",
            branches: [
              { id: "c1", label: "case 200 | 201 -> False", status: "false" },
              { id: "c2", label: "case 404 -> True ('Not Found')", status: "true" },
              { id: "c3", label: "case _ -> skipped", status: "skipped" },
            ],
          },
        },
        {
          title: "Unmatched value (`503`) hits `case _:`",
          tag: "TRACE",
          explanation: ["When no literal arm matches, `case _:` catches it without binding a variable bug."],
          code: ["status = 503", "match status:", "    case 200 | 201:", "        msg = \"OK\"", "    case 404:", "        msg = \"Not Found\"", "    case _:", "        msg = \"Error\""],
          activeLines: [7, 8],
          state: [
            { name: "status", value: "503", changed: true },
            { name: "msg", value: "\"Error\"", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "503 fails earlier arms and runs wildcard case _.",
            branches: [
              { id: "c1", label: "case 200 | 201 -> False", status: "false" },
              { id: "c2", label: "case 404 -> False", status: "false" },
              { id: "c3", label: "case _ -> True ('Error')", status: "true" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using a bare variable name in a middle `case` arm",
        detail: "Writing `case ok:` where `ok` is a bare name binds any value to `ok` and shadows every case below it! Use quotes for strings (`case \"ok\":`) or `_` only at the very bottom (`case _:`).",
      },
    ],
    predictChecks: [
      {
        prompt: "Which wildcard arm catches every unmatched value at the bottom of `match`?",
        code: "match status:\n    case \"stop\" | \"halt\":\n        print(\"Halting\")\n    case _:\n        print(\"Running\")",
        options: [
          { id: "a", label: "`else:`" },
          { id: "b", label: "`case default:`" },
          { id: "c", label: "`case _:`" },
        ],
        correctId: "c",
        explanation: "`case _:` is the wildcard fallback arm at the end of a `match / case` block.",
      },
      {
        prompt: "What happens if `cmd = \"run\"`?",
        code: "cmd = \"run\"\nmatch cmd:\n    case \"start\" | \"run\":\n        print(\"Go\")\n    case \"stop\":\n        print(\"Stop\")",
        options: [
          { id: "a", label: "Prints `Go` only" },
          { id: "b", label: "Prints `Go` and `Stop`" },
          { id: "c", label: "Raises `SyntaxError`" },
        ],
        correctId: "a",
        explanation: "Python `match` arms never fall through; only `Go` prints.",
      },
    ],
    practiceTask: {
      title: "Warmup: CLI Command Router",
      tier: "Warmup",
      goal: "Map `\"start\"`/`\"run\"` -> `\"Running\"`, `\"stop\"`/`\"quit\"` -> `\"Stopped\"`, and any other text -> `\"Unknown\"` using `match / case`, then print the result.",
      constraints: ["Python 3.10+ match / case with | and case _"],
      examples: [
        { input: "cmd = \"run\"", output: "Running" },
        { input: "cmd = \"help\"", output: "Unknown" },
      ],
      tasks: [
        "Match `cmd` with OR patterns (`\"start\" | \"run\"`, `\"stop\" | \"quit\"`).",
        "Print `\"Unknown\"` in `case _:`.",
      ],
      starterCode: "# Exercise M02.5 Warmup: match / case router\ncmd = \"run\"\n# TODO: match command string and print status\n",
      expectedOutput: "Running\nUnknown",
      hint: "Separate literal patterns on one arm with `|`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "cmd = \"run\"\nmatch cmd:\n    case \"start\" | \"run\":\n        print(\"Running\")\n    case \"stop\" | \"quit\":\n        print(\"Stopped\")\n    case _:\n        print(\"Unknown\")\n\ncmd = \"help\"\nmatch cmd:\n    case \"start\" | \"run\":\n        print(\"Running\")\n    case \"stop\" | \"quit\":\n        print(\"Stopped\")\n    case _:\n        print(\"Unknown\")",
    },
    practiceChallenges: [
      {
        title: "Core: HTTP Status Family Classifier",
        tier: "Core",
        goal: "Use `match / case` on integer `code`: `200 | 201` -> `\"Success\"`, `400 | 404` -> `\"Client Error\"`, `500 | 503` -> `\"Server Error\"`, `case _:` -> `\"Other\"`, and print the label.",
        constraints: ["Handle exact status codes with | patterns"],
        examples: [
          { input: "code = 201", output: "Success" },
          { input: "code = 502", output: "Other" },
        ],
        tasks: [
          "Match each known code group using `|`.",
          "Print `\"Other\"` for unrecognized codes.",
        ],
        starterCode: "# Exercise M02.5 Core: HTTP status dispatcher\ncode = 201\n# TODO: classify code with match / case and print\n",
        expectedOutput: "Success\nOther",
        hint: "`502` is not listed, so it lands in `case _:`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "code = 201\nmatch code:\n    case 200 | 201:\n        print(\"Success\")\n    case 400 | 404:\n        print(\"Client Error\")\n    case 500 | 503:\n        print(\"Server Error\")\n    case _:\n        print(\"Other\")\n\ncode = 502\nmatch code:\n    case 200 | 201:\n        print(\"Success\")\n    case 400 | 404:\n        print(\"Client Error\")\n    case 500 | 503:\n        print(\"Server Error\")\n    case _:\n        print(\"Other\")",
      },
      {
        title: "Stretch: Command + Role Guard Case",
        tier: "Stretch",
        goal: "Combine `role` and `action` into `key = f\"{role}:{action}\"` and use `match / case` so `\"admin:delete\"`, `\"admin:edit\"`, and `\"editor:edit\"` print `\"Allowed\"`, and any other pair prints `\"Denied\"`.",
        constraints: ["Use match / case with | and case _"],
        examples: [
          { input: "role = \"admin\", action = \"delete\"", output: "Allowed" },
          { input: "role = \"guest\", action = \"delete\"", output: "Denied" },
        ],
        tasks: [
          "Build `key = f\"{role}:{action}\"` and write `match key:`.",
          "Match the permitted strings with `|` to print `\"Allowed\"` and default to `\"Denied\"` via `case _:`.",
        ],
        starterCode: "# Exercise M02.5 Stretch: role and action matching\nrole = \"admin\"\naction = \"delete\"\n# TODO: combine role and action, then match with |\n",
        expectedOutput: "Allowed\nDenied",
        hint: "Combine both values into one string (`f\"{role}:{action}\"`) so you can match literal strings with `|`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "role = \"admin\"\naction = \"delete\"\nkey = f\"{role}:{action}\"\nmatch key:\n    case \"admin:delete\" | \"admin:edit\" | \"editor:edit\":\n        print(\"Allowed\")\n    case _:\n        print(\"Denied\")\n\nrole = \"guest\"\naction = \"delete\"\nkey = f\"{role}:{action}\"\nmatch key:\n    case \"admin:delete\" | \"admin:edit\" | \"editor:edit\":\n        print(\"Allowed\")\n    case _:\n        print(\"Denied\")",
      },
    ],
  },

  "py-logical-ops": {
    lessonId: "py-logical-ops",
    subtitle: "Combine checks with `and`, `or`, `not`, trace short-circuiting and operator precedence, and write ternary expressions.",
    intro: {
      heading: "Combining Conditions and Short-Circuit Guards",
      explanation: [
        "Writing `if day == \"Saturday\" or \"Sunday\":` looks natural in English, yet Python parses it as `(day == \"Saturday\") or \"Sunday\"`—evaluating to `\"Sunday\"` (truthy) even when `day` is `\"Monday\"`. Putting `10 / x > 2` on the left of `x != 0` triggers a different bug by crashing with `ZeroDivisionError` before the zero check ever runs.",
        "Python's `and`, `or`, and `not` operators follow strict precedence (`not` before `and` before `or`) and short-circuit from left to right. Placing safety guards on the left stops unsafe right-hand checks early, and repeating full comparisons keeps compound conditions accurate.",
      ],
      analogy: "A safety interlock checks whether the guard door is closed before spinning up a saw blade; if the door check fails, power never reaches the motor.",
      realWorldUses: [
        "Guarding division or missing values (`x != 0 and 10 / x > 2`) before risky expressions execute",
        "Supplying fallback defaults (`raw_name or \"Guest\"`) and multi-rule form validation",
      ],
    },
    sections: [
      {
        heading: "Logical Operators (`and`, `or`, `not`), Precedence & Short-Circuiting",
        paragraphs: [
          "Combine conditions with `and` (both truthy), `or` (at least one truthy), and `not` (flips truth value). Precedence runs comparisons (`< == in is`) first, then `not`, then `and`, then `or`. Wrap mixed `and`/`or` logic in parentheses such as `(is_admin or is_owner) and is_active`.",
          "Both `and` and `or` short-circuit and return the operand that settled the expression: `x != 0 and 10 / x > 2` stops at `x != 0` when `x == 0`, skipping division by zero, while `\"\" or \"guest\"` skips the falsy empty string and returns `\"guest\"`.",
        ],
        table: {
          caption: "Logical Operators & Precedence (`A = True`, `B = False`)",
          headers: ["Operator", "Precedence & Behavior", "Example", "Common Role"],
          rows: [
            ["`not`", "Evaluates before `and`/`or`; flips bool", "`not is_locked`", "Negation flags"],
            ["`and`", "Evaluates before `or`; stops at first falsy value", "`x != 0 and 10 / x > 2`", "Safety guards + compound checks"],
            ["`or`", "Lowest logical precedence; stops at first truthy value", "`\"\" or \"guest\"` -> `\"guest\"`", "Fallbacks & allowed options"],
          ],
          highlightCol: 3,
        },
        visual: {
          kind: "operator-lab",
          caption: "Inspect short-circuit guards, or-fallbacks, and the classic day == Sat or Sun bug",
          presets: [
            {
              label: "x != 0 and 10/x > 2",
              left: "x != 0 (False)",
              op: "and",
              right: "10 / x > 2 (skipped)",
              result: "False",
              typeName: "bool",
              frequency: "Daily",
              note: "When x is 0, x != 0 is False so Python stops immediately and never evaluates 10 / 0.",
            },
            {
              label: "\"\" or \"guest\"",
              left: "\"\"",
              op: "or",
              right: "\"guest\"",
              result: "\"guest\"",
              typeName: "str",
              frequency: "Common",
              note: "An empty string is falsy, so or skips it and returns the right-hand fallback string.",
            },
            {
              label: "\"Mon\" == \"Sat\" or \"Sun\" (BUG!)",
              left: "\"Mon\" == \"Sat\"",
              op: "or",
              right: "\"Sun\"",
              result: "\"Sun\" (Truthy!)",
              typeName: "str -> True!",
              frequency: "Classic Bug",
              note: "Writing day == 'Sat' or 'Sun' evaluates False or 'Sun', returning 'Sun' (truthy)! Repeat the variable: day == 'Sat' or day == 'Sun'.",
            },
            {
              label: "not True",
              left: "",
              op: "not",
              right: "True",
              result: "False",
              typeName: "bool",
              frequency: "Daily",
              note: "not flips any boolean value.",
            },
          ],
        },
      },
      {
        heading: "Broken vs Working: `or` Traps, Precedence & Ternary Expressions",
        paragraphs: [
          "`0`, `0.0`, `\"\"`, `None`, and `False` are falsy; non-zero numbers and non-empty text are truthy. When `0` is a valid input, check `if x is not None:` instead of `if x:`, and repeat the variable on both sides of `or` (`day == \"Saturday\" or day == \"Sunday\"`).",
          "Because `and` binds tighter than `or`, parenthesize mixed rules (`is_open and (has_badge or is_admin)`). For compact one-line choices, use Python's ternary expression: `label = \"Adult\" if age >= 18 else \"Minor\"`.",
        ],
        table: {
          caption: "Truthiness & Inline Conditional Summary",
          headers: ["Pattern", "Meaning", "Example"],
          rows: [
            ["Falsy values", "`False`, `None`, `0`, `0.0`, `\"\"` (plus empty lists/dicts in Module 3+)", "`if \"\":` -> skipped"],
            ["`if x is not None:`", "Accepts `0` and `\"\"`, rejects only `None`", "`if tax is not None:`"],
            ["`a if cond else b`", "Inline conditional value expression", "`fee = 0 if total >= 50 else 6`"],
          ],
        },
        code: [
          "day = \"Monday\"",
          "# Broken: non-empty \"Sunday\" is always truthy",
          "print(\"Broken day:\", bool(day == \"Saturday\" or \"Sunday\"))",
          "# Working: repeat the comparison on both sides of or",
          "print(\"Working day:\", day == \"Saturday\" or day == \"Sunday\")",
          "",
          "# Precedence: 'and' binds tighter than 'or'",
          "is_open, has_badge, is_admin = False, True, True",
          "print(\"No parens:\", is_open and has_badge or is_admin)",
          "print(\"Parenthesized:\", is_open and (has_badge or is_admin))",
          "",
          "x = 0",
          "tier = \"Free\" if x == 0 else \"Paid\"",
          "print(x != 0 and (10 / x) > 2, tier)",
        ],
        output: "Broken day: True\nWorking day: False\nNo parens: True\nParenthesized: False\nFalse Free",
      },
    ],
    guidedBuildUp: {
      title: "Build a Short-Circuit Guard & Access Rule Step by Step",
      subtitle: "Start with a zero guard, add parentheses around mixed and/or logic, then format with a fallback and ternary expression.",
      steps: [
        {
          label: "Step 1: Put the safety guard on the left of and",
          explanation: "Test `x != 0` first so `and` stops immediately when `x` is `0` and never divides by zero.",
          code: [
            "x = 0",
            "safe = x != 0 and (10 / x) > 2",
            "print(\"Safe check:\", safe)",
          ],
          activeLines: [2, 3],
          output: "Safe check: False",
        },
        {
          label: "Step 2: Wrap mixed or/and clauses in parentheses",
          explanation: "Because `and` binds tighter than `or`, wrap `(has_badge or is_admin)` so `is_open` gates both options.",
          code: [
            "is_open = False",
            "has_badge = False",
            "is_admin = True",
            "allowed = is_open and (has_badge or is_admin)",
            "print(\"Allowed:\", allowed)",
          ],
          activeLines: [4, 5],
          output: "Allowed: False",
        },
        {
          label: "Step 3: Combine an or fallback with a ternary label",
          explanation: "Use `or` to replace an empty string with `\"Guest\"`, then pick an inline label using `a if cond else b`.",
          code: [
            "raw_name = \"\"",
            "display = raw_name or \"Guest\"",
            "x = 2",
            "safe = x != 0 and (10 / x) > 2",
            "badge = \"High\" if safe else \"Normal\"",
            "print(display, badge)",
          ],
          activeLines: [2, 5, 6],
          output: "Guest High",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace Short-Circuit Guards, Precedence & Ternary Assignment",
      steps: [
        {
          title: "Evaluate `raw_name or \"Guest\"` fallback",
          tag: "TRACE",
          explanation: ["`raw_name` is `\"\"` (falsy), so `or` moves right and returns `\"Guest\"`."],
          code: ["raw_name = \"\"", "display = raw_name or \"Guest\"", "x = 0", "safe = x != 0 and (10 / x) > 2", "badge = \"High\" if safe else \"Normal\"", "print(display, badge)"],
          activeLines: [1, 2],
          state: [{ name: "display", value: "\"Guest\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "Falsy left side forces or to evaluate and return 'Guest'.",
            branches: [
              { id: "l", label: "raw_name ('') -> falsy", status: "false" },
              { id: "r", label: "'Guest' -> returned by or", status: "true" },
            ],
          },
        },
        {
          title: "Short-circuit division guard before `10 / x`",
          tag: "PATTERN",
          explanation: ["`x != 0` is `False`, so `and` stops at once without executing `10 / 0`."],
          code: ["raw_name = \"\"", "display = raw_name or \"Guest\"", "x = 0", "safe = x != 0 and (10 / x) > 2", "badge = \"High\" if safe else \"Normal\"", "print(display, badge)"],
          activeLines: [3, 4],
          state: [
            { name: "x", value: "0", changed: true },
            { name: "safe", value: "False", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "and stops immediately on False, keeping (10 / 0) from crashing.",
            branches: [
              { id: "g", label: "x != 0 -> False", status: "false" },
              { id: "div", label: "(10 / x) > 2 -> skipped (safe!)", status: "skipped" },
            ],
          },
        },
        {
          title: "Pick inline value with ternary `a if cond else b`",
          tag: "CONCEPT",
          explanation: ["Because `safe` is `False`, the `else` side (`\"Normal\"`) is chosen."],
          code: ["raw_name = \"\"", "display = raw_name or \"Guest\"", "x = 0", "safe = x != 0 and (10 / x) > 2", "badge = \"High\" if safe else \"Normal\"", "print(display, badge)"],
          activeLines: [5],
          state: [{ name: "badge", value: "\"Normal\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "Ternary checks safe (middle) first, then selects the else expression.",
            branches: [
              { id: "t1", label: "'High' (skipped)", status: "skipped" },
              { id: "cond", label: "if safe -> False", status: "false" },
              { id: "t2", label: "else 'Normal' -> picked", status: "true" },
            ],
          },
        },
        {
          title: "Print combined result",
          tag: "CHECK",
          explanation: ["`display` and `badge` hold safe non-crashing defaults."],
          code: ["raw_name = \"\"", "display = raw_name or \"Guest\"", "x = 0", "safe = x != 0 and (10 / x) > 2", "badge = \"High\" if safe else \"Normal\"", "print(display, badge)"],
          activeLines: [6],
          state: [{ name: "printed", value: "\"Guest Normal\"", changed: true }],
          visual: {
            kind: "trace",
            caption: "Both guarded expressions resolve to safe defaults ('Guest' and 'Normal').",
            branches: [
              { id: "d", label: "display = 'Guest'", status: "true" },
              { id: "b", label: "badge = 'Normal'", status: "true" },
              { id: "out", label: "print('Guest', 'Normal')", status: "active" },
            ],
          },
          output: "Guest Normal",
        },
      ],
    },
    trickyPoints: [
      {
        title: "Writing `choice == \"y\" or \"yes\"` instead of repeating the variable",
        detail: "Always repeat the full comparison: `choice == \"y\" or choice == \"yes\"`.",
      },
      {
        title: "Mixing `and` and `or` without parentheses",
        detail: "`and` binds tighter than `or`, so write `is_open and (has_badge or is_admin)` explicitly.",
      },
    ],
    predictChecks: [
      {
        prompt: "Given `is_member = False`, `total = 120`, `has_coupon = False`, what prints?",
        code: "if is_member or (total >= 100 and not has_coupon):\n    print(\"Bonus gift!\")\nelse:\n    print(\"Standard order\")",
        options: [
          { id: "a", label: "`Standard order`" },
          { id: "b", label: "`Bonus gift!`" },
          { id: "c", label: "Nothing prints" },
        ],
        correctId: "b",
        explanation: "`total >= 100` is `True` and `not False` is `True`, so the right branch of `or` evaluates to `True`.",
      },
      {
        prompt: "What does `print(x != 0 and 10 / x > 2, \"\" or \"guest\")` output when `x = 0`?",
        code: "x = 0\nprint(x != 0 and 10 / x > 2, \"\" or \"guest\")",
        options: [
          { id: "a", label: "`False guest`" },
          { id: "b", label: "`ZeroDivisionError`" },
          { id: "c", label: "`True guest`" },
        ],
        correctId: "a",
        explanation: "`x != 0` short-circuits to `False`; `\"\" or \"guest\"` returns `\"guest\"`.",
      },
    ],
    practiceTask: {
      title: "Warmup: Parenthesized Access Guard",
      tier: "Warmup",
      goal: "Print `True` only when `is_open` is `True` and either `has_badge` or `is_admin` is `True`; otherwise print `False`.",
      constraints: ["Use parentheses around the or clause"],
      examples: [
        { input: "is_open = True, has_badge = False, is_admin = True", output: "True" },
        { input: "is_open = False, has_badge = True, is_admin = True", output: "False" },
      ],
      tasks: [
        "Compute `is_open and (has_badge or is_admin)` and pass it to `print(...)`.",
        "Test both `True` and `False` cases for `is_open`.",
      ],
      starterCode: "# Exercise M02.6 Warmup: precedence with and/or\nis_open = True\nhas_badge = False\nis_admin = True\n# TODO: print access result with parentheses\n",
      expectedOutput: "True\nFalse",
      hint: "Without parentheses, `is_open and has_badge or is_admin` wrongly allows `is_admin` when `is_open` is `False`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "is_open = True\nhas_badge = False\nis_admin = True\nprint(is_open and (has_badge or is_admin))\n\nis_open = False\nhas_badge = True\nis_admin = True\nprint(is_open and (has_badge or is_admin))",
    },
    practiceChallenges: [
      {
        title: "Core: Multi-Rule Password Validator",
        tier: "Core",
        goal: "Print `\"Password ok\"` if `len(pw) >= 8`, `pw != \"password\"`, and `\" \" not in pw`; else print `\"Password too weak\"`.",
        constraints: ["Store checks in readable bool variables before combining with and"],
        examples: [
          { input: "pw = \"secret99\"", output: "Password ok" },
          { input: "pw = \"pass word\"", output: "Password too weak" },
        ],
        tasks: [
          "Compute `long_enough`, `not_common`, and `no_spaces`.",
          "Use an inline ternary expression or `if/else` to print the result.",
        ],
        starterCode: "# Exercise M02.6 Core: password policy check\npw = \"secret99\"\n# TODO: validate length, disallowed literal, and spaces, then print\n",
        expectedOutput: "Password ok\nPassword too weak",
        hint: "Use `\" \" not in pw` to reject spaces.",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "pw = \"secret99\"\nlong_enough = len(pw) >= 8\nnot_common = pw != \"password\"\nno_spaces = \" \" not in pw\nprint(\"Password ok\" if (long_enough and not_common and no_spaces) else \"Password too weak\")\n\npw = \"pass word\"\nlong_enough = len(pw) >= 8\nnot_common = pw != \"password\"\nno_spaces = \" \" not in pw\nprint(\"Password ok\" if (long_enough and not_common and no_spaces) else \"Password too weak\")",
      },
      {
        title: "Stretch: Safe Ratio & Leap Year Rule",
        tier: "Stretch",
        goal: "Print `True` for a Gregorian leap year (`(year % 4 == 0 and year % 100 != 0) or year % 400 == 0`), `False` otherwise.",
        constraints: ["1 <= year <= 9999"],
        examples: [
          { input: "year = 2000", output: "True" },
          { input: "year = 1900", output: "False" },
        ],
        tasks: [
          "Combine divisibility rules `% 4`, `% 100`, and `% 400`.",
          "Verify century years like `1900` (`False`) vs `2000` (`True`).",
        ],
        starterCode: "# Exercise M02.6 Stretch: leap year boolean logic\nyear = 2000\n# TODO: apply 4 / 100 / 400 divisibility rule and print\n",
        expectedOutput: "True\nFalse",
        hint: "Century years divisible by `100` are leap years only if also divisible by `400`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "year = 2000\nprint((year % 4 == 0 and year % 100 != 0) or (year % 400 == 0))\n\nyear = 1900\nprint((year % 4 == 0 and year % 100 != 0) or (year % 400 == 0))",
      },
    ],
  },
};

export const m02Quiz: ModuleQuiz = {
  moduleId: "py-m2",
  title: "Module 02 Quiz: Decisions & Logic",
  description: "10 questions covering booleans, comparisons, `is None`, `in`/`not in`, `if/elif/else`, `match/case`, truthiness, short-circuiting, and logical operators.",
  questions: [
    {
      id: "m2-q1",
      prompt: "What does `print(x is None, x is not None)` output when `x = None`?",
      code: "x = None\nprint(x is None, x is not None)",
      options: [
        { id: "a", label: "`True False`" },
        { id: "b", label: "`False True`" },
        { id: "c", label: "`True True`" },
      ],
      correctId: "a",
      explanation: "When `x` holds `None`, `x is None` is `True` and `x is not None` is `False`.",
      lessonRefId: "py-none-identity",
    },
    {
      id: "m2-q2",
      prompt: "What does `\"@\" not in \"sam.example.com\"` evaluate to?",
      options: [
        { id: "a", label: "`False`" },
        { id: "b", label: "`True`" },
        { id: "c", label: "Raises `TypeError`" },
      ],
      correctId: "b",
      explanation: "`not in` returns `True` because `'@'` does not appear anywhere inside the string.",
      lessonRefId: "py-none-identity",
    },
    {
      id: "m2-q3",
      prompt: "What does `print(a or b and c)` output when `a = True`, `b = False`, `c = False`?",
      code: "a = True\nb = False\nc = False\nprint(a or b and c)",
      options: [
        { id: "a", label: "`False`" },
        { id: "b", label: "`None`" },
        { id: "c", label: "`True`" },
      ],
      correctId: "c",
      explanation: "`and` binds tighter than `or`, so `b and c` is `False`, then `True or False` evaluates to `True`.",
      lessonRefId: "py-logical-ops",
    },
    {
      id: "m2-q4",
      prompt: "What is printed when `temp = 30`?",
      code: "temp = 30\nif temp > 25:\n    print(\"Warm\")\nprint(\"Done\")",
      options: [
        { id: "a", label: "`Warm` only" },
        { id: "b", label: "`Warm` then `Done`" },
        { id: "c", label: "`Done` only" },
      ],
      correctId: "b",
      explanation: "`30 > 25` is `True`, so `\"Warm\"` prints, then the unindented `print(\"Done\")` runs afterward.",
      lessonRefId: "py-if-else",
    },
    {
      id: "m2-q5",
      prompt: "Why does `if score >= 60:` fail if the next line starts at column 0 (no spaces)?",
      options: [
        { id: "a", label: "Python uses indentation to know which lines belong inside the `if` block" },
        { id: "b", label: "`if` blocks must end with `;`" },
        { id: "c", label: "Variables must be declared first" },
      ],
      correctId: "a",
      explanation: "After any colon `:`, at least one indented line must follow so Python sees what belongs inside the block.",
      lessonRefId: "py-if-else",
    },
    {
      id: "m2-q6",
      prompt: "If `n = 95`, what does this buggy grade checker print?",
      code: "n = 95\nif n >= 70:\n    print(\"C\")\nelif n >= 90:\n    print(\"A\")",
      options: [
        { id: "a", label: "`A`" },
        { id: "b", label: "`C` and `A`" },
        { id: "c", label: "`C`" },
      ],
      correctId: "c",
      explanation: "Because `n >= 70` comes first and `95 >= 70` is `True`, Python runs `print(\"C\")` and skips the rest.",
      lessonRefId: "py-elif-chains",
    },
    {
      id: "m2-q7",
      prompt: "In a `match cmd:` block (Python 3.10+), how do you write the wildcard fallback arm?",
      options: [
        { id: "a", label: "`case default:`" },
        { id: "b", label: "`case _:`" },
        { id: "c", label: "`else:`" },
      ],
      correctId: "b",
      explanation: "`case _:` matches any value that did not match an earlier `case` arm without falling through.",
      lessonRefId: "py-match-case",
    },
    {
      id: "m2-q8",
      prompt: "Which check correctly tests if `role` is either `\"admin\"` or `\"editor\"`?",
      options: [
        { id: "a", label: "`role == \"admin\" or \"editor\"`" },
        { id: "b", label: "`role == (\"admin\" and \"editor\")`" },
        { id: "c", label: "`role == \"admin\" or role == \"editor\"`" },
      ],
      correctId: "c",
      explanation: "Both sides of `or` must be complete comparisons: `role == \"admin\" or role == \"editor\"`.",
      lessonRefId: "py-logical-ops",
    },
    {
      id: "m2-q9",
      prompt: "What happens when `x = 0` and you run `print(x != 0 and 10 / x > 2)`?",
      code: "x = 0\nprint(x != 0 and 10 / x > 2)",
      options: [
        { id: "a", label: "Prints `False` (short-circuits before dividing by zero)" },
        { id: "b", label: "Raises `ZeroDivisionError`" },
        { id: "c", label: "Prints `True`" },
      ],
      correctId: "a",
      explanation: "`x != 0` evaluates to `False`, so `and` stops immediately and never evaluates `10 / x`.",
      lessonRefId: "py-logical-ops",
    },
    {
      id: "m2-q10",
      prompt: "Which statement is `True` when `x = 15`?",
      options: [
        { id: "a", label: "`x > 10 and x < 15`" },
        { id: "b", label: "`10 <= x <= 20`" },
        { id: "c", label: "`x < 0 or x == 10`" },
      ],
      correctId: "b",
      explanation: "Chained comparison `10 <= 15 <= 20` is `True`.",
      lessonRefId: "py-booleans-compare",
    },
  ],
};

export const m02PracticeSet: ModulePracticeSet = {
  moduleId: "py-m2",
  title: "Module 02 Practice Set: Decisions, None & Guards",
  description:
    "Four exercises combining ordered thresholds, match/case command routing, None/membership guards, and short-circuit boolean logic.",
  problems: [
    {
      id: "py-m2-p1",
      title: "Numeric String Ordering + None Guard",
      patternHint: "Guard missing values with 'is not None' before casting numeric strings with int().",
      lessonRefId: "py-none-identity",
      goal: "Given `raw_a` and `raw_b` (`str` or `None`), print `\"missing\"` if either is `None`, otherwise `True` if `int(raw_a) < int(raw_b)` else `False`.",
      constraints: ["Must handle None without raising TypeError", "Compare numerically, not alphabetically"],
      examples: [
        { input: "raw_a = \"2\", raw_b = \"10\"", output: "True" },
        { input: "raw_a = None, raw_b = \"5\"", output: "missing" },
      ],
      tasks: [
        "Check `if raw_a is None or raw_b is None:` first and print `\"missing\"`.",
        "Otherwise print `int(raw_a) < int(raw_b)`.",
      ],
      starterCode: "# Practice M02.1: safe numeric string comparison\nraw_a = \"2\"\nraw_b = \"10\"\n# TODO: check None then compare ints and print\n",
      expectedOutput: "True\nmissing",
      hint: "Evaluate `is None` before calling `int(...)`.",
      complexity: { time: "O(d)", space: "O(1)" },
      solutionCode:
        "raw_a = \"2\"\nraw_b = \"10\"\nif raw_a is None or raw_b is None:\n    print(\"missing\")\nelse:\n    print(int(raw_a) < int(raw_b))\n\nraw_a = None\nraw_b = \"5\"\nif raw_a is None or raw_b is None:\n    print(\"missing\")\nelse:\n    print(int(raw_a) < int(raw_b))",
    },
    {
      id: "py-m2-p2",
      title: "Shipping Fee Tier & Discount Guard",
      patternHint: "Order elif thresholds strictly downward and check discount is not None so 0% passes.",
      lessonRefId: "py-elif-chains",
      goal: "Apply tier shipping (`>= 100` -> `0`, `>= 50` -> `4`, else `8`), subtract `discount` only if `discount is not None`, and print the final net order amount.",
      constraints: ["total >= 0", "0 <= discount <= total when present"],
      examples: [
        { input: "total = 60, discount = 0", output: "64" },
        { input: "total = 120, discount = 20", output: "100" },
      ],
      tasks: [
        "Pick `shipping` with `if total >= 100:`, `elif total >= 50:`, `else:`.",
        "Subtract `discount` when `discount is not None` and print `total + shipping - off`.",
      ],
      starterCode: "# Practice M02.2: shipping bracket calculator\ntotal = 60\ndiscount = 0\n# TODO: pick tier shipping, apply optional discount, and print\n",
      expectedOutput: "64\n100",
      hint: "`total + shipping - (0 if discount is None else discount)` keeps `discount = 0` explicit.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "total = 60\ndiscount = 0\nif total >= 100:\n    shipping = 0\nelif total >= 50:\n    shipping = 4\nelse:\n    shipping = 8\noff = 0 if discount is None else discount\nprint(total + shipping - off)\n\ntotal = 120\ndiscount = 20\nif total >= 100:\n    shipping = 0\nelif total >= 50:\n    shipping = 4\nelse:\n    shipping = 8\noff = 0 if discount is None else discount\nprint(total + shipping - off)",
    },
    {
      id: "py-m2-p3",
      title: "Command & Flag Access Dispatcher",
      patternHint: "Use match / case for literal command actions and combine with boolean authorization.",
      lessonRefId: "py-match-case",
      goal: "If `not is_active` print `\"locked\"`. Otherwise dispatch `cmd`: `\"read\" | \"list\"` -> `\"ok\"`, `\"write\" | \"delete\"` -> `\"admin\"` if `is_admin` else `\"denied\"`, else `\"unknown\"`.",
      constraints: ["Active flag blocks all commands when False"],
      examples: [
        { input: "cmd = \"delete\", is_active = True, is_admin = False", output: "denied" },
        { input: "cmd = \"list\", is_active = False, is_admin = True", output: "locked" },
      ],
      tasks: [
        "Guard `if not is_active:` to print `\"locked\"`.",
        "In `else:`, dispatch `cmd` with `match / case` and print the status.",
      ],
      starterCode: "# Practice M02.3: guard + match dispatcher\ncmd = \"delete\"\nis_active = True\nis_admin = False\n# TODO: check active state then match cmd and print\n",
      expectedOutput: "denied\nlocked",
      hint: "Handle `if not is_active:` first, then put `match cmd:` inside `else:`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "cmd = \"delete\"\nis_active = True\nis_admin = False\nif not is_active:\n    print(\"locked\")\nelse:\n    match cmd:\n        case \"read\" | \"list\":\n            print(\"ok\")\n        case \"write\" | \"delete\":\n            print(\"admin\" if is_admin else \"denied\")\n        case _:\n            print(\"unknown\")\n\ncmd = \"list\"\nis_active = False\nis_admin = True\nif not is_active:\n    print(\"locked\")\nelse:\n    match cmd:\n        case \"read\" | \"list\":\n            print(\"ok\")\n        case \"write\" | \"delete\":\n            print(\"admin\" if is_admin else \"denied\")\n        case _:\n            print(\"unknown\")",
    },
    {
      id: "py-m2-p4",
      title: "Safe Division Ratio With Bounds",
      patternHint: "Use and short-circuiting to prevent ZeroDivisionError before dividing.",
      lessonRefId: "py-logical-ops",
      goal: "Print `True` if `denom > 0` and `(num / denom) >= min_ratio`, otherwise `False`.",
      constraints: ["Must never divide by zero when denom == 0"],
      examples: [
        { input: "num = 25, denom = 5, min_ratio = 4.0", output: "True" },
        { input: "num = 10, denom = 0, min_ratio = 1.0", output: "False" },
      ],
      tasks: [
        "Place `denom > 0` first inside `and` so `0` and negatives short-circuit immediately.",
        "Check `(num / denom) >= min_ratio` and print the boolean result.",
      ],
      starterCode: "# Practice M02.4: short-circuit ratio guard\nnum = 25\ndenom = 5\nmin_ratio = 4.0\n# TODO: guard denom > 0 before dividing and print\n",
      expectedOutput: "True\nFalse",
      hint: "`denom > 0 and (num / denom) >= min_ratio` handles both `denom == 0` and negative denominators.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "num = 25\ndenom = 5\nmin_ratio = 4.0\nprint(denom > 0 and (num / denom) >= min_ratio)\n\nnum = 10\ndenom = 0\nmin_ratio = 1.0\nprint(denom > 0 and (num / denom) >= min_ratio)",
    },
  ],
};
