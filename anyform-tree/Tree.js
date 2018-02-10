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

const NodeList = ({ wrapper, path, ...context }) => {

	let content = [<Target {...context} index={0} path={path.add(0)} key={0} />];

	for (var i = 0; i < context.list.length; i++) {
		let key = context.list[i].id;
		content.push(<Node   {...context} index={i}   path={path.add(i)}   key={'node_' + key} />);
		content.push(<Target {...context} index={i+1} path={path.add(i+1)} key={i+1} />);
	}

	return <div className={wrapper}>{content}</div>;
}

const HorrizontalNodeListMultiRow = ({ row, path, ...context }) => {

	let multiProp = 'multi';
	context.wrapper = context.options.cx('node-multi-container');

	context.path = path.add(multiProp);
	context.list = row[multiProp];

	return <NodeList {...context} isMultiNode={true} />
}

const VerticalNodeListChildGroups = ({groups, path, ...context}) => groups.map((group) => {

	let titleClass = context.options.cx('group-container');
	let title = group.title && <div className={titleClass}>{group.title}</div>

	let list = <NodeList {...context} 
		path={path.add(group.path)} list={group.value}
		wrapper={context.options.cx('list-container-inner')} />

	return <div key={group.id}>{title}{list}</div>
})

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
		let { list, parentDragging, isDragging, options, index, path, isMultiNode } = this.props;
		//let isFullWidth = list.length === 1;

		let single = list[index];
		let startMultiNode = !isMultiNode && single.multi && single.multi.length;
		let node = !startMultiNode && options.node(options, single);

		if (isMultiNode) return this.props.connectDragSource(node);

		let groups = options.containsNormalized(single);

		return <div>
			<div className={options.cx('node-anchor')}>
				{ !startMultiNode && this.props.connectDragSource(node)}
				{ startMultiNode  && <HorrizontalNodeListMultiRow {...this.props} row={single} />}
			</div>
			<div className={options.cx('list-container')}>
				<VerticalNodeListChildGroups {...this.props} groups={groups} parentDragging={isDragging || parentDragging} />
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
		let node = (options, node) => {
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
				{id: '', value: node.contains || [], path: 'contains', title: ''}
			];

			for(var key in node) {
				const prefix = containsGroupPrefix;
				if (key.indexOf(prefix) === 0) {
					results.push({
						id: key.substring(prefix.length),
						path: key,
						value: node[key] || []
					});
				}
			}
        	return results;
    	};

		const options = { ...settings, cx: classNames.bind(styles), node, containsNormalized, containsGroupTitle };
		options.onDrop = onDrop.bind(this, options);
		options.beginDrag = ({ options, path, list, index }) => ({item: list[index], path})

		return <NodeList list={this.props.nodes} options={options} path={new Path()}
	  	wrapper={options.cx('anyform-tree')} />
	}
}
