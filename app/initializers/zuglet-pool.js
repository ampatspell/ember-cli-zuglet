import FirebasePool from 'ember-cli-zuglet/-private/firebase/pool';

export default {
  name: 'zuglet:pool',
  initialize(container) {
    let instance = FirebasePool.create();
    container.register('zuglet:firebase/pool', instance, { instantiate: false });
  }
}
