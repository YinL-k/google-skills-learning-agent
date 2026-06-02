import { chromium, type Browser, type Page } from "playwright";
import { loadConfig } from "./config.js";
import { redactText, safeUrl } from "./redaction.js";

export interface SafeTab {
  index: number;
  title: string;
  domain: string;
  safeUrl: string;
  isGoogleSkills: boolean;
}

export async function connectToEdge(): Promise<Browser> {
  const config = loadConfig();
  return chromium.connectOverCDP(config.edgeCdpUrl);
}

export async function getPages(browser: Browser): Promise<Page[]> {
  return browser.contexts().flatMap((context) => context.pages());
}

export async function getTargetPage(browser: Browser, preferredIndex?: number): Promise<Page> {
  const pages = await getPages(browser);
  if (pages.length === 0) {
    throw new Error("No open Edge tabs were found over CDP.");
  }
  if (typeof preferredIndex === "number") {
    const selected = pages[preferredIndex];
    if (!selected) throw new Error(`No tab exists at index ${preferredIndex}.`);
    return selected;
  }

  const skillsPage = pages.find((page) => isGoogleSkillsUrl(page.url()));
  return skillsPage ?? pages[0];
}

export async function listSafeTabs(browser: Browser): Promise<SafeTab[]> {
  const pages = await getPages(browser);
  return Promise.all(
    pages.map(async (page, index) => {
      const url = page.url();
      return {
        index,
        title: redactText(await page.title().catch(() => "")),
        domain: domainFromUrl(url),
        safeUrl: safeUrl(url),
        isGoogleSkills: isGoogleSkillsUrl(url)
      };
    })
  );
}

export function isGoogleSkillsUrl(url: string): boolean {
  return /cloudskillsboost\.google|qwiklabs|skills\.cloud\.google|skills\.google/i.test(url);
}

function domainFromUrl(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return "";
  }
}
