import EmberRouterScroll from 'ember-router-scroll';
import config from 'dummy/config/environment';
import { isFastBoot } from 'zuglet/-private/util/fastboot';
import classic from 'ember-classic-decorator';

const {
  environment
} = config;

const isGoogleAnalyticsEnabled = environment === 'production';

declare let gtag_pageview: Fixme;

@classic
export default class Router extends EmberRouterScroll {
  location = config.locationType;
  rootURL = config.rootURL;

  init(): void {
    super.init();
    this.on('routeDidChange', () => this.routeDidChange());
  }

  sendPageview(): void {
    if(!isGoogleAnalyticsEnabled) {
      return;
    }
    if(typeof gtag_pageview !== 'undefined') {
      const url = (this as Fixme).currentURL;
      gtag_pageview(url); /* eslint-disable-line no-undef */
    }
  }

  routeDidChange(): void {
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
