import React from "react";
import {
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
  DropTargetSpec,
  ConnectDropTarget,
} from "react-dnd";

import { TYPE, DraggedNode } from "./DraggedNode";
import { Styles } from "./InsertTarget.styles.js";

const TreeViewInsertTarget = (props) =>
  props.connectDropTarget(
    <div
      style={
        Object.assign(
          {},
          props.insertBefore ? Styles.insertBeforeTarget : Styles.insertAfterTarget,
          props.canDrop ? Styles.insertTargetCanDrop : {},
          props.isDropping ? Styles.insertTargetDropping : {}
        )
      }
      >
      <div style={ props.isDropping ? Styles.insertTargetMarkerDropping : {} } />
    </div>
  );

const handleCanDrop = (props, monitor, item) => (
    !(
      props.parentNode === item.parentNode &&
      (
        props.parentChildIndex === item.parentChildIndex ||
        props.parentChildIndex === item.parentChildIndex + 1
      )
    ) &&
    !item.allSourceIDs.contains(props.parentNode ? props.parentNode.id : null)
  );

const handleDrop = (props, monitor, component, item) => (
    props.onMoveNode({
      oldParentNode: item.parentNode,
      oldParentChildIndex: item.parentChildIndex,
      oldPrecedingNode: item.precedingNode,
      node: item.node,
      newParentNode: props.parentNode,
      newParentChildIndex: props.parentChildIndex,
      newPrecedingNode: props.precedingNode,
    }),
    ({
      parentNode: props.parentNode,
      parentChildIndex: props.parentChildIndex,
    })
  );

const nodeTarget = {
  drop: (props, monitor, component) => monitor.didDrop()
    ? undefined // some child already handled drop
    : handleDrop(props, monitor, component, monitor.getItem()),
  canDrop: (props, monitor) => handleCanDrop(props, monitor, monitor.getItem()),
};

const collectNodeDropProps = (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isDropping: monitor.isOver({ shallow: true }) && monitor.canDrop(),
  });

export const DroppableTreeViewInsertTarget =
  DropTarget([TYPE], nodeTarget, collectNodeDropProps)(TreeViewInsertTarget);
