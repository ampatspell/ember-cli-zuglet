import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {

  this.route('docs', function() {
    this.route('page', { path: '/*page_id' }, function() {
    });
  });

  this.route('playground', function() {
    this.route('document');
    this.route('query', function() {
      this.route('array');
      this.route('single');
    });
    this.route('models');
    this.route('content');
    this.route('route');
    this.route('auth');
    this.route('storage');
    this.route('functions');
    this.route('dev');
    this.route('messages', function() {
      this.route('message', { path: ':message_id' }, function() {
      });
    });
  });

});
