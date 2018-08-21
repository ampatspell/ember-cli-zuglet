import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { isFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';
import { cancel, next } from '@ember/runloop';

let {
  environment
} = config;

let isGoogleAnalyticsEnabled = environment === 'production';
let isFistTransition = true;

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  sendPageview() {
    if(typeof gtag_pageview !== 'undefined') {
      let url = this.get('currentURL');
      gtag_pageview(url); /* eslint-disable-line no-undef */
    }
  },

  schedulePageview() {
    if(!isGoogleAnalyticsEnabled) {
      return;
    }
    cancel(this._schedulePageview);
    this._schedulePageview = next(() => this.sendPageview());
  },

  scrollToTop() {
    window.scrollTo(0, 0);
  },

  didTransition() {
    this._super(...arguments);

    if(!isFastBoot(this)) {
      if(!isFistTransition) {
        this.schedulePageview();
        this.scrollToTop();
      }
      isFistTransition = false;
    }
  },

  willDestroy() {
    cancel(this._schedulePageview);
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
