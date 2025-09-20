todo.md

The remaining backlog items now live as draft GitHub issues so they can be promoted to
real issues on the repository when ready. Use the linked files as the body for
`gh issue create --title ... --body-file ...`.

## Completed

- [x] namespace css in svgs, right now they are in the global namespace of the dom and can overlap
- [x] any new categories added should have a standard icon
  - try doing this with a "sentinel item", an item with rank -Infinity which is hidden if category is not already present

## Migrated to GitHub issues

- Resize all user added svg icons to a single size (`.github/issue-drafts/0001-resize-user-icons.md`)
- Allow users to add light and dark variants of their svg icons (`.github/issue-drafts/0002-light-dark-icon-variants.md`)
- Simplify launcher ordering controls in the settings editor (`.github/issue-drafts/0003-launcher-ordering-controls.md`)
