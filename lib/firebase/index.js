/* global FastBoot */

if(typeof FastBoot !== 'undefined') {
  global.XMLHttpRequest = FastBoot.require("xmlhttprequest").XMLHttpRequest;
  // Temporary fix for https://github.com/firebase/firebase-js-sdk/issues/1138
  global.document = undefined;
}

var firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/functions');
require('firebase/storage');
require('firebase/auth');

module.exports = firebase;
