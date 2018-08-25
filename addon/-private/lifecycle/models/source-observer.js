import ValueProvider from '../util/value-provider';
import ArrayObserver from '../util/array-observer';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const validate = (parent, source, observe, delegate) => {
  assert(`parent is required`, !!parent);
  assert(`source must be object`, typeOf(source) === 'object');
  assert(`source.dependencies must be array`, typeOf(source.dependencies) === 'array');
  assert(`observe must be array`, typeOf(observe) === 'array');
  assert(`source.key is required`, !!source.key);
  assert(`delegate is required`, !!delegate);
  assert(`delegate.replaced must be function`, typeOf(delegate.replaced) === 'function');
  assert(`delegate.added must be function`, typeOf(delegate.added) === 'function');
  assert(`delegate.removed must be function`, typeOf(delegate.removed) === 'function');
  assert(`delegate.updated must be function`, typeOf(delegate.updated) === 'function');
}

export default class SourceObserver {

  // parent
  // source: { dependencies, key }
  // observe: [ key, ... ] object deps array
  // delegate: { replaced, added, removed, updated }
  constructor({ parent, source, observe, delegate }) {
    validate(parent, source, observe, delegate);
    this.parent = parent;
    this.delegate = delegate;
    this.observe = observe;
    this.provider = new ValueProvider({
      object: parent,
      observe: source.dependencies,
      key: source.key,
      delegate: {
        updated: () => this.update(true)
      }
    });
    this.update(false);
  }

  get source() {
    return this.provider.value;
  }

  update(notify) {
    let observer = this.observer;
    if(observer) {
      observer.destroy();
      this.observer = null;
    }

    let source = this.source;

    if(source) {
      this.observer = new ArrayObserver({
        array: source,
        observe: this.observe,
        delegate: {
          added: (objects, start, len) => this.delegate.added(objects, start, len),
          removed: (objects, start, len) => this.delegate.removed(objects, start, len),
          updated: (object, key) => this.delegate.updated(object, key, source.indexOf(object))
        }
      });
    }

    if(notify) {
      this.delegate.replaced(source);
    }
  }

  destroy() {
    this.provider.destroy();
    this.observer && this.observer.destroy();
  }

}
