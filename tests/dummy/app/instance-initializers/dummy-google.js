import { lookupFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

const isCrawler = () => /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
const isFastBoot = app => lookupFastBoot(app).isFastBoot;

export default {
  name: 'dummy:google',
  initialize(app) {
    if(!isFastBoot(app) && isCrawler()) {
      // at the moment ember.js doesn't work on Chrome 41
      // so, just disable rendering for now
      let env = app.lookup('-environment:main');
      env.options.shouldRender = false;
    }
  }
};
