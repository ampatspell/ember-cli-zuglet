import ObjectProxyManager from './proxy';

class Property {

  constructor() {
    this.manager = new ObjectProxyManager({
      delegate: {
        onDirty: () => this.onDirty()
      }
    });
  }

  getProxy() {
    return this.manager.getProxy();
  }

  setValue(value) {
    return this.manager.setValue(value);
  }

  getRaw() {
    return this.manager.getRaw();
  }

  onDirty() {
  }

}

const getProperty = (owner, key) => {
  let _key = `__${key}`;
  let prop = owner[_key];
  if(!prop) {
    prop = new Property();
    owner[_key] = prop;
  }
  return prop;
}

export const object = () => (owner, key) => {
  return {
    get: () => getProperty(owner, key).getProxy(),
    set: value => getProperty(owner, key).setValue(value)
  };
}

export const raw = (key) => owner => {
  return {
    get: () => getProperty(owner, key).getRaw()
  };
}

export const property = (key) => owner => {
  return {
    get: () => getProperty(owner, key)
  };
}
