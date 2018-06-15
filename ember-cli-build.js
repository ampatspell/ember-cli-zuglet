'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const crawl = require('prember-crawler');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-remark-static': {
      paths: {
        'docs': 'docs'
      }
    },
    prember: {
      urls: async function({ visit }) {
        return await crawl({
          visit,
          startingFrom: [ '/' ]
        });
      }
    }
    // addons: {
    //   blacklist: [ 'ember-cli-fastboot' ]
    // }
  });

  return app.toTree();
};
