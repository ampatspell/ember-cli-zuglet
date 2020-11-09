export const setupStores = hooks => {
  hooks.beforeEach(function() {
    this.stores = this.owner.lookup('zuglet:stores');
  });
  hooks.afterEach(function() {
    this.stores.destroy();
  });
}
