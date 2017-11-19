import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import SourceBox from './SourceBox'
import TargetBox from './TargetBox'
import Colors from './Colors'
import {testdata} from './testdata';






import { DragSource } from 'react-dnd'

const NodeContainerList = ({list, isDragging}) => <div>{list.map((_, i) => {
	var props = {
		current:  list[i],  
		previous: list[i-1],
		isLast:   list.length === i + 1 
	};

	return <NodeContainer {...props} isDraggingParent={isDragging} />;
})}</div>;


@DragSource(TYPE, {beginDrag}, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
class NodeContainer extends Component {

	node (node) {
		return node.title;
	}
		
	preview (node, preview) {
		let { top, bottom, _nnode } = preview;
	}

	render() {
		return <div>
			<div>{this.props.current.title}</div>
			<div>top</div>
			<div>bottom</div>
		</div>;
	}
}





@DragDropContext(HTML5Backend)
export class Container extends Component {
	render() {
		return <NodeContainerList list={testdata} isDragging={false} />
	}

	contains(node) {

	}

	containsLabel(node, id) {

	}

	node (node) {

	}

	preview (node, preview) {
		let { top, bottom, _node } = preview;


	}

	buildPath(parent, index) {
		
	}

	buildPathContains(parent, id) {

	}

	// oldPositions := [{node, path, childIndex, count}]
	move (nodes, oldPositions, newPosition) {

	}
}

/*
@DragDropContext(HTML5Backend)
export class Container extends Component {
	render() {
		return (
			<div style={{ overflow: 'hidden', clear: 'both', margin: '-.5rem' }}>
				<div style={{ float: 'left' }}>
					<SourceBox color={Colors.BLUE}>
						<SourceBox color={Colors.YELLOW}>
							<SourceBox color={Colors.YELLOW} />
							<SourceBox color={Colors.BLUE} />
						</SourceBox>
						<SourceBox color={Colors.BLUE}>
							<SourceBox color={Colors.YELLOW} />
						</SourceBox>
					</SourceBox>
				</div>

				<div style={{ float: 'left', marginLeft: '5rem', marginTop: '.5rem' }}>
					<TargetBox />
				</div>
			</div>
		)
	}
}
*/