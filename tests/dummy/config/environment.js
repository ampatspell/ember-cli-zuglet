'use strict';

const getConfig = require('../../../config');

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    APP: {
    },
    dummy: {
      firebase: getConfig('default').firebase,
      name: 'ember-cli-zuglet',
      version: require('../../../package.json').version
    },
    fastboot: {
      hostWhitelist: [ /^localhost:\d+$/ ]
    }
  };

  if(process.env.CI) {
    ENV.dummy.firebase = getConfig('travis').firebase;
  }

  console.log('Project:', ENV.dummy.firebase.projectId);

  if (environment === 'development') {
    //
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    //
  }

  return ENV;
};
