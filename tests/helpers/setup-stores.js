import { run } from '@ember/runloop';

export default hooks => {
  hooks.beforeEach(function() {
    this.stores = this.owner.lookup('zuglet:stores');
  });
  hooks.afterEach(function() {
    run(() => this.stores.destroy());
  });
}
