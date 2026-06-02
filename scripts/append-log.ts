import { appendMarkdown, timestamp } from "../src/markdown.js";

const message = process.argv.slice(2).join(" ").trim() || "Manual log entry.";

appendMarkdown("TASK_LOG.md", `
## ${timestamp()}

- Current URL:
- Current section:
- Page type:
- Action taken: ${message}
- Reason:
- Whether it was automatic or stopped:
- Verification evidence:
- Commands executed:
- Files changed:
- Cloud resources touched:
- Risks:
- Next step:
`);

console.log("Appended TASK_LOG.md entry.");
