import fs from "node:fs";
import path from "node:path";
import { projectRoot } from "./config.js";
import { redactText } from "./redaction.js";

export function appendMarkdown(relativePath: string, content: string): void {
  const filePath = path.join(projectRoot(), relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `\n${redactText(content).trim()}\n`, "utf8");
}

export function timestamp(): string {
  return new Date().toISOString();
}
