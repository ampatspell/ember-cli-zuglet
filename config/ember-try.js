'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = async function() {
  return {
    scenarios: [
      {
        name: 'ember-3.24.3',
        npm: {
          devDependencies: {
            'ember-source': '~3.24.3'
          }
        }
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release')
          }
        }
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta')
          }
        }
      },
//       {
//         name: 'ember-canary',
//         npm: {
//           devDependencies: {
//             'ember-source': await getChannelURL('canary')
//           }
//         }
//       }
    ]
  };
};
