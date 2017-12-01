export {Example} from './Example';
export {Natural} from './Natural';
require('./default.scss');




require('anyform-core');


import {DomHandler, Parser, parseDOM} from 'htmlparser2';
import serialize from 'dom-serializer';

let rawHtml = "Xyz <script language= javascript>var foo = '<<bar>>';</  script><!--<!-- Waah! -- -->";

let handler = new DomHandler(function (error, dom) {
    if (error) console.log(error);
    console.log(dom);
    console.log(serialize(dom))
});

var parser = new Parser(handler);
parser.write(rawHtml);
parser.end();



/*'./node_modules/es5-shim/es5-shim.js',
'./node_modules/sifter/sifter.js',
'./node_modules/selectize/dist/js/standalone/selectize.js',
'./node_modules/microplugin/src/microplugin.js',
'./node_modules/jquery-validation/dist/jquery.validate.js',
'./node_modules/desandro-matches-selector/matches-selector.js',
'./node_modules/spin.js/spin.js',
'./node_modules/jquery.inputmask/dist/jquery.inputmask.bundle.js',
'./node_modules/imagesloaded/imagesloaded.pkgd.js',
'./node_modules/webui-popover/dist/jquery.webui-popover.js',
'./node_modules/jquery-form/jquery.form.js',
'./node_modules/autosize/dist/autosize.js',
'./node_modules/jquery-placeholder/jquery.placeholder.js',
'./node_modules/moment/moment.js',
'./node_modules/moment/locale/de.js',
'./node_modules/pikaday/pikaday.js'


<link rel="stylesheet" href="../node_modules/selectize/dist/css/selectize.css">
<link rel="stylesheet" href="../node_modules/selectize/dist/css/selectize.bootstrap3.css">
<link rel="stylesheet" href="../node_modules/pikaday/css/pikaday.css">
<link rel="stylesheet" href="../node_modules/webui-popover/dist/jquery.webui-popover.css">
<link rel="stylesheet" href="../app/styles/image-picker.css">*/
