import { addObserver, removeObserver } from '@ember/object/observers';
import { get } from '@ember/object';

export default class PropertyObserver {

  constructor(object, key, delegate) {
    this.object = object;
    this.key = key;
    this.delegate = delegate;
    this.value = undefined;
    this.start();
    this.update();
  }

  update() {
    let { key, object } = this;
    let next = get(object, key);
    let value = this.value;
    if(next === value) {
      return;
    }
    this.value = next;
    return true;
  }

  notify() {
    this.delegate.didChange(this.value);
  }

  propertyDidChange() {
    if(this.update()) {
      this.notify();
    }
  }

  start() {
    addObserver(this.object, this.key, this, this.propertyDidChange);
  }

  stop() {
    removeObserver(this.object, this.key, this, this.propertyDidChange);
  }

  destroy() {
    this.stop();
  }

}
