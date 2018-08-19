import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { isFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

let isFistTransition = true;

// const namesFromInfos = infos => infos.map(i => i.name);

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  willTransition(oldInfos, newInfos, transition) {
    // console.log('router.willTransition', namesFromInfos(oldInfos), namesFromInfos(newInfos), transition);
    this._super(...arguments);
  },

  didTransition(infos) {
    // console.log('router.didTransition', namesFromInfos(infos));
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
