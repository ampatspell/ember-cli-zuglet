import Store from '../store';

export default {
  name: 'dummy:store',
  initialize(app) {
    let stores = app.lookup('zuglet:stores');
    let store = stores.createStore('main', Store);

    app.register('service:store', store, { instantiate: false });

    app.inject('component', 'store', 'service:store');
    app.inject('route', 'store', 'service:store');
  }
};
