# Code Review Graph Skill

## Purpose

This project has a **code-review-graph** knowledge graph (MCP server) that indexes functions, components, imports, callers/callees, and execution flows for the portfolio codebase.

**Always prefer the graph over Grep/Glob/Read** for exploration, impact analysis, and code review when the graph has relevant data.

Fall back to Grep/Glob/Read when the graph doesn't cover what you need (e.g., raw string search in config files, comments, or non-code assets).

## When to use which tool

| Task | Tool | Why |
|---|---|---|
| Reviewing a code change | `mcp__code-review-graph__detect_changes_tool` | Risk-scored diff analysis |
| Need source snippets for review | `mcp__code-review-graph__get_review_context_tool` | Token-efficient — returns only relevant code |
| "What breaks if I change X?" | `mcp__code-review-graph__get_impact_radius_tool` | Traces transitive dependents |
| Find a component/function by name | `mcp__code-review-graph__semantic_search_nodes_tool` | Handles fuzzy intent |
| Trace callers / imports | `mcp__code-review-graph__query_graph_tool` | Use patterns: `callers_of`, `callees_of`, `imports_of` |
| High-level structure | `mcp__code-review-graph__get_architecture_overview_tool` | Better than globbing folders |
| Find dead code / plan a rename | `mcp__code-review-graph__refactor_tool` | Graph-aware refactors |

## Recommended workflows

### Reviewing a change
1. `detect_changes_tool` → see risk score + affected nodes.
2. `get_review_context_tool` on flagged nodes → pull only the code you need.
3. `get_affected_flows_tool` → confirm which user-facing flows are touched.

### Exploring unfamiliar code
1. `semantic_search_nodes_tool` with a concept.
2. `query_graph_tool pattern="callers_of"` on the top hit.
3. `get_minimal_context_tool` → minimal slice needed to make a change.

### Planning a refactor or rename
1. `refactor_tool` → dry-run analysis.
2. `get_impact_radius_tool` → confirm blast radius is acceptable.
3. `apply_refactor_tool` only after human approves.

## Rules

- **Always** check the graph first before falling back to Grep/Read.
- **Token discipline**: prefer `get_review_context_tool` and `get_minimal_context_tool` over reading entire files.
- If results look stale, run `build_or_update_graph_tool` or check `list_graph_stats_tool`.
