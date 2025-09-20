---
title: Simplify launcher ordering controls in the settings editor
labels: enhancement, UX
---

## Summary
Clarify how users order launcher items in the settings editor by resolving the overlap
between the "Move up/Move down" buttons and the numeric `rank` field.

## Background
The TODO highlighted that the existing controls are confusing: the rank ultimately
controls ordering inside a category, yet the UI also shows move buttons. This can lead
users to believe the buttons change order when they do not persist.

## Proposed approach
- Review how ranks are interpreted per category and how the settings array order is
  applied.
- Explore replacing the manual rank field with drag-and-drop or by relying solely on the
  array order within each category.
- If rank must remain, clarify its purpose with helper text and ensure the move buttons
  reflect the actual persisted order.

## Acceptance criteria
- [ ] Launcher ordering controls behave predictably and match what is saved.
- [ ] Updated UI copy or controls explain how ordering works.
- [ ] Tests or manual QA cover ordering across multiple categories.
