import Internal from '../../internal/internal';

export default Internal.extend({

  owner: null,
  factory: null,
  mapping: null,

  createModel() {
    let { owner, factory, mapping } = this;

    let instance = factory.create();

    let arg;
    if(mapping) {
      arg = mapping.call(owner, owner);
    } else {
      arg = owner;
    }

    if(instance.prepare) {
      instance.prepare(arg);
    }

    return instance;
  }

});
