import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragSource, DropTarget } from 'react-dnd';

import classNames from 'classnames/bind';

import settings from './defaults';
import styles from './example.scss';

// TODO update tree
// TODO customization via options
// TODO cleanup
// TODO release and document

const NodeList = ({ list, parentDragging, options, path, wrapper, isFullWidth, isMultiNode }) => {

	let context = { list, parentDragging, options, path, isFullWidth, isMultiNode };
	let first   = <Target {...context} index={0} path={path.add(0)} />;
	let content = [];

	for (var i = 0; i < list.length; i++) {
		let key = list[i].id;
		content.push(<Node   {...context} key={'nd' + key} index={i} path={path.add(i)} />);
		content.push(<Target {...context} key={'tg' + key} index={i+1} path={path.add(i+1)} />);
	}

	return <div className={wrapper}>{first}{content}</div>;
}

const getSourceItem = ({ path, list, index }) => ({item: list[index], path})

function drop(props, monitor) {
	var item = monitor.getItem();
	var recalc = props.path.recalculateAfterDetach(item.path);
	props.options.onDrop(item.path.segments, recalc.segments, item.item);
}

@DragSource('anyform-tree', {beginDrag: getSourceItem}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
class Node extends Component {
	render() {
		let { list, parentDragging, isDragging, options, index, path } = this.props;
		let { isFullWidth, isMultiNode } = this.props;

		let single = list[index];
		let startMultiNode = !isMultiNode && single.multi && single.multi.length;
		let node = !startMultiNode && options.node(options, single, isFullWidth);

		if (isMultiNode) return this.props.connectDragSource(node);

		let contains = options.containsNormalized(single);

		return <div>
			<div className={options.cx('node-anchor')}>
				{ !startMultiNode && this.props.connectDragSource(node)}
				{ startMultiNode  && <NodeList
					path={path.add('multi')} options={options}
					isMultiNode={true} isFullWidth={single.multi.length === 1}
					parentDragging={parentDragging}
					list={single.multi} wrapper={options.cx('node-multi-container')} />}
			</div>
			<div className={options.cx('list-container')}>
				{contains.map((group) => <div key={group.id}>
					{group.id && <div className={options.cx('group-container')}>
						{options.containsGroupTitle(group.id)}
					</div>}
					<NodeList
						path={path.add(group.path)} options={options} isFullWidth={true}
						parentDragging={isDragging || parentDragging}
						list={group.value || []}
						wrapper={options.cx('list-container-inner')} />
				</div>)}
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
		let node = (options, node, isFullWidth) => {
			let active = node.active;
			return <div className={options.cx('node', {active})}>
				<span className={options.cx('handler')}>::</span>
				{node.title}
			</div>;
		};

		let containsField = 'contains';
		let containsGroupPrefix = 'contains-';
		let containsGroupTitle = (id) => {
			return "Group 1"
		};
		let containsNormalized = (node) => {
			let results = [
				{id: '', value: node.contains, path: 'contains'}
			];

			for(var key in node) {
				const prefix = containsGroupPrefix;
				if (key.indexOf(prefix) === 0) {
					results.push({
						id: key.substring(prefix.length),
						path: key,
						value: node[key]
					});
				}
			}
        	return results;
    	};

		const options = { ...settings, cx: classNames.bind(styles), node, containsNormalized, containsGroupTitle };
		options.onDrop = onDrop.bind(this, options);

		return <NodeList list={this.props.nodes} options={options} path={new Path()}
	  	wrapper={options.cx('anyform-tree')} />
	}
}
