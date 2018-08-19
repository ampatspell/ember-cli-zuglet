import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { isFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';
import RouterMixin from 'ember-cli-zuglet/less-experimental/router-mixin';

let isFistTransition = true;

const Router = EmberRouter.extend(RouterMixin, {
  location: config.locationType,
  rootURL: config.rootURL,

  didTransition(infos) {
    if(!isFastBoot(this)) {
      if(!isFistTransition) {
        window.scrollTo(0, 0);
      }
      isFistTransition = false;
    }
    this._super(...arguments);
  }

});

Router.map(function() {

  this.route('docs', function() {
    this.route('page', { path: '/*page_id' }, function() {
    });
  });

  this.route('scenarios', function() {
    this.route('redirect-to-nested', function() {
      this.route('models', { path: ':model_id' }, function() {
      });
    });
    this.route('redirect-to-external', function() {
    });
  });

  // development nonsense
  this.route('experiments', function() {
    this.route('wip');
    this.route('query');
    this.route('document');
    this.route('data');
    this.route('image');
    this.route('auth');
    this.route('model');
    this.route('models');
    this.route('browser');
    this.route('blogs', function() {
      this.route('blog', { path: ':blog_id' }, function() {
        this.route('posts', function() {
          this.route('post', { path: ':post_id' }, function() {
          });
        });
      });
    });
  });

  this.route('missing', { path: '/*path' });

});

export default Router;
