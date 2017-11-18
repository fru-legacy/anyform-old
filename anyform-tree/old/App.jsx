import React, { Component } from "react";
import * as Immutable from "immutable";
import { DragDropContext, Backend as DragDropBackend } from "react-dnd";
import HTML5DragDropBackend from "react-dnd-html5-backend";
const TouchDragDropBackend = require("react-dnd-touch-backend").default;

import { TreeView } from "./TreeView";

const styles = require("./index.scss");

const recursivelyUpdateNode = (
  node,
  listUpdateFunc,
  nodeUpdateFunc
) => {
  const children = node.children ? node.children : { items: Immutable.List() };
  const updateChildren = recursivelyUpdateList(children, node, listUpdateFunc, nodeUpdateFunc);
  if (updateChildren !== node.children) {
    node = Object.assign({}, node, {
      children: updateChildren,
    });
  }
  return nodeUpdateFunc(node);
};

const recursivelyUpdateList = (
  list,
  parentNode,
  listUpdateFunc,
  nodeUpdateFunc
) => {
  const mappedItems = list.items.map(item => recursivelyUpdateNode(item, listUpdateFunc, nodeUpdateFunc));
  if (!Immutable.is(mappedItems, list.items)) {
    list = Object.assign({}, list, {
      items: mappedItems,
    });
  }
  return listUpdateFunc(list, parentNode);
};

export class App extends Component {
  constructor() {
    super();
    this.state = {
      rootNodes: {
        items: Immutable.List([
          {
            id: "A",
            title: "A",
            children: {
              items: Immutable.List([
                {
                  id: "A1",
                  title: "A1",
                },
                {
                  id: "A2",
                  title: "A2",
                },
                {
                  id: "A3",
                  title: "A3",
                },
              ]),
            },
          },
          {
            id: "B",
            title: "B",
            children: {
              items: Immutable.List([
                {
                  id: "B1",
                  title: "B1",
                },
                {
                  id: "B2",
                  title: "B2",
                },
              ]),
            },
          },
          {
            id: "C",
            title: "C",
            children: {
              items: Immutable.List([
                {
                  id: "C1",
                  title: "C1",
                  children: {
                    items: Immutable.List([
                      {
                        id: "C1x",
                        title: "C1x",
                      },
                      {
                        id: "C1y",
                        title: "C1y",
                      },
                      {
                        id: "C1z",
                        title: "C1z",
                      },
                      {
                        id: "C1zz",
                        title: "C1zz",
                      },
                      {
                        id: "C1zzz",
                        title: "C1zzz",
                      },
                    ]),
                  },
                },
              ]),
            },
          },
        ]),
      },
    };

    this.handleMoveNode = (args) => {
        this.setState(Object.assign({}, this.state, {
        rootNodes: recursivelyUpdateList(
            this.state.rootNodes,
            null,
            (list, parentNode) =>
            parentNode === args.newParentNode && parentNode === args.oldParentNode
                ? Object.assign({}, list, {
                items:
                list.items
                    .insert(args.newParentChildIndex, args.node)
                    .remove(args.oldParentChildIndex + (args.newParentChildIndex < args.oldParentChildIndex ? 1 : 0))
                })
                : parentNode === args.newParentNode
                ? Object.assign({}, list, {
                    items: list.items.insert(args.newParentChildIndex, args.node)
                })
                : parentNode === args.oldParentNode
                    ? Object.assign({}, list, {
                    items: list.items.remove(args.oldParentChildIndex)
                    })
                    : list,
            item => item
        ),
        }));
    };

    this.setStateWithLog = (newState) => {
        console.log("new state: ", newState);
        this.setState(newState);
    };

    this.handleToggleCollapse = (node) => {
        this.setStateWithLog(Object.assign({}, this.state, {
        rootNodes: recursivelyUpdateList(
            this.state.rootNodes,
            null,
            (list, parentNode) => list,
            item => item === node ? Object.assign({}, item, {
            isCollapsed: !item.isCollapsed,
            }) : item
        ),
        }));
    };

    this.renderNode = (node) => (
        <div className={ 'nodeItem' }>
        { !node.children || node.children.items.isEmpty()
            ? null
            : <a
            style={{ fontSize: "0.5em", verticalAlign: "middle" }}
            onClick={ () => this.handleToggleCollapse(node) }
            >
            {node.isCollapsed ? "⊕" : "⊖"}
            </a>
        }
        Node: { node.title }
        </div>
    );
  }

  render() {
    return (
      <TreeView
        rootNodes={ this.state.rootNodes }
        classNames={ styles }
        renderNode={ this.renderNode }
        onMoveNode={ this.handleMoveNode }
        />
    );
  }
}

export const DraggableApp = DragDropContext(
  HTML5DragDropBackend
  // TouchDragDropBackend({ enableMouseEvents: true })
)(App);


import ReactDOM from "react-dom";

ReactDOM.render(<DraggableApp />, document.getElementById("root"));
