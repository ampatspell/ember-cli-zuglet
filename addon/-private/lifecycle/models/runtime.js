import ObjectObserver from '../util/object-observer';
import SourceObserver from './source-observer';
import ModelFactory from '../util/model-factory';
import ArrayMapper from './array-mapper';
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

    this.arrayMapper = new ArrayMapper({
      delegate: {
        model: object => this.createModelForObject(object)
      }
    });

    this.replaceAllModels();
  }

  get content() {
    return this.arrayMapper.content;
  }

  //

  createModelForObject(object) {
    let { model } = this.modelFactory.create(object);
    return model;
  }

  replaceAllModels() {
    let objects = this.sourceObserver.source;
    this.arrayMapper.replaceAll(objects);
  }

  //

  onSourceArrayReplaced() {
    this.replaceAllModels();
  }

  onSourceObjectsAdded(objects, start) {
    this.arrayMapper.replace(start, 0, objects);
  }

  onSourceObjectsRemoved(objects, start, len) {
    this.arrayMapper.replace(start, len);
  }

  onSourceObjectUpdated(object, key, idx) {
    this.arrayMapper.replace(idx, 1, [ object ]);
  }

  onParentPropertyUpdated() {
    this.replaceAllModels();
  }

  destroy() {
    this.parentObserver.destroy();
    this.sourceObserver.destroy();
    this.arrayMapper.destroy();
  }

}
