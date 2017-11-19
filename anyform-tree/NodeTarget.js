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
		let { options, top, cx, isOver, visible } = this.props;
		let target = <div className={cx('target', {top, visible})}>
			{visible && isOver && <div className={cx('preview')}></div>}
		</div>; 

		return this.props.connectDropTarget(target);
	}
}

export const NodeTarget = (props) => {
	let {previous, isLast, dragging, isDragging, isDraggingParent} = props;

	// Build drop parameter
	// Use real targets
	let visible = dragging && !isDragging && !isDraggingParent;

	var top = <Target top={true} {...props} visible={visible && dragging !== previous} />;
	var bottom = <Target {...props} visible={visible && isLast} />
	
	return <div style={{zIndex: 1}}>{top}{bottom}</div>
};