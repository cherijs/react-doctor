<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/react-doctor-readme-logo-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/react-doctor-readme-logo-light.svg">
  <img alt="React Doctor" src="./assets/react-doctor-readme-logo-light.svg" width="180" height="40">
</picture>

> **Fork of [aidenybai/react-doctor](https://github.com/aidenybai/react-doctor)** — adapted for offline use and direct GitHub installation as a project dependency. Third-party network calls removed, runtime dependencies restructured for `npm install github:cherijs/react-doctor` support.

Scans your React codebase for security, performance, correctness, and architecture issues, then outputs a **0-100 score** with actionable diagnostics.

## What changed in this fork

| Area | Upstream | This fork |
|------|----------|-----------|
| Network calls | Telemetry and third-party service calls | Removed — runs fully offline with `--offline` |
| Install from GitHub | Not supported (`private: true`, dist gitignored) | `npm install -D github:cherijs/react-doctor` works out of the box |
| Runtime deps | Split across root and nested package | All runtime deps (oxlint, knip, ora, etc.) in root `dependencies` |
| Package identity | `react-doctor` (private) | `@cherijs/react-doctor` with `version`, `bin`, and `files` fields |

The core scanning engine, rules, and scoring are unchanged from upstream.

## Install

As a project devDependency (recommended for teams):

```bash
npm install -D github:cherijs/react-doctor
```

Then run:

```bash
npx react-doctor . --verbose --offline
```

Or run without installing:

```bash
npx -y react-doctor@latest .
```

> Note: `npx react-doctor@latest` pulls from the upstream npm registry, not this fork. Use the GitHub install for the fork version.

## How it works

React Doctor detects your framework (Next.js, Vite, Remix, etc.), React version, and compiler setup, then runs two analysis passes **in parallel**:

1. **Lint**: Checks 60+ rules across state & effects, performance, architecture, bundle size, security, correctness, accessibility, and framework-specific categories (Next.js, React Native). Rules are toggled automatically based on your project setup.
2. **Dead code**: Detects unused files, exports, types, and duplicates.

Diagnostics are filtered through your config, then scored by severity (errors weigh more than warnings) to produce a **0-100 health score** (75+ Great, 50-74 Needs work, <50 Critical).

## Options

```
Usage: react-doctor [directory] [options]

Options:
  -v, --version     display the version number
  --no-lint         skip linting
  --no-dead-code    skip dead code detection
  --verbose         show file details per rule
  --score           output only the score
  -y, --yes         skip prompts, scan all workspace projects
  --project <name>  select workspace project (comma-separated for multiple)
  --diff [base]     scan only files changed vs base branch
  --offline         skip network requests
  -h, --help        display help for command
```

## Configuration

Create a `react-doctor.config.json` in your project root to customize behavior:

```json
{
  "ignore": {
    "rules": ["react/no-danger", "jsx-a11y/no-autofocus", "knip/exports"],
    "files": ["src/generated/**"]
  }
}
```

You can also use the `"reactDoctor"` key in your `package.json` instead:

```json
{
  "reactDoctor": {
    "ignore": {
      "rules": ["react/no-danger"]
    }
  }
}
```

If both exist, `react-doctor.config.json` takes precedence.

### Config options

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `ignore.rules` | `string[]` | `[]` | Rules to suppress, using the `plugin/rule` format shown in diagnostic output |
| `ignore.files` | `string[]` | `[]` | File paths to exclude, supports glob patterns (`src/generated/**`, `**/*.test.tsx`) |
| `lint` | `boolean` | `true` | Enable/disable lint checks (same as `--no-lint`) |
| `deadCode` | `boolean` | `true` | Enable/disable dead code detection (same as `--no-dead-code`) |
| `verbose` | `boolean` | `false` | Show file details per rule (same as `--verbose`) |
| `diff` | `boolean \| string` | - | Force diff mode (`true`) or pin a base branch (`"main"`) |

CLI flags always override config values.

## Node.js API

```js
import { diagnose } from "react-doctor/api";

const result = await diagnose("./path/to/your/react-project");

console.log(result.score);       // { score: 82, label: "Good" } or null
console.log(result.diagnostics); // Array of Diagnostic objects
console.log(result.project);     // Detected framework, React version, etc.
```

## Use as a coding agent skill

This fork includes a Claude Code skill at `skills/react-doctor/SKILL.md`. Install it globally:

```bash
npx skills add cherijs/react-doctor@react-doctor -g -y
```

Or reference it from your project's `.claude/skills/` directory.

## Contributing

```bash
git clone https://github.com/cherijs/react-doctor
cd react-doctor
pnpm install
pnpm -r run build
node packages/react-doctor/dist/cli.js /path/to/your/react-project
```

## Credits

Built on [react-doctor](https://github.com/aidenybai/react-doctor) by [Aiden Bai](https://github.com/aidenybai). Original project is MIT-licensed.

### License

MIT
