import { connectToEdge, getTargetPage } from "../src/browser.js";
import { inspectPage } from "../src/inspect.js";

const tabArg = process.argv.find((arg) => arg.startsWith("--tab="));
const tabIndex = tabArg ? Number(tabArg.slice("--tab=".length)) : undefined;

const browser = await connectToEdge();
try {
  const page = await getTargetPage(browser, tabIndex);
  console.log(JSON.stringify(await inspectPage(page), null, 2));
} finally {
  await browser.close();
}
