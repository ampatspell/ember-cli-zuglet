'use strict';

let create = require('broccoli-file-creator');
let mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
let pkg = require('./package.json');
let path = require('path');
let Webpack = require('broccoli-webpack');

let isFirebaseEnabled = true;
let isLuxonEnabled = true;

module.exports = {
  name: 'ember-cli-zuglet',
  isDevelopingAddon() {
    return false;
  },
  included() {
    this._super.apply(this, arguments);

    if(isFirebaseEnabled) {
      this.app.import('vendor/ember-cli-zuglet/firebase.amd.js');
      this.app.import('vendor/ember-cli-zuglet/firebase.amd.js.map');
    }

    if(isLuxonEnabled) {
      this.app.import('vendor/ember-cli-zuglet/luxon.js', { using: [ { transformation: 'amd', as: 'luxon' } ] });
      this.app.import('vendor/ember-cli-zuglet/luxon.js.map');
    }

    this.app.import('vendor/ember-cli-zuglet/versions.js');
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
      trees.push(new Webpack([
        path.join(__dirname, 'lib/firebase')
      ], {
        entry: './index.js',
        devtool: 'source-map',
        output: {
          library: 'firebase',
          libraryTarget: 'amd',
          filename: 'ember-cli-zuglet/firebase.amd.js'
        }
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
