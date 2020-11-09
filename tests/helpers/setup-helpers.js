export const setupHelpers = hooks => {
  hooks.beforeEach(function() {
    this.registerModel = (name, factory) => this.owner.register(`model:${name}`, factory);
  });
}
