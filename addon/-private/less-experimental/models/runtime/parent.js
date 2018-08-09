import ObjectObserver from '../../util/object-observer';
import { A } from '@ember/array';

export default class ParentManager {

  constructor(object, key, opts) {
    this.object = object;
    this.key = key;
    this.opts = opts;
    let observe = A([ ...opts.source.dependencies, ...opts.parent ]).uniq();
    let updated = (object, key) => {
      console.log('parentKeyDidChange', key);
    };
    this.observer = new ObjectObserver({ object, observe, delegate: { updated } });
  }

  destroy() {
    this.observer.destroy();
  }

}
