/* global FastBoot */

if(typeof FastBoot !== 'undefined') {
  global.XMLHttpRequest = FastBoot.require("xmlhttprequest").XMLHttpRequest;
  if(typeof atob === 'undefined') {
    global.atob = string =>  Buffer.from(string, 'base64').toString('binary');
  }
}

var firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/functions');
require('firebase/storage');
require('firebase/auth');

module.exports = firebase;
