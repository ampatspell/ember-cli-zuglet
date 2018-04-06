import Store from '../store';

export default {
  name: 'dummy:store',
  initialize(app) {

    let stores = app.lookup('zuglet:stores');
    let store = stores.createStore('main', Store);
    window.store = store;

    let playground = async () => {
      // let query = store.query({ type: 'array', query: db => db.collection('ducks').orderBy('name') });
      // window.query = query;
    };

    playground();
  }
};
