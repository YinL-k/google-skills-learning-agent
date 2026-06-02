import { connectToEdge, getTargetPage } from "../src/browser.js";
import { buildCourseState } from "../src/course-state.js";
import { inspectPage } from "../src/inspect.js";
import { classifyAction } from "../src/safety.js";

const text = readArg("--text");
const execute = process.argv.includes("--execute");
const hasCompletionEvidence = process.argv.includes("--completion-evidence");
const tabArg = process.argv.find((arg) => arg.startsWith("--tab="));
const tabIndex = tabArg ? Number(tabArg.slice("--tab=".length)) : undefined;

if (!text) {
  throw new Error('Usage: npm run click-by-text -- --text "Next" [--execute] [--completion-evidence]');
}

const browser = await connectToEdge();
try {
  const page = await getTargetPage(browser, tabIndex);
  const state = buildCourseState(await inspectPage(page));
  const decision = classifyAction({ kind: "click", label: text, hasCompletionEvidence }, state);
  console.log(JSON.stringify({ dryRun: !execute, text, decision }, null, 2));

  if (!decision.allowed || !execute) {
    process.exit(decision.allowed ? 0 : 2);
  }

  await page.getByRole("button", { name: new RegExp(`^${escapeRegex(text)}$`, "i") }).click({ timeout: 5000 })
    .catch(async () => {
      await page.getByText(text, { exact: true }).click({ timeout: 5000 });
    });
  console.log(JSON.stringify({ clicked: text }, null, 2));
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
