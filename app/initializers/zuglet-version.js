import Ember from 'ember';
import flags from 'zuglet/-private/flags';

const {
  libraries
} = Ember;

const {
  version
} = flags;

let registered = false;

export default {
  name: 'zuglet:version',
  initialize() {
    if(registered) {
      return;
    }
    registered = true;
    libraries.register('ember-cli-zuglet', version.zuglet);
    libraries.register('firebase', version.firebase);
  }
};
