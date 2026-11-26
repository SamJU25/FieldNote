import type { LessonContent, ModulePracticeSet, ModuleQuiz } from "@/lib/lesson-types";

export type CourseBundle = {
  lessons: Record<string, LessonContent>;
  quizzes: Record<string, ModuleQuiz>;
  practiceSets?: Record<string, ModulePracticeSet>;
};

const PY_MODULE_LOADERS: Record<string, () => Promise<CourseBundle>> = {
  "py-m0": async () => {
    const m = await import("./m00-setup-cli");
    return {
      lessons: m.m00Lessons,
      quizzes: { [m.m00Quiz.moduleId]: m.m00Quiz },
      practiceSets: { [m.m00PracticeSet.moduleId]: m.m00PracticeSet },
    };
  },
  "py-m1": async () => {
    const m = await import("./m01-first-steps");
    return {
      lessons: m.m01Lessons,
      quizzes: { [m.m01Quiz.moduleId]: m.m01Quiz },
      practiceSets: { [m.m01PracticeSet.moduleId]: m.m01PracticeSet },
    };
  },
  "py-m2": async () => {
    const m = await import("./m02-decisions");
    return {
      lessons: m.m02Lessons,
      quizzes: { [m.m02Quiz.moduleId]: m.m02Quiz },
      practiceSets: { [m.m02PracticeSet.moduleId]: m.m02PracticeSet },
    };
  },
  "py-m3": async () => {
    const m = await import("./m03-lists-for");
    return {
      lessons: m.m03Lessons,
      quizzes: { [m.m03Quiz.moduleId]: m.m03Quiz },
      practiceSets: { [m.m03PracticeSet.moduleId]: m.m03PracticeSet },
    };
  },
  "py-m4": async () => {
    const m = await import("./m04-while-strings-grids");
    return {
      lessons: m.m04Lessons,
      quizzes: { [m.m04Quiz.moduleId]: m.m04Quiz },
      practiceSets: { [m.m04PracticeSet.moduleId]: m.m04PracticeSet },
    };
  },
  "py-m5": async () => {
    const m = await import("./m05-functions");
    return {
      lessons: m.m05Lessons,
      quizzes: { [m.m05Quiz.moduleId]: m.m05Quiz },
      practiceSets: { [m.m05PracticeSet.moduleId]: m.m05PracticeSet },
    };
  },
  "py-m6": async () => {
    const m = await import("./m06-collections-refs");
    return {
      lessons: m.m06Lessons,
      quizzes: { [m.m06Quiz.moduleId]: m.m06Quiz },
      practiceSets: { [m.m06PracticeSet.moduleId]: m.m06PracticeSet },
    };
  },
  "py-m7": async () => {
    const m = await import("./m07-errors-files-stdlib");
    return {
      lessons: m.m07Lessons,
      quizzes: { [m.m07Quiz.moduleId]: m.m07Quiz },
      practiceSets: { [m.m07PracticeSet.moduleId]: m.m07PracticeSet },
    };
  },
  "py-m8": async () => {
    const m = await import("./m08-oop");
    return {
      lessons: m.m08Lessons,
      quizzes: { [m.m08Quiz.moduleId]: m.m08Quiz },
      practiceSets: { [m.m08PracticeSet.moduleId]: m.m08PracticeSet },
    };
  },
  "py-m9": async () => {
    const m = await import("./m09-deeper-engineering");
    return {
      lessons: m.m09Lessons,
      quizzes: { [m.m09Quiz.moduleId]: m.m09Quiz },
      practiceSets: { [m.m09PracticeSet.moduleId]: m.m09PracticeSet },
    };
  },
  "py-m10": async () => {
    const m = await import("./m10-data-model-stdlib");
    return {
      lessons: m.m10Lessons,
      quizzes: { [m.m10Quiz.moduleId]: m.m10Quiz },
      practiceSets: { [m.m10PracticeSet.moduleId]: m.m10PracticeSet },
    };
  },
  "py-m11": async () => {
    const m = await import("./m11-concurrency-async");
    return {
      lessons: m.m11Lessons,
      quizzes: { [m.m11Quiz.moduleId]: m.m11Quiz },
      practiceSets: { [m.m11PracticeSet.moduleId]: m.m11PracticeSet },
    };
  },
  "py-m12": async () => {
    const m = await import("./m12-production-capstone");
    return {
      lessons: m.m12Lessons,
      quizzes: { [m.m12Quiz.moduleId]: m.m12Quiz },
      practiceSets: { [m.m12PracticeSet.moduleId]: m.m12PracticeSet },
    };
  },
};

