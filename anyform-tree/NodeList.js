import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import { NodeTarget } from './NodeTarget';

const getSourceItem = (props) => ({item: props.current, path: props.path})

@DragSource('anyform-tree', {beginDrag: getSourceItem}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	dragging: monitor.getItem()
}))
class NodeContainer extends Component {

	renderChildGroup = ({id, value}) => {
		let { current, options, isDragging, isDraggingParent, cx, zIndex, key } = this.props;

		let label = options.containsLabel(id);
		let path  = options.buildPath(this.props.path, id);
		let props = {path, options, cx, parent: current};

		return <div className={cx('group')} key={id + key}>
			<div className={cx('group-inner')}>
				{label && <div className={cx('group-label')}>{label}</div>}
				<NodeList list={value} {...props}
					isDragging={isDragging || isDraggingParent}/>
			</div>
		</div>;
	}

	render() {
		let { options, current, index, isDragging, cx, zIndex, parent } = this.props;

		let node = current && <div className={cx('node')}>{options.node(current, index)}</div>;

		return <div className={cx('node-container')} style={{zIndex}}>
			{current && this.props.connectDragSource(node)}
			{current && <div className={cx('contains')} style={{zIndex: 2}}>
				{options.containsNormalized(current).map(this.renderChildGroup)}
			</div>}
			<NodeTarget {...this.props} />
		</div>;
	}
}

export const NodeList = ({list, isDragging, path, options, cx, zIndex, parent}) => {
	var original = list || [];
	if (!list || !list.length) list = [null];

	return <div className={cx('list')}>{
		list.map((_, i) => <NodeContainer
			current  = {list[i]}
			previous = {list[i - 1]}
			key      = {options.id(list[i])}
			index    = {i}
			isLast   = {list.length === i + 1 && original.length > 0}
			options  = {options}
			path     = {options.buildPath(path, i)}
			cx       = {cx}
			zIndex   = {list.length - i}
			parent   = {parent}
			isDraggingParent = {isDragging}
		/>)
	}</div>;
};
