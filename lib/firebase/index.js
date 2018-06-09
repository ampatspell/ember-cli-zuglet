var firebase;
if(typeof FastBoot !== 'undefined') {
  firebase = FastBoot.require('firebase');
  FastBoot.require('firebase/storage');
  FastBoot.require('firebase/firestore');
  FastBoot.require('firebase/functions');
} else {
  firebase = require('firebase');
  require('firebase/firestore');
  require('firebase/functions');
}

module.exports = firebase;
