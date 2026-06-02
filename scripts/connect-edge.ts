import { connectToEdge, listSafeTabs } from "../src/browser.js";

const browser = await connectToEdge();
try {
  const tabs = await listSafeTabs(browser);
  console.log(JSON.stringify({
    connected: true,
    tabsFound: tabs.length,
    googleSkillsTabsFound: tabs.filter((tab) => tab.isGoogleSkills).length,
    tabs
  }, null, 2));
} finally {
  await browser.close();
}
