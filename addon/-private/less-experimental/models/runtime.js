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
    this.sourceManager = new SourceManager({
      parent,
      source: opts.source,
      delegate: {
        replaced(array) {
          console.log('source replaced', array);
        },
        added(objects, start, len) {
          console.log('source objects added', objects.slice(), start, len);
        },
        removed(objects, start, len) {
          console.log('source objects removed', objects.slice(), start, len);
        },
        updated(object, key) {
          console.log('source object updated', object, key);
        }
      }
    });
  }

  destroy() {
    console.log('destroy', this);
    this.sourceManager.destroy();
  }

}
