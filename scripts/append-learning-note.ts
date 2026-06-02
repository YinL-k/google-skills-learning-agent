import { appendMarkdown, timestamp } from "../src/markdown.js";

const section = readArg("--section") ?? "Untitled section";
const status = readArg("--status") ?? "Partially completed";

appendMarkdown("LEARNING_NOTES.md", `
## Section: ${section}

Timestamp: ${timestamp()}

Status:
- ${status}

Course location:
- Course:
- Module:
- Lesson/Lab:
- URL:

Learning objective:
- 

What was taught:
- 

What was done:
- 

Key ADK concepts:
- 

Key Agent Engine concepts:
- 

Multi-agent architecture notes:
- 

Tools / callbacks / sub-agents / workflow notes:
- 

Commands or code used:
\`\`\`bash

\`\`\`

Files created or modified:
- 

Google Cloud resources touched:
- 

Verification evidence:
- 

Errors and fixes:
- 

Common mistakes to avoid:
- 

Original review questions:
- 

Next step:
- 
`);

console.log("Appended LEARNING_NOTES.md checkpoint.");

function readArg(name: string): string | undefined {
  const equals = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (equals) return equals.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
