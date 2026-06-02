import type { CourseState, PageSnapshot } from "./page-state.js";

export type ActionKind = "click" | "command" | "read" | "snapshot";

export interface ActionRequest {
  kind: ActionKind;
  label?: string;
  command?: string;
  hasCompletionEvidence?: boolean;
  labProjectConfirmed?: boolean;
}

export interface SafetyDecision {
  allowed: boolean;
  hardStop: boolean;
  risk: "low" | "medium" | "high";
  reasons: string[];
}

const prohibitedLabelPattern = /submit quiz|submit assessment|start exam|end lab|delete|confirm delete|purchase|upgrade|free trial|enable billing|authorize|allow access|choose an account|sign in|login|登录|登入|加入/i;
const safeLabelPattern = /^(next|continue|back|expand|collapse|copy|open instructions|open cloud shell|open google cloud console|close|done)$/i;
const destructiveCommandPattern = /\b(gcloud\s+projects\s+delete|gcloud\s+iam|delete|remove|rm\s+-rf|revoke|disable|destroy)\b/i;
const bypassPattern = /localStorage|document\.cookie|hidden api|answer key|fake completion|bypass|payload/i;

export function findHardStopReasons(state: Pick<PageSnapshot, "pageType" | "visibleTextSample" | "warnings" | "credentialsVisible" | "labProjectConfidence" | "buttons">): string[] {
  const text = `${state.visibleTextSample}\n${state.warnings.join("\n")}\n${state.buttons.join("\n")}`;
  const reasons: string[] = [];

  if (state.pageType === "login" || /sign in|choose an account|login|re-authentication|登录|登入|登录或加入/i.test(text)) {
    reasons.push("Login, account selection, or re-authentication is required.");
  }
  if (state.credentialsVisible) {
    reasons.push("Credentials are visible or credential entry may be required.");
  }
  if (/personal google account|personal account/i.test(text)) {
    reasons.push("The page may involve a personal Google account.");
  }
  if (state.labProjectConfidence === "ambiguous" || /personal project|wrong project/i.test(text)) {
    reasons.push("The active Google Cloud project may be personal or ambiguous.");
  }
  if (/billing|payment|free trial|credits|pricing|cost warning|buy subscription/i.test(text)) {
    reasons.push("Billing, payment, credits, pricing, or cost warning is visible.");
  }
  if (/captcha|security verification|identity verification|suspicious activity|anti-bot/i.test(text)) {
    reasons.push("Security, CAPTCHA, or anti-bot verification is visible.");
  }
  if (state.pageType === "quiz" || state.pageType === "assessment" || /official quiz|graded question|exam|certification assessment|submit quiz|submit assessment/i.test(text)) {
    reasons.push("Quiz, exam, or assessment content requires manual handling.");
  }
  if (/end lab/i.test(text)) {
    reasons.push("End Lab is visible and must not be clicked automatically.");
  }
  if (bypassPattern.test(text)) {
    reasons.push("Potential platform bypass or answer-key behavior is present.");
  }

  return [...new Set(reasons)];
}

export function classifyAction(action: ActionRequest, state?: Partial<CourseState>): SafetyDecision {
  const reasons: string[] = [];
  let risk: SafetyDecision["risk"] = "low";

  if (state?.hardStopRequired) {
    reasons.push(...(state.hardStopReasons ?? ["Current page has a hard stop."]));
    return { allowed: false, hardStop: true, risk: "high", reasons: [...new Set(reasons)] };
  }

  if (action.kind === "read" || action.kind === "snapshot") {
    return { allowed: true, hardStop: false, risk, reasons: ["Read-only action."] };
  }

  if (action.kind === "click") {
    const label = action.label ?? "";
    if (prohibitedLabelPattern.test(label)) {
      return { allowed: false, hardStop: true, risk: "high", reasons: [`Click label is prohibited or requires manual handling: ${label}`] };
    }
    if (/check my progress/i.test(label) && !action.hasCompletionEvidence) {
      return { allowed: false, hardStop: false, risk: "medium", reasons: ["Check my progress requires completion evidence first."] };
    }
    if (safeLabelPattern.test(label) || /check my progress/i.test(label)) {
      return { allowed: true, hardStop: false, risk, reasons: [`Allowed visible UI action: ${label}`] };
    }
    return { allowed: false, hardStop: false, risk: "medium", reasons: [`Unrecognized click label requires review: ${label}`] };
  }

  if (action.kind === "command") {
    const command = action.command ?? "";
    risk = "medium";
    if (!action.labProjectConfirmed) {
      reasons.push("Cloud Shell command requires confirmed lab project/account context.");
    }
    if (destructiveCommandPattern.test(command)) {
      reasons.push("Command appears destructive and requires explicit lab-context review.");
      risk = "high";
    }
    if (bypassPattern.test(command)) {
      reasons.push("Command appears related to platform bypass or hidden state manipulation.");
      risk = "high";
    }
    if (reasons.length > 0) {
      return { allowed: false, hardStop: risk === "high", risk, reasons };
    }
    return { allowed: true, hardStop: false, risk, reasons: ["Command is allowed after lab project confirmation."] };
  }

  return { allowed: false, hardStop: false, risk: "medium", reasons: ["Unsupported action kind."] };
}
