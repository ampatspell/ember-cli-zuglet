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

const normalizeStore = store => {
  store = assign({ identifier: 'store', factory: null }, store || {});
  assert(`opts.store.identifier is required`, typeof store.identifier === 'string');
  assert(`opts.store.factory is required`, !!store.factory);
  return store;
}

const normalizeService = (service, store) => {
  service = assign({
    enabled: true,
    name: store.identifier,
    inject: [ 'route', 'controller', 'component', 'model' ]
  }, service);
  assert(`opts.service.name is required`, typeof service.name === 'string');
  return service;
}

const normalizeDevelopment = (development, store) => {
  development = assign({
    enabled: true,
    logging: true,
    export: store.identifier
  }, development);
  assert(`opts.development.export is required`, typeof development.export === 'string');
  return development;
}

const normalize = opts => {
  assert(`opts must be object`, typeof opts === 'object');

  let { app, store, service, development } = opts;

  assert(`opts.app must be present`, !!app);

  store       = normalizeStore(store);
  service     = normalizeService(service, store);
  development = normalizeDevelopment(development, store);

  return { app, opts: { store, service, development } };
}

const environment = app => app.factoryFor('config:environment').class.environment;

export const register = (...args) => {
  let { app, opts } = normalize(...args);

  let stores = app.lookup('zuglet:stores');
  let store = stores.createStore(opts.store.identifier, opts.store.factory);

  if(opts.service.enabled) {
    let fullName = `service:${opts.service.name}`;
    app.register(fullName, store, { instantiate: false });
    A(opts.service.inject).forEach(key => {
      app.inject(key, opts.service.name, fullName);
    });
  }

  if(opts.development.enabled && environment(app) === 'development') {
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

export const initialize = opts => app => register(assign({ app }, opts));
