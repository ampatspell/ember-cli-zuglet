import { activate } from 'zuglet/utils';

export const setupHelpers = hooks => {
  hooks.beforeEach(function() {
    this.registerModel = (name, factory) => this.owner.register(`model:${name}`, factory);
    this.activations = [];
    this.activate = model => {
      this.activations.push(activate(model));
    }
  });
  hooks.afterEach(function() {
    this.activations.forEach(cancel => cancel());
  });
}
