import { A } from '@ember/array';
import { diffArrays } from '../../../util/diff-arrays';
import { consumeKey, dirtyKey } from '../../../model/tracking/tag';

export default class ArrayActivator {

  type = 'array';

  // arrayObserverOpts = {
  //   willChange: this.contentWillChange,
  //   didChange: this.contentDidChange
  // }

  constructor(property, content) {
    this.property = property;
    this.content = A(content);
    this.activate();
  }

  //

  // contentWillChange(array, start, removeCount, addCount) {
  //   if(removeCount) {
  //     let removed = array.slice(start, start + removeCount);
  //     this.deactivateValues(removed);
  //   }
  // }

  // contentDidChange(array, start, removeCount, addCount) {
  //   if(addCount) {
  //     let added = A(array.slice(start, start + addCount));
  //     this.activateValues(added);
  //   }
  // }

  //

  activateValues(values) {
    values.map(item => this.property.activateValue(item));
  }

  deactivateValues(values) {
    values.map(item => this.property.deactivateValue(item));
  }

  activate(models) {
    if(!this.property.isActivated) {
      return;
    }
    this.activateValues(models || this.content);
  }

  deactivate(models) {
    this.deactivateValues(models || this.content);
  }

  get proxy() {
    let proxy = this._proxy;
    if(!proxy) {
      proxy = new Proxy(this.content, {
        get(target, prop) {
          consumeKey(target, prop);
          console.log('get', prop);
          return target[prop];
        },
        set(target, prop, value) {
          dirtyKey(target, prop);
          console.log('set', prop, value);
          target[prop] = value
          return true;
        }
      });
      this._proxy = proxy;
    }
    return proxy;
  }

  getValue() {
    return this.proxy;
  }

  setValue(value) {
    if(value === this.proxy) {
      return this.proxy;
    }

    let { removed, added } = diffArrays(this.content, value);

    this.deactivate(removed);
    this.content = A(value);
    this._proxy = null;
    this.activate(added);

    return this.proxy;
  }

}