export async function loadModuleBundle(courseId: string, moduleId: string): Promise<CourseBundle> {
  if (courseId === "python") {
    const loader = PY_MODULE_LOADERS[moduleId];
    return loader ? loader() : { lessons: {}, quizzes: {}, practiceSets: {} };
  }
  if (courseId === "dsa") {
    const { loadDsaModuleBundle } = await import("../dsa/index");
    return loadDsaModuleBundle(moduleId);
  }
  return { lessons: {}, quizzes: {}, practiceSets: {} };
}

export async function loadCourseBundle(courseId: string): Promise<CourseBundle> {
  if (courseId === "python") {
    const [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12] = await Promise.all([
      import("./m00-setup-cli"),
      import("./m01-first-steps"),
      import("./m02-decisions"),
      import("./m03-lists-for"),
      import("./m04-while-strings-grids"),
      import("./m05-functions"),
      import("./m06-collections-refs"),
      import("./m07-errors-files-stdlib"),
      import("./m08-oop"),
      import("./m09-deeper-engineering"),
      import("./m10-data-model-stdlib"),
      import("./m11-concurrency-async"),
      import("./m12-production-capstone"),
    ]);
    return {
      lessons: {
        ...m0.m00Lessons,
        ...m1.m01Lessons,
        ...m2.m02Lessons,
        ...m3.m03Lessons,
        ...m4.m04Lessons,
        ...m5.m05Lessons,
        ...m6.m06Lessons,
        ...m7.m07Lessons,
        ...m8.m08Lessons,
        ...m9.m09Lessons,
        ...m10.m10Lessons,
        ...m11.m11Lessons,
        ...m12.m12Lessons,
      },
      quizzes: {
        [m0.m00Quiz.moduleId]: m0.m00Quiz,
        [m1.m01Quiz.moduleId]: m1.m01Quiz,
        [m2.m02Quiz.moduleId]: m2.m02Quiz,
        [m3.m03Quiz.moduleId]: m3.m03Quiz,
        [m4.m04Quiz.moduleId]: m4.m04Quiz,
        [m5.m05Quiz.moduleId]: m5.m05Quiz,
        [m6.m06Quiz.moduleId]: m6.m06Quiz,
        [m7.m07Quiz.moduleId]: m7.m07Quiz,
        [m8.m08Quiz.moduleId]: m8.m08Quiz,
        [m9.m09Quiz.moduleId]: m9.m09Quiz,
        [m10.m10Quiz.moduleId]: m10.m10Quiz,
        [m11.m11Quiz.moduleId]: m11.m11Quiz,
        [m12.m12Quiz.moduleId]: m12.m12Quiz,
      },
      practiceSets: {
        [m0.m00PracticeSet.moduleId]: m0.m00PracticeSet,
        [m1.m01PracticeSet.moduleId]: m1.m01PracticeSet,
        [m2.m02PracticeSet.moduleId]: m2.m02PracticeSet,
        [m3.m03PracticeSet.moduleId]: m3.m03PracticeSet,
        [m4.m04PracticeSet.moduleId]: m4.m04PracticeSet,
        [m5.m05PracticeSet.moduleId]: m5.m05PracticeSet,
        [m6.m06PracticeSet.moduleId]: m6.m06PracticeSet,
        [m7.m07PracticeSet.moduleId]: m7.m07PracticeSet,
        [m8.m08PracticeSet.moduleId]: m8.m08PracticeSet,
        [m9.m09PracticeSet.moduleId]: m9.m09PracticeSet,
        [m10.m10PracticeSet.moduleId]: m10.m10PracticeSet,
        [m11.m11PracticeSet.moduleId]: m11.m11PracticeSet,
        [m12.m12PracticeSet.moduleId]: m12.m12PracticeSet,
      },
    };
  }
  if (courseId === "dsa") {
    const { loadDsaBundle } = await import("../dsa/index");
    return loadDsaBundle();
  }
  return { lessons: {}, quizzes: {} };
}
