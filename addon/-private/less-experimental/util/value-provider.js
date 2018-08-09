import ObjectObserver from './object-observer';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const validate = (object, observe, key, delegate) => {
  assert(`object is required`, !!object);
  assert(`observe must be array`, typeOf(observe) === 'array');
  assert(`key must be string or function`, typeOf(key) === 'function' || typeOf(key) === 'string');
  assert(`delegate is required`, !!delegate);
  assert(`delegate.updated must be function`, typeOf(delegate.updated) === 'function');
}

export default class ValueProvider {

  // object
  // observe: array or keys
  // key: function or string
  // delegate: { updated(value) }
  constructor({ object, observe, key, delegate }) {
    validate(object, observe, key, delegate);
    this.object = object;
    this.key = key;
    this.delegate = delegate;
    this.resolve = typeof key === 'function';
    if(this.resolve) {
      this.observer = new ObjectObserver({
        object,
        observe,
        delegate: {
          updated: () => this.update(true)
        }
      });
    }
    this.update(false);
  }

  update(notify) {
    let object = this.object;

    let key;
    if(this.resolve) {
      key = this.key(object);
    } else {
      key = this.key;
    }

    let value;
    if(key) {
      value = get(object, key);
    }

    if(this.value === value) {
      return;
    }

    this.value = value;

    if(notify) {
      this.delegate.updated(value);
    }
  }

  destroy() {
    this.observer && this.observer.destroy();
  }

}
