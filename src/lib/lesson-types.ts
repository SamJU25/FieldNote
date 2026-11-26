export type CalloutKind = "PICTURE IT" | "WATCH OUT" | "KEY IDEA" | "RULE OF THUMB";

export type StepTag = "CONCEPT" | "TRACE" | "MEMORY" | "PITFALL" | "PATTERN" | "CHECK";

export type PipelineNode = {
  id: string;
  label: string;
  sublabel?: string;
  active?: boolean;
  tone?: "accent" | "warm" | "muted" | "ok";
};

export type PipelineFlowVisual = {
  kind: "pipeline";
  caption?: string;
  nodes: PipelineNode[];
  links: { from: string; to: string; label?: string; active?: boolean }[];
};

export type MemoryFrame = {
  name: string;
  bindings: { label: string; targetId: string; highlight?: boolean }[];
};

export type MemoryObject = {
  id: string;
  typeLabel: string;
  value: string;
  cells?: { index: string; value: string; active?: boolean; dim?: boolean }[];
  mutable?: boolean;
  highlight?: boolean;
};

export type MemoryBoxesVisual = {
  kind: "memory";
  caption?: string;
  frames: MemoryFrame[];
  objects: MemoryObject[];
};

export type BranchNode = {
  id: string;
  label: string;
  status: "active" | "skipped" | "pending" | "true" | "false";
};

export type ExecutionTraceVisual = {
  kind: "trace";
  caption?: string;
  iteration?: string;
  branches: BranchNode[];
};

export type ComplexityBar = {
  label: string;
  formula: string;
  steps: number;
  maxSteps: number;
  active?: boolean;
};

export type ComplexityVisual = {
  kind: "complexity";
  caption?: string;
  inputSizeLabel: string;
  bars: ComplexityBar[];
};

export type ComparisonRow = {
  left: string;
  right: string;
  note?: string;
  highlight?: boolean;
};

export type ComparisonVisual = {
  kind: "compare";
  leftTitle: string;
  rightTitle: string;
  rows: ComparisonRow[];
};

export type OperatorPreset = {
  label: string;
  left: string;
  op: string;
  right: string;
  result: string;
  typeName: string;
  frequency?: string;
  note: string;
};

export type TypeCastItem = {
  raw: string;
  typeLabel: string;
  asInt: string;
  asFloat: string;
  asStr: string;
  asBool: string;
  note: string;
};

export type CallStackFrame = {
  fn: string;
  line: number;
  status?: "active" | "suspended" | "unwinding";
};

export type LoopIteration = {
  label: string;
  activeLine: number;
  vars: StateEntry[];
  output: string;
  status?: string;
  callStack?: CallStackFrame[];
};

export type AsyncTimelineSegment = {
  startMs: number;
  endMs: number;
  state: "running" | "waiting" | "blocked" | "cancelled";
  label: string;
};

export type AsyncTimelineScenario = {
  label: string;
  summary: string;
  totalMs: number;
  gilNote?: string;
  lanes: {
    name: string;
    segments: AsyncTimelineSegment[];
  }[];
};

export type RegexPreset = {
  label: string;
  mode: "search" | "fullmatch" | "findall" | "sub";
  pattern: string;
  text: string;
  replacement?: string;
  matches: {
    start: number;
    end: number;
    groups?: Record<string, string>;
  }[];
  resultText: string;
  note: string;
};

export type MemoryScenario = {
  label: string;
  code: string[];
  steps: {
    line: number;
    note: string;
    frames: MemoryFrame[];
    objects: MemoryObject[];
  }[];
};

export type InteractiveWidgetVisual =
  | {
      kind: "operator-lab";
      caption?: string;
      presets: OperatorPreset[];
    }
  | {
      kind: "type-cast-lab";
      caption?: string;
      items: TypeCastItem[];
    }
  | {
      kind: "slice-explorer";
      caption?: string;
      items: string[];
      mode?: "list" | "string";
      initialStart?: number;
      initialStop?: number | null;
      initialStep?: number;
    }
  | {
      kind: "loop-stepper";
      caption?: string;
      code: string[];
      iterations: LoopIteration[];
    }
  | {
      kind: "memory-sim";
      caption?: string;
      scenarios: MemoryScenario[];
    }
  | {
      kind: "async-timeline";
      caption?: string;
      scenarios: AsyncTimelineScenario[];
    }
  | {
      kind: "regex-lab";
      caption?: string;
      presets: RegexPreset[];
    };

export type DsaGrowthTier = "const" | "log" | "linear" | "quad";

export type DsaGrowthVisual = {
  kind: "dsa-growth";
  caption?: string;
  n: number;
  activeTier?: DsaGrowthTier | "all";
  tiers: {
    id: DsaGrowthTier;
    label: string;
    name: string;
    steps: number;
  }[];
};

export type DsaArrayPointer = {
  index: number;
  label: string;
  tone?: "accent" | "coral" | "ok";
};

export type DsaArrayCell = {
  id?: string;
  value: string;
  index?: number;
  state?: "default" | "active" | "done" | "dim" | "pivot";
};

export type DsaArrayVisual = {
  kind: "dsa-array";
  caption?: string;
  trays: {
    label?: string;
    cells: DsaArrayCell[];
    pointers?: DsaArrayPointer[];
    highlightRange?: [number, number];
  }[];
};

