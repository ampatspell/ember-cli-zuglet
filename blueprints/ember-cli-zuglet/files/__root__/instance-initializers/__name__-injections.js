export default {
  name: '<%= dasherizedPackageName %>:injections',
  initialize(app) {
    app.inject('component', 'router', 'service:router');
  }
};
