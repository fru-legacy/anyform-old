import React, { Component } from 'react';
import {createElement, compile} from 'elliptical';

import {ReactSelectize, SimpleSelect, MultiSelect} from 'react-selectize';

const countryData = [
  {text: "China (People's Republic of)", value: 'CN'},
  {text: 'Ireland', value: 'IE'},
  {text: 'Macedonia (the former Yugoslav Republic of)', value: 'MK'},
  {text: 'United Kingdom of Great Britain and Northern Ireland', value: 'IE'},
  {text: 'United States', value: 'US'}
]

// Define a Phrase
const Country = {
  describe () {
    return createElement('placeholder', {argument: 'country'}, [
      createElement('list', {items: countryData, strategy: 'fuzzy'})
    ]);
  }
}

const parse = compile(createElement('sequence', null, [
  createElement('literal', {text: 'flight '}),
  createElement('choice', {id: 'direction'}, [
    createElement('literal', {text: 'from ', value: 'from'}),
    createElement('literal', {text: 'to ', value: 'to'})
  ]),
  createElement(Country, {id: 'country'})
]));


export class Natural extends Component {
  
  constructor(props) {
    super(props);
    this.state = {search: '', options: this.options('')};
  }

	render() {
    return <SimpleSelect 
      placeholder="Select a fruit" 
      onValueChange={value => console.log(value)}
      restoreOnBackspace={(item) => item.label.substr(0, item.label.length - 1)}
      editable={(item) => item.label}
      search = {this.state && this.state.search}
      options = {this.state && this.state.options}
      onSearchChange={this.search.bind(this)}
      renderOption={this.renderOption.bind(this)}
      filterOptions = {(options, search) => options}

    />;
  }

  options(search) {
    let options = parse(search);
    for(let option of options){
      let label = '';
      for(let word of option.words) {
        label += word.text;
        if (word.placeholder) option.selectable = false;
      }
      option.label = label; 
    };
    return options;
  }
  
  search(search) {
    this.setState({search, options: this.options(search)});
  }

  renderOption(item) {
    return <div className="simple-option" style={{fontSize: 12}}>
      <span style={{fontWeight: "bold"}}>{item.label}</span>
      <span>@</span>
    </div>;
  }
  
}
