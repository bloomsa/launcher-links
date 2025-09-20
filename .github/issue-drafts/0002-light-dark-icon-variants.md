---
title: Support light and dark variants for custom launcher icons
labels: enhancement, accessibility
---

## Summary
Allow users to provide separate SVG assets that match JupyterLab's light and dark
application themes so custom launcher icons remain legible in both modes.

## Background
Some icons rely on color contrasts that disappear when the UI theme changes. The
previous TODO asked for a way to define light/dark variants alongside the existing
single-icon option.

## Proposed approach
- Extend the launcher settings schema to accept `lightIcon` and `darkIcon` properties
  (while maintaining backwards compatibility with the existing `icon` field).
- Update the extension logic to choose the icon variant based on the current theme or
  theme change events.
- Provide migration guidance for users so existing configuration remains valid.

## Acceptance criteria
- [ ] Users can specify both light and dark icon variants in settings.
- [ ] The launcher automatically swaps icons when the active theme changes.
- [ ] Documentation covers how to provide dual-theme icons and any fallback behavior.
