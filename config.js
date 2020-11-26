const assert = require('assert');
const path = require('path');

const serviceAccountKey = name => path.resolve(path.join(__dirname, '..', 'service-account-keys', `${name}.json`));

const configs = {
  default: {
    firebase: {
      apiKey: "AIzaSyDlYqLJJYWK7cdYBAtkZR5efA8HoYvcd6I",
      authDomain: "ember-cli-zuglet.firebaseapp.com",
      databaseURL: "https://ember-cli-zuglet.firebaseio.com",
      projectId: "ember-cli-zuglet",
      storageBucket: "ember-cli-zuglet.appspot.com",
      messagingSenderId: "337740781111",
      appId: "1:337740781111:web:d599271545ea7f2ff751b2"
    },
    serviceAccountKey: serviceAccountKey('ember-cli-zuglet')
  },
  travis: {
    firebase: {
      apiKey: "AIzaSyDoUTp48KAjzcRLRhf1AofFdrsHI6KujHw",
      authDomain: "ember-cli-zuglet-travis.firebaseapp.com",
      databaseURL: "https://ember-cli-zuglet-travis.firebaseio.com",
      projectId: "ember-cli-zuglet-travis",
      storageBucket: "ember-cli-zuglet-travis.appspot.com",
      messagingSenderId: "1053333094712",
      appId: "1:1053333094712:web:8e2aa84a201069524581cd"
    },
    serviceAccountKey: serviceAccountKey('ember-cli-zuglet-travis')
  }
};

const getConfig = name => {
  let config = configs[name];
  assert(config, `Config for name '${name}' was not found`);
  return config;
}

module.exports = getConfig;
