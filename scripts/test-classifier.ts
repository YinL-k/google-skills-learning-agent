import { buildCourseState } from "../src/course-state.js";
import { classifyAction } from "../src/safety.js";
import type { PageSnapshot } from "../src/page-state.js";

const base: PageSnapshot = {
  title: "Mock",
  url: "https://www.cloudskillsboost.google/course_sessions/mock",
  safeUrl: "https://www.cloudskillsboost.google/course_sessions/mock",
  headings: ["Mock lesson"],
  buttons: ["Next"],
  warnings: [],
  codeBlocks: [],
  currentSection: "Mock lesson",
  currentTask: null,
  visibleTextSample: "This is a normal lesson about ADK.",
  pageType: "lesson",
  credentialsVisible: false,
  cloudShellNeeded: false,
  labProjectConfidence: "possible"
};

const scenarios: Array<[string, PageSnapshot, boolean]> = [
  ["allows safe next", base, true],
  ["blocks login", { ...base, visibleTextSample: "Sign in Choose an account", pageType: "login" }, false],
  ["blocks billing", { ...base, visibleTextSample: "Enable billing to continue" }, false],
  ["blocks quiz", { ...base, visibleTextSample: "Module quiz Submit quiz", pageType: "quiz" }, false],
  ["blocks end lab", { ...base, visibleTextSample: "End Lab", buttons: ["End Lab"] }, false],
  ["blocks ambiguous personal project", { ...base, visibleTextSample: "Personal project selected", labProjectConfidence: "ambiguous" }, false]
];

for (const [name, snapshot, expectedAllowed] of scenarios) {
  const state = buildCourseState(snapshot);
  const decision = classifyAction({ kind: "click", label: "Next" }, state);
  if (decision.allowed !== expectedAllowed) {
    throw new Error(`${name}: expected allowed=${expectedAllowed}, got ${decision.allowed}. Reasons: ${decision.reasons.join("; ")}`);
  }
  console.log(`${name}: ok`);
}
