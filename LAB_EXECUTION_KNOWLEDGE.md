# Lab Execution Knowledge

Reusable operating knowledge learned from Google Skills labs. Before starting a future lab, read this file first and reuse matching patterns. If a lab introduces a new pattern, append a new dated entry.

## Pattern: Google Skills ADK Lab With Cloud Shell And Checkpoints

Source lab:
- Course: Deploy Multi-Agent Systems with Agent Development Kit (ADK) and Agent Engine
- Lab: Get Started with Agent Development Kit (ADK), GENAI104
- Date learned: 2026-05-29

Reusable flow:
- Open the lab page and read the visible instructions, but do not start timed labs, spend credits, accept legal terms, enter credentials, or authorize accounts automatically.
- After the user manually starts the lab and completes account/legal steps, verify:
  - Google Cloud Console URL includes a `qwiklabs-gcp-...` project.
  - Cloud Shell prompt shows the same lab project.
  - No personal project/account ambiguity remains.
- If the Console Cloud Shell toolbar button is disabled, open Cloud Shell directly with:
  - `https://shell.cloud.google.com/?project=<PROJECT_ID>&authuser=1&show=ide%2Cterminal`
- Google Skills often renders real substituted commands inside `ql-code-block` shadow DOM. Prefer shadow text over raw text because raw text may still contain placeholders like `{{{project_0.project_id}}}`.
- Do not log lab username, password, tokens, cookies, or unredacted project IDs in local notes.

Cloud Shell interaction lessons:
- Xterm input may ignore `keyboard.insertText`; focus the terminal by clicking inside it, then use `keyboard.type(...)` and `Enter`.
- Run a harmless probe such as `pwd` if terminal focus is uncertain.
- Long-running `adk web` holds the terminal; stop it with `Ctrl+C` before running the next command sequence.
- Web Preview may default to port `8080`; use “change port” and set `8000` when ADK Web UI runs on port `8000`.

Command patterns:
```bash
gcloud storage cp -r gs://<PROJECT_ID>-bucket/* .
export PATH=$PATH:"/home/${USER}/.local/bin"
python3 -m pip install google-adk[otel-gcp]==1.30.0 -r adk_project/requirements.txt
adk web --allow_origins "regex:https://.*\.cloudshell\.dev" --otel_to_cloud --reload_agents
python3 app_agent/agent.py
adk run my_google_search_agent
```

ADK lab code-edit patterns:
- For a Google Search agent, verify the import exists:
  - `from google.adk.tools import google_search`
- Then add the tool to the `Agent(...)` definition:
  - `tools=[google_search],`
- For structured output, add:
```python
from pydantic import BaseModel, Field

class CountryCapital(BaseModel):
    capital: str = Field(description="A country's capital.")
```
- Then set the agent parameter:
```python
output_schema=CountryCapital,
```

Verification patterns:
- ADK Web UI checkpoint:
  - Start `adk web`.
  - Open Cloud Shell Web Preview on port `8000`.
  - Select the target agent.
  - Send the lab-provided prompt.
  - Verify the response appears before clicking `Check my progress`.
- Programmatic agent checkpoint:
  - Export the lab environment variables.
  - Run `python3 app_agent/agent.py`.
  - Verify expected output appears.
- Multi-agent checkpoint:
  - Copy `.env` into the multi-agent directory.
  - Relaunch `adk web`.
  - Select the multi-agent workflow agent.
  - Send the lab-provided false statement.
  - Verify both critique and revised answer appear.

Safety reminders:
- Click `Check my progress` only after the task was actually performed and visible evidence exists.
- Never click `End Lab` automatically.
- Never auto-answer Module quizzes or assessments.
- Never use personal Google Cloud resources.
- Stop if billing, free trial, personal account, CAPTCHA/security, or project ambiguity appears.

## Pattern: Next Lab Page Opened While Previous Timed Lab Is Still Active

Source lab:
- Course: Deploy Multi-Agent Systems with Agent Development Kit (ADK) and Agent Engine
- Next lab observed: Empower ADK agents with tools, GENAI105
- Date learned: 2026-05-29

Observed signals:
- The next lab page can be opened with course navigation even while the previous timed lab is still active.
- The page may show full instructions and checkpoints, but command substitutions can remain unresolved:
  - `YOUR_GCP_PROJECT_ID`
  - `gemini_flash_model_id`
  - username/password placeholders
- Checkpoints can show `—/100` or blank progress instead of concrete point totals.
- `Launch with ...` controls may exist but remain hidden until the start modal is opened.
- `End Lab` can remain present from the active lab, sometimes offscreen or in modal markup.

Reusable decision:
- Do not reuse the previous lab project for the next lab unless the page itself has rendered substituted values for the new lab.
- Do not execute commands containing unresolved placeholders.
- Do not click `End Lab` automatically to make room for the next lab.
- Do not click `Launch with Credits` automatically.
- Stop and ask the user to manually end/start labs when a new lab requires a fresh timed environment.

