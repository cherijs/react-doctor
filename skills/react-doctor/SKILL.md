---
name: react-doctor
description: Run after making React changes to catch issues early. Use when reviewing code, finishing a feature, or fixing bugs in a React project.
version: 1.0.0
---

# React Doctor

Scans your React codebase for security, performance, correctness, and architecture issues. Outputs a 0-100 score with actionable diagnostics.

## Usage

If react-doctor is installed as a project devDependency (`github:cherijs/react-doctor`):

```bash
npx react-doctor <PROJECT_DIR> --verbose --diff --offline
```

If not installed as dependency, use the local build:

```bash
node /Users/cherijs/_REPO/react-doctor/packages/react-doctor/dist/cli.js <PROJECT_DIR> --verbose --diff --offline
```

### Flags

- `--verbose` — show affected files and line numbers
- `--diff` — only scan changed files (much faster)
- `--offline` — skip network requests
- `--score` — output only the numeric score
- `-y` — skip interactive prompts

### Examples

Scan the Uniwire dashboard:
```bash
cd frontend/apps/dashboard && npx react-doctor . --verbose --diff --offline
```

Full scan of any React project:
```bash
npx react-doctor /path/to/project --verbose --offline
```

## Workflow

Run after making changes to catch issues early. Fix errors first (they weigh most in scoring), then warnings. Re-run to verify the score improved. Target: 75+.
