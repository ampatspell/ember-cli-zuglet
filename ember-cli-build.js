'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const crawl = require('prember-crawler');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    sassOptions: {
      implementation: require('sass')
    },
    'ember-cli-remark-static': {
      paths: {
        'docs': 'docs'
      }
    },
    prember: {
      urls({ visit }) {
        return crawl({
          visit,
          startingFrom: [ '/' ]
        });
      }
    },
    // addons: {
    //   blacklist: [ 'ember-cli-fastboot', 'prember' ]
    // }
  });

  return app.toTree();
};
