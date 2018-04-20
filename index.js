'use strict';

let create = require('broccoli-file-creator');
let mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
let pkg = require('./package.json');
let path = require('path');

let isFirebaseEnabled = true;
let isLuxonEnabled = true;

module.exports = {
  name: 'ember-cli-zuglet',
  isDevelopingAddon() {
    return false;
  },
  included(app) {
    this._super.apply(this, arguments);

    if(isFirebaseEnabled) {
      app.import('vendor/ember-cli-zuglet/firebase.js');
      app.import('vendor/ember-cli-zuglet/firebase.js.map');
      app.import('vendor/ember-cli-zuglet/firebase-firestore.js');
      app.import('vendor/ember-cli-zuglet/firebase-firestore.js.map');
      app.import('vendor/ember-cli-zuglet/firebase-functions.js');
      app.import('vendor/ember-cli-zuglet/firebase-functions.js.map');
      app.import('vendor/ember-cli-zuglet/firebase-shim.js');
    }

    if(isLuxonEnabled) {
      app.import('vendor/ember-cli-zuglet/luxon.js', {
        using: [
          { transformation: 'amd', as: 'luxon' }
        ]
      });
    }

    app.import('vendor/ember-cli-zuglet/versions.js');
  },
  treeForVendor(vendorTree) {
    let trees = [];

    if(vendorTree) {
      trees.push(vendorTree);
    }

    let versions = [
      `Ember.libraries.register('${pkg.name}', '${pkg.version}');`,
    ];

    if(isFirebaseEnabled) {
      trees.push(new Funnel(path.dirname(require.resolve('firebase/firebase')), {
        files: [
          'firebase.js',
          'firebase.js.map',
          'firebase-firestore.js',
          'firebase-firestore.js.map',
          'firebase-functions.js',
          'firebase-functions.js.map'
        ],
        destDir: '/ember-cli-zuglet'
      }));

      let firebase = require('firebase');
      versions.push(`Ember.libraries.register('Firebase SDK', '${firebase.SDK_VERSION}');`)
    }

    if(isLuxonEnabled) {
      let luxon = path.resolve(path.dirname(require.resolve('luxon')), '..', '..');
      trees.push(new Funnel(path.join(luxon, 'build', 'amd'), {
        files: [
          'luxon.js',
          'luxon.js.map'
        ],
        destDir: '/ember-cli-zuglet'
      }));

      let pkg = require(path.join(luxon, 'package.json'));
      versions.push(`Ember.libraries.register('Luxon', '${pkg.version}');`)
    }

    trees.push(create('ember-cli-zuglet/versions.js', versions.join('\n')));

    return mergeTrees(trees);
  }
};