export type DsaStructureNode = {
  id: string;
  label: string;
  sub?: string;
  state?: "default" | "active" | "done" | "dim";
  breaksChain?: boolean;
};

export type DsaStructureVisual = {
  kind: "dsa-structure";
  caption?: string;
  mode: "stack" | "queue" | "linked-list";
  linkKind?: "singly" | "doubly" | "cycle";
  cycleTarget?: string;
  title?: string;
  items: DsaStructureNode[];
};

export type DsaGraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  badge?: string;
  state?: "default" | "active" | "visited" | "queued" | "dim";
};

export type DsaGraphEdge = {
  from: string;
  to: string;
  weight?: string;
  directed?: boolean;
  state?: "default" | "active" | "dim";
};

export type DsaGraphVisual = {
  kind: "dsa-graph";
  caption?: string;
  nodes: DsaGraphNode[];
  edges: DsaGraphEdge[];
};

export type DsaDpCell = {
  r: number;
  c: number;
  value: string;
  state?: "default" | "active" | "source" | "optimal" | "dim";
};

export type DsaDpGridVisual = {
  kind: "dsa-dp-grid";
  caption?: string;
  rowHeaders: string[];
  colHeaders: string[];
  cells: DsaDpCell[];
  formulaNote?: string;
};

export type DsaDivideGroup = {
  label?: string;
  values: string[];
  cellIds?: (string | undefined)[];
  state?: "default" | "active" | "pivot" | "done" | "dim";
  note?: string;
  pointerIndex?: number;
  pointerLabel?: string;
};

export type DsaDivideLevel = {
  label: string;
  groups: DsaDivideGroup[];
};

export type DsaDivideVisual = {
  kind: "dsa-divide";
  caption?: string;
  levels: DsaDivideLevel[];
};

export type LessonVisual =
  | PipelineFlowVisual
  | MemoryBoxesVisual
  | ExecutionTraceVisual
  | ComplexityVisual
  | ComparisonVisual
  | InteractiveWidgetVisual
  | DsaGrowthVisual
  | DsaArrayVisual
  | DsaStructureVisual
  | DsaGraphVisual
  | DsaDpGridVisual
  | DsaDivideVisual;

export type ReferenceTable = {
  caption?: string;
  headers: string[];
  rows: string[][];
  highlightCol?: number;
};

export type GuidedBuildStep = {
  label: string;
  explanation: string;
  code: string[];
  activeLines?: number[];
  output?: string;
};

export type GuidedBuildUp = {
  title: string;
  subtitle?: string;
  steps: GuidedBuildStep[];
};

export type CodeSubgoal = {
  line: number;
  label: string;
};

export type StateEntry = {
  name: string;
  value: string;
  changed?: boolean;
};

export type LessonSection = {
  heading: string;
  paragraphs: string[];
  code?: string[];
  codeLabel?: string;
  output?: string;
  table?: ReferenceTable;
  visual?: LessonVisual;
  callout?: { kind: CalloutKind; text: string };
};

export type WalkthroughStep = {
  title: string;
  tag: StepTag;
  explanation: string[];
  callout?: { kind: CalloutKind; text: string };
  code?: string[];
  codeLabel?: string;
  altCode?: {
    label: string;
    lines: string[];
    activeLines?: number[];
  };
  activeLines?: number[];
  subgoals?: CodeSubgoal[];
  state?: StateEntry[];
  output?: string;
  visual?: LessonVisual;
};

export type TrickyPoint = {
  title: string;
  detail: string;
  code?: string;
};

export type PredictQuestion = {
  prompt: string;
  code: string;
  options: { id: string; label: string }[];
  correctId: string;
  explanation: string;
};

export type PracticeExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type PracticeChallenge = {
  id?: string;
  title: string;
  tier?: "Warmup" | "Core" | "Stretch" | "Debug";
  patternHint?: string;
  lessonRefId?: string;
  goal: string;
  constraints?: string[];
  examples?: PracticeExample[];
  tasks: string[];
  starterCode?: string;
  expectedOutput?: string;
  hint: string;
  solutionCode: string;
  complexity?: {
    time: string;
    space: string;
  };
};

export type LessonIntro = {
  heading: string;
  explanation: string[];
  analogy?: string;
  realWorldUses?: string[];
};

export type LessonContent = {
  lessonId: string;
  subtitle: string;
  intro?: LessonIntro;
  sections: LessonSection[];
  guidedBuildUp?: GuidedBuildUp;
  walkthrough?: {
    title: string;
    layout?: "visual-first" | "standard";
    steps: WalkthroughStep[];
  };
  trickyPoints: TrickyPoint[];
  predictCheck?: PredictQuestion;
  predictChecks?: PredictQuestion[];
  practiceTask: PracticeChallenge;
  practiceChallenges?: PracticeChallenge[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  code?: string;
  options: { id: string; label: string }[];
  correctId: string;
  explanation: string;
  lessonRefId?: string;
};

export type ModuleQuiz = {
  moduleId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
};

export type ModulePracticeSet = {
  moduleId: string;
  title: string;
  description: string;
  problems: PracticeChallenge[];
};
