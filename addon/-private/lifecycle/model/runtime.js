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

    this._content = null;
    this._dirty = true;

    this.modelFactory = new ModelFactory({
      parent,
      key,
      inline: opts.inline,
      named: opts.named,
      mapping: opts.mapping,
      delegate: {
        mapping: () => [ parent ],
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
  }

  content(create) {
    let content = this._content;
    if(!content && this._dirty && create) {
      content = this.createModel();
      this._dirty = false;
      this._content = content;
    }
    return content;
  }

  dirty(notify) {
    if(this._dirty) {
      return;
    }
    this._dirty = true;
    let content = this._content;
    if(content) {
      content.destroy();
      this._content = null;
    }
    if(notify) {
      this.delegate.updated();
    }
  }

  createModel() {
    let { model } = this.modelFactory.create();
    return model;
  }

  onParentPropertyUpdated() {
    this.dirty(true);
}

  destroy() {
    this.parentObserver.destroy();
    let content = this._content;
    content && content.destroy();
  }

}
