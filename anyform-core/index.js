import * as Babel from '@babel/standalone';
var camelize = require('underscore.string.fp/camelize');

var input = 'const getMessage = () => "Hello World";';
var output = Babel.transform(input, { presets: ['es2015'] }).code;

console.log(output);

console.log(camelize('test-test'));


let ops = /;|:|[^:;]+/mgi;
console.log(parse(ops, '{{test}}'))
console.log(parse(ops, '{{test}}; test: {{x}}'))
//console.log(parse(ops, '{{test}} }}'))
//console.log(parse(ops, '{{test{{ }}'))



function parse(ops, text) {
  var parts = extractExpressions(text && text.trim() || '');
  var result = [];
  for (let part of parts) {
    if (part.exp) {
      result.push(part);
    } else {
      var tokens = part.text.match(ops).map((text) => ({text}));
      result = result.concat(tokens);
    }
  }
  return result;
}

function extractExpressions(text) {
  let openingExp = text.split(/{{/);
  var result = [];
  if (openingExp[0]) openingExp.push({text: openingExp[0]})

  for(var i = 1; i < openingExp.length; i++) {
    var two = openingExp[i].split(/}}/);
    if (two.length < 2) throw "Opening '{{' not closed: " + openingExp[i];
    if (two.length > 2) throw "Unexpexted '}}' found: " + openingExp[i];
    result.push({text: two[0], exp: true});
    if (two[1]) result.push({text: two[1]});
  }
  
  return result;
}
