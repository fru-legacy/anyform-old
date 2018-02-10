import React, { Component } from 'react';
import { DragDropContext, DropTargetMonitor } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragSource, DropTarget } from 'react-dnd';

import classNames from 'classnames/bind';

import settings from './defaults';
import styles from './example.scss';
import { startsMultiRow, NodeListMultiRow, NodeListChildGroups, NodeListRoot } from './NodeList';

// TODO update tree
// TODO customization via options
// TODO cleanup
// TODO release and document

function drop(props, monitor) {
	var item = monitor.getItem();
	var recalc = props.path.recalculateAfterDetach(item.path);
	props.options.onDrop(item.path.segments, recalc.segments, item.item);
}

@DragSource('anyform-tree', {beginDrag: (p) => p.options.beginDrag(p)}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
class Node extends Component {
	render() {
		let context = { list } = this.props;

		let { list, parentDragging, isDragging, options, index, path, isMultiNode } = this.props;
		//let isFullWidth = list.length === 1;

		let current = list[index];
		
		if (isMultiNode) {
			return this.props.connectDragSource(options.node(current));
		}

		let groups = options.containsNormalized(current);
		let row = startsMultiRow(current, options) 
			? <NodeListMultiRow {...context} row={current} />
			: this.props.connectDragSource(options.node(current));

		return <div>
			<div className={options.cx('node-anchor')}>{row}</div>
			<div className={options.cx('list-container')}>
				<NodeListChildGroups {...context} groups={groups} parentDragging={isDragging || parentDragging} />
			</div>
		</div>;
	}
}


@DropTarget('anyform-tree', {drop}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	dragging: monitor.getItem()
}))
class Target extends Component {
	render() {
		let { parentDragging, options, isOver, dragging, list, index } = this.props;

		let item = dragging && dragging.item;
		if (parentDragging || item === list[index-1] || item === list[index]) {
			dragging = false;
		}

		let target = <div className={options.cx('target', {dragging})}>
			{dragging && isOver && <div className={options.cx('preview')}></div>}
		</div>;

		return <div className={options.cx('target-anchor')}>
			{this.props.connectDropTarget(target)}
		</div>;
	}
}

export class Path {
	constructor(segments) {
		this.segments = segments || [];
	}
	add(segment) {
		return new Path(this.segments.concat([segment]));
	}
	recalculateAfterDetach(detached, options) {
		var path = this.segments.slice();
		var last = detached.segments.length - 1;

		for(var i = 0; i < last; i++) {
			if (path[i] !== detached.segments[i]) return this;
		}
		if (path[last] < detached.segments[last]) return this;
		path[last]--; 
		return new Path(path);
	}
}

function getPath(context, path) {
	for(var i = 0; i < path.length; i++) {
		context = context[path[i]];
	}
	return context;
}

function clone(context) {
	return JSON.parse(JSON.stringify(context));
}

export function onDrop(options, from, to, node) {
	var tree = clone(this.props.nodes);

	var fromIndex = from.pop();
	var fromParent = getPath(tree, from);

	fromParent.splice(fromIndex, 1);

	var toIndex = to.pop();
	var toName = to.pop();
	var toParent = getPath(tree, to);
	
	if (typeof toName !== 'undefined') {
		toParent[toName] = toParent[toName] || [];
		toParent = toParent[toName];	
	}
	toParent.splice(toIndex, 0, node);

	this.props.onChange(tree);
}

@DragDropContext(HTML5Backend)
export class Tree extends Component {
	render() {
		let node = function (node) {
			let active = node.active;
			return <div className={this.cx('node', {active})}>
				<span className={this.cx('handler')}>::</span>
				{node.title}
			</div>;
		};

		let containsField = 'contains';
		let containsGroupPrefix = 'contains-';
		let containsGroupTitle = (id) => {
			if (id) return "Group 1"
		};
		let containsId = (key) => {
			let prefix = containsField + '-'
			if (key === containsField) return '';
			if (key.indexOf(prefix) === 0) {
				return key.substring(prefix.length);
			}
			return false;
		}


		let containsNormalized = (node) => {
			let results = [];
			for(var key in node) {
				let id = containsId(key);
				if (id !== false) {
					results.push({
						id, path: key, value: node[key] || [], title: containsGroupTitle(id)
					})
				}
			}
        	return results;
    	};

		const options = { ...settings, cx: classNames.bind(styles), node, containsNormalized, containsGroupTitle };
		options.multiProp = 'multi';
		options.onDrop = onDrop.bind(this, options);
		options.beginDrag = ({ options, path, list, index }) => ({item: list[index], path})
		options.Target = Target;
		options.Node = Node;
		options.rootPath = new Path();

		return <NodeListRoot list={this.props.nodes} options={options} />
	}
}
