const $ = require('jquery');
const addClass = require('./plugins/addClass');
$('*').css('color', 'green');
console.log('main file1');

addClass({
    selector: '[data-add-class]',
    parentToAddSelector: '[data-add-class-parent]',
    removeOnOutsideClick: true
});