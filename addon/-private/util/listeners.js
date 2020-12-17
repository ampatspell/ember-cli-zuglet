import { A } from '@ember/array';

export class Listeners {

  constructor() {
    this._types = Object.create(null);
  }

  _type(name) {
    let type = this._types[name];
    if(!type) {
      type = A();
      this._types[name] = type;
    }
    return type;
  }

  register(name, fn) {
    let type = this._type(name);
    type.pushObject(fn);
    let removed = false;
    return () => {
      if(removed) {
        return false;
      }
      removed = true;
      type.removeObject(fn);
      return true;
    };
  }

  notify(name, ...args) {
    let type = [ ...this._type(name) ];
    type.forEach(fn => fn(...args));
  }

}
