import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

function drop(props, monitor) {

}

@DropTarget('anyform-tree', {drop}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver()
}))
class Target extends Component {

	render() {
		let { options, top, cx } = this.props;

		let target = <div className={cx('node-target', {top})}>
			<div className={cx('node-preview')}></div>
		</div>; 

		return this.props.connectDropTarget(target);
	}
}

export const NodeTarget = (props) => {
	let {previous, isLast, dragging, isDragging, isDraggingParent} = props;

	// Build drop parameter
	// Use real targets

	if (!dragging || isDragging || isDraggingParent) return <div></div>;

	var top = <Target top={true} {...props} />;
	var bottom = <Target {...props} />
	
	return <div>{dragging !== previous && top}{isLast && bottom}</div>
};