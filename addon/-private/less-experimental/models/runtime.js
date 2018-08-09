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

    this.modelFactory = new ModelFactory({
      parent,
      key,
      inline: opts.inline,
      named: opts.named,
      mapping: opts.mapping,
      delegate: {
        prepare: object => [ object, parent ],
        named: object => [ object, parent ]
      }
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
      observe: opts.object,
      delegate: {
        replaced: array => this.onSourceArrayReplaced(array),
        added: (objects, start, len) => this.onSourceObjectsAdded(objects, start, len),
        removed: (objects, start, len) => this.onSourceObjectsRemoved(objects, start, len),
        updated: (object, key, idx) => this.onSourceObjectUpdated(object, key, idx)
      }
    });

    this.rebuildModels();
  }

  //


  createModels(objects) {
    let factory = this.modelFactory;
    return objects.map(object => {
      let { model } = factory.create(object);
      return model;
    });
  }

  replaceModels(start, remove, models) {
    let removed;
    let content = this.content;
    if(remove) {
      removed = content.slice(start, start + remove);
    }
    content.replace(start, remove, models);
    if(removed) {
      removed.map(model => model.destroy());
    }
  }

  replaceModel(idx, object) {
    let { model } = this.modelFactory.create(object);
    this.replaceModels(idx, 1, [ model ]);
  }

  rebuildModels() {
    let objects = this.sourceManager.source;
    let models;
    if(objects) {
      models = this.createModels(objects);
    }
    let remove = this.content.get('length');
    this.replaceModels(0, remove, models);
  }

  //

  onSourceArrayReplaced() {
    this.rebuildModels();
  }

  onSourceObjectsAdded(objects, start) {
    let models = this.createModels(objects);
    this.replaceModels(start, 0, models);
  }

  onSourceObjectsRemoved(objects, start, len) {
    this.replaceModels(start, len);
  }

  onSourceObjectUpdated(object, key, idx) {
    this.replaceModel(idx, object);
  }

  onParentPropertyUpdated(object, key) {
    this.rebuildModels();
  }

  destroy() {
    this.parentManager.destroy();
    this.sourceManager.destroy();
    this.content.map(model => model.destroy());
  }

}
