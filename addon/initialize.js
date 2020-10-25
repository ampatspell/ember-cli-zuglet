export const initialize = (app, opts) => {

  let stores = app.lookup('zuglet:stores');

  let store = stores.createStore();
  let fullName = `service:${opts.service.name}`;
  app.register(fullName, store, { instantiate: false });

  return store;
}
