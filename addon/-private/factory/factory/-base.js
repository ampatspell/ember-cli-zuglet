import ZugletObject from '../../object';

const factoryForPrefix = prefix => (_, key) => ({
  value(...args) {
    let { factory } = this;
    return factory[key].call(factory, prefix, ...args);
  }
});

export default prefix => {

  const factory = factoryForPrefix(prefix);

  return class Factory extends ZugletObject {

    @factory registerFactory
    @factory factoryFor
    @factory create

    constructor(owner, { factory }) {
      super(owner);
      this.factory = factory;
    }

  }
}
