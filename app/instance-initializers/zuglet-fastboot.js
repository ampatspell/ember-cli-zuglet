import { _lookupFastboot } from 'ember-cli-zuglet/-private/util/fastboot';

export default {
  name: 'zuglet:fastboot',
  initialize(app) {
    let { fastboot, isFastBoot } = _lookupFastboot(app);

    if(!fastboot) {
      return;
    }

    let stores = app.lookup('zuglet:stores');

    if(isFastBoot) {
      fastboot.deferRendering(stores.settle());
    }
  }
}
