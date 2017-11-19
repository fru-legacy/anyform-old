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

	render() {
		let { options, current, previous, isLast, index, dragging, isDragging } = this.props;

		const cx = classNames.bind(options.styles);
		const node = options.node(current, index);

		const content = [
			this.props.connectDragSource(<div className={cx('node')}>{node}</div>),
			<div className={cx('node-preview-top')}></div>,
			<div className={cx('node-preview-bottom')}></div>
		];

		if (isDragging && dragging !== current) {
			if (dragging !== previous) content.push(<div className={cx('node-target-top')}></div>);
			if (isLast) content.push(<div className={cx('node-target-bottom')}></div>);
		}

		content.concat(options.containsNormalized(current).map(({id, value}) => {

			return <div className={cx('node-content-group')}>
				<div className={cx('group-label')}>
					{options.containsLabel(id, current)}
				</div>
				<NodeContainerList list={value} isDragging={isDragging} />
			</div>;
		}));

		return <div className={cx('node-container')}>{content}</div>;
	}
}

export const NodeContainerList = ({list, isDragging}) => <div>{list.map((_, i) => {
	var props = {
		current:  list[i],  
		previous: list[i-1],
		index:    i,
		isLast:   list.length === i + 1
	};

	return <NodeContainer {...props} isDraggingParent={isDragging} options={this.props.options} />;
})}</div>;