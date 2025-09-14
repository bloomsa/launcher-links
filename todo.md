todo.md
- [x] namespace css in svgs, right now they are in the global namespace of the dom and can overlap
- [ ] resize all user added svg icons to a single size
- [ ] allow users to add light and dark variants of their svg icons
- [ ] disable "Move up" and "Move down" buttons in the settings page
or rethink UX to group by category and then "Move up" and "Move down" actually changes ranks of icons relative to other icons in the same category
- [x] any new categories added should have a standard icon
  - try doing this with a "sentinel item", an item with rank -Infinity which is hidden if category is not already present 