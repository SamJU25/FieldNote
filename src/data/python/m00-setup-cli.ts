import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export const m00Lessons: Record<string, LessonContent> = {
  "py-install-editor": {
    lessonId: "py-install-editor",
    subtitle: "Already have Python 3 and a code editor ready? Run the 60-second check below and jump straight to Module 01, or set up Python 3 and VS Code once.",
    intro: {
      heading: "Run Python on your machine",
      explanation: [
        "Python code runs through a program called the **interpreter**, which reads plain `.py` text files line by line. You write files inside a code editor (like VS Code), and launch Python from your terminal or editor Run button.",
        "If Python 3 is already installed and works in your terminal, skim the verification table and jump ahead to **Module 01**.",
      ],
      analogy:
        "Your code editor saves plain `.py` text files, and the `python` interpreter in your terminal reads and runs each line.",
      realWorldUses: [
        "Running local automation scripts (renaming files, parsing CSV reports, or fetching web data) straight from your machine",
        "Binding VS Code to the same Python 3 interpreter your terminal uses so the Run button and terminal commands behave identically",
      ],
    },
    sections: [
      {
        heading: "1. 60-second check and installing Python 3",
        paragraphs: [
          "A **terminal** is the text window where you type commands directly for your computer to run. To open one: on **Windows**, press the Windows key, type `PowerShell`, and press Enter; on **macOS**, press `Cmd + Space`, type `Terminal`, and press Enter; on **Linux**, press `Ctrl + Alt + T`.",
          "Once that window is open, run `python --version` (or `python3 --version` on macOS/Linux). If any current Python 3 release prints back (`Python 3.x.y`) and your editor can run a `.py` file, you already have everything needed for the rest of this course.",
          "If Python is not installed yet, get the current stable release from [python.org/downloads](https://www.python.org/downloads/). On **Windows**, check **`Add python.exe to PATH`** on the first installer screen (`PATH` is the list of folders your computer searches when you type a command name), click **Install Now**, then close any already-open terminal and open a fresh one so Windows picks up the updated `PATH`.",
          "On **macOS**, install the `.pkg` from [python.org/downloads](https://www.python.org/downloads/) (or `brew install python`) and use `python3` in Terminal. On **Ubuntu/Debian**, run `sudo apt update && sudo apt install python3 python3-pip python3-venv`.",
        ],
        table: {
          caption: "Python installation and verification by OS",
          headers: ["OS", "Install Method", "Terminal", "Verify Command"],
          rows: [
            ["Windows", "`.exe` from [python.org/downloads](https://www.python.org/downloads/) with **Add python.exe to PATH** checked", "`Win` -> `PowerShell`", "`python --version` or `py --version`"],
            ["macOS", "`.pkg` from [python.org/downloads](https://www.python.org/downloads/) or `brew install python`", "`Cmd + Space` -> `Terminal`", "`python3 --version`"],
            ["Linux (Ubuntu/Debian)", "`sudo apt update && sudo apt install python3`", "`Ctrl + Alt + T`", "`python3 --version`"],
          ],
          highlightCol: 3,
        },
        codeLabel: "TERMINAL",
        code: [
          "# Open a NEW terminal after installing, then check:",
          "python --version    # Windows PowerShell / cmd",
          "python3 --version   # macOS / Linux",
        ],
        output: "Python 3.x.y",
        callout: {
          kind: "KEY IDEA",
          text: "**Already use Python?** If `python --version` (or `python3 --version`) prints a current Python 3 version and your editor already runs `.py` scripts, mark this lesson done and skip ahead to **Module 01** (or skim **0.2** for `Ctrl+C` and reading tracebacks).",
        },
      },
      {
        heading: "2. Editor setup (VS Code or any Python editor)",
        paragraphs: [
          "Any code editor that saves plain `.py` files works with this course (VS Code, PyCharm, Cursor, Zed, Vim). Write code in a plain-text or code editor, never in Word or a rich-text app.",
          "If you want a standard free setup, download [Visual Studio Code](https://code.visualstudio.com/) and install the Python extension published by Microsoft (`ms-python.python`) from Extensions (`Ctrl + Shift + X` / `Cmd + Shift + X`). Follow the [VS Code Python Tutorial](https://code.visualstudio.com/docs/python/python-tutorial) if you want full IDE reference later.",
        ],
        table: {
          caption: "VS Code setup reference",
          headers: ["Step", "Action in VS Code", "Shortcut / Menu"],
          rows: [
            ["1. Python Extension", "Install Python by Microsoft (`ms-python.python`)", "`Ctrl + Shift + X` / `Cmd + Shift + X`"],
            ["2. Open Folder", "Open a folder like `python-practice` so all your practice scripts stay organized in one place", "`File -> Open Folder...`"],
            ["3. Create Script", "Add a lowercase `.py` file (such as `hello.py`) so editor color-coding and error checks activate", "Explorer New File"],
            ["4. Select Interpreter", "Pick your installed Python 3 **interpreter** (the program that reads and runs `.py` code) in the Command Palette or bottom-right bar", "`Ctrl + Shift + P` -> `Python: Select Interpreter`"],
            ["5. Run Code", "Click top-right **Play** (`▶`) or run `python hello.py` in the built-in terminal", "Play `▶` or `Ctrl + ~`"],
          ],
        },
        codeLabel: "TEXT",
        code: [
          "python-practice/",
          "    hello.py    # open python-practice in your editor, not a bare desktop file",
        ],
        callout: {
          kind: "RULE OF THUMB",
          text: "On Windows, if typing `python` opens the Microsoft Store instead of Python, run `py --version` (the Windows Launcher) or disable the Store aliases under Windows Settings -> App execution aliases.",
        },
      },
    ],
    guidedBuildUp: {
      title: "Run the 60-second environment check",
      subtitle: "Follow these 3 checks to confirm your terminal and editor share the same Python 3 interpreter.",
      steps: [
        {
          label: "Step 1: Verify terminal",
          explanation: "Open a terminal (`Terminal -> New Terminal` in VS Code) and confirm Python 3 prints a version number (`python3 --version` on macOS/Linux).",
          code: ["python --version   # use python3 --version on macOS/Linux"],
          activeLines: [1],
          output: "Python 3.x.y",
        },
        {
          label: "Step 2: Save `hello.py`",
          explanation: "Inside your project folder `python-practice/`, create `hello.py`, add one `print(...)` call, and save (`Ctrl + S` / `Cmd + S`).",
          code: ["print(\"Hello from Python!\")"],
          activeLines: [1],
        },
        {
          label: "Step 3: Run the file",
          explanation: "Click the editor Play (`▶`) button or run `python hello.py` (`python3 hello.py` on macOS/Linux) in the terminal.",
          code: ["# Click ▶ top-right OR run in terminal:", "python hello.py"],
          activeLines: [2],
          output: "Hello from Python!",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "How your editor, terminal, and interpreter connect",
      steps: [
        {
          title: "Step 1: Expose Python on PATH so terminals and editors find it",
          tag: "CONCEPT",
          explanation: [
            "Your editor (`VS Code`, `PyCharm`, etc.) does not ship Python itself. Adding Python 3 to `PATH` (your computer's command search list) lets any fresh terminal and editor locate the Python interpreter automatically.",
          ],
          code: [
            "python --version   # Windows PowerShell",
            "python3 --version  # macOS / Linux",
          ],
          activeLines: [1, 2],
          state: [{ name: "PATH status", value: "Python 3 found", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Installing Python on disk exposes the executable to your terminal and editor",
            nodes: [
              { id: "dl", label: "python.org Installer", sublabel: "Add to PATH checked (Win)", tone: "accent", active: true },
              { id: "term", label: "Fresh Terminal", sublabel: "python / python3 --version", tone: "ok" },
              { id: "vsc", label: "Code Editor", sublabel: "Select Interpreter binds .py", tone: "muted" },
            ],
            links: [
              { from: "dl", to: "term", label: "PATH updated", active: true },
              { from: "term", to: "vsc", label: "discovered" },
            ],
          },
        },
        {
          title: "Step 2: Match common setup snags to quick fixes",
          tag: "PITFALL",
          explanation: [
            "Almost every setup error comes from an old terminal window, the Windows Store alias, or typing `python` instead of `python3`.",
          ],
          code: [
            "py --version       # Windows launcher fallback",
            "python3 --version  # macOS / Linux command",
          ],
          activeLines: [1, 2],
          state: [{ name: "quick fix", value: "new terminal or py / python3", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Resolve terminal PATH issues quickly before running Python scripts.",
            nodes: [
              { id: "chk", label: "'python' missing?", sublabel: "stale shell or alias", tone: "warm" },
              { id: "win", label: "Windows: py", sublabel: "or open new shell", active: true, tone: "accent" },
              { id: "mac", label: "macOS / Linux", sublabel: "use python3", tone: "ok" },
            ],
            links: [
              { from: "chk", to: "win", active: true },
              { from: "win", to: "mac", label: "or", active: true },
            ],
          },
        },
        {
          title: "Step 3: Bind `.py` files with `Python: Select Interpreter`",
          tag: "TRACE",
          explanation: [
            "Once `hello.py` is open in VS Code, check the bottom-right status bar (or open Command Palette with `Ctrl + Shift + P` / `Cmd + Shift + P`) to confirm the right Python 3 interpreter is selected.",
          ],
          code: ["print(\"Hello from Python!\")"],
          activeLines: [1],
          output: "Hello from Python!",
          visual: {
            kind: "pipeline",
            caption: "VS Code status bar binds the editor to a specific Python 3 interpreter before running the file.",
            nodes: [
              { id: "file", label: "hello.py", sublabel: "Editor tab" },
              { id: "picker", label: "Select Interpreter", sublabel: "Python 3.12+", active: true, tone: "accent" },
              { id: "exec", label: "Run Python File", sublabel: "Hello from Python!", tone: "ok" },
            ],
            links: [
              { from: "file", to: "picker", active: true },
              { from: "picker", to: "exec", label: "runs", active: true },
            ],
          },
        },
        {
          title: "Step 4: Keep terminal shell vs Python `>>>` prompt separate",
          tag: "CHECK",
          explanation: [
            "Shell commands like `python hello.py` run in your OS terminal. Running `python` by itself opens Python's interactive `>>>` REPL; type `exit()` whenever you want to return to your regular terminal prompt.",
          ],
          code: [
            "# In OS terminal:",
            "python --version",
            "# Inside >>> REPL:",
            "exit()",
          ],
          activeLines: [2, 4],
          state: [
            { name: "Shell prompt", value: "PS> / $ (runs scripts)", changed: true },
            { name: "REPL prompt", value: ">>> (runs 1 Python line)", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Keep OS shell commands (python file.py) separate from Python expressions inside >>>.",
            nodes: [
              { id: "sh", label: "OS Shell (PS> / $)", sublabel: "python --version", active: true, tone: "accent" },
              { id: "re", label: "Python REPL (>>>)", sublabel: "exit() leaves", tone: "ok" },
            ],
            links: [{ from: "sh", to: "re", label: "python / exit()", active: true }],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Windows: saving `hello.py.txt` outside VS Code",
        detail: "Windows hides `.txt` extensions by default. Create files inside your code editor's Explorer panel so the filename stays `hello.py`, not `hello.py.txt`.",
      },
      {
        title: "Running `python` alone enters the `>>>` interactive prompt",
        detail: "Typing `python` with no filename opens Python's interactive `REPL` (a live prompt where you test one line of code at a time and see results right away, marked by `>>>`). Type `exit()` and press Enter to return to your normal terminal prompt.",
      },
      {
        title: "Multiple Python versions picking the wrong interpreter",
        detail: "If your editor flags working code, press `Ctrl + Shift + P` (`Cmd + Shift + P`), choose `Python: Select Interpreter`, and pick your main current Python 3 installation.",
      },
    ],
    predictChecks: [
      {
        prompt: "You see `>>>` after typing `python` in your terminal. How do you return to the regular system shell (the terminal prompt where you run OS commands like `ls` or `python hello.py`)?",
        code: ">>> ",
        options: [
          { id: "a", label: "Type `python --version`" },
          { id: "b", label: "Type `exit()` and press Enter" },
          { id: "c", label: "Restart the computer" },
        ],
        correctId: "b",
        explanation: "`>>>` is Python's interactive `REPL` prompt (live one-line-at-a-time mode). Calling `exit()` closes that session and returns to your system shell.",
      },
      {
        prompt: "You installed VS Code and saved `hello.py`, but there is no `▶` Run Python File button or syntax help. What step is missing?",
        code: "# File saved as hello.py, but Play button and Python version badge are missing",
        options: [
          { id: "a", label: "Install the official Python extension by Microsoft inside VS Code (`Ctrl+Shift+X`)" },
          { id: "b", label: "Rename `hello.py` to `hello.exe`" },
          { id: "c", label: "Write code inside Microsoft Word instead" },
        ],
        correctId: "a",
        explanation: "VS Code requires the Microsoft Python extension (`ms-python.python`) plus selecting your installed Python 3 interpreter.",
      },
    ],
    practiceTask: {
      title: "Verify your active Python 3 interpreter",
      tier: "Warmup",
      goal: "Confirm your terminal responds with a current Python 3 release (install from `python.org/downloads` with `Add python.exe to PATH` on Windows if needed).",
      constraints: ["Use a fresh OS terminal window", "Command prints Python 3.x.y"],
      examples: [
        { input: "Windows PowerShell: python --version", output: "Python 3.x.y" },
        { input: "macOS / Linux shell: python3 --version", output: "Python 3.x.y" },
      ],
      tasks: [
        "Open a new PowerShell or Terminal window.",
        "Run `python --version` (Windows) or `python3 --version` (macOS/Linux).",
        "Confirm Python 3 prints (`Python 3.x.y`). If missing, install Python 3 first.",
      ],
      starterCode: "# Check 1: OS terminal command (run outside .py)\n# python --version\n",
      expectedOutput: "Python 3.x.y\nPython 3.x.y",
      hint: "If Windows says `'python' is not recognized`, close and reopen PowerShell, or test `py --version`.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "# Windows PowerShell:\npython --version\n# macOS / Linux:\npython3 --version",
    },
    practiceChallenges: [
      {
        title: "Verify your active Python 3 interpreter",
        tier: "Warmup",
        goal: "Confirm your terminal responds with a current Python 3 release.",
        constraints: ["Use a fresh OS terminal window"],
        examples: [
          { input: "Windows PowerShell: python --version", output: "Python 3.x.y" },
          { input: "macOS / Linux shell: python3 --version", output: "Python 3.x.y" },
        ],
        tasks: ["Open a fresh terminal and verify `python --version` or `python3 --version`."],
        starterCode: "# Check 1: OS terminal command (run outside .py)\n# python --version\n",
        expectedOutput: "Python 3.x.y\nPython 3.x.y",
        hint: "Try `py --version` on Windows if `python` is not recognized yet.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "# Windows PowerShell:\npython --version\n# macOS / Linux:\npython3 --version",
      },
      {
        title: "Verify folder setup and first `hello.py` run",
        tier: "Core",
        goal: "Open a dedicated folder (`python-practice`), bind your Python 3 interpreter in your editor, and run `hello.py`.",
        constraints: ["Save file inside python-practice/", "Confirm extension stays .py"],
        examples: [
          { input: "hello.py runs with python hello.py", output: "Hello from Python!" },
          { input: "print(2 + 3) added on line 2", output: "5" },
        ],
        tasks: [
          "Create an empty folder named `python-practice` and open it via `File -> Open Folder...`.",
          "In VS Code, confirm Python by Microsoft is installed (`Ctrl+Shift+X` / `Cmd+Shift+X`) and run `Python: Select Interpreter` (`Ctrl+Shift+P` / `Cmd+Shift+P`).",
          "Create `hello.py`, print `Hello from Python!` then `2 + 3`, save (`Ctrl+S`), and run it.",
        ],
        starterCode: "# Check 2: python-practice/hello.py\nprint(\"Hello from Python!\")\n",
        expectedOutput: "Hello from Python!\n5",
        hint: "Check the bottom-right corner of VS Code: it displays your selected Python 3 interpreter once `hello.py` is open.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "# Save in python-practice/hello.py:\nprint(\"Hello from Python!\")\nprint(2 + 3)",
      },
      {
        title: "Recover from an accidental `>>>` REPL or missing PATH",
        tier: "Stretch",
        goal: "Distinguish OS shell prompts from Python's interactive `>>>` REPL and exit without throwing `SyntaxError`.",
        constraints: ["Never run OS shell commands inside >>>"],
        examples: [
          { input: "REPL prompt >>> exit()", output: "Returns to OS terminal prompt" },
          { input: "OS prompt python --version", output: "Python 3.x.y" },
        ],
        tasks: [
          "Start Python REPL with `python`, verify one calculation `10 + 5`, then leave via `exit()`.",
          "Back in the OS shell prompt, run `python --version`.",
        ],
        starterCode: "# Check 3: REPL vs OS shell switch\n# python -> 10 + 5 -> exit() -> python --version\n",
        expectedOutput: "Returns to OS terminal prompt\nPython 3.x.y",
        hint: "Include parentheses on `exit()` when leaving the `>>>` prompt.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "# Inside terminal:\n# python\n# >>> 10 + 5   -> 15\n# >>> exit()\npython --version",
      },
    ],
  },

  "py-terminal-files": {
    lessonId: "py-terminal-files",
    subtitle: "Check which folder your terminal sits in (`pwd`/`dir`), navigate with `cd`, choose between VS Code Play vs terminal runs, and stop loops with `Ctrl+C`.",
    intro: {
      heading: "Navigating folders and stopping programs",
      explanation: [
        "Every terminal session sits inside one folder at a time. When you type `python app.py`, Python searches only that current folder (`cwd`), reads the saved copy on disk, and prints output or tracebacks in the same window.",
        "Knowing how to check your folder (`pwd` / `ls`), save first (`Ctrl+S`), stop stuck scripts (`Ctrl+C`), and read errors bottom-up solves nearly every beginner workflow snag.",
      ],
      analogy:
        "Your terminal's current working folder acts like the desk in front of you: typing `python hello.py` checks only the papers sitting on that desk, and Python reads the ink already saved to disk rather than unsaved edits still sitting in an editor tab.",
      realWorldUses: [
        "Running CLI tools and data scripts that read input files relative to your working directory",
        "Interrupting stalled network scripts or infinite loops with Ctrl+C before closing terminals",
      ],
    },
    sections: [
      {
        heading: "Working directory (`cwd`) and terminal commands by OS",
        paragraphs: [
          "Every terminal window sits inside one specific folder called the **current working directory (`cwd`)**. When you run `python hello.py`, Python looks inside that exact folder only.",
          "If you opened `python-practice` in VS Code (`File -> Open Folder...`) and opened VS Code's built-in terminal (`Terminal -> New Terminal`), you are already inside `python-practice/`, so run `python hello.py` directly without typing `cd python-practice` again.",
        ],
        table: {
          caption: "Core terminal commands across Windows, macOS, and Linux",
          headers: ["Action", "PowerShell / macOS / Linux", "Windows Command Prompt (`cmd`)"],
          rows: [
            ["Show current folder", "`pwd`", "`cd` (with nothing after it)"],
            ["List files in folder", "`ls`", "`dir`"],
            ["Enter a subfolder", "`cd python-practice`", "`cd python-practice`"],
            ["Go up one parent folder", "`cd ..`", "`cd ..`"],
            ["Run a saved script", "`python hello.py` / `python3 hello.py`", "`python hello.py` / `py hello.py`"],
          ],
        },
        codeLabel: "TERMINAL",
        code: [
          "# Check current folder and files before running:",
          "pwd                     # or 'cd' on Windows cmd",
          "ls                      # or 'dir' on Windows cmd",
          "python hello.py",
        ],
        output: "Hello from Python!",
      },
      {
        heading: "VS Code `▶` Play button vs terminal runs and `Ctrl+C`",
        paragraphs: [
          "VS Code's top-right `▶` button automatically switches to the script's directory and runs Python for you, making it convenient for single files. Typing `python script.py` manually in the terminal matters once scripts read saved data files, pause for typed input, or run larger multi-file tools.",
          "Always save changes first (`Ctrl + S` / `Cmd + S`): Python reads the saved file on disk, ignoring unsaved edits shown in an editor tab with a dot icon. If a script ever hangs or loops forever, click inside the terminal and press `Ctrl + C` to interrupt it.",
        ],
        codeLabel: "TERMINAL",
        code: [
          "# Always save (Ctrl+S) first, then run:",
          "python hello.py    # python3 hello.py on macOS / Linux",
          "# Press Ctrl+C anytime inside the terminal to stop a waiting script",
        ],
        callout: {
          kind: "RULE OF THUMB",
          text: "If `python app.py` prints `can't open file ... No such file or directory`, list files (`ls` or `dir`). Almost always, your terminal is sitting one folder too high or inside the wrong directory.",
        },
      },
      {
        heading: "Reading your first error message",
        paragraphs: [
          "Every programmer hits error messages (`Traceback`) on day one. Start at the bottom line to read the error type and plain-English reason, then look at the `File ..., line ...` line right above it to jump straight to the problem line in VS Code.",
        ],
        codeLabel: "TERMINAL",
        code: [
          "Traceback (most recent call last):",
          "    File \"hello.py\", line 2, in <module>",
          "    prnt(\"Hi\")",
          "NameError: name 'prnt' is not defined",
        ],
        output: "NameError: name 'prnt' is not defined (at hello.py line 2)",
        callout: {
          kind: "KEY IDEA",
          text: "Read Python tracebacks **bottom-up**: the bottom line tells you *what* went wrong (`NameError`), and the `File ..., line ...` line above it tells you *where* to fix it. On practice tasks you will also see `Time: O(...)` badges (Big-O shorthand explained in Module 6: `O(1)` stays instant at any size, while `O(n)` scales directly with input length `n`).",
        },
      },
    ],
    guidedBuildUp: {
      title: "Edit, save, and re-run `hello.py` from the terminal",
      subtitle: "Saving changes on disk updates what `python hello.py` prints.",
      steps: [
        {
          label: "Step 1: Verify folder & initial run",
          explanation: "Use `ls` (or `dir` in `cmd`) to confirm `hello.py` sits in your terminal's current folder, then run it.",
          code: [
            "ls                # dir on Windows cmd",
            "python hello.py   # python3 hello.py on macOS / Linux",
          ],
          activeLines: [1, 2],
          output: "Hello from Python!",
        },
        {
          label: "Step 2: Edit `hello.py` & save to disk",
          explanation: "Add a second `print(...)` inside `hello.py` and press `Ctrl + S` (`Cmd + S` on macOS) so the file on disk updates.",
          code: [
            "print(\"Hello from Python!\")",
            "print(\"Edited and saved!\")",
          ],
          activeLines: [2],
        },
        {
          label: "Step 3: Re-run the saved script",
          explanation: "Run `python hello.py` again from the terminal to read the newly saved line (press `Ctrl + C` anytime if a script waits or hangs).",
          code: ["python hello.py   # reads the updated file saved on disk"],
          activeLines: [1],
          output: "Hello from Python!\nEdited and saved!",
        },
      ],
    },
    walkthrough: {
      layout: "visual-first",
      title: "From editor save to terminal output",
      steps: [
        {
          title: "Step 1: Save changes on disk (`Ctrl+S` / `Cmd+S`)",
          tag: "CONCEPT",
          explanation: [
            "Check that no unsaved dot appears next to `hello.py` in the VS Code tab bar before running.",
          ],
          code: [
            "# Save edits first (Ctrl+S / Cmd+S), then check folder:",
            "pwd    # macOS / Linux / PS (Windows cmd: cd)",
            "ls     # macOS / Linux / PS (Windows cmd: dir)",
          ],
          activeLines: [2, 3],
          state: [{ name: "file status", value: "Saved on disk", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Save edits to disk, confirm working folder, then run Python",
            nodes: [
              { id: "sv", label: "Save hello.py", sublabel: "Ctrl+S writes to disk", tone: "accent", active: true },
              { id: "cwd", label: "Check cwd", sublabel: "ls / dir sees hello.py", tone: "muted" },
              { id: "out", label: "Run script", sublabel: "python hello.py", tone: "ok" },
            ],
            links: [
              { from: "sv", to: "cwd", label: "saved" },
              { from: "cwd", to: "out", label: "found", active: true },
            ],
          },
        },
        {
          title: "Step 2: Confirm folder & execute (`python hello.py`)",
          tag: "TRACE",
          explanation: [
            "Once `ls` (or `dir` in `cmd`) lists `hello.py`, running `python hello.py` prints your output or stops when you press `Ctrl+C`.",
          ],
          code: [
            "python hello.py   # python3 hello.py on macOS / Linux",
            "# Press Ctrl+C inside terminal anytime to abort a stuck loop",
          ],
          activeLines: [1],
          output: "Hello from Python!",
          state: [{ name: "cwd", value: "hello.py present", changed: true }],
          visual: {
            kind: "pipeline",
            caption: "Running from the folder containing hello.py prints output in the same terminal",
            nodes: [
              { id: "sv", label: "Save hello.py", sublabel: "Saved on disk", tone: "ok" },
              { id: "cwd", label: "Folder ready", sublabel: "hello.py present", tone: "ok" },
              { id: "out", label: "Terminal output", sublabel: "print() & errors appear", tone: "accent", active: true },
            ],
            links: [
              { from: "sv", to: "cwd", label: "ready" },
              { from: "cwd", to: "out", label: "output", active: true },
            ],
          },
        },
        {
          title: "Step 3: Read a traceback from bottom to top",
          tag: "CHECK",
          explanation: [
            "When a line fails, read the bottom line first to see what failed (`NameError`), then read the `File ..., line ...` line above it to locate the typo.",
          ],
          code: [
            "Traceback (most recent call last):",
            "    File \"hello.py\", line 2, in <module>",
            "    prnt(\"Hi\")",
            "NameError: name 'prnt' is not defined",
          ],
          activeLines: [2, 4],
          state: [
            { name: "Error type", value: "NameError (line 2)", changed: true },
            { name: "Fix", value: "prnt -> print", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Read tracebacks bottom to top: identify the error kind first, then jump to the file and line.",
            nodes: [
              { id: "bot", label: "NameError", sublabel: "what failed", active: true, tone: "warm" },
              { id: "mid", label: "prnt(\"Hi\")", sublabel: "failing call", active: true, tone: "accent" },
              { id: "top", label: "hello.py:line 2", sublabel: "fix typo -> print", tone: "ok" },
            ],
            links: [
              { from: "bot", to: "mid", active: true },
              { from: "mid", to: "top", label: "locate", active: true },
            ],
          },
        },
        {
          title: "Step 4: Stop a stuck program with `Ctrl+C`",
          tag: "PATTERN",
          explanation: [
            "If a script waits forever or repeats endlessly, pressing `Ctrl+C` inside the active terminal sends `KeyboardInterrupt` so you immediately regain your terminal prompt.",
          ],
          code: [
            "# While a stuck script runs inside your terminal:",
            "# Press Ctrl+C -> KeyboardInterrupt -> returns to prompt",
          ],
          activeLines: [2],
          state: [
            { name: "Signal", value: "Ctrl+C -> KeyboardInterrupt", changed: true },
          ],
          visual: {
            kind: "pipeline",
            caption: "Ctrl+C sends KeyboardInterrupt to abort a stuck script and return to the shell prompt.",
            nodes: [
              { id: "run", label: "Stuck Script", sublabel: "keeps running", tone: "warm" },
              { id: "sig", label: "Press Ctrl+C", sublabel: "KeyboardInterrupt", tone: "accent", active: true },
              { id: "sh", label: "Shell Prompt", sublabel: "ready for next command", tone: "ok" },
            ],
            links: [
              { from: "run", to: "sig", active: true },
              { from: "sig", to: "sh", label: "exits", active: true },
            ],
          },
        },
      ],
    },
    trickyPoints: [
      {
        title: "Running `cd python-practice` when already inside `python-practice`",
        detail: "Check your prompt or `pwd` first. If VS Code opened `python-practice`, its terminal already starts inside it.",
      },
      {
        title: "Typing terminal commands (`python hello.py`) inside Python `>>>`",
        detail: "Shell commands belong in PowerShell / Terminal, never inside Python's `>>>` prompt (`SyntaxError`). Run `exit()` if you see `>>>`.",
      },
    ],
    predictChecks: [
      {
        prompt: "You edited `app.py`, ran `python app.py`, and saw old output from 2 minutes ago. Why?",
        code: "# Edited in VS Code tab (dot icon next to app.py)\n$ python app.py",
        options: [
          { id: "a", label: "Python caches old output forever" },
          { id: "b", label: "You must restart VS Code after every edit" },
          { id: "c", label: "The file was not saved to disk (`Ctrl+S` / `Cmd+S`) before running" },
        ],
        correctId: "c",
        explanation: "The `python` command reads what is saved on disk, so always press `Ctrl+S` (`Cmd+S` on Mac) first.",
      },
      {
        prompt: "You opened `python-practice` in VS Code and opened `Terminal -> New Terminal`. Typing `cd python-practice` says the path does not exist. Why?",
        code: "PS C:\\Users\\Sam\\Desktop\\python-practice> cd python-practice\ncd : Cannot find path 'python-practice'",
        options: [
          { id: "a", label: "You are already inside `python-practice`, so run `python hello.py` directly" },
          { id: "b", label: "`cd` only works on Linux" },
          { id: "c", label: "The folder was deleted automatically" },
        ],
        correctId: "a",
        explanation: "Look at the prompt path: it already ends in `python-practice>`. Run `ls` (or `dir`) to verify `hello.py` is right there.",
      },
    ],
    practiceTask: {
      title: "Navigate folders and run from the terminal",
      tier: "Warmup",
      goal: "Write a 2-line `hello.py` inside `python-practice/`, save it, verify its presence with `ls`/`dir`, and execute it from the terminal.",
      constraints: ["Save edits with Ctrl+S before running", "Execute from inside python-practice/"],
      examples: [
        { input: "hello.py first run", output: "Terminal run works!" },
        { input: "Second line added and saved", output: "Ready for Module 01" },
      ],
      tasks: [
        "Save `print(\"Terminal run works!\")` and `print(\"Ready for Module 01\")` in `hello.py` (`Ctrl+S`).",
        "Check your working folder (`pwd` / `cd`) and list files (`ls` / `dir`) to confirm `hello.py` appears.",
        "Run `python hello.py` (or `python3 hello.py` on Mac/Linux).",
      ],
      starterCode: "# Warmup M00.2: Save inside python-practice/hello.py\n",
      expectedOutput: "Terminal run works!\nReady for Module 01",
      hint: "If `hello.py` is not listed by `ls`/`dir`, use `cd ..` or `cd python-practice` to move to the right folder.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode:
        "# Inside python-practice/hello.py:\nprint(\"Terminal run works!\")\nprint(\"Ready for Module 01\")",
    },
    practiceChallenges: [
      {
        title: "Navigate folders and run from the terminal",
        tier: "Warmup",
        goal: "Save and execute `hello.py` from your terminal working directory.",
        constraints: ["Save before executing"],
        examples: [
          { input: "hello.py first run", output: "Terminal run works!" },
          { input: "Second line added and saved", output: "Ready for Module 01" },
        ],
        tasks: ["Print both lines from saved `hello.py`."],
        starterCode: "# Warmup M00.2: Save inside python-practice/hello.py\n",
        expectedOutput: "Terminal run works!\nReady for Module 01",
        hint: "Use `ls` or `dir` to confirm `hello.py` sits in your current working folder.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "# Inside python-practice/hello.py:\nprint(\"Terminal run works!\")\nprint(\"Ready for Module 01\")",
      },
      {
        title: "Read a traceback and fix a typo bug",
        tier: "Core",
        goal: "Locate a misspelled `prnt` function name from a bottom-up traceback and fix the script so all lines run.",
        constraints: ["Fix line reported in traceback"],
        examples: [
          { input: "Broken code: prnt(\"Start\")", output: "Start" },
          { input: "Second line: print(\"End\")", output: "End" },
        ],
        tasks: [
          "Inspect the `NameError` at line 1 and change `prnt` to `print`.",
          "Run the saved file to confirm both lines print.",
        ],
        starterCode: "# Fix NameError reported in traceback:\nprnt(\"Start\")\nprint(\"End\")\n",
        expectedOutput: "Start\nEnd",
        hint: "Read the bottom line (`NameError: name 'prnt' is not defined`) and replace `prnt` with `print`.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode: "print(\"Start\")\nprint(\"End\")",
      },
      {
        title: "Interrupt a waiting script with `Ctrl+C`",
        tier: "Stretch",
        goal: "Test stopping a paused script intentionally using `Ctrl+C`, seeing how Python raises `KeyboardInterrupt` and returns control to the shell.",
        constraints: ["Click inside terminal before pressing Ctrl+C"],
        examples: [
          { input: "Script waits at input(...), press Ctrl+C", output: "KeyboardInterrupt -> terminal prompt" },
          { input: "Press Enter instead of Ctrl+C", output: "Normal exit to terminal prompt" },
        ],
        tasks: [
          "Save `input(\"Waiting... press Ctrl+C: \")` in `wait_test.py`.",
          "Run `python wait_test.py` and interrupt it from the terminal with `Ctrl+C`.",
        ],
        starterCode: "# Run wait_test.py in terminal, then press Ctrl+C:\ninput(\"Waiting... press Ctrl+C in terminal: \")\n",
        expectedOutput: "KeyboardInterrupt -> terminal prompt\nNormal exit to terminal prompt",
        hint: "Focus the terminal pane first so `Ctrl+C` reaches Python instead of copying text in the editor.",
        complexity: { time: "O(1)", space: "O(1)" },
        solutionCode:
          "# Save as wait_test.py and run python wait_test.py, then press Ctrl+C:\ninput(\"Waiting... press Ctrl+C in terminal: \")",
      },
    ],
  },
};

export const m00Quiz: ModuleQuiz = {
  moduleId: "py-m0",
  title: "Module 00 Quiz: Environment and running Python",
  description: "10 questions checking Python installation (`PATH`), VS Code extension & interpreter setup, terminal navigation, saving files, and `Ctrl+C`.",
  questions: [
    {
      id: "m0-q1",
      prompt: "When installing Python on Windows from `python.org/downloads`, which checkbox avoids `'python' is not recognized`?",
      options: [
        { id: "a", label: "Disable file extensions" },
        { id: "b", label: "Add python.exe to PATH" },
        { id: "c", label: "Install only documentation" },
      ],
      correctId: "b",
      explanation: "Checking `Add python.exe to PATH` on the first installer screen lets any terminal find `python`.",
      lessonRefId: "py-install-editor",
    },
    {
      id: "m0-q2",
      prompt: "Inside VS Code, what must you install to get Python autocomplete, error highlighting, and the `▶` Run Python File button?",
      options: [
        { id: "a", label: "The official Python extension by Microsoft (`ms-python.python`)" },
        { id: "b", label: "A browser ad blocker" },
        { id: "c", label: "Microsoft Word grammar tools" },
      ],
      correctId: "a",
      explanation: "VS Code requires the official Microsoft Python extension plus selecting a Python interpreter.",
      lessonRefId: "py-install-editor",
    },
    {
      id: "m0-q3",
      prompt: "After checking `Add python.exe to PATH` and installing Python on Windows, your already-open PowerShell window still errors. Why?",
      options: [
        { id: "a", label: "PowerShell does not support Python" },
        { id: "b", label: "You have to reinstall VS Code" },
        { id: "c", label: "Existing terminals keep the old environment; close and open a new terminal" },
      ],
      correctId: "c",
      explanation: "Open terminals only read updated `PATH` settings after closing and reopening a fresh terminal window.",
      lessonRefId: "py-install-editor",
    },
    {
      id: "m0-q4",
      prompt: "How do you tell VS Code which installed Python interpreter to use if multiple versions exist?",
      options: [
        { id: "a", label: "Rename `python.exe` manually" },
        { id: "b", label: "Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run `Python: Select Interpreter`" },
        { id: "c", label: "Save the file as `.txt`" },
      ],
      correctId: "b",
      explanation: "`Python: Select Interpreter` (or clicking the Python version in VS Code's bottom-right bar) binds your workspace to the right Python.",
      lessonRefId: "py-install-editor",
    },
    {
      id: "m0-q5",
      prompt: "You typed `python` with no filename and now see `>>>`. What mode are you in, and how do you exit?",
      options: [
        { id: "a", label: "Text editor mode; press `Ctrl+S`" },
        { id: "b", label: "Crash recovery mode; restart the PC" },
        { id: "c", label: "Python interactive prompt (`REPL`); type `exit()` and press Enter" },
      ],
      correctId: "c",
      explanation: "Calling `python` alone enters the interactive `>>>` shell; `exit()` exits back to your terminal.",
      lessonRefId: "py-install-editor",
    },
    {
      id: "m0-q6",
      prompt: "Which command lists files in the current folder on Windows Command Prompt (`cmd`) (where `ls` does not exist)?",
      options: [
        { id: "a", label: "`dir`" },
        { id: "b", label: "`exit()`" },
        { id: "c", label: "`print()`" },
      ],
      correctId: "a",
      explanation: "PowerShell, macOS, and Linux use `ls` (`pwd` for current folder); Windows `cmd` uses `dir` (`cd` with no args for current folder).",
      lessonRefId: "py-terminal-files",
    },
    {
      id: "m0-q7",
      prompt: "Running `python app.py` fails with `No such file or directory`, even though `app.py` exists on your computer. Most likely cause?",
      code: "pwd\n/Users/sam/Desktop\npython app.py",
      options: [
        { id: "a", label: "Python refuses filenames named `app.py`" },
        { id: "b", label: "The file needs `.exe` instead of `.py`" },
        { id: "c", label: "The terminal is sitting in a different folder than where `app.py` is saved" },
      ],
      correctId: "c",
      explanation: "`python app.py` looks inside your current working directory (`cwd`); `cd` into the folder containing `app.py`.",
      lessonRefId: "py-terminal-files",
    },
    {
      id: "m0-q8",
      prompt: "What happens if you edit `hello.py` in VS Code and run `python hello.py` without pressing `Ctrl+S` / `Cmd+S` first?",
      options: [
        { id: "a", label: "VS Code deletes `hello.py`" },
        { id: "b", label: "Python runs the older saved version on disk, ignoring your unsaved edits" },
        { id: "c", label: "Python pauses until you rename the file" },
      ],
      correctId: "b",
      explanation: "Python always executes what is saved on disk, so press `Ctrl+S` (or `Cmd+S`) before running.",
      lessonRefId: "py-terminal-files",
    },
    {
      id: "m0-q9",
      prompt: "Which keyboard shortcut stops a Python script stuck in an infinite loop inside your terminal?",
      options: [
        { id: "a", label: "`Ctrl+C`" },
        { id: "b", label: "`Alt+Tab`" },
        { id: "c", label: "`Ctrl+S`" },
      ],
      correctId: "a",
      explanation: "`Ctrl+C` sends an interrupt signal to stop a running terminal command immediately.",
      lessonRefId: "py-terminal-files",
    },
    {
      id: "m0-q10",
      prompt: "What filename extension must every Python source script use?",
      options: [
        { id: "a", label: "`.txt`" },
        { id: "b", label: "`.pyt`" },
        { id: "c", label: "`.py`" },
      ],
      correctId: "c",
      explanation: "Python scripts always end with `.py` (for example `hello.py` or `calc.py`).",
      lessonRefId: "py-install-editor",
    },
  ],
};

export const m00PracticeSet: ModulePracticeSet = {
  moduleId: "py-m0",
  title: "Module 00 Practice Set: Terminal and execution workflow",
  description:
    "Check your interpreter binding, fix a working-directory error, read a traceback from the bottom up, and interrupt a paused script.",
  problems: [
    {
      id: "py-m0-p1",
      title: "Interpreter and editor binding check",
      patternHint: "Verify your OS shell sees Python 3 on PATH and VS Code uses that exact interpreter.",
      lessonRefId: "py-install-editor",
      goal: "Create `python-practice/hello.py`, bind the workspace interpreter, and run a 2-line script printing your Python setup status.",
      constraints: ["File extension must end in .py (not .py.txt)", "Save before running"],
      examples: [
        { input: "python --version", output: "Python 3.x.y" },
        { input: "python hello.py", output: "Setup verified!" },
      ],
      tasks: [
        "Confirm `python --version` (Windows) or `python3 --version` (macOS/Linux) succeeds.",
        "Save and run `print(\"Setup verified!\")` inside `hello.py`.",
      ],
      starterCode: "# Practice 0.1: save in python-practice/hello.py\n",
      expectedOutput: "Python 3.x.y\nSetup verified!",
      hint: "Open the whole `python-practice/` folder in VS Code so Explorer and Terminal share the same path.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "# Terminal check: python --version\n# Inside hello.py:\nprint(\"Setup verified!\")",
    },
    {
      id: "py-m0-p2",
      title: "Resolve wrong working directory error",
      patternHint: "Use pwd/cd and ls/dir to align your terminal with the folder holding your script.",
      lessonRefId: "py-terminal-files",
      goal: "Fix a `No such file or directory` error when launching `hello.py` from a parent folder.",
      constraints: ["Navigate using cd without hardcoding full disk paths if avoidable"],
      examples: [
        { input: "cd python-practice && ls", output: "hello.py" },
        { input: "python hello.py", output: "Terminal run works!" },
      ],
      tasks: [
        "Inspect current location with `pwd` (or `cd` on Windows cmd).",
        "Move into `python-practice`, confirm `hello.py` exists, and run it.",
      ],
      starterCode: "# Practice 0.2: Terminal navigation commands\n# pwd\n",
      expectedOutput: "hello.py\nTerminal run works!",
      hint: "If already inside `python-practice`, omit `cd python-practice` and run `python hello.py` directly.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "cd python-practice\nls\npython hello.py",
    },
    {
      id: "py-m0-p3",
      title: "Fix unsaved file and typo traceback",
      patternHint: "Read tracebacks bottom-up: error line first, then File/line pointer above it.",
      lessonRefId: "py-terminal-files",
      goal: "Fix both an unsaved-edit symptom and a `NameError: name 'prnit' is not defined` bug on line 2.",
      constraints: ["Fix exact typo reported in traceback", "Save with Ctrl+S / Cmd+S"],
      examples: [
        { input: "Line 1: print(\"Booting...\")", output: "Booting..." },
        { input: "Fixed Line 2: print(\"Done!\")", output: "Done!" },
      ],
      tasks: [
        "Replace `prnit(\"Done!\")` with `print(\"Done!\")`.",
        "Save and run to verify both lines appear.",
      ],
      starterCode: "# Practice 0.3: fix broken script\nprint(\"Booting...\")\nprnit(\"Done!\")\n",
      expectedOutput: "Booting...\nDone!",
      hint: "Check the spelling of `print` on line 2 and save before executing.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "print(\"Booting...\")\nprint(\"Done!\")",
    },
    {
      id: "py-m0-p4",
      title: "Exit REPL vs interrupt a script",
      patternHint: "Distinguish exit() inside Python's >>> prompt from Ctrl+C inside a running script.",
      lessonRefId: "py-terminal-files",
      goal: "Leave an accidental `>>>` REPL session with `exit()`, then interrupt a paused `input()` script from the terminal.",
      constraints: ["Do not type shell commands inside >>>"],
      examples: [
        { input: ">>> exit()", output: "Shell prompt restored" },
        { input: "Ctrl+C during input()", output: "KeyboardInterrupt -> shell prompt" },
      ],
      tasks: [
        "Leave `>>>` using `exit()`.",
        "Run `input(\"Hold: \")` and press `Ctrl+C` inside the terminal pane.",
      ],
      starterCode: "# Practice 0.4: REPL exit vs Ctrl+C test\n# input(\"Hold: \")\n",
      expectedOutput: "Shell prompt restored\nKeyboardInterrupt -> shell prompt",
      hint: "`exit()` quits interactive `>>>` mode; `Ctrl+C` halts an active script waiting on input.",
      complexity: { time: "O(1)", space: "O(1)" },
      solutionCode: "# In >>> REPL: exit()\n# Running wait script: press Ctrl+C in terminal",
    },
  ],
};
