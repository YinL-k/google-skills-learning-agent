import fs from "node:fs";
import path from "node:path";

export interface AgentConfig {
  edgeCdpUrl: string;
  edgeExecutablePath: string;
  edgeUserDataDir: string;
  snapshotDir: string;
  redaction: {
    redactProjectIds: boolean;
    redactCredentials: boolean;
  };
  automation: {
    allowCloudShellCommands: boolean;
    requireLabProjectConfidence: boolean;
    retryNonRiskyActionsOnce: boolean;
  };
}

const defaultConfig: AgentConfig = {
  edgeCdpUrl: "http://127.0.0.1:9222",
  edgeExecutablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  edgeUserDataDir: ".edge-profile",
  snapshotDir: "snapshots",
  redaction: {
    redactProjectIds: true,
    redactCredentials: true
  },
  automation: {
    allowCloudShellCommands: true,
    requireLabProjectConfidence: true,
    retryNonRiskyActionsOnce: true
  }
};

export function projectRoot(): string {
  return process.cwd();
}

export function loadConfig(): AgentConfig {
  const configPath = path.join(projectRoot(), "config", "agent.config.json");
  if (!fs.existsSync(configPath)) {
    return defaultConfig;
  }

  const parsed = JSON.parse(fs.readFileSync(configPath, "utf8")) as Partial<AgentConfig>;
  return {
    ...defaultConfig,
    ...parsed,
    redaction: {
      ...defaultConfig.redaction,
      ...parsed.redaction
    },
    automation: {
      ...defaultConfig.automation,
      ...parsed.automation
    }
  };
}

export function resolveProjectPath(relativePath: string): string {
  return path.resolve(projectRoot(), relativePath);
}
