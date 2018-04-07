import Store from 'ember-cli-zuglet/store';

// let travis = {
//   apiKey: "AIzaSyAvm8v8kXS3iHsg3EBxAk-mZZcYdeOuj3E",
//   authDomain: "ember-cli-zug-travis.firebaseapp.com",
//   databaseURL: "https://ember-cli-zug-travis.firebaseio.com",
//   projectId: "ember-cli-zug-travis",
//   storageBucket: "ember-cli-zug-travis.appspot.com",
//   messagingSenderId: "715071933357"
// };

let dev = {
  apiKey: "AIzaSyApr48AJWch97DybXXVhF53LJttudP8E2Y",
  authDomain: "ember-cli-zug.firebaseapp.com",
  databaseURL: "https://ember-cli-zug.firebaseio.com",
  projectId: "ember-cli-zug",
  storageBucket: "ember-cli-zug.appspot.com",
  messagingSenderId: "102388675337"
};

const options = {
  firebase: dev,
  firestore: {
    persistenceEnabled: true
  }
};

export default Store.extend({

  options,

});