Safe automatic work before stopping:
- Read and summarize the new lab's overview/objectives.
- Extract visible command patterns and checkpoint names.
- Record unresolved placeholders as a blocker.
- Resume automation only after the user confirms the new lab is started and the lab project/account context is visible.

### 2026-05-29 09:36:25 -04:00 - Lab-provided temporary account handling
- If Google Skills/Qwiklabs provides a temporary lab username, password, and project ID in the Lab setup panel, it is allowed to use those credentials for lab-scoped login, Cloud Console access, Cloud Shell authorization, and ADC/OAuth flows required by the visible lab instructions.
- Treat these credentials as temporary lab credentials, not the user's personal account. Redact them in logs and summaries.
- Still stop for personal-account ambiguity, billing/free-trial prompts, CAPTCHA/security challenges, quiz/assessment submission, End Lab, platform bypass, or destructive actions outside explicit lab instructions.

### 2026-05-29 09:40:01 -04:00 - Credits launch threshold
- If a Google Skills/Qwiklabs lab start modal shows Launch with Credits and the cost is less than 10 credits, it is allowed to launch automatically.
- If the cost is 10 credits or more, stop and ask for explicit confirmation.
- Continue to avoid free-trial signup, billing setup, paid subscription changes, and personal-account ambiguity.

### 2026-05-29 - GENAI106 multi-agent ADK workflow lab
- Checkpoint 3 and 4 are stage-sensitive. Do not skip directly to the final Task 6 structure before checking Task 3/4 progress.
- On repeat runs, if the lab costs 5 credits, it can be launched under the saved less-than-10-credits rule after confirming it is the requested lab.
- Always verify Cloud Shell is using the temporary lab account and the active `qwiklabs-gcp-...` project before running commands, especially if the browser account menu still displays a personal account in another tab.
- For the SequentialAgent checkpoint, the workflow must run and write a pitch file from a `film_concept_team = SequentialAgent(...)` flow.
- For the LoopAgent checkpoint, use the tutorial's `critic` prompt closely. The critic must produce a visible response in the Dev UI before calling `exit_loop`.
- For the parent/sub-agent checkpoint, make sure `save_attractions_to_state` is attached to `attractions_planner`, not `travel_brainstormer`. A reliable grep after patching should show the `tools=[save_attractions_to_state]` line inside the `attractions_planner = Agent(...)` block.
- The tutorial's Wikipedia LangChain tool may fail with `Expecting value: line 1 column 1 (char 0)`. If that happens, preserve the tutorial's ADK structure but switch the `researcher` agent to model-based historical knowledge with `tools=[append_to_state]` so the workflow can continue.
- Working verification prompt for the LoopAgent stage: `a cartographer (a map maker)`. Evidence to look for: researcher state append, screenwriter state append, a visible critic explanation, `exit_loop`, and `write_file`.
- After checkpoints are complete, restore the final Task 6 structure:
  - `writers_room` LoopAgent
  - `preproduction_team` ParallelAgent
  - final `film_concept_team` SequentialAgent with `[writers_room, preproduction_team, file_writer]`
  - `file_writer` content includes plot outline, box office report, and casting report.
- Working verification prompt for Task 6: `an exciting chef`. Evidence to look for: box office report, casting report, and `write_file` creating a final pitch document.

### 2026-05-29 - GENAI107 deploy ADK agent to Agent Engine
- The lab can be launched automatically when it costs 5 credits, under the saved less-than-10-credits rule.
- After launch, verify substituted commands in `ql-code-block` shadow DOM before running anything. The key substitutions are project ID, bucket name, model `gemini-2.5-flash`, and region `us-central1`.
- Cloud Shell can be opened directly with `https://shell.cloud.google.com/?project=<PROJECT_ID>&show=ide%2Cterminal&pli=1`; wait for the prompt to show the current lab project.
- Required workflow:
  - Copy `adk_to_agent_engine` from the lab bucket.
  - Install `adk_to_agent_engine/requirements.txt`.
  - Create `.env` in `~/adk_to_agent_engine` and copy it into `transcript_summarization_agent/.env`.
  - Create `transcript_summarization_agent/requirements.txt` containing `google-cloud-aiplatform[agent_engines,adk]>=1.112`.
  - Run `adk deploy agent_engine transcript_summarization_agent --display_name "Transcript Summarizer" --region us-central1 --staging_bucket gs://<PROJECT_ID>-bucket`.
- Deploy can sit at `Deploying to agent engine...` for several minutes. Wait for `Created agent engine: projects/.../locations/us-central1/reasoningEngines/...`.
- For the query checkpoint, grant the Reasoning Engine Service Agent Vertex AI User:
  - `gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:service-$PROJECT_NUMBER@gcp-sa-aiplatform-re.iam.gserviceaccount.com" --role="roles/aiplatform.user" --condition=None`
- Then run `python3 query_agent_engine.py` from `transcript_summarization_agent`; expected evidence is a `[remote response]` summary.
- For the cleanup checkpoint, extract the Agent Engine resource name from deploy output and run:
  - `python3 agent_engine_utils.py delete "<RESOURCE_NAME>"`
