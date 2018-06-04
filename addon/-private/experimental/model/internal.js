import Internal from '../../internal/internal';

export default Internal.extend({

  owner: null,
  factory: null,
  mapping: null,

  prepare(instance) {
    let { owner, mapping } = this;

    let arg;
    if(mapping) {
      arg = mapping.call(owner, owner);
    } else {
      arg = owner;
    }
    if(instance.prepare) {
      instance.prepare(arg);
    }
  },

  reuse() {
    let model = this.model(true);
    this.prepare(model);
  },

  createModel() {
    let { factory } = this;

    let instance = factory.create();
    this.prepare(instance);

    return instance;
  }

});
