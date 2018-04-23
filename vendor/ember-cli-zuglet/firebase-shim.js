(function() {

  function vendorModule() {
    'use strict';

    var firebase;

    if(typeof FastBoot !== 'undefined') {
      firebase = FastBoot.require('firebase');
      FastBoot.require('firebase/firestore');
      FastBoot.require('firebase/functions');
    } else {
      firebase = self['firebase'];
    }

    return firebase;
  }

  define('firebase', [], vendorModule);
})();
