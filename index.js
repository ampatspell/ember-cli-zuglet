'use strict';

module.exports = {
  name: require('./package').name,
  included(app) {
    this._super.included.apply(this, arguments);
    app.import('vendor/zuglet/fastboot.js');
  }
};
