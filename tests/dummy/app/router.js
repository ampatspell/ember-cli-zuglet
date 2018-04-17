import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('docs', function() {
    this.route('about');
    this.route('quick-start');
    this.route('api', function() {
      this.route('store', function() {
        this.route('register');
        this.route('references', function() {
          this.route('document');
          this.route('collection');
          this.route('query');
          this.route('queryable');
        });
        this.route('document');
        this.route('query');
      });
      this.route('storage', function() {
      });
      this.route('auth', function() {
      });
    });
  });

  // development nonsense
  this.route('experiments', function() {
    this.route('query');
    this.route('document');
    this.route('data');
    this.route('image');
    this.route('auth');
    this.route('browser');
  });
});

export default Router;
