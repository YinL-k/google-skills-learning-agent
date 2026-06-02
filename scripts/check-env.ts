import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { loadConfig, resolveProjectPath } from "../src/config.js";

const config = loadConfig();

function commandVersion(command: string, args: string[]): string {
  try {
    return execFileSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return `unavailable (${error instanceof Error ? error.message.split("\n")[0] : String(error)})`;
  }
}

function npmVersion(): string {
  if (process.env.npm_execpath && fs.existsSync(process.env.npm_execpath)) {
    const version = commandVersion(process.execPath, [process.env.npm_execpath, "--version"]);
    if (!version.startsWith("unavailable")) return version;
  }

  const candidates = process.platform === "win32" ? ["npm.cmd", "npm"] : ["npm"];
  for (const candidate of candidates) {
    const version = commandVersion(candidate, ["--version"]);
    if (!version.startsWith("unavailable")) return version;
  }
  return "unavailable; install Node.js/npm or use the project-local .tools/node/npm.cmd";
}

async function isCdpReachable(): Promise<boolean> {
  try {
    const response = await fetch(`${config.edgeCdpUrl}/json/version`);
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const edgeProfilePath = resolveProjectPath(config.edgeUserDataDir);
  const playwrightStatus = await import("playwright").then(() => "available").catch(() => "missing; run npm install");

  console.log(JSON.stringify({
    node: commandVersion("node", ["--version"]),
    npm: npmVersion(),
    playwright: playwrightStatus,
    edgeExecutablePath: config.edgeExecutablePath,
    edgeExecutableExists: fs.existsSync(config.edgeExecutablePath),
    edgeCdpUrl: config.edgeCdpUrl,
    edgeCdpReachable: await isCdpReachable(),
    temporaryEdgeProfile: edgeProfilePath
  }, null, 2));
}

await main();
