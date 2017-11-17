import React from 'react';
import { DropTarget, DropTargetConnector, DropTargetMonitor } from 'react-dnd'; 
import { DropTargetSpec, ConnectDropTarget } from 'react-dnd';

import { TYPE, DraggedNode } from "./DraggedNode";
import { Styles } from "./InsertTarget.styles.js";

import classNames from 'classnames/bind';
import styles from './index.scss';
const cx = classNames.bind(styles);

function canDrop(props, monitor) {
  let item = monitor.getItem();
  let isSource = props.parentNode === item.parentNode &&
  (
    props.parentChildIndex === item.parentChildIndex ||
    props.parentChildIndex === item.parentChildIndex + 1
  );
  let isSourceChild = item.allSourceIDs.contains(props.parentNode && props.parentNode.id);
  return !isSource && !isSourceChild;
}

function drop(props, monitor, component) {
  console.log(arguments);
  if (monitor.didDrop()) return; // A nested target already handled drop

  let item = monitor.getItem();
  props.onMoveNode({
    oldParentNode: item.parentNode,
    oldParentChildIndex: item.parentChildIndex,
    oldPrecedingNode: item.precedingNode,
    node: item.node,
    newParentNode: props.parentNode,
    newParentChildIndex: props.parentChildIndex,
    newPrecedingNode: props.precedingNode,
  });

  return {
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex,
  };
}

function getTargetProps(connect, monitor) {
  let c = {
    connectDropTarget: connect.dropTarget(),
    hovering: monitor.isOver() && monitor.canDrop(),
    show: !!monitor.getItem()
  };
  return c;
}

@DropTarget([TYPE], {drop, canDrop}, getTargetProps)
export function DroppableTreeViewInsertTarget({ connectDropTarget, hovering, show, insertBefore }) {
  return connectDropTarget(
    <div className={ cx('anyform-tree-insert-target', { hovering, show, insertBefore }) }>
      <div className={ cx('marker') } />
    </div>
  );
}