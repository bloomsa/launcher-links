todo.md

- [x] namespace css in svgs, right now they are in the global namespace of the dom and can overlap
- [ ] resize all user added svg icons to a single size
  - seems like jupyterlab already resizes svgs to fit w/i the launcher item. it crops them which is not ideal, but how many logos would we deal with that aren't square (fit within a square at least)
- [ ] allow users to add light and dark variants of their svg icons
- [ ] cleanup confusing ux between "move up", "move down" buttons in settings editor, and the rank field. rank is what actually impacts order w/i category. Maybe could remove rank and use order of settings array as ordering w/i the launcher. denoting between categories may be odd though.
- [x] any new categories added should have a standard icon
  - try doing this with a "sentinel item", an item with rank -Infinity which is hidden if category is not already present
