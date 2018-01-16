import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragSource, DropTarget } from 'react-dnd';

import classNames from 'classnames/bind';

//import { NodeList } from './NodeList';
import { testdata } from './testdata';

import settings from './defaults';
import styles from './defaults.scss';

/*@DragDropContext(HTML5Backend)
export class Tree extends Component {
	render() {
		const cx = classNames.bind(styles);
		const options = settings;

		return <div className={cx('anyform-tree')}>
			<NodeList list={testdata} isDragging={false} path={null} options={options} cx={cx} zIndex={1} parent={null} />
		</div>
	}
}*/

const NodeList = ({ list, parentDragging, options, path, wrapper }) => {

	let context = { list, parentDragging, options, path };
	let first = <Target {...context} index={0} />;

	let content = (node, i) => <div key={node.id}>
		<Node   {...context} index={i} />
		<Target {...context} index={i+1} />
	</div>

	return <div className={wrapper}>{first}{list && list.map(content)}</div>;
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
		let node = <div className={options.cx('node')}>{list[index].title}</div>;

		// TODO groups:

		return <div>
			<div className={options.cx('node-anchor')}>
				{this.props.connectDragSource(node)}
			</div>
			<div className={options.cx('list-container')}>
				<NodeList
					path={path.add(index)} options={options}
					list={list[index].contains || []}
					parentDragging={isDragging || parentDragging}
					wrapper={options.cx('list-container-inner')} />
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
		const options = { ...settings, cx: classNames.bind(styles) };

		let list = testdata || this.props.nodes;

		return <NodeList list={list} options={options} path={new Path()}
	  	wrapper={options.cx('anyform-tree')} />
	}
}
