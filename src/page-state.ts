export type PageType =
  | "lesson"
  | "lab"
  | "quiz"
  | "assessment"
  | "progress-check"
  | "overview"
  | "cloud-console"
  | "cloud-shell"
  | "login"
  | "unknown";

export interface PageSnapshot {
  title: string;
  url: string;
  safeUrl: string;
  headings: string[];
  buttons: string[];
  warnings: string[];
  codeBlocks: string[];
  currentSection: string | null;
  currentTask: string | null;
  visibleTextSample: string;
  pageType: PageType;
  credentialsVisible: boolean;
  cloudShellNeeded: boolean;
  labProjectConfidence: "confirmed" | "possible" | "missing" | "ambiguous";
}

export interface CourseState extends PageSnapshot {
  courseTitle: string | null;
  currentModule: string | null;
  currentLessonOrLab: string | null;
  visibleCommands: string[];
  isAssessmentOrQuiz: boolean;
  hardStopRequired: boolean;
  hardStopReasons: string[];
  recommendedNextAction: string;
}

export function classifyPageType(text: string, url: string, buttons: string[]): PageType {
  const haystack = `${text}\n${url}\n${buttons.join("\n")}`.toLowerCase();
  if (/\/quizzes\//.test(url)) return "quiz";
  if (/\/labs\//.test(url)) return "lab";
  if (/\/video\//.test(url)) return "lesson";
  if (/\/course_templates\//.test(url)) return "overview";
  if (/accounts\.google\.com|sign in|choose an account|login|log in|登录|登入|加入/.test(haystack)) return "login";
  if (/certification|exam|assessment|graded assessment|submit assessment/.test(haystack)) return "assessment";
  if (/submit quiz|check your knowledge/.test(haystack)) return "quiz";
  if (/check my progress|progress check/.test(haystack)) return "progress-check";
  if (/shell\.cloud\.google|cloud shell|terminal/.test(haystack)) return "cloud-shell";
  if (/console\.cloud\.google|google cloud console/.test(haystack)) return "cloud-console";
  if (/\blab\b|qwiklabs|cloud skills boost/.test(haystack)) return "lab";
  if (/lesson|module|course/.test(haystack)) return "lesson";
  if (/overview|introduction/.test(haystack)) return "overview";
  return "unknown";
}

export function detectCredentialsVisible(text: string): boolean {
  return /username|password|temporary credentials|student account|lab credentials|copy password/i.test(text);
}

export function detectCloudShellNeeded(text: string): boolean {
  return /cloud shell|open terminal|activate cloud shell|gcloud |kubectl |terraform |python |npm |pip /i.test(text);
}

export function detectLabProjectConfidence(text: string): CourseState["labProjectConfidence"] {
  if (/personal project|billing account|my project|free trial/i.test(text)) return "ambiguous";
  if (/lab project|qwiklabs-gcp|project id|temporary project/i.test(text)) return "possible";
  if (/active project.+lab|lab project.+active|project.+confirmed/i.test(text)) return "confirmed";
  return "missing";
}

export function extractVisibleCommands(codeBlocks: string[]): string[] {
  return codeBlocks
    .map((block) => block.trim())
    .filter((block) => /^(gcloud|gsutil|bq|kubectl|terraform|python|pip|npm|node|curl|git|cat|cd|mkdir|touch|export)\b/m.test(block));
}
