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
    dummy: {
      firebase: {
        apiKey: "AIzaSyDlYqLJJYWK7cdYBAtkZR5efA8HoYvcd6I",
        authDomain: "ember-cli-zuglet.firebaseapp.com",
        databaseURL: "https://ember-cli-zuglet.firebaseio.com",
        projectId: "ember-cli-zuglet",
        storageBucket: "ember-cli-zuglet.appspot.com",
        messagingSenderId: "337740781111",
        appId: "1:337740781111:web:d599271545ea7f2ff751b2"
      },
      name: 'ember-cli-zuglet',
      version: require('../../../package.json').version
    },
    fastboot: {
      hostWhitelist: [ /^localhost:\d+$/ ]
    }
  };

  if(process.env.CI) {
    ENV.dummy.firebase = {
      apiKey: "AIzaSyDoUTp48KAjzcRLRhf1AofFdrsHI6KujHw",
      authDomain: "ember-cli-zuglet-travis.firebaseapp.com",
      databaseURL: "https://ember-cli-zuglet-travis.firebaseio.com",
      projectId: "ember-cli-zuglet-travis",
      storageBucket: "ember-cli-zuglet-travis.appspot.com",
      messagingSenderId: "1053333094712",
      appId: "1:1053333094712:web:8e2aa84a201069524581cd"
    };
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
