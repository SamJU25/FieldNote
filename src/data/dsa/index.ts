import type { CourseBundle } from "@/data/python";

const DSA_MODULE_LOADERS: Record<string, () => Promise<CourseBundle>> = {
  "dsa-m0": async () => {
    const m = await import("./m00-foundations");
    return { lessons: m.dsaM00Lessons, quizzes: {}, practiceSets: { [m.dsaM00PracticeSet.moduleId]: m.dsaM00PracticeSet } };
  },
  "dsa-m1": async () => {
    const m = await import("./m01-math-number-theory");
    return { lessons: m.dsaM01Lessons, quizzes: {}, practiceSets: { [m.dsaM01PracticeSet.moduleId]: m.dsaM01PracticeSet } };
  },
  "dsa-m2": async () => {
    const m = await import("./m02-bit-manipulation");
    return { lessons: m.dsaM02Lessons, quizzes: {}, practiceSets: { [m.dsaM02PracticeSet.moduleId]: m.dsaM02PracticeSet } };
  },
  "dsa-m3": async () => {
    const m = await import("./m03-arrays-prefixes");
    return { lessons: m.dsaM03Lessons, quizzes: {}, practiceSets: { [m.dsaM03PracticeSet.moduleId]: m.dsaM03PracticeSet } };
  },
  "dsa-m4": async () => {
    const m = await import("./m04-strings");
    return { lessons: m.dsaM04Lessons, quizzes: {}, practiceSets: { [m.dsaM04PracticeSet.moduleId]: m.dsaM04PracticeSet } };
  },
  "dsa-m5": async () => {
    const m = await import("./m05-matrices");
    return { lessons: m.dsaM05Lessons, quizzes: {}, practiceSets: { [m.dsaM05PracticeSet.moduleId]: m.dsaM05PracticeSet } };
  },
  "dsa-m6": async () => {
    const m = await import("./m06-hashing");
    return { lessons: m.dsaM06Lessons, quizzes: {}, practiceSets: { [m.dsaM06PracticeSet.moduleId]: m.dsaM06PracticeSet } };
  },
  "dsa-m7": async () => {
    const m = await import("./m07-two-pointers");
    return { lessons: m.dsaM07Lessons, quizzes: {}, practiceSets: { [m.dsaM07PracticeSet.moduleId]: m.dsaM07PracticeSet } };
  },
  "dsa-m8": async () => {
    const m = await import("./m08-sliding-window");
    return { lessons: m.dsaM08Lessons, quizzes: {}, practiceSets: { [m.dsaM08PracticeSet.moduleId]: m.dsaM08PracticeSet } };
  },
  "dsa-m9": async () => {
    const m = await import("./m09-binary-search");
    return { lessons: m.dsaM09Lessons, quizzes: {}, practiceSets: { [m.dsaM09PracticeSet.moduleId]: m.dsaM09PracticeSet } };
  },
  "dsa-m10": async () => {
    const m = await import("./m10-recursion");
    return { lessons: m.dsaM10Lessons, quizzes: {}, practiceSets: { [m.dsaM10PracticeSet.moduleId]: m.dsaM10PracticeSet } };
  },
  "dsa-m11": async () => {
    const m = await import("./m11-sorting");
    return { lessons: m.dsaM11Lessons, quizzes: {}, practiceSets: { [m.dsaM11PracticeSet.moduleId]: m.dsaM11PracticeSet } };
  },
  "dsa-m12": async () => {
    const m = await import("./m12-linked-lists");
    return { lessons: m.dsaM12Lessons, quizzes: {}, practiceSets: { [m.dsaM12PracticeSet.moduleId]: m.dsaM12PracticeSet } };
  },
  "dsa-m13": async () => {
    const m = await import("./m13-stacks-queues");
    return { lessons: m.dsaM13Lessons, quizzes: {}, practiceSets: { [m.dsaM13PracticeSet.moduleId]: m.dsaM13PracticeSet } };
  },
  "dsa-m14": async () => {
    const m = await import("./m14-trees-bst");
    return { lessons: m.dsaM14Lessons, quizzes: {}, practiceSets: { [m.dsaM14PracticeSet.moduleId]: m.dsaM14PracticeSet } };
  },
  "dsa-m15": async () => {
    const m = await import("./m15-heaps");
    return { lessons: m.dsaM15Lessons, quizzes: {}, practiceSets: { [m.dsaM15PracticeSet.moduleId]: m.dsaM15PracticeSet } };
  },
  "dsa-m16": async () => {
    const m = await import("./m16-greedy-intervals");
    return { lessons: m.dsaM16Lessons, quizzes: {}, practiceSets: { [m.dsaM16PracticeSet.moduleId]: m.dsaM16PracticeSet } };
  },
  "dsa-m17": async () => {
    const m = await import("./m17-backtracking");
    return { lessons: m.dsaM17Lessons, quizzes: {}, practiceSets: { [m.dsaM17PracticeSet.moduleId]: m.dsaM17PracticeSet } };
  },
  "dsa-m18": async () => {
    const m = await import("./m18-graphs-core");
    return { lessons: m.dsaM18Lessons, quizzes: {}, practiceSets: { [m.dsaM18PracticeSet.moduleId]: m.dsaM18PracticeSet } };
  },
  "dsa-m19": async () => {
    const m = await import("./m19-graphs-pro");
    return { lessons: m.dsaM19Lessons, quizzes: {}, practiceSets: { [m.dsaM19PracticeSet.moduleId]: m.dsaM19PracticeSet } };
  },
  "dsa-m20": async () => {
    const m = await import("./m20-dp-core");
    return { lessons: m.dsaM20Lessons, quizzes: {}, practiceSets: { [m.dsaM20PracticeSet.moduleId]: m.dsaM20PracticeSet } };
  },
  "dsa-m21": async () => {
    const m = await import("./m21-dp-pro");
    return { lessons: m.dsaM21Lessons, quizzes: {}, practiceSets: { [m.dsaM21PracticeSet.moduleId]: m.dsaM21PracticeSet } };
  },
  "dsa-m22": async () => {
    const m = await import("./m22-tries-strings");
    return { lessons: m.dsaM22Lessons, quizzes: {}, practiceSets: { [m.dsaM22PracticeSet.moduleId]: m.dsaM22PracticeSet } };
  },
  "dsa-m23": async () => {
    const m = await import("./m23-range-trees");
    return { lessons: m.dsaM23Lessons, quizzes: {}, practiceSets: { [m.dsaM23PracticeSet.moduleId]: m.dsaM23PracticeSet } };
  },
  "dsa-m24": async () => {
    const m = await import("./m24-interview-prep");
    return { lessons: m.dsaM24Lessons, quizzes: {}, practiceSets: { [m.dsaM24PracticeSet.moduleId]: m.dsaM24PracticeSet } };
  },
};

