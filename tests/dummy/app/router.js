import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { isFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

let {
  environment
} = config;

let isGoogleAnalyticsEnabled = environment === 'production';
let isFistTransition = true;

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  sendPageview() {
    if(!isGoogleAnalyticsEnabled) {
      return;
    }
    if(typeof gtag_pageview !== 'undefined') {
      let url = this.get('currentURL');
      gtag_pageview(url); /* eslint-disable-line no-undef */
    }
  },

  scrollToTop() {
    window.scrollTo(0, 0);
  },

  routeDidChange() {
    if(!isFastBoot(this)) {
      if(!isFistTransition) {
        this.sendPageview();
        this.scrollToTop();
      }
      isFistTransition = false;
    }
  },

  init() {
    this._super(...arguments);
    this.on('routeDidChange', () => this.routeDidChange());
  }

});

Router.map(function() {

  this.route('docs', function() {
    this.route('page', { path: '/*page_id' }, function() {
    });
  });

  this.route('scenarios', function() {
    this.route('redirect-to-nested', function() {
      this.route('intermediate');
      this.route('models', { path: '/models/:model_id' }, function() {
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
