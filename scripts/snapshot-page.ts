import fs from "node:fs";
import path from "node:path";
import { connectToEdge, getTargetPage } from "../src/browser.js";
import { loadConfig, resolveProjectPath } from "../src/config.js";
import { buildCourseState } from "../src/course-state.js";
import { inspectPage } from "../src/inspect.js";
import { redactObject } from "../src/redaction.js";

const config = loadConfig();
const tabArg = process.argv.find((arg) => arg.startsWith("--tab="));
const tabIndex = tabArg ? Number(tabArg.slice("--tab=".length)) : undefined;

const browser = await connectToEdge();
try {
  const page = await getTargetPage(browser, tabIndex);
  const state = redactObject(buildCourseState(await inspectPage(page)));
  const snapshotDir = resolveProjectPath(config.snapshotDir);
  fs.mkdirSync(snapshotDir, { recursive: true });
  const snapshotPath = path.join(snapshotDir, `snapshot-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(snapshotPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  console.log(snapshotPath);
} finally {
  await browser.close();
}
