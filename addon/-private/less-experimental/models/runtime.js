import { A } from '@ember/array';
import ObjectObserver from '../util/object-observer';

export default class ModelsRuntime {

  constructor(parent, key, opts) {
    this.parent = parent;
    this.key = key;
    this.opts = opts;
    this.content = A([]);
    this.isDestroyed = false;
    console.log('init', this);
    this.parentObserver = this.createParentObserver();
  }

  createParentObserver() {
    let { parent: object, opts } = this;
    let observe = A([ ...opts.source.dependencies, ...opts.parent ]).uniq();
    let updated = (object, key) => {
      console.log('parentKeyDidChange', key);
    };
    return new ObjectObserver({ object, observe, delegate: { updated } });
  }

  destroy() {
    console.log('destroy', this);
    if(this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;
    this.parentObserver.destroy();
  }

}
