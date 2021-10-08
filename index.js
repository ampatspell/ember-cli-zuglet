'use strict';

const MergeTrees = require('broccoli-merge-trees');
const writeFile = require('broccoli-file-creator');

const defaults = {
  proxyClassicSupport: false
};

module.exports = {
  name: 'zuglet',
  isDevelopingAddon() {
    return true;
  },
  included(app, parentAddon) {
    this._super.included.apply(this, arguments);
    this.zuglet = Object.assign({}, defaults, (parentAddon || app).options['zuglet']);
    // app.import('vendor/zuglet/register-version.js');
    app.import('vendor/zuglet/fastboot.js');
  },
  treeForVendor(tree) {
    // let { version } = require('./package.json');
    return MergeTrees([
      tree,
      // writeFile('zuglet/register-version.js', `Ember.libraries.register('ember-cli-zuglet', '${version}');`)
    ]);
  },
  treeForAddon() {
    let tree = this._super.treeForAddon.apply(this, arguments);
    return MergeTrees([
      tree,
      writeFile('-private/flags.js', `define('zuglet/-private/flags', [ 'exports' ], function(_exports) {
        "use strict";

        Object.defineProperty(_exports, "__esModule", {
          value: true
        });

        var _default = Object.freeze(${JSON.stringify(this.zuglet, null, 2)});
        _exports.default = _default;
      });`)
    ]);
  }
};
