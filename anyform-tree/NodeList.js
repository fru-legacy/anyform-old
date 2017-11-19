import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import { NodeTarget } from './NodeTarget';

const getSourceItem = ({current, path}) => {current, path};

@DragSource('anyform-tree', {beginDrag: getSourceItem}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	dragging: monitor.getItem()
}))
class NodeContainer extends Component {

	renderChildGroup = ({id, value}) => {
		if (!value) return null;
		let { options, isDragging, isDraggingParent, cx } = this.props;

		let label = options.containsLabel(id);
		let path  = options.buildPath(this.props.path, id);
		let props = {path, options, cx};
		
		return <div className={cx('group')}>
			{label && <div className={cx('group-label')}>{label}</div>}
			<NodeList list={value} isDragging={isDragging || isDraggingParent} {...props}/>
		</div>;
	}

	render() {
		let { options, current, index, isDragging, cx } = this.props;

		let node = current && <div className={cx('node')}>{options.node(current, index)}</div>;
		
		return <div className={cx('node-container')}>
			{current && this.props.connectDragSource(node)}
			{current && options.containsNormalized(current).map(this.renderChildGroup)}
			<NodeTarget {...this.props} />
		</div>;
	}
}

export const NodeList = ({list, isDragging, path, options, cx}) => <div className={cx('list')}>{
	(list.length ? list : [null]).map((_, i) => <NodeContainer 
		current  = {list[i]}
		previous = {list[i - 1]}
		key      = {options.id(list[i])}
		index    = {i}
		isLast   = {list.length === i + 1}
		options  = {options}
		path     = {options.buildPath(path, i)}
		cx       = {cx}
		isDraggingParent = {isDragging}
	/>)
}</div>;