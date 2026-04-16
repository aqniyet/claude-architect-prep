// question-bank.js
// 200-question bank for the adaptive Claude Certified Architect Foundations practice exam.
// Options and correct letters were rebalanced by _rebalance.js to neutralize
// length- and letter-based answer tells.

const BANK_VERSION = "1.0-rebalanced-rebalanced-rebalanced-rebalanced";

const DOMAIN_META = {
  1: { name: "Agentic Architecture & Orchestration", weight: 0.27, count: 54, short: "Agentic Arch." },
  2: { name: "Tool Design & MCP Integration", weight: 0.18, count: 36, short: "Tool Design" },
  3: { name: "Claude Code Configuration & Workflows", weight: 0.2, count: 40, short: "Claude Code" },
  4: { name: "Prompt Engineering & Structured Output", weight: 0.2, count: 40, short: "Prompt Eng." },
  5: { name: "Context Management & Reliability", weight: 0.15, count: 30, short: "Context Mgmt." },
};

const PLACEMENT_DISTRIBUTION = { 1: 6, 2: 4, 3: 4, 4: 4, 5: 2 };

const QUESTION_BANK = [

  // ==========================================================================
  // DOMAIN 1 — Agentic Architecture & Orchestration (54 questions)
  // ==========================================================================

  { id: "D1-001", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agentic loop checks whether the assistant's response contains text to determine if the loop should terminate. In testing, the agent sometimes stops mid-task after producing a brief explanation before completing all necessary tool calls. What is the root cause?",
    opts: {
      A: "The system prompt doesn't explicitly instruct the model to complete all tool calls before responding.",
      B: "Checking for assistant text content is an unreliable completion indicator.",
      C: "The agentic loop needs a minimum iteration count before it's allowed to terminate.",
      D: "The model's <code>max_tokens</code> is set too low, causing premature truncation."
    },
    a: "B",
    exp: "the model may produce text between tool calls without intending to end the loop.",
    tags: ["agentic-loop","stop-reason"] },

  { id: "D1-002", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Production data shows that in 8% of cases, your agent processes refunds without first verifying the customer's identity through <code>get_customer</code>. A senior engineer suggests strengthening the system prompt with \"You MUST ALWAYS call get_customer before process_refund.\" What's the best approach?",
    opts: {
      A: "Deploy a routing classifier that parses user messages and pre-selects the appropriate tool sequence.",
      B: "Use <code>tool_choice</code> forced selection to always call <code>get_customer</code> first on every turn.",
      C: "Implement a programmatic prerequisite that blocks <code>process_refund</code> until <code>get_customer</code> has returned a verified customer ID.",
      D: "The stronger system prompt wording is sufficient combined with few-shot examples showing the correct order."
    },
    a: "C",
    exp: "When deterministic compliance is required for critical business logic, prompt instructions have a non-zero failure rate. Programmatic enforcement via hooks or prerequisite gates provides deterministic guarantees.",
    tags: ["prerequisite-gate","deterministic-enforcement"] },

  { id: "D1-003", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your coordinator agent sends each subagent a brief task description like \"Research AI in healthcare.\" The subagents return shallow, generic results despite having good tools. What's the most likely cause?",
    opts: {
      A: "The subagents' system prompts are too restrictive, limiting their exploration scope.",
      B: "The coordinator should execute subagents sequentially so each builds on previous findings.",
      C: "The subagents need access to more tools to perform deeper research.",
      D: "Subagents don't automatically inherit the coordinator's conversation history."
    },
    a: "D",
    exp: "they lack context for targeted research.",
    tags: ["subagent","context-isolation"] },

  { id: "D1-004", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your coordinator always invokes all 4 subagents (web search, document analysis, synthesis, report generation) for every query &mdash; even simple factual questions that only need a quick lookup. What's the best architectural change?",
    opts: {
      A: "Design the coordinator to analyze query requirements and dynamically select which subagents to invoke based on complexity.",
      B: "Reduce the number of subagents to 2 by merging web search with document analysis, and synthesis with report generation.",
      C: "Set time budgets per subagent so simple queries complete faster even when all agents run.",
      D: "Add a caching layer so subagents skip work if a similar query was recently processed."
    },
    a: "A",
    exp: "Coordinators should dynamically select which subagents to invoke rather than always routing through the full pipeline. The coordinator assesses query complexity and only invokes the subagents actually needed.",
    tags: ["coordinator","dynamic-routing"] },

  { id: "D1-005", domain: 1, scenario: "Multi-Agent Research System",
    q: "You need to spawn three research subagents to investigate different subtopics simultaneously. Currently your coordinator emits one Task tool call per turn, waiting for each subagent to complete before spawning the next. How do you enable parallel execution?",
    opts: {
      A: "Use <code>fork_session</code> to create three parallel branches from the coordinator's context.",
      B: "Have the coordinator emit multiple Task tool calls in a single response rather than across separate turns.",
      C: "Configure the subagents with <code>async: true</code> in their AgentDefinition so they run in the background.",
      D: "Create a parallel execution middleware that intercepts Task calls and batches them."
    },
    a: "B",
    exp: "Spawning parallel subagents is done by emitting multiple Task tool calls in a single coordinator response rather than across separate turns.",
    tags: ["parallel","task-tool"] },

  { id: "D1-006", domain: 1, scenario: "Developer Productivity with Claude",
    q: "You resumed a long investigation session after making significant code changes overnight. The agent now gives contradictory answers &mdash; referencing function signatures that no longer exist. What's the best approach?",
    opts: {
      A: "Add a system prompt instruction reminding the agent that code may have changed since last session.",
      B: "Resume the session and re-read all previously analyzed files to refresh the context.",
      C: "Start a new session with a structured summary of prior findings rather than resuming with stale tool results.",
      D: "Use <code>/compact</code> to reduce context and force the agent to re-read files."
    },
    a: "C",
    exp: "Starting a new session with a structured summary is more reliable than resuming with stale tool results. <code>/compact</code> doesn't remove stale data &mdash; it just compresses it.",
    tags: ["session","fresh-start"] },

  { id: "D1-007", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your research coordinator delegates to web search, document analysis, and synthesis subagents sequentially &mdash; waiting for each to finish before spawning the next. A typical research task takes 180 seconds end-to-end. The subagents don't have dependencies between them; they just need the same query. What's the most effective optimization?",
    opts: {
      A: "Cache subagent results so repeated queries skip the full execution path.",
      B: "Combine the three subagents into a single agent with all tools available so only one Task call is needed.",
      C: "Increase the <code>max_tokens</code> on each subagent so they produce more comprehensive output in fewer iterations.",
      D: "Have the coordinator emit multiple Task tool calls in a single response to spawn the three subagents in parallel."
    },
    a: "D",
    exp: "Parallel subagent execution is achieved by emitting multiple Task tool calls in a single coordinator response. Option B violates specialization and exceeds tool count limits.",
    tags: ["parallel","task-tool"] },

  { id: "D1-008", domain: 1, scenario: "Multi-Agent Research System",
    q: "A stakeholder complains that your research reports on broad topics (e.g., \"impact of climate policy\") consistently miss major subtopics. Examining logs, you see the coordinator decomposes tasks with prompts like \"find climate papers\" and \"summarize climate news.\" The subagents execute correctly, but coverage is incomplete. Where should you focus your fix?",
    opts: {
      A: "The coordinator &mdash; its task decomposition is too narrow, creating subagent assignments that don't cover all relevant dimensions of the topic.",
      B: "The document analysis agent &mdash; it's filtering out relevant sources during analysis. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "The synthesis agent &mdash; add instructions for it to identify and flag coverage gaps. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "The web search agent &mdash; its queries are too generic and need domain-specific expansion. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "A",
    exp: "When subagents execute their assigned work correctly but overall coverage is incomplete, the root cause is the coordinator's task decomposition. Iterative refinement loops in the coordinator (evaluating synthesis output and re-delegating to fill gaps) address this.",
    tags: ["coordinator","decomposition"] },

  { id: "D1-009", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your support agent integrates with three backend systems through MCP tools. Each system returns timestamps in a different format: Unix epoch seconds from billing, ISO 8601 from orders, and date strings like \"March 15, 2026\" from shipping. The agent frequently confuses dates and makes incorrect comparisons. What's the best approach?",
    opts: {
      A: "Add system prompt instructions explaining each format with conversion examples so the model can interpret them correctly.",
      B: "Implement a PostToolUse hook that normalizes all timestamps to a single format before the model processes them.",
      C: "Add a <code>convert_timestamp</code> tool that the model can call whenever it needs to compare dates across systems.",
      D: "Request that each backend team standardize their APIs to a common timestamp format."
    },
    a: "B",
    exp: "PostToolUse hooks intercept tool results for transformation before the model processes them &mdash; the documented pattern for normalizing heterogeneous data formats. This provides deterministic normalization without agent overhead.",
    tags: ["hook","post-tool-use"] },

  { id: "D1-010", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your support agent successfully resolves a complex billing issue, but the customer needs an escalation for a separate policy exception. When handing off to a human agent who cannot see the conversation transcript, what should the agent provide?",
    opts: {
      A: "A full transcript of the conversation, so the human agent has complete context.",
      B: "The customer's email address so the human agent can re-initiate contact.",
      C: "A structured handoff summary with customer ID, root cause analysis, refund amount (if any), and a recommended action.",
      D: "Only the policy exception request, so the human can investigate without bias from prior context."
    },
    a: "C",
    exp: "Structured handoff summaries give human agents the critical facts without forcing them to parse a full transcript. Transcripts require reading time and still miss the \"what was concluded\" synthesis.",
    tags: ["handoff","human-escalation"] },

  { id: "D1-011", domain: 1, scenario: "Developer Productivity with Claude",
    q: "You've analyzed a legacy codebase and identified two viable refactoring strategies: (A) extract a shared library, or (B) use dependency injection. Your team wants to compare both approaches in detail before committing. Which session management feature fits this need?",
    opts: {
      A: "Run <code>/compact</code> and then explore both approaches sequentially in the same session.",
      B: "Use the Explore subagent to investigate each approach in isolation, then merge findings.",
      C: "Use <code>--resume</code> twice with different session names to create two parallel conversations from scratch.",
      D: "Use <code>fork_session</code> to create two independent branches from your shared codebase analysis baseline."
    },
    a: "D",
    exp: "<code>fork_session</code> is designed precisely for exploring divergent approaches from a shared analysis baseline. Both forks start with identical context, then diverge independently.",
    tags: ["session","fork"] },

  { id: "D1-012", domain: 1, scenario: "Developer Productivity with Claude",
    q: "Your code review agent processes 14-file pull requests in a single pass and produces inconsistent results: thorough analysis for some files, superficial comments for others, and occasionally contradictory feedback between files. How should you restructure the review workflow?",
    opts: {
      A: "Use prompt chaining: run per-file analysis passes for local issues, then a separate integration pass for cross-file concerns.",
      B: "Switch to a model with a larger context window to give all files adequate attention. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Force developers to submit smaller PRs of at most 3-4 files to ensure consistent analysis. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Run three independent review passes and only flag issues that appear in at least two of them. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "A",
    exp: "Splitting large reviews into focused passes directly addresses attention dilution. Per-file passes ensure consistent depth; an integration pass handles cross-file data flow. Option B confuses context size with attention quality. Option C would actually suppress real bugs caught intermittently.",
    tags: ["prompt-chaining","attention-dilution"] },

  { id: "D1-013", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agentic loop has no iteration cap. On one pathological session, the agent called <code>search_knowledge_base</code> 47 times in a row with slight query variations and never converged. What safety mechanism is missing?",
    opts: {
      A: "A system prompt instruction telling the model to stop after a reasonable number of tool calls.",
      B: "A hard iteration limit on the loop plus a policy for what to return when the limit is hit (e.g., escalate to a human).",
      C: "A lower temperature so the model doesn't rephrase the same query.",
      D: "A higher <code>max_tokens</code> so the model can give a final answer sooner."
    },
    a: "B",
    exp: "Every agentic loop needs a hard iteration cap as a safety rail. Prompt-based limits (D) are probabilistic. Temperature (C) addresses drift, not loop termination. Caps should pair with a fallback behavior (escalate, return partial result) so the cap doesn't silently fail.",
    tags: ["agentic-loop","iteration-cap"] },

  { id: "D1-014", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your coordinator writes this prompt to each subagent: \"Help with my research project.\" The subagents ask clarifying questions back through the coordinator rather than doing work. What's wrong?",
    opts: {
      A: "The coordinator shouldn't let subagents reply to it &mdash; they should only emit final output.",
      B: "The coordinator should call a <code>clarify</code> tool to resolve ambiguity before delegating.",
      C: "Subagents need concrete, self-contained task definitions.",
      D: "The subagents' system prompts are too permissive &mdash; they should be told never to ask questions."
    },
    a: "C",
    exp: "goal, scope, inputs, expected output shape. Generic prompts force them to guess or ask.",
    tags: ["subagent","task-specification"] },

  { id: "D1-015", domain: 1, scenario: "Code Review Agent",
    q: "Your code review agent is a single large prompt that tries to catch security bugs, style issues, test coverage gaps, and architectural concerns all at once. Reviewers say it's verbose and misses obvious bugs. What's the most effective restructuring?",
    opts: {
      A: "Use a larger model that can juggle all four concerns at once.",
      B: "Add more few-shot examples covering all four concern types.",
      C: "Increase temperature so the model considers a wider variety of issues.",
      D: "Decompose into focused specialist passes."
    },
    a: "D",
    exp: ", then aggregate findings. , then aggregate findings.",
    tags: ["prompt-chaining","decomposition"] },

  { id: "D1-016", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent loop uses <code>stop_reason === \"end_turn\"</code> to decide when to stop. A recent change added a tool that sometimes returns very large results. Now the loop occasionally terminates after that tool call without the agent producing a user-facing response. What changed?",
    opts: {
      A: "The agent is reaching <code>max_tokens</code> during the tool-result processing step and stopping silently.",
      B: "The tool itself set <code>stop_reason</code> on its response, forcing the loop to stop.",
      C: "Large tool results caused the loop's stop detector to misread <code>tool_use</code> as <code>end_turn</code>.",
      D: "The tool result exceeded <code>max_tokens</code>, so the model's final response was truncated before generation &mdash; stop_reason became <code>max_tokens</code>, not <code>end_turn</code>."
    },
    a: "A",
    exp: "Check for <code>stop_reason === \"max_tokens\"</code> and handle it (e.g., summarize tool output before continuing).",
    tags: ["agentic-loop","stop-reason"] },

  { id: "D1-017", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your coordinator spawns three subagents in parallel and then synthesizes their outputs. One subagent occasionally fails (API timeout). Currently the coordinator crashes the whole request. What's the right recovery pattern?",
    opts: {
      A: "Retry the whole coordinator turn until all three subagents succeed. It works in the easy case and leaves the hard cases silently broken.",
      B: "Have the coordinator catch per-subagent failures, proceed with partial results, and annotate the synthesis with \"X subtask failed\" so downstream consumers know.",
      C: "Mark the whole report as failed and ask the user to retry manually. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Serialize the subagents so failures are isolated per turn. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "B",
    exp: "Robust coordinators tolerate partial subagent failures: proceed with what succeeded, annotate gaps. Full retries (A) waste successful work. Serialization (D) abandons parallelism for the wrong reason.",
    tags: ["error-recovery","coordinator"] },

  { id: "D1-018", domain: 1, scenario: "Developer Productivity with Claude",
    q: "You want Claude Code to refactor a function and also run the tests. You notice the agent sometimes edits the file but forgets to run tests. Which mechanism most reliably enforces \"edit then test\" ordering?",
    opts: {
      A: "Few-shot examples showing correct edit-then-test behavior.",
      B: "Raising the temperature so the model considers testing more often.",
      C: "A PostToolUse hook on the Edit tool that automatically runs the test command.",
      D: "A system prompt instruction: \"After editing, you MUST run the tests.\""
    },
    a: "C",
    exp: "the ordering is programmatic. the ordering is programmatic.",
    tags: ["hook","post-tool-use"] },

  { id: "D1-019", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your synthesis agent receives findings from 5 specialist agents. It routinely merges their content but drops source attribution. Downstream reports lack citations. What's the fix?",
    opts: {
      A: "Tell the synthesis agent to \"preserve citations\" in its system prompt. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Switch to a larger model that retains more context. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Run a second LLM pass to add citations after synthesis. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      D: "Require each specialist agent to return structured claim-source pairs, and require the synthesis agent's output schema to include a source field per claim."
    },
    a: "D",
    exp: "Provenance is preserved by making source a required field in the structured output at every step of the chain. Prompt instructions alone lose attribution under summarization.",
    tags: ["provenance","schema"] },

  { id: "D1-020", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent occasionally sends the same refund twice when the user rephrases a request (\"yes, refund it\" then \"please go ahead and refund\"). Which pattern prevents duplicate destructive actions?",
    opts: {
      A: "Implement idempotency keys at the tool layer.",
      B: "Add a confirmation step where the user must type \"CONFIRM\" before any refund.",
      C: "Lower the temperature to reduce variability in the model's decisions.",
      D: "Add the word \"IDEMPOTENT\" in capital letters to the system prompt."
    },
    a: "A",
    exp: "the <code>process_refund</code> tool rejects a second call with the same order ID within a window.",
    tags: ["idempotency","tool-design"] },

  { id: "D1-021", domain: 1, scenario: "Multi-Agent Research System",
    q: "You want a research agent to recheck its own work before returning. You consider adding a self-review step. Which framing is most effective?",
    opts: {
      A: "Ask the same agent to \"double-check\" at the end of its own prompt.",
      B: "Have a separate verifier agent.",
      C: "Wrap the agent with a second call asking \"Is this answer correct? Yes or no.\"",
      D: "Increase temperature on the second pass to generate more variety."
    },
    a: "B",
    exp: "check the primary agent's output against specific criteria.",
    tags: ["verifier","self-review"] },

  { id: "D1-022", domain: 1, scenario: "Code Review Agent",
    q: "You add a \"critique\" step after every review. Review quality improves, but latency doubles because both passes run sequentially even though the critique only needs the review output. There's no way to parallelize them. What decision was correct?",
    opts: {
      A: "The critique should run on a smaller, faster model to recover latency.",
      B: "Sequential is wrong here &mdash; it should always be parallel.",
      C: "Sequential is correct because the critique's input is the review's output.",
      D: "The critique should be merged back into the review pass to halve latency."
    },
    a: "C",
    exp: "they have a true data dependency. Parallelism only applies to independent subtasks.",
    tags: ["orchestration","dependencies"] },

  { id: "D1-023", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent calls <code>get_order</code>, then <code>get_customer</code>, then <code>issue_refund</code>. Each tool returns ~30 fields but the agent only needs 2-3 from each. After 10 turns the context is bloated and the model starts missing facts. What's the right mitigation?",
    opts: {
      A: "Summarize the conversation every 3 turns.",
      B: "Increase <code>max_tokens</code> to fit more in context.",
      C: "Use a model with a larger context window.",
      D: "Trim tool outputs at the tool layer."
    },
    a: "D",
    exp: "return only the fields the agent actually needs (e.g., order_id, total, status) rather than the full record.",
    tags: ["tool-outputs","context-trimming"] },

  { id: "D1-024", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your system has a coordinator and specialist subagents. You want to add a new capability &mdash; citation formatting. Two designs are on the table: (1) add a <code>format_citation</code> tool to every agent, (2) add a new \"citation formatter\" specialist the coordinator can delegate to. Which is better?",
    opts: {
      A: "Option 2 &mdash; a new specialist with a focused role and tools preserves the per-agent tool count discipline.",
      B: "Option 1, but only on the synthesis agent. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Option 1 &mdash; keep it low-overhead and let each agent handle its own citations. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Neither &mdash; the synthesis agent should handle citations inline. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "A",
    exp: "Options 1 bloats every agent's tool surface.",
    tags: ["specialization","tool-count"] },

  { id: "D1-025", domain: 1, scenario: "Developer Productivity with Claude",
    q: "You launch an Explore subagent to map all usages of a function. It returns a 4000-line file listing. Your main session now carries that listing forward. What did you do wrong?",
    opts: {
      A: "Nothing &mdash; the full listing is useful context to keep around.",
      B: "The Explore agent should have been prompted to return a summary.",
      C: "Explore was the wrong tool &mdash; should have used Grep directly.",
      D: "The main session should have used <code>/compact</code> afterward."
    },
    a: "B",
    exp: ", not the raw listing. , not the raw listing.",
    tags: ["subagent","condensation"] },

  { id: "D1-026", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent's loop uses <code>while (stop_reason === \"tool_use\")</code>. You add a new tool with a validation step that can block a call. The validation returns an error as a tool result. The agent responds to the error, then calls another tool. The loop keeps going. Is this correct?",
    opts: {
      A: "No &mdash; the loop should exit on any tool error.",
      B: "No &mdash; the loop should auto-retry the failed tool.",
      C: "Yes &mdash; tool errors are normal loop input.",
      D: "Yes, but only if the agent's next action is to escalate to a human."
    },
    a: "C",
    exp: "reads the error as part of the tool_result, decides what to do next, and the loop continues until stop_reason flips to end_turn or a cap is hit.",
    tags: ["agentic-loop","error-handling"] },

  { id: "D1-027", domain: 1, scenario: "Multi-Agent Research System",
    q: "You spawn 8 parallel subagents for a large research task. 3 fail with rate-limit errors. You instinctively want to retry all 8. What's the better pattern?",
    opts: {
      A: "Halve concurrency for the whole task to avoid rate limits. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      B: "Cancel the batch and run sequentially. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "Retry all 8 &mdash; simpler and more consistent. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "Use <code>custom_id</code>-style identifiers to track per-subagent success and retry only the 3 that failed, with backoff."
    },
    a: "D",
    exp: "Successful work is preserved. Successful work is preserved.",
    tags: ["error-recovery","parallel"] },

  { id: "D1-028", domain: 1, scenario: "Code Review Agent",
    q: "Your review agent's system prompt says \"be thorough.\" Reviews run long &mdash; 90+ comments on small PRs, most cosmetic. What's the most effective way to tune it down?",
    opts: {
      A: "Replace \"be thorough\" with an explicit checklist of what counts as reportable (e.g., \"only flag issues that match.",
      B: "Post-process the output to trim comments. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "Lower temperature to 0. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      D: "Add \"be less thorough\" to balance it out. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "A",
    exp: "data-loss bugs, security risks, crashing errors, or public API breakages\"). Specificity beats vague qualifiers.",
    tags: ["prompt-specificity","criteria"] },

  { id: "D1-029", domain: 1, scenario: "Multi-Agent Research System",
    q: "You want three research paths run from a shared baseline analysis and compared later. Which orchestration best supports this?",
    opts: {
      A: "Sequential agents, each building on the prior. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "<code>fork_session</code> from the baseline analysis, three forks that diverge independently; compare their results outside the forks.",
      C: "One agent that tries all three approaches in its own context. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Three coordinators running in parallel on the raw query. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "B",
    exp: "<code>fork_session</code> is purpose-built for this: a shared baseline, independent divergent paths, clean comparison. Option C conflates paths in one context. Option D wastes the shared analysis.",
    tags: ["fork","divergent-paths"] },

  { id: "D1-030", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "You want to enforce \"every <code>process_refund</code> call must be preceded by a <code>get_customer</code> call in the same session.\" Where does this rule most reliably live?",
    opts: {
      A: "In the tool's own description. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "In the system prompt, with bold emphasis. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "In a PreToolUse hook on <code>process_refund</code> that fails the call if no <code>get_customer</code> has run in the session.",
      D: "In a few-shot example in the prompt. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "C",
    exp: "Session-level state checks (\"did X happen before Y?\") belong in hooks, which can see the full turn history deterministically. Prompts and tool descriptions are probabilistic and easy to skip.",
    tags: ["hook","pre-tool-use"] },

  { id: "D1-031", domain: 1, scenario: "Developer Productivity with Claude",
    q: "You want to run a long investigation but you know your teammate will need the takeaway at the end, without the full conversation. What's the cleanest pattern?",
    opts: {
      A: "Export the full session log at the end. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "Shorten the investigation. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "Just tell your teammate to scroll through the session.",
      D: "Design the agent to produce a final structured summary block."
    },
    a: "D",
    exp: "as its last action, separate from the working trace.",
    tags: ["handoff","structured-summary"] },

  { id: "D1-032", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your synthesis agent sometimes invents numbers that look plausible but don't appear in the source findings. You already require source attribution. What further structural step reduces fabrication?",
    opts: {
      A: "In the output schema, require every numeric claim to include the <em>exact verbatim quote</em> from the source that supports it.",
      B: "Increase temperature for diversity. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "Run the synthesis twice and compare. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      D: "Ask the synthesis agent to \"only use real numbers\" in its prompt. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "A",
    exp: "If the quote field is empty, validation fails.",
    tags: ["provenance","schema","fabrication"] },

  { id: "D1-033", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "You implemented a routing classifier in front of your agent that pre-selects which tools to expose based on the user message (\"refund request\" → expose refund tools only). You now see the agent occasionally unable to handle cross-topic cases (user mentions refund AND shipping). What's happening?",
    opts: {
      A: "The tools need better descriptions. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Pre-classification based on surface cues loses information when queries span topics.",
      C: "The classifier is the right design; the issue is prompt length.",
      D: "Increase the classifier's temperature for flexibility. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "B",
    exp: "Either widen the exposed toolset or let the main agent dispatch via a tool it calls itself (\"look up shipping status\" tool).",
    tags: ["routing","specialization"] },

  { id: "D1-034", domain: 1, scenario: "Code Review Agent",
    q: "Your code review agent reads a 50-file PR by calling <code>read_file</code> per file. Halfway through, its later comments start referencing files by generic descriptions (\"the utility module\") rather than concrete names, suggesting context pressure. What's the simplest structural fix?",
    opts: {
      A: "Increase <code>max_tokens</code>. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Pre-load all 50 files into the system prompt up front. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Decompose into per-file review subagents that process one file each and return findings; the coordinator aggregates.",
      D: "Run the review twice and compare. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "C",
    exp: "Per-file subagents get a fresh, focused context window each, eliminating the accumulation. Aggregation is a thin final pass. Preloading (A) compounds the same pressure.",
    tags: ["decomposition","subagent"] },

  { id: "D1-035", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your coordinator receives synthesis output and needs to decide whether to accept it or re-delegate with gap-filling instructions. Which coordinator design most supports this?",
    opts: {
      A: "The coordinator always accepts the first synthesis output.",
      B: "The user decides when to re-delegate.",
      C: "The synthesis agent self-scores its output.",
      D: "The coordinator runs an evaluation step."
    },
    a: "D",
    exp: "and only re-delegates when the checklist reveals gaps.",
    tags: ["iterative-refinement","coordinator"] },

  { id: "D1-036", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "You switch your agent from a single-turn classifier to a multi-turn conversational loop. Satisfaction scores rise for complex issues but drop for simple \"what's my order status?\" queries. What architectural choice would restore simple-case performance without losing complex-case gains?",
    opts: {
      A: "Gate complexity at the coordinator.",
      B: "Force all loops to terminate after 2 turns.",
      C: "Ask users to self-classify their query complexity.",
      D: "Revert to single-turn for everything."
    },
    a: "A",
    exp: "trivial queries (status lookup) route to a single-turn handler; complex queries enter the conversational loop. Match the workflow to the work.",
    tags: ["routing","complexity"] },

  { id: "D1-037", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your subagents write findings into a shared scratchpad file that the synthesis agent reads at the end. Benefits vs. just passing outputs through tool results?",
    opts: {
      A: "It's slower because of disk I/O. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      B: "A scratchpad decouples subagent runtimes from synthesis, keeps large intermediate data out of coordinator context, and persists across a session if you need to resume.",
      C: "Only useful if you're using Claude Code specifically. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "None &mdash; it adds a file dependency. It is superficially attractive and ignores the layer where the actual control point lives. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "B",
    exp: "Scratchpads are a documented technique: intermediate findings live outside the main conversation, coordinator context stays lean, and state survives session interruptions. Useful beyond Claude Code.",
    tags: ["scratchpad","context-management"] },

  { id: "D1-038", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent has a <code>create_ticket</code> tool. Occasionally it creates duplicate tickets when the user retries a failed action. What's the best fix on the agent side?",
    opts: {
      A: "Have the tool itself reject any creation request &mdash; humans only. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      B: "Tell the agent \"don't create duplicate tickets.\". It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Before creating, require the agent to call <code>search_tickets</code> with the customer and symptom to check for an existing open ticket.",
      D: "Raise the model's temperature. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "Enforce via a PreToolUse hook that short-circuits if the search wasn't run.",
    tags: ["prerequisite-gate","hook"] },

  { id: "D1-039", domain: 1, scenario: "Code Review Agent",
    q: "Your review agent fails when it tries to review a file that uses a language it doesn't know. Right now it returns a confident-looking but wrong review. What's the right agent-level defense?",
    opts: {
      A: "Tell the agent to \"only review languages you know.\"",
      B: "Expand the agent's tool list with a language detector.",
      C: "Reject unknown files at the ingest layer entirely.",
      D: "Require a schema field like <code>language_supported."
    },
    a: "D",
    exp: "bool</code> on the review output; when false, the agent emits an explicit \"not reviewed\" result instead of findings. Prevents silent hallucination.",
    tags: ["schema","confidence"] },

  { id: "D1-040", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your coordinator is written as a single long prompt listing every subagent's capabilities. The prompt is now 6000 tokens. Latency is suffering and the coordinator occasionally picks the wrong subagent. What architectural move helps most?",
    opts: {
      A: "Move subagent descriptions out of the prompt and into tool definitions (Task invocations with typed descriptions).",
      B: "Make the coordinator shorter by listing only 3 subagents &mdash; drop the least used. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Switch to a smaller model for the coordinator. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "Cache the coordinator's prompt. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "A",
    exp: "The coordinator then sees them as typed tools, not prose.",
    tags: ["coordinator","tool-design"] },

  { id: "D1-041", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "You log every tool call made by the agent and find that <code>search_knowledge_base</code> is called 3x on average per session, often with near-identical queries. What's the root cause most likely?",
    opts: {
      A: "The search tool has a bug. It works in the easy case and leaves the hard cases silently broken.",
      B: "The agent forgets prior results across turns.",
      C: "The knowledge base is too slow. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Temperature is too high. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "B",
    exp: "the tool results get summarized out of context. A session-scoped cache or a \"recently searched\" scratchpad would fix it.",
    tags: ["context-management","caching"] },

  { id: "D1-042", domain: 1, scenario: "Code Review Agent",
    q: "You want your review agent to not block merges, just comment. A teammate suggests adding a <code>block_merge</code> tool \"just in case it finds something severe.\" What's the concern?",
    opts: {
      A: "The agent would use it too rarely. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "None &mdash; more tools is better. It works in the easy case and leaves the hard cases silently broken.",
      C: "The capability should match the intended role.",
      D: "Tools are slow to call. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "C",
    exp: "Adding <code>block_merge</code> invites misuse and turns a soft-check into a hard gate. A commenting agent shouldn't have merge-blocking power.",
    tags: ["tool-design","least-privilege"] },

  { id: "D1-043", domain: 1, scenario: "Multi-Agent Research System",
    q: "You orchestrate a research pipeline across 4 agents. For deep audit-grade research, you want to record every tool call, every subagent invocation, and every artifact produced. What's the right place to implement this?",
    opts: {
      A: "Run the whole pipeline twice and diff for audit.",
      B: "In each agent's system prompt: \"log every step.\"",
      C: "Only log the final output.",
      D: "At the orchestration layer."
    },
    a: "D",
    exp: "hooks that emit structured telemetry on tool invocation, subagent spawn, and output events. Agents don't self-log reliably.",
    tags: ["telemetry","hooks"] },

  { id: "D1-044", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "You want your agent to always ask for confirmation on any action that moves money. You implement this as a system prompt rule. QA finds a 3% miss rate. What's the right hardening?",
    opts: {
      A: "Add a PreToolUse hook on every money-moving tool that inspects the turn history for an explicit user confirmation (e.g., a specific flag set by a <code>confirm_action</code> tool).",
      B: "Rephrase the system prompt rule with stronger wording. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Lower temperature. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "Add more few-shot examples. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "A",
    exp: "No confirmation → the call is rejected.",
    tags: ["hook","confirmation","high-stakes"] },

  { id: "D1-045", domain: 1, scenario: "Code Review Agent",
    q: "Your review agent currently posts each finding as a separate GitHub comment. Developers complain about noise &mdash; 30 small comments per PR. What workflow change reduces noise without losing coverage?",
    opts: {
      A: "Ask the agent to \"be less noisy.\". It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Add a grouping/aggregation step after the review.",
      C: "Limit the agent to 3 comments per PR.",
      D: "Disable the commenting feature. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "B",
    exp: "collapse findings into one structured summary comment (critical first, then others bucketed by type).",
    tags: ["workflow","aggregation"] },

  { id: "D1-046", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your synthesis agent, given findings from 8 subagents, has a strong tendency to over-weight the first and last findings it sees (lost-in-the-middle). You can't change the model. What workflow change helps?",
    opts: {
      A: "Pass findings one at a time across 8 turns. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "Switch to a bigger context window. It buys short-term quiet at the cost of hiding a bug that will resurface under load. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Present findings as a structured list with explicit section headers, put the most important findings at the edges, and include a short summary at the start naming each finding.",
      D: "Reorder findings alphabetically. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "C",
    exp: "Structural formatting and strategic positioning mitigates lost-in-the-middle. Headers and a leading summary improve middle-item retrieval. Bigger windows (D) don't fix the attention curve shape.",
    tags: ["lost-in-the-middle","structure"] },

  { id: "D1-047", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent handles a session across 3 separate billing issues. After the second issue, it starts mixing up dollar amounts between issues. Which pattern most reliably preserves per-issue facts?",
    opts: {
      A: "Summarize at the end of each issue.",
      B: "Start a new session per issue. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      C: "Increase the model's max tokens.",
      D: "Maintain a structured \"case facts\" block."
    },
    a: "D",
    exp: "injected into every prompt, outside the summarized conversation.",
    tags: ["case-facts","context"] },

  { id: "D1-048", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your coordinator's output schema includes a <code>confidence</code> field. Downstream, you discover that <code>confidence</code> is correlated with the coordinator's own verbosity, not with actual correctness. What does this suggest?",
    opts: {
      A: "LLM-generated confidence scores are often poorly calibrated signals of correctness.",
      B: "Add a self-critique step to calibrate the score. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "The coordinator needs a higher temperature to spread confidence.",
      D: "Swap the field for a <code>verbose</code> flag. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "A",
    exp: "over model-reported confidence for downstream gating. Prefer structural checks. Self-reported confidence is notoriously uncalibrated. Don't gate important decisions on it. Use deterministic checks (does the math work? does the source exist?) instead.",
    tags: ["confidence","calibration"] },

  { id: "D1-049", domain: 1, scenario: "Code Review Agent",
    q: "Your review agent only fires on PR open. A teammate asks it to also run on every push. You do so, and now every push triggers a full review. What's the efficiency concern and the fix?",
    opts: {
      A: "No concern &mdash; more reviews is better. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "Concern: full reviews on every push is wasteful and noisy. Fix: incremental reviews scoped to the diff since the last review, not the entire PR every time.",
      C: "Concern: Claude's API doesn't support pushes. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Fix: only review the first push. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "B",
    exp: "Incremental scoping to the new diff is the right pattern. Full re-reviews are expensive and often redundant.",
    tags: ["workflow","incremental"] },

  { id: "D1-050", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent needs to call an action that is irreversible (cancel a subscription). You want a \"dry-run / confirm\" two-step pattern. Where does that belong?",
    opts: {
      A: "In the system prompt, telling the agent to always dry-run first.",
      B: "In the tool description only.",
      C: "In the tool design itself.",
      D: "In the model choice &mdash; use a more cautious model."
    },
    a: "C",
    exp: "a <code>preview_cancel</code> tool that returns the would-be effect, and a separate <code>confirm_cancel</code> tool that requires a one-time confirmation token produced by the preview.",
    tags: ["tool-design","two-phase"] },

  { id: "D1-051", domain: 1, scenario: "Multi-Agent Research System",
    q: "You want your agent architecture to surface \"I don't know\" more often instead of confabulating. Which change has the highest leverage?",
    opts: {
      A: "Tell the model to say \"I don't know\" when unsure. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      B: "Lower the temperature. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Add a verifier pass to flag likely hallucinations. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Make \"unknown\" a first-class value in the output schema (e.g., <code>confidence."
    },
    a: "D",
    exp: "\"unclear\" | \"low\" | \"high\"</code>, <code>value: string | null</code>) so unknowns are representable rather than forced to a string.",
    tags: ["schema","unknown","hallucination"] },

  { id: "D1-052", domain: 1, scenario: "Code Review Agent",
    q: "Reviewers complain that your agent's severity labels drift: the same pattern is \"high\" in one PR, \"medium\" in the next. What's the most reliable anchor?",
    opts: {
      A: "Define each severity level with concrete code examples and matching criteria in the system prompt.",
      B: "Average severity across multiple runs. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      C: "Add a calibration step after the review. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "Lower temperature. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "A",
    exp: "Classification anchors beat adjectives.",
    tags: ["criteria","classification"] },

  { id: "D1-053", domain: 1, scenario: "Customer Support Resolution Agent",
    q: "Your agent resolves most tickets but occasionally hands off to humans for policy exceptions. You want to measure how good the hand-offs are. Which metric is most informative?",
    opts: {
      A: "Agent satisfaction scores. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "Human time-to-resolution per hand-off, split by whether the agent's hand-off summary covered (a) customer ID, (b) root cause, (c) recommended action.",
      C: "Total number of hand-offs per day. It works in the easy case and leaves the hard cases silently broken. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      D: "Average session length before hand-off. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "B",
    exp: "Completeness of the hand-off predicts resolution speed.",
    tags: ["metrics","handoff"] },

  { id: "D1-054", domain: 1, scenario: "Multi-Agent Research System",
    q: "Your research pipeline produces a final report. You want to make it easy to re-run the pipeline on the same query to check reproducibility. What's the cleanest architectural support?",
    opts: {
      A: "Ship the report to humans and ask them to re-run manually.",
      B: "Cache final reports by query.",
      C: "Record the full pipeline invocation.",
      D: "Use lower temperature so outputs are deterministic."
    },
    a: "C",
    exp: "query, coordinator/agent versions, seed (if used), timestamps, and persisted intermediate artifacts. A re-run uses the same record.",
    tags: ["reproducibility","provenance"] },

  // ==========================================================================
  // DOMAIN 2 — Tool Design & MCP Integration (36 questions)
  // ==========================================================================

  { id: "D2-001", domain: 2, scenario: "Developer Productivity with Claude",
    q: "Your agent has 18 tools available. Logs show it frequently selects the wrong tool, especially among tools with similar names like <code>analyze_content</code>, <code>analyze_document</code>, and <code>analyze_data</code>. What's the most effective fix?",
    opts: {
      A: "Reduce the agent's tool set to 4&ndash;5 role-relevant tools and rename them to eliminate functional overlap.",
      B: "Group tools into categories and present only the relevant category based on the query.",
      C: "Add a routing classifier that pre-selects the correct tool before the agent runs.",
      D: "Add detailed few-shot examples for every tool showing when each should be used."
    },
    a: "A",
    exp: "Giving an agent too many tools degrades selection reliability. The fix is reducing tools per agent and renaming to eliminate overlap.",
    tags: ["tool-count","naming"] },

  { id: "D2-002", domain: 2, scenario: "Developer Productivity with Claude",
    q: "Your MCP tool returns <code>{\"status\": \"error\", \"message\": \"Operation failed\"}</code> for all failure types &mdash; timeouts, invalid inputs, and policy violations alike. Why is this problematic?",
    opts: {
      A: "The error format doesn't use the MCP <code>isError</code> flag, so the agent doesn't recognize it as an error. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Uniform error responses prevent the agent from distinguishing retryable from non-retryable errors, blocking appropriate recovery decisions.",
      C: "The message is too short for the model to understand the error context. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Error messages should include stack traces so the agent can debug the underlying issue. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "B",
    exp: "Return structured error metadata: <code>errorCategory</code>, <code>isRetryable</code>, and descriptions. Generic errors hide whether the agent should retry, explain a policy violation, or escalate.",
    tags: ["error-structure","retry"] },

  { id: "D2-003", domain: 2, scenario: "Developer Productivity with Claude",
    q: "You need to configure a shared GitHub MCP server for your team and a personal experimental database explorer. Where should each be placed?",
    opts: {
      A: "Both in <code>~/.claude.json</code> since MCP servers need API tokens that shouldn't be committed.",
      B: "Shared server in <code>CLAUDE.md</code> with connection instructions; personal server in <code>~/.claude/CLAUDE.md</code>.",
      C: "Shared server in <code>.mcp.json</code> (project-scoped); personal server in <code>~/.claude.json</code> (user-scoped).",
      D: "Both in <code>.mcp.json</code> &mdash; team servers in one section, personal in another."
    },
    a: "C",
    exp: "<code>.mcp.json</code> = project/shared. <code>~/.claude.json</code> = user/personal. Env var expansion handles credentials without committing secrets.",
    tags: ["mcp-config","scope"] },

  { id: "D2-004", domain: 2, scenario: "Multi-Agent Research System",
    q: "Your synthesis agent sometimes uses the web search tool to look things up instead of routing through the coordinator, producing poor results because web search is outside its specialization. What's the best approach?",
    opts: {
      A: "Log all tool usage and add a post-processing step that flags cross-specialization tool use. It is superficially attractive and ignores the layer where the actual control point lives.",
      B: "Add a prompt instruction telling the synthesis agent not to use the web search tool. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Remove the web search tool from all agents and only allow the coordinator to perform searches. It works in the easy case and leaves the hard cases silently broken.",
      D: "Restrict the synthesis agent's tool set to only synthesis-relevant tools, optionally providing a scoped <code>verify_fact</code> tool for simple lookups."
    },
    a: "D",
    exp: "Restrict each subagent's tool set to those relevant to its role. Provide scoped cross-role tools for high-frequency needs.",
    tags: ["specialization","tool-set"] },

  { id: "D2-005", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "Your <code>process_refund</code> MCP tool has a business rule: refunds over $500 must go to a supervisor, not be processed automatically. Currently, you rely on the system prompt to instruct the agent not to auto-refund large amounts. Occasionally the agent still processes a $700 refund. What's the most reliable fix?",
    opts: {
      A: "Implement a tool call interception hook that blocks <code>process_refund</code> calls above $500 and redirects to an escalation workflow.",
      B: "Add few-shot examples showing the agent escalating all refunds over $500 rather than processing them.",
      C: "Remove the <code>process_refund</code> tool from the agent entirely and route all refunds through humans.",
      D: "Rephrase the system prompt with stronger language: \"You MUST NEVER process refunds over $500 without supervisor approval.\""
    },
    a: "A",
    exp: "Tool call interception hooks provide deterministic enforcement for policy-violating actions. Prompts are probabilistic.",
    tags: ["hook","policy"] },

  { id: "D2-006", domain: 2, scenario: "Multi-Agent Research System",
    q: "Your research system exposes a list of available research topics, active investigations, and document catalogs to the agent. Currently, the agent wastes calls exploring what's available before starting research. How should you expose this inventory?",
    opts: {
      A: "Cache the inventory and expose it through a <code>get_inventory</code> tool with 1-hour TTL.",
      B: "Expose the content catalogs as MCP resources.",
      C: "Include the full inventory in the system prompt so it's always in context.",
      D: "Create a <code>list_topics</code> tool that the agent must call first at the start of every session."
    },
    a: "B",
    exp: "agents visibility into available data without exploratory tool calls.",
    tags: ["mcp-resources","visibility"] },

  { id: "D2-007", domain: 2, scenario: "Structured Data Extraction",
    q: "You have a single <code>analyze_document</code> MCP tool used across extraction, summarization, and verification workflows. The agent frequently uses it for the wrong purpose. What's the best fix?",
    opts: {
      A: "Add a required <code>mode</code> parameter with values <code>\"extract\"</code>, <code>\"summarize\"</code>, or <code>\"verify\"</code>.",
      B: "Improve the system prompt with detailed instructions on when to use each mode.",
      C: "Split the generic tool into purpose-specific tools.",
      D: "Add few-shot examples showing correct use of each purpose."
    },
    a: "C",
    exp: "<code>extract_data_points</code>, <code>summarize_content</code>, <code>verify_claim_against_source</code>.",
    tags: ["tool-naming","purpose-specific"] },

  { id: "D2-008", domain: 2, scenario: "Structured Data Extraction",
    q: "Your extraction pipeline needs to reliably call exactly one of three extraction tools based on document type. The model occasionally returns conversational text instead of calling any extraction tool. How should you configure <code>tool_choice</code>?",
    opts: {
      A: "Use <code>tool_choice: \"auto\"</code> and add prompt instructions requiring a tool call.",
      B: "Use <code>tool_choice: \"required\"</code> (a new option) to force any tool call.",
      C: "Use <code>tool_choice: {\"type\": \"tool\", \"name\": \"extract_invoice\"}</code> as a default that the model can override.",
      D: "Use <code>tool_choice: \"any\"</code> to guarantee the model calls a tool while letting it choose which one."
    },
    a: "D",
    exp: "<code>\"any\"</code> forces a tool call but lets the model pick. <code>\"auto\"</code> permits conversational text. <code>\"required\"</code> is fabricated.",
    tags: ["tool-choice"] },

  { id: "D2-009", domain: 2, scenario: "Developer Productivity with Claude",
    q: "Your tool <code>run_query</code> accepts a SQL string. Agents sometimes construct queries with SQL injection risk when combining user input and column names. What's the right defense?",
    opts: {
      A: "Redesign the tool to accept structured parameters.",
      B: "Tell the model \"don't concatenate user input into SQL.\"",
      C: "Run a regex against the SQL before execution.",
      D: "Use a stricter model. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "A",
    exp: "rather than raw SQL. rather than raw SQL.",
    tags: ["tool-design","safety"] },

  { id: "D2-010", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "Your MCP server defines 12 tools, but only 4 are needed by your support agent. What should you configure?",
    opts: {
      A: "Split the MCP server into 3 servers of 4 tools each.",
      B: "Expose only the 4 relevant tools to the support agent.",
      C: "Use the server's full 12 tools; the model can ignore the rest.",
      D: "Prompt the agent to only use 4 of the 12."
    },
    a: "B",
    exp: "to keep selection quality high.",
    tags: ["tool-scoping","allowed-tools"] },

  { id: "D2-011", domain: 2, scenario: "Developer Productivity with Claude",
    q: "A tool description currently reads: \"Retrieves information.\" The agent often uses the wrong tool. What would fix this most?",
    opts: {
      A: "Shorten to one word. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Lowercase the description. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "Rewrite it to be specific about what, when, and why.",
      D: "Add a note: \"this is the right tool.\". It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "C",
    exp: "\"Fetches a customer's billing history for the last 90 days. Use when the user asks about past charges.\". Tool descriptions should specify what, when, and (optionally) why. Vague descriptions produce vague selection. Specificity is the biggest lever.",
    tags: ["tool-description"] },

  { id: "D2-012", domain: 2, scenario: "Multi-Agent Research System",
    q: "You have an MCP server that's useful for research but also exposes a destructive <code>delete_project</code> tool that the research agent must not touch. What's the right scoping?",
    opts: {
      A: "Trust the agent not to call it. It is superficially attractive and ignores the layer where the actual control point lives.",
      B: "Rename <code>delete_project</code> to something less tempting. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Add a prompt instruction forbidding destructive tools. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Configure allowed-tools on the server connection or agent to exclude <code>delete_project</code>."
    },
    a: "D",
    exp: "The agent never sees it. The agent never sees it.",
    tags: ["allowed-tools","safety"] },

  { id: "D2-013", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "Your MCP tool response includes <code>errorCategory</code> but not <code>isRetryable</code>. The agent sometimes retries permission errors indefinitely. What should you add?",
    opts: {
      A: "Add <code>isRetryable</code> as an explicit boolean. For permission errors, set it <code>false</code> so the agent knows to escalate rather than retry.",
      B: "Raise the temperature. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Retry limits at the tool layer. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "Tell the model never to retry. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "A",
    exp: "Structured error responses should include <code>isRetryable</code> explicitly. Category alone isn't enough &mdash; the agent still has to infer retry semantics. Make it explicit.",
    tags: ["error-structure","retry"] },

  { id: "D2-014", domain: 2, scenario: "Structured Data Extraction",
    q: "Your MCP tool always returns an empty array <code>[]</code> when its upstream dependency is unreachable, making \"no results\" indistinguishable from \"request failed.\" What's wrong and how to fix?",
    opts: {
      A: "Log the error and retry once before returning <code>[]</code>.",
      B: "Conflating empty results with failure silently hides errors.",
      C: "Empty-array-as-error is fine; the agent will figure it out.",
      D: "Return <code>null</code> instead of <code>[]</code>. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "B",
    exp: ", and the empty array only when the upstream succeeded but returned nothing. Return a structured error for failures. Access failure and \"valid empty result\" are semantically different. Returning the same signal for both prevents any sensible recovery behavior downstream.",
    tags: ["error-structure","semantics"] },

  { id: "D2-015", domain: 2, scenario: "Developer Productivity with Claude",
    q: "An MCP server developer wants to expose a live database schema to the agent so it can reason about available tables without calling a <code>describe_tables</code> tool. Which primitive?",
    opts: {
      A: "A system prompt snippet. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "A few-shot example in every message. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "An MCP resource, since the schema is content/visibility rather than an action.",
      D: "A tool. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "C",
    exp: "Resources expose content/state to the agent as ambient context. Actions are tools. \"Here's what exists\" is a resource.",
    tags: ["mcp-resources"] },

  { id: "D2-016", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "You set <code>tool_choice: \"any\"</code> for an extraction step. The model now calls a tool, but it sometimes picks a <em>specific</em> tool that doesn't match the document type because of wording. What else should you tighten?",
    opts: {
      A: "Switch to <code>\"auto\"</code>. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      B: "Add more tools. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Lower the temperature. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Improve tool names and descriptions so the correct one is obvious for each document type."
    },
    a: "D",
    exp: "<code>\"any\"</code> forces a call; naming still determines which.",
    tags: ["tool-choice","naming"] },

  { id: "D2-017", domain: 2, scenario: "Multi-Agent Research System",
    q: "Two MCP servers both expose a tool named <code>search</code>. The agent confuses them. What's the cleanest resolution?",
    opts: {
      A: "Namespace or rename the tools to be purpose-specific at each server.",
      B: "Remove one of the servers. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Configure the agent to prefer one server by default.",
      D: "Rely on the tool descriptions to disambiguate. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "A",
    exp: ", eliminating the collision. , eliminating the collision.",
    tags: ["naming","collision"] },

  { id: "D2-018", domain: 2, scenario: "Developer Productivity with Claude",
    q: "You want an MCP tool to support both a quick summary mode and a detailed mode without splitting it. What's the correct design?",
    opts: {
      A: "Two separate tools.",
      B: "One tool with a <code>depth.",
      C: "Always return detailed; let the agent summarize.",
      D: "Always return quick; let the agent re-query for detail."
    },
    a: "B",
    exp: "\"quick\" | \"detailed\"</code> enum parameter, if the two modes are genuinely the same operation with different verbosity. Split only if the operations are meaningfully different.",
    tags: ["tool-design","parameters"] },

  { id: "D2-019", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "Your MCP tool returns a 500-field customer object. Agent performance degrades after a few calls due to context bloat. The tool has no param for slimming the response. What's the right fix?",
    opts: {
      A: "Lower the temperature. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "Summarize the response in the agent's system prompt instructions. It works in the easy case and leaves the hard cases silently broken.",
      C: "Add a <code>fields: [...]</code> parameter to the tool so the caller requests only what it needs, or introduce a slim-by-default variant <code>get_customer_summary</code>.",
      D: "Reduce the number of sessions. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "C",
    exp: "Return only the fields the caller asks for, or provide a slim-first tool. Tool output shape is the right lever &mdash; the agent shouldn't have to post-filter.",
    tags: ["tool-design","context-bloat"] },

  { id: "D2-020", domain: 2, scenario: "Multi-Agent Research System",
    q: "You expose a <code>http_fetch</code> tool to an agent. It lets the agent hit arbitrary URLs including internal networks. What's the tool-design concern?",
    opts: {
      A: "Add a prompt rule forbidding internal hosts. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "None &mdash; fetching URLs is standard. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "The tool should return HTML only. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Overly broad capability is a security risk (SSRF). Restrict the tool to an allowlist of hosts/paths, or provide purpose-specific fetchers."
    },
    a: "D",
    exp: "instead of a generic one. instead of a generic one.",
    tags: ["security","tool-scoping"] },

  { id: "D2-021", domain: 2, scenario: "Developer Productivity with Claude",
    q: "Your agent keeps calling <code>read_config</code> at the start of every session to discover available configuration options. This consumes an unnecessary turn. What's the right architectural fix?",
    opts: {
      A: "Expose the config as an MCP resource so the agent can see it without a tool call.",
      B: "Cache the result client-side. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Put the config in the system prompt statically. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Remove <code>read_config</code> and replace with <code>read_config_v2</code>. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "A",
    exp: "Resources are for ambient visibility.",
    tags: ["mcp-resources","efficiency"] },

  { id: "D2-022", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "Your MCP server authenticates with a static API token committed in <code>.mcp.json</code>. Security review flags this. What's the correct pattern?",
    opts: {
      A: "Encrypt the token in the config. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Reference an environment variable in <code>.mcp.json</code> (e.g., <code>${SUPPORT_API_TOKEN}</code>).",
      C: "Rotate the token daily. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Move the whole config to <code>~/.claude.json</code>. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "B",
    exp: "The config file is committable; the secret lives in the developer's environment.",
    tags: ["mcp-config","secrets"] },

  { id: "D2-023", domain: 2, scenario: "Multi-Agent Research System",
    q: "You want every MCP tool call the agent makes to be logged with timing and status for audit. Where is the right place to implement this?",
    opts: {
      A: "Ask the agent to log its own calls. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "In the system prompt. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "In a PostToolUse hook or at the MCP server boundary.",
      D: "In each tool's own implementation. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "one place, consistent format across all tools.",
    tags: ["observability","hooks"] },

  { id: "D2-024", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "Your tool accepts a <code>customer_id</code>. The agent sometimes passes a customer name instead. What's the cleanest tool-side defense?",
    opts: {
      A: "Ask the user to confirm.",
      B: "Look up the customer by name as a fallback.",
      C: "Regex the input.",
      D: "Validate the input schema strictly."
    },
    a: "D",
    exp: "<code>customer_id</code> must match a known pattern (e.g., <code>C-\\d{5}</code>). Reject mismatches with a structured error explaining the expected format.",
    tags: ["input-validation","schema"] },

  { id: "D2-025", domain: 2, scenario: "Developer Productivity with Claude",
    q: "Your agent has a <code>run_shell</code> tool for arbitrary commands. A security review asks you to reduce the blast radius without losing useful capability. What's the best move?",
    opts: {
      A: "Replace <code>run_shell</code> with purpose-specific tools.",
      B: "Leave it; shell access is too useful to restrict.",
      C: "Keep <code>run_shell</code> but strip dangerous characters.",
      D: "Allow only <code>ls</code> and <code>cat</code>. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "A",
    exp: "that each invoke a predefined command.",
    tags: ["least-privilege","tool-design"] },

  { id: "D2-026", domain: 2, scenario: "Multi-Agent Research System",
    q: "You want your team to treat the MCP tool catalog as stable even as individual tools evolve. What versioning discipline serves this?",
    opts: {
      A: "Rename tools freely; agents adapt. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      B: "Version tool names when behavior changes in breaking ways.",
      C: "Never change tool names. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Always append a version number to every tool."
    },
    a: "B",
    exp: "and keep a deprecation path; additive changes (new optional params) keep the name.",
    tags: ["versioning","contract"] },

  { id: "D2-027", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "You notice your agent avoids a correct tool (<code>process_refund_draft</code>) because the name makes it sound like a partial operation. Which change most likely fixes this?",
    opts: {
      A: "Lower the temperature. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Add few-shot examples of using it.",
      C: "Rename to reflect what it actually does.",
      D: "Tell the agent to \"trust the tool.\""
    },
    a: "C",
    exp: "so the agent's implicit semantics match reality.",
    tags: ["naming","semantics"] },

  { id: "D2-028", domain: 2, scenario: "Structured Data Extraction",
    q: "You want to force the model to call <code>extract_invoice</code> specifically on invoice documents. Which tool_choice is appropriate?",
    opts: {
      A: "<code>\"any\"</code>. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "<code>\"required\"</code>. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "<code>\"auto\"</code>. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "<code>{\"type\": \"tool\", \"name\": \"extract_invoice\"}</code>."
    },
    a: "D",
    exp: "forces that specific tool, which is correct because you've already classified the document as an invoice.",
    tags: ["tool-choice"] },

  { id: "D2-029", domain: 2, scenario: "Developer Productivity with Claude",
    q: "Your MCP tools live in a shared repo. A teammate proposes committing their personal ClickHouse explorer tool into <code>.mcp.json</code>. What's the concern?",
    opts: {
      A: "Personal/experimental tools belong in <code>~/.claude.json</code>, not in the team's committed <code>.mcp.json</code>.",
      B: "Server performance. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      C: "None &mdash; shared tools help everyone. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "ClickHouse isn't supported over MCP. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "A",
    exp: "Committing personal tools pollutes everyone's tool catalog and increases selection ambiguity.",
    tags: ["mcp-config","scope"] },

  { id: "D2-030", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "Your MCP tool returns a huge response. You want the agent to see a summary but keep the full response addressable if needed. What's the right shape?",
    opts: {
      A: "Return only the summary. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "Return a structured response with a <code>summary</code> field and a <code>reference_id</code> the agent can pass to a companion <code>get_full</code> tool if the summary is insufficient.",
      C: "Split the tool into 50 smaller ones. It works in the easy case and leaves the hard cases silently broken. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      D: "Return everything always. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "B",
    exp: "Progressive disclosure. Progressive disclosure.",
    tags: ["tool-design","progressive-disclosure"] },

  { id: "D2-031", domain: 2, scenario: "Multi-Agent Research System",
    q: "Your tool description says \"USE THIS TOOL FOR EVERYTHING.\" The agent uses it too often, even when other tools fit better. What's the fix?",
    opts: {
      A: "Add warnings in caps. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Keep it; enthusiasm helps selection. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "Rewrite the description to say what the tool is for, not what it isn't.",
      D: "Capitalize less. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "C",
    exp: "specific operation, specific inputs, specific outputs. Self-promotion in descriptions distorts selection.",
    tags: ["tool-description"] },

  { id: "D2-032", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "You add a new guardrail: before any <code>refund</code>, the agent must get a manager PIN. You implement it as a prompt rule. QA reports the rule is skipped 2% of the time. You want deterministic compliance. Where does the check belong?",
    opts: {
      A: "A stronger prompt rule. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "A few-shot example. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "A system prompt rule in all caps. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "A PreToolUse hook that inspects the request for a valid PIN token. No PIN, no call."
    },
    a: "D",
    exp: "regardless of what the model decided.",
    tags: ["hook","pre-tool-use"] },

  { id: "D2-033", domain: 2, scenario: "Developer Productivity with Claude",
    q: "A tool takes an email address but you've seen the agent invent emails for customers when it lacks one. What schema-level defense helps?",
    opts: {
      A: "Make the parameter optional/nullable. When absent, the tool should refuse and return a structured error \"email required but not provided\".",
      B: "A required string. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Accept any string; validate later. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Raise temperature. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "A",
    exp: "the agent then asks the user, rather than inventing.",
    tags: ["nullable","fabrication"] },

  { id: "D2-034", domain: 2, scenario: "Multi-Agent Research System",
    q: "You want to tell agents \"this tool is expensive; prefer others when possible.\" Where should that hint live?",
    opts: {
      A: "In the system prompt. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      B: "In the tool description itself (a concise note on cost and when to prefer cheaper alternatives).",
      C: "In the few-shot examples only. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Nowhere &mdash; let the agent learn. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "B",
    exp: "Tool-specific behavioral hints belong with the tool itself. That way they apply wherever the tool is exposed, not just where your system prompt reaches.",
    tags: ["tool-description","cost"] },

  { id: "D2-035", domain: 2, scenario: "Customer Support Resolution Agent",
    q: "You have an MCP tool that takes 40 seconds when the backend is healthy, 5 minutes when it's degraded. Agents time out unpredictably. What's the right design response?",
    opts: {
      A: "Hard-cap all calls at 40 seconds. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "Ignore timeouts. It feels rigorous but doesn't give the agent the information it needs to recover well. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Split into sync-fast and async-slow variants. The fast version returns quickly or fails; the async version returns a job ID + a separate <code>check_status</code> tool.",
      D: "Always poll every 2 seconds. It feels rigorous but doesn't give the agent the information it needs to recover well. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "C",
    exp: "The agent can choose. The agent can choose.",
    tags: ["tool-design","async"] },

  { id: "D2-036", domain: 2, scenario: "Developer Productivity with Claude",
    q: "A teammate wants to use a public MCP server for GitHub integration. You're deciding between adopting it vs. building your own. What rule of thumb applies?",
    opts: {
      A: "Always build your own for control. It works in the easy case and leaves the hard cases silently broken.",
      B: "Always adopt; never build. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "Build only if you have more than 3 engineers. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Prefer community/existing servers for standard integrations (GitHub, Jira)."
    },
    a: "D",
    exp: "Build custom only for team-specific workflows and internal systems.",
    tags: ["mcp-server","build-vs-buy"] },

  // ==========================================================================
  // DOMAIN 3 — Claude Code Configuration & Workflows (40 questions)
  // ==========================================================================

  { id: "D3-001", domain: 3, scenario: "Code Generation with Claude Code",
    q: "A new developer joins your team and reports that Claude Code isn't following the team's coding standards. Other developers don't have this issue. Investigation reveals the standards are configured in <code>~/.claude/CLAUDE.md</code> on existing developers' machines. What's wrong?",
    opts: {
      A: "The new developer's Claude Code installation is outdated and doesn't support user-level config.",
      B: "The new developer needs to run <code>/memory</code> to manually load the configuration.",
      C: "User-level CLAUDE.md files only activate after the first completed session.",
      D: "User-level <code>~/.claude/CLAUDE.md</code> is personal and not shared via version control."
    },
    a: "D",
    exp: "Move instructions to project-level <code>.claude/CLAUDE.md</code>.",
    tags: ["claude-md","project-vs-user"] },

  { id: "D3-002", domain: 3, scenario: "Code Generation with Claude Code",
    q: "Your codebase has test files spread throughout many directories (e.g., <code>Button.test.tsx</code> next to <code>Button.tsx</code>). You want all tests to follow the same conventions regardless of location. What's the most maintainable approach?",
    opts: {
      A: "Create a <code>.claude/rules/testing.md</code> file with YAML frontmatter <code>paths.",
      B: "Create a skill in <code>.claude/skills/</code> that developers invoke before writing tests.",
      C: "Add all test conventions to the root <code>CLAUDE.md</code> under a \"Testing\" header.",
      D: "Place a <code>CLAUDE.md</code> file in every directory that contains test files."
    },
    a: "A",
    exp: "[\"**/*.test.*\"]</code> containing your test conventions.",
    tags: ["rules","glob"] },

  { id: "D3-003", domain: 3, scenario: "Code Generation with Claude Code",
    q: "You're creating a codebase analysis skill that produces hundreds of lines of verbose output. How should you prevent this from polluting the main conversation?",
    opts: {
      A: "Add instructions in the skill to summarize its own output to under 50 lines before returning.",
      B: "Add <code>context: fork</code> to the SKILL.md frontmatter so it runs in an isolated sub-agent context.",
      C: "Set <code>max_tokens: 200</code> in the skill frontmatter to limit output length.",
      D: "Write the output to a temporary file and return just the file path."
    },
    a: "B",
    exp: "<code>context: fork</code> runs skills in an isolated sub-agent, preventing verbose output from polluting the main conversation.",
    tags: ["skill","context-fork"] },

  { id: "D3-004", domain: 3, scenario: "Claude Code for Continuous Integration",
    q: "Your CI pipeline runs <code>claude \"Review this PR for issues\"</code> but the job hangs indefinitely. Logs show Claude Code is waiting for interactive input. What's the fix?",
    opts: {
      A: "Set the environment variable <code>CLAUDE_HEADLESS=true</code> before running the command.",
      B: "Use the <code>--batch</code> flag: <code>claude --batch \"Review this PR for issues\"</code>",
      C: "Use the <code>-p</code> flag: <code>claude -p \"Review this PR for issues\"</code>",
      D: "Redirect stdin from <code>/dev/null</code>: <code>claude \"Review this PR\" &lt; /dev/null</code>"
    },
    a: "C",
    exp: "<code>-p</code> (<code>--print</code>) runs in non-interactive mode: process, output, exit. The other options reference non-existent features.",
    tags: ["ci","flags"] },

  { id: "D3-005", domain: 3, scenario: "Code Generation with Claude Code",
    q: "You need to fix a failing date validation in one function in <code>utils/dateHelper.js</code>. You've already reviewed the stack trace and know the exact bug. Which execution mode is appropriate?",
    opts: {
      A: "Plan mode &mdash; every change should start with a plan to avoid regression.",
      B: "Plan mode &mdash; single-file changes still benefit from explicit design review.",
      C: "Direct execution, but spawn an Explore subagent first to verify no cross-file implications.",
      D: "Direct execution &mdash; the change is well-scoped with a clear fix, no architectural decisions needed."
    },
    a: "D",
    exp: "Direct execution fits well-scoped single-file changes with a known fix. Plan mode is overhead for simple changes.",
    tags: ["execution-mode","plan-vs-direct"] },

  { id: "D3-006", domain: 3, scenario: "Code Generation with Claude Code",
    q: "Your team has a massive root <code>CLAUDE.md</code> (900 lines) covering API conventions, testing standards, database patterns, and deployment rules. You want to reorganize without losing content. What's the most maintainable approach?",
    opts: {
      A: "Split into topic-specific files under <code>.claude/rules/</code> and use <code>@import</code> syntax in <code>CLAUDE.md</code> to reference them.",
      B: "Keep the monolithic <code>CLAUDE.md</code> but add a detailed table of contents at the top. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Move each section to a separate <code>CLAUDE.md</code> in the relevant subdirectory. It works in the easy case and leaves the hard cases silently broken.",
      D: "Convert each section into a slash command under <code>.claude/commands/</code>. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "A",
    exp: "<code>@import</code> plus <code>.claude/rules/</code> keeps standards modular while preserving whole-codebase applicability. Subdirectory CLAUDE.md fragments cross-cutting standards.",
    tags: ["at-import","claude-md"] },

  { id: "D3-007", domain: 3, scenario: "Claude Code for Continuous Integration",
    q: "Your CI pipeline posts inline PR comments from Claude's output. You're parsing plain text with regex and it occasionally breaks. How should you structure the output?",
    opts: {
      A: "Improve the regex to handle more edge cases.",
      B: "Use <code>claude -p --output-format json --json-schema findings.schema.json \"review this PR\"</code>.",
      C: "Pipe the output through a second Claude call to convert to JSON.",
      D: "Add instructions in the prompt for a specific text format with delimiters."
    },
    a: "B",
    exp: "<code>--output-format json</code> with <code>--json-schema</code> gives machine-parseable structured output. Regex/format-by-prompt is fragile.",
    tags: ["ci","json-output"] },

  { id: "D3-008", domain: 3, scenario: "Developer Productivity with Claude",
    q: "You're starting on an unfamiliar 200K-line codebase and need to trace the refund flow. You want verbose discovery to not clutter your main work session.",
    opts: {
      A: "Use <code>/compact</code> after exploration. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "Switch to Plan mode during exploration. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      C: "Use the Explore subagent to isolate the verbose discovery and return a summary to the main session.",
      D: "Read all candidate files into one big prompt upfront. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "C",
    exp: "Explore subagent isolates discovery and returns summaries. <code>/compact</code> is reactive cleanup.",
    tags: ["explore","subagent"] },

  { id: "D3-009", domain: 3, scenario: "Claude Code configuration",
    q: "You want Claude Code to use different conventions for backend files vs frontend files without repeating yourself. Root CLAUDE.md currently contains both. What's the cleanest split?",
    opts: {
      A: "Put both in one rules file under different headings.",
      B: "Use separate projects.",
      C: "Two separate root CLAUDE.md files.",
      D: "A <code>.claude/rules/backend.md</code> with <code>paths."
    },
    a: "D",
    exp: "[\"server/**\", \"api/**\"]</code> and a <code>.claude/rules/frontend.md</code> with <code>paths: [\"web/**\", \"app/**\"]</code>.",
    tags: ["rules","glob"] },

  { id: "D3-010", domain: 3, scenario: "Claude Code configuration",
    q: "You want Claude Code to always use <code>pnpm</code> in this repo even though you personally prefer <code>npm</code> everywhere else. Where does the preference go?",
    opts: {
      A: "In the project's root <code>CLAUDE.md</code> (committed).",
      B: "In an environment variable. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      C: "In <code>~/.claude/CLAUDE.md</code>. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "In a one-off prompt. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "A",
    exp: "everyone on the team gets the same behavior for this repo.",
    tags: ["claude-md","project-vs-user"] },

  { id: "D3-011", domain: 3, scenario: "Claude Code configuration",
    q: "A skill needs to run with read-only access &mdash; you don't want it writing or running shell commands. Which frontmatter knob enforces this?",
    opts: {
      A: "<code>readonly: true</code>. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "<code>allowed-tools: [\"Read\", \"Grep\", \"Glob\"]</code>.",
      C: "<code>max_tokens: 0</code>. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "<code>context: fork</code>. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "B",
    exp: "limits the skill to those tools, so writes and shell are unavailable.",
    tags: ["skill","allowed-tools"] },

  { id: "D3-012", domain: 3, scenario: "Claude Code configuration",
    q: "Your CI job runs <code>claude -p \"review\"</code> and needs to post each finding as a GitHub comment. The current output is prose. How do you make it script-friendly?",
    opts: {
      A: "Ask Claude to format findings as a YAML list in prose. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      B: "Run it twice and diff. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "Add <code>--output-format json</code> plus a <code>--json-schema</code> file that specifies the shape of a finding (file, line, severity, message).",
      D: "Parse prose with regex. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "C",
    exp: "The CI then iterates the structured array.",
    tags: ["ci","json-output"] },

  { id: "D3-013", domain: 3, scenario: "Claude Code configuration",
    q: "You want a reusable \"find dead code\" capability that any team member can invoke from Claude Code with a single command. What mechanism fits?",
    opts: {
      A: "A CLAUDE.md instruction block. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "An MCP server. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "A shared Google Doc. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      D: "A slash command or skill under <code>.claude/commands/</code> or <code>.claude/skills/</code>, committed so the whole team gets it."
    },
    a: "D",
    exp: "Reusable multi-step workflows belong in <code>.claude/commands/</code> (commands) or <code>.claude/skills/</code> (skills). Both are version-controlled and shared.",
    tags: ["commands","skills"] },

  { id: "D3-014", domain: 3, scenario: "Claude Code configuration",
    q: "A teammate asks: \"Why can't I just put MCP server config in CLAUDE.md so it all lives in one file?\"",
    opts: {
      A: "CLAUDE.md is for instructions (markdown). MCP server connections are configuration (JSON) and live in <code>.mcp.json</code>.",
      B: "CLAUDE.md can hold JSON in a code block. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "You can; it's just convention. It works in the easy case and leaves the hard cases silently broken.",
      D: "Only experimental servers can go in CLAUDE.md. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "A",
    exp: "The formats and loaders are separate systems.",
    tags: ["mcp-config","claude-md"] },

  { id: "D3-015", domain: 3, scenario: "Claude Code configuration",
    q: "Your root CLAUDE.md is 200 lines and works. Should you preemptively split it into <code>.claude/rules/</code> just to be modular?",
    opts: {
      A: "No, never split CLAUDE.md. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "Not necessarily &mdash; a 200-line focused CLAUDE.md is fine. Split only when size or multi-topic concerns make navigation painful (e.g., 900+ lines across 5 topics).",
      C: "Yes, always. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Yes, one file per section. It is superficially attractive and ignores the layer where the actual control point lives. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "B",
    exp: "Complexity should justify the split. Unconditional modularization is overhead with no payoff on small configs.",
    tags: ["claude-md","refactor"] },

  { id: "D3-016", domain: 3, scenario: "Claude Code configuration",
    q: "You want Claude Code to adopt certain style rules only in files that look like migrations (<code>migrations/*.sql</code>). Which mechanism matches?",
    opts: {
      A: "A top-level CLAUDE.md section titled \"Migrations.\"",
      B: "A skill with <code>context: fork</code>.",
      C: "A rule in <code>.claude/rules/migrations.md</code> with <code>paths.",
      D: "A user-level CLAUDE.md."
    },
    a: "C",
    exp: "[\"migrations/*.sql\"]</code>, which loads only when Claude edits matching files.",
    tags: ["rules","glob"] },

  { id: "D3-017", domain: 3, scenario: "Claude Code configuration",
    q: "A teammate pushes a PR that changes <code>.claude/commands/</code> and wants to know if these changes affect production behavior.",
    opts: {
      A: "Slash commands are runtime behavior and always affect production.",
      B: "They automatically run on every commit.",
      C: "They override runtime prompts.",
      D: "Slash commands are developer tooling for Claude Code interactive sessions."
    },
    a: "D",
    exp: "They don't run in production unless you deliberately wire them into a CI job.",
    tags: ["commands","scope"] },

  { id: "D3-018", domain: 3, scenario: "Claude Code configuration",
    q: "Your team wants a skill that performs a sensitive operation. You're nervous about accidental invocations. What's the best safeguard?",
    opts: {
      A: "Restrict the skill's <code>allowed-tools</code> to the minimum needed; optionally use <code>argument-hint</code> so the user must supply a confirmation string before it runs.",
      B: "Skip implementing the skill. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      C: "Put a warning at the top of the skill description. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      D: "Add more warnings in bold. It buys short-term quiet at the cost of hiding a bug that will resurface under load."
    },
    a: "A",
    exp: "Tool scoping is the hard safeguard. Combined with explicit argument requirements, you reduce accidental invocations structurally, not through warnings.",
    tags: ["skill","safety"] },

  { id: "D3-019", domain: 3, scenario: "Claude Code configuration",
    q: "You're seeing Claude Code ignore parts of a long CLAUDE.md. What's a likely cause and fix?",
    opts: {
      A: "Only the last 50 lines load. It looks plausible at first glance but creates its own failure modes you'd later have to work around. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Very large, multi-topic files suffer attention dilution like any long prompt. Modularize via <code>@import</code> from <code>.claude/rules/</code> so only relevant sections load or are easier to skim.",
      C: "CLAUDE.md has a 100-line limit. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "The file must be UTF-8 BOM. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "B",
    exp: "Cross-reference via explicit headings.",
    tags: ["claude-md","modularize"] },

  { id: "D3-020", domain: 3, scenario: "Claude Code configuration",
    q: "You want to add a personal experimental tool for your own use that you don't want committed. Where does it go?",
    opts: {
      A: "Root <code>CLAUDE.md</code>.",
      B: "<code>.claude/commands/</code>.",
      C: "<code>~/.claude.json</code>.",
      D: "Root <code>.mcp.json</code>."
    },
    a: "C",
    exp: "user-scope and never committed.",
    tags: ["mcp-config","scope"] },

  { id: "D3-021", domain: 3, scenario: "Claude Code execution modes",
    q: "You're about to refactor a public API used by 5 consumers across 3 services. Which execution mode fits?",
    opts: {
      A: "Direct. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      B: "Let the agent decide. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Skip mode selection. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "Plan &mdash; cross-service, multi-consumer refactors have several valid designs; align on one before touching files."
    },
    a: "D",
    exp: "Plan mode is earned when design decisions are open. Cross-service API refactors qualify. Direct is for scoped, decided changes.",
    tags: ["execution-mode","plan"] },

  { id: "D3-022", domain: 3, scenario: "Claude Code execution modes",
    q: "Your teammate argues: \"We should always use Plan mode; it's safer.\" What's the counter?",
    opts: {
      A: "Plan mode is overhead for well-scoped changes. Treating it as a universal default wastes time on review rounds for changes that have no open decisions.",
      B: "They're right. It buys short-term quiet at the cost of hiding a bug that will resurface under load. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "Plan mode is unsafe. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Direct mode is deprecated. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "A",
    exp: "Earn Plan mode with ambiguity, not caution.",
    tags: ["execution-mode"] },

  { id: "D3-023", domain: 3, scenario: "Claude Code CI",
    q: "Your CI uses <code>claude -p</code> and works. You want to add a strict JSON schema for the output. Which flag chain?",
    opts: {
      A: "<code>claude --batch --schema ...</code>. It is superficially attractive and ignores the layer where the actual control point lives.",
      B: "<code>claude -p --output-format json --json-schema ./schema.json \"...\"</code> to enforce the schema on the JSON output.",
      C: "<code>claude -p --output-format json \"...\"</code> alone. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "<code>claude -p --json-only \"...\"</code>. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "B",
    exp: "The three CI-relevant flags are <code>-p</code>, <code>--output-format</code>, and <code>--json-schema</code>. <code>--json-only</code> and <code>--batch</code> are fabricated.",
    tags: ["ci","flags"] },

  { id: "D3-024", domain: 3, scenario: "Claude Code CI",
    q: "A teammate asks whether <code>claude</code> (no flags) will work in a Jenkins pipeline.",
    opts: {
      A: "Yes, but only with stdin redirection. It is superficially attractive and ignores the layer where the actual control point lives.",
      B: "Only on GitHub Actions. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "No &mdash; without <code>-p</code>, Claude Code waits for interactive input and the job hangs.",
      D: "Yes, Jenkins auto-detects CI. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "C",
    exp: "Non-interactive mode is explicit.",
    tags: ["ci","flags"] },

  { id: "D3-025", domain: 3, scenario: "Claude Code session management",
    q: "You're in the middle of a long session and realize the context is getting too big for comfort. The code hasn't changed and the facts are still valid. Which is right?",
    opts: {
      A: "Reload Claude Code. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "Use <code>fork_session</code>. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Start a new session. It works in the easy case and leaves the hard cases silently broken.",
      D: "Run <code>/compact</code> to compress the current session."
    },
    a: "D",
    exp: "Context size is the problem; staleness is not.",
    tags: ["compact","session"] },

  { id: "D3-026", domain: 3, scenario: "Claude Code session management",
    q: "You finished a long investigation yesterday and today the repo has significant changes. You resume the session &mdash; the agent references functions that were removed. Best next step?",
    opts: {
      A: "Start a new session and inject a structured summary of prior findings.",
      B: "<code>/compact</code>. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "Re-read every file mentioned to refresh context. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "Add a prompt reminder that code may have changed. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "A",
    exp: "Prior tool results are stale and resumption propagates that staleness.",
    tags: ["session","fresh-start"] },

  { id: "D3-027", domain: 3, scenario: "Claude Code skills",
    q: "A skill emits tons of intermediate working output and you only want the final summary back in the main session. Which frontmatter option applies?",
    opts: {
      A: "<code>max_tokens: 200</code>.",
      B: "<code>context: fork</code>.",
      C: "<code>return_only: final</code>.",
      D: "<code>quiet: true</code>."
    },
    a: "B",
    exp: "runs the skill in an isolated sub-agent so only its final return value surfaces in the main session.",
    tags: ["skill","context-fork"] },

  { id: "D3-028", domain: 3, scenario: "Claude Code skills",
    q: "You want a skill to prompt the user for input if it's invoked without arguments. Which frontmatter option gives you that?",
    opts: {
      A: "<code>context: fork</code>. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "<code>interactive: true</code>. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "<code>argument-hint: \"path to analyze\"</code>.",
      D: "<code>require_args: true</code>. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "C",
    exp: "Claude Code uses the hint to prompt when the skill is invoked without input.",
    tags: ["skill","argument-hint"] },

  { id: "D3-029", domain: 3, scenario: "Claude Code configuration",
    q: "A project has both a root <code>CLAUDE.md</code> and a <code>src/components/CLAUDE.md</code>. When Claude edits a component file, which rules apply?",
    opts: {
      A: "Only the root. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Neither unless you invoke them. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Only the directory file. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      D: "Both &mdash; rules stack. Root rules always apply; directory rules add on when editing files in that directory."
    },
    a: "D",
    exp: "CLAUDE.md files stack; they don't override. Root + directory + personal all compose when relevant.",
    tags: ["claude-md","stacking"] },

  { id: "D3-030", domain: 3, scenario: "Claude Code configuration",
    q: "Your CI runs Claude Code and wants to know when Claude fails (non-zero exit). How?",
    opts: {
      A: "<code>claude -p</code> uses standard POSIX exit codes.",
      B: "Parse stdout for \"error.\". It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "Only GUI mode reports failures.",
      D: "Claude never exits non-zero. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "A",
    exp: "non-zero on failure. CI should check the exit code directly.",
    tags: ["ci","exit-codes"] },

  { id: "D3-031", domain: 3, scenario: "Claude Code configuration",
    q: "You want to expose a read-only report generator to teammates, not an agent that can modify the repo. What's the simplest shape?",
    opts: {
      A: "An MCP server. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "A skill with <code>allowed-tools.",
      C: "A shell alias. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      D: "A <code>CLAUDE.md</code> note. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "B",
    exp: "read-only tools, isolated context. [\"Read\", \"Grep\", \"Glob\"]</code> and <code>context: fork</code>. Skills with restricted <code>allowed-tools</code> give a focused, safe capability. <code>context: fork</code> also keeps the session tidy.",
    tags: ["skill","allowed-tools"] },

  { id: "D3-032", domain: 3, scenario: "Claude Code configuration",
    q: "You added a project-level MCP server that requires a secret. You don't want to commit the secret. What's the clean pattern?",
    opts: {
      A: "Commit the secret in a <code>.env</code> file.",
      B: "Encrypt the secret inside <code>.mcp.json</code>.",
      C: "In <code>.mcp.json</code>, use env var expansion.",
      D: "Put the server in <code>~/.claude.json</code>."
    },
    a: "C",
    exp: "<code>\"Authorization\": \"Bearer ${PROJECT_API_TOKEN}\"</code>. Teammates supply the var locally.",
    tags: ["mcp-config","secrets"] },

  { id: "D3-033", domain: 3, scenario: "Claude Code configuration",
    q: "You want to experiment with three variations of a refactor from the same starting analysis. What's the cleanest Claude Code workflow?",
    opts: {
      A: "Run all three in one session sequentially. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Use <code>/compact</code> between each. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      C: "Run them in three terminals on the main branch. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "Use <code>fork_session</code> three times from the analysis baseline, one fork per variation, then compare results outside the forks."
    },
    a: "D",
    exp: "<code>fork_session</code> is the documented way to branch from a shared context into independent explorations for comparison.",
    tags: ["fork-session"] },

  { id: "D3-034", domain: 3, scenario: "Claude Code configuration",
    q: "Your PR template requires a concise impact summary. You want Claude Code to produce one automatically. Which artifact shape fits?",
    opts: {
      A: "A slash command (<code>/impact</code>) or skill that produces a templated PR impact summary from the current diff.",
      B: "A rules file with paths. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "An MCP server. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "A CLAUDE.md instruction. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "A",
    exp: "Reusable on-demand workflows fit commands or skills. Both are directly invocable and version-controlled.",
    tags: ["commands","skills"] },

  { id: "D3-035", domain: 3, scenario: "Claude Code configuration",
    q: "Your team wants certain tools (like <code>Bash</code>) to be off-limits to Claude in a particular repo. Where should that restriction live?",
    opts: {
      A: "A CLAUDE.md rule saying \"don't use Bash.\". It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Settings-level <code>allowed-tools</code> or equivalent permission config at the project level.",
      C: "The user's shell profile. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "A prompt wrapper. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "B",
    exp: "the tool is structurally unavailable in that repo.",
    tags: ["permissions","allowed-tools"] },

  { id: "D3-036", domain: 3, scenario: "Claude Code configuration",
    q: "A teammate says they want each developer to have their own CLAUDE.md that overrides project-level rules. Can they?",
    opts: {
      A: "No, user-level is ignored in a project. It is superficially attractive and ignores the layer where the actual control point lives.",
      B: "Yes, user-level overrides project-level. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      C: "User-level (<code>~/.claude/CLAUDE.md</code>) and project-level (<code>.claude/CLAUDE.md</code>) both load simultaneously.",
      D: "Yes, but only during the first session. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "C",
    exp: "they stack, they don't override. If conflicts arise, resolve them in content, not by expecting one to suppress the other.",
    tags: ["claude-md","stacking"] },

  { id: "D3-037", domain: 3, scenario: "Claude Code configuration",
    q: "A skill produces a diagnostic report. You want its output to be machine-parseable by a downstream script. What's the cleanest approach inside Claude Code?",
    opts: {
      A: "Pipe through <code>jq</code>. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Use regex on the skill's prose. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      C: "Ask the skill to return YAML in prose. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      D: "Have the skill invoke <code>claude -p --output-format json --json-schema</code> internally, or produce JSON via <code>tool_use</code> with a schema."
    },
    a: "D",
    exp: "Structured output from Claude Code means JSON via flag or tool_use schemas. Skills can produce structured results the same way any Claude run does.",
    tags: ["structured-output","json"] },

  { id: "D3-038", domain: 3, scenario: "Claude Code configuration",
    q: "You want a project-wide rule: \"Never use <code>any</code> in TypeScript.\" This should apply anywhere TypeScript appears. Where?",
    opts: {
      A: "<code>.claude/rules/typescript.md</code> with <code>paths.",
      B: "An MCP server.",
      C: "A slash command.",
      D: "A subdirectory CLAUDE.md under <code>src/ts/</code>."
    },
    a: "A",
    exp: "it applies wherever a matching file is edited. [\"**/*.ts\", \"**/*.tsx\"]</code>. File-type rules that span directories are the exact use case for <code>.claude/rules/</code> with glob paths.",
    tags: ["rules","typescript"] },

  { id: "D3-039", domain: 3, scenario: "Claude Code configuration",
    q: "You want your root CLAUDE.md to stay a short index while letting detail live elsewhere. Which mechanism?",
    opts: {
      A: "A single giant CLAUDE.md. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "<code>@import</code> statements in CLAUDE.md pointing to topic files under <code>.claude/rules/</code>.",
      C: "A web of slash commands. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "User-level CLAUDE.md. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "B",
    exp: "The root stays scannable; detail lives alongside its topic.",
    tags: ["at-import","claude-md"] },

  { id: "D3-040", domain: 3, scenario: "Claude Code configuration",
    q: "A teammate converts every section of CLAUDE.md into a slash command because \"developers can invoke what they need.\" What's the concern?",
    opts: {
      A: "None; slash commands are always better.",
      B: "Slash commands are slower.",
      C: "Universally needed standards.",
      D: "Slash commands don't support markdown."
    },
    a: "C",
    exp: "must be applied automatically, not invoked manually.",
    tags: ["commands","standards"] },

  // ==========================================================================
  // DOMAIN 4 — Prompt Engineering & Structured Output (40 questions)
  // ==========================================================================

  { id: "D4-001", domain: 4, scenario: "Claude Code for Continuous Integration",
    q: "Your CI-based code review flags \"misleading comments\" but 70% of these findings are false positives. Developers have stopped reading the review output entirely. What's the most effective fix?",
    opts: {
      A: "Add \"be conservative and only report high-confidence findings\" to the review prompt. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "Add a second Claude instance to filter out low-confidence findings before posting. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "Temporarily disable the misleading comments category to restore trust, while rewriting the prompt with specific criteria defining what constitutes a misleading comment.",
      D: "Set temperature to 0 for more deterministic, consistent review output. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "C",
    exp: "General qualifiers like \"be conservative\" don't beat specific categorical criteria. Temporarily disable while you rewrite with concrete anchors.",
    tags: ["criteria","false-positives"] },

  { id: "D4-002", domain: 4, scenario: "Structured Data Extraction",
    q: "Your extraction pipeline parses JSON from <code>response.content[0].text</code>. It occasionally fails due to JSON syntax errors. What's the most reliable fix?",
    opts: {
      A: "Add \"Return valid JSON only, no markdown formatting\" to the system prompt.",
      B: "Use regex to extract the JSON block from the response text.",
      C: "Implement a JSON repair library that fixes common syntax issues before parsing.",
      D: "Use <code>tool_use</code> with a JSON schema &mdash; structured output via tool use eliminates JSON syntax errors."
    },
    a: "D",
    exp: "Tool use with schemas provides structural guarantees; prose-based JSON is always probabilistic.",
    tags: ["tool-use","structured-output"] },

  { id: "D4-003", domain: 4, scenario: "Structured Data Extraction",
    q: "Your extraction schema has all fields marked <code>required</code>. When processing invoices that lack a fax number field, the model fabricates plausible-looking fax numbers. How should you fix this?",
    opts: {
      A: "Make fields that may be absent in source documents <code>optional</code> (nullable) so the model can return <code>null</code>.",
      B: "Add \"Do not fabricate information. Leave fields blank if not found.\" to the prompt.",
      C: "Add a confidence score field and post-process to remove low-confidence extractions.",
      D: "Add few-shot examples showing the model omitting fields not present in the document."
    },
    a: "A",
    exp: "Nullable/optional fields let the model represent absence structurally. Required-without-null forces fabrication.",
    tags: ["nullable","fabrication"] },

  { id: "D4-004", domain: 4, scenario: "Structured Data Extraction",
    q: "Your overnight technical debt analysis could save 50% with the Message Batches API. However, the analysis uses multi-turn tool calling. Can you use the Batches API?",
    opts: {
      A: "Yes &mdash; batch processing supports tool calling with pre-computed tool results.",
      B: "No &mdash; the batch API does not support multi-turn tool calling within a single request.",
      C: "Yes &mdash; set up polling to feed tool results back into the batch job between turns.",
      D: "Yes &mdash; chain multiple batch submissions where each handles one turn."
    },
    a: "B",
    exp: "Restructure as single-turn prompts or keep synchronous calls.",
    tags: ["batch-api","tool-calling"] },

  { id: "D4-005", domain: 4, scenario: "Claude Code for Continuous Integration",
    q: "Your code review system classifies findings by severity but reviewers complain classifications are inconsistent &mdash; the same pattern is flagged as \"high\" in one PR and \"medium\" in another. What's the most effective way to achieve consistency?",
    opts: {
      A: "Lower the temperature to 0. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Add a self-review step. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "Define explicit severity criteria with concrete code examples for each level so the model has clear classification anchors.",
      D: "Run each classification twice and only accept agreement. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "C",
    exp: "Explicit anchored criteria beat vague categorical labels. Temperature doesn't fix undefined criteria.",
    tags: ["criteria","classification"] },

  { id: "D4-006", domain: 4, scenario: "Structured Data Extraction",
    q: "Your extraction pipeline uses <code>tool_use</code> + JSON schemas. All outputs pass JSON validation. But downstream systems receive line items that don't sum to the stated total. What should you add?",
    opts: {
      A: "Retry every extraction twice and compare. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "Switch to prompt-based JSON output with stricter instructions. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Stricter JSON schema validation. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Add both <code>stated_total</code> and <code>calculated_total</code> fields, then compare post-extraction to flag discrepancies."
    },
    a: "D",
    exp: "JSON schemas fix syntax not semantics. Both a stated and computed field creates a self-consistency signal.",
    tags: ["schema","validation"] },

  { id: "D4-007", domain: 4, scenario: "Structured Data Extraction",
    q: "Your extraction system handles academic papers. Your model extracts citations correctly from inline format but misses 40% when papers use numbered references. What's the most effective fix?",
    opts: {
      A: "Add few-shot examples demonstrating correct extraction from each citation format.",
      B: "Add a required <code>citation_format</code> field so the model must identify the format.",
      C: "Require authors to convert all papers to inline citation format.",
      D: "Train a custom classifier to detect citation format."
    },
    a: "A",
    exp: "Few-shot examples covering the structural variety in the input is the documented technique for cross-format generalization.",
    tags: ["few-shot","variety"] },

  { id: "D4-008", domain: 4, scenario: "Structured Data Extraction",
    q: "You need to batch-process 10,000 documents overnight. Previous runs had a 12% failure rate on oversized documents. How should you handle failures on the next run?",
    opts: {
      A: "Use synchronous API calls instead. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Use <code>custom_id</code> to identify each request; on batch completion, resubmit only failed documents (chunking oversized ones).",
      C: "Split into 100 batches of 100 documents. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "Submit the full 10,000 again on any failure. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "B",
    exp: "<code>custom_id</code> lets you correlate request/response pairs and resubmit only failed work with appropriate modifications.",
    tags: ["batch-api","custom-id"] },

  { id: "D4-009", domain: 4, scenario: "Structured Data Extraction",
    q: "You want a field that represents \"cannot determine from source.\" Which schema shape is best?",
    opts: {
      A: "Always require a value; filter later.",
      B: "Don't include the field.",
      C: "An enum <code>{\"present\".",
      D: "A required string with a magic value like <code>\"UNKNOWN\"</code>."
    },
    a: "C",
    exp: "\"high\" | \"low\", \"value\": string | null}</code> or a nullable field plus a boolean flag. Give the model a structural way to say \"I can't tell.\". Let the model express \"unknown\" structurally. Magic strings are brittle; dropping the field loses the signal; requiring a value forces fabrication.",
    tags: ["schema","unknown"] },

  { id: "D4-010", domain: 4, scenario: "Structured Data Extraction",
    q: "Your extraction captures dates but downstream systems misinterpret 2022 data and 2024 data as contradictory when they're just at different points in time. What's the simplest schema fix?",
    opts: {
      A: "Average the values. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Reject any old data. It works in the easy case and leaves the hard cases silently broken.",
      C: "Accept only the newest. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Add a required <code>as_of_date</code> or <code>publication_date</code> field to every data point."
    },
    a: "D",
    exp: "temporal differences are visible rather than hidden.",
    tags: ["schema","temporal"] },

  { id: "D4-011", domain: 4, scenario: "Claude Code for Continuous Integration",
    q: "You want a review prompt that reliably flags SQL injection. General \"look for security bugs\" underperforms. What works better?",
    opts: {
      A: "A checklist with concrete patterns.",
      B: "\"Be paranoid about security.\" Or \"check everything carefully.\"",
      C: "A higher temperature to surface creative bugs.",
      D: "Multiple passes with different wording."
    },
    a: "A",
    exp: "</code>) and an example of a match and a non-match for each.",
    tags: ["criteria","checklist"] },

  { id: "D4-012", domain: 4, scenario: "Structured Data Extraction",
    q: "Your extractor returns JSON. You want to ensure every output has at least one line item. Can JSON Schema enforce \"non-empty array\"?",
    opts: {
      A: "Only with a custom validator.",
      B: "Yes, use <code>minItems.",
      C: "Add a \"must have items\" note to the prompt.",
      D: "No, JSON Schema can't do that."
    },
    a: "B",
    exp: "1</code> on the array field. Use schema constraints for simple structural rules; use post-extraction validation for cross-field or semantic rules.",
    tags: ["schema","json-schema"] },

  { id: "D4-013", domain: 4, scenario: "Claude Code for Continuous Integration",
    q: "You're asked if setting <code>temperature: 0</code> will make a classification task deterministic.",
    opts: {
      A: "Only with <code>seed</code> also set. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Yes, temp 0 guarantees determinism. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Temperature 0 reduces variance but isn't a full determinism guarantee, and more importantly it doesn't fix undefined classification criteria.",
      D: "It depends on the model size. It feels rigorous but doesn't give the agent the information it needs to recover well."
    },
    a: "C",
    exp: "Ambiguous categories drift even at temp 0.",
    tags: ["temperature","determinism"] },

  { id: "D4-014", domain: 4, scenario: "Structured Data Extraction",
    q: "You're extracting receipts. Some have tips, some don't. The model sometimes returns <code>tip: 0</code> for receipts with no tip field, other times returns <code>tip: null</code>. Downstream code can't tell which. How to enforce consistency?",
    opts: {
      A: "Post-process to normalize.",
      B: "Instruct in the prompt.",
      C: "Always require <code>tip</code> as a number.",
      D: "In the schema, split into two fields."
    },
    a: "D",
    exp: "<code>tip_present: boolean</code> and <code>tip_amount: number | null</code>. Presence and value are different facts; separate them.",
    tags: ["schema","presence"] },

  { id: "D4-015", domain: 4, scenario: "Batch workloads",
    q: "You want to process 50k documents. Some take 30s synchronously, some 2 minutes. Deadline: 24h. Which workflow?",
    opts: {
      A: "Message Batches API, since 24h latency is acceptable and cost savings are significant.",
      B: "Synchronous API calls. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Stream each document one at a time. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      D: "Run 50k synchronous calls in parallel. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "A",
    exp: "Use <code>custom_id</code> for retries of failures.",
    tags: ["batch-api"] },

  { id: "D4-016", domain: 4, scenario: "Structured Data Extraction",
    q: "Your schema has a <code>confidence: number</code> field. You find it's strongly correlated with response length, not accuracy. What should you do?",
    opts: {
      A: "Trust it anyway. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "Don't gate decisions on self-reported confidence. Use structural checks (schema validation, math checks, source attribution) instead.",
      C: "Raise the confidence threshold. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "Ask for a confidence explanation. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "B",
    exp: "LLM-reported confidence is often uncalibrated. Prefer deterministic signals: does the math check out? Does the source exist? Does the field validate?",
    tags: ["confidence","calibration"] },

  { id: "D4-017", domain: 4, scenario: "Prompting",
    q: "A prompt says: \"Return a JSON object with the fields name, address, and total.\" The model sometimes returns fields in a different order or includes extra fields. What's the reliable fix?",
    opts: {
      A: "Tell it the field order in all caps. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Add more examples. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Use <code>tool_use</code> with a JSON schema defining the exact allowed fields.",
      D: "Lower the temperature. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "Extra fields are rejected; order is defined by the schema.",
    tags: ["tool-use","schema"] },

  { id: "D4-018", domain: 4, scenario: "Prompting",
    q: "You want Claude to reason step-by-step before answering. The model sometimes skips the reasoning. Best mechanism?",
    opts: {
      A: "Say \"think step by step\" in the user message. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "Lower the temperature. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Repeat the instruction three times. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Prefill the assistant turn with a <code>&lt;thinking&gt;</code> tag or use extended thinking if available."
    },
    a: "D",
    exp: "Structural prompting wins over polite requests.",
    tags: ["reasoning","prefill"] },

  { id: "D4-019", domain: 4, scenario: "Structured Data Extraction",
    q: "Your extraction prompt is currently 3 pages. You want to shorten it. Which content is safest to trim first?",
    opts: {
      A: "Restatements of the rules in multiple places, background context not relevant to the task, and filler like \"please be accurate.\" Keep criteria, examples, and schema constraints.",
      B: "Few-shot examples &mdash; they take the most space. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      C: "Schema definitions &mdash; schemas are verbose. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      D: "The output format spec. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "A",
    exp: "Trim redundancy and filler. Keep the load-bearing parts: specific criteria, representative examples, and structural constraints.",
    tags: ["prompt-length"] },

  { id: "D4-020", domain: 4, scenario: "Batch workloads",
    q: "A batch job has finished with 200 failures out of 10,000. You want to resubmit just those 200. What enables that?",
    opts: {
      A: "The Batch API has a built-in \"retry failed\" button. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "The <code>custom_id</code> field you set on each request lets you match response status back to inputs.",
      C: "Rerun everything. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Switch to synchronous. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "B",
    exp: "Build a new batch of only the 200 inputs whose results failed.",
    tags: ["batch-api","custom-id"] },

  { id: "D4-021", domain: 4, scenario: "Structured Data Extraction",
    q: "Your schema has a field <code>email</code> that is <code>string</code>. The model sometimes returns strings like \"not provided\" or \"N/A.\" Why does this happen and what fixes it?",
    opts: {
      A: "Lower the temperature. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "Extract twice and agree. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "A required string field forces the model to output a string even when one isn't available.",
      D: "The model is lazy; scold it in the prompt. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "C",
    exp: "boolean; email: string | null</code>). Make it <code>string | null</code> (or split into <code>email_present. Same pattern as the fax-number fabrication: required-without-null forces confabulation. Allow null or model presence explicitly.",
    tags: ["schema","nullable"] },

  { id: "D4-022", domain: 4, scenario: "Prompting",
    q: "You want to reliably get the model to pick one of a fixed set of categories (A, B, C). What's the best structural approach?",
    opts: {
      A: "Regex the output. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "A free-text response. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "A numbered list in the prompt. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "<code>tool_use</code> with a schema whose field is an enum <code>[\"A\", \"B\", \"C\"]</code>."
    },
    a: "D",
    exp: "Invalid categories become impossible by construction.",
    tags: ["schema","enum"] },

  { id: "D4-023", domain: 4, scenario: "Prompting",
    q: "A prompt frequently elicits long explanations when you just want a yes/no. What's the cleanest fix?",
    opts: {
      A: "Use <code>tool_use</code> with a schema.",
      B: "Lower <code>max_tokens</code>.",
      C: "Say \"keep it short.\"",
      D: "Truncate the response."
    },
    a: "A",
    exp: "the schema doesn't allow it. <code>{\"answer\": \"yes\" | \"no\"}</code>. The model can't emit prose. Constrain the shape via schema. Post-truncation and terse instructions are imprecise.",
    tags: ["schema","enum"] },

  { id: "D4-024", domain: 4, scenario: "Prompting",
    q: "You prepend a rich system prompt (5000 tokens). On many calls, the content is identical. What optimization?",
    opts: {
      A: "Store the prompt in a file. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "Enable prompt caching on the stable prefix so repeated calls reuse the cached tokens at dramatically lower cost and latency.",
      C: "Switch to a smaller model. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "Shorten the system prompt. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "B",
    exp: "Prompt caching is the documented optimization for a stable prefix shared across many calls. Always use it when the prefix is load-bearing and repeated.",
    tags: ["prompt-caching"] },

  { id: "D4-025", domain: 4, scenario: "Prompting",
    q: "You need consistent output style across calls. You consider setting a seed. What's the honest expectation?",
    opts: {
      A: "Seeds only work on base models. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      B: "Seed has no effect. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      C: "Seed plus temperature 0 reduces variance significantly but isn't a strict guarantee across infrastructure/version changes.",
      D: "A seed guarantees identical outputs. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "C",
    exp: "Pair it with schema constraints for structural consistency.",
    tags: ["seed","temperature"] },

  { id: "D4-026", domain: 4, scenario: "Claude Code for Continuous Integration",
    q: "You're classifying PR risk as <code>low</code>/<code>medium</code>/<code>high</code>. Reviewers want sub-reasons. What's the cleanest schema?",
    opts: {
      A: "One prose field.",
      B: "Bullet points in prose.",
      C: "Concatenate risk and reasons in one string.",
      D: "Enum <code>risk</code> field plus a structured <code>reasons."
    },
    a: "D",
    exp: "[{code, description}]</code> array. Categorical and textual parts are separated.",
    tags: ["schema","structure"] },

  { id: "D4-027", domain: 4, scenario: "Structured Data Extraction",
    q: "Your prompt includes 12 few-shot examples, each showing full extraction. Performance plateaus. Adding more examples hurts. What's the next move?",
    opts: {
      A: "Diversify the examples you already have.",
      B: "Train a fine-tune. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Rewrite the task description. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "Double the examples. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "A",
    exp: "cover different structural patterns rather than more instances of the same pattern. Quality/diversity beats volume after a point.",
    tags: ["few-shot","diversity"] },

  { id: "D4-028", domain: 4, scenario: "Prompting",
    q: "A prompt asks: \"Is this code secure? Explain.\" Output varies wildly. You want consistent structure. What's the fix?",
    opts: {
      A: "Add \"be consistent.\"",
      B: "Specify the output shape.",
      C: "Ask twice.",
      D: "Ask in bold."
    },
    a: "B",
    exp: "a schema with <code>verdict: \"secure\" | \"insecure\"</code>, <code>issues: [...]</code>, <code>recommendations: [...]</code>. The prompt becomes a contract.",
    tags: ["schema","structure"] },

  { id: "D4-029", domain: 4, scenario: "Prompting",
    q: "Your team debates whether to send long instructions in the system prompt vs. the first user message. What's the best default?",
    opts: {
      A: "User message always. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "System prompt always &mdash; user messages are ignored.",
      C: "Stable, task-independent instructions.",
      D: "It doesn't matter. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "C",
    exp: "go in the system prompt. go in the system prompt.",
    tags: ["system-prompt"] },

  { id: "D4-030", domain: 4, scenario: "Prompting",
    q: "Your pipeline requires extreme reliability: any deviation from schema is a production incident. You're using <code>tool_use</code>. What else?",
    opts: {
      A: "Switch to a prose response. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Raise the temperature. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "Nothing &mdash; <code>tool_use</code> is enough. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      D: "Validate the tool-use output against your JSON schema at the boundary before using it."
    },
    a: "D",
    exp: "Even with <code>tool_use</code>, belt-and-suspenders validation catches edge cases.",
    tags: ["validation","schema"] },

  { id: "D4-031", domain: 4, scenario: "Structured Data Extraction",
    q: "Your schema uses <code>string</code> for monetary amounts. You sometimes get values like <code>\"$1,234.56\"</code>. Downstream breaks. What's the correct modeling?",
    opts: {
      A: "Type the field as <code>number</code>.",
      B: "Accept any string. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "Reject non-ASCII. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      D: "Parse strings downstream."
    },
    a: "A",
    exp: "and optionally add a separate <code>currency</code> field.",
    tags: ["schema","types"] },

  { id: "D4-032", domain: 4, scenario: "Prompting",
    q: "You want the model to self-check math after producing it. Which is the most reliable?",
    opts: {
      A: "\"Check your math.\"",
      B: "Structural redundancy.",
      C: "Run the model twice and compare prose.",
      D: "Add more temperature."
    },
    a: "B",
    exp: "require both <code>stated_total</code> and <code>calculated_total</code> in the schema; compare them programmatically; mismatch flags for review.",
    tags: ["schema","self-consistency"] },

  { id: "D4-033", domain: 4, scenario: "Batch workloads",
    q: "You're designing a daily batch job. You want each request in the batch to be traceable back to a specific user record. Which field?",
    opts: {
      A: "The index in the batch. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "A comment in the prompt. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "<code>custom_id</code> on each request set to <code>user_id</code> (or a concat you can invert).",
      D: "A hash of the prompt. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "correlation is trivial. Responses carry <code>custom_id</code> back. <code>custom_id</code> is the designed correlation field. Use it; don't rely on ordering or prompt hashing.",
    tags: ["batch-api","custom-id"] },

  { id: "D4-034", domain: 4, scenario: "Prompting",
    q: "You expose a schema with enumerated categories. The data occasionally has a category you didn't anticipate. The model forces one of the listed categories. What should the schema allow?",
    opts: {
      A: "Nothing &mdash; forcing is correct. It works in the easy case and leaves the hard cases silently broken.",
      B: "A free-form string category. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Require a justification. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "Add an <code>other</code> enum plus a nullable <code>other_category."
    },
    a: "D",
    exp: "string</code>. When the data doesn't fit, the model can select <code>other</code> and describe it rather than misclassify.",
    tags: ["schema","extensibility"] },

  { id: "D4-035", domain: 4, scenario: "Prompting",
    q: "Your prompt ends with \"return JSON.\" Sometimes the model wraps the JSON in ```json ...```. What's the least fragile fix?",
    opts: {
      A: "Use <code>tool_use</code> with a schema.",
      B: "Use regex to extract.",
      C: "Prompt harder: \"no code fences.\"",
      D: "Strip code fences in post-processing."
    },
    a: "A",
    exp: "the response isn't prose. The wrapper disappears. <code>tool_use</code> is the robust path. Prose fixes are cat-and-mouse with model behavior.",
    tags: ["tool-use"] },

  { id: "D4-036", domain: 4, scenario: "Prompting",
    q: "You want two independent attempts at the same task and then a decision between them. Which pattern best supports this without doubling cost for simple cases?",
    opts: {
      A: "Run once and trust. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Run once; only run a second attempt if the first fails validation or disagrees with a known check (e.g., computed-field sanity).",
      C: "Always run twice. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Run four times and vote. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "B",
    exp: "Contingent duplication, not unconditional.",
    tags: ["retry","cost"] },

  { id: "D4-037", domain: 4, scenario: "Prompting",
    q: "Your CI uses <code>claude -p --output-format json --json-schema schema.json</code>. Reviewers want a human-readable summary too. What's the cleanest approach?",
    opts: {
      A: "Switch to prose output. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Parse prose for the machine path. It works in the easy case and leaves the hard cases silently broken.",
      C: "Keep one call with the JSON schema, then render the summary from the structured JSON in your CI script.",
      D: "Run Claude twice &mdash; once for JSON, once for prose. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "C",
    exp: "One Claude call, two outputs. One Claude call, two outputs.",
    tags: ["ci","rendering"] },

  { id: "D4-038", domain: 4, scenario: "Structured Data Extraction",
    q: "You want to extract a list of citations and preserve where each citation appears in the source. Schema shape?",
    opts: {
      A: "A list of objects with just the text. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "A flat list of strings. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "A single string with separators. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "A list of objects: <code>{text, source_span: {start, end}, page?}</code>."
    },
    a: "D",
    exp: "Capturing position makes the extraction auditable and reviewable.",
    tags: ["schema","provenance"] },

  { id: "D4-039", domain: 4, scenario: "Prompting",
    q: "You want a prompt to produce short, blog-style summaries. Currently summaries vary wildly in length and tone. What anchors them best?",
    opts: {
      A: "A style guide at the top of the prompt with 2 concrete reference summaries (good examples) and target length (e.g., 90-120 words).",
      B: "A longer prompt. It is superficially attractive and ignores the layer where the actual control point lives.",
      C: "Temperature 0. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "\"Be consistent.\". It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against."
    },
    a: "A",
    exp: "Specific, exemplified constraints.",
    tags: ["prompt-specificity","style"] },

  { id: "D4-040", domain: 4, scenario: "Prompting",
    q: "Your prompt uses extended thinking in some calls. You notice outputs are better but latency is higher. Which framing is correct?",
    opts: {
      A: "Never enable it. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "Extended thinking is a cost/latency vs. quality tradeoff. Enable for hard reasoning-heavy tasks; leave off for structured extraction and simple classification where it doesn't help.",
      C: "Always enable thinking. It looks plausible at first glance but creates its own failure modes you'd later have to work around. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "Thinking is a bug. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible. It is superficially attractive and ignores the layer where the actual control point lives."
    },
    a: "B",
    exp: "Extended thinking trades latency for deeper reasoning. Match to task needs &mdash; don't pay for it on simple tasks where it adds nothing.",
    tags: ["extended-thinking","cost"] },

  // ==========================================================================
  // DOMAIN 5 — Context Management & Reliability (30 questions)
  // ==========================================================================

  { id: "D5-001", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "During a long support session involving 3 issues, the agent starts referring to \"the refund\" without specifying which order, and confuses the $47.99 billing discrepancy with the $23.50 missing item credit. What pattern best addresses this?",
    opts: {
      A: "Restart the conversation for each separate issue. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "Extract transactional facts into a persistent \"case facts\" block included in each prompt, outside summarized history.",
      C: "Enable extended thinking. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "Increase <code>max_tokens</code> to preserve the full uncompressed history. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "B",
    exp: "Persistent case-facts blocks preserve numerical specifics across summarization boundaries.",
    tags: ["case-facts"] },

  { id: "D5-002", domain: 5, scenario: "Multi-Agent Research System",
    q: "Your research system synthesizes findings from multiple sources. Two credible sources report conflicting statistics. How should the synthesis agent handle this?",
    opts: {
      A: "Average the two values. It is superficially attractive and ignores the layer where the actual control point lives.",
      B: "Escalate to the coordinator to decide. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Include both values with source attribution and annotate the conflict.",
      D: "Use the more recent source and discard the older. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "C",
    exp: "Annotate conflicts with source attribution; distinguish well-established from contested findings.",
    tags: ["provenance","conflict"] },

  { id: "D5-003", domain: 5, scenario: "Multi-Agent Research System",
    q: "After reviewing 120 pages of source material, your analysis agent correctly identifies findings from the first 30 pages and last 20 pages but overlooks the middle sections. Which mitigation strategy best addresses this?",
    opts: {
      A: "Increase <code>max_tokens</code> so the model has room to mention all sections. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Reduce the source material to only the most relevant 50 pages. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      C: "Upgrade to a larger context window. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      D: "Place key findings summaries at the beginning of aggregated inputs and organize detailed results with explicit section headers."
    },
    a: "D",
    exp: "Lost-in-the-middle: place key findings at the start and use explicit headers to aid retrieval. Bigger windows worsen the effect.",
    tags: ["lost-in-the-middle"] },

  { id: "D5-004", domain: 5, scenario: "Multi-Agent Research System",
    q: "Your document analysis subagent encounters a source with conflicting statistics: the abstract says \"30% increase\" and Figure 3 in the same paper shows a 45% increase. How should the subagent report this?",
    opts: {
      A: "Complete the analysis with both values included and explicitly annotated as conflicting.",
      B: "Escalate the document to the coordinator for manual reconciliation.",
      C: "Flag the document as unreliable and exclude it.",
      D: "Use the abstract's value since abstracts are typically most authoritative."
    },
    a: "A",
    exp: "Preserve both values with annotation; let downstream decide. Silent picking loses data.",
    tags: ["provenance","conflict"] },

  { id: "D5-005", domain: 5, scenario: "Context management",
    q: "Your agent accumulates tool results over a long session. The model starts ignoring older results even when relevant. Which mitigation is structural?",
    opts: {
      A: "Increase max_tokens. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Maintain a session-scoped \"key facts\" block derived from tool results, injected into every prompt separate from the conversation history.",
      C: "Ask the model to remember. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      D: "Use a bigger context window. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "B",
    exp: "Summarization compresses history; the key-facts block is preserved.",
    tags: ["case-facts","summarization"] },

  { id: "D5-006", domain: 5, scenario: "Research",
    q: "Your synthesis agent reports \"AI adoption is at 35%.\" Downstream, the claim is used without source. You want to prevent unsourced claims. Which mechanism?",
    opts: {
      A: "Instruct the synthesis agent to always cite. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "Post-process to add sources. It works in the easy case and leaves the hard cases silently broken.",
      C: "Require every claim in the synthesis output to include a <code>source</code> field (required, not nullable).",
      D: "Let reviewers catch it. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "Un-sourced claims become schema-invalid.",
    tags: ["provenance","schema"] },

  { id: "D5-007", domain: 5, scenario: "Research",
    q: "A synthesis agent is given findings from 8 subagents without source attribution. It produces a coherent report. What's the reliability problem?",
    opts: {
      A: "Coherence isn't a reliability problem. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Run the synthesis twice. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Add a verifier. It buys short-term quiet at the cost of hiding a bug that will resurface under load. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Attribution was lost upstream. The report looks authoritative but the synthesis agent can't distinguish well-sourced findings from weak ones. Fix."
    },
    a: "D",
    exp: "require claim-source pairs from every subagent.",
    tags: ["provenance"] },

  { id: "D5-008", domain: 5, scenario: "Agent",
    q: "Your agent reads a 100-page PDF. It cites findings from pages 1-10 and 85-100 but skips pages 40-60. Which mitigation?",
    opts: {
      A: "Chunk the PDF into sections and process each in a focused pass, or at least add explicit section headers and a leading summary naming each section.",
      B: "Paste the whole PDF twice. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "Switch to a bigger model. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Use the Batch API. It buys short-term quiet at the cost of hiding a bug that will resurface under load. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible."
    },
    a: "A",
    exp: "Lost-in-the-middle is real. Lost-in-the-middle is real.",
    tags: ["lost-in-the-middle","chunking"] },

  { id: "D5-009", domain: 5, scenario: "Agent",
    q: "Your agent keeps re-reading files it already saw earlier in the session. Which pattern saves context and turns?",
    opts: {
      A: "A prompt reminder. It is superficially attractive and ignores the layer where the actual control point lives.",
      B: "A scratchpad file where the agent records what it's seen and what it learned, then references that instead of re-reading.",
      C: "Restart the session. It works in the easy case and leaves the hard cases silently broken. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Larger context window. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "B",
    exp: "The scratchpad survives summarization.",
    tags: ["scratchpad"] },

  { id: "D5-010", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "Your agent's <code>get_customer</code> tool returns 60 fields; only 4 are ever used. After several calls, context is bloated. Where's the fix?",
    opts: {
      A: "Bigger model. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "Summarize in context. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      C: "Return only the required 4 fields from the tool.",
      D: "Increase max_tokens. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "Source-side trimming is the most efficient context management.",
    tags: ["tool-outputs","trimming"] },

  { id: "D5-011", domain: 5, scenario: "Research",
    q: "You want downstream readers to distinguish \"consensus findings\" from \"contested findings.\" How should the synthesis output represent that?",
    opts: {
      A: "Average everything. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "Drop contested findings. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Narrative prose. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "A structured report with distinct sections or fields."
    },
    a: "D",
    exp: "<code>established_findings</code> (agreed sources) and <code>contested_findings</code> (with source-by-source values). Readers can filter by section.",
    tags: ["conflict","structure"] },

  { id: "D5-012", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "A long session is summarized. The summary preserves issue themes but loses dollar amounts and order numbers. The agent then makes a refund decision with wrong figures. Which pattern prevents this?",
    opts: {
      A: "Persist facts (amounts, IDs, dates) in a structured \"case facts\" block injected into every prompt, outside the summarized history.",
      B: "Always start new sessions. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "Don't summarize. It works in the easy case and leaves the hard cases silently broken. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "Manual review of every refund. It feels like the familiar lever, but it doesn't address the underlying structural issue."
    },
    a: "A",
    exp: "Let the summary compress prose; keep facts literal.",
    tags: ["case-facts","summarization"] },

  { id: "D5-013", domain: 5, scenario: "Research",
    q: "A research claim says \"market grew 35% in 2022\" and another says \"market grew 52% in 2024.\" A synthesis agent marks these as conflicting. Why is that wrong?",
    opts: {
      A: "The synthesis agent is always right.",
      B: "They aren't conflicting.",
      C: "It's right.",
      D: "Claims should match exactly."
    },
    a: "B",
    exp: "they're different points in time. Requiring a <code>as_of_date</code> field in every data point and documenting it prevents misinterpreting growth over time as contradiction.",
    tags: ["temporal","schema"] },

  { id: "D5-014", domain: 5, scenario: "Research",
    q: "You've been told \"every claim needs a source URL or publication.\" A subagent is tempted to write \"unknown\" for missing sources. How should the schema be shaped?",
    opts: {
      A: "Post-filter unsourced claims. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      B: "Allow \"unknown\" strings. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      C: "Make source a required field at the schema level.",
      D: "Lower the temperature. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "maybe it belongs in a separate \"speculation\" section with different rules. If a claim can't be sourced, it shouldn't be emitted as a claim. Required source fields force the model to either produce sources or omit the claim. Speculation is a different channel with different rules.",
    tags: ["provenance","schema"] },

  { id: "D5-015", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "Your agent supports three customer regions (US, EU, AP). Some policies differ. The agent sometimes applies the wrong region's policy. Which pattern?",
    opts: {
      A: "Three separate agents, one per region. It feels rigorous but doesn't give the agent the information it needs to recover well.",
      B: "Raise temperature. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      C: "Tell the agent the region in the prompt. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "A structured \"session context\" block including <code>region."
    },
    a: "D",
    exp: "\"EU\"</code> injected into every prompt, plus policy rules expressed as region-keyed rules. The agent doesn't have to remember; the context carries it.",
    tags: ["case-facts","region"] },

  { id: "D5-016", domain: 5, scenario: "Research",
    q: "Your synthesis agent is asked: \"Has Company X hit its 2025 revenue target?\" Sources disagree. The agent picks one and answers yes. What's the reliability issue?",
    opts: {
      A: "Silent conflict resolution hides information.",
      B: "The user's question was too narrow.",
      C: "Too few sources. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "None; confident answers are desirable."
    },
    a: "A",
    exp: "should report the disagreement with sources, not pick silently.",
    tags: ["conflict","reliability"] },

  { id: "D5-017", domain: 5, scenario: "Agent",
    q: "Your agent's session has been open for 2 hours. The model starts making contradictory statements within a single turn. What's the most likely cause and action?",
    opts: {
      A: "Raise temperature. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "Context degradation from accumulated summarization and/or tool results.",
      C: "Network issue. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      D: "Model is broken. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "B",
    exp: "Start a fresh session with a structured summary of the state, or at least <code>/compact</code>.",
    tags: ["context-degradation","session"] },

  { id: "D5-018", domain: 5, scenario: "Research",
    q: "Your synthesis agent must sometimes say \"insufficient evidence.\" Currently it always invents a conclusion. Which schema change helps?",
    opts: {
      A: "Lower temperature.",
      B: "Nothing; the model will learn.",
      C: "Make the <code>conclusion</code> field a union.",
      D: "Retry."
    },
    a: "C",
    exp: "<code>{status: \"supported\" | \"refuted\" | \"insufficient_evidence\", details: string}</code>. Insufficient evidence becomes a first-class output.",
    tags: ["schema","uncertainty"] },

  { id: "D5-019", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "Your agent hands off to human escalation with a summary. Humans complain the summaries miss the \"why.\" Which structured field most improves handoff quality?",
    opts: {
      A: "The full transcript. It works in the easy case and leaves the hard cases silently broken.",
      B: "An emoji rating. It treats a reliability concern as a prompting concern, which is exactly the framing the guidance cautions against.",
      C: "A longer free-text summary. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      D: "A required <code>root_cause_analysis</code> field plus a <code>recommended_action</code> field."
    },
    a: "D",
    exp: "Forcing the agent to state the why and the what-next improves consistency.",
    tags: ["handoff","schema"] },

  { id: "D5-020", domain: 5, scenario: "Research",
    q: "Your agent is asked to merge findings that use different units (kg vs lbs). It occasionally misconverts. Where does the fix belong?",
    opts: {
      A: "In a PostToolUse hook or a normalization step at the data-ingest boundary that converts to a canonical unit before the agent sees the data.",
      B: "In the prompt. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      C: "Ask the agent to double-check. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      D: "Use a smarter model. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "A",
    exp: "The agent never has to convert.",
    tags: ["normalization","hook"] },

  { id: "D5-021", domain: 5, scenario: "Agent",
    q: "You want to reduce context carried across turns without losing facts. Which combination is most effective?",
    opts: {
      A: "Lower max_tokens. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "Trim tool outputs at source + maintain a structured facts block + use scratchpad files for long-term findings.",
      C: "Never summarize. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      D: "Use a bigger model. It works in the easy case and leaves the hard cases silently broken."
    },
    a: "B",
    exp: "Three complementary levers, not one.",
    tags: ["context-management"] },

  { id: "D5-022", domain: 5, scenario: "Research",
    q: "You want research outputs to be reproducible. What's the minimum structured record you should keep per claim?",
    opts: {
      A: "The claim text. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause.",
      B: "Claim and a confidence score. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Claim, source identifier, source timestamp/publication date, and verbatim supporting quote.",
      D: "Claim and a short summary. It buys short-term quiet at the cost of hiding a bug that will resurface under load."
    },
    a: "C",
    exp: "Anything less and future auditors can't replicate.",
    tags: ["provenance","reproducibility"] },

  { id: "D5-023", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "Your agent summarizes past interactions for a returning customer. The summary sometimes includes events from other customers due to data bleed. What's the highest-leverage fix?",
    opts: {
      A: "Tell the agent to be careful. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      B: "Lower temperature. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Warn the user to double-check. It works in the easy case and leaves the hard cases silently broken.",
      D: "Strict per-customer scoping at the data layer."
    },
    a: "D",
    exp: "the agent only receives facts about the current customer_id, enforced by the tool/service, not the prompt.",
    tags: ["data-isolation","safety"] },

  { id: "D5-024", domain: 5, scenario: "Research",
    q: "A synthesis agent must combine findings from 10 subagents. The output is sometimes internally inconsistent (different numbers quoted in adjacent paragraphs). What structural fix?",
    opts: {
      A: "Have the synthesis agent first emit a structured fact table.",
      B: "Prompt the agent to be consistent. It buys short-term quiet at the cost of hiding a bug that will resurface under load.",
      C: "Run twice and compare. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      D: "Use a larger model. It looks plausible at first glance but creates its own failure modes you'd later have to work around."
    },
    a: "A",
    exp: ", then a narrative that must cite entries from that table.",
    tags: ["structure","consistency"] },

  { id: "D5-025", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "Your agent's long-running conversations get auto-summarized and details drift. One fix: persist a structured fact block. Another: run a periodic re-grounding step where the agent reads raw tool results again. When is re-grounding preferable?",
    opts: {
      A: "Only on weekends. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      B: "When facts may have changed since the conversation started (e.g., order status can change).",
      C: "Never. It is superficially attractive and ignores the layer where the actual control point lives.",
      D: "Always. It buys short-term quiet at the cost of hiding a bug that will resurface under load."
    },
    a: "B",
    exp: "Re-grounding beats a stale facts block. Otherwise, a facts block is cheaper.",
    tags: ["case-facts","re-grounding"] },

  { id: "D5-026", domain: 5, scenario: "Agent",
    q: "Your agent calls a flaky external API. When it fails, the agent proceeds as if it returned empty data. Result: wrong answers confidently delivered. Which structural fix?",
    opts: {
      A: "Retry silently. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "Turn off the tool. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      C: "Return structured errors (category.",
      D: "Always retry 10 times. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "transient, isRetryable: true) from the tool, and have the agent's schema include a <code>data_completeness</code> flag so the final answer must disclose partial or failed data.",
    tags: ["error-structure","completeness"] },

  { id: "D5-027", domain: 5, scenario: "Research",
    q: "Two subagents disagree: agent A says 35%, agent B says 52%. What should the coordinator pass to synthesis?",
    opts: {
      A: "Drop both. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem.",
      B: "The average. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      C: "Only the more confident value. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      D: "Both values with source/subagent attribution."
    },
    a: "D",
    exp: "synthesis can report the disagreement faithfully.",
    tags: ["conflict","coordinator"] },

  { id: "D5-028", domain: 5, scenario: "Customer Support Resolution Agent",
    q: "A support session accumulates tool results across 12 turns. Token usage climbs fast. Which complement does the biggest work to keep context sane?",
    opts: {
      A: "Tool outputs must be trimmed server-side.",
      B: "Manual pruning by the developer.",
      C: "One long prompt. It's the tempting shortcut; works until you hit an edge case that makes the real failure visible.",
      D: "Bigger context window. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "A",
    exp: ", then a case-facts block carries persistent identifiers, and a scratchpad file captures resolutions.",
    tags: ["context-management"] },

  { id: "D5-029", domain: 5, scenario: "Research",
    q: "Your synthesis agent receives well-sourced findings but drops attribution in its own output. You fix the schema to require source. The agent now puts placeholder sources like \"various.\" What schema refinement helps?",
    opts: {
      A: "Switch models. It looks plausible at first glance but creates its own failure modes you'd later have to work around.",
      B: "Narrow the source field type.",
      C: "Trust it. It works in the easy case and leaves the hard cases silently broken.",
      D: "Ask nicer. It sounds safe, but the guidance explicitly points elsewhere for this shape of problem."
    },
    a: "B",
    exp: "an object with <code>{name, url, publication_date}</code>, each required strings with specific patterns (url format). \"various\" can't pass validation.",
    tags: ["provenance","schema"] },

  { id: "D5-030", domain: 5, scenario: "Agent",
    q: "Your agent sometimes emits stale knowledge (e.g., \"the current CEO is X\" when that changed last year). How should you handle temporal knowledge in production?",
    opts: {
      A: "Ask users to correct it. It feels like the familiar lever, but it doesn't address the underlying structural issue.",
      B: "Fine-tune every month. It works in the easy case and leaves the hard cases silently broken.",
      C: "For facts that change over time, require the agent to retrieve them fresh from an authoritative tool.",
      D: "Trust the model. It's a commonly proposed patch that reduces the surface symptom without fixing the root cause."
    },
    a: "C",
    exp: "rather than relying on training-time knowledge.",
    tags: ["temporal","retrieval"] }

];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTION_BANK, DOMAIN_META, PLACEMENT_DISTRIBUTION, BANK_VERSION };
}
