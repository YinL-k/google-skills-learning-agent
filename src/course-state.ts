import type { CourseState, PageSnapshot } from "./page-state.js";
import { extractVisibleCommands } from "./page-state.js";
import { findHardStopReasons } from "./safety.js";

export function buildCourseState(snapshot: PageSnapshot): CourseState {
  const hardStopReasons = findHardStopReasons(snapshot);
  const visibleCommands = extractVisibleCommands(snapshot.codeBlocks);
  const isAssessmentOrQuiz = snapshot.pageType === "quiz" || snapshot.pageType === "assessment";

  return {
    ...snapshot,
    courseTitle: snapshot.headings[0] ?? findLine(snapshot.visibleTextSample, /Deploy Multi-Agent Systems|course/i),
    currentModule: findLine(snapshot.visibleTextSample, /module\s+\d+|module:/i),
    currentLessonOrLab: snapshot.currentSection,
    visibleCommands,
    isAssessmentOrQuiz,
    hardStopRequired: hardStopReasons.length > 0 || isAssessmentOrQuiz,
    hardStopReasons,
    recommendedNextAction: recommendNextAction(snapshot, hardStopReasons, visibleCommands)
  };
}

function recommendNextAction(snapshot: PageSnapshot, hardStopReasons: string[], visibleCommands: string[]): string {
  if (hardStopReasons.length > 0) return "Stop and ask the user to resolve the hard blocker.";
  if (snapshot.pageType === "quiz" || snapshot.pageType === "assessment") return "Stop for manual quiz or assessment handling.";
  if (visibleCommands.length > 0 && snapshot.cloudShellNeeded) return "Review visible tutorial commands and run only after lab project/account confirmation.";
  if (snapshot.buttons.some((button) => /^next$/i.test(button))) return "Click Next after checkpoint notes are written.";
  if (snapshot.buttons.some((button) => /continue/i.test(button))) return "Click Continue after checkpoint notes are written.";
  return "Record notes and inspect the next visible instruction.";
}

function findLine(text: string, pattern: RegExp): string | null {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((line) => line.trim())
    .find((line) => pattern.test(line))
    ?.slice(0, 200) ?? null;
}
