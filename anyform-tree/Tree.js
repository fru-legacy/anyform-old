import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragSource, DropTarget } from 'react-dnd';

import classNames from 'classnames/bind';
import { testdata } from './testdata';

import settings from './defaults';
import styles from './defaults.scss';

// TODO styling defaults && theme
// TODO path correct
// TODO update tree
// TODO customization via options
// TODO cleanup
// TODO release and document

const NodeList = ({ list, parentDragging, options, path, wrapper, isFullWidth, isMultiNode }) => {

	let context = { list, parentDragging, options, path, isFullWidth, isMultiNode };
	let first   = <Target {...context} index={0} />;
	let content = [];

	for (var i = 0; i < list.length; i++) {
		let key = list[i].id;
		content.push(<Node   {...context} key={'nd' + key} index={i} />);
		content.push(<Target {...context} key={'tg' + key} index={i+1} />);
	}

	return <div className={wrapper}>{first}{content}</div>;
}

const getSourceItem = ({ path, list, index }) => ({item: list[index], path})

function drop(props, monitor) {
	console.log(monitor.getItem());
	console.log('moved to');
	console.log({parent: props.parent, path: props.path, top: props.top});
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
					path={path.add(index)} options={options}
					isMultiNode={true} isFullWidth={single.multi.length === 1}
					parentDragging={parentDragging}
					list={single.multi} wrapper={options.cx('node-multi-container')} />}
			</div>
			<div className={options.cx('list-container')}>
				{contains.map((group) => <div key={group.id}>
					{group.id}
					<NodeList
						path={path.add(index)} options={options} isFullWidth={true}
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
}

@DragDropContext(HTML5Backend)
export class Tree extends Component {
	render() {
		let node = (options, node, isFullWidth) => {
			return <div className={options.cx('node')}>{node.title}</div>;
		};
		let containsNormalized = (node) => {
				let result = [{id: '', value: node.contains}];
				const prefix = 'contains-';
				for(var key in node) {
					if (key.indexOf(prefix) === 0) {
						result.push({
							id: key.substring(prefix.length),
							value: node[key]
						});
					}
				}
        return result;
    };
		const options = { ...settings, cx: classNames.bind(styles), node, containsNormalized };

		let list = testdata || this.props.nodes;

		return <NodeList list={list} options={options} path={new Path()}
	  	wrapper={options.cx('anyform-tree')} />
	}
}
