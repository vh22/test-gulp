;(function ($, window, document, undefined) {
  'use strict';

  // initialization jquery placeholder
  if (typeof $ === 'function' && typeof $.fn.placeholder === 'function') {
    $('input, textarea').placeholder();
  }

  // initialization jquery addClass function
  if (typeof $ === 'function' && typeof window.utilities === 'object' && typeof window.utilities.addClass === 'function') {
    window.utilities.addClass({
      selector: '[data-add-class]',
      parentToAddSelector: '[data-add-class-parent]',
      removeOnOutsideClick: true
    });
  }
}(jQuery, window, window.document));
