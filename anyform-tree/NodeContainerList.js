import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import { defaults } from './defaults';
import classNames from 'classnames/bind';

const getSourceItem = (props) => props.current;

@DragSource(defaults.TYPE, {beginDrag: getSourceItem}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	dragging: monitor.getItem()
}))
class NodeContainer extends Component {

	renderTargets(cx) {
		let { current, previous, isLast, index, dragging, isDragging, isDraggingParent } = this.props;

		if (!dragging || isDragging || isDraggingParent) return [];

		// Build drop parameter
		// Use real targets

		let content = [];
		if (dragging !== previous) {
			content.push(<div className={cx('node-target-top')}></div>);
			content.push(<div className={cx('node-preview-top')}></div>);
		}
		if (isLast) {
			content.push(<div className={cx('node-target-bottom')}></div>);
			content.push(<div className={cx('node-preview-bottom')}></div>);
		}

		return content;
	}

	renderChildGroup(cx, {id, value}) {
		let isDragging = this.props.isDragging || this.props.isDraggingParent;
		let label = this.props.options.containsLabel(id, current);
		
		return <div className={cx('node-content-group')}>
			{label && <div className={cx('group-label')}>{label}</div>}
			<NodeContainerList list={value} isDragging={isDragging} />
		</div>;
	}

	render() {
		let { options, current, index, isDragging } = this.props;
		const cx = classNames.bind(options.styles);

		let node = <div className={cx('node')}>{options.node(current, index)}</div>;
		
		return <div className={cx('node-container')}>
			{this.props.connectDragSource(node)}
			{options.containsNormalized(current).map((g) => this.renderChildGroup(cx, g))}
			{this.renderTargets(cx)}
		</div>;
	}
}

export const NodeContainerList = ({list, isDragging, path}) => <div>{list.map((_, i) => {
	var props = {
		current:  list[i],  
		previous: list[i-1],
		index:    i,
		isLast:   list.length === i + 1
	};

	return <NodeContainer {...props} isDraggingParent={isDragging} options={this.props.options} />;
})}</div>;