var firebase;
if(typeof FastBoot !== 'undefined') {
  firebase = FastBoot.require('firebase');
  FastBoot.require('firebase/storage');
  FastBoot.require('firebase/firestore');
  FastBoot.require('firebase/functions');
} else {
  firebase = require('firebase/app');
  require('firebase/firestore');
  require('firebase/functions');
  require('firebase/storage');
  require('firebase/auth');
}

module.exports = firebase;
