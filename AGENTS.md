# Radius Office AI Harness

This file is the entry point for AI work in this project.

## Start of every session

1. Read `AGENTS.md`.
2. Read the latest relevant entries in `Sessions.md`.
3. Read relevant meeting records in `Transcripts.md`.
4. Read `Notes.md` for durable working context and project risks.
5. Inspect current source files before proposing or making changes. Notes record intent; source and rendered behavior prove current state.

## File responsibilities

- `Sessions.md`: append-only summaries of completed chat sessions.
- `Transcripts.md`: meeting records with source links, decisions, requirements, owners, and unresolved questions.
- `Notes.md`: concise, durable observations useful to future AI sessions. Do not duplicate full sessions or transcripts.

## Session-end trigger

When user says **`session end`** in chat:

1. Append one dated entry to `Sessions.md`.
2. Record goal, decisions, files changed, verification, unresolved items, and next action.
3. Add durable project knowledge to `Notes.md` only when useful beyond that session.
4. Add meeting content to `Transcripts.md` only when a transcript or meeting record was reviewed and is not already recorded.
5. Never overwrite earlier entries. Never claim verification that was not performed.

## Working rules

- Treat transcript statements as discussion until marked as decisions.
- Preserve speaker ownership when recording assignments.
- Prefer exact links, filenames, dates, states, and validation evidence.
- Ask before deleting source assets, deployment records, or non-Markdown references.
- Keep changes scoped to user request.
- Recurring AI mistake: text inside pills, value wells, buttons, and other boxes often looks top- or baseline-aligned instead of visually centered. Always center the complete text group vertically within its box, including mixed-size or mixed-weight labels, and verify the rendered alignment rather than trusting CSS properties alone.
