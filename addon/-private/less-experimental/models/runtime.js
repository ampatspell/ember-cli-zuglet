import { A } from '@ember/array';
import ObjectObserver from '../util/object-observer';
import SourceObserver from './source-observer';
import ModelFactory from '../util/model-factory';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const validate = opts => {
  assert(`opts must be object`, typeOf(opts) === 'object');
  let { source, parent } = opts;
  assert(`opts.source must be object`, typeOf(source) === 'object');
  assert(`opts.parent must be array`, typeOf(parent) === 'array');
  let { dependencies, key } = source;
  assert(`opts.source.dependencies must be array`, typeOf(dependencies) === 'array');
  assert(`duplicate owner dependency '${key}'`, !parent.includes(key));
  dependencies.forEach(key => {
    assert(`duplicate owner dependency '${key}`, !parent.includes(key))
  });
}

export default class ModelsRuntime {

  constructor(parent, key, opts) {
    validate(opts);
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
        mapping: object => [ object, parent ],
        named: object => [ object, parent ]
      }
    });

    this.parentObserver = new ObjectObserver({
      object: parent,
      observe: opts.parent,
      delegate: {
        updated: (object, key) => this.onParentPropertyUpdated(object, key)
      }
    });

    this.sourceObserver = new SourceObserver({
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
      removed.map(model => model && model.destroy());
    }
  }

  replaceModel(idx, object) {
    let { model } = this.modelFactory.create(object);
    this.replaceModels(idx, 1, [ model ]);
  }

  rebuildModels() {
    let objects = this.sourceObserver.source;
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

  onParentPropertyUpdated() {
    this.rebuildModels();
  }

  destroy() {
    this.parentObserver.destroy();
    this.sourceObserver.destroy();
    this.content.map(model => model && model.destroy());
  }

}
