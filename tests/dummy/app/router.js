import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('document');
  this.route('query', function() {
    this.route('array');
    this.route('single');
  });
  this.route('models');
});
