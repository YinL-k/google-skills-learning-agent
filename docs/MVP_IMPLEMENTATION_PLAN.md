# Google Skills Learning Agent Implementation Plan

## Summary

Build a phased MVP for `google-skills-learning-agent/` in the current workspace. The first version will create a TypeScript + Playwright project that connects to Microsoft Edge over CDP, inspects Google Skills pages, extracts course/lab state, classifies actions against the safety policy, logs learning progress, supports guarded automation, and maintains reusable post-task experience summaries for future similar scenarios. Cloud Shell commands may run automatically only after lab account/project checks pass and the command is tutorial-visible and risk-approved.

Current environment facts:

* Workspace is empty.

* Edge exists at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.

* Edge CDP is not currently running on `127.0.0.1:9222`.

* System `npm` is not available right now, so the implementation should include a prerequisite check and clear install guidance for Node.js/npm before dependency install.

## Key Changes

* Create `google-skills-learning-agent/` with:

  * Markdown state files: `README.md`, `TASK_LOG.md`, `LEARNING_NOTES.md`, `CONCEPT_MAP.md`, `REVIEW_QUESTIONS.md`, `COMMANDS_USED.md`, `ERRORS_AND_FIXES.md`, `COURSE_PROGRESS.md`.

  * Safety docs under `docs/`: `SAFETY_RULES.md`, `WORKFLOW.md`, `AUTONOMY_POLICY.md`.

  * Config under `config/agent.config.json`.

  * TypeScript scripts under `scripts/` for environment checks, Edge startup, CDP connection, tab inspection, page inspection, course-state extraction, snapshots, guarded clicking, safe-action execution, note/log appends, and reusable experience maintenance.

  * Reusable experience archive under `experience/` for post-task summaries and future scenario reuse.

* Use local project dependencies:

  * `playwright`

  * `typescript`

  * `tsx`

  * `@types/node`

* Add `package.json` scripts:

  * `check-env`

  * `start-edge-cdp`

  * `connect-edge`

  * `inspect-tabs`

  * `inspect-page`

  * `extract-course-state`

  * `snapshot-page`

  * `run-safe-action`

  * `append-experience`

  * `summarize-task-experience`

  * `search-experience`

  * `update-experience-index`

* `start-edge-cdp.ps1` must launch Edge with:

  * remote debugging port `9222`

  * temporary profile under the project, for example `.edge-profile/`

  * no default personal profile attachment.

* Add a maintainable and extensible post-task experience system under `experience/`, for example:

```text
experience/
  README.md
  index.md
  by-page-type/
    google-skills-lab.md
    cloud-shell.md
    cloud-console.md
    quiz-assessment.md
    login-account-selection.md
    progress-check.md
  by-action-type/
    navigation.md
    command-execution.md
    page-inspection.md
    progress-validation.md
    error-recovery.md
    safety-hard-stop.md
  by-error-type/
    cdp-unavailable.md
    npm-missing.md
    edge-launch-failure.md
    selector-not-found.md
    cloud-project-ambiguity.md
  reusable-patterns/
    lab-project-verification.md
    safe-cloud-shell-command.md
    check-progress-after-evidence.md
    redact-sensitive-output.md
```

* Each reusable experience entry should use metadata for retrieval and maintenance, for example:

```md
---
date: 2026-06-02
page_type: cloud-shell
action_type: command-execution
risk_level: guarded
tags:
  - google-skills
  - cloud-shell
  - lab-project-check
reuse_when:
  - executing tutorial-visible commands
  - verifying lab project context
  - handling similar command output
---

## Context

Briefly describe the task context.

## What Worked

Summarize the actions, checks, or commands that worked.

## What Failed or Needed Adjustment

Summarize errors, blocked actions, wrong assumptions, or required corrections.

## Safety Checks Triggered

List any hard stops, guarded checks, redactions, or manual-intervention points.

## Reusable Lesson

State the reusable pattern that should be applied next time.

## Reuse Criteria

Describe when this experience should be retrieved and applied in future tasks.
```

