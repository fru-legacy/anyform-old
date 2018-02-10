//require('anyform-core/index.js');
//console.log(require('anyform-default/generator.yaml'));
//require('anyform-tree/App');

import ReactDOM from "react-dom";
import React, { Component } from 'react';
import {Tree} from 'anyform-tree';
import {Example, Natural} from 'anyform-default';
import { testdata } from '../anyform-tree/testdata';

export class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = { tree: testdata };
    }
    
	render() {
        return <div className="fg-example">
            <div className="left-context-switch">
                <div className="icon sort-list active"></div>
                <div className="icon add-component"></div>
            </div>
            <div className="middle-form-editor">
                <div className="tools">
                    <button>Zurück</button>
                    <button className="save">Speichern</button>
                </div>
                <Tree nodes={this.state.tree} onChange={(tree) => this.setState({tree}) } />
            </div>
        </div>;
    }
}

ReactDOM.render(<Editor />, document.getElementById("root"));
//ReactDOM.render(<Example />, document.getElementById("root"));
//ReactDOM.render(<Natural />, document.getElementById("root"));
