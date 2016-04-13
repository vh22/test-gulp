'use strict';

var del = require('del');
var fs = require('fs');

module.exports = function(options) {

    return function() {
        return del(options.dest);
    };

};