import { assert } from '@ember/debug';
import { removeObject } from '../../util/array';

class Activator {

  constructor(object) {
    this.object = object;
    this.count = 1;
  }

  inc() {
    this.count++;
  }

  dec() {
    this.count--;
    return this.count === 0;
  }

}

export default class Activators {

  activators = [];

  _find(object) {
    return this.activators.find(activator => activator.object === object);
  }

  add(object) {
    let activator = this._find(object);
    if(activator) {
      activator.inc();
    } else {
      activator = new Activator(object);
      this.activators.push(activator);
    }
  }

  delete(object) {
    let activator = this._find(object);
    assert(`Activator not found for object ${object}`, !!activator);
    if(activator.dec()) {
      removeObject(this.activators, activator);
    }
  }

  get size() {
    return this.activators.length;
  }

}
