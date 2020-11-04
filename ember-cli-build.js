'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

const isFastbootEnabled = process.env.WITH_FASTBOOT === "true";

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    addons: {
      blacklist: isFastbootEnabled ? [] : [ 'ember-cli-fastboot' ]
    }
  });
  return app.toTree();
};
