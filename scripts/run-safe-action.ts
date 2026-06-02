import { connectToEdge, getTargetPage } from "../src/browser.js";
import { buildCourseState } from "../src/course-state.js";
import { inspectPage } from "../src/inspect.js";
import { appendMarkdown, timestamp } from "../src/markdown.js";
import { classifyAction, type ActionKind } from "../src/safety.js";

const kind = (readArg("--kind") ?? "read") as ActionKind;
const label = readArg("--label");
const command = readArg("--command");
const execute = process.argv.includes("--execute");
const hasCompletionEvidence = process.argv.includes("--completion-evidence");
const labProjectConfirmed = process.argv.includes("--lab-project-confirmed");
const tabArg = process.argv.find((arg) => arg.startsWith("--tab="));
const tabIndex = tabArg ? Number(tabArg.slice("--tab=".length)) : undefined;

const browser = await connectToEdge();
try {
  const page = await getTargetPage(browser, tabIndex);
  const state = buildCourseState(await inspectPage(page));
  const decision = classifyAction({ kind, label, command, hasCompletionEvidence, labProjectConfirmed }, state);

  const result = { dryRun: !execute, action: { kind, label, command }, decision, page: state.safeUrl };
  console.log(JSON.stringify(result, null, 2));

  appendMarkdown("TASK_LOG.md", `
## ${timestamp()}

- Current URL: ${state.safeUrl}
- Current section: ${state.currentSection ?? ""}
- Page type: ${state.pageType}
- Action taken: ${execute ? `${kind} requested` : `${kind} dry run`}
- Reason: ${decision.reasons.join("; ")}
- Whether it was automatic or stopped: ${decision.allowed && execute ? "automatic" : "stopped or dry run"}
- Verification evidence: ${decision.allowed ? "Safety classifier allowed action." : "Safety classifier blocked action."}
- Commands executed: ${kind === "command" && execute ? command ?? "" : ""}
- Files changed: TASK_LOG.md
- Cloud resources touched: none by this script
- Risks: ${decision.risk}
- Next step: ${state.recommendedNextAction}
`);

  if (!decision.allowed || !execute) {
    process.exit(decision.allowed ? 0 : 2);
  }

  if (kind === "click" && label) {
    await page.getByRole("button", { name: new RegExp(`^${escapeRegex(label)}$`, "i") }).click({ timeout: 5000 })
      .catch(async () => {
        await page.getByText(label, { exact: true }).click({ timeout: 5000 });
      });
  }

  if (kind === "command") {
    console.log("Command execution is intentionally not wired to Cloud Shell DOM in the MVP. Use the decision output before adding executor support.");
  }
} finally {
  await browser.close();
}

function readArg(name: string): string | undefined {
  const equals = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (equals) return equals.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
