import FirebasePools from 'ember-cli-zuglet/-private/firebase/pools';

export default {
  name: 'zuglet:pool',
  initialize(container) {
    let instance = FirebasePools.create();
    container.register('zuglet:firebase/pools', instance, { instantiate: false });
  }
}
