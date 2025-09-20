# Repository Guidelines

## Project Structure & Module Organization

- `src/` TypeScript source for the JupyterLab extension.
- `style/` CSS assets; `schema/` JSON settings schemas.
- `lib/` TypeScript build output (tsc). Do not edit by hand.
- `launcher_links/` Python package; `labextension/` contains built frontend assets; `_version.py` is auto‑generated.
- `ui-tests/` UI testing scaffold; Jest unit tests live alongside source (e.g., `src/**/*.spec.ts`).

## Build, Test, and Development Commands

- Environment: `uv sync` (installs deps, editable project) or `uv pip install -e .`.
- Dev watch: `jlpm watch` (TypeScript + labextension watch in development mode).
- Lint/format: `jlpm lint` or `jlpm lint:check`.
- Unit tests: `jlpm test` (Jest with coverage).
- Clean: `jlpm clean:all` (remove lib, labextension, caches).
- Production build (wheel + sdist): `uv run hatch build`.
- Force rebuild if assets are skipped: `jlpm clean:labextension` then reinstall/build.

**Note:** `jlpm` is provided by JupyterLab inside the project virtual environment. Run `. .venv/bin/activate` (or your preferred activation command) before invoking any `jlpm` scripts.

## Coding Style & Naming Conventions

- TypeScript: ESLint + Prettier. Single quotes, no trailing commas, `eqeqeq`, `curly: all`, prefer arrow callbacks.
- Interfaces start with `I` (e.g., `IWidgetProps`).
- CSS: Stylelint enforced; prefer readable class names (lowercase with hyphens when needed).
- Python: Follow PEP 8; keep modules small and focused. Do not edit `_version.py`.

## Testing Guidelines

- Write Jest tests near the code (`*.spec.ts` or `__tests__` dirs).
- Aim for meaningful coverage of UI logic and settings behaviors.
- Run `jlpm test` locally; use `--watch` for TDD.

## Commit & Pull Request Guidelines

- Commits: imperative, concise subject; include scope when helpful (e.g., "launcher: add custom icon mapping").
- PRs: include description, linked issues, and screenshots/GIFs for UI changes.
- Keep changes focused; update docs (`README.md`, `schema/`) when behavior changes.
- Do not commit generated files in `lib/`, `launcher_links/labextension/`, or `_version.py`; regenerate via the build steps.

## Agent-Specific Notes

- Use `apply_patch` for edits; avoid touching generated artifacts directly.
- If build hooks are skipped, clean outputs and rebuild rather than editing compiled files.
