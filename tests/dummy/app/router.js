import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  didTransition() {
  window.scrollTo(0, 0);
  this._super(...arguments);
}

});

Router.map(function() {

  this.route('docs', function() {
    this.route('page', { path: '/*page_id' }, function() {
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

    this.route('blogs', function() {
      this.route('new');
      this.route('blog', { path: ':blog_id' }, function() {
        this.route('edit');
        this.route('delete');
        this.route('posts', function() {
          this.route('new');
          this.route('post', { path: ':post_id' }, function() {
            this.route('edit');
            this.route('delete');
          });
        });
      });
    });
  });

});

export default Router;
