import { A } from '@ember/array';
// import ParentManager from './runtime/parent';
import SourceManager from './runtime/source';

export default class ModelsRuntime {

  constructor(parent, key, opts) {
    this.parent = parent;
    this.key = key;
    this.opts = opts;
    this.content = A([]);
    console.log('init', this);
    this.sourceManager = new SourceManager({ parent, source: opts.source });
  }

  destroy() {
    console.log('destroy', this);
    this.sourceManager.destroy();
  }

}
