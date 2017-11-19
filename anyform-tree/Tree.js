import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import classNames from 'classnames/bind';

import { NodeList } from './NodeList';
import { testdata } from './testdata';

import settings from './defaults';
import styles from './defaults.scss';

@DragDropContext(HTML5Backend)
export class Tree extends Component {
	render() {
		const cx = classNames.bind(styles);
		const options = settings;

		return <div className={cx('anyform-tree')}>
			<NodeList list={testdata} isDragging={false} path={null} options={options} cx={cx} zIndex={1} parent={null} />
		</div>
	}
}