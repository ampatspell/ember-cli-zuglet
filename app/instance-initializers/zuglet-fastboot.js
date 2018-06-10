export default {
  name: 'zuglet:fastboot',
  initialize(app) {
    let fastboot = app.lookup('service:fastboot');

    if(!fastboot) {
      return;
    }

    let stores = app.lookup('zuglet:stores');

    if(fastboot.get('isFastBoot')) {
      fastboot.deferRendering(stores.settle());
    }
  }
}
