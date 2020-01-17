import { pipe } from "ramda";
import { cloneElement } from "react";

export const initState = ({ state } = {}) => ({
  ...state,
  id: null,
  pos: null,
  source: null,
  className: null,
  component: null
});

const setSourceItem = item => ({ item });
const setSourceId = source => ({ ...source, id: source.item.id });
const setSourceElement = source => ({
  ...source,
  element: document.getElementById(source.id)
});
const setClassList = source => ({
  ...source,
  classList: source.element.classList
});
const addGhostClass = source => {
  source.classList.add("ghost");
  return source;
};
const addTouchClass = cursor => source => {
  cursor.isTouch && source.classList.add("touch");
  return source;
};
const setGhostSource = source => ({ source });
const setGhostId = ghost => ({ ...ghost, id: `${ghost.source.id}-ghost` });
const setGhostClassName = ghost => ({
  ...ghost,
  className: ghost.source.classList
});
const setGhostComponent = ghost => ({
  ...ghost,
  component: cloneElement(ghost.source.item.element, {
    draggableItem: { id: ghost.id, className: ghost.className }
  })
});
const setGhostPos = cursor => ghost => ({
  ...ghost,
  pos: {
    x: cursor.pos.x - cursor.dragPoint.x,
    y: cursor.pos.y - cursor.dragPoint.y
  }
});

const setGhost = cursor =>
  pipe(
    setSourceItem,
    setSourceId,
    setSourceElement,
    setClassList,
    addGhostClass,
    addTouchClass(cursor),
    setGhostSource,
    setGhostId,
    setGhostClassName,
    setGhostComponent,
    setGhostPos(cursor)
  );

export const drag = ({ state, cursor, item }) => {
  const ghost = setGhost(cursor)(item);
  return { ...state, ...ghost };
};
