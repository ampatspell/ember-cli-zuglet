'use strict';

let create = require('broccoli-file-creator');
let mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
let firebase = require('firebase');
let pkg = require('./package.json');
let path = require('path');

module.exports = {
  name: 'ember-cli-zuglet',
  isDevelopingAddon() {
    return false;
  },
  included(app) {
    this._super.apply(this, arguments);
    app.import('vendor/ember-cli-zuglet/firebase.js');
    app.import('vendor/ember-cli-zuglet/firebase.js.map');
    app.import('vendor/ember-cli-zuglet/firebase-firestore.js');
    app.import('vendor/ember-cli-zuglet/firebase-firestore.js.map');
    app.import('vendor/ember-cli-zuglet/firebase-shim.js');
    app.import('vendor/ember-cli-zuglet/versions.js');
  },
  treeForVendor(vendorTree) {
    let trees = [];

    if(vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(create('ember-cli-zuglet/versions.js', [
      `Ember.libraries.register('${pkg.name}', '${pkg.version}');`,
      `Ember.libraries.register('Firebase SDK', '${firebase.SDK_VERSION}');`
    ].join('\n')));

    trees.push(new Funnel(path.dirname(require.resolve('firebase/firebase')), {
      files: [
        'firebase.js',
        'firebase.js.map',
        'firebase-firestore.js',
        'firebase-firestore.js.map'
      ],
      destDir: '/ember-cli-zuglet'
    }));

    return mergeTrees(trees);
  }
};
