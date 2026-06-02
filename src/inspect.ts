import type { Page } from "playwright";
import { classifyPageType, detectCloudShellNeeded, detectCredentialsVisible, detectLabProjectConfidence, type PageSnapshot } from "./page-state.js";
import { redactText, safeUrl } from "./redaction.js";

interface RawPageInspection {
  title: string;
  url: string;
  headings: string[];
  buttons: string[];
  warnings: string[];
  codeBlocks: string[];
  visibleTextSample: string;
}

export async function inspectPage(page: Page): Promise<PageSnapshot> {
  const raw = await page.evaluate(String.raw`(() => {
    const visible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
    };
    const textOf = (selector, limit) =>
      Array.from(document.querySelectorAll(selector))
        .filter(visible)
        .map((node) => (node.textContent ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .slice(0, limit);

    const componentText = Array.from(document.querySelectorAll("ql-button, ql-icon-button, ql-fab, ql-activity-card"))
      .filter(visible)
      .map((node) => {
        const label = node.getAttribute("label") || node.getAttribute("name") || "";
        const description = node.getAttribute("description") || "";
        const shadowText = node.shadowRoot ? node.shadowRoot.textContent || "" : "";
        return (label + " " + description + " " + shadowText).replace(/\s+/g, " ").trim();
      })
      .filter(Boolean)
      .slice(0, 120);

    const buttons = Array.from(document.querySelectorAll("button, [role='button'], a, ql-button, ql-icon-button, ql-fab, ql-activity-card"))
      .filter(visible)
      .map((node) => (node.textContent ?? node.getAttribute("aria-label") ?? node.getAttribute("label") ?? node.getAttribute("name") ?? "").replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 120);

    const bodyText = ((document.body?.innerText ?? "") + "\n" + componentText.join("\n")).replace(/\s+/g, " ").trim();

    return {
      title: document.title,
      url: location.href,
      headings: textOf("h1,h2,h3", 60),
      buttons,
      warnings: textOf("[role='alert'], .warning, .error, .alert, mat-error", 40),
      codeBlocks: textOf("pre, code", 80),
      visibleTextSample: bodyText.slice(0, 8000)
    };
  })()`) as RawPageInspection;

  const title = redactText(raw.title);
  const visibleTextSample = redactText(raw.visibleTextSample);
  const headings = raw.headings.map(redactText);
  const buttons = raw.buttons.map(redactText);
  const warnings = raw.warnings.map(redactText);
  const codeBlocks = raw.codeBlocks.map(redactText);
  const pageType = classifyPageType(visibleTextSample, raw.url, buttons);

  return {
    title,
    url: safeUrl(raw.url),
    safeUrl: safeUrl(raw.url),
    headings,
    buttons,
    warnings,
    codeBlocks,
    currentSection: headings[0] ?? null,
    currentTask: headings.find((heading) => /task|step|lab/i.test(heading)) ?? null,
    visibleTextSample,
    pageType,
    credentialsVisible: detectCredentialsVisible(visibleTextSample),
    cloudShellNeeded: detectCloudShellNeeded(visibleTextSample),
    labProjectConfidence: detectLabProjectConfidence(visibleTextSample)
  };
}
