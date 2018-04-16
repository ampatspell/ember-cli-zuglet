'use strict';

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
        Date: false
      }
    },
    APP: {
    },
    firebase: {
      apiKey: "AIzaSyDlYqLJJYWK7cdYBAtkZR5efA8HoYvcd6I",
      authDomain: "ember-cli-zuglet.firebaseapp.com",
      databaseURL: "https://ember-cli-zuglet.firebaseio.com",
      projectId: "ember-cli-zuglet",
      storageBucket: "ember-cli-zuglet.appspot.com",
      messagingSenderId: "337740781111"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
  }

  return ENV;
};
