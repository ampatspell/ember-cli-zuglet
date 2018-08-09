import { A } from '@ember/array';

export default class ModelsRuntime {

  constructor(parent, key, opts) {
    this.parent = parent;
    this.key = key;
    this.opts = opts;
    this.content = A([]);
    console.log('init', this);
  }

  destroy() {
    console.log('destroy', this);
  }

}
