import * as Babel from '@babel/standalone'
import * as Handlebars from 'handlebars/dist/handlebars.js'

let source = `
<div class="entry">
<h1>{{title}}</h1>
<div class="body">
  {{body}}
</div>
</div>
`;
var template = Handlebars.compile(source);
var context = {title: "My New Post", body: "This is my first post!"};
var html    = template(context);

console.log(html);

var input = 'const getMessage = () => "Hello World";';
var output = Babel.transform(input, { presets: ['es2015'] }).code;

console.log(output);