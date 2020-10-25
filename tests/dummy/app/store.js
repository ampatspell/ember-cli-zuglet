import Store from 'zuglet/store';

export default class DummyStore extends Store {

  options = {
    firebase: {
      apiKey: "AIzaSyDwCGLTmvKCiCxIO9msehKyULJ_rilnEvw",
      authDomain: "quatsch-38adf.firebaseapp.com",
      databaseURL: "https://quatsch-38adf.firebaseio.com",
      projectId: "quatsch-38adf",
      storageBucket: "quatsch-38adf.appspot.com",
      messagingSenderId: "316370319143",
      appId: "1:316370319143:web:1ea76935876b7619"
    },
    firestore: {
      persistenceEnabled: true
    },
    functions: {
      region: null
    }
  }

}
