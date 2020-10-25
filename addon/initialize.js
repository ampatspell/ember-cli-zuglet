import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';
import { isFastBoot } from './-private/util/fastboot';

const {
  assign
} = Object;

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
  assert(`opts.service.inject must be array`, typeOf(service.inject) === 'array');
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

const normalizeArgs = (...args) => {
  let opts;
  let app;
  if(args.length > 1) {
    app = args[0];
    opts = args[1];
    assert(`opts must be object`, typeOf(opts) === 'object');
    assert(`app is required`, !!app);
  } else {
    opts = args[0];
    assert(`opts must be object`, typeOf(opts) === 'object');
    app = opts.app;
    delete opts.app;
    assert(`opts.app is required`, !!app);
  }
  return { app, opts };
}

const normalize = (...args) => {
  let { app, opts } = normalizeArgs(...args);

  let { store, service, development } = opts;

  store       = normalizeStore(store);
  service     = normalizeService(service, store);
  development = normalizeDevelopment(development, store);

  return { app, opts: { store, service, development } };
}

const environment = app => app.factoryFor('config:environment').class.environment;

export const initialize = (...args) => {
  let { app, opts } = normalize(...args);

  let stores = app.lookup('zuglet:stores');
  let store = stores.createStore(opts.store.identifier, opts.store.factory);

  let fullName = `service:${opts.service.name}`;
  app.register(fullName, store, { instantiate: false });

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
    }
  }

  return store;
}
