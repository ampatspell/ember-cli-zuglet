(function() {

  function vendorModule() {
    'use strict';

    var hash;

    if(typeof FastBoot !== 'undefined') {
      hash = FastBoot.require('object-hash');
    } else {
      hash = self['objectHash'];
    }

    return hash;
  }

  define('object-hash', [], vendorModule);
})();
