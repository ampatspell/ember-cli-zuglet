export default class ModelsRuntime {

  constructor(parent, key, opts) {
    this.parent = parent;
    this.key = key;
    this.opts = opts;
    console.log('init', this);
  }

  destroy() {
    console.log('destroy', this);
  }

}
