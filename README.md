# @sidharthsuresh1993/dep-impact 📊

A CLI tool to analyze the impact of npm dependencies on your project's performance.

[![npm version](https://badge.fury.io/js/%40sidharthsuresh1993%2Fdep-impact.svg)](https://badge.fury.io/js/%40sidharthsuresh1993%2Fdep-impact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/sidharthsuresh1993/dep-impact/actions/workflows/node.js.yml/badge.svg)](https://github.com/sidharthsuresh1993/dep-impact/actions/workflows/node.js.yml)

## Features

- 📦 Analyzes bundle size and gzip size
- 🔄 Checks for ESM support and tree-shaking capability
- 📈 Shows transitive dependency count
- 💡 Suggests lighter alternatives
- 🎨 Beautiful terminal output
- 📋 JSON report export
- 🔄 Package comparison
- 🚀 GitHub Action integration
- 📊 Bundle size trend analysis

## Installation

```bash
# Install globally
npm install -g @sidharthsuresh1993/dep-impact

# Or use with npx
npx @sidharthsuresh1993/dep-impact
```

## Usage

### Analyze Project Dependencies

```bash
npx @sidharthsuresh1993/dep-impact analyze
```

Options:
- `-e, --export`: Export results to dep-impact-report.json
- `-s, --size-limit <size>`: Set size limit for dependencies (in KB)
- `-t, --trend`: Show bundle size trend for each dependency
- `-f, --format <format>`: Output format (table, json, markdown)

### Compare Packages

```bash
npx @sidharthsuresh1993/dep-impact compare moment dayjs
```

### GitHub Action

Add this to your workflow file:

```yaml
name: Dependency Size Check
on: [push, pull_request]

jobs:
  check-deps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx @sidharthsuresh1993/dep-impact analyze --size-limit 500
```

## Output Example

```
┌──────────────┬─────────┬──────────┬───────┬────────────┬─────┬───────────────┬─────────────┬─────────────┐
│ Package      │ Version │ Bundle   │ Gzip  │ Last       │ ESM │ Tree-Shakeable│ Dependencies│ Alternatives│
│              │         │ Size     │ Size  │ Update     │     │               │             │             │
├──────────────┼─────────┼──────────┼───────┼────────────┼─────┼───────────────┼─────────────┼─────────────┤
│ lodash       │ 4.17.21 │ 531.2 KB │ 71 KB │ 2021-04-02 │  ✗  │      ✗       │     0       │ ramda,      │
│              │         │          │       │            │     │               │             │ underscore   │
└──────────────┴─────────┴──────────┴───────┴────────────┴─────┴───────────────┴─────────────┴─────────────┘
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/sidharthsuresh1993/dep-impact.git
cd dep-impact

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Sidharth Suresh](https://github.com/sidharthsuresh1993) 