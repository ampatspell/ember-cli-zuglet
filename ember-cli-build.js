'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const defaultFingerprintExtensions = require('broccoli-asset-rev/lib/default-options').extensions;
const crawl = require('prember-crawler');

const isFastbootEnabled = process.env.WITH_FASTBOOT === 'true';

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    remark: {
      collections: {
        'docs': 'docs'
      }
    },
    fingerprint: {
      extensions: [ ...defaultFingerprintExtensions, 'md', 'json' ],
      generateAssetMap: true
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
