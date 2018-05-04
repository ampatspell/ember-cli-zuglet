export default {
  name: 'dummy:docs',
  initialize(app) {
    app.inject('route', 'docs', 'service:docs');
    app.inject('component', 'docs', 'service:docs');
  }
};
