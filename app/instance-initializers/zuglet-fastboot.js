import { lookupFastBoot } from 'zuglet/-private/util/fastboot';

export default {
  name: 'zuglet:fastboot',
  initialize(app) {
    let { fastboot, isFastBoot } = lookupFastBoot(app);
    /* istanbul ignore next */
    if(isFastBoot) {
      let stores = app.lookup('zuglet:stores');
      fastboot.deferRendering(stores.settle());
    }
  }
};