- Evidence for final checkpoint is `AgentEngine resource deleted`.

### 2026-05-29 - GENAI124 MCP tools with ADK agents
- The lab can be launched automatically when it costs 7 credits, under the saved less-than-10-credits rule.
- Checkpoint 1 passes after copying `adk_mcp_tools` from the lab bucket and installing `google-adk==1.22.1` with the lab `requirements.txt`.
- Before running commands, verify the active Cloud Shell account is a `qwiklabs.net` lab account and the active project starts with `qwiklabs-gcp-`.
- The Maps API key can be created from Cloud Shell instead of the Console UI:
  - enable `apikeys.googleapis.com`, `routes.googleapis.com`, and `directions-backend.googleapis.com`
  - create `GOOGLE_MAPS_API_KEY` restricted to `routes.googleapis.com` and `directions-backend.googleapis.com`
  - use `gcloud services api-keys get-key-string <KEY_RESOURCE>` to read the key string for the `.env` files
- Write the same `.env` to `google_maps_mcp_agent/.env` and `adk_mcp_server/.env`, with `GOOGLE_GENAI_USE_VERTEXAI=TRUE`, the lab project, global location, the Maps key, and the rendered model value.
- Patch `google_maps_mcp_agent/agent.py` by importing `MCPToolset`, `StdioConnectionParams`, and `StdioServerParameters`, then adding the Google Maps MCP server toolset after the tutorial marker. Evidence: ADK Dev UI selected `google_maps_mcp_agent`, prompts ran through `/run_sse`, and model responses were logged.
- Cloud Shell Web Preview may default to port 8080. If so, open the generated preview URL and replace the leading host from `8080-cs-...` to `8000-cs-...`; the ADK Dev UI redirects to `/dev-ui/`.
- Checkpoint 2 requires launching ADK Dev UI and running the provided Maps prompts, not just starting `adk web`.
- The final no-checkpoint exercise still matters for learning: patch `adk_mcp_server/agent.py` with the absolute `adk_server.py` path and the filtered `load_web_page` MCPToolset, then select `adk_mcp_server` in ADK Dev UI and send `Load the content from http://example.com.` Evidence is a visible `load_web_page` tool call and a response containing the example.com documentation-domain text.

### 2026-05-29 - GENAI120 ADK and Agent2Agent SDK
- The lab can be launched automatically when it costs 7 credits, under the saved less-than-10-credits rule.
- This lab is sensitive to personal-account ambiguity. If Cloud Shell opens as a personal account, use the Cloud Shell account selector and open a fresh `authuser=1` Cloud Shell tab for the lab account. Continue only after the prompt shows the temporary lab username and the lab project.
- Task 1 passes after copying `adk_and_a2a` from the lab bucket and installing `google-adk[a2a]==1.31.0` plus `google-genai`.
- For Task 2:
  - write `illustration_agent/.env` with the lab project, `GOOGLE_CLOUD_LOCATION=global`, `MODEL=gemini-3.5-flash`, and `IMAGE_MODEL=gemini-3.1-flash-image`
  - copy it to `slide_content_agent/.env`
  - run `gcloud auth application-default login --impersonate-service-account=illustration-agent-sa@<PROJECT>.iam.gserviceaccount.com`
  - complete the browser verification-code flow with the temporary lab account, then paste the code back into Cloud Shell
  - launch `adk web`, open port 8000 Dev UI, select `illustration_agent`, and send `By supporting each other, we get big things done!`
  - evidence is a `generate_image` tool call and a signed Cloud Storage image URL
- For Task 3:
  - create `illustration_agent/agent.json` with the Cloud Run A2A URL `https://illustration-agent-<PROJECT_NUMBER>.us-west4.run.app/a2a/illustration_agent`
  - create `illustration_agent/requirements.txt` containing `google-adk[a2a]==1.31.0`
  - deploy with `adk deploy cloud_run --project <PROJECT> --region us-west4 --service_name illustration-agent --a2a illustration_agent -- --service-account=illustration-agent-sa@<PROJECT>.iam.gserviceaccount.com --set-env-vars=GOOGLE_CLOUD_LOCATION=global --allow-unauthenticated`
  - if the command prompts `Allow unauthenticated invocations`, rerun with `--allow-unauthenticated`; A2A remote access needs the public endpoint for the lab.
- For Task 4:
  - copy `illustration_agent/agent.json` to `illustration-agent-card.json`
  - patch `slide_content_agent/agent.py` to import `RemoteA2aAgent`, define `illustration_agent = RemoteA2aAgent(...)`, and set `sub_agents=[illustration_agent]`
  - restart `adk web`, select `slide_content_agent`, and send `Create content for a slide about our excellent on-the-job training.`
  - evidence can be the slide headline/body plus a transfer to `illustration_agent`; the checkpoint passed with that visible response.
- If multiline Python patches get mangled by Cloud Shell paste, base64-encode the Python patch locally, decode it in Cloud Shell, and run it from `/tmp`.
