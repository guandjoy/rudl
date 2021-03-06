import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react";
import PropTypes from "prop-types";
// Hooks
import useCursor from "./useCursor/index";
import useItems from "./useItems/index";
import useGhost from "./useGhost/index";
import useBody from "./useBody";
// Components
import BoundryBox from "./components/BoundryBox";
import Ghost from "./components/Ghost";
import Endline from "./Endline/index";
import Header from "./components/Header";
import ItemComponent from "./components/ItemComponent";
import useResponsiveRef from "./useResponsiveRef";
import useLayout from "./useLayout";
import useLoadHandler from "./useLoadHandler/index";
// Loglevel setup
var log = require("loglevel");
log.setLevel("warn");
log.getLogger("useGhost").setLevel("warn");
log.getLogger("useCursor").setLevel("warn");
log.getLogger("useGrid").setLevel("warn");
log.getLogger("useItems").setLevel("warn");
log.getLogger("useBody").setLevel("warn");
log.getLogger("useLayout").setLevel("warn");
log.getLogger("useLoadHandler").setLevel("warn");
log.getLogger("Endline").setLevel("warn");

function Rudl({
  transitionTimingFunction,
  transitionDuration,
  ghostTransitionDuration,
  ghostTransitionTimingFunction,
  children,
  onRearrange,
  onWidthResize,
  header,
  onEndlineEnter
}) {
  const [layoutRef, layoutWrapperWidth] = useResponsiveRef(onWidthResize);
  const [cursor, getDraggableItemEvents] = useCursor();
  const { items } = useItems({
    children,
    getDraggableItemEvents,
    cursor,
    transitionDuration,
    onRearrange
  });
  const ghost = useGhost(cursor, items, {
    ghostTransitionTimingFunction,
    ghostTransitionDuration
  });
  const body = useBody(cursor);
  const layout = useLayout(layoutWrapperWidth, items);
  const loadHandler = useLoadHandler();

  const renderItems = useMemo(
    () =>
      items.map((item, index) => (
        <ItemComponent
          item={item}
          key={`${item.id}-wrapper`}
          layoutElement={layout.isMount && layout.units[index]}
          transition={layout.transition}
          layoutIsMount={layout.isMount}
          transitionDuration={transitionDuration}
          transitionTimingFunction={transitionTimingFunction}
          ghostSourceId={ghost.sourceId}
          ghostIsActive={ghost.isActive}
          loadHandler={loadHandler}
        />
      )),
    [
      items,
      layout.isMount,
      layout.units,
      layout.transition,
      transitionDuration,
      transitionTimingFunction,
      ghost.sourceId,
      ghost.isActive,
      loadHandler
    ]
  );

  return (
    <div className="masonry" ref={layoutRef}>
      {header && layout.isMount && (
        <Header width={layout.width} component={header} />
      )}
      <BoundryBox
        width={layout.width}
        height={layout.height}
        transitionDuration={transitionDuration}
        transitionTimingFunction={transitionTimingFunction}
        transition={layout.transition}
        layoutIsMount={layout.isMount}
      >
        {renderItems}
        {ghost.isActive && <Ghost {...ghost} />}
        {layout.isMount && onEndlineEnter && (
          <Endline layout={layout} onEndlineEnter={onEndlineEnter} />
        )}
      </BoundryBox>
    </div>
  );
}

Rudl.propTypes = {
  header: PropTypes.element,
  children: PropTypes.element,
  reverse: PropTypes.bool,
  onEndlineEnter: PropTypes.func,
  onRearrange: PropTypes.func,
  onWidthResize: PropTypes.func,
  transitionDuration: PropTypes.number,
  transitionTimingFunction: PropTypes.string,
  ghostTransitionDuration: PropTypes.number,
  ghostTransitionTimingFunction: PropTypes.string
};

Rudl.defaultProps = {
  transitionDuration: 600,
  transitionTimingFunction: "ease",
  ghostTransitionDuration: 200,
  ghostTransitionTimingFunction: "ease"
};

export default Rudl;
