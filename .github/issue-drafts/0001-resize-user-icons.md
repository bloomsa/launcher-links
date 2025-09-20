---
title: Normalize size of user-provided launcher icons
labels: enhancement, frontend
---

## Summary
Ensure that SVG icons supplied by users for custom launcher entries are rendered at a
consistent size so that logos do not appear cropped or stretched.

## Background
The existing TODO noted that JupyterLab already applies automatic resizing, but this
cropping can truncate non-square icons. We should explicitly normalize the SVG viewBox
and dimensions for user-supplied assets so each launcher button displays cleanly.

## Proposed approach
- Inspect how the launcher currently loads SVG content from settings.
- Normalize incoming SVGs to a consistent square viewBox (e.g., 32x32) while preserving
  aspect ratio.
- Consider leveraging an SVG manipulation library to adjust width/height attributes or
  wrap icons in a centered viewBox.
- Add tests (or manual QA notes) to confirm that wide/tall icons render without cropping.

## Acceptance criteria
- [ ] User-supplied icons render at a consistent visual size without cropping.
- [ ] Documented guidance for icon preparation is added to user-facing docs or settings.
- [ ] Regression tests or manual QA steps confirm the new behavior.
