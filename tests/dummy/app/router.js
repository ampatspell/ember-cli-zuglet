import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('docs', function() {
    this.route('about');
  });

  // development nonsense
  this.route('experiments', function() {
    this.route('query');
    this.route('document');
    this.route('data');
    this.route('image');
    this.route('auth');
  });
});

export default Router;
