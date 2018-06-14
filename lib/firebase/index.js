/* global FastBoot */

if(typeof FastBoot !== 'undefined') {
  global.XMLHttpRequest = FastBoot.require("xmlhttprequest").XMLHttpRequest;
}

var firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/functions');
require('firebase/storage');
require('firebase/auth');

module.exports = firebase;