## Implementation Behavior

* `check-env.ts` verifies Node/npm, Playwright availability, Edge executable path, and CDP reachability.

* CDP scripts connect to `http://127.0.0.1:9222`, list pages, and identify likely Google Skills tabs without printing cookies, tokens, credentials, or full sensitive URLs.

* Page inspection extracts visible title, URL domain/path, headings, buttons, warnings, code blocks, task text, and detected page type.

* Course-state extraction classifies:

  * lesson, lab, quiz, assessment, progress check, overview, Cloud Console, or Cloud Shell

  * visible commands

  * credential visibility

  * lab account/project confidence

  * hard-stop status

  * recommended next safe action

* `run-safe-action.ts` centralizes safety decisions:

  * allow ordinary navigation and reading actions

  * allow `Check my progress` only after evidence of task completion

  * stop on login, account selection, billing, CAPTCHA/security, personal project ambiguity, quiz/assessment submission, End Lab, destructive actions outside explicit lab instructions, or platform-bypass attempts.

* Cloud Shell automation is included but guarded:

  * execute only commands visible or directly implied by the tutorial

  * require confirmed lab account and lab project context

  * log command purpose, expected result, actual result, and touched resources

  * redact credentials, tokens, secrets, and project IDs when needed.

* After every completed task, the agent must create or update a reusable experience summary.

* The post-task experience summary should include:

  * what task was executed

  * what worked

  * what failed or required adjustment

  * what safety checks were triggered

  * what commands/actions were used

  * what reusable pattern or lesson should be remembered

  * when this experience should be reused in future similar scenarios

* Before executing a new task, the agent should search the experience archive for relevant prior experience using page type, action type, error type, tags, and reuse criteria.

* If relevant experience exists, the agent should use it to choose safer defaults, avoid repeated mistakes, and apply known working patterns.

* Experience summaries must not store secrets, cookies, tokens, credentials, full sensitive URLs, or unredacted project IDs.

* The experience system should be treated as long-term operational memory, separate from raw task logs:

  * `TASK_LOG.md` records what happened.

  * `experience/` records reusable lessons and future execution guidance.

## Test Plan

* Run `npm install` inside `google-skills-learning-agent/`.

* Run `npm run check-env` before Edge is launched and verify it reports CDP unavailable cleanly.

* Run `scripts/start-edge-cdp.ps1`, then rerun `npm run check-env` and verify CDP is reachable.

* Open a safe non-sensitive page in Edge and verify:

  * `inspect-tabs` lists title/domain/path only

  * `inspect-page` extracts headings/buttons/code blocks

  * snapshots redact sensitive-looking values

* Test hard-stop classification with mocked page content for:

  * login/account selection

  * billing/free trial

  * CAPTCHA/security warning

  * quiz/assessment

  * End Lab

  * personal project ambiguity

* Test allowed classifications with mocked lesson/lab/progress-check pages.

* Verify Markdown append scripts preserve the required formats and never log secrets.

* Verify that after each completed task, the agent creates or updates an experience entry.

* Verify that experience entries are categorized by page type, action type, and error type.

* Verify that `search-experience.ts` can retrieve relevant prior lessons before similar tasks.

* Verify that `update-experience-index.ts` keeps `experience/index.md` aligned with new or updated experience files.

* Verify that experience summaries redact secrets, credentials, tokens, project IDs, cookies, and sensitive URLs.

* Verify that experience files remain modular and do not grow into one unmaintainable monolithic log.

## Assumptions

* First implementation is a phased MVP, not the full autonomous lab-completion agent.

* Node.js/npm should be installed locally or made available on PATH before implementation completes.

* The agent will use standalone Edge CDP + Playwright TypeScript, not the Codex in-app browser plugin.

* The user will manually handle login, account selection, credentials, and any assessment/quiz interactions.

* The agent may continue ordinary course navigation and guarded lab actions only after safety checks pass.

* The agent should maintain reusable post-task experience summaries so future similar tasks can directly apply known lessons, safety patterns, and recovery strategies without relying only on raw logs.
