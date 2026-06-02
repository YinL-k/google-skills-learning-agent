# Commands Used

Command execution records are appended by `scripts/append-log.ts` and command-aware workflows.

## 2026-05-29 Lab GENAI104

- Environment: Cloud Shell
- Command: `gcloud storage cp -r gs://<PROJECT_ID_REDACTED>-bucket/* .`
- Purpose: Copy lab starter files into the Cloud Shell home directory.
- Expected result: `adk_project/` and requirements are copied locally.
- Actual result: Completed 19/19 files.
- Notes: Project ID redacted.

- Environment: Cloud Shell
- Command: `export PATH=$PATH:"/home/${USER}/.local/bin"`
- Purpose: Make user-local Python console scripts available.
- Expected result: `adk` command can be found after install.
- Actual result: PATH updated for the active shell.
- Notes:

- Environment: Cloud Shell
- Command: `python3 -m pip install google-adk[otel-gcp]==1.30.0 -r adk_project/requirements.txt`
- Purpose: Install ADK, OTel plugin, and lab Python requirements.
- Expected result: Dependencies install successfully.
- Actual result: Install completed successfully.
- Notes:

- Environment: Cloud Shell
- Command: edited `my_google_search_agent/agent.py` to add `tools=[google_search]`
- Purpose: Equip the sample agent with Google Search.
- Expected result: Agent can ground responses using search.
- Actual result: `tools=[google_search]` verified.
- Notes:

- Environment: Cloud Shell
- Command: wrote `my_google_search_agent/.env`
- Purpose: Configure Vertex AI, lab project, global location, Gemini Flash model, and telemetry flags.
- Expected result: ADK can use Vertex AI in the lab project.
- Actual result: `.env` created with project ID redacted in local records.
- Notes: `MODEL=gemini-3.5-flash`.

- Environment: Cloud Shell
- Command: `adk web --allow_origins "regex:https://.*\.cloudshell\.dev" --otel_to_cloud --reload_agents`
- Purpose: Launch ADK Dev UI for browser-based agent testing.
- Expected result: Dev UI available on port 8000.
- Actual result: ADK Web Server started and was later stopped with Ctrl+C.
- Notes:

- Environment: ADK Dev UI
- Command: selected `my_google_search_agent` and sent the tutorial prompt about the 2028 Summer Olympics.
- Purpose: Verify the search-equipped agent runs in the ADK Web UI.
- Expected result: Agent responds in the UI.
- Actual result: Agent returned a grounded LA28 response; checkpoint passed 40/40.
- Notes:

- Environment: Cloud Shell
- Command: exported `GOOGLE_GENAI_USE_VERTEXAI`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, and `MODEL`
- Purpose: Configure environment for programmatic agent execution.
- Expected result: Python script can call Vertex AI through ADK.
- Actual result: Environment set for active shell.
- Notes: Project ID redacted.

- Environment: Cloud Shell
- Command: `python3 app_agent/agent.py`
- Purpose: Run an agent programmatically.
- Expected result: Agent answers the hardcoded France-capital prompt.
- Actual result: First run returned Paris in prose; after schema edit returned `{ "capital": "Paris" }`; checkpoint passed 40/40.
- Notes:

- Environment: Cloud Shell
- Command: edited `app_agent/agent.py` to add `CountryCapital` and `output_schema=CountryCapital`
- Purpose: Demonstrate structured output with Pydantic.
- Expected result: Agent response conforms to schema.
- Actual result: JSON-like structured output returned.
- Notes:

- Environment: Cloud Shell / ADK Dev UI
- Command: copied `.env` to `llm_auditor`, relaunched `adk web`, selected `llm_auditor`, and sent the Earth/Mars false-statement prompt.
- Purpose: Preview a multi-agent critic/reviser workflow.
- Expected result: Multi-agent flow identifies the statement as inaccurate and revises it.
- Actual result: Flow produced an inaccurate verdict and corrected statement; checkpoint passed 20/20.
- Notes:
