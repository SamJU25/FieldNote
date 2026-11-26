import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m12Lessons: Record<string, LessonContent> = {
  "py-logging-structured": {
    lessonId: "py-logging-structured",
    subtitle: "Replace ad-hoc `print()` calls with `logging.getLogger(__name__)`, levels, `RotatingFileHandler`, and `.env` secret hygiene.",
    intro: {
      heading: "Emit structured diagnostic logs without cluttering output",
      explanation: [
        "When a background service crashes overnight, `print()` debug lines disappear into untracked buffers, pollute CLI stdout pipes, and leave zero timestamps, module names, or severity filters.",
        "Python's standard `logging` module configures levels (`DEBUG` to `CRITICAL`), rotating disk logs, per-module logger names, and `.env` secret hygiene without editing every caller.",
      ],
      analogy: "An aircraft flight recorder separates routine telemetry from engine alerts on a rolling tape so investigators can filter out noise and replay the exact crash sequence.",
      realWorldUses: [
        "Routing service warnings and full `logger.exception` tracebacks to rotating log files",
        "Keeping secrets out of git via `.env` in `.gitignore` and `os.getenv` config resolution",
      ],
    },
    sections: [
      {
        heading: "Per-module loggers, `%s` formatting, and `.env` hygiene",
        paragraphs: [
          "Create `logger = logging.getLogger(__name__)` inside reusable modules, and call `logging.basicConfig(...)` only once inside your application entrypoint. Use lazy formatting (`logger.debug('id=%s', uid)`) instead of f-strings so disabled log levels pay zero formatting cost.",
          "Inside `except`, call `logger.exception('failed')` to emit an `ERROR` record together with its full traceback. Store tokens in environment variables (`os.getenv('KEY')`), keep `.env` in `.gitignore`, and share only placeholder names in `.env.example`.",
        ],
        code: [
          "import logging",
          "from logging.handlers import RotatingFileHandler",
          "from pathlib import Path",
          "",
          "logger = logging.getLogger(__name__)",
          "",
          "def setup_logs(level: str = \"INFO\", log_file: Path | None = None) -> None:",
          "    handlers: list[logging.Handler] = [logging.StreamHandler()]",
          "    if log_file is not None:",
          "        handlers.append(RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=3))",
          "    logging.basicConfig(level=level.upper(), format=\"%(levelname)s %(name)s: %(message)s\", handlers=handlers)",
        ],
        table: {
          caption: "Logging levels & config precedence",
          headers: ["Tool / Rule", "Role", "Best practice"],
          rows: [
            ["`logging.getLogger(__name__)`", "Module-scoped logger", "Never call `basicConfig()` inside library modules"],
            ["`logger.debug('x=%s', val)`", "Lazy formatting", "Avoids f-string formatting when `DEBUG` is off"],
            ["`logger.exception('msg')`", "Logs `ERROR` + stack trace", "Call only inside active `except:` blocks"],
            ["`os.getenv('API_KEY')`", "Reads runtime env secret", "Keep `.env` out of git via `.gitignore`"],
          ],
        },
      },
      {
        heading: "Bug vs fix: library logging and exception tracebacks",
        paragraphs: [
          "Calling `basicConfig()` at import time hijacks the caller's logging setup, eager f-strings waste CPU when `DEBUG` is off, and `print()` inside `except` drops the stack trace.",
          "Use `getLogger(__name__)` with lazy `%s` placeholders, call `logger.exception(...)` inside `except`, and reserve handler setup for `main()`.",
        ],
        code: [
          "# BUG: configures root logger on import, eager f-string, loses traceback",
          "logging.basicConfig(level=\"DEBUG\")",
          "logger.debug(f\"Loaded {len(rows)} rows\")",
          "print(\"Read failed\")",
          "",
          "# FIX: module logger, lazy %s args, full traceback in except",
          "logger = logging.getLogger(__name__)",
          "logger.debug(\"Loaded %d rows for %s\", len(rows), uid)",
          "logger.exception(\"Read failed\")",
        ],
      },
    ],
    guidedBuildUp: {
      title: "Build structured service logging step by step",
      subtitle: "Move from a bare module logger to exception tracebacks and rotating file output.",
      steps: [
        {
          label: "Step 1: Create a module logger with lazy %s formatting",
          explanation: "Bind `logger = logging.getLogger(__name__)` and pass `%s` / `%d` arguments so disabled debug calls skip string formatting.",
          code: [
            "import logging",
            "logger = logging.getLogger(__name__)",
            "logger.info(\"Worker started\")",
            "logger.debug(\"Loaded %d items for %s\", 12, \"acct-7\")",
          ],
          activeLines: [2, 3, 4],
        },
        {
          label: "Step 2: Record full tracebacks with logger.exception",
          explanation: "Inside an `except` block, `logger.exception(...)` emits an `ERROR` record plus the active stack trace.",
          code: [
            "import logging",
            "logger = logging.getLogger(__name__)",
            "try:",
            "    int(\"bad\")",
            "except ValueError:",
            "    logger.exception(\"Config value invalid\")",
          ],
          activeLines: [5, 6],
        },
        {
          label: "Step 3: Configure StreamHandler and RotatingFileHandler in setup_logs",
          explanation: "Wire handlers once at application startup so console output and size-capped log files share one format.",
          code: [
            "import logging",
            "from logging.handlers import RotatingFileHandler",
            "from pathlib import Path",
            "def setup_logs(level: str = \"INFO\", log_file: Path | None = None) -> None:",
            "    handlers: list[logging.Handler] = [logging.StreamHandler()]",
            "    if log_file is not None:",
            "        handlers.append(RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=3))",
            "    logging.basicConfig(level=level.upper(), format=\"%(levelname)s %(name)s: %(message)s\", handlers=handlers)",
          ],
          activeLines: [5, 6, 7, 8],
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace logging severity gates and config resolution",
      steps: [
        {
          title: "Severity threshold drops lower log levels",
          tag: "CONCEPT",
          explanation: ["At `WARNING`, Python skips `DEBUG` and `INFO` records completely while emitting `WARNING`, `ERROR`, and `CRITICAL`."],
          code: [
            "logger.debug('skip')",
            "logger.info('skip')",
            "logger.warning('keep')",
            "logger.error('keep')",
          ],
          activeLines: [3, 4],
          state: [
            { name: "threshold", value: "WARNING", changed: true },
            { name: "emitted", value: "warning + error" },
          ],
          visual: {
            kind: "trace",
            caption: "Records below the active WARNING level drop immediately before formatting or I/O.",
            branches: [
              { id: "dbg", label: "DEBUG (10) < WARNING (30) -> dropped", status: "skipped" },
              { id: "inf", label: "INFO (20) < WARNING (30) -> dropped", status: "skipped" },
              { id: "wrn", label: "WARNING (30) -> emitted", status: "true" },
              { id: "err", label: "ERROR (40) -> emitted", status: "true" },
            ],
          },
        },
        {
          title: "Lazy `%s` args avoid unused formatting",
          tag: "PATTERN",
          explanation: ["When `DEBUG` is disabled, `logger.debug('%s', expensive)` never formats strings at all."],
          code: [
            "logger.debug('Loaded %d items for %s', count, uid)",
          ],
          activeLines: [1],
          state: [
            { name: "formatted if suppressed?", value: "No", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Passing %d / %s args to logger lets Python skip string interpolation when DEBUG is off.",
            branches: [
              { id: "chk", label: "logger.isEnabledFor(DEBUG) -> False", status: "false" },
              { id: "fmt", label: "format % args -> skipped (zero CPU)", status: "skipped" },
            ],
          },
        },
        {
          title: "`logger.exception` captures stack trace in `except`",
          tag: "TRACE",
          explanation: ["Inside `except OSError:`, `logger.exception` logs both your message and the active traceback."],
          code: [
            "try:",
            "    read_file()",
            "except OSError:",
            "    logger.exception('Read failed')",
          ],
          activeLines: [4],
          state: [
            { name: "emitted level", value: "ERROR + traceback", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "logger.exception logs ERROR level plus the active sys.exc_info() traceback.",
            branches: [
              { id: "ex", label: "except OSError: active traceback captured", status: "false" },
              { id: "lg", label: "logger.exception('Read failed') emits ERROR + stack", status: "true" },
            ],
          },
        },
        {
          title: "Resolve config precedence `CLI > env > default`",
          tag: "CHECK",
          explanation: ["Explicit flags override environment variables (`os.getenv`), which override safe development defaults."],
          code: [
            "level = cli_level or os.getenv('LOG_LEVEL', 'INFO')",
          ],
          activeLines: [1],
          state: [
            { name: "precedence", value: "CLI > env > default", changed: true },
          ],
          visual: {
            kind: "trace",
            caption: "Config resolves left to right and stops at the first non-empty source.",
            branches: [
              { id: "c", label: "1. CLI flag (highest priority if set)", status: "true" },
              { id: "e", label: "2. os.getenv('LOG_LEVEL') fallback", status: "active" },
              { id: "d", label: "3. 'INFO' default", status: "skipped" },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Calling `logging.basicConfig()` inside an imported library file",
        detail: "Calling `basicConfig()` on import hijacks root logging configuration for every application importing your module; configure handlers only inside `main()`.",
      },
      {
        title: "Forgetting to close `RotatingFileHandler` in tests on Windows",
        detail: "Call `handler.close()` and `logger.removeHandler(handler)` before temp folders clean up so open file handles release.",
      },
    ],
    predictChecks: [
      {
        prompt: "At threshold `logging.WARNING`, which log calls emit output?",
        code: "logger.debug('a')\nlogger.info('b')\nlogger.warning('c')\nlogger.error('d')",
        options: [
          { id: "a", label: "`c` and `d` only" },
          { id: "b", label: "`a` and `b` only" },
          { id: "c", label: "All four" },
        ],
        correctId: "a",
        explanation: "`WARNING` emits `WARNING`, `ERROR`, and `CRITICAL` while filtering out `DEBUG` and `INFO`.",
      },
      {
        prompt: "Which `.env` policy belongs in version-controlled repositories?",
        code: "# .gitignore excludes .env\n# tracked file: .env.example",
        options: [
          { id: "a", label: "Ignore `.env` in `.gitignore` and commit `.env.example` with placeholders only" },
          { id: "b", label: "Commit `.env` so teammates share API tokens" },
          { id: "c", label: "Put API tokens inside `pyproject.toml`" },
        ],
        correctId: "a",
        explanation: "Never commit real secrets into Git history.",
      },
    ],
    practiceTask: {
      title: "Warmup: Config precedence resolver (`CLI > Env > Default`)",
      tier: "Warmup",
      goal: "Write `resolve_setting(cli_val, env_key, default, env=None)` returning the trimmed first non-empty string in precedence `cli_val > env[env_key] > default`.",
      constraints: ["Pass explicit `env` mapping defaulting to `os.environ` so tests stay isolated"],
      examples: [
        { input: "cli=None, env={'API': ' https://env '}, default='https://def'", output: "https://env" },
        { input: "cli='https://cli', env={'API': 'https://env'}, default='https://def'", output: "https://cli" },
      ],
      tasks: [
        "Pick `(cli_val or store.get(env_key) or default).strip()`.",
      ],
      starterCode: "# Exercise M12.1 Warmup: CLI > env > default config resolver\nimport os\n\ndef resolve_setting(cli_val: str | None, env_key: str, default: str, env=None) -> str:\n    return ''\n",
      expectedOutput: "https://env\nhttps://cli",
      hint: "Use `store = os.environ if env is None else env` then fall back.",
      complexity: { time: "O(k)", space: "O(k)" },
      solutionCode:
        "import os\n\ndef resolve_setting(cli_val: str | None, env_key: str, default: str, env=None) -> str:\n    store = os.environ if env is None else env\n    return (cli_val or store.get(env_key) or default).strip()\n\nprint(resolve_setting(None, 'API', 'https://def', {'API': ' https://env '}))\nprint(resolve_setting('https://cli', 'API', 'https://def', {'API': 'https://env'}))",
    },
    practiceChallenges: [
      {
        title: "Core: Emit logs to `io.StringIO` stream",
        tier: "Core",
        goal: "Write `capture_logs(level, fn)` configuring a dedicated isolated logger (`propagate=False`) with `StreamHandler(buf)` and returning formatted `LEVEL:msg` lines.",
        constraints: ["Remove handler in `finally:` so repeat calls never duplicate lines"],
        examples: [
          { input: "WARNING threshold with info + error", output: "ERROR:boom" },
          { input: "INFO threshold with debug + info", output: "INFO:ready" },
        ],
        tasks: [
          "Attach `StreamHandler(buf)` with formatter `'%(levelname)s:%(message)s'` and detach in `finally:`.",
        ],
        starterCode: "# Exercise M12.1 Core: isolated StreamHandler capture\nimport io\nimport logging\n\ndef capture_logs(level: int, fn) -> str:\n    return ''\n",
        expectedOutput: "ERROR:boom\nINFO:ready",
        hint: "Set `logger.propagate = False`, attach `StreamHandler(buf)`, invoke `fn(logger)`, and remove the handler inside `finally:`.",
        complexity: { time: "O(k)", space: "O(k)" },
        solutionCode:
          "import io\nimport logging\n\ndef capture_logs(level: int, fn) -> str:\n    buf = io.StringIO()\n    logger = logging.getLogger('app.capture')\n    logger.setLevel(level)\n    logger.propagate = False\n    h = logging.StreamHandler(buf)\n    h.setFormatter(logging.Formatter('%(levelname)s:%(message)s'))\n    logger.addHandler(h)\n    try:\n        fn(logger)\n    finally:\n        logger.removeHandler(h)\n        h.close()\n    return buf.getvalue().strip()\n\nprint(capture_logs(logging.WARNING, lambda log: (log.info('ok'), log.error('boom'))))\nprint(capture_logs(logging.INFO, lambda log: (log.debug('d'), log.info('ready'))))",
      },
      {
        title: "Stretch: `RotatingFileHandler` log creation & cleanup",
        tier: "Stretch",
        goal: "Write `write_rotating(msg)` writing into `TemporaryDirectory() / 'app.log'` with `RotatingFileHandler`, returning `True` if written and closing.",
        constraints: ["Close and remove handler before temp folder exits"],
        examples: [
          { input: "'service booted'", output: "True service booted" },
          { input: "'job finished'", output: "True job finished" },
        ],
        tasks: [
          "Read back `log_file.read_text(encoding='utf-8').strip()` after flushing/closing.",
        ],
        starterCode: "# Exercise M12.1 Stretch: RotatingFileHandler lifecycle\nimport logging\nfrom logging.handlers import RotatingFileHandler\nfrom pathlib import Path\nimport tempfile\n\ndef write_rotating(msg: str) -> str:\n    return ''\n",
        expectedOutput: "True service booted\nTrue job finished",
        hint: "Close and remove the handler before `TemporaryDirectory` cleanup.",
        complexity: { time: "O(k)", space: "O(k)" },
        solutionCode:
          "import logging\nfrom logging.handlers import RotatingFileHandler\nfrom pathlib import Path\nimport tempfile\n\ndef write_rotating(msg: str) -> str:\n    with tempfile.TemporaryDirectory() as tmp:\n        p = Path(tmp) / 'app.log'\n        log = logging.getLogger('rot.demo')\n        log.setLevel(logging.INFO)\n        log.propagate = False\n        h = RotatingFileHandler(p, maxBytes=1024, backupCount=2, encoding='utf-8')\n        log.addHandler(h)\n        try:\n            log.info('%s', msg)\n            h.flush()\n        finally:\n            h.close()\n            log.removeHandler(h)\n        return f\"{p.exists()} {p.read_text(encoding='utf-8').strip()}\"\n\nprint(write_rotating('service booted'))\nprint(write_rotating('job finished'))",
      },
    ],
  },

  "py-argparse-cli": {
    lessonId: "py-argparse-cli",
    subtitle: "Build testable command-line interfaces with `argparse.ArgumentParser`, subcommands, type converters, and explicit integer exit codes.",
    intro: {
      heading: "Design CLIs that unit tests can call directly",
      explanation: [
        "Indexing `sys.argv[1]` by hand crashes with `IndexError` when a user forgets an argument, breaks as soon as `--min-level` flags appear in any order, and blocks `pytest` because reading `sys.argv` collides with the test runner's own flags.",
        "Building `main(argv: Sequence[str] | None = None) -> int:` with `argparse` gives users `--help`, type conversion, and validation while letting unit tests pass argument lists directly and assert exact exit codes.",
      ],
      analogy: "A shipping counter manifest checks package weights and destination codes up front before a truck leaves the depot.",
      realWorldUses: [
        "Building multi-command developer tools like `git` or `ruff` with `add_subparsers`",
        "Testing CLI flags and non-zero failure exit codes in milliseconds without spawning subprocesses",
      ],
    },
    sections: [
      {
        heading: "`argparse`, `add_subparsers`, and testable `main(argv)`",
        paragraphs: [
          "Set `type=Path`, `choices=[...]`, or `action='store_true'` directly on arguments so `argparse` rejects bad inputs and prints clear usage messages automatically.",
          "Group multi-mode tools using `parser.add_subparsers(dest='command', required=True)`, and return exit code `0` for success or non-zero (`1`/`2`) from `main(argv)` so `sys.exit(main())` integrates with shell scripts.",
        ],
        code: [
          "import argparse",
          "from collections.abc import Sequence",
          "from pathlib import Path",
          "",
          "def build_parser() -> argparse.ArgumentParser:",
          "    p = argparse.ArgumentParser(description=\"Analyze logs\")",
          "    subs = p.add_subparsers(dest=\"command\", required=True)",
          "    scan = subs.add_parser(\"scan\")",
          "    scan.add_argument(\"src\", type=Path)",
          "    scan.add_argument(\"--min-level\", choices=[\"INFO\", \"WARN\", \"ERROR\"], default=\"INFO\")",
          "    return p",
          "",
          "def main(argv: Sequence[str] | None = None) -> int:",
          "    args = build_parser().parse_args(argv)",
          "    print(args.command, args.src.as_posix(), args.min_level)",
          "    return 0",
          "",
          "print(main([\"scan\", \"app.log\", \"--min-level\", \"WARN\"]))",
        ],
        output: "scan app.log WARN\n0",
        table: {
          caption: "`argparse` API essentials",
          headers: ["Option", "Behavior", "Example"],
          rows: [
            ["`parse_args(argv)`", "Reads `argv` if given, else `sys.argv[1:]`", "`main(['scan', 'app.log'])` in tests"],
            ["`type=Path`", "Converts argument string into `pathlib.Path`", "`args.src.read_text()`"],
            ["`choices=[...]`", "Restricts allowed flag values automatically", "`choices=['INFO', 'WARN', 'ERROR']`"],
            ["`add_subparsers(dest=..., required=True)`", "Git-style subcommands (`scan`, `stats`)", "`args.command == 'scan'`"],
          ],
        },
      },
      {
        heading: "Bug vs fix: brittle `sys.argv[1]` vs testable `main(argv)`",
        paragraphs: [
          "Reading `sys.argv[1]` directly fails with `IndexError` when no file is passed, offers no `--help`, and calling `sys.exit(1)` inside helpers aborts the test runner.",
          "Accept `argv: Sequence[str] | None = None` in `main()`, validate with `argparse`, and return integer status codes.",
        ],
        code: [
          "# BUG: crashes on missing arg, ignores flags, untestable in pytest",
          "src = Path(sys.argv[1])",
          "sys.exit(1)",
          "",
          "# FIX: injectable argv, Path conversion, explicit integer return",
          "def main(argv: Sequence[str] | None = None) -> int:",
          "    args = build_parser().parse_args(argv)",
          "    return 0 if args.src.exists() else 1",
        ],
      },
    ],
    guidedBuildUp: {
      title: "Build a testable CLI step by step",
      subtitle: "Progress from one typed argument to subcommands and an explicit integer exit code.",
      steps: [
        {
          label: "Step 1: Parse a positional Path and validated --min-level flag",
          explanation: "Convert `src` with `type=Path` and restrict `--min-level` using `choices`.",
          code: [
            "import argparse",
            "from pathlib import Path",
            "p = argparse.ArgumentParser()",
            "p.add_argument(\"src\", type=Path)",
            "p.add_argument(\"--min-level\", choices=[\"INFO\", \"WARN\", \"ERROR\"], default=\"INFO\")",
            "args = p.parse_args([\"app.log\", \"--min-level\", \"WARN\"])",
            "print(args.src.as_posix(), args.min_level)",
          ],
          activeLines: [4, 5, 6],
          output: "app.log WARN",
        },
        {
          label: "Step 2: Group subcommands with add_subparsers",
          explanation: "Use `add_subparsers(dest='command', required=True)` so `scan` and `stats` each own their own flags.",
          code: [
            "import argparse",
            "from pathlib import Path",
            "p = argparse.ArgumentParser()",
            "subs = p.add_subparsers(dest=\"command\", required=True)",
            "scan = subs.add_parser(\"scan\")",
            "scan.add_argument(\"src\", type=Path)",
            "stats = subs.add_parser(\"stats\")",
            "stats.add_argument(\"--json\", action=\"store_true\")",
          ],
          activeLines: [4, 5, 7, 8],
        },
        {
          label: "Step 3: Wrap parsing in main(argv=None) -> int",
          explanation: "Defaulting `argv=None` reads `sys.argv` in the shell while letting tests pass `main(['scan', 'app.log'])` and inspect the returned int.",
          code: [
            "from collections.abc import Sequence",
            "def main(argv: Sequence[str] | None = None) -> int:",
            "    args = build_parser().parse_args(argv)",
            "    print(args.command, args.src.as_posix())",
            "    return 0",
            "print(main([\"scan\", \"app.log\"]))",
          ],
          activeLines: [2, 3, 5],
          output: "scan app.log\n0",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `main(argv)` argument parsing and exit codes",
      steps: [
        {
          title: "`main(None)` reads `sys.argv`; `main([...])` reads test list",
          tag: "PATTERN",
          explanation: ["Accepting `argv: Sequence[str] | None = None` lets one entrypoint serve both shells (`sys.exit(main())`) and fast unit tests."],
          code: [
            "def main(argv: Sequence[str] | None = None) -> int:",
            "    args = build_parser().parse_args(argv)",
            "    return 0",
          ],
          activeLines: [1, 2],
          state: [
            { name: "test call", value: "main(['scan', 'a.log'])", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Injecting argv=None decouples parse_args() so unit tests invoke main(['scan', 'a.log']) directly.",
            nodes: [
              { id: "sh", label: "Shell: sys.argv", sublabel: "when argv is None" },
              { id: "ut", label: "Test: ['scan', 'a.log']", sublabel: "when argv list passed", active: true, tone: "accent" },
              { id: "pa", label: "parse_args(argv)", sublabel: "typed Namespace", tone: "ok" },
            ],
            links: [
              { from: "sh", to: "pa" },
              { from: "ut", to: "pa", active: true },
            ],
          },
        },
        {
          title: "`add_subparsers(required=True)` enforces subcommand",
          tag: "CONCEPT",
          explanation: ["Each subparser owns its own positional args and flags (`scan` takes `src`, while `stats` takes `--json`)."],
          code: [
            "subs = p.add_subparsers(dest='command', required=True)",
            "scan = subs.add_parser('scan')",
            "scan.add_argument('src', type=Path)",
          ],
          activeLines: [1, 2, 3],
          state: [
            { name: "args.command", value: "'scan'" },
            { name: "args.src", value: "Path('app.log')", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Subparser routing binds command-specific options under distinct subcommands.",
            nodes: [
              { id: "sub", label: "add_subparsers()", sublabel: "command dispatch" },
              { id: "sc", label: "scan app.log", sublabel: "command='scan', src=Path", active: true, tone: "ok" },
              { id: "st", label: "stats --json", sublabel: "command='stats', json=True", tone: "muted" },
            ],
            links: [
              { from: "sub", to: "sc", active: true },
              { from: "sub", to: "st" },
            ],
          },
        },
        {
          title: "`choices=[...]` validates flag values before running logic",
          tag: "CHECK",
          explanation: ["Bad `--min-level` strings fail immediately during `parse_args` with exit status 2 rather than crashing mid-run."],
          code: [
            "scan.add_argument('--min-level', choices=['INFO', 'WARN'], default='INFO')",
          ],
          activeLines: [1],
          state: [
            { name: "invalid flag", value: "SystemExit(2)", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "choices= stops invalid CLI flags at parse time with exit status 2 before core logic runs.",
            nodes: [
              { id: "arg", label: "--min-level value", sublabel: "parse check" },
              { id: "ok", label: "'INFO' or 'WARN'", sublabel: "passes into args", active: true, tone: "ok" },
              { id: "bad", label: "unknown string", sublabel: "SystemExit(2)", tone: "warm" },
            ],
            links: [
              { from: "arg", to: "ok", active: true },
              { from: "arg", to: "bad", label: "rejected" },
            ],
          },
        },
        {
          title: "Return integer exit codes (`0` success, non-zero failure)",
          tag: "PITFALL",
          explanation: ["Do not call `sys.exit()` inside helper functions; return an int from `main()` so callers and tests inspect `code == 0`."],
          code: [
            "if __name__ == '__main__':",
            "    raise SystemExit(main())",
          ],
          activeLines: [2],
          state: [
            { name: "exit code", value: "0 on ok, 1 on error", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Returning an integer from main() lets unit tests call main([...]) directly while __main__ raises SystemExit(code).",
            nodes: [
              { id: "mn", label: "main(argv) -> int", sublabel: "0 ok / 1 err", active: true, tone: "ok" },
              { id: "tst", label: "pytest checks code == 1", sublabel: "no aborted runner", tone: "accent" },
              { id: "cli", label: "raise SystemExit(main())", sublabel: "shell exit code", tone: "muted" },
            ],
            links: [
              { from: "mn", to: "tst", active: true },
              { from: "mn", to: "cli", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Hardcoding `parse_args()` with no `argv` parameter",
        detail: "Without `argv=None`, pytest CLI flags (`pytest -k ...`) collide with your parser unless patched with `monkeypatch`.",
      },
      {
        title: "Calling `sys.exit(0)` inside helpers",
        detail: "Only return exit status integers from `main()`, keeping core logic free of `SystemExit`.",
      },
    ],
    predictChecks: [
      {
        prompt: "Why define `def main(argv: Sequence[str] | None = None) -> int:` instead of calling `parser.parse_args()` with zero parameters?",
        code: "def main(argv=None) -> int:\n    args = parser.parse_args(argv)",
        options: [
          { id: "a", label: "Tests pass argument lists directly while production (`None`) still uses `sys.argv`" },
          { id: "b", label: "`argparse` fails unless `argv` is annotated" },
          { id: "c", label: "It disables `--help`" },
        ],
        correctId: "a",
        explanation: "Defaulting `argv=None` preserves standard CLI behavior while making tests direct and fast.",
      },
      {
        prompt: "What happens if a flag uses `action='store_true'` (`--json`) and is omitted by the user?",
        code: "parser.add_argument('--json', action='store_true')",
        options: [
          { id: "a", label: "`args.json` is `False`" },
          { id: "b", label: "`args.json` is `None`" },
          { id: "c", label: "Raises `SystemExit`" },
        ],
        correctId: "a",
        explanation: "`action='store_true'` defaults the attribute to `False` when omitted and `True` when present.",
      },
    ],
    practiceTask: {
      title: "Warmup: Parser with `type=Path` and `choices`",
      tier: "Warmup",
      goal: "Write `parse_scan(argv)` returning `(args.src.as_posix(), args.min_level)` for positional `src` (`Path`) and `--min-level` (`choices=['ERROR', 'WARN']`, default `'ERROR'`).",
      constraints: ["Accept `argv` in `parse_scan(argv)`"],
      examples: [
        { input: "['app.log', '--min-level', 'WARN']", output: "('app.log', 'WARN')" },
        { input: "['app.log']", output: "('app.log', 'ERROR')" },
      ],
      tasks: [
        "Build `ArgumentParser` with `src` (`type=Path`) and `--min-level` (`choices`, `default`).",
      ],
      starterCode: "# Exercise M12.2 Warmup: argparse Path & choices\nimport argparse\nfrom collections.abc import Sequence\nfrom pathlib import Path\n\ndef parse_scan(argv: Sequence[str] | None = None) -> tuple[str, str]:\n    return ('', '')\n",
      expectedOutput: "('app.log', 'WARN')\n('app.log', 'ERROR')",
      hint: "Parse `argv` with `p.parse_args(argv)` and return `(args.src.as_posix(), args.min_level)`.",
      complexity: { time: "O(k)", space: "O(k)" },
      solutionCode:
        "import argparse\nfrom collections.abc import Sequence\nfrom pathlib import Path\n\ndef parse_scan(argv: Sequence[str] | None = None) -> tuple[str, str]:\n    p = argparse.ArgumentParser()\n    p.add_argument('src', type=Path)\n    p.add_argument('--min-level', choices=['ERROR', 'WARN'], default='ERROR')\n    args = p.parse_args(argv)\n    return (args.src.as_posix(), args.min_level)\n\nprint(parse_scan(['app.log', '--min-level', 'WARN']))\nprint(parse_scan(['app.log']))",
    },
    practiceChallenges: [
      {
        title: "Core: Subcommands with `add_subparsers`",
        tier: "Core",
        goal: "Build `run_cli(argv)` with subcommands `scan <path>` and `stats [--json]` returning `'scan:<path>'` or `'stats:<bool>'`.",
        constraints: ["Require subcommand with `add_subparsers(dest='cmd', required=True)`"],
        examples: [
          { input: "['scan', 'a.log']", output: "scan:a.log" },
          { input: "['stats', '--json']", output: "stats:True" },
        ],
        tasks: [
          "Configure `scan` and `stats` subparsers.",
        ],
        starterCode: "# Exercise M12.2 Core: add_subparsers subcommands\nimport argparse\nfrom pathlib import Path\n\ndef run_cli(argv: list[str]) -> str:\n    return ''\n",
        expectedOutput: "scan:a.log\nstats:True",
        hint: "Branch on `args.cmd == 'scan'` vs `'stats'` after `parse_args(argv)`.",
        complexity: { time: "O(k)", space: "O(k)" },
        solutionCode:
          "import argparse\nfrom pathlib import Path\n\ndef run_cli(argv: list[str]) -> str:\n    p = argparse.ArgumentParser()\n    subs = p.add_subparsers(dest='cmd', required=True)\n    s = subs.add_parser('scan')\n    s.add_argument('path', type=Path)\n    st = subs.add_parser('stats')\n    st.add_argument('--json', action='store_true')\n    args = p.parse_args(argv)\n    if args.cmd == 'scan':\n        return f'scan:{args.path.as_posix()}'\n    return f'stats:{args.json}'\n\nprint(run_cli(['scan', 'a.log']))\nprint(run_cli(['stats', '--json']))",
      },
      {
        title: "Stretch: Testable `main(argv)` returning `0` vs `2` on invalid args",
        tier: "Stretch",
        goal: "Write `run_main(argv)` parsing `--count` (`int`, must be `> 0`) returning exit code `0` when valid or `2` when `--count <= 0`.",
        constraints: ["Never raise uncaught `SystemExit` on `--count <= 0`; return `2`"],
        examples: [
          { input: "['--count', '3']", output: "0" },
          { input: "['--count', '0']", output: "2" },
        ],
        tasks: [
          "Return `0` on valid count and `2` when `args.count <= 0`.",
        ],
        starterCode: "# Exercise M12.2 Stretch: clean CLI exit codes\nimport argparse\n\ndef run_main(argv: list[str]) -> int:\n    return 2\n",
        expectedOutput: "0\n2",
        hint: "Validate `if args.count <= 0: return 2` after parsing.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "import argparse\n\ndef run_main(argv: list[str]) -> int:\n    p = argparse.ArgumentParser()\n    p.add_argument('--count', type=int, required=True)\n    args = p.parse_args(argv)\n    if args.count <= 0:\n        return 2\n    return 0\n\nprint(run_main(['--count', '3']))\nprint(run_main(['--count', '0']))",
      },
    ],
  },

  "py-generics-callable": {
    lessonId: "py-generics-callable",
    subtitle: "Write generic functions/classes (`[T]`), fluent `Self`, `ParamSpec` decorators, `Sequence[T]`, `Literal`, and `assert_never`.",
    intro: {
      heading: "Preserve exact types across reusable containers and decorators",
      explanation: [
        "Copying `first_str(xs)` and `first_int(xs)` for every new type creates duplicate helpers to maintain, while returning `Any` from a shared helper or decorator strips autocomplete and hides type mismatches until runtime.",
        "Modern Python generics (`[T]`, `Self`, `[**P, R]`) keep caller types intact across containers, fluent builders, and decorators, while `Sequence[T]` and `Literal` + `assert_never` guard read-only inputs and exhaustive branches.",
      ],
      analogy: "A clear shipping crate accepts any kind of item and stamps the exact contents (`books` or `plates`) on the label so the receiver knows what is inside before opening it.",
      realWorldUses: [
        "Typing reusable repository wrappers and `@wraps` decorators with `ParamSpec` so call-site checks survive",
        "Pairing `Literal` with `assert_never` on status enums so `mypy` flags missing `match` branches",
      ],
    },
    sections: [
      {
        heading: "Python 3.12+ generics (`[T]`, `Self`, `ParamSpec`) and variance",
        paragraphs: [
          "Declare type parameters inline on functions (`def first[T](xs: Sequence[T]) -> T:`) and classes (`class Stack[T]:`). This concise `[T]` syntax (PEP 695) requires Python 3.12+ (older Python 3.10/3.11 code declares `T = TypeVar('T')` separately). Return `typing.Self` for fluent methods returning `self`, and use `[**P, R]` (`ParamSpec`) on decorators so wrapped signatures survive intact.",
          "Remember variance: `list[Dog]` is not compatible with `list[Animal]` because `list` is mutable (invariant). Accept read-only `Sequence[Animal]` (covariant) whenever a parameter only reads items. Pair `Literal[...]` with `assert_never(val)` so `mypy` flags missing branches.",
        ],
        callout: {
          kind: "WATCH OUT",
          text: "Inline `[T]` generics (`def first[T]` / `class Stack[T]`) require Python 3.12+. Running them on Python 3.10 or 3.11 raises `SyntaxError`; use `TypeVar` if targeting earlier 3.x releases.",
        },
        code: [
          "from collections.abc import Callable, Sequence",
          "from functools import wraps",
          "from typing import Literal, Self, assert_never",
          "",
          "class Stack[T]:",
          "    def __init__(self) -> None: self._items: list[T] = []",
          "    def push(self, item: T) -> Self:",
          "        self._items.append(item)",
          "        return self",
          "    def pop(self) -> T: return self._items.pop()",
          "",
          "def logged[**P, R](fn: Callable[P, R]) -> Callable[P, R]:",
          "    @wraps(fn)",
          "    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:",
          "        return fn(*args, **kwargs)",
          "    return wrapper",
          "",
          "@logged",
          "def fmt(mode: Literal[\"short\", \"full\"], xs: Sequence[str]) -> str:",
          "    match mode:",
          "        case \"short\": return xs[0]",
          "        case \"full\": return \",\".join(xs)",
          "        case _: assert_never(mode)",
          "",
          "print(Stack[str]().push(\"a\").push(\"b\").pop(), fmt(\"full\", [\"x\", \"y\"]))",
        ],
        output: "b x,y",
        table: {
          caption: "Modern Python typing toolbox",
          headers: ["Construct", "Purpose", "Key rule"],
          rows: [
            ["`class Stack[T]:` / `def f[T]`", "Inline type parameter (`3.12+`)", "Pre-3.12 code uses `TypeVar('T')` + `Generic[T]`"],
            ["`Self`", "Fluent chaining return type", "Preserves subclass type"],
            ["`[**P, R]` (`ParamSpec`)", "Preserves wrapped parameter types", "Pairs with `*args: P.args, **kwargs: P.kwargs`"],
            ["`Sequence[T]` vs `list[T]`", "Covariant read-only vs invariant mutable", "Prefer `Sequence[T]` for read-only parameters"],
            ["`Literal[...]` + `assert_never`", "Exhaustive branching check", "`mypy` rejects unhandled cases"],
            ["`Callable[[A], R]` & `Protocol`", "Pythonic Strategy & DI", "Swap functions or structural adapters without base-class inheritance"],
          ],
        },
      },
      {
        heading: "Bug vs fix: invariant `list[Animal]` and `Any`-erased decorators",
        paragraphs: [
          "Annotating a read-only parameter as `list[Animal]` causes `mypy` to reject `list[Dog]`, and typing a decorator with `Callable[..., Any]` wipes out argument validation on every decorated function.",
          "Switch read-only sequences to `Sequence[Animal]` and preserve decorator signatures with `[**P, R]`.",
        ],
        code: [
          "# BUG: rejects list[Dog] and erases wrapped function types",
          "def first_animal(pets: list[Animal]) -> Animal: return pets[0]",
          "def logged(fn: Callable[..., Any]) -> Callable[..., Any]: ...",
          "",
          "# FIX: covariant Sequence[T] and ParamSpec [**P, R]",
          "def first_item[T](items: Sequence[T]) -> T: return items[0]",
          "def logged[**P, R](fn: Callable[P, R]) -> Callable[P, R]: ...",
        ],
      },
      {
        heading: "Strategy and dependency injection with `Callable` and `Protocol`",
        paragraphs: [
          "Hardcoding `if tier == 'vip': ... elif tier == 'holiday': ...` inside `checkout()` forces edits to the billing function for every new promotion, and constructing `StripeClient()` inside `charge_order()` ties unit tests to live network calls. Java-style designs often solve this by adding an abstract `DiscountStrategy` base class and wrapping each formula in a subclass.",
          "Python treats functions as first-class values and checks interfaces structurally with `typing.Protocol`. Pass a `Callable[[int], int]` when a strategy is a single operation such as a discount rule, and accept a `Protocol` when an injected dependency groups multiple methods such as `PaymentGateway` (`charge` and `refund`). Any matching function or class satisfies the contract without inheriting from a shared base class.",
        ],
        callout: {
          kind: "KEY IDEA",
          text: "Interview framing: Python avoids single-method Strategy class hierarchies because plain functions satisfy `Callable[[int], int]`, while `Protocol` types multi-method adapters by method shape so production clients and test fakes stay decoupled.",
        },
        code: [
          "from collections.abc import Callable",
          "from typing import Protocol",
          "",
          "# Swappable single-method strategy: plain functions match Callable[[int], int]",
          "DiscountRule = Callable[[int], int]",
          "def no_discount(cents: int) -> int: return cents",
          "def vip_twenty_off(cents: int) -> int: return cents * 80 // 100",
          "",
          "# Multi-method dependency injection via structural Protocol (no inheritance)",
          "class PaymentGateway(Protocol):",
          "    def charge(self, amount_cents: int) -> str: ...",
          "    def refund(self, tx_id: str) -> bool: ...",
          "",
          "class FakeGateway:  # no inheritance from PaymentGateway, yet passes mypy",
          "    def charge(self, amount_cents: int) -> str: return f\"tx_{amount_cents}\"",
          "    def refund(self, tx_id: str) -> bool: return True",
          "",
          "def checkout(subtotal: int, apply_discount: DiscountRule, gw: PaymentGateway) -> str:",
          "    total = apply_discount(subtotal)",
          "    return gw.charge(total)",
          "",
          "print(checkout(5000, no_discount, FakeGateway()), checkout(5000, vip_twenty_off, FakeGateway()))",
        ],
        output: "tx_5000 tx_4000",
        table: {
          caption: "Java-style Strategy hierarchy vs Pythonic Callable and Protocol",
          headers: ["Need", "Class hierarchy approach", "Pythonic pattern", "Why interviewers prefer it"],
          rows: [
            ["Single swappable rule (discount, sort key)", "Abstract `Strategy` base + one subclass per rule", "`Callable[[int], int]` parameter", "Zero boilerplate; named functions or lambdas plug straight in"],
            ["Multi-method adapter (payment, storage)", "Interface + explicit `class Fake(Base):`", "`class PaymentGateway(Protocol):`", "Structural subtyping checks signatures without coupling callers or fakes to a base class"],
            ["Testing time or network calls", "Patch module globals after import", "Inject `now: Callable[[], float]` or `Protocol` client", "Deterministic tests pass fakes directly without monkeypatching"],
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Build type-safe generic helpers and decorators step by step",
      subtitle: "Move from one inline `[T]` helper to fluent `Self` chains and `[**P, R]` decorators.",
      steps: [
        {
          label: "Step 1: Parameterize a read-only helper with [T] and Sequence[T]",
          explanation: "Accepting `Sequence[T]` works for `list`, `tuple`, and subtypes while returning exact element type `T`.",
          code: [
            "from collections.abc import Sequence",
            "def first_item[T](items: Sequence[T]) -> T:",
            "    return items[0]",
            "print(first_item([\"a\", \"b\"]), first_item((10, 20)))",
          ],
          activeLines: [2, 3],
          output: "a 10",
        },
        {
          label: "Step 2: Return Self from fluent methods on Stack[T]",
          explanation: "Using `-> Self` keeps `.push('a').push('b')` typed as `Stack[str]` (or any subclass).",
          code: [
            "from typing import Self",
            "class Stack[T]:",
            "    def __init__(self) -> None: self._items: list[T] = []",
            "    def push(self, item: T) -> Self:",
            "        self._items.append(item)",
            "        return self",
            "    def pop(self) -> T: return self._items.pop()",
            "print(Stack[str]().push(\"a\").push(\"b\").pop())",
          ],
          activeLines: [2, 4, 6],
          output: "b",
        },
        {
          label: "Step 3: Preserve decorator signatures with [**P, R] and Literal checks",
          explanation: "Combine `Callable[P, R]` with `*args: P.args, **kwargs: P.kwargs` so static callers retain argument checks.",
          code: [
            "from collections.abc import Callable",
            "from functools import wraps",
            "from typing import Literal, assert_never",
            "def logged[**P, R](fn: Callable[P, R]) -> Callable[P, R]:",
            "    @wraps(fn)",
            "    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:",
            "        return fn(*args, **kwargs)",
            "    return wrapper",
            "@logged",
            "def label(mode: Literal[\"short\", \"full\"]) -> str:",
            "    match mode:",
            "        case \"short\": return \"s\"",
            "        case \"full\": return \"full\"",
            "        case _: assert_never(mode)",
            "print(label(\"short\"))",
          ],
          activeLines: [4, 6, 14],
          output: "s",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace generic binding across `[T]`, `Self`, and `[**P, R]`",
      steps: [
        {
          title: "`[T]` binds dynamically to each call's element type",
          tag: "CONCEPT",
          explanation: ["Calling `Stack[str]()` fixes `T = str`, so `.pop()` is known statically to return `str`."],
          code: [
            "class Stack[T]:",
            "    def push(self, item: T) -> Self: ...",
            "    def pop(self) -> T: ...",
            "val = Stack[str]().push('hi').pop()",
          ],
          activeLines: [1, 4],
          state: [
            { name: "T", value: "str", changed: true },
            { name: "val type", value: "str" },
          ],
          visual: {
            kind: "pipeline",
            caption: "Substituting T = str propagates element types into push(str) and pop() -> str.",
            nodes: [
              { id: "st", label: "Stack[str]()", sublabel: "T = str", active: true, tone: "accent" },
              { id: "pop", label: ".pop()", sublabel: "static type: str", tone: "ok" },
            ],
            links: [{ from: "st", to: "pop", active: true }],
          },
        },
        {
          title: "`Self` keeps fluent builder chains typed",
          tag: "PATTERN",
          explanation: ["Returning `Self` means even subclasses inheriting `.push()` keep returning the subclass type, not base `Stack`."],
          code: [
            "s = Stack[str]().push('a').push('b')",
          ],
          activeLines: [1],
          state: [
            { name: "push() return", value: "Stack[str] (Self)", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Returning Self keeps exact caller or subclass type across chained calls.",
            nodes: [
              { id: "p1", label: ".push('a')", sublabel: "returns Self" },
              { id: "p2", label: ".push('b')", sublabel: "returns Self", active: true, tone: "ok" },
            ],
            links: [{ from: "p1", to: "p2", label: "chained", active: true }],
          },
        },
        {
          title: "`[**P, R]` keeps decorator signatures intact",
          tag: "TRACE",
          explanation: ["Static callers calling `@logged def add(a: int, b: int) -> int:` still get type checks on `(a, b)` rather than `(Any, ...)`."],
          code: [
            "def logged[**P, R](fn: Callable[P, R]) -> Callable[P, R]: ...",
          ],
          activeLines: [1],
          state: [
            { name: "P", value: "(int, int)", changed: true },
            { name: "R", value: "int" },
          ],
          visual: {
            kind: "pipeline",
            caption: "ParamSpec P preserves exact parameter types across decorator wrapping.",
            nodes: [
              { id: "fn", label: "add(int, int) -> int", sublabel: "original signature" },
              { id: "dec", label: "logged[**P, R]", sublabel: "P=(int,int), R=int", active: true, tone: "accent" },
              { id: "wrap", label: "wrapped add(int, int) -> int", sublabel: "call-site checks kept", tone: "ok" },
            ],
            links: [
              { from: "fn", to: "dec", active: true },
              { from: "dec", to: "wrap", active: true },
            ],
          },
        },
        {
          title: "Prefer `Sequence[Base]` over invariant `list[Base]`",
          tag: "PITFALL",
          explanation: ["Passing `list[Dog]` into `list[Animal]` fails static checks because mutating `animals.append(Cat())` would corrupt the list."],
          code: [
            "def names(pets: Sequence[str]) -> str:  # accepts tuple or list",
            "    return ','.join(pets)",
          ],
          activeLines: [1],
          state: [
            { name: "Sequence", value: "covariant read-only", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Mutable list[T] stays invariant to prevent bad appends, whereas read-only Sequence[T] allows subtypes.",
            nodes: [
              { id: "lst", label: "list[Dog] -> list[Animal]", sublabel: "rejected (mutable risk)", tone: "warm" },
              { id: "seq", label: "Sequence[Dog] -> Sequence[Animal]", sublabel: "accepted (read-only)", active: true, tone: "ok" },
            ],
            links: [{ from: "lst", to: "seq", label: "safe variance", active: true }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `list[Animal]` when only reading elements",
        detail: "Accept `Sequence[Animal]` so both `tuple` and subtype lists pass.",
      },
      {
        title: "Putting `Final` on function parameters",
        detail: "`Final` is only valid on variables and class constants, never on `def f(x: Final[int])`.",
      },
      {
        title: "Writing single-method Strategy classes when a `Callable` works",
        detail: "Accept `Callable[[int], int]` for one-function rules such as discounts, and reserve `Protocol` for multi-method injected dependencies such as `PaymentGateway` or storage adapters.",
      },
    ],
    predictChecks: [
      {
        prompt: "Given `def first[T](xs: list[T]) -> T:`, what type does `mypy` infer for `x = first(['hi', 'py'])`?",
        code: "def first[T](xs: list[T]) -> T: return xs[0]\nx = first(['hi', 'py'])",
        options: [
          { id: "a", label: "`str`" },
          { id: "b", label: "`list[str]`" },
          { id: "c", label: "`Any`" },
        ],
        correctId: "a",
        explanation: "`xs` is `list[str]`, so `T` resolves to `str`.",
      },
      {
        prompt: "Why use `[**P, R]` (`ParamSpec`) when typing a decorator?",
        code: "def dec[**P, R](fn: Callable[P, R]) -> Callable[P, R]: ...",
        options: [
          { id: "a", label: "Preserves the wrapped function's exact parameter types and return type" },
          { id: "b", label: "Converts `Callable` into `TypedDict`" },
          { id: "c", label: "Allows mutating tuples" },
        ],
        correctId: "a",
        explanation: "Using `Callable[..., Any]` erases argument checking for every decorated function.",
      },
      {
        prompt: "In a backend interview, how do you explain why Python uses functions + `Protocol` for Strategy and dependency injection instead of Java-style Strategy class hierarchies?",
        code: "def checkout(total: int, rule: Callable[[int], int], gw: PaymentGateway) -> str:\n    return gw.charge(rule(total))",
        options: [
          { id: "a", label: "Functions are first-class `Callable` values for single rules, and `Protocol` checks multi-method adapters structurally without inheriting from a shared base class" },
          { id: "b", label: "Python forbids abstract base classes in production modules" },
          { id: "c", label: "`Protocol` turns static type checking off so any object passes at runtime" },
        ],
        correctId: "a",
        explanation: "How to state this clearly in an interview: single-operation strategies map to first-class functions typed as `Callable`, while multi-method dependencies use `Protocol` so production clients and test fakes satisfy the contract by shape without inheritance coupling.",
      },
    ],
    practiceTask: {
      title: "Warmup: Generic `chunk_items` and `Callable` filter",
      tier: "Warmup",
      goal: "Write `chunk_items[T](items: Sequence[T], size: int) -> list[list[T]]` (raising `ValueError` if `size <= 0`) and `count_matching[T](items: Sequence[T], pred: Callable[[T], bool]) -> int`.",
      constraints: ["Use `Sequence[T]` and Python 3.12+ inline `[T]`"],
      examples: [
        { input: "chunk_items([1, 2, 3, 4, 5], 2)", output: "[[1, 2], [3, 4], [5]]" },
        { input: "count_matching([1, 4, 6], lambda n: n > 3)", output: "2" },
      ],
      tasks: [
        "Validate `size <= 0` then slice `[list(items[i:i + size]) for i in range(0, len(items), size)]`.",
      ],
      starterCode: "# Exercise M12.3 Warmup: inline generic [T] & Callable\nfrom collections.abc import Callable, Sequence\n\ndef chunk_items[T](items: Sequence[T], size: int) -> list[list[T]]:\n    return []\n\ndef count_matching[T](items: Sequence[T], pred: Callable[[T], bool]) -> int:\n    return 0\n",
      expectedOutput: "[[1, 2], [3, 4], [5]]\n2",
      hint: "Return `sum(1 for x in items if pred(x))` for `count_matching`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "from collections.abc import Callable, Sequence\n\ndef chunk_items[T](items: Sequence[T], size: int) -> list[list[T]]:\n    if size <= 0:\n        raise ValueError('size must be positive')\n    return [list(items[i : i + size]) for i in range(0, len(items), size)]\n\ndef count_matching[T](items: Sequence[T], pred: Callable[[T], bool]) -> int:\n    return sum(1 for item in items if pred(item))\n\nprint(chunk_items([1, 2, 3, 4, 5], 2))\nprint(count_matching([1, 4, 6], lambda n: n > 3))",
    },
    practiceChallenges: [
      {
        title: "Core: Generic fluent `History[T]` returning `Self`",
        tier: "Core",
        goal: "Write `class History[T]` with `record(self, item: T) -> Self` appending to internal list and `items(self) -> list[T]` returning a copy.",
        constraints: ["Allow method chaining `.record(1).record(2)`"],
        examples: [
          { input: "History[int]().record(1).record(2).items()", output: "[1, 2]" },
          { input: "History[str]().record('ok').items()", output: "['ok']" },
        ],
        tasks: [
          "Return `self` from `record` annotated `-> Self`.",
        ],
        starterCode: "# Exercise M12.3 Core: fluent History[T] -> Self\nfrom typing import Self\n\nclass History[T]:\n    def __init__(self) -> None:\n        self._log: list[T] = []\n",
        expectedOutput: "[1, 2]\n['ok']",
        hint: "Append inside `record` and return `self`.",
        complexity: { time: "O(1) push", space: "O(n)" },
        solutionCode:
          "from typing import Self\n\nclass History[T]:\n    def __init__(self) -> None:\n        self._log: list[T] = []\n    def record(self, item: T) -> Self:\n        self._log.append(item)\n        return self\n    def items(self) -> list[T]:\n        return list(self._log)\n\nprint(History[int]().record(1).record(2).items())\nprint(History[str]().record('ok').items())",
      },
      {
        title: "Stretch: `ParamSpec` decorator with `Literal` level",
        tier: "Stretch",
        goal: "Write `tag_calls[**P, R](level: Literal['INFO', 'DEBUG'])` returning a `@wraps` decorator prefixing output preserving return types.",
        constraints: ["Preserve `__name__` with `@wraps`"],
        examples: [
          { input: "@tag_calls('INFO') add(2, 3)", output: "[INFO] add -> 5\n5" },
          { input: "add.__name__", output: "add" },
        ],
        tasks: [
          "Use `*args: P.args, **kwargs: P.kwargs -> R` inside `wrapper`.",
        ],
        starterCode: "# Exercise M12.3 Stretch: ParamSpec [**P, R] decorator\nfrom collections.abc import Callable\nfrom functools import wraps\nfrom typing import Literal\n\ndef tag_calls[**P, R](level: Literal['INFO', 'DEBUG']):\n    def decorator(fn: Callable[P, R]) -> Callable[P, R]:\n        return fn\n    return decorator\n",
        expectedOutput: "[INFO] add -> 5\n5\nadd",
        hint: "Print `f'[{level}] {fn.__name__} -> {res}'` before returning `res`.",
        complexity: { time: "O(1) overhead", space: "O(1)" },
        solutionCode:
          "from collections.abc import Callable\nfrom functools import wraps\nfrom typing import Literal\n\ndef tag_calls[**P, R](level: Literal['INFO', 'DEBUG']):\n    def decorator(fn: Callable[P, R]) -> Callable[P, R]:\n        @wraps(fn)\n        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:\n            result = fn(*args, **kwargs)\n            print(f'[{level}] {fn.__name__} -> {result}')\n            return result\n        return wrapper\n    return decorator\n\n@tag_calls('INFO')\ndef add(a: int, b: int) -> int:\n    return a + b\n\nprint(add(2, 3))\nprint(add.__name__)",
      },
    ],
  },

  "py-ruff-mypy": {
    lessonId: "py-ruff-mypy",
    subtitle: "Enforce consistent style, bug-free lint rules, and strict static types with `ruff` and `mypy --strict`.",
    intro: {
      heading: "Automate lint, formatting, and strict type verification",
      explanation: [
        "Silent bugs such as mutable default lists (`def add(x, bag=[]):`), dead imports, and unguarded `None` lookups pass Python's syntax check and wait to break on an edge-case request in production.",
        "Running `ruff` for sub-second linting and formatting alongside `mypy --strict` catches bugbear traps, bare `Any` containers, and missing `is not None` guards before a pull request ever merges.",
      ],
      analogy: "An automated pre-flight checklist verifies fuel valves and instrument switches before the aircraft leaves the gate.",
      realWorldUses: [
        "Configuring repository-wide formatting and lint rules inside `pyproject.toml`",
        "Running fast automated quality gates on every pull request",
      ],
    },
    sections: [
      {
        heading: "`ruff check`, `ruff format`, and `mypy --strict`",
        paragraphs: [
          "`ruff` replaces older fragmented tools (`flake8`, `isort`, `black`) in one sub-second CLI: `ruff check` flags bugs like unused imports and mutable defaults, while `ruff format` applies uniform formatting.",
          "`mypy --strict` rejects untyped parameters, bare unparameterized `list`/`dict` (`Any` generics), and dereferencing `X | None` without checking `is not None` first.",
        ],
        codeLabel: "TOML",
        code: [
          "[tool.ruff]",
          "line-length = 100",
          "target-version = \"py312\"",
          "",
          "[tool.ruff.lint]",
          "select = [\"E\", \"F\", \"B\", \"I\", \"UP\"]",
          "",
          "[tool.mypy]",
          "python_version = \"3.12\"",
          "strict = true",
        ],
        table: {
          caption: "Quality tool commands & rule codes",
          headers: ["Command / Setting", "Checks", "Common fix"],
          rows: [
            ["`python -m ruff check src tests`", "Unused imports (`F401`), bugbear traps (`B006` mutable default)", "Fix code or `ruff check --fix`"],
            ["`python -m ruff format --check src tests`", "Formatting drift", "`python -m ruff format src tests`"],
            ["`python -m mypy --strict src`", "Missing annotations, bare `list`/`dict`, unchecked `None`", "Add element types & `is not None` guards"],
          ],
        },
      },
      {
        heading: "Bug vs fix: traps caught by `ruff B006` and `mypy --strict`",
        paragraphs: [
          "Defaulting `tags=[]` shares one list across calls (`ruff` `B006`), bare `list` and `dict` skip element checks, and calling `.strip()` on `str | None` crashes with `AttributeError` when `None` arrives.",
          "Replace `[]` with `None`, parameterize every container (`list[str]`, `dict[str, int]`), and narrow `str | None` with an explicit `is None` guard.",
        ],
        code: [
          "# BUG: ruff B006 mutable default, bare list/dict, unguarded None",
          "def add_tag(tag: str, tags: list = []) -> dict:",
          "    tags.append(tag.strip())",
          "    return {\"count\": len(tags)}",
          "",
          "# FIX: None sentinel, typed containers, and explicit None guard",
          "def add_tag(tag: str | None, tags: list[str] | None = None) -> dict[str, int]:",
          "    out = list(tags) if tags is not None else []",
          "    if tag is not None:",
          "        out.append(tag.strip())",
          "    return {\"count\": len(out)}",
        ],
      },
    ],
    guidedBuildUp: {
      title: "Make a helper pass `ruff` and `mypy --strict` step by step",
      subtitle: "Eliminate mutable defaults, bare container types, and unguarded `None` values.",
      steps: [
        {
          label: "Step 1: Fix ruff B006 mutable default with a None sentinel",
          explanation: "Use `bag: list[int] | None = None` so every call without an argument receives a fresh list.",
          code: [
            "def add_item(x: int, bag: list[int] | None = None) -> list[int]:",
            "    out = list(bag) if bag is not None else []",
            "    out.append(x)",
            "    return out",
          ],
          activeLines: [1, 2],
        },
        {
          label: "Step 2: Parameterize bare list and dict for mypy --strict",
          explanation: "Specify inner key and value types (`list[str]`, `dict[str, int]`) to satisfy `disallow_any_generics`.",
          code: [
            "def count_lengths(words: list[str]) -> dict[str, int]:",
            "    return {w: len(w) for w in words}",
            "print(count_lengths([\"ruff\", \"mypy\"]))",
          ],
          activeLines: [1, 2],
          output: "{'ruff': 4, 'mypy': 4}",
        },
        {
          label: "Step 3: Narrow str | None before calling string methods",
          explanation: "Checking `if raw is None:` proves to `mypy` that `raw` is `str` on the remaining lines.",
          code: [
            "def clean_name(raw: str | None) -> str:",
            "    if raw is None:",
            "        return \"anonymous\"",
            "    return raw.strip().lower()",
            "print(clean_name(None), clean_name(\" Ada \"))",
          ],
          activeLines: [2, 3, 4],
          output: "anonymous ada",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Walk through checks caught by `ruff` and `mypy --strict`",
      steps: [
        {
          title: "`ruff` flags bugbear `B006` mutable defaults",
          tag: "PITFALL",
          explanation: ["Rule `B006` immediately catches `def add(x, bag=[])` at lint time before any caller hits the bug."],
          code: [
            "# ruff B006 error -> def add(x, bag=[]):",
            "def add(x: int, bag: list[int] | None = None) -> list[int]: ...",
          ],
          activeLines: [1, 2],
          state: [
            { name: "ruff rule", value: "B006 caught", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "ruff check inspects AST rules like B006 statically without executing your script.",
            nodes: [
              { id: "src", label: "def add(x, bag=[])", sublabel: "mutable default literal", tone: "warm", active: true },
              { id: "ruff", label: "ruff rule B006", sublabel: "AST static check", tone: "accent" },
              { id: "fix", label: "bag: list | None = None", sublabel: "safe signature", tone: "ok" },
            ],
            links: [
              { from: "src", to: "ruff", label: "flag", active: true },
              { from: "ruff", to: "fix", label: "replace" },
            ],
          },
        },
        {
          title: "`mypy --strict` rejects bare `list` and `dict`",
          tag: "CHECK",
          explanation: ["`disallow_any_generics` forces `list[str]` and `dict[str, int]` so element mismatches never slip silently past static analysis."],
          code: [
            "# error: Missing type parameters for generic type \"dict\"",
            "def clean(rows: list[str]) -> dict[str, int]: ...",
          ],
          activeLines: [2],
          state: [
            { name: "mypy flag", value: "--strict", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "mypy --strict requires element types on every list[...] and dict[..., ...] container.",
            nodes: [
              { id: "bare", label: "Bare dict / list", sublabel: "Unknown items (Any)", tone: "warm" },
              { id: "mypy", label: "mypy --strict", sublabel: "disallow_any_generics", tone: "accent", active: true },
              { id: "typed", label: "dict[str, int]", sublabel: "Exact key & value types", tone: "ok" },
            ],
            links: [
              { from: "bare", to: "mypy", label: "reject", active: true },
              { from: "mypy", to: "typed", label: "require" },
            ],
          },
        },
        {
          title: "`mypy` enforces `is not None` narrowing",
          tag: "TRACE",
          explanation: ["Calling `user.strip()` on `user: str | None` fails static analysis unless guarded with `if user is not None:`."],
          code: [
            "def shout(name: str | None) -> str:",
            "    if name is None:",
            "        return ''",
            "    return name.upper()",
          ],
          activeLines: [2, 4],
          state: [
            { name: "narrowed name", value: "str", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "An early is None guard narrows str | None down to str for the remaining lines.",
            nodes: [
              { id: "in", label: "name: str | None", sublabel: "nullable input", tone: "muted" },
              { id: "grd", label: "if name is None: return ''", sublabel: "early exit", tone: "accent", active: true },
              { id: "ok", label: "name: str", sublabel: "name.upper() safe", tone: "ok", active: true },
            ],
            links: [
              { from: "in", to: "grd", active: true },
              { from: "grd", to: "ok", label: "else path", active: true },
            ],
          },
        },
        {
          title: "Centralize settings inside `pyproject.toml`",
          tag: "CONCEPT",
          explanation: ["Keeping `[tool.ruff]` and `[tool.mypy]` inside `pyproject.toml` makes local editors and CI agree automatically."],
          code: [
            "# [tool.mypy]",
            "# strict = true",
          ],
          activeLines: [1, 2],
          state: [
            { name: "config file", value: "pyproject.toml", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "One shared pyproject.toml keeps VS Code, ruff, mypy, and CI checks synchronized.",
            nodes: [
              { id: "cfg", label: "pyproject.toml", sublabel: "[tool.ruff] + [tool.mypy]", tone: "accent", active: true },
              { id: "ide", label: "Local Editor & CLI", sublabel: "same lint/type rules", tone: "ok" },
              { id: "ci", label: "CI Runner", sublabel: "deterministic gate", tone: "ok" },
            ],
            links: [
              { from: "cfg", to: "ide", label: "reads", active: true },
              { from: "cfg", to: "ci", label: "reads", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using bare `list` or `dict` under `mypy --strict`",
        detail: "Specify concrete item types (`list[str]`, `dict[str, int]`).",
      },
      {
        title: "Silencing every warning with `# type: ignore` everywhere",
        detail: "Fix the underlying type narrowing or add targeted error codes only when interfacing with untyped stubs.",
      },
    ],
    predictChecks: [
      {
        prompt: "Why does `mypy --strict` reject `def clean(rows: list) -> dict:`?",
        code: "def clean(rows: list) -> dict:\n    return {}",
        options: [
          { id: "a", label: "Bare `list` and `dict` leave element types unchecked (`Any`)" },
          { id: "b", label: "`mypy` forbids returning `dict`" },
          { id: "c", label: "`rows` must be capitalized" },
        ],
        correctId: "a",
        explanation: "`--strict` enables `--disallow-any-generics` so inner container types stay typed.",
      },
      {
        prompt: "Which lint category in `ruff` catches `def f(xs=[]):` automatically?",
        code: "select = ['E', 'F', 'B']",
        options: [
          { id: "a", label: "`B` (flake8-bugbear `B006`)" },
          { id: "b", label: "`venv`" },
          { id: "c", label: "`pickle`" },
        ],
        correctId: "a",
        explanation: "Bugbear rule `B006` catches mutable default argument bugs statically.",
      },
    ],
    practiceTask: {
      title: "Warmup: Parse strict `pyproject.toml` tool settings",
      tier: "Warmup",
      goal: "Write `is_strict_ready(toml_text)` using `tomllib.loads` returning `(mypy_strict, ruff_len)` tuple (`bool`, `int | None`).",
      constraints: ["Use `tomllib.loads` without crashing if keys are absent"],
      examples: [
        { input: "[tool.ruff]\\nline-length=100\\n[tool.mypy]\\nstrict=true", output: "(True, 100)" },
        { input: "[project]\\nname='x'", output: "(False, None)" },
      ],
      tasks: [
        "Extract `[tool.mypy].strict` (default `False`) and `[tool.ruff].line-length` (default `None`).",
      ],
      starterCode: "# Exercise M12.4 Warmup: read tool.mypy & tool.ruff settings\nimport tomllib\n\ndef is_strict_ready(toml_text: str) -> tuple[bool, int | None]:\n    return (False, None)\n",
      expectedOutput: "(True, 100)\n(False, None)",
      hint: "Access `data.get('tool', {}).get('mypy', {}).get('strict', False)`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "import tomllib\n\ndef is_strict_ready(toml_text: str) -> tuple[bool, int | None]:\n    tool = tomllib.loads(toml_text).get('tool', {})\n    strict = bool(tool.get('mypy', {}).get('strict', False))\n    line_len = tool.get('ruff', {}).get('line-length')\n    return (strict, line_len)\n\nprint(is_strict_ready(\"[tool.ruff]\\nline-length = 100\\n[tool.mypy]\\nstrict = true\"))\nprint(is_strict_ready(\"[project]\\nname = 'x'\"))",
    },
    practiceChallenges: [
      {
        title: "Core: Narrow `str | None` strictly for `mypy`",
        tier: "Core",
        goal: "Write `normalize_host(raw: str | None) -> str` returning `'localhost'` when `raw` is `None` or blank after stripping, else lowercase host.",
        constraints: ["Narrow `raw` with `if raw is None:` so `mypy --strict` accepts `.strip()`"],
        examples: [
          { input: "None", output: "localhost" },
          { input: "' API.Local '", output: "api.local" },
        ],
        tasks: [
          "Guard `if raw is None:` before calling `.strip().lower()`.",
        ],
        starterCode: "# Exercise M12.4 Core: strict None narrowing\ndef normalize_host(raw: str | None) -> str:\n    return ''\n",
        expectedOutput: "localhost\napi.local",
        hint: "Return `'localhost'` if `raw is None`, otherwise strip, lowercase, and default empty string to `'localhost'`.",
        complexity: { time: "O(k)", space: "O(k)" },
        solutionCode:
          "def normalize_host(raw: str | None) -> str:\n    if raw is None:\n        return 'localhost'\n    cleaned = raw.strip().lower()\n    return cleaned or 'localhost'\n\nprint(normalize_host(None))\nprint(normalize_host(' API.Local '))",
      },
      {
        title: "Stretch: Fix bare generics & mutable defaults for strict checks",
        tier: "Stretch",
        goal: "Rewrite `append_tag(tag: str, existing: Sequence[str] | None = None) -> list[str]` without mutable default `[]` and with exact list annotations.",
        constraints: ["Never mutate the input `existing` sequence"],
        examples: [
          { input: "'api', None", output: "['api']" },
          { input: "'v2', ('v1',)", output: "['v1', 'v2']" },
        ],
        tasks: [
          "Build `out = list(existing) if existing is not None else []`, append `tag`, return `out`.",
        ],
        starterCode: "# Exercise M12.4 Stretch: lint & strict-type safe helper\nfrom collections.abc import Sequence\n\ndef append_tag(tag: str, existing: Sequence[str] | None = None) -> list[str]:\n    return []\n",
        expectedOutput: "['api']\n['v1', 'v2']",
        hint: "Accept `Sequence[str] | None = None` instead of `= []`.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "from collections.abc import Sequence\n\ndef append_tag(tag: str, existing: Sequence[str] | None = None) -> list[str]:\n    out = list(existing) if existing is not None else []\n    out.append(tag)\n    return out\n\nprint(append_tag('api', None))\nprint(append_tag('v2', ('v1',)))",
      },
    ],
  },

  "py-mocking-testing": {
    lessonId: "py-mocking-testing",
    subtitle: "Isolate unit tests with `monkeypatch`, `patch(..., autospec=True)`, `MagicMock`, `capsys`, `caplog`, and `conftest.py`.",
    intro: {
      heading: "Keep unit tests fast and deterministic without real networks",
      explanation: [
        "Tests that call real HTTP endpoints, read the system clock, or mutate `os.environ` directly turn flaky on slow Wi-Fi, fail offline, and leak state into unrelated tests.",
        "`pytest` isolation tools (`monkeypatch`, `capsys`, `caplog`, `conftest.py`) and signature-checked `unittest.mock.patch(..., autospec=True)` replace slow or external boundaries while still catching bad argument calls.",
      ],
      analogy: "A flight simulator swaps live weather and real fuel burn for scripted engine-fault scenarios while keeping the exact cockpit switch layout.",
      realWorldUses: [
        "Simulating network failures with `Mock(side_effect=[OSError(), 'ok'])`",
        "Overriding env vars temporarily with `monkeypatch.setenv`",
      ],
    },
    sections: [
      {
        heading: "`patch(..., autospec=True)`, `MagicMock`, `monkeypatch`, `capsys`, and `caplog`",
        paragraphs: [
          "Put shared `@pytest.fixture` factories in `tests/conftest.py`. Use `monkeypatch.setenv(...)` to override environment variables temporarily, `capsys` to inspect `stdout`, and `caplog` to verify `logging` output.",
          "Prefer `patch(..., autospec=True)` so wrong argument counts still raise `TypeError`. For `async def` stubs, `unittest.mock.AsyncMock` works like `Mock` with an awaitable return value. Remember the patch-where-imported rule: if `service.py` ran `from gateway import charge`, patch `'service.charge'` rather than `'gateway.charge'`.",
        ],
        code: [
          "from unittest.mock import MagicMock, patch",
          "",
          "class Store:",
          "    def fetch(self, item_id: int) -> str: return f\"real:{item_id}\"",
          "",
          "with patch.object(Store, \"fetch\", autospec=True, return_value=\"stub:42\") as mock_fetch:",
          "    out = Store().fetch(42)",
          "    mock_fetch.assert_called_once()",
          "",
          "bag = MagicMock()",
          "bag.__len__.return_value = 3",
          "print(out, len(bag))",
        ],
        output: "stub:42 3",
        visual: {
          kind: "memory-sim",
          caption: "Why patch-where-imported matters when service.py runs from gateway import charge",
          scenarios: [
            {
              label: "Wrong: Patch gateway.charge",
              code: [
                "# gateway.py: def charge(n): ...",
                "# service.py: from gateway import charge",
                "monkeypatch.setattr(\"gateway.charge\", fake)",
                "service.process()  # still calls real charge",
              ],
              steps: [
                {
                  line: 2,
                  note: "from gateway import charge binds a direct reference inside service namespace.",
                  frames: [
                    { name: "gateway", bindings: [{ label: "charge", targetId: "real_fn" }] },
                    { name: "service", bindings: [{ label: "charge", targetId: "real_fn", highlight: true }] },
                  ],
                  objects: [
                    { id: "real_fn", typeLabel: "function", value: "real charge()" },
                    { id: "fake_fn", typeLabel: "function", value: "fake()" },
                  ],
                },
                {
                  line: 3,
                  note: "Patching gateway.charge leaves service.charge still pointing at real charge!",
                  frames: [
                    { name: "gateway", bindings: [{ label: "charge", targetId: "fake_fn", highlight: true }] },
                    { name: "service", bindings: [{ label: "charge", targetId: "real_fn", highlight: true }] },
                  ],
                  objects: [
                    { id: "real_fn", typeLabel: "function", value: "real charge() (still called)", highlight: true },
                    { id: "fake_fn", typeLabel: "function", value: "fake()" },
                  ],
                },
              ],
            },
            {
              label: "Right: Patch service.charge",
              code: [
                "# gateway.py: def charge(n): ...",
                "# service.py: from gateway import charge",
                "monkeypatch.setattr(\"service.charge\", fake)",
                "service.process()  # calls fake() instead",
              ],
              steps: [
                {
                  line: 2,
                  note: "from gateway import charge binds service.charge directly to real charge().",
                  frames: [
                    { name: "gateway", bindings: [{ label: "charge", targetId: "real_fn" }] },
                    { name: "service", bindings: [{ label: "charge", targetId: "real_fn", highlight: true }] },
                  ],
                  objects: [
                    { id: "real_fn", typeLabel: "function", value: "real charge()" },
                    { id: "fake_fn", typeLabel: "function", value: "fake()" },
                  ],
                },
                {
                  line: 3,
                  note: "Patching service.charge rebinds the exact reference inside service's namespace.",
                  frames: [
                    { name: "gateway", bindings: [{ label: "charge", targetId: "real_fn" }] },
                    { name: "service", bindings: [{ label: "charge", targetId: "fake_fn", highlight: true }] },
                  ],
                  objects: [
                    { id: "real_fn", typeLabel: "function", value: "real charge()" },
                    { id: "fake_fn", typeLabel: "function", value: "fake()", highlight: true },
                  ],
                },
                {
                  line: 4,
                  note: "service.process() looks up service.charge and invokes fake() without touching real charge().",
                  frames: [
                    { name: "gateway", bindings: [{ label: "charge", targetId: "real_fn" }] },
                    { name: "service", bindings: [{ label: "charge", targetId: "fake_fn", highlight: true }] },
                  ],
                  objects: [
                    { id: "real_fn", typeLabel: "function", value: "real charge() (uncalled)" },
                    { id: "fake_fn", typeLabel: "function", value: "fake() (invoked)", highlight: true },
                  ],
                },
              ],
            },
          ],
        },
        table: {
          caption: "`pytest` isolation & mock tools",
          headers: ["Tool", "What it controls", "Example"],
          rows: [
            ["`monkeypatch.setenv`", "Scoped env var override", "`monkeypatch.setenv('API_KEY', 'dev')`"],
            ["`capsys` / `caplog`", "Captures `stdout` or `logging`", "`assert 'warn' in caplog.text`"],
            ["`patch(..., autospec=True)`", "Enforces real parameter signatures", "`with patch('svc.fetch', autospec=True):`"],
            ["`Mock(side_effect=[...])`", "Sequences returns or errors per call", "`Mock(side_effect=[OSError(), 'ok'])`"],
          ],
        },
      },
      {
        heading: "Bug vs fix: bare `Mock()` hiding broken signatures",
        paragraphs: [
          "A plain `Mock` or `patch(...)` without `autospec=True` accepts misspelled methods and wrong argument counts, so a refactored function passes unit tests while failing in production.",
          "Enable `autospec=True` whenever patching real functions or methods so mismatched signatures still raise `TypeError`.",
        ],
        code: [
          "# BUG: bare patch silently accepts missing or extra arguments",
          "with patch.object(Store, \"fetch\", return_value=\"ok\"):",
          "    Store().fetch(1, 2, 3)  # passes test even though fetch takes 1 arg!",
          "",
          "# FIX: autospec=True enforces Store.fetch(self, item_id: int)",
          "with patch.object(Store, \"fetch\", autospec=True, return_value=\"ok\"):",
          "    Store().fetch(42)       # ok",
          "    # Store().fetch(1, 2, 3) -> raises TypeError",
        ],
      },
    ],
    guidedBuildUp: {
      title: "Isolate retries, signatures, and dunders step by step",
      subtitle: "Progress from scripted `side_effect` calls to `autospec=True` and `MagicMock`.",
      steps: [
        {
          label: "Step 1: Script sequential outcomes with Mock(side_effect=[...])",
          explanation: "Pass a list of exceptions and return values to test retry loops without sleeping or touching a network.",
          code: [
            "from unittest.mock import Mock",
            "fetch = Mock(side_effect=[OSError(\"timeout\"), \"ok\"])",
            "try:",
            "    fetch()",
            "except OSError:",
            "    print(fetch(), fetch.call_count)",
          ],
          activeLines: [2, 6],
          output: "ok 2",
        },
        {
          label: "Step 2: Enforce real parameter signatures with autospec=True",
          explanation: "Passing `autospec=True` copies the target method's parameter list onto the mock so invalid calls raise `TypeError`.",
          code: [
            "from unittest.mock import patch",
            "class Store:",
            "    def fetch(self, item_id: int) -> str: return f\"real:{item_id}\"",
            "with patch.object(Store, \"fetch\", autospec=True, return_value=\"stub:42\"):",
            "    print(Store().fetch(42))",
          ],
          activeLines: [4, 5],
          output: "stub:42",
        },
        {
          label: "Step 3: Stub len() and context managers with MagicMock",
          explanation: "Use `MagicMock` when the code under test invokes dunders such as `__len__` or `__enter__`.",
          code: [
            "from unittest.mock import MagicMock",
            "conn = MagicMock()",
            "conn.__len__.return_value = 3",
            "conn.__enter__.return_value = \"session-1\"",
            "with conn as s:",
            "    print(len(conn), s)",
          ],
          activeLines: [2, 3, 4],
          output: "3 session-1",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `patch-where-imported`, `autospec=True`, and `side_effect`",
      steps: [
        {
          title: "`from gateway import charge` copies the function reference",
          tag: "MEMORY",
          explanation: ["`service.py` now holds its own namespace binding `service.charge` pointing to the original function."],
          code: [
            "# service.py: from gateway import charge",
            "# patch 'service.charge', not 'gateway.charge'",
          ],
          activeLines: [1, 2],
          state: [
            { name: "lookup site", value: "service.charge", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "Patching gateway.charge misses service.charge because from-import copied the reference into service.",
            frames: [
              { name: "Modules", bindings: [{ label: "gateway.charge", targetId: "orig" }, { label: "service.charge (patch here!)", targetId: "mock", highlight: true }] },
            ],
            objects: [
              { id: "orig", typeLabel: "real fn", value: "<real charge>" },
              { id: "mock", typeLabel: "patched Mock", value: "<fake charge>", highlight: true },
            ],
          },
        },
        {
          title: "`Mock(side_effect=[err, val])` scripts multi-call retries",
          tag: "TRACE",
          explanation: ["First call raises `OSError`, second returns `'ok'`, testing retry code with zero sleeps or real sockets."],
          code: [
            "fake = Mock(side_effect=[OSError('net'), 'ok'])",
            "print(retry_twice(fake))",
          ],
          activeLines: [1, 2],
          state: [
            { name: "call 1", value: "raises OSError" },
            { name: "call 2", value: "returns 'ok'", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "side_effect steps through the scripted outcomes in order on each mock invocation.",
            frames: [{ name: "Mock Object", bindings: [{ label: "fake", targetId: "mk_se", highlight: true }] }],
            objects: [
              {
                id: "mk_se",
                typeLabel: "Mock.side_effect",
                value: "call cursor -> [1]",
                mutable: true,
                highlight: true,
                cells: [
                  { index: "Call 1", value: "raises OSError('net')" },
                  { index: "Call 2", value: "returns 'ok'", active: true },
                ],
              },
            ],
          },
        },
        {
          title: "`autospec=True` catches bad call signatures",
          tag: "CHECK",
          explanation: ["Unlike bare `Mock()`, `patch(..., autospec=True)` rejects typos and wrong argument counts with `TypeError`."],
          code: [
            "with patch.object(Store, 'fetch', autospec=True):",
            "    Store().fetch(1, 2, 3)  # raises TypeError!",
          ],
          activeLines: [1, 2],
          state: [
            { name: "signature check", value: "enforced", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "autospec=True mirrors the real method signature onto the Mock so extra args raise TypeError.",
            frames: [{ name: "Patched Target", bindings: [{ label: "Store.fetch", targetId: "mk_auto", highlight: true }] }],
            objects: [
              { id: "mk_auto", typeLabel: "Mock (autospec=True)", value: "enforces (self, item_id: int)", highlight: true, cells: [{ index: "fetch(1,2,3)", value: "TypeError caught", active: true }] },
            ],
          },
        },
        {
          title: "Never keep custom env changes outside `monkeypatch`",
          tag: "PITFALL",
          explanation: ["Mutating `os.environ['X'] = '1'` directly leaks into later tests even if an assertion fails; `monkeypatch.setenv` always restores original state."],
          code: [
            "monkeypatch.setenv('MODE', 'test')  # auto-restored",
          ],
          activeLines: [1],
          state: [
            { name: "teardown", value: "automatic", changed: true },
          ],
          visual: {
            kind: "memory",
            caption: "monkeypatch edits os.environ for the active test and restores the prior value on teardown.",
            frames: [{ name: "os.environ", bindings: [{ label: "MODE (during test)", targetId: "ev_t", highlight: true }] }],
            objects: [
              { id: "ev_t", typeLabel: "str", value: "'test' -> restored on exit", highlight: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Patching where defined instead of where imported",
        detail: "Always pass the target module where the function is looked up during execution.",
      },
      {
        title: "Bare `Mock()` hiding broken caller signatures",
        detail: "Add `autospec=True` whenever patching existing functions or classes so refactors cannot break mocked calls without an error.",
      },
    ],
    predictChecks: [
      {
        prompt: "`reports.py` contains `from clock import today_str`. Which target should be patched when testing `reports.make_header()`?",
        code: "# reports.py\nfrom clock import today_str\ndef make_header(): return f'Report {today_str()}'",
        options: [
          { id: "a", label: "`reports.today_str`" },
          { id: "b", label: "`clock.today_str`" },
          { id: "c", label: "`builtins.today_str`" },
        ],
        correctId: "a",
        explanation: "`reports` holds its own binding to `today_str`, so patch `reports.today_str`.",
      },
      {
        prompt: "What does `fake = Mock(side_effect=[ValueError('bad'), 42])` do on calls 1 and 2?",
        code: "fake = Mock(side_effect=[ValueError('bad'), 42])",
        options: [
          { id: "a", label: "Raises `ValueError('bad')` on call 1, then returns `42` on call 2" },
          { id: "b", label: "Returns the list both times" },
          { id: "c", label: "Returns `42` both times" },
        ],
        correctId: "a",
        explanation: "`Mock` consumes iterable `side_effect` values sequentially and raises exception instances.",
      },
    ],
    practiceTask: {
      title: "Warmup: Test retry logic with `Mock(side_effect=[...])`",
      tier: "Warmup",
      goal: "Write `retry_once(fn)` trying `fn()` and retrying once on `OSError`, verified with `Mock(side_effect=[OSError('net'), 'ok'])`.",
      constraints: ["Do not sleep inside `retry_once`; check `.call_count == 2`"],
      examples: [
        { input: "side_effect=[OSError('net'), 'ok']", output: "ok 2" },
        { input: "side_effect=['fast']", output: "fast 1" },
      ],
      tasks: [
        "Try `return fn()`, catch `OSError` and return `fn()`.",
      ],
      starterCode: "# Exercise M12.5 Warmup: Mock side_effect retry test\nfrom unittest.mock import Mock\n\ndef retry_once(fn):\n    return None\n",
      expectedOutput: "ok 2\nfast 1",
      hint: "On `OSError`, invoke `return fn()` once more.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "from unittest.mock import Mock\n\ndef retry_once(fn):\n    try:\n        return fn()\n    except OSError:\n        return fn()\n\nf1 = Mock(side_effect=[OSError('net'), 'ok'])\nprint(retry_once(f1), f1.call_count)\nf2 = Mock(side_effect=['fast'])\nprint(retry_once(f2), f2.call_count)",
    },
    practiceChallenges: [
      {
        title: "Core: Signature check via `patch.object(..., autospec=True)`",
        tier: "Core",
        goal: "Write `Gateway.charge(self, cents: int) -> str` and verify `patch.object(Gateway, 'charge', autospec=True, return_value='paid')` accepts valid calls and rejects missing `cents` with `TypeError`.",
        constraints: ["Enable `autospec=True`"],
        examples: [
          { input: "Gateway().charge(500)", output: "paid" },
          { input: "Gateway().charge() missing arg", output: "bad_sig" },
        ],
        tasks: [
          "Patch `Gateway.charge` with `autospec=True` and confirm missing argument raises `TypeError`.",
        ],
        starterCode: "# Exercise M12.5 Core: autospec=True signature enforcement\nfrom unittest.mock import patch\n\nclass Gateway:\n    def charge(self, cents: int) -> str:\n        return f'real:{cents}'\n",
        expectedOutput: "paid\nbad_sig",
        hint: "Inside `with patch.object(Gateway, 'charge', autospec=True, return_value='paid'):`, test both valid and invalid calls.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "from unittest.mock import patch\n\nclass Gateway:\n    def charge(self, cents: int) -> str:\n        return f'real:{cents}'\n\nwith patch.object(Gateway, 'charge', autospec=True, return_value='paid'):\n    gw = Gateway()\n    print(gw.charge(500))\n    try:\n        gw.charge()\n    except TypeError:\n        print('bad_sig')",
      },
      {
        title: "Stretch: Custom `MagicMock` supporting `len()` & `with`",
        tier: "Stretch",
        goal: "Build a fake store using `MagicMock` where `len(fake)` returns `3` and entering `with fake as conn:` yields `'conn-ok'`.",
        constraints: ["Configure `__len__.return_value` and `__enter__.return_value`"],
        examples: [
          { input: "len(fake)", output: "3" },
          { input: "with fake as conn: conn", output: "conn-ok" },
        ],
        tasks: [
          "Set `fake.__len__.return_value = 3` and `fake.__enter__.return_value = 'conn-ok'`.",
        ],
        starterCode: "# Exercise M12.5 Stretch: MagicMock dunder behavior\nfrom unittest.mock import MagicMock\n\nfake = MagicMock()\n",
        expectedOutput: "3\nconn-ok",
        hint: "Plain `Mock` lacks dunders; `MagicMock` supports `__len__` and `__enter__` directly.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "from unittest.mock import MagicMock\n\nfake = MagicMock()\nfake.__len__.return_value = 3\nfake.__enter__.return_value = 'conn-ok'\nprint(len(fake))\nwith fake as conn:\n    print(conn)",
      },
    ],
  },

  "py-packaging-ci": {
    lessonId: "py-packaging-ci",
    subtitle: "Package apps using `src/` layout, `pyproject.toml` (`optional-dependencies` vs `[dependency-groups]`), `uv`, and CI checks.",
    intro: {
      heading: "Package and verify code the same way on every machine",
      explanation: [
        "Putting code at the repository root creates classic 'works on my machine' bugs: `pytest` passes locally because Python imports uncommitted local folders, while a built wheel ships with missing modules or broken CLI entrypoints.",
        "Using a `src/<pkg>/` layout, `[build-system]` and `[project.scripts]` in `pyproject.toml`, installer-matched dev dependencies, and CI checks catches packaging drift before release.",
      ],
      analogy: "Testing a sealed retail box instead of loose parts on a factory bench proves the customer receives every cable and manual.",
      realWorldUses: [
        "Shipping installable CLI packages with `[project.scripts]`",
        "Running lint, strict types, and pytest automatically in GitHub Actions",
      ],
    },
    sections: [
      {
        heading: "`src/` layout, `pyproject.toml`, `uv`, and GitHub Actions CI",
        paragraphs: [
          "Put importable packages under `src/logscan/`. Match dev dependencies to your installer: PEP 735 `[dependency-groups]` pairs with `uv sync --locked` (`uv.lock`), whereas `[project.optional-dependencies]` pairs with `python -m pip install -e \".[dev]\"`.",
          "Configure `[tool.ruff]`, `[tool.mypy]`, and `[tool.pytest.ini_options]` inside `pyproject.toml`, then run all gates identically in `.github/workflows/ci.yml`.",
        ],
        codeLabel: "TOML",
        code: [
          "[build-system]",
          "requires = [\"hatchling\"]",
          "build-backend = \"hatchling.build\"",
          "",
          "[project]",
          "name = \"logscan\"",
          "version = \"0.1.0\"",
          "requires-python = \">=3.12\"",
          "",
          "[project.scripts]",
          "logscan = \"logscan.cli:main\"",
          "",
          "[dependency-groups]",
          "dev = [\"pytest>=8\", \"pytest-cov>=5\", \"ruff>=0.6\", \"mypy>=1.11\"]",
        ],
        table: {
          caption: "`src/` layout & packaging matrix",
          headers: ["Piece", "Setting", "Purpose"],
          rows: [
            ["`src/<pkg>/`", "Source inside `src/`", "Tests validate the installed package"],
            ["`[dependency-groups]`", "`dev = [...]` + `uv sync --locked`", "Keeps dev deps out of published wheel metadata"],
            ["`[project.optional-dependencies]`", "`dev = [...]` + `pip install -e '.[dev]'`", "Editable extras for standard `pip`"],
            ["`[project.scripts]`", "`logscan = 'logscan.cli:main'`", "Exposes CLI command in `.venv`"],
          ],
        },
      },
      {
        heading: "Bug vs fix: root imports and mismatched dev dependencies",
        paragraphs: [
          "Placing `logscan/` at repo root lets `pytest` import unbuilt folders, and listing dev tools only under `[dependency-groups]` fails when a CI job runs `pip install -e \".[dev]\"` on an older `pip`.",
          "Move package code into `src/logscan/` and match the dependency table to your installer.",
        ],
        code: [
          "# BUG: flat root layout hides missing package files; pip -e .[dev] skips dependency-groups",
          "# repo/logscan/__init__.py",
          "# [dependency-groups]  # ignored by pip install -e '.[dev]'",
          "",
          "# FIX: src/ layout + matching table for pip or uv",
          "# repo/src/logscan/__init__.py",
          "# [project.optional-dependencies]  # read by pip install -e '.[dev]'",
          "# [dependency-groups]              # read by uv sync --locked",
        ],
      },
    ],
    guidedBuildUp: {
      title: "Configure a reproducible `src/` package and CI pipeline",
      subtitle: "Move from folder layout to `pyproject.toml` metadata and automated checks.",
      steps: [
        {
          label: "Step 1: Place package code inside src/<pkg>/",
          explanation: "Keeping source modules inside `src/logscan/` forces `pytest` to import the installed distribution.",
          code: [
            "# repo/",
            "#   pyproject.toml",
            "#   src/logscan/__init__.py",
            "#   src/logscan/cli.py",
            "#   tests/test_cli.py",
          ],
          activeLines: [3, 4],
        },
        {
          label: "Step 2: Declare build backend, scripts, and dev tools in pyproject.toml",
          explanation: "Define `[build-system]`, `[project.scripts]` for the CLI command, and `[dependency-groups]` for `uv`.",
          code: [
            "[build-system]",
            "requires = [\"hatchling\"]",
            "build-backend = \"hatchling.build\"",
            "[project]",
            "name = \"logscan\"",
            "version = \"0.1.0\"",
            "[project.scripts]",
            "logscan = \"logscan.cli:main\"",
            "[dependency-groups]",
            "dev = [\"pytest>=8\", \"ruff>=0.6\", \"mypy>=1.11\"]",
          ],
          activeLines: [7, 8, 9, 10],
        },
        {
          label: "Step 3: Run identical lint, type, and test gates in CI",
          explanation: "Execute `ruff`, `mypy --strict`, and `pytest` inside `.venv` on every commit.",
          code: [
            "# .github/workflows/ci.yml steps:",
            "uv sync --locked",
            "uv run ruff check src tests",
            "uv run ruff format --check src tests",
            "uv run mypy --strict src",
            "uv run pytest --cov=logscan",
          ],
          activeLines: [3, 4, 5, 6],
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `src/` packaging through automated CI gates",
      steps: [
        {
          title: "Editable install links `src/<pkg>/` into `.venv`",
          tag: "CONCEPT",
          explanation: ["`src/` keeps tests from importing raw folder paths without proper package metadata."],
          code: [
            "# repo/src/logscan/__init__.py",
            "# repo/tests/test_cli.py",
          ],
          activeLines: [1, 2],
          state: [
            { name: "layout", value: "src/logscan/", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Editable install links src package into .venv and creates CLI scripts",
            nodes: [
              { id: "src", label: "src/logscan/", sublabel: "Package modules", tone: "ok" },
              { id: "pkg", label: "pip / uv sync", sublabel: "Reads pyproject.toml", tone: "accent", active: true },
              { id: "cli", label: "logscan CLI", sublabel: "Entrypoint binary", tone: "muted" },
            ],
            links: [
              { from: "src", to: "pkg", label: "build", active: true },
              { from: "pkg", to: "cli", label: "script" },
            ],
          },
        },
        {
          title: "`[project.scripts]` wires console commands",
          tag: "PATTERN",
          explanation: ["`logscan = 'logscan.cli:main'` creates an executable inside `.venv` that invokes `main()` directly."],
          code: [
            "[project.scripts]",
            "logscan = 'logscan.cli:main'",
          ],
          activeLines: [1, 2],
          state: [
            { name: "entrypoint", value: "logscan.cli:main", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "[project.scripts] generates a runnable logscan command inside .venv wired to main().",
            nodes: [
              { id: "sc", label: "logscan CLI", sublabel: "terminal command" },
              { id: "fn", label: "logscan.cli:main", sublabel: "invokes entrypoint", active: true, tone: "ok" },
            ],
            links: [{ from: "sc", to: "fn", active: true }],
          },
        },
        {
          title: "CI enforces lint, strict types, and pytest",
          tag: "TRACE",
          explanation: ["Running `ruff`, `mypy --strict`, and `pytest` on every push blocks regressions before merge."],
          code: [
            "# uv run ruff check src tests",
            "# uv run mypy src",
            "# uv run pytest --cov=logscan",
          ],
          activeLines: [1, 2, 3],
          state: [
            { name: "CI status", value: "ruff + mypy + pytest", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Automated CI gates run fast lint and static types before executing the pytest suite.",
            nodes: [
              { id: "r", label: "ruff check", sublabel: "lint & style", tone: "ok" },
              { id: "m", label: "mypy --strict", sublabel: "static types", tone: "ok" },
              { id: "p", label: "pytest --cov", sublabel: "behavior & coverage", active: true, tone: "accent" },
            ],
            links: [
              { from: "r", to: "m", active: true },
              { from: "m", to: "p", active: true },
            ],
          },
        },
        {
          title: "Match dev section to installer (`pip` vs `uv`)",
          tag: "PITFALL",
          explanation: ["`pip install -e '.[dev]'` reads `[project.optional-dependencies]`, while `uv sync` reads `[dependency-groups]`."],
          code: [
            "# pip -e .[dev] -> [project.optional-dependencies]",
            "# uv sync       -> [dependency-groups]",
          ],
          activeLines: [1, 2],
          state: [
            { name: "table match", value: "verified", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Match dev dependency tables in pyproject.toml to the installer tool running locally or in CI.",
            nodes: [
              { id: "pip", label: "pip install -e '.[dev]'", sublabel: "[project.optional-dependencies]", tone: "accent" },
              { id: "uv", label: "uv sync", sublabel: "[dependency-groups]", active: true, tone: "ok" },
            ],
            links: [{ from: "pip", to: "uv", label: "pyproject tables" }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Using `pip install -e '.[dev]'` when dev deps live only in `[dependency-groups]`",
        detail: "Older `pip` ignores PEP 735 `[dependency-groups]`; use `[project.optional-dependencies]` for `'.[dev]'` or `uv sync` / `pip >= 25.1 --group dev`.",
      },
      {
        title: "Missing `__init__.py` or mismatched package name",
        detail: "Keep folder names (`src/budget_cli/`) aligned with `[project.scripts]` targets (`budget_cli.main:run`).",
      },
    ],
    predictChecks: [
      {
        prompt: "What does `logscan = 'logscan.cli:main'` under `[project.scripts]` create when installed?",
        code: "[project.scripts]\nlogscan = 'logscan.cli:main'",
        options: [
          { id: "a", label: "Creates a terminal command `logscan` in `.venv` calling `main()` in `logscan/cli.py`" },
          { id: "b", label: "Renames `cli.py`" },
          { id: "c", label: "Runs `main()` on import" },
        ],
        correctId: "a",
        explanation: "Console script entries map a CLI executable name to `module.path:callable`.",
      },
      {
        prompt: "Why place packages under `src/logscan/` instead of root `logscan/`?",
        code: "repo/\n    pyproject.toml\n    src/logscan/__init__.py\n    tests/test_cli.py",
        options: [
          { id: "a", label: "Forces `pytest` to import the installed package rather than uninstalled repo folders" },
          { id: "b", label: "Python requires folders named `src`" },
          { id: "c", label: "`ruff` skips root folders" },
        ],
        correctId: "a",
        explanation: "`src/` catches broken packaging metadata during local tests before publishing.",
      },
    ],
    practiceTask: {
      title: "Warmup: Validate `[project.scripts]` and `[dependency-groups]` in TOML",
      tier: "Warmup",
      goal: "Write `inspect_manifest(toml_text)` returning `(name, scripts_dict, dev_count)` using `tomllib.loads`.",
      constraints: ["Handle both `[dependency-groups]` and `[project.optional-dependencies]`"],
      examples: [
        { input: "logscan TOML with dev=[pytest, ruff]", output: "('logscan', {'logscan': 'logscan.cli:main'}, 2)" },
        { input: "minimal TOML with name='tiny'", output: "('tiny', {}, 0)" },
      ],
      tasks: [
        "Read `project.name`, `project.scripts`, and `len(dev)`.",
      ],
      starterCode: "# Exercise M12.6 Warmup: inspect pyproject.toml manifest\nimport tomllib\n\ndef inspect_manifest(toml_text: str) -> tuple[str, dict[str, str], int]:\n    return ('', {}, 0)\n",
      expectedOutput: "('logscan', {'logscan': 'logscan.cli:main'}, 2)\n('tiny', {}, 0)",
      hint: "Fallback `data.get('dependency-groups', {}).get('dev') or data.get('project', {}).get('optional-dependencies', {}).get('dev', [])`.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "import tomllib\n\ndef inspect_manifest(toml_text: str) -> tuple[str, dict[str, str], int]:\n    data = tomllib.loads(toml_text)\n    proj = data.get('project', {})\n    dev = data.get('dependency-groups', {}).get('dev') or proj.get('optional-dependencies', {}).get('dev', [])\n    return (proj.get('name', ''), dict(proj.get('scripts', {})), len(dev))\n\nprint(inspect_manifest(\"[project]\\nname='logscan'\\n[project.scripts]\\nlogscan='logscan.cli:main'\\n[dependency-groups]\\ndev=['pytest','ruff']\"))\nprint(inspect_manifest(\"[project]\\nname='tiny'\"))",
    },
    practiceChallenges: [
      {
        title: "Core: Verify valid `src/<pkg>/` layout paths",
        tier: "Core",
        goal: "Write `has_src_layout(paths, pkg)` checking whether `f'src/{pkg}/__init__.py'` and `'pyproject.toml'` exist while root `f'{pkg}/__init__.py'` is absent.",
        constraints: ["Normalize backslash separators"],
        examples: [
          { input: "['pyproject.toml', 'src/logscan/__init__.py'], 'logscan'", output: "True" },
          { input: "['pyproject.toml', 'logscan/__init__.py'], 'logscan'", output: "False" },
        ],
        tasks: [
          "Normalize paths with `.replace('\\\\', '/')` and check presence rules.",
        ],
        starterCode: "# Exercise M12.6 Core: validate src/ layout tree\ndef has_src_layout(paths: list[str], pkg: str) -> bool:\n    return False\n",
        expectedOutput: "True\nFalse",
        hint: "Convert `paths` to a normalized `set[str]` first.",
        complexity: { time: "O(n)", space: "O(n)" },
        solutionCode:
          "def has_src_layout(paths: list[str], pkg: str) -> bool:\n    norm = {p.replace('\\\\', '/') for p in paths}\n    return 'pyproject.toml' in norm and f'src/{pkg}/__init__.py' in norm and f'{pkg}/__init__.py' not in norm\n\nprint(has_src_layout(['pyproject.toml', 'src/logscan/__init__.py'], 'logscan'))\nprint(has_src_layout(['pyproject.toml', 'logscan/__init__.py'], 'logscan'))",
      },
      {
        title: "Stretch: Build ordered CI gate commands",
        tier: "Stretch",
        goal: "Write `ci_steps(pkg, use_uv=True)` returning the 4 ordered commands (`ruff check`, `ruff format --check`, `mypy --strict`, `pytest --cov`) prefixed with `'uv run'` or `'python -m'`.",
        constraints: ["Target `src` and `tests` consistently"],
        examples: [
          { input: "'logscan', use_uv=True", output: "['uv run ruff check src tests', 'uv run ruff format --check src tests', 'uv run mypy --strict src', 'uv run pytest --cov=logscan']" },
          { input: "'logscan', use_uv=False", output: "['python -m ruff check src tests', 'python -m ruff format --check src tests', 'python -m mypy --strict src', 'python -m pytest --cov=logscan']" },
        ],
        tasks: [
          "Build prefix once (`'uv run'` vs `'python -m'`).",
        ],
        starterCode: "# Exercise M12.6 Stretch: generate CI command list\ndef ci_steps(pkg: str, use_uv: bool = True) -> list[str]:\n    return []\n",
        expectedOutput: "['uv run ruff check src tests', 'uv run ruff format --check src tests', 'uv run mypy --strict src', 'uv run pytest --cov=logscan']\n['python -m ruff check src tests', 'python -m ruff format --check src tests', 'python -m mypy --strict src', 'python -m pytest --cov=logscan']",
        hint: "Construct `[f'{pre} ...' for ...]` with `pre = 'uv run' if use_uv else 'python -m'`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "def ci_steps(pkg: str, use_uv: bool = True) -> list[str]:\n    pre = 'uv run' if use_uv else 'python -m'\n    return [\n        f'{pre} ruff check src tests',\n        f'{pre} ruff format --check src tests',\n        f'{pre} mypy --strict src',\n        f'{pre} pytest --cov={pkg}',\n    ]\n\nprint(ci_steps('logscan', True))\nprint(ci_steps('logscan', False))",
      },
    ],
  },

  "py-capstone-log-analyzer": {
    lessonId: "py-capstone-log-analyzer",
    subtitle: "Synthesize `Literal`, `@dataclass(slots=True, frozen=True)`, regex, custom exceptions, `yield` generators, `logging`, and `argparse` in `src/logscan/`.",
    intro: {
      heading: "Assemble immutable data, streaming parser, and CLI layers",
      explanation: [
        "Calling `path.read_text().splitlines()` on a 5 GB production log loads the entire file into RAM until the process crashes with out-of-memory errors, and mixing regex parsing with CLI flags in one function makes error paths hard to test.",
        "This capstone separates `src/logscan/` into `models.py` (frozen slotted `LogEvent`), `parser.py` (pre-compiled `_LINE_RE.fullmatch` streaming events piece by piece via `yield` in `O(1)` memory), and `cli.py` (`argparse`, `logging`, JSON report, and explicit exit codes).",
      ],
      analogy: "An airport conveyor belt scans and tallies one bag at a time instead of piling every suitcase from every flight into the lobby before counting.",
      realWorldUses: [
        "Scanning multi-GB log streams in O(1) memory while writing concise JSON reports",
        "Testing parsers and CLI error exit codes deterministically without shell flakiness",
      ],
    },
    sections: [
      {
        heading: "Layered `src/logscan/` architecture (`models -> parser -> cli`)",
        paragraphs: [
          "`models.py` declares `LogLevel = Literal['INFO', 'WARN', 'ERROR']`, frozen slotted `LogEvent`, `LogFormatError`, and `parse_level`. `parser.py` compiles `_LINE_RE` once, streams rows via `yield`, and aggregates any `Iterable[LogEvent]`.",
          "`cli.py` configures `logging`, parses flags, writes JSON output, and catches `LogFormatError` to log the error and return exit code `1`.",
        ],
        code: [
          "from collections import Counter",
          "from dataclasses import dataclass",
          "import re",
          "",
          "class LogFormatError(Exception): pass",
          "",
          "@dataclass(slots=True, frozen=True)",
          "class LogEvent:",
          "    level: str",
          "    code: int",
          "    message: str",
          "",
          "_RE = re.compile(r\"^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$\")",
          "m = _RE.fullmatch(\"[ERROR] code=503 Upstream timeout\")",
          "print(LogEvent(m.group(\"level\"), int(m.group(\"code\")), m.group(\"msg\")))",
        ],
        output: "LogEvent(level='ERROR', code=503, message='Upstream timeout')",
        visual: {
          kind: "pipeline",
          caption: "logscan data flow from CLI flags through streaming parser to JSON and logs",
          nodes: [
            { id: "cli", label: "CLI args", sublabel: "argparse --min-level --out", tone: "muted" },
            { id: "parser", label: "Stream parser", sublabel: "yield LogEvent (O(1) RAM)", tone: "accent", active: true },
            { id: "agg", label: "Aggregator", sublabel: "Iterable[LogEvent] -> Counter", tone: "ok" },
            { id: "out", label: "JSON / Logs", sublabel: "out.json + logging", tone: "ok" },
          ],
          links: [
            { from: "cli", to: "parser", label: "source Path" },
            { from: "parser", to: "agg", label: "lazy yield", active: true },
            { from: "agg", to: "out", label: "report + status" },
          ],
        },
        table: {
          caption: "`logscan` package modules",
          headers: ["File", "Responsibility", "Key exports"],
          rows: [
            ["`models.py`", "Domain model & exception", "`LogLevel`, `LogEvent`, `LogFormatError`"],
            ["`parser.py`", "Lazy regex line parser & counter", "`iter_events(path)`, `summarize_levels`"],
            ["`cli.py`", "`argparse` + `logging` + JSON write", "`build_parser()`, `main(argv)`"],
            ["`tests/test_logscan.py`", "Isolated tests (`tmp_path`, `caplog`)", "Happy-path JSON + exit-code `1` checks"],
          ],
        },
      },
      {
        heading: "Interactive regex trace for `_LINE_RE`",
        paragraphs: [
          "Pre-compiling `_LINE_RE` avoids recompiling patterns millions of times on large files while `.fullmatch()` rejects partially valid lines with exact line numbers.",
        ],
        visual: {
          kind: "regex-lab",
          caption: "Inspect how _LINE_RE matches valid log lines vs rejects malformed rows",
          presets: [
            {
              label: "Valid ERROR line",
              mode: "fullmatch",
              pattern: "^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$",
              text: "[ERROR] code=503 Upstream timeout",
              matches: [
                {
                  start: 0,
                  end: 33,
                  groups: { level: "ERROR", code: "503", msg: "Upstream timeout" },
                },
              ],
              resultText: "LogEvent(level='ERROR', code=503, message='Upstream timeout')",
              note: "Named groups extract level, status code, and message in one pass.",
            },
            {
              label: "Malformed line",
              mode: "fullmatch",
              pattern: "^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$",
              text: "2026-11-25 corrupt row",
              matches: [],
              resultText: "None -> raises LogFormatError('Line 1: invalid format')",
              note: "fullmatch requires the whole stripped line to conform; invalid rows raise line-numbered errors.",
            },
          ],
        },
      },
      {
        heading: "Bug vs fix: loading whole logs into RAM vs streaming with `yield`",
        paragraphs: [
          "Reading every line into a `list` buffers gigabytes in memory, and calling `re.search` inside `for line in ...` recompiles the pattern repeatedly while ignoring trailing junk.",
          "Compile `_LINE_RE` once at module scope, match the full line with `.fullmatch()`, and `yield` one `LogEvent` per line.",
        ],
        code: [
          "# BUG: loads full file into RAM, recompiles regex per line, skips trailing garbage",
          "events = [re.search(r\"code=(\\d+)\", ln) for ln in path.read_text().splitlines()]",
          "",
          "# FIX: O(1) RAM generator with pre-compiled fullmatch and line-numbered error",
          "def iter_events(path: Path) -> Iterator[LogEvent]:",
          "    with path.open(\"r\", encoding=\"utf-8\") as f:",
          "        for lineno, raw in enumerate(f, start=1):",
          "            text = raw.strip()",
          "            if not text: continue",
          "            m = _LINE_RE.fullmatch(text)",
          "            if not m: raise LogFormatError(f\"Line {lineno}: invalid format\")",
          "            yield LogEvent(m.group(\"level\"), int(m.group(\"code\")), m.group(\"msg\"))",
        ],
      },
      {
        heading: "Answering Senior Python Interview Questions & Follow-Ups",
        paragraphs: [
          "Senior backend interviews rarely stop after your parser passes on a 20-line fixture. Interviewers immediately scale the scenario to a 50 GB log file, ask how you fetch 1,000 remote log files over HTTP versus running CPU-heavy regex parsing across cores, test how you isolate clock or network calls from production APIs, and probe per-record RAM overhead.",
          "Structure each answer in three beats: state the runtime bottleneck (memory, the GIL, network wait, or shared state), name the Python primitive (`yield`, `asyncio`/`ThreadPoolExecutor` vs `ProcessPoolExecutor`, DI with `monkeypatch`/`autospec=True`, or `@dataclass(slots=True, frozen=True)`), and add one trade-off.",
        ],
        callout: {
          kind: "KEY IDEA",
          text: "How to state architecture trade-offs in an interview: name the constraint first (50 GB RAM limit, GIL serialization on CPU work, or unmocked I/O), pair it with the matching Python primitive, and mention the boundary trade-off.",
        },
        table: {
          caption: "Senior Python backend interview questions and follow-ups",
          headers: ["Interview question", "Core Python solution", "How to state this clearly in an interview", "Follow-up & trade-off"],
          rows: [
            [
              "How do you handle a 50GB log file without OOM?",
              "`yield` streaming generator (`iter_events`)",
              "I stream line by line with `yield` so working RAM stays `O(1)` regardless of file size, and an early `break` stops disk reads immediately.",
              "Generators are single-pass; materialize with `list()` or `itertools.tee` only when callers need random indexing.",
            ],
            [
              "How would you speed up 1,000 log files over HTTP vs CPU regex parsing?",
              "`asyncio` or `ThreadPoolExecutor` for HTTP; `ProcessPoolExecutor` for CPU regex",
              "Because the GIL lets one thread run Python bytecode at a time, I use `asyncio` or threads while sockets wait on HTTP, and `ProcessPoolExecutor` when CPU regex parsing dominates.",
              "Processes add IPC pickling overhead, so pass file paths or large line chunks to workers rather than single lines.",
            ],
            [
              "How do you test time or network logic without hitting production APIs?",
              "Dependency injection + `monkeypatch` / `patch(..., autospec=True)`",
              "I inject clocks or HTTP clients as `Callable` or `Protocol` parameters so tests pass deterministic fakes, and when patching an import I pass `autospec=True` so bad signatures still raise `TypeError`.",
              "Keep test fakes synchronized with the real client contract so parameter drift fails in unit tests.",
            ],
            [
              "How do you cut RAM per parsed event record when batching?",
              "`@dataclass(slots=True, frozen=True)`",
              "Adding `slots=True` drops the per-instance `__dict__`, shrinking memory per `LogEvent`, while `frozen=True` prevents accidental mutation across pipeline stages.",
              "Slotted classes forbid attaching dynamic attributes at runtime; declare every field upfront.",
            ],
          ],
        },
      },
    ],
    guidedBuildUp: {
      title: "Assemble `models -> parser -> cli` step by step",
      subtitle: "Build the immutable data model, the `O(1)` streaming parser, and the exit-code CLI boundary.",
      steps: [
        {
          label: "Step 1: Define LogEvent and LogFormatError in models.py",
          explanation: "Use `@dataclass(slots=True, frozen=True)` for compact, read-only events and a dedicated exception for bad lines.",
          code: [
            "from dataclasses import dataclass",
            "from typing import Literal",
            "LogLevel = Literal[\"INFO\", \"WARN\", \"ERROR\"]",
            "class LogFormatError(Exception): pass",
            "@dataclass(slots=True, frozen=True)",
            "class LogEvent:",
            "    level: LogLevel",
            "    code: int",
            "    message: str",
          ],
          activeLines: [4, 5, 6],
        },
        {
          label: "Step 2: Stream lines lazily with _LINE_RE.fullmatch and yield",
          explanation: "Pre-compile `_LINE_RE` once, skip blank lines, raise `LogFormatError` on mismatch, and `yield` one `LogEvent` at a time.",
          code: [
            "import re",
            "from collections.abc import Iterator",
            "_LINE_RE = re.compile(r\"^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$\")",
            "def parse_lines(lines: Iterator[str]) -> Iterator[LogEvent]:",
            "    for lineno, raw in enumerate(lines, start=1):",
            "        text = raw.strip()",
            "        if not text: continue",
            "        m = _LINE_RE.fullmatch(text)",
            "        if not m: raise LogFormatError(f\"Line {lineno}: invalid format\")",
            "        yield LogEvent(m.group(\"level\"), int(m.group(\"code\")), m.group(\"msg\"))",
          ],
          activeLines: [3, 8, 9, 10],
        },
        {
          label: "Step 3: Aggregate Iterable[LogEvent] and return CLI exit codes",
          explanation: "Keep `summarize_levels` pure over any `Iterable[LogEvent]`, and catch `LogFormatError` at the CLI boundary to return `1`.",
          code: [
            "from collections import Counter",
            "from collections.abc import Iterable",
            "LEVEL_RANK = {\"INFO\": 1, \"WARN\": 2, \"ERROR\": 3}",
            "def summarize_levels(events: Iterable[LogEvent], min_level: str = \"INFO\") -> dict[str, int]:",
            "    thresh = LEVEL_RANK[min_level]",
            "    return dict(Counter(ev.level for ev in events if LEVEL_RANK[ev.level] >= thresh))",
            "def run_stream(lines: Iterable[str]) -> int:",
            "    try:",
            "        print(summarize_levels(parse_lines(iter(lines)), \"WARN\"))",
            "        return 0",
            "    except LogFormatError:",
            "        return 1",
          ],
          activeLines: [4, 6, 10, 12],
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "Trace `models -> parser -> cli` streaming execution",
      steps: [
        {
          title: "`iter_events` skips blank lines and streams `LogEvent` via `yield`",
          tag: "TRACE",
          explanation: ["Reading line-by-line yields one frozen slotted `LogEvent` at a time so huge log files stay O(1) memory."],
          code: [
            "for lineno, raw in enumerate(f, start=1):",
            "    text = raw.strip()",
            "    if not text: continue",
            "    m = _LINE_RE.fullmatch(text)",
            "    yield LogEvent(m.group('level'), int(m.group('code')), m.group('msg'))",
          ],
          activeLines: [1, 4, 5],
          state: [
            { name: "RAM usage", value: "O(1) per line", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Streaming line-by-line yields one LogEvent at a time with constant O(1) memory.",
            nodes: [
              { id: "ln", label: "enumerate(f, start=1)", sublabel: "1 raw line" },
              { id: "rx", label: "_LINE_RE.fullmatch", sublabel: "parse & validate", active: true, tone: "accent" },
              { id: "ev", label: "yield LogEvent(...)", sublabel: "O(1) stream item", tone: "ok" },
            ],
            links: [
              { from: "ln", to: "rx", active: true },
              { from: "rx", to: "ev", active: true },
            ],
          },
        },
        {
          title: "Malformed non-empty lines raise `LogFormatError` with line number",
          tag: "CHECK",
          explanation: ["`if not m: raise LogFormatError(f'Line {lineno}: invalid format')` pinpoints exact bad rows immediately."],
          code: [
            "if not m:",
            "    raise LogFormatError(f'Line {lineno}: invalid format')",
          ],
          activeLines: [1, 2],
          state: [
            { name: "line 4 error", value: "LogFormatError('Line 4: ...')", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Unmatched non-empty lines raise LogFormatError tagged with the exact 1-based line number.",
            nodes: [
              { id: "ln", label: "Line 4 raw text", sublabel: "regex mismatch", tone: "warm" },
              { id: "err", label: "LogFormatError", sublabel: "'Line 4: invalid format'", active: true, tone: "accent" },
            ],
            links: [{ from: "ln", to: "err", label: "raise", active: true }],
          },
        },
        {
          title: "`summarize_levels` filters any `Iterable[LogEvent]`",
          tag: "PATTERN",
          explanation: ["Accepting `Iterable[LogEvent]` lets production pass `iter_events(path)` while unit tests pass plain tuples in memory."],
          code: [
            "def summarize_levels(events, min_level='INFO'):",
            "    thresh = LEVEL_RANK[min_level]",
            "    return dict(Counter(e.level for e in events if LEVEL_RANK[e.level] >= thresh))",
          ],
          activeLines: [1, 2, 3],
          state: [
            { name: "min_level='WARN'", value: "keeps WARN + ERROR", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Accepting Iterable[LogEvent] works with both file streams and small in-memory test tuples.",
            nodes: [
              { id: "src", label: "iter_events(file) or test tuple", sublabel: "Iterable[LogEvent]" },
              { id: "flt", label: "rank >= LEVEL_RANK[min_level]", sublabel: "filter", active: true, tone: "accent" },
              { id: "cnt", label: "dict(Counter(...))", sublabel: "{'WARN': ..., 'ERROR': ...}", tone: "ok" },
            ],
            links: [
              { from: "src", to: "flt", active: true },
              { from: "flt", to: "cnt", active: true },
            ],
          },
        },
        {
          title: "`cli.main` catches domain error returns exit code `1`",
          tag: "CONCEPT",
          explanation: ["`cli.py` isolates terminal I/O and returns `0` on success or `1` after logging `LogFormatError`."],
          code: [
            "try: write_summary(...)",
            "except LogFormatError as err:",
            "    logger.error('%s', err); return 1",
          ],
          activeLines: [2, 3],
          state: [
            { name: "exit code", value: "1 (logged error + status)", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "CLI boundary catches LogFormatError, logs the message, and returns exit status 1.",
            nodes: [
              { id: "try", label: "write_summary(...)", sublabel: "core logic", tone: "warm" },
              { id: "exc", label: "except LogFormatError", sublabel: "logger.error", active: true, tone: "accent" },
              { id: "ret", label: "return 1", sublabel: "explicit exit code", tone: "ok" },
            ],
            links: [
              { from: "try", to: "exc", label: "error", active: true },
              { from: "exc", to: "ret", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Calling `re.search` vs `re.fullmatch` inside `iter_events`",
        detail: "`fullmatch` guarantees the entire line matches the log grammar, catching trailing garbage.",
      },
      {
        title: "Tying aggregation tightly to `Path` instead of `Iterable[LogEvent]`",
        detail: "Accepting an `Iterable` makes aggregation pure and trivially testable in memory.",
      },
    ],
    predictChecks: [
      {
        prompt: "Why does `iter_events(path)` `yield LogEvent(...)` instead of returning `list[LogEvent]`?",
        code: "for ev in iter_events(Path('server.log')):\n    if ev.level == 'ERROR': break",
        options: [
          { id: "a", label: "Streams rows in `O(1)` memory and stops file reading on early `break`" },
          { id: "b", label: "`with path.open()` forbids returning lists" },
          { id: "c", label: "Avoids closing the file" },
        ],
        correctId: "a",
        explanation: "Generators keep memory flat on multi-GB logs and short-circuit on `break`. How to state this clearly in an interview: 'Streaming with `yield` keeps working memory `O(1)` at 50GB and lets callers stop early without buffering the file.'",
      },
      {
        prompt: "Why separate `summarize_levels(events)` from file/JSON writing?",
        code: "counts = summarize_levels(events)",
        options: [
          { id: "a", label: "Pure aggregation tests in memory without disk I/O" },
          { id: "b", label: "`Counter` cannot serialize to JSON" },
          { id: "c", label: "`Path.write_text` requires async" },
        ],
        correctId: "a",
        explanation: "Decoupling pure transforms from I/O keeps tests concise and deterministic. How to state this clearly in an interview: 'Accepting `Iterable[LogEvent]` keeps aggregation pure so unit tests pass in-memory tuples while production streams a file generator.'",
      },
    ],
    practiceTask: {
      title: "Warmup: Streaming `iter_events` regex parser",
      tier: "Warmup",
      goal: "Write `parse_line(lineno, raw)` returning `None` on blank strings, `LogEvent` on valid `'[LEVEL] code=N msg'`, or raising `LogFormatError(f'Line {lineno}: invalid format')`.",
      constraints: ["Pre-compile `_LINE_RE` at module level using `.fullmatch(...)`"],
      examples: [
        { input: "1, '  [INFO] code=200 ok '", output: "LogEvent(level='INFO', code=200, message='ok')" },
        { input: "2, 'bad row'", output: "Line 2: invalid format" },
      ],
      tasks: [
        "Compile `_LINE_RE` once and handle blank lines before matching.",
      ],
      starterCode: "# Exercise M12.7 Warmup: compiled regex log line parser\nfrom dataclasses import dataclass\nimport re\n\nclass LogFormatError(Exception): pass\n\n@dataclass(slots=True, frozen=True)\nclass LogEvent:\n    level: str\n    code: int\n    message: str\n\ndef parse_line(lineno: int, raw: str):\n    return None\n",
      expectedOutput: "LogEvent(level='INFO', code=200, message='ok')\nLine 2: invalid format",
      hint: "Strip `raw` first; if empty return `None`, else match `_LINE_RE.fullmatch(text)`. How to state this clearly in an interview: 'Pre-compiling `_LINE_RE` at module scope avoids regex recompilation per line, and `.fullmatch` rejects trailing junk with an exact line number.'",
      complexity: { time: "O(k)", space: "O(k)" },
      solutionCode:
        "from dataclasses import dataclass\nimport re\n\nclass LogFormatError(Exception): pass\n\n@dataclass(slots=True, frozen=True)\nclass LogEvent:\n    level: str\n    code: int\n    message: str\n\n_LINE_RE = re.compile(r\"^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$\")\n\ndef parse_line(lineno: int, raw: str):\n    text = raw.strip()\n    if not text:\n        return None\n    m = _LINE_RE.fullmatch(text)\n    if not m:\n        raise LogFormatError(f'Line {lineno}: invalid format')\n    return LogEvent(m.group('level'), int(m.group('code')), m.group('msg'))\n\nprint(parse_line(1, '  [INFO] code=200 ok '))\ntry:\n    parse_line(2, 'bad row')\nexcept LogFormatError as e:\n    print(e)",
    },
    practiceChallenges: [
      {
        title: "Core: Pure `summarize_levels` severity filter",
        tier: "Core",
        goal: "Write `summarize_levels(events, min_level='INFO')` counting occurrences where `LEVEL_RANK[ev.level] >= LEVEL_RANK[min_level]` into sorted `(level, count)` pairs.",
        constraints: ["Accept any `Iterable` stream, not only `list`"],
        examples: [
          { input: "(INFO, WARN, ERROR), min_level='WARN'", output: "[('ERROR', 1), ('WARN', 1)]" },
          { input: "empty stream", output: "[]" },
        ],
        tasks: [
          "Count with `Counter` and return `sorted(counts.items())`.",
        ],
        starterCode: "# Exercise M12.7 Core: pure Iterable severity aggregator\nfrom collections import Counter\n\nLEVEL_RANK = {'INFO': 1, 'WARN': 2, 'ERROR': 3}\n\ndef summarize_levels(events, min_level: str = 'INFO') -> list[tuple[str, int]]:\n    return []\n",
        expectedOutput: "[('ERROR', 1), ('WARN', 1)]\n[]",
        hint: "Filter with `LEVEL_RANK[ev.level] >= LEVEL_RANK[min_level]` inside `Counter(...)`. How to state this clearly in an interview: 'Typing the input as `Iterable[LogEvent]` lets the aggregator consume lazy `yield` generators in production and plain tuples in unit tests.'",
        complexity: { time: "O(n)", space: "O(1)" },
        solutionCode:
          "from collections import Counter\nfrom dataclasses import dataclass\n\nLEVEL_RANK = {'INFO': 1, 'WARN': 2, 'ERROR': 3}\n\n@dataclass(slots=True, frozen=True)\nclass Ev:\n    level: str\n\ndef summarize_levels(events, min_level: str = 'INFO') -> list[tuple[str, int]]:\n    thresh = LEVEL_RANK[min_level]\n    return sorted(Counter(ev.level for ev in events if LEVEL_RANK[ev.level] >= thresh).items())\n\nprint(summarize_levels([Ev('INFO'), Ev('WARN'), Ev('ERROR')], min_level='WARN'))\nprint(summarize_levels([], min_level='INFO'))",
      },
      {
        title: "Stretch: End-to-end `iter_events -> JSON -> exit code` in temp folder",
        tier: "Stretch",
        goal: "Run full `main_summary(log_text, min_level)` inside `TemporaryDirectory`: parse `app.log`, write `out.json`, return `(0, counts)` on valid input or `(1, {})` when `LogFormatError` occurs.",
        constraints: ["Keep temp file cleanup inside `TemporaryDirectory`"],
        examples: [
          { input: "'[INFO] code=200 ok\\n[ERROR] code=500 fail', 'WARN'", output: "(0, {'ERROR': 1})" },
          { input: "'corrupt row', 'INFO'", output: "(1, {})" },
        ],
        tasks: [
          "Chain streaming `iter_events`, `summarize_levels`, JSON serialization, and `LogFormatError` exit code `1`.",
        ],
        starterCode: "# Exercise M12.7 Stretch: end-to-end capstone runner\nfrom collections import Counter\nimport json\nfrom pathlib import Path\nimport re\nimport tempfile\n\nclass LogFormatError(Exception): pass\n\ndef main_summary(log_text: str, min_level: str = 'INFO') -> tuple[int, dict[str, int]]:\n    return (1, {})\n",
        expectedOutput: "(0, {'ERROR': 1})\n(1, {})",
        hint: "Catch `LogFormatError` to return `(1, {})`; on valid files write `json.dumps(counts)` and read it back via `json.loads`. How to state this clearly in an interview: 'Translating `LogFormatError` into exit code `1` at the CLI boundary keeps parser modules reusable without `sys.exit` calls.'",
        complexity: { time: "O(n)", space: "O(1) stream" },
        solutionCode:
          "from collections import Counter\nimport json\nfrom pathlib import Path\nimport re\nimport tempfile\n\nclass LogFormatError(Exception): pass\n\n_RE = re.compile(r\"^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$\")\n_RANK = {'INFO': 1, 'WARN': 2, 'ERROR': 3}\n\ndef main_summary(log_text: str, min_level: str = 'INFO') -> tuple[int, dict[str, int]]:\n    with tempfile.TemporaryDirectory() as tmp:\n        src = Path(tmp) / 'app.log'\n        out = Path(tmp) / 'out.json'\n        src.write_text(log_text, encoding='utf-8')\n        try:\n            events = []\n            with src.open('r', encoding='utf-8') as f:\n                for n, raw in enumerate(f, start=1):\n                    t = raw.strip()\n                    if not t:\n                        continue\n                    m = _RE.fullmatch(t)\n                    if not m:\n                        raise LogFormatError(f'Line {n}: bad')\n                    events.append(m.group('level'))\n            counts = dict(Counter(lv for lv in events if _RANK[lv] >= _RANK[min_level]))\n            out.write_text(json.dumps(counts), encoding='utf-8')\n            return (0, json.loads(out.read_text(encoding='utf-8')))\n        except LogFormatError:\n            return (1, {})\n\nprint(main_summary('[INFO] code=200 ok\\n[ERROR] code=500 fail', 'WARN'))\nprint(main_summary('corrupt row', 'INFO'))",
      },
    ],
  },
};

export const m12Quiz: ModuleQuiz = {
  moduleId: "py-m12",
  title: "Module 12 Quiz: Production Tooling & Capstone",
  description: "Verify logging, argparse CLIs, generics and ParamSpec, ruff and mypy, mocking isolation, src packaging, and capstone architecture.",
  questions: [
    {
      id: "m12-q1",
      prompt: "Why prefer `logger.debug('User %s took %d ms', uid, ms)` over `logger.debug(f'User {uid} took {ms} ms')`?",
      options: [
        { id: "a", label: "F-strings raise `SyntaxError` in logging" },
        { id: "b", label: "`%s` writes logs directly to disk" },
        { id: "c", label: "Avoids formatting strings whenever `DEBUG` logging is disabled" },
        { id: "d", label: "`logging` rejects strings without `%s`" },
      ],
      correctId: "c",
      explanation: "Lazy formatting avoids unnecessary work when log levels are filtered out.",
      lessonRefId: "py-logging-structured",
    },
    {
      id: "m12-q2",
      prompt: "Inside `except OSError:`, which call records both a message and the full exception traceback?",
      options: [
        { id: "a", label: "`logger.exception('Failed reading config')`" },
        { id: "b", label: "`logger.info('Failed reading config')`" },
        { id: "c", label: "`print('Failed reading config')`" },
        { id: "d", label: "`logging.basicConfig()`" },
      ],
      correctId: "a",
      explanation: "`logger.exception(...)` logs at `ERROR` level together with traceback info.",
      lessonRefId: "py-logging-structured",
    },
    {
      id: "m12-q3",
      prompt: "Why accept `argv=None` in `def main(argv: Sequence[str] | None = None) -> int:`?",
      options: [
        { id: "a", label: "`argparse` fails without `argv=None`" },
        { id: "b", label: "Disables `--help` text" },
        { id: "c", label: "Converts strings to ints automatically" },
        { id: "d", label: "Tests pass argument lists directly while `None` defaults to `sys.argv`" },
      ],
      correctId: "d",
      explanation: "Explicit `argv` keeps CLI unit testing fast without touching `sys.argv`.",
      lessonRefId: "py-argparse-cli",
    },
    {
      id: "m12-q4",
      prompt: "What happens if an `argparse` flag uses `action='store_true'` (`--json`) and is omitted?",
      options: [
        { id: "a", label: "`args.json` is `None`" },
        { id: "b", label: "`args.json` defaults to `False`" },
        { id: "c", label: "Raises `SystemExit(2)`" },
        { id: "d", label: "`args.json` becomes `''`" },
      ],
      correctId: "b",
      explanation: "`store_true` stores `False` when omitted and `True` when present.",
      lessonRefId: "py-argparse-cli",
    },
    {
      id: "m12-q5",
      prompt: "Given `def pick_last[T](items: Sequence[T]) -> T:`, what type does `mypy` infer for `pick_last([10, 20])`?",
      options: [
        { id: "a", label: "`list[int]`" },
        { id: "b", label: "`Any`" },
        { id: "c", label: "`int`" },
        { id: "d", label: "`str`" },
      ],
      correctId: "c",
      explanation: "`items` binds `T = int`, so `pick_last` returns `int`.",
      lessonRefId: "py-generics-callable",
    },
    {
      id: "m12-q6",
      prompt: "Why prefer `Sequence[Animal]` instead of `list[Animal]` for read-only sequence parameters?",
      options: [
        { id: "a", label: "`list` cannot hold classes" },
        { id: "b", label: "`Sequence` drops type checks" },
        { id: "c", label: "`list` forbids iteration" },
        { id: "d", label: "`list` is invariant so `list[Dog]` is rejected, whereas `Sequence` is covariant" },
      ],
      correctId: "d",
      explanation: "Mutable containers are invariant; read-only `Sequence[Animal]` accepts `list[Dog]` and tuples.",
      lessonRefId: "py-generics-callable",
    },
    {
      id: "m12-q7",
      prompt: "Which tool runs unused-import lint checks and code formatting rapidly in one CLI?",
      options: [
        { id: "a", label: "`venv`" },
        { id: "b", label: "`ruff`" },
        { id: "c", label: "`pickle`" },
        { id: "d", label: "`csv`" },
      ],
      correctId: "b",
      explanation: "`ruff check` and `ruff format` handle linting and formatting fast alongside `mypy`.",
      lessonRefId: "py-ruff-mypy",
    },
    {
      id: "m12-q8",
      prompt: "`service.py` runs `from gateway import charge`. Why patch `'service.charge'` instead of `'gateway.charge'`?",
      options: [
        { id: "a", label: "`service` already bound its own local reference to the original function" },
        { id: "b", label: "`monkeypatch` cannot modify `gateway`" },
        { id: "c", label: "`from` imports ignore tests" },
        { id: "d", label: "`gateway.charge` is read-only" },
      ],
      correctId: "a",
      explanation: "Always patch names in the module namespace where execution looks them up.",
      lessonRefId: "py-mocking-testing",
    },
    {
      id: "m12-q9",
      prompt: "Why add `autospec=True` when using `unittest.mock.patch`?",
      options: [
        { id: "a", label: "Automatically calls the real API too" },
        { id: "b", label: "Prints stdout output" },
        { id: "c", label: "Enforces real parameter signatures so wrong call counts raise `TypeError`" },
        { id: "d", label: "Disables `side_effect`" },
      ],
      correctId: "c",
      explanation: "`autospec=True` prevents fake objects from silently accepting misspelled methods or bad arguments.",
      lessonRefId: "py-mocking-testing",
    },
    {
      id: "m12-q10",
      prompt: "Why store package code in `src/mypkg/` rather than repo root `mypkg/`?",
      options: [
        { id: "a", label: "Python blocks imports outside `src/`" },
        { id: "b", label: "Ensures `pytest` runs against the installed package instead of uncommitted root folders" },
        { id: "c", label: "`mypy` requires `src/`" },
        { id: "d", label: "`uv` deletes root files" },
      ],
      correctId: "b",
      explanation: "`src/` layout verifies package metadata and entrypoints accurately.",
      lessonRefId: "py-packaging-ci",
    },
    {
      id: "m12-q11",
      prompt: "In `iter_events`, why use `yield LogEvent(...)` rather than building `list[LogEvent]`?",
      options: [
        { id: "a", label: "Avoids regex compilation" },
        { id: "b", label: "Skips `Path.open`" },
        { id: "c", label: "Suppresses `LogFormatError`" },
        { id: "d", label: "Streams lines lazily in O(1) memory regardless of log file size" },
      ],
      correctId: "d",
      explanation: "Lazy generators keep RAM usage flat on huge files and stop reading early on `break`.",
      lessonRefId: "py-capstone-log-analyzer",
    },
    {
      id: "m12-q12",
      prompt: "Why accept any `Iterable[LogEvent]` in `summarize_levels` separate from CLI I/O?",
      options: [
        { id: "a", label: "Pure logic tests in memory while production streams lazily from files" },
        { id: "b", label: "`Counter` rejects file handles" },
        { id: "c", label: "`pytest` cannot test `argparse`" },
        { id: "d", label: "`json.dumps` only runs in `cli.py`" },
      ],
      correctId: "a",
      explanation: "Separating pure logic from CLI I/O makes unit tests fast and straightforward.",
      lessonRefId: "py-capstone-log-analyzer",
    },
  ],
};

export const m12PracticeSet: ModulePracticeSet = {
  moduleId: "py-m12",
  title: "Module 12 Mixed Production Tooling Practice",
  description: "Apply logging/config resolution, argparse subcommands, generic typing, mocking, and streaming capstone logic.",
  problems: [
    {
      id: "m12-p1",
      title: "Testable `argparse` CLI returning structured exit code",
      tier: "Warmup",
      patternHint: "Accept `argv: Sequence[str] | None = None` and validate `--threshold >= 0`.",
      lessonRefId: "py-argparse-cli",
      goal: "Write `run_threshold_cli(argv)` parsing `--min` (`int`, default `0`) and `--strict` (`action='store_true'`), returning `(2, '')` if `args.min < 0` else `(0, f'{args.min}:{args.strict}')`.",
      constraints: ["Support test `argv` calls directly without `sys.argv`"],
      examples: [
        { input: "['--min', '5', '--strict']", output: "(0, '5:True')" },
        { input: "['--min', '-1']", output: "(2, '')" },
      ],
      tasks: [
        "Build `ArgumentParser` with `--min` and `--strict`, guard `args.min < 0` returning `(2, '')`.",
      ],
      starterCode: "# Practice M12.1: testable argparse + exit code tuple\nimport argparse\nfrom collections.abc import Sequence\n\ndef run_threshold_cli(argv: Sequence[str] | None = None) -> tuple[int, str]:\n    return (2, '')\n",
      expectedOutput: "(0, '5:True')\n(2, '')",
      hint: "Return `(0, f'{args.min}:{args.strict}')` when non-negative.",
      complexity: { time: "O(k)", space: "O(k)" },
      solutionCode:
        "import argparse\nfrom collections.abc import Sequence\n\ndef run_threshold_cli(argv: Sequence[str] | None = None) -> tuple[int, str]:\n    p = argparse.ArgumentParser()\n    p.add_argument('--min', type=int, default=0)\n    p.add_argument('--strict', action='store_true')\n    args = p.parse_args(argv)\n    if args.min < 0:\n        return (2, '')\n    return (0, f'{args.min}:{args.strict}')\n\nprint(run_threshold_cli(['--min', '5', '--strict']))\nprint(run_threshold_cli(['--min', '-1']))",
    },
    {
      id: "m12-p2",
      title: "Generic batch mapper preserving `[T, U]`",
      tier: "Core",
      patternHint: "Use read-only `Sequence[T]` and `Callable[[T], U]`.",
      lessonRefId: "py-generics-callable",
      goal: "Write `map_non_none[T, U](items: Sequence[T | None], fn: Callable[[T], U]) -> list[U]` skipping `None` items before calling `fn`.",
      constraints: ["Narrow `x is not None` for strict type checkers"],
      examples: [
        { input: "[1, None, 3], lambda x: x * 10", output: "[10, 30]" },
        { input: "('a', None), str.upper", output: "['A']" },
      ],
      tasks: [
        "Filter `item is not None` with `[fn(item) for item in items if item is not None]`.",
      ],
      starterCode: "# Practice M12.2: strict generic Sequence mapper\nfrom collections.abc import Callable, Sequence\n\ndef map_non_none[T, U](items: Sequence[T | None], fn: Callable[[T], U]) -> list[U]:\n    return []\n",
      expectedOutput: "[10, 30]\n['A']",
      hint: "List comprehension `[fn(item) for item in items if item is not None]` satisfies strict `mypy` narrowing.",
      complexity: { time: "O(n)", space: "O(n)" },
      solutionCode:
        "from collections.abc import Callable, Sequence\n\ndef map_non_none[T, U](items: Sequence[T | None], fn: Callable[[T], U]) -> list[U]:\n    return [fn(item) for item in items if item is not None]\n\nprint(map_non_none([1, None, 3], lambda x: x * 10))\nprint(map_non_none(('a', None), str.upper))",
    },
    {
      id: "m12-p3",
      title: "Circuit-style retry tested with `Mock(side_effect=...)` and `caplog`",
      tier: "Core",
      patternHint: "Log warnings without swallowing final error past `max_attempts`, verified via `Mock` + `StreamHandler`.",
      lessonRefId: "py-mocking-testing",
      goal: "Write `call_with_retry(fn, retries=2)` retrying `OSError` up to `retries` attempts before returning `'fallback'`, verified against `Mock(side_effect=[OSError('a'), 'ok'])` and all-fail.",
      constraints: ["Count exact calls on the `Mock`"],
      examples: [
        { input: "succeeds on attempt 2", output: "ok 2" },
        { input: "fails all attempts", output: "fallback 2" },
      ],
      tasks: [
        "Loop `range(retries)` trying `fn()`; catch `OSError` and return `'fallback'` after exhausting attempts.",
      ],
      starterCode: "# Practice M12.3: retry logic verified with Mock\nfrom unittest.mock import Mock\n\ndef call_with_retry(fn, retries: int = 2) -> str:\n    return 'fallback'\n",
      expectedOutput: "ok 2\nfallback 2",
      hint: "Use `for _ in range(retries): try: return fn() except OSError: pass`.",
      complexity: { time: "O(retries)", space: "O(1)" },
      solutionCode:
        "from unittest.mock import Mock\n\ndef call_with_retry(fn, retries: int = 2) -> str:\n    for _ in range(retries):\n        try:\n            return fn()\n        except OSError:\n            pass\n    return 'fallback'\n\nm1 = Mock(side_effect=[OSError('a'), 'ok'])\nprint(call_with_retry(m1, 2), m1.call_count)\nm2 = Mock(side_effect=[OSError('a'), OSError('b')])\nprint(call_with_retry(m2, 2), m2.call_count)",
    },
    {
      id: "m12-p4",
      title: "Streaming log parser + CLI status filter",
      tier: "Stretch",
      patternHint: "Combine compiled regex, blank-line skipping, frozen `LogEvent`, and `Counter`.",
      lessonRefId: "py-capstone-log-analyzer",
      goal: "Write `analyze_lines(lines, min_code=400)` parsing `'[LEVEL] code=N msg'` rows, returning sorted `(level, count)` pairs for `code >= min_code`, or `'bad:<lineno>'` on first malformed non-empty line.",
      constraints: ["Ignore blank lines using 1-based line numbers from original enumeration"],
      examples: [
        { input: "['[INFO] code=200 ok', '', '[ERROR] code=503 down'], 400", output: "[('ERROR', 1)]" },
        { input: "['[INFO] code=200 ok', 'corrupt']", output: "bad:2" },
      ],
      tasks: [
        "Enumerate from `start=1`, match `_RE.fullmatch(text)`, return sorted counts or `'bad:<lineno>'`.",
      ],
      starterCode: "# Practice M12.4: streaming line analyzer with error line reporting\nfrom collections import Counter\nimport re\n\n_RE = re.compile(r\"^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$\")\n\ndef analyze_lines(lines: list[str], min_code: int = 400):\n    return []\n",
      expectedOutput: "[('ERROR', 1)]\nbad:2",
      hint: "Strip each raw string, skip blanks, return `f'bad:{n}'` if `_RE.fullmatch` fails.",
      complexity: { time: "O(n)", space: "O(k)" },
      solutionCode:
        "from collections import Counter\nimport re\n\n_RE = re.compile(r\"^\\[(?P<level>INFO|WARN|ERROR)\\]\\s+code=(?P<code>\\d+)\\s+(?P<msg>.+)$\")\n\ndef analyze_lines(lines: list[str], min_code: int = 400):\n    counts: Counter[str] = Counter()\n    for lineno, raw in enumerate(lines, start=1):\n        text = raw.strip()\n        if not text:\n            continue\n        m = _RE.fullmatch(text)\n        if not m:\n            return f'bad:{lineno}'\n        if int(m.group('code')) >= min_code:\n            counts[m.group('level')] += 1\n    return sorted(counts.items())\n\nprint(analyze_lines(['[INFO] code=200 ok', '', '[ERROR] code=503 down'], 400))\nprint(analyze_lines(['[INFO] code=200 ok', 'corrupt']))",
    },
  ],
};
