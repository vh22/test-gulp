var $ = require('jquery');
var addClass = require('./plugins/addClass');
$('*').css('color', 'red');
console.log('main file 2');

addClass({
    selector: '[data-add-class]',
    parentToAddSelector: '[data-add-class-parent]',
    removeOnOutsideClick: true
});

