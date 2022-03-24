/* global FastBoot */

if(typeof FastBoot !== 'undefined') {
  self.XMLHttpRequest = FastBoot.require('xmlhttprequest').XMLHttpRequest;
  self.fetch = FastBoot.require('node-fetch');
  if(typeof self.atob === 'undefined') {
    self.atob = string =>  FastBoot.require('buffer').Buffer.from(string, 'base64').toString('binary');
  }

  function createFirebaseModule(name) {
    return function() {
      'use strict';
      let mod = FastBoot.require(name);
      return { default: mod, __esModule: true };
    }
  }

  [
    'firebase/compat/app',
    'firebase/compat/firestore',
    'firebase/compat/auth',
    'firebase/compat/storage',
    'firebase/compat/functions'
  ].forEach(name => {
    define(name, [], createFirebaseModule(name));
  });
}
