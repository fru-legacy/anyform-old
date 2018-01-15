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

class NodeList extends Component {
	render() {
		return <div className={this.props.wrapper}>
			{this.props.list  && this.props.list.map(x => <Node data={x} key={x.id} />)}
			{!this.props.list && <Node data={null} />}
		</div>;
	}
}

const getSourceItem = (props) => ({item: props.current, path: props.path})

function drop(props, monitor) {
	console.log(monitor.getItem());
	console.log('moved to');
	console.log({parent: props.parent, path: props.path, top: props.top});
}

@DragSource('anyform-tree', {beginDrag: getSourceItem}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	dragging: monitor.getItem()
}))
class Node extends Component {
	render() {
		const cx = classNames.bind(styles);
		let { dragging } = this.props;

		if (!this.props.data) return <Target visible={dragging} top={true} />;

		let node = <div className={cx('node')}>{this.props.data.title}</div>;

		return <div className={cx('node-container')}>

			<div className={cx('node-container-inner')}>
				<Target visible={dragging} top={true} />
				<Target visible={dragging} top={false} />
				{this.props.connectDragSource(node)}
			</div>

			<div className={cx('list-container')}>
				<NodeList wrapper={cx('list-container-inner')} list={this.props.data.contains} />
			</div>
		</div>;
	}
}

@DropTarget('anyform-tree', {drop}, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver()
}))
class Target extends Component {
	render() {
		const cx = classNames.bind(styles);
		let { top, isOver, visible } = this.props;

		let target = <div className={cx('target', {top, bottom: !top, visible})}>
			{visible && isOver && <div className={cx('preview')}></div>}
		</div>;

		return this.props.connectDropTarget(target);
	}
}

@DragDropContext(HTML5Backend)
export class Tree extends Component {
	render() {
		const cx = classNames.bind(styles);
		const options = settings;
		var list = testdata || this.props.nodes;

		return <NodeList wrapper={cx('anyform-tree')} list={list} />
	}
}
