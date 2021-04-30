import EmberRouter from '@ember/routing/router';
import config from 'dummy/config/environment';
import { isFastBoot } from 'zuglet/-private/util/fastboot';
import classic from 'ember-classic-decorator';

let {
  environment
} = config;

let isGoogleAnalyticsEnabled = environment === 'production';

@classic
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;

  init() {
    super.init(...arguments);
    this.on('routeDidChange', () => this.routeDidChange());
  }

  sendPageview() {
    if(!isGoogleAnalyticsEnabled) {
      return;
    }
    if(typeof gtag_pageview !== 'undefined') {
      let url = this.currentURL;
      gtag_pageview(url); /* eslint-disable-line no-undef */
    }
  }

  routeDidChange() {
    if(!isFastBoot(this)) {
      this.sendPageview();
    }
  }

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

  this.route('missing', { path: '/*path' });

});
