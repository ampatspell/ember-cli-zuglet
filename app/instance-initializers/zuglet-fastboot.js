import { lookupFastBoot } from 'zuglet/-private/util/fastboot';

export default {
  name: 'zuglet:fastboot',
  initialize(app) {
    let { fastboot, isFastBoot } = lookupFastBoot(app);
    if(!fastboot) {
      return;
    }
    let stores = app.lookup('zuglet:stores');
    if(isFastBoot) {
      fastboot.deferRendering(stores.settle());
    }
  }
}