export async function loadDsaModuleBundle(moduleId: string): Promise<CourseBundle> {
  const loader = DSA_MODULE_LOADERS[moduleId];
  return loader ? loader() : { lessons: {}, quizzes: {}, practiceSets: {} };
}

export async function loadDsaBundle(): Promise<CourseBundle> {
  const [
    m0,
    m1,
    m2,
    m3,
    m4,
    m5,
    m6,
    m7,
    m8,
    m9,
    m10,
    m11,
    m12,
    m13,
    m14,
    m15,
    m16,
    m17,
    m18,
    m19,
    m20,
    m21,
    m22,
    m23,
    m24,
  ] = await Promise.all([
    import("./m00-foundations"),
    import("./m01-math-number-theory"),
    import("./m02-bit-manipulation"),
    import("./m03-arrays-prefixes"),
    import("./m04-strings"),
    import("./m05-matrices"),
    import("./m06-hashing"),
    import("./m07-two-pointers"),
    import("./m08-sliding-window"),
    import("./m09-binary-search"),
    import("./m10-recursion"),
    import("./m11-sorting"),
    import("./m12-linked-lists"),
    import("./m13-stacks-queues"),
    import("./m14-trees-bst"),
    import("./m15-heaps"),
    import("./m16-greedy-intervals"),
    import("./m17-backtracking"),
    import("./m18-graphs-core"),
    import("./m19-graphs-pro"),
    import("./m20-dp-core"),
    import("./m21-dp-pro"),
    import("./m22-tries-strings"),
    import("./m23-range-trees"),
    import("./m24-interview-prep"),
  ]);
  return {
    lessons: {
      ...m0.dsaM00Lessons,
      ...m1.dsaM01Lessons,
      ...m2.dsaM02Lessons,
      ...m3.dsaM03Lessons,
      ...m4.dsaM04Lessons,
      ...m5.dsaM05Lessons,
      ...m6.dsaM06Lessons,
      ...m7.dsaM07Lessons,
      ...m8.dsaM08Lessons,
      ...m9.dsaM09Lessons,
      ...m10.dsaM10Lessons,
      ...m11.dsaM11Lessons,
      ...m12.dsaM12Lessons,
      ...m13.dsaM13Lessons,
      ...m14.dsaM14Lessons,
      ...m15.dsaM15Lessons,
      ...m16.dsaM16Lessons,
      ...m17.dsaM17Lessons,
      ...m18.dsaM18Lessons,
      ...m19.dsaM19Lessons,
      ...m20.dsaM20Lessons,
      ...m21.dsaM21Lessons,
      ...m22.dsaM22Lessons,
      ...m23.dsaM23Lessons,
      ...m24.dsaM24Lessons,
    },
    quizzes: {},
    practiceSets: {
      [m0.dsaM00PracticeSet.moduleId]: m0.dsaM00PracticeSet,
      [m1.dsaM01PracticeSet.moduleId]: m1.dsaM01PracticeSet,
      [m2.dsaM02PracticeSet.moduleId]: m2.dsaM02PracticeSet,
      [m3.dsaM03PracticeSet.moduleId]: m3.dsaM03PracticeSet,
      [m4.dsaM04PracticeSet.moduleId]: m4.dsaM04PracticeSet,
      [m5.dsaM05PracticeSet.moduleId]: m5.dsaM05PracticeSet,
      [m6.dsaM06PracticeSet.moduleId]: m6.dsaM06PracticeSet,
      [m7.dsaM07PracticeSet.moduleId]: m7.dsaM07PracticeSet,
      [m8.dsaM08PracticeSet.moduleId]: m8.dsaM08PracticeSet,
      [m9.dsaM09PracticeSet.moduleId]: m9.dsaM09PracticeSet,
      [m10.dsaM10PracticeSet.moduleId]: m10.dsaM10PracticeSet,
      [m11.dsaM11PracticeSet.moduleId]: m11.dsaM11PracticeSet,
      [m12.dsaM12PracticeSet.moduleId]: m12.dsaM12PracticeSet,
      [m13.dsaM13PracticeSet.moduleId]: m13.dsaM13PracticeSet,
      [m14.dsaM14PracticeSet.moduleId]: m14.dsaM14PracticeSet,
      [m15.dsaM15PracticeSet.moduleId]: m15.dsaM15PracticeSet,
      [m16.dsaM16PracticeSet.moduleId]: m16.dsaM16PracticeSet,
      [m17.dsaM17PracticeSet.moduleId]: m17.dsaM17PracticeSet,
      [m18.dsaM18PracticeSet.moduleId]: m18.dsaM18PracticeSet,
      [m19.dsaM19PracticeSet.moduleId]: m19.dsaM19PracticeSet,
      [m20.dsaM20PracticeSet.moduleId]: m20.dsaM20PracticeSet,
      [m21.dsaM21PracticeSet.moduleId]: m21.dsaM21PracticeSet,
      [m22.dsaM22PracticeSet.moduleId]: m22.dsaM22PracticeSet,
      [m23.dsaM23PracticeSet.moduleId]: m23.dsaM23PracticeSet,
      [m24.dsaM24PracticeSet.moduleId]: m24.dsaM24PracticeSet,
    },
  };
}
