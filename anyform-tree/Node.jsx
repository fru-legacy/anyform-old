import Immutable from "immutable";
import classnames from "classnames";
import React from "react";
import {
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DragSourceSpec,
  ConnectDragSource,
} from "react-dnd";

import { DraggedNode, TYPE } from "./DraggedNode";
import { DroppableTreeViewInsertTarget } from "./InsertTarget";

const TreeViewItem =
  (props) => (
    props.connectDragSource(
      <div
        className={
          classnames('node', {
            ['nodeDragging']: props.isDragging,
          }) }
        key={ props.node.id }
        >
        <div>
          { props.renderNode(props.node) }
        </div>
        {
          props.node.isCollapsed
            ? null
            :
            <div className={ 'nodeChildren' }>
              { props.node.children && !props.node.children.items.isEmpty()
                ? <TreeViewItemList
                  parentNode={ props.node }
                  nodes={ props.node.children ? props.node.children : { items } }
                  classNames={ props.classNames }
                  renderNode={ props.renderNode }
                  onMoveNode={ props.onMoveNode }
                  /> 
                : <DroppableTreeViewInsertTarget
                  insertBefore={ false }
                  parentNode={ props.node }
                  parentChildIndex={ 0 }
                  precedingNode={ null }
                  onMoveNode={ props.onMoveNode }
                  /> }
            </div>
        }
      </div>
    )
  );

const gatherNodeIDs = (node) =>
  Immutable.Set.of(node.id).union(node.children ? node.children.items.flatMap(gatherNodeIDs) : Immutable.List()).toSet();

const nodeSource = {
  beginDrag: (props, monitor, component) => ({
    node: props.node,
    allSourceIDs: gatherNodeIDs(props.node),
    parentNode: props.parentNode,
    parentChildIndex: props.parentChildIndex,
    precedingNode: props.precedingNode,
  }),
};

const collectNodeDragProps =
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  });

export const DraggableTreeViewItem = DragSource(TYPE, nodeSource, collectNodeDragProps)(TreeViewItem);

const nodesWithPredecessors = (nodes) =>
  nodes
    .toIndexedSeq()
    .zipWith(
    (node, predecessor) => ({ node, precedingNode: predecessor }),
    Immutable.Seq(null)
      .concat(nodes)
    );

// TODO: add a mechanism to apply the CSS equivalent:
// .nodePositioningWrapper:hover {
//   /* otherwise drop targets interfere with drag start */
//   z-index: 2;
// }

export const TreeViewItemList = (props) => (
  <div className={ 'nodeList' }>
    {
      nodesWithPredecessors(props.nodes.items).map((node, index) =>
        <div
          key={ node.node.id }
          style={ { position: "relative" } }
          className={ 'nodePositioningWrapper' }
          >
          {
            index === 0
              ? <DroppableTreeViewInsertTarget
                insertBefore={ true }
                parentNode={ props.parentNode }
                parentChildIndex={ index }
                precedingNode={ null }
                onMoveNode={ props.onMoveNode }
                />
              : null
          }
          <DroppableTreeViewInsertTarget
            insertBefore={ false }
            parentNode={ props.parentNode }
            parentChildIndex={ index + 1 }
            precedingNode={ node.node }
            onMoveNode={ props.onMoveNode }
            />
          <DraggableTreeViewItem
            parentNode={ props.parentNode }
            parentChildIndex={ index }
            precedingNode={ node.precedingNode }
            node={ node.node }
            classNames={ props.classNames }
            renderNode={ props.renderNode }
            onMoveNode={ props.onMoveNode }
            />
        </div>
      )
    }
  </div>
);
