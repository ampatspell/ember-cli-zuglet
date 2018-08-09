import ModelFactory from '../util/model-factory';
import ObjectObserver from '../util/object-observer';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const validate = (opts, delegate) => {
  assert(`opts must be object`, typeOf(opts) === 'object');
  assert(`delegate must be object`, typeOf(delegate) === 'object');
  assert(`delegate.updated must be function`, typeOf(delegate.updated) === 'function');
}

export default class ModelsRuntime {

  constructor(parent, key, opts, delegate) {
    validate(opts, delegate);
    this.parent = parent;
    this.key = key;
    this.opts = opts;
    this.delegate = delegate;

    this.modelFactory = new ModelFactory({
      parent,
      key,
      inline: opts.inline,
      named: opts.named,
      mapping: opts.mapping,
      delegate: {
        prepare: () => [ parent ],
        named: () => [ parent ]
      }
    });

    this.parentObserver = new ObjectObserver({
      object: parent,
      observe: opts.parent,
      delegate: {
        updated: (object, key) => this.onParentPropertyUpdated(object, key)
      }
    });

    this.rebuildModel(false);
  }

  createModel() {
    let { model } = this.modelFactory.create();
    return model;
  }

  rebuildModel(notify) {
    let previous = this.content;

    let content = this.createModel();
    this.content = content;

    if(previous) {
      previous.destroy();
    }

    if(previous !== content && notify) {
      this.delegate.updated(content);
    }
  }

  onParentPropertyUpdated(object, key) {
    this.rebuildModel(true);
  }

  destroy() {
    this.parentObserver.destroy();
    let content = this.content;
    content && content.destroy();
  }

}
