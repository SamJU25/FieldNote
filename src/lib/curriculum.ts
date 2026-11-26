export type LessonMeta = {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
};

export type ModuleTier = "Beginner" | "Intermediate" | "Advanced" | "Pro";

export type CourseModule = {
  id: string;
  number: string;
  title: string;
  summary: string;
  tier?: ModuleTier;
  quizCount?: number;
  practiceSetCount?: number;
  lessons: LessonMeta[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  accent: string;
  coverImage?: string;
  assessmentKind?: "quiz" | "practice-set";
  whyThisCourse: string[];
  modules: CourseModule[];
};

export const courses: Course[] = [
  {
    id: "python",
    slug: "python",
    title: "Python",
    tagline: "Step-by-step from installing Python to concurrency, typing, packaging, and tested CLI systems.",
    description:
      "Start with zero coding experience. Progress through setup, syntax, loops, memory references, files, OOP, the Python data model, concurrency and asyncio, production tooling, and a multi-file capstone.",
    accent: "#3572A5",
    coverImage: "/images/course-python.jpg",
    assessmentKind: "practice-set",
    whyThisCourse: [
      "Starts with a 60-second setup check before your first script, then focuses every lesson on one clear topic.",
      "Follows practical learning order: lists and `for` loops before `while`, functions before memory aliasing.",
      "Pairs plain explanations and runnable examples with diagrams where state or memory clarifies execution.",
      "Every lesson ends with Warmup, Core, and Stretch exercises, and each module closes with a 4-problem practice set.",
    ],
    modules: [
      {
        id: "py-m0",
        number: "00",
        title: "Quick Start & Terminal Workflow",
        summary: "Already have Python 3 and an editor? Run the 60-second check and jump to Module 01. Otherwise verify PATH, interpreter setup, terminal commands, and tracebacks.",
        quizCount: 10,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-install-editor",
            title: "60-Second Environment Check (Skip if Ready)",
            summary: "Verify any current Python 3 release in your terminal and editor, fix PATH or interpreter snags, or skip straight to Module 01.",
            estimatedMinutes: 5,
          },
          {
            id: "py-terminal-files",
            title: "Terminal Workflow, Tracebacks & Ctrl+C",
            summary: "Check working folders, run saved scripts, stop stuck loops with Ctrl+C, and read Python tracebacks bottom-up.",
            estimatedMinutes: 8,
          },
        ],
      },
      {
        id: "py-m1",
        number: "01",
        title: "Core Types, Operators & Variables",
        summary: "Output, core data types, variable naming & assignment operators, arithmetic operators, f-strings, type casting, and user input.",
        quizCount: 10,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-hello-print",
            title: "Output (print), Comments (#) & Print Arguments",
            summary: "Display text and numbers with `print()`, use `sep=` and `end=`, and write `#` comments.",
            estimatedMinutes: 10,
          },
          {
            id: "py-numbers-math",
            title: "Core Data Types (int, float, str, bool, None) & Basic Math",
            summary: "Understand Python core data types, check types with `type()`, and calculate with `+`, `-`, `*`, `/`, and `(...)`.",
            estimatedMinutes: 12,
          },
          {
            id: "py-variables-basics",
            title: "Variables, Naming Rules & Assignment Operators",
            summary: "Assign variables, apply legal naming rules & `snake_case`, and use augmented operators (`+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`).",
            estimatedMinutes: 12,
          },
          {
            id: "py-div-mod-power",
            title: "Arithmetic Operators & Precedence",
            summary: "Compare all 7 arithmetic operators (`+ - * / // % **`), operator precedence, and negative floor division/modulo.",
            estimatedMinutes: 12,
          },
          {
            id: "py-strings-fstrings",
            title: "Strings, Escapes & f-String Formatting",
            summary: "Concatenate text, escape characters (`\\n`, `\\t`), write raw strings (`r\"...\"`), and format numbers with f-strings (`:.2f`, `:,`).",
            estimatedMinutes: 11,
          },
          {
            id: "py-input-casting",
            title: "User Input (input) & Type Casting",
            summary: "Read text from `input()` and convert strings into `int`, `float`, and `bool` without crashing on bad input.",
            estimatedMinutes: 11,
          },
        ],
      },
      {
        id: "py-m2",
        number: "02",
        title: "Decisions & Logic",
        summary: "Booleans, comparison operators, `None` identity, membership (`in`), `if/elif/else`, `match/case`, and logical short-circuiting.",
        quizCount: 10,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-booleans-compare",
            title: "Booleans (True/False) & Comparison Operators",
            summary: "Evaluate `bool` conditions with all 6 comparison operators (`== != < <= > >=`) and chained bounds (`13 <= age <= 19`).",
            estimatedMinutes: 10,
          },
          {
            id: "py-none-identity",
            title: "None, Identity (is) & Membership (in / not in)",
            summary: "Check unset state with `is None` / `is not None`, separate `is` from `==`, and test substring membership with `in`.",
            estimatedMinutes: 10,
          },
          {
            id: "py-if-else",
            title: "Conditional Branching: if / else & Indentation",
            summary: "Write two-way decisions with `if`, `else`, colons `:`, and consistent 4-space indentation.",
            estimatedMinutes: 11,
          },
          {
            id: "py-elif-chains",
            title: "Multi-Way Branching: Ordered elif Chains",
            summary: "Order `if / elif / else` thresholds strictly downward or upward without shadowing earlier cases.",
            estimatedMinutes: 11,
          },
          {
            id: "py-match-case",
            title: "Pattern Dispatch: match / case (Python 3.10+)",
            summary: "Route fixed commands and status codes with `match / case`, `|` OR patterns, and `case _:` fallback.",
            estimatedMinutes: 10,
          },
          {
            id: "py-logical-ops",
            title: "Logical Operators (and, or, not) & Short-Circuiting",
            summary: "Combine checks with `and`/`or`/`not`, trace short-circuit guards and operator precedence, and write ternary expressions.",
            estimatedMinutes: 12,
          },
        ],
      },
      {
        id: "py-m3",
        number: "03",
        title: "Lists & for Loops",
        summary: "Ordered lists, indexing, slicing, list methods, `for` loops, `range()`, accumulators, and `any()`/`all()`.",
        quizCount: 10,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-lists-intro",
            title: "Lists: Creation, Indexing & Slicing",
            summary: "Create ordered lists, index front or back positions, slice sublists (`start:stop:step`), and check membership.",
            estimatedMinutes: 12,
          },
          {
            id: "py-lists-modify",
            title: "List Methods: append, extend, pop, remove & sort",
            summary: "Mutate lists (`append`, `extend`, `insert`, `pop`, `remove`) and pick `sort()` vs `sorted()`.",
            estimatedMinutes: 12,
          },
          {
            id: "py-for-lists",
            title: "for Loops Over Sequences",
            summary: "Iterate sequences element by element without mutating the source list mid-loop.",
            estimatedMinutes: 11,
          },
          {
            id: "py-for-range",
            title: "Number Sequences & Index Loops with range()",
            summary: "Repeat tasks `N` times, step downward with negative steps, and update indices via `range(len(items))`.",
            estimatedMinutes: 11,
          },
          {
            id: "py-accumulators",
            title: "Accumulator Patterns & Trace Tables",
            summary: "Build running sums, counts, filtered lists, and max/min trackers with empty-list guards.",
            estimatedMinutes: 12,
          },
          {
            id: "py-any-all",
            title: "Collective Truth Checks: any() & all()",
            summary: "Verify whether at least one item or every item satisfies a condition and handle empty `[]` edge cases.",
            estimatedMinutes: 10,
          },
        ],
      },
      {
        id: "py-m4",
        number: "04",
        title: "while Loops, Sentinels, Grids & Text",
        summary: "Condition loops, `break`/`continue`, sentinel streams, nested 2D loops, and string methods & formatting.",
        quizCount: 10,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-while-loops",
            title: "while Loops & Termination Conditions",
            summary: "Repeat work until a condition becomes False while advancing loop state every pass.",
            estimatedMinutes: 11,
          },
          {
            id: "py-break-continue",
            title: "Loop Control: break, continue & pass",
            summary: "Exit loops early with `break`, skip single passes with `continue`, and avoid counter bugs.",
            estimatedMinutes: 10,
          },
          {
            id: "py-sentinel-loops",
            title: "Sentinel Loops & Bounded Retries",
            summary: "Read open-ended streams until a stop sentinel (`\"done\"`, `0`) with retry bounds.",
            estimatedMinutes: 10,
          },
          {
            id: "py-nested-loops",
            title: "Nested Loops & 2D Grids",
            summary: "Trace outer and inner loops across 2D lists, row resets, and outer search breaks.",
            estimatedMinutes: 12,
          },
          {
            id: "py-string-tools",
            title: "String Slicing & Text Methods",
            summary: "Slice immutable strings and normalize text with `strip`, `lower`, `split`, `join`, and padding.",
            estimatedMinutes: 12,
          },
        ],
      },
      {
        id: "py-m5",
        number: "05",
        title: "Functions & Problem Solving",
        summary: "Reusable `def` blocks, `return` values, defaults & keyword args, guard clauses, LEGB scope, decomposition, and recursion.",
        quizCount: 10,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-functions-intro",
            title: "Functions: def, Parameters & Call Stack",
            summary: "Define callable functions with clear verb names, parameters, arguments, and docstrings.",
            estimatedMinutes: 11,
          },
          {
            id: "py-return-vs-print",
            title: "return vs print() & Multiple Return Values",
            summary: "Hand values back to callers with `return` instead of only printing to screen.",
            estimatedMinutes: 12,
          },
          {
            id: "py-default-keyword-args",
            title: "Default Parameters & Keyword Arguments",
            summary: "Pass optional `=` defaults and keyword names while avoiding ordering and duplicate errors.",
            estimatedMinutes: 10,
          },
          {
            id: "py-guard-clauses",
            title: "Guard Clauses & Early Returns",
            summary: "Validate invalid inputs up front with early `return`s to eliminate nested `if/else` pyramids.",
            estimatedMinutes: 10,
          },
          {
            id: "py-scope-basics",
            title: "Variable Scope (LEGB) & Built-In Safety",
            summary: "Trace Local, Enclosing, Global, and Built-in lookup and prevent `UnboundLocalError`.",
            estimatedMinutes: 11,
          },
          {
            id: "py-decomposition",
            title: "Function Decomposition & Single-Job Helpers",
            summary: "Split multi-step workflows into pure testable helpers that compose into a pipeline.",
            estimatedMinutes: 11,
          },
          {
            id: "py-recursion-basics",
            title: "Recursion Basics & Base Cases",
            summary: "Trace self-calling functions down to their base case and compare stack depth against loops.",
            estimatedMinutes: 11,
          },
        ],
      },
      {
        id: "py-m6",
        number: "06",
        title: "Dicts, Sets, Trade-offs & Memory",
        summary: "Tuples, dictionaries, sets, collection trade-offs, object references, shallow vs deep copy, and mutable defaults.",
        quizCount: 12,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-tuples-unpacking",
            title: "Tuples & Sequence Unpacking",
            summary: "Store immutable records, use `(x,)` trailing commas, swap variables, and unpack `*rest`.",
            estimatedMinutes: 10,
          },
          {
            id: "py-dicts-basics",
            title: "Dictionaries, Methods & O(1) Lookup",
            summary: "Store key-value pairs and use `.get()`, `.items()`, `.setdefault()`, and `|` merging.",
            estimatedMinutes: 12,
          },
          {
            id: "py-sets-unique",
            title: "Sets, Deduplication & Set Math (& | -)",
            summary: "Deduplicate values with `set()`, remove items without KeyError via `.discard()`, and compute overlaps.",
            estimatedMinutes: 11,
          },
          {
            id: "py-collection-tradeoffs",
            title: "Collection Trade-offs: list vs tuple vs set vs dict",
            summary: "Choose built-in containers by ordering, mutability, hashability, and `O(1)` vs `O(n)` speed.",
            estimatedMinutes: 10,
          },
          {
            id: "py-refs-mutability",
            title: "Object References, id(), is vs == & Mutability",
            summary: "Trace labels vs heap objects, interning traps, and `+=` in-place mutation vs `+` rebinding.",
            estimatedMinutes: 12,
          },
          {
            id: "py-aliasing-copy",
            title: "Aliasing, Shallow vs Deep Copy & Grids",
            summary: "Protect nested lists across functions with `.copy()`, `copy.deepcopy()`, and safe grid allocation.",
            estimatedMinutes: 11,
          },
          {
            id: "py-mutable-defaults",
            title: "Mutable Default Argument Trap (box=[] vs None)",
            summary: "Avoid shared `def`-time mutable defaults using immutable `None` initialization.",
            estimatedMinutes: 10,
          },
        ],
      },
      {
        id: "py-m7",
        number: "07",
        title: "Errors, Files, Regex & Stdlib",
        summary: "Tracebacks, exception handling, `pathlib` file I/O, JSON/CSV, `urllib` HTTP APIs, regex, stdlib tools, and `sqlite3`/`subprocess`.",
        quizCount: 12,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-tracebacks-debug",
            title: "Errors, Tracebacks & Debugging",
            summary: "Classify syntax, runtime, and logic bugs and read Python tracebacks bottom-to-top.",
            estimatedMinutes: 11,
          },
          {
            id: "py-exceptions-try",
            title: "Exception Handling: try, except, else, finally & raise",
            summary: "Recover from failures, catch specific exceptions, and validate inputs with `raise`.",
            estimatedMinutes: 13,
          },
          {
            id: "py-files-pathlib",
            title: "File I/O with pathlib & with open(...)",
            summary: "Read and write UTF-8 files cross-platform with `pathlib.Path` and `with` blocks.",
            estimatedMinutes: 13,
          },
          {
            id: "py-json-csv",
            title: "Structured Data: JSON & CSV Parsing",
            summary: "Serialize dicts/lists as JSON and read CSV columns with `csv.DictReader`.",
            estimatedMinutes: 11,
          },
          {
            id: "py-http-apis",
            title: "HTTP Requests & JSON APIs with urllib",
            summary: "Fetch and parse JSON endpoints using `urllib.request`, status checks, and timeouts.",
            estimatedMinutes: 12,
          },
          {
            id: "py-regex-basics",
            title: "Regular Expressions (re)",
            summary: "Extract and replace text patterns with `search`, `findall`, `fullmatch`, and `sub`.",
            estimatedMinutes: 13,
          },
          {
            id: "py-stdlib-toolbox",
            title: "Built-ins & Standard Library (math, random, datetime)",
            summary: "Use core built-ins alongside deterministic `math`, `random`, and `datetime` helpers.",
            estimatedMinutes: 12,
          },
          {
            id: "py-sqlite-subprocess",
            title: "Local Databases (sqlite3) & Safe Subprocess",
            summary: "Run parameterized `sqlite3` queries and safe argument-list commands via `subprocess.run`.",
            estimatedMinutes: 13,
          },
        ],
      },
      {
        id: "py-m8",
        number: "08",
        title: "Object-Oriented Programming",
        summary: "Classes, `self`, instance vs class attributes, dunders, `@property`, inheritance, composition, dataclasses, and `Enum`.",
        quizCount: 12,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-classes-self",
            title: "Classes, Objects, __init__ & self",
            summary: "Turn plain dicts into class blueprints, initialize state in `__init__`, and trace `self` bindings.",
            estimatedMinutes: 12,
          },
          {
            id: "py-attrs-methods",
            title: "Instance vs Class Attributes & @classmethod",
            summary: "Separate instance fields from class defaults and add alternative constructors via `@classmethod`.",
            estimatedMinutes: 12,
          },
          {
            id: "py-dunders",
            title: "Special Dunder Methods (__repr__, __eq__, __len__)",
            summary: "Hook custom classes into `repr()`, `len()`, indexing, and equality checks.",
            estimatedMinutes: 12,
          },
          {
            id: "py-properties",
            title: "Managed Attributes with @property",
            summary: "Add read-only computed attributes and setter validation without changing caller syntax.",
            estimatedMinutes: 11,
          },
          {
            id: "py-inheritance-super",
            title: "Inheritance & super() Delegation",
            summary: "Extend base classes with `super().__init__` and override methods.",
            estimatedMinutes: 12,
          },
          {
            id: "py-composition",
            title: "Composition Over Deep Inheritance",
            summary: "Inject swappable collaborator objects into `__init__` (`has-a`) instead of deep hierarchies.",
            estimatedMinutes: 12,
          },
          {
            id: "py-dataclasses",
            title: "Dataclasses & default_factory",
            summary: "Generate `__init__`, `__repr__`, `__eq__`, and hashable immutable models via `@dataclass`.",
            estimatedMinutes: 11,
          },
          {
            id: "py-enums",
            title: "Safe Choice Constants with Enum",
            summary: "Replace magic strings and bare ints using `Enum`, `StrEnum`, and `IntEnum`.",
            estimatedMinutes: 10,
          },
        ],
      },
      {
        id: "py-m9",
        number: "09",
        title: "Deeper Python & Engineering",
        summary: "Comprehensions, enumerate/zip, *args/**kwargs, closures, decorators, iterators, generators, type hints, modules, .venv, and pytest.",
        quizCount: 12,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-comprehensions",
            title: "List, Dict & Set Comprehensions",
            summary: "Filter and transform collections declaratively in readable comprehension expressions.",
            estimatedMinutes: 11,
          },
          {
            id: "py-enumerate-zip",
            title: "Counting with enumerate() & Pairing with zip()",
            summary: "Replace manual index counters and walk equal-length sequences with `zip(..., strict=True)`.",
            estimatedMinutes: 10,
          },
          {
            id: "py-args-kwargs",
            title: "Variable *args, **kwargs & Unpacking",
            summary: "Accept flexible positional and keyword arguments and forward collections.",
            estimatedMinutes: 11,
          },
          {
            id: "py-closures",
            title: "First-Class Functions, Closures & Late Binding",
            summary: "Retain state via `nonlocal` in closures and freeze loop variables.",
            estimatedMinutes: 12,
          },
          {
            id: "py-decorators",
            title: "Decorators & functools.wraps",
            summary: "Wrap functions via `@decorator`, argument forwarding, and `@wraps` metadata.",
            estimatedMinutes: 13,
          },
          {
            id: "py-iterators",
            title: "The Iterator Protocol (__iter__ & __next__)",
            summary: "Trace `iter()`, `next()`, `StopIteration`, and single-pass cursor exhaustion.",
            estimatedMinutes: 11,
          },
          {
            id: "py-generators",
            title: "Lazy Generators (yield & yield from)",
            summary: "Stream values lazily in constant extra memory using `yield` and generator expressions.",
            estimatedMinutes: 12,
          },
          {
            id: "py-type-hints",
            title: "Static Type Hints, TypedDict & Protocol",
            summary: "Annotate `X | None` unions, JSON dicts (`TypedDict`), and structural interfaces (`Protocol`).",
            estimatedMinutes: 12,
          },
          {
            id: "py-modules-packages",
            title: "Modules, Packages & __name__ == '__main__'",
            summary: "Organize multi-file imports, avoid module shadowing, and guard script execution.",
            estimatedMinutes: 11,
          },
          {
            id: "py-venv-packaging",
            title: "Virtual Environments (.venv) & pyproject.toml",
            summary: "Isolate dependencies per project with `.venv`, `python -m pip`, and `pyproject.toml`.",
            estimatedMinutes: 11,
          },
          {
            id: "py-pytest-testing",
            title: "Unit Testing with pytest",
            summary: "Verify behavior using `assert`, `pytest.raises`, `@pytest.mark.parametrize`, and `tmp_path`.",
            estimatedMinutes: 13,
          },
        ],
      },
      {
        id: "py-m10",
        number: "10",
        title: "Data Model & Idiomatic Stdlib",
        summary: "Hashing contracts, `itertools`, custom context managers, MRO/`abc.ABC`, descriptors/`__slots__`, chained exceptions, and `Decimal`.",
        quizCount: 12,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-hash-equality",
            title: "Hashing, __eq__ & Total Ordering",
            summary: "Preserve the `a == b` hashing invariant, build hashable objects, and sort via `@total_ordering`.",
            estimatedMinutes: 12,
          },
          {
            id: "py-iterators-itertools",
            title: "Streaming Pipelines with itertools",
            summary: "Compose lazy pipelines using `chain`, `islice`, and sorted `groupby` without buffering lists.",
            estimatedMinutes: 12,
          },
          {
            id: "py-context-managers",
            title: "Custom Context Managers & ExitStack",
            summary: "Guarantee cleanup with `__enter__`/`__exit__`, `@contextmanager`, and `ExitStack`.",
            estimatedMinutes: 13,
          },
          {
            id: "py-mro-abc",
            title: "Method Resolution Order (MRO) & abc.ABC",
            summary: "Trace C3 MRO with cooperative `super()` and enforce abstract methods via `abc.ABC`.",
            estimatedMinutes: 12,
          },
          {
            id: "py-descriptors-slots",
            title: "Descriptors & Compact __slots__",
            summary: "Reuse attribute validation with descriptors and shrink instance memory with `slots=True`.",
            estimatedMinutes: 12,
          },
          {
            id: "py-custom-exceptions",
            title: "Custom Exception Trees & Chaining",
            summary: "Build domain exception hierarchies and link root causes via `raise ... from err`.",
            estimatedMinutes: 11,
          },
          {
            id: "py-functools-decimal",
            title: "functools (lru_cache, partial) & Decimal Math",
            summary: "Memoize pure functions, bind arguments via `partial`, and keep money exact with `Decimal`.",
            estimatedMinutes: 12,
          },
        ],
      },
      {
        id: "py-m11",
        number: "11",
        title: "Concurrency & Async Python",
        summary: "CPython's GIL, worker pools, locks and queues, `asyncio` event loops, `TaskGroup`, timeouts, and `AsyncMock` testing.",
        quizCount: 12,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-concurrency-gil",
            title: "Concurrency, CPU vs I/O & the GIL",
            summary: "Choose threads, processes, or `asyncio` based on I/O waits vs pure-Python CPU loops.",
            estimatedMinutes: 11,
          },
          {
            id: "py-thread-process-pools",
            title: "Worker Pools (ThreadPool & ProcessPool)",
            summary: "Submit tasks with `concurrent.futures`, stream `as_completed`, and guard multiprocessing entrypoints.",
            estimatedMinutes: 12,
          },
          {
            id: "py-locks-queues",
            title: "Locks & Thread-Safe Queue Pipelines",
            summary: "Prevent race conditions using `threading.Lock` and shut down `queue.Queue` workers with `None` sentinels.",
            estimatedMinutes: 12,
          },
          {
            id: "py-asyncio-basics",
            title: "asyncio Event Loop & TaskGroup",
            summary: "Schedule coroutines with `async`/`await`, handle `except*`, and offload sync calls via `asyncio.to_thread`.",
            estimatedMinutes: 13,
          },
          {
            id: "py-async-safety-testing",
            title: "Timeouts, Semaphores & AsyncMock Testing",
            summary: "Bound active sockets with `Semaphore`, enforce `asyncio.timeout`, and stub coroutines via `AsyncMock`.",
            estimatedMinutes: 13,
          },
        ],
      },
      {
        id: "py-m12",
        number: "12",
        title: "Production Tooling & Capstone",
        summary: "`logging`, `argparse` CLIs, generics and `ParamSpec`, `ruff`/`mypy`, mocking, `src/` packaging, and a multi-file CLI.",
        quizCount: 12,
        practiceSetCount: 4,
        lessons: [
          {
            id: "py-logging-structured",
            title: "Structured Logging & Config Hygiene",
            summary: "Configure `logging.getLogger(__name__)`, levels, `RotatingFileHandler`, and `.env` secret hygiene.",
            estimatedMinutes: 11,
          },
          {
            id: "py-argparse-cli",
            title: "Testable CLI Interfaces with argparse",
            summary: "Parse flags and subcommands with `ArgumentParser` and return testable exit codes.",
            estimatedMinutes: 12,
          },
          {
            id: "py-generics-callable",
            title: "Generics [T], Self & ParamSpec Decorators",
            summary: "Preserve exact caller types with `[T]`, fluent `Self`, `[**P, R]` wrappers, `Sequence`, and `assert_never`.",
            estimatedMinutes: 13,
          },
          {
            id: "py-ruff-mypy",
            title: "Linting & Strict Types (ruff & mypy)",
            summary: "Catch lint traps with `ruff` and verify strict static types across modules with `mypy --strict`.",
            estimatedMinutes: 11,
          },
          {
            id: "py-mocking-testing",
            title: "Mocking, monkeypatch & conftest.py",
            summary: "Isolate unit tests with `monkeypatch`, `patch(..., autospec=True)`, `MagicMock`, and `capsys`/`caplog`.",
            estimatedMinutes: 13,
          },
          {
            id: "py-packaging-ci",
            title: "src/ Layout, pyproject.toml & CI Gates",
            summary: "Package repos inside `src/`, configure scripts/deps, and wire automated CI verification.",
            estimatedMinutes: 12,
          },
          {
            id: "py-capstone-log-analyzer",
            title: "Capstone: Streaming Log Analyzer CLI",
            summary: "Unite `@dataclass(slots=True, frozen=True)`, regex, streaming `yield`, `logging`, and `argparse` tests.",
            estimatedMinutes: 18,
          },
        ],
      },
    ],
  },
  {
    id: "dsa",
    slug: "dsa",
    title: "Data Structures & Algorithms",
    tagline:
      "Progressive A-to-Z DSA from memory & Big-O to trees, graphs, DP, and practice problem sets.",
    description:
      "Build DSA skills step by step from Beginner to Pro in strict prerequisite order. Every lesson introduces one focused concept with animated visual traces, language-neutral pseudocode, hands-on drills, and a mixed end-of-module Practice Set.",
    accent: "#e15b42",
    coverImage: "/images/course-dsa.svg",
    assessmentKind: "practice-set",
    whyThisCourse: [
      "One focused concept per lesson with strict prerequisite order from Beginner to Pro.",
      "Interactive step-by-step diagrams paired with language-neutral pseudocode and live state chips.",
      "No multiple-choice exams: every lesson and module finishes with real problem sets and constraints.",
      "Every problem carries explicit constraints, examples, progressive pattern hints, and target complexity.",
    ],
    modules: [
      {
        id: "dsa-m0",
        number: "00",
        title: "Foundations & Complexity Analysis",
        summary:
          "How computer memory and references work, counting algorithm steps with Big-O, analyzing loops, and checking space limits.",
        tier: "Beginner",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-what-is-dsa",
            title: "What is DSA & How Memory Works",
            summary:
              "Separate data structures from algorithms, understand RAM slots and byte addresses, and contrast values with references.",
            estimatedMinutes: 12,
          },
          {
            id: "dsa-time-complexity",
            title: "Time Complexity & Big-O Notation",
            summary:
              "Count operations instead of wall-clock seconds, drop constants, and compare `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, and `O(n²)`.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-loops-space-limits",
            title: "Loop Counting, Space Complexity & Constraints",
            summary:
              "Analyze sequential, halving, and nested loops, track auxiliary memory vs input size, and check solutions against `10^7` op limits.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-p-vs-np",
            title: "P vs NP & Algorithmic Complexity Classes",
            summary:
              "Contrast polynomial-time solving (P) with polynomial certificate verification (NP), trace reductions, and apply bitmask or approximation escapes.",
            estimatedMinutes: 14,
          },
        ],
      },
      {
        id: "dsa-m1",
        number: "01",
        title: "Math & Number Theory",
        summary:
          "Digit math and signed overflow guards, primes and the Sieve of Eratosthenes, Euclidean GCD/LCM, and modular fast power.",
        tier: "Beginner",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-digit-math",
            title: "Digit Extraction & Integer Overflow",
            summary:
              "Peel digits with `mod 10` and integer division, reverse numbers, check palindromes, and prevent 32-bit overflow.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-primes-sieve",
            title: "Factors, Primality & Sieve of Eratosthenes",
            summary:
              "Find paired divisors in `O(sqrt(n))`, check edge cases `n < 2` for primality, and mark primes up to `n` using a Sieve.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-gcd-lcm",
            title: "Euclidean GCD & LCM",
            summary:
              "Compute greatest common divisors in `O(log(min(a, b)))` and derive overflow-safe least common multiples.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-modular-power",
            title: "Modular Arithmetic & Iterative Fast Power",
            summary:
              "Keep large answers bounded with `% (10^9 + 7)`, handle negative remainders, and compute `x^n mod m` in `O(log n)` loops.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m2",
        number: "02",
        title: "Bit Manipulation",
        summary:
          "Binary representation and bitwise operators, single-bit masks and powers of two, XOR identities, and iterative subset masks.",
        tier: "Beginner",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-binary-bitwise",
            title: "Binary Representation & Bitwise Operators",
            summary:
              "Work with base-2 place values, `&`, `|`, `^`, `~`, shifts `<<` / `>>`, and `O(1)` parity checks.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-bit-tricks",
            title: "Single-Bit Masks, Power of Two & Set Bit Count",
            summary:
              "Inspect, set, clear, and toggle the `k`-th bit using `1 << k`, detect powers of two, and count set bits.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-xor-bitmasks",
            title: "XOR Properties & Subset Bitmask Intuition",
            summary:
              "Cancel duplicates in `O(1)` space using XOR and enumerate all subsets with integer masks `0 .. (1 << n) - 1`.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m3",
        number: "03",
        title: "Arrays & Prefix Patterns",
        summary:
          "Contiguous static indexing and shifting, dynamic array 2x resizing, Kadane's and majority scans, and 1D prefix/difference arrays.",
        tier: "Beginner",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-static-arrays",
            title: "Static Arrays, Contiguous Access & Shifting",
            summary:
              "Compute direct offsets in `O(1)`, trace middle insert/delete shifts (`O(n)`), and scan arrays in a single pass.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-dynamic-arrays",
            title: "Dynamic Arrays & Amortized Resizing",
            summary:
              "Separate `size` from `capacity` and see why doubling storage keeps appends `O(1)` amortized.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-kadane-majority",
            title: "Classic Array Scans: Kadane & Majority Vote",
            summary:
              "Find maximum subarray sum (`O(n)`), Boyer-Moore majority candidates (`O(1)` space), and triple-reversal rotation.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-prefix-sums",
            title: "Prefix Sums & Difference Arrays",
            summary:
              "Precompute cumulative arrays for `O(1)` range sums and apply range increments in `O(1)` via difference arrays.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m4",
        number: "04",
        title: "Strings",
        summary:
          "Character encoding and O(n) string builders, fixed `[26]`/`[128]` frequency arrays for anagrams, and string parsing/compression.",
        tier: "Beginner",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-string-basics",
            title: "Character Encoding, Immutability & Builders",
            summary:
              "Map ASCII characters to indices, understand immutable copies, and avoid `O(n²)` loop concatenation traps.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-string-frequency",
            title: "Character Frequency & Anagram Patterns",
            summary:
              "Compare strings with `[26]` and `[128]` count arrays, detect anagrams, find first unique characters, and verify bijection.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-string-parsing",
            title: "Parsing, Palindrome Checks & Run-Length Encoding",
            summary:
              "Scan mirror indices for palindromes, parse signed integers (`atoi`) with overflow guards, and compress repeated runs.",
            estimatedMinutes: 14,
          },
        ],
      },
      {
        id: "dsa-m5",
        number: "05",
        title: "2D Arrays & Matrices",
        summary:
          "Row-major matrix indexing, in-place transpose and 90-degree rotation, zero marking, spiral boundaries, and 2D prefix sums.",
        tier: "Beginner",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-matrix-traversal",
            title: "Matrix Memory Layout & Row/Col/Diagonal Walks",
            summary:
              "Map row/column grids to flat memory, walk main and anti-diagonals within bounds, and trace perimeter edges.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-matrix-transforms",
            title: "In-Place Matrix Transforms: Transpose, Rotate & Zero",
            summary:
              "Transpose square matrices, rotate 90 degrees clockwise in-place, and zero rows/columns using O(1) extra space.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-matrix-spiral-prefix",
            title: "Spiral Order Traversal & 2D Prefix Sums",
            summary:
              "Shrink four boundary pointers for spiral order and answer submatrix rectangle queries in O(1) time.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m6",
        number: "06",
        title: "Hashing: Hash Maps & Hash Sets",
        summary:
          "Hash functions and collision handling, Hash Sets and frequency counting, complement Two-Sum, and prefix-map subarray lookups.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-hash-internals",
            title: "Hash Functions, Buckets & Collision Handling",
            summary:
              "Map keys to buckets with `hash mod cap`, resolve collisions with chaining or probing, and maintain O(1) average speed.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-hash-sets",
            title: "Hash Sets & Frequency Counting",
            summary:
              "Deduplicate fast, group anagrams with count keys, and solve Longest Consecutive Sequence in O(n) average time.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-hash-lookup",
            title: "Complement & Prefix-Map Lookups",
            summary:
              "Combine prefix sums or XOR from earlier modules with hash maps to count target subarrays in a single pass.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-bloom-filters",
            title: "Bloom Filters & Probabilistic Membership",
            summary:
              "Pack massive key membership checks into bit arrays with zero false negatives and tunable false-positive rates.",
            estimatedMinutes: 14,
          },
        ],
      },
      {
        id: "dsa-m7",
        number: "07",
        title: "Two Pointers",
        summary:
          "Opposite-end convergence, read/write compaction, Dutch National Flag 3-way partition, water trapping, and sorted triplets.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-opposite-pointers",
            title: "Opposite-End Two Pointers",
            summary:
              "Reverse sequences in-place, verify alphanumeric palindromes, and eliminate search candidates on sorted arrays.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-read-write-pointers",
            title: "Read/Write Compaction & 3-Way Partition",
            summary:
              "Filter elements in-place using `write <= read` invariants and sort 0/1/2 arrays in one pass with three pointers.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-multi-pointers",
            title: "Multi-Pointer Extensions: Container, Rain Water & Sorted Triplets",
            summary:
              "Solve container max area, O(1)-space rain water trapping, and duplicate-free sorted triplets.",
            estimatedMinutes: 16,
          },
        ],
      },
      {
        id: "dsa-m8",
        number: "08",
        title: "Sliding Window",
        summary:
          "Fixed-size O(n) sliding windows, variable expand-and-shrink windows on monotonic ranges, and window + hash map templates.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-fixed-window",
            title: "Fixed-Size Sliding Window",
            summary:
              "Slide a fixed k-length window in O(1) per step using `+ right - left` instead of O(n * k) rescanning.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-variable-window",
            title: "Variable-Size Sliding Window",
            summary:
              "Expand right and shrink left while maintaining O(n) total moves, plus spotting when negatives break monotonicity.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-window-hashing",
            title: "Sliding Window with Hash Maps & Sets",
            summary:
              "Pair window pointers with Hash Sets/Maps for longest unique substrings and minimum window substring problems.",
            estimatedMinutes: 16,
          },
        ],
      },
      {
        id: "dsa-m9",
        number: "09",
        title: "Binary Search",
        summary:
          "Iterative binary search invariants, lower/upper bounds on duplicates, rotated sorted arrays, peaks, and monotonic answer search.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-binary-search-basics",
            title: "Iterative Binary Search & Loop Invariants",
            summary:
              "Halve sorted intervals with `lo <= hi`, avoid midpoint overflow, and locate exact targets or insert positions.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-lower-upper-bound",
            title: "Lower Bound, Upper Bound & Duplicate Occurrences",
            summary:
              "Find first index `>= target` and `> target` to extract duplicate ranges and exact counts in O(log n).",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-rotated-peak",
            title: "Rotated Sorted Arrays & Peak Elements",
            summary:
              "Identify whichever half remains sorted around `mid`, find rotated minimums, and bisect slope peaks.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-bs-on-answer",
            title: "Binary Search on Answer & 2D Matrix Search",
            summary:
              "Minimize feasible thresholds with monotonic `ok(mid)` checks and search row-sorted 2D matrices.",
            estimatedMinutes: 16,
          },
        ],
      },
      {
        id: "dsa-m10",
        number: "10",
        title: "Recursion & Call Stack",
        summary:
          "Base cases and shrinking steps, LIFO call stack frame tracing, loops vs linear recursion, and O(log n) recursive power.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-recursion-base-case",
            title: "Recursion Fundamentals & Base Cases",
            summary:
              "Pair direct base cases with strictly smaller subproblems to avoid stack overflows on numbers, arrays, and strings.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-call-stack-frames",
            title: "Call Stack Frames & Recursion vs Loops",
            summary:
              "Trace LIFO frames holding isolated local variables and choose O(1)-space loops over O(n)-stack recursion.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-recursion-trees",
            title: "Recursion Trees, Duplicate Calls & O(log n) Power",
            summary:
              "Spot exponential O(2^n) repeated subproblems and halve exponents once in O(log n) recursive power.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m11",
        number: "11",
        title: "Sorting Algorithms",
        summary:
          "Elementary O(n²) sorts and stability, Divide & Conquer Merge Sort with inversions, Quick Sort partitioning, linear sorts, and in-place Cyclic Sort.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-elementary-sorts",
            title: "Elementary Sorts: Selection, Bubble & Insertion Sort",
            summary:
              "Compare O(n²) iterative sorting mechanics, O(n) adaptive Insertion Sort behavior, and key stability.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-merge-sort",
            title: "Divide & Conquer: Merge Sort & Inversions",
            summary:
              "Halve arrays across log₂ n levels, merge sorted halves in O(n) per level, and count inverted pairs.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-quick-sort",
            title: "Quick Sort & In-Place Partitioning",
            summary:
              "Partition arrays in-place around pivots, randomize pivots against worst-case O(n²), and see why both halves recurse.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-quickselect",
            title: "Quickselect & K-th Order Statistics",
            summary:
              "Select the k-th smallest or largest element in O(n) expected time by partitioning and discarding the non-target half.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-linear-sorts",
            title: "Counting Sort, Radix Sort & Custom Comparators",
            summary:
              "Sort bounded integer keys in linear time without comparisons and write multi-key ordering rules.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-cyclic-sort",
            title: "Cyclic Sort & In-Place Index Placement",
            summary:
              "Place `[1..n]` values directly at index `v - 1` in `O(n)` time and `O(1)` extra space for missing and duplicate queries.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m12",
        number: "12",
        title: "Linked Lists",
        summary:
          "Discontiguous heap nodes, dummy head and 3-pointer reversal, tortoise-and-hare cycles, and Doubly Linked Lists with LRU Cache.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-singly-linked-list",
            title: "Singly Linked Lists vs Contiguous Arrays",
            summary:
              "Contrast O(1) head insertion against O(n) sequential traversal across discontiguous node chains.",
            estimatedMinutes: 13,
          },
          {
            id: "dsa-ll-dummy-reverse",
            title: "Dummy Head & In-Place Reversal",
            summary:
              "Simplify edge cases with dummy sentinels, reverse lists with 3 pointers, and merge sorted node chains.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-ll-fast-slow",
            title: "Fast & Slow Pointers (Tortoise & Hare)",
            summary:
              "Locate middle nodes, detect and enter cycles with Floyd's algorithm, and delete k-th from end in one pass.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-dll-lru",
            title: "Doubly Linked Lists & LRU Cache Design",
            summary:
              "Unlink arbitrary nodes in O(1) with `prev`/`next` pointers and combine Hash Maps + DLLs for LRU caching.",
            estimatedMinutes: 16,
          },
        ],
      },
      {
        id: "dsa-m13",
        number: "13",
        title: "Stacks & Queues",
        summary:
          "LIFO stack parsing and Min Stack, circular FIFO ring buffers and Deques, and O(n) monotonic stacks/queues.",
        tier: "Intermediate",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-stack-basics",
            title: "Stack (LIFO) & Expression Parsing",
            summary:
              "Match brackets, support O(1) `get_min()`, and evaluate postfix expressions with array-backed stacks.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-queue-deque",
            title: "Queue (FIFO), Circular Buffer & Deque",
            summary:
              "Avoid O(n) front-pop shifts using circular buffers and two-stack queues, plus double-ended Deque ops.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-monotonic-stack",
            title: "Monotonic Stack Pattern",
            summary:
              "Keep a sorted stack invariant so Next Greater Element, Daily Temperatures, and Histogram solve in O(n).",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-monotonic-queue",
            title: "Monotonic Queue & Sliding Window Maximum",
            summary:
              "Pair Deques with sliding window bounds to report every window maximum in O(n) total time.",
            estimatedMinutes: 16,
          },
        ],
      },
      {
        id: "dsa-m14",
        number: "14",
        title: "Trees & Binary Search Trees",
        summary:
          "Binary tree DFS/BFS traversals, diameter and LCA recursion, BST insert/delete/validate, and AVL/Red-Black balance.",
        tier: "Advanced",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-tree-dfs",
            title: "Binary Tree Anatomy & DFS Traversals",
            summary:
              "Understand depth vs height and run recursive and stack-based Preorder, Inorder, and Postorder walks.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-tree-bfs-recursion",
            title: "Tree BFS Level-Order & Structural Recursion",
            summary:
              "Traverse layer by layer with queues and solve balanced height, tree diameter, and Lowest Common Ancestor.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-bst-operations",
            title: "Binary Search Trees: Search, Insert, Delete & Validate",
            summary:
              "Maintain `left < node < right`, validate with `(lo, hi)` bounds, delete nodes while keeping BST order, and find k-th smallest.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-balanced-trees",
            title: "Balanced BSTs: Why Skewed Trees Fail & Rotations",
            summary:
              "See why sorted inserts skew trees to O(n) and how AVL rotations and Red-Black invariants keep O(log n) height.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-tree-lca",
            title: "Lowest Common Ancestor (Binary Tree vs BST)",
            summary:
              "Solve general Binary Tree LCA with bottom-up postorder, BST LCA in O(h) time / O(1) space, and Binary Lifting.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m15",
        number: "15",
        title: "Heaps & Priority Queues",
        summary:
          "Array-backed binary heaps and O(n) heapify, Top-K and K-way merge patterns, two-heaps median, and scheduling.",
        tier: "Advanced",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-heap-internals",
            title: "Binary Heap, Sift-Up/Down & O(n) Heapify",
            summary:
              "Store complete trees flat in arrays, trace push/pop sifts, build heaps in O(n), and run in-place Heap Sort.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-heap-top-k",
            title: "Top-K & K-Way Merge Patterns",
            summary:
              "Use bounded size-k Min-Heaps for Top-K Largest/Frequent queries and merge k sorted streams in O(N log k).",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-two-heaps-scheduler",
            title: "Two-Heaps Streaming Median & Task Scheduler",
            summary:
              "Balance a Max-Heap and Min-Heap for O(1) live medians and schedule cooldown-limited tasks greedily.",
            estimatedMinutes: 16,
          },
        ],
      },
      {
        id: "dsa-m16",
        number: "16",
        title: "Greedy Algorithms & Intervals",
        summary:
          "Greedy choice proofs and failure counterexamples, interval merging and sweep lines, Jump Game, Gas Station, and Huffman.",
        tier: "Advanced",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-greedy-choice",
            title: "Greedy Choice Property & When Greedy Fails",
            summary:
              "Prove local optimality with exchange arguments, solve Fractional Knapsack, and spot coin counterexamples.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-intervals-sweep",
            title: "Intervals & Sweep-Line Sorting",
            summary:
              "Merge and insert intervals, select max non-overlapping meetings, and count peak rooms with Min-Heaps/sweeps.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-greedy-paths",
            title: "Greedy Array Walks & Huffman Encoding",
            summary:
              "Optimize Jump Game bounds, prove Gas Station reset logic, and build Huffman prefix trees with Min-Heaps.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m17",
        number: "17",
        title: "Backtracking",
        summary:
          "Decision trees with choose-explore-unchoose, duplicate-free subsets and combinations, permutations, Word Search, N-Queens, and Sudoku.",
        tier: "Advanced",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-backtracking-subsets",
            title: "Decision Trees & Subset Exploration",
            summary:
              "Explore binary include/skip trees via choose-explore-unchoose and skip duplicate branches after sorting.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-permutations-combinations",
            title: "Combinations, Permutations & Pruning",
            summary:
              "Reuse or bound candidates in Combination Sum and permute sequences without duplicates.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-constraint-backtracking",
            title: "Constraint & Grid Search: Word Search, N-Queens & Sudoku",
            summary:
              "Prune invalid branches early on 2D grids and conflict sets before exploring deeper states.",
            estimatedMinutes: 17,
          },
        ],
      },
      {
        id: "dsa-m18",
        number: "18",
        title: "Graphs: Traversals & Ordering",
        summary:
          "Adjacency lists vs matrices, unweighted BFS and multi-source grids, DFS cycle detection and bipartite checks, and Kahn's/DFS topological sort.",
        tier: "Advanced",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-graph-representations",
            title: "Graph Modeling & Adjacency List vs Matrix",
            summary:
              "Model directed and undirected graphs and count connected components in `O(V + E)`.",
            estimatedMinutes: 14,
          },
          {
            id: "dsa-graph-bfs",
            title: "Graph BFS & Multi-Source Grid Shortest Paths",
            summary:
              "Mark visited on enqueue to prevent queue blowup, find shortest unweighted hops, and flood-fill multi-source grids.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-graph-dfs-cycles",
            title: "Graph DFS, Cycle Detection & Bipartite Graphs",
            summary:
              "Separate undirected parent checks from 3-state directed cycle detection and verify 2-colorable graphs.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-topological-sort",
            title: "Topological Sort in Directed Acyclic Graphs (DAGs)",
            summary:
              "Schedule prerequisite dependencies with Kahn's indegree-0 queue and post-order DFS sorting.",
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: "dsa-m19",
        number: "19",
        title: "Pro Graphs: DSU, MST & Shortest Paths",
        summary:
          "Union-Find with path compression, Kruskal's and Prim's MST, Dijkstra, 0-1 BFS, Bellman-Ford, Floyd-Warshall, Bridges, and Tarjan's SCC.",
        tier: "Pro",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-dsu-union-find",
            title: "Disjoint Set Union (Union-Find)",
            summary:
              "Merge dynamic groups in near-O(1) using path compression and union by rank or size.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-mst-kruskal-prim",
            title: "Minimum Spanning Trees: Kruskal & Prim",
            summary:
              "Connect all vertices at minimum total edge weight using sorted DSU edges or Min-Heap cut expansion.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-shortest-paths",
            title: "Single-Source Shortest Paths: Dijkstra, 0-1 BFS & Bellman-Ford",
            summary:
              "Match shortest-path engines to edge weights: Min-Heap Dijkstra, Deque 0-1 BFS, and negative-edge Bellman-Ford.",
            estimatedMinutes: 17,
          },
          {
            id: "dsa-all-pairs-tarjan",
            title: "All-Pairs Shortest Paths & Tarjan's Bridges / SCC",
            summary:
              "Compute all-pairs distances with Floyd-Warshall and locate graph bridges, articulation points, and SCCs.",
            estimatedMinutes: 17,
          },
        ],
      },
      {
        id: "dsa-m20",
        number: "20",
        title: "Dynamic Programming (Core)",
        summary:
          "Memoization vs tabulation, 1D DP transitions and LIS O(n log n), 2D grid DP with row compression, and 0/1 vs Unbounded Knapsack.",
        tier: "Pro",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-dp-intro",
            title: "Dynamic Programming: Memoization & Tabulation",
            summary:
              "Cache overlapping recursive subproblems, convert top-down memo tables bottom-up, and roll O(1) state.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-dp-1d",
            title: "1D DP Transitions: House Robber, Coin Change & LIS",
            summary:
              "Formulate prefix/target 1D recurrences and optimize Longest Increasing Subsequence to O(n log n).",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-dp-2d-grids",
            title: "2D Grid & Matrix Dynamic Programming",
            summary:
              "Walk grids top-down or bottom-up for Unique Paths and Min Path Sum while compressing rows to O(C) space.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-dp-knapsack",
            title: "0/1 Knapsack, Subset Sum & Unbounded Knapsack",
            summary:
              "See why backward weight iteration prevents reusing items while forward iteration allows unbounded reuse.",
            estimatedMinutes: 17,
          },
        ],
      },
      {
        id: "dsa-m21",
        number: "21",
        title: "Pro Dynamic Programming",
        summary:
          "String Edit Distance and LCS, stock trading state-machine DP, interval/partition DP, and Bitmask + Tree DP.",
        tier: "Pro",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-dp-strings",
            title: "String DP: LCS, Palindromes & Edit Distance",
            summary:
              "Align two strings in 2D tables for Longest Common Subsequence, palindromes, and Levenshtein distance.",
            estimatedMinutes: 17,
          },
          {
            id: "dsa-dp-stocks",
            title: "Stock Trading State-Machine DP",
            summary:
              "Model hold, sold, cooldown, transaction fee, and k-trade limits as explicit state transitions.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-dp-interval-partition",
            title: "Interval & Partition DP",
            summary:
              "Iterate increasing interval lengths bottom-up for Matrix Chain, Burst Balloons, and Min Cuts.",
            estimatedMinutes: 17,
          },
          {
            id: "dsa-dp-bitmask-trees",
            title: "Bitmask DP & DP on Trees",
            summary:
              "Combine integer bitmasks for Hamiltonian subsets with post-order `(take, skip)` Tree DP.",
            estimatedMinutes: 18,
          },
        ],
      },
      {
        id: "dsa-m22",
        number: "22",
        title: "Tries & Advanced String Matching",
        summary:
          "Prefix tries and wildcard lookup, bitwise XOR tries in O(32n), and linear O(n + m) Rabin-Karp, KMP, and Z-Algorithm.",
        tier: "Pro",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-trie-prefix-tree",
            title: "Trie (Prefix Tree): Insert, Search & Autocomplete",
            summary:
              "Store shared word prefixes in character nodes for O(L) lookup, prefix counts, and wildcard search.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-bitwise-trie",
            title: "Bitwise Trie & Maximum XOR Pairs",
            summary:
              "Walk a 0/1 MSB-to-LSB binary trie picking opposite bits per level to maximize pair XOR in O(32n).",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-string-matching",
            title: "Linear String Matching: Rabin-Karp, KMP & Z-Algorithm",
            summary:
              "Eliminate quadratic string search using rolling hashes, KMP `lps[]` fallback tables, and Z-boxes.",
            estimatedMinutes: 17,
          },
        ],
      },
      {
        id: "dsa-m23",
        number: "23",
        title: "Range Queries: Fenwick & Segment Trees",
        summary:
          "Dynamic array queries with Square Root Decomposition, O(log n) Fenwick (BIT) trees, and Segment Trees with Lazy Propagation.",
        tier: "Pro",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-range-sqrt",
            title: "Dynamic Range Queries & Square Root Decomposition",
            summary:
              "Handle mutable updates where static prefix sums degrade by splitting arrays into `sqrt(n)` blocks.",
            estimatedMinutes: 15,
          },
          {
            id: "dsa-fenwick-tree",
            title: "Fenwick Tree (Binary Indexed Tree)",
            summary:
              "Use `i & -i` bit isolation for compact O(n)-space, O(log n) prefix queries and point updates.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-segment-tree",
            title: "Segment Tree & Lazy Propagation",
            summary:
              "Support arbitrary associative range merges and O(log n) deferred range updates via `lazy[]` push-downs.",
            estimatedMinutes: 18,
          },
        ],
      },
      {
        id: "dsa-m24",
        number: "24",
        title: "Interview Playbook & Mixed Patterns",
        summary:
          "The 6-step coding interview structure, constraint-to-pattern triggers in blind problems, O(1)/streaming follow-ups, and a mixed mock set.",
        tier: "Pro",
        practiceSetCount: 4,
        lessons: [
          {
            id: "dsa-interview-framework",
            title: "The 6-Step Coding Interview Playbook",
            summary:
              "Clarify constraints, anchor on brute force, justify optimizations, write clean code, dry-run edge cases, and answer follow-ups out loud.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-pattern-triggers",
            title: "Picking the Right Pattern from Constraints & Clues",
            summary:
              "Map input bounds (`n <= 20` to `10^9`) and prompt keywords directly to the passing DSA family on mixed blind questions.",
            estimatedMinutes: 16,
          },
          {
            id: "dsa-interview-followups",
            title: "Handling Follow-Ups: O(1) Space, Streams & Negatives",
            summary:
              "Pivot live from batch hashes or positive windows to Cyclic Sort, Two Heaps, Prefix HashMaps, and Bellman-Ford.",
            estimatedMinutes: 16,
          },
        ],
      },
    ],
  },
];

export function getCourseById(courseId: string): Course {
  return courses.find((c) => c.id === courseId) ?? courses[0];
}

export function getCourseLessons(course: Course): Array<{
  module: CourseModule;
  lesson: LessonMeta;
  index: number;
}> {
  const flat: Array<{ module: CourseModule; lesson: LessonMeta; index: number }> = [];
  let idx = 0;
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      flat.push({ module: mod, lesson, index: idx });
      idx += 1;
    }
  }
  return flat;
}

export function getCourseTotalMinutes(course: Course): number {
  return course.modules.reduce(
    (sum, mod) => sum + mod.lessons.reduce((inner, l) => inner + l.estimatedMinutes, 0),
    0,
  );
}

export function getAllValidLessonIds(): string[] {
  return courses.flatMap((course) =>
    course.modules.flatMap((mod) => mod.lessons.map((l) => l.id)),
  );
}

export function getAllValidModuleIds(): string[] {
  return courses.flatMap((course) => course.modules.map((mod) => mod.id));
}
