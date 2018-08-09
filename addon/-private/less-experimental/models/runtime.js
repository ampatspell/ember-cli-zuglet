import { A } from '@ember/array';
import ParentManager from './runtime/parent';
import SourceManager from './runtime/source';
import ModelFactory from '../util/model-factory';

export default class ModelsRuntime {

  constructor(parent, key, opts) {
    this.parent = parent;
    this.key = key;
    this.opts = opts;
    this.content = A([]);
    console.log('init', this);

    this.modelFactory = new ModelFactory({
      parent,
      key,
      inline: opts.inline,
      named: opts.named,
      mapping: opts.mapping,
      prepare: object => [ object, parent ],
    });

    this.parentManager = new ParentManager({
      parent,
      observe: opts.parent,
      delegate: {
        updated: (object, key) => this.onParentPropertyUpdated(object, key)
      }
    });

    this.sourceManager = new SourceManager({
      parent,
      source: opts.source,
      delegate: {
        replaced: array => this.onSourceArrayReplaced(array),
        added: (objects, start, len) => this.onSourceObjectsAdded(objects, start, len),
        removed: (objects, start, len) => this.onSourceObjectsRemoved(objects, start, len),
        updated: (object, key) => this.onSourceObjectUpdated(object, key)
      }
    });
  }

  onSourceArrayReplaced(source) {
    console.log('source array replaced', source.slice());
    if(source) {
      let factory = this.modelFactory;
      source.map(object => {
        let { model, promise } = factory.create(object);
      });
    }
  }

  onSourceObjectsAdded(objects, start, len) {
    console.log('source objects added', objects.slice(), start, len);
  }

  onSourceObjectsRemoved(objects, start, len) {
    console.log('source objects removed', objects.slice(), start, len);
  }

  onSourceObjectUpdated(object, key) {
    console.log('source object updated', object, key);
  }

  onParentPropertyUpdated(object, key) {
    console.log('parent updated', object, key);
  }

  destroy() {
    console.log('destroy', this);
    this.parentManager.destroy();
    this.sourceManager.destroy();
  }

}
