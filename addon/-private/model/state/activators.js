import { A } from '@ember/array';

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

  constructor() {
    this.activators = A();
  }

  has(object) {
    return !!this._find(object);
  }

  _find(object) {
    return this.activators.find(activator => activator.object === object);
  }

  add(object) {
    let activator = this._find(object);
    if(activator) {
      activator.inc();
    } else {
      activator = new Activator(object);
      this.activators.pushObject(activator);
    }
  }

  delete(object) {
    let activator = this._find(object);
    if(activator) {
      if(activator.dec()) {
        this.activators.removeObject(activator);
      }
    } else {
      throw new Error(`Activator not found for object ${object}`);
    }
  }

  get size() {
    return this.activators.length;
  }

}
