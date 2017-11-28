import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import classNames from 'classnames/bind';

import {ReactSelectize, SimpleSelect, MultiSelect} from 'react-selectize';

export class Example extends Component {
	render() {
    return <SimpleSelect placeholder="Select a fruit" onValueChange={value => console.log(value)}>
      <option value = "apple">apple</option>
      <option value = "mango">mango</option>
      <option value = "orange">orange</option>
      <option value = "banana">banana</option>
    </SimpleSelect>;

    /*<MultiSelect
        placeholder = "Select fruits"
        options = {["apple", "mango", "orange", "banana"].map(
          fruit => ({label: fruit, value: fruit})
        )}
        onValuesChange = {value => alert(value)}
    />*/
	}
}
