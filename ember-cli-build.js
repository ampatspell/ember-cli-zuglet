'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-remark-static': {
      paths: {
        'docs': 'docs'
      }
    },
    prember: {
      urls: [
        '/',
        '/docs'
      ]
    }
    // addons: {
    //   blacklist: [ 'ember-cli-fastboot' ]
    // }
  });

  return app.toTree();
};
