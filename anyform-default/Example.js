import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import classNames from 'classnames/bind';

import {ReactSelectize, SimpleSelect, MultiSelect} from 'react-selectize';
import ReactSpinner from 'react16-spinjs';
import DatePicker from 'react-datepicker';
import Textarea from "react-textarea-autosize";
import MasonryInfiniteScroller from 'react-masonry-infinite';
import Stepper from 'react-stepper-primitive';


let X = (props) => {
  var x = [
    <span>Test</span>,
    <span>Test</span>
  ];

  return <React.Fragment>
    {x}
  </React.Fragment>;
}

var chartData = [];

export class Example extends Component {
  constructor(props) {
    super(props);
    this.state = { elements: [1,2,3, 1,2,3, 1,2,3, 1,2,3], hasMore: true };
  }

	render() {
    return <div>

<Stepper
    min={1}
    max={100}
    render={({
      getWrapperProps,
      getInputProps,
      getIncrementProps,
      getDecrementProps
    }) =>
      <div {...getWrapperProps}>
        <button className='my-button' {...getDecrementProps()}>
          <img src='/assets/svg/minus.svg' />
        </button>
        <input className='my-step-input' {...getInputProps()} />
        <button className='my-button' {...getIncrementProps()}>
          <img src='/assets/svg/plus.svg' />
        </button>
      </div>}
  />

<MasonryInfiniteScroller hasMore={this.state.hasMore} loadMore={() => {}}>
    {
        this.state.elements.map((el, index) =>
            <div key={index} style={{width: '120px'}}>{el}</div>
        )
    }
</MasonryInfiniteScroller>

       <Textarea />
      <ReactSpinner color="black" />
      <DatePicker selected={null} onChange={this.handleChange} />
      <SimpleSelect placeholder="Select a fruit" onValueChange={value => console.log(value)}>
        <option value = "apple">apple</option>
        <option value = "mango">mango</option>
        <option value = "orange">orange</option>
        <option value = "banana">banana</option>
      </SimpleSelect>
      <MultiSelect
        placeholder = "Select fruits"
        options = {["apple", "mango", "orange", "banana"].map(
          fruit => ({label: fruit, value: fruit})
        )}
        onValuesChange = {value => console.log(value)}
      />
    
    </div>;

    
	}
}
