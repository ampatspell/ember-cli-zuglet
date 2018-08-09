import ObjectObserver from './object-observer';
import { get } from '@ember/object';

export default class ValueProvider {

  // dependencies: array or keys
  // key: function or string
  // delegate: { updated }
  constructor({ object, dependencies, key, delegate }) {
    this.object = object;
    this.dependencies = dependencies;
    this.key = key;
    this.delegate = delegate;
    this.observe = typeof key === 'function';
    if(this.observe) {
      this.observer = new ObjectObserver({
        object,
        observe: dependencies,
        delegate: {
          updated: () => this.update()
        }
      });
    }
    this.update();
  }

  update() {
    let object = this.object;

    let key;
    if(this.observe) {
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
    this.delegate.updated(value);
  }

  destroy() {
    this.observer && this.observer.destroy();
  }

}
