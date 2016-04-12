/*jslint browser: true*/
'use strict';
module.exports = (function(window) {
    var $ = require('jquery'),
        html = $('html'),
        navigator = window.navigator,
        isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window);
    // Add Class utility function
    return function addClass(config) {
        if (config.selector) {
            var collection = $(config.selector),
                eventByDefault = isTouchDevice ? 'touchstart' : 'click',
                eventToBind = config.eventName || eventByDefault,
                classNameToAdd = config.classNameToAdd || 'active';

            collection.on(eventToBind, function (e) {
                if (eventToBind === 'click' || eventToBind === 'touchstart') {
                    e.preventDefault();
                }

                if (config.removeOnOutsideClick) {
                    e.stopPropagation();
                }
                var currentElement = config.parentToAddSelector ? $(this).closest(config.parentToAddSelector) : $(this);

                if (currentElement.hasClass(classNameToAdd)) {
                    currentElement.removeClass(classNameToAdd);
                } else {
                    currentElement.addClass(classNameToAdd);
                }
            });

            if (config.removeOnOutsideClick) {
                html.on(eventToBind, function (event) {
                    if (collection.closest(config.parentToAddSelector)[0] !== event.target && !collection.closest(config.parentToAddSelector).has(event.target).length) {
                        collection.closest(config.parentToAddSelector).removeClass(classNameToAdd);
                    }
                });
            }
        } else {
            console.log('You need to specify a selector for add class utility method');
        }
    };
}(window));