import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { A } from '@ember/array';
import { isFastBoot } from './-private/util/fastboot';

// register({
//   app,
//   store: {
//     identifier: 'store',
//     factory: Store,
//   },
//   service: {
//     enabled: true,
//     name: 'store',
//     inject: [ 'route', 'controller', 'component', 'model' ],
//   },
//   development: {
//     enabled: true,
//     export: 'store',
//     logging: true
//   }
// });

const environment = app => app.factoryFor('config:environment').class.environment;

export default opts => {
  assert(`opts must be object`, typeof opts === 'object');

  opts = assign({ service: { enabled: true }, development: { enabled: true } }, opts);

  let app = opts.app;
  assert(`opts.app must be present`, !!app);

  assert(`opts.store must be object`, typeof opts.store === 'object');
  assert(`opts.store.identifier is required`, !!opts.store.identifier);
  assert(`opts.store.factory is required`, !!opts.store.factory);

  assert(`opts.development must be object`, typeof opts.development === 'object');

  let stores = app.lookup('zuglet:stores');
  let store = stores.createStore(opts.store.identifier, opts.store.factory);

  if(opts.service.enabled) {
    opts.service = assign({ name: opts.store.identifier, inject: [ 'route', 'controller', 'component', 'model' ] }, opts.service);
    let fullName = `service:${opts.service.name}`;
    app.register(fullName, store, { instantiate: false });
    A(opts.service.inject).forEach(key => {
      app.inject(key, opts.service.name, fullName);
    });
  }

  if(opts.development.enabled && environment(app) === 'development') {
    opts.development = assign({ export: opts.store.identifier, logging: true }, opts.development);
    if(typeof window !== 'undefined' && !isFastBoot(store)) {
      let key = opts.store.identifier;
      window[key] = store;
      if(opts.development.logging) {
        console.log(`window.${key} = ${store}`);
      }
      stores._internal.registerWillDestroyListener(() => {
        delete window[key];
      });
    }
  }

  return store;
}
