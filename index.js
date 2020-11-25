'use strict';

module.exports = {
  name: 'zuglet',
  isDevelopingAddon() {
    return true;
  },
  included(app) {
    this._super.included.apply(this, arguments);
    app.import('vendor/zuglet/fastboot.js');
  }
};
