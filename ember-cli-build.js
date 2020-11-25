'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const crawl = require('prember-crawler');

const isFastbootEnabled = process.env.WITH_FASTBOOT === 'true';

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-remark-static': {
      paths: {
        docs: 'docs'
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
    addons: {
      blacklist: isFastbootEnabled ? [] : [ 'ember-cli-fastboot', 'prember' ]
    }
  });
  return app.toTree();
};
