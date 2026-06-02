# Learning Notes

Section checkpoints are appended by `scripts/append-learning-note.ts`.

## Section: Get Started with Agent Development Kit (ADK)

Status:
- Completed

Course location:
- Course: Deploy Multi-Agent Systems with Agent Development Kit (ADK) and Agent Engine
- Module: Develop agents with ADK
- Lesson/Lab: Get Started with Agent Development Kit (ADK)
- URL: https://www.skills.google/course_templates/1275/labs/606589

Learning objective:
- Understand ADK architecture and configure a lab environment for building and running agentic applications.

What was taught:
- ADK is a higher-level framework for composing agents, tools, sessions, callbacks, artifacts, and runners into agentic systems.
- The lab introduces local ADK development, the ADK Dev UI, programmatic agent execution, CLI chat, schemas, and multi-agent examples.

What was done:
- Opened the logged-in course page.
- Identified course activity cards.
- Avoided the in-progress Module quiz.
- Started from the first non-quiz lab after user handled lab launch/account steps.
- Configured Cloud Shell, copied lab files, installed ADK, edited agent code, ran ADK Web UI, ran a programmatic agent, and previewed a multi-agent workflow.

Key ADK concepts:
- Agents, tools, session services, callbacks, artifact management, runners, structured output schemas, and sequential agents.

Key Agent Engine concepts:
- Later labs in this course cover deployment to Agent Engine; this first lab focuses on local ADK foundations.

Multi-agent architecture notes:
- ADK projects organize separate agents into directories and can connect them through parent-child relationships, sub-agents, and workflow agents.

Tools / callbacks / sub-agents / workflow notes:
- The lab references Google Search tooling, Pydantic schemas, `SequentialAgent`, and local ADK commands such as `adk web`.

Commands or code used:
```bash
gcloud storage cp -r gs://<PROJECT_ID_REDACTED>-bucket/* .
export PATH=$PATH:"/home/${USER}/.local/bin"
python3 -m pip install google-adk[otel-gcp]==1.30.0 -r adk_project/requirements.txt
adk web --allow_origins "regex:https://.*\.cloudshell\.dev" --otel_to_cloud --reload_agents
python3 app_agent/agent.py
adk run my_google_search_agent
```

Files created or modified:
- LEARNING_NOTES.md
- TASK_LOG.md

Google Cloud resources touched:
- Lab Cloud Shell
- Vertex AI model calls in the lab project
- Cloud Logging telemetry from ADK lab utilities

Verification evidence:
- Browser inspection confirmed lab page and headings were visible.
- Cloud Shell confirmed lab project context.
- ADK Web UI returned a grounded LA28 response.
- Programmatic agent returned Paris, then structured `{ "capital": "Paris" }`.
- Multi-agent auditor corrected the false Earth/Mars statement.
- Lab assessment reached 100/100.

Errors and fixes:
- Course activity cards were inside shadow DOM; inspector was updated to include `ql-button` and `ql-activity-card` shadow text.
- Course overview initially misclassified quiz/subscription navigation as hard blockers; classifier rules were narrowed to current page URL and actionable quiz/billing signals.
- Cloud Shell toolbar button was disabled in Console, so Cloud Shell was opened through the official `shell.cloud.google.com` lab-project URL.
- Terminal input required direct mouse focus and keyboard typing rather than `insertText`.

Common mistakes to avoid:
- Do not use a personal Google Cloud account for lab resources.
- Do not click quiz/assessment content automatically.
- Do not launch with credits or start timed labs without explicit user intent.
- Do not click End Lab automatically.

Original review questions:
- What problem does ADK solve compared with calling an LLM directly?
- Why are agents and tools separated in an ADK project?
- What role does session state play in a multi-turn agent workflow?
- Why would a sequential agent be useful for critic/reviser workflows?
- What verification signal should prove an ADK Dev UI run worked?

Next step:
- Continue to the next non-quiz course activity, or pause before any Module quiz/manual assessment.
