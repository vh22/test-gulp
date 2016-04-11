const $ = require('jquery');
const addClass = require('./plugins/addClass');
$('*').css('color', 'tomato');
console.log('main file1211');

addClass({
    selector: '[data-add-class]',
    parentToAddSelector: '[data-add-class-parent]',
    removeOnOutsideClick: true
});

