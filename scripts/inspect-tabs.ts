import { connectToEdge, listSafeTabs } from "../src/browser.js";

const browser = await connectToEdge();
try {
  console.log(JSON.stringify(await listSafeTabs(browser), null, 2));
} finally {
  await browser.close();
}
