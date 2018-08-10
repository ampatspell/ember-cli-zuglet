import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const validate = opts => {
  assert(`opts must be object`, typeOf(opts) === 'object');
  assert(`opts.parent must be array`, typeOf(opts.parent) === 'array');
  if(opts.content) {
    assert(`opts.content must be function`, typeOf(opts.content) === 'function');
  }
}

export default EmberObject.extend({

  parent: null,
  key: null,
  opts: null,

  observable: null,
  observer: null,

  init() {
    this._super(...arguments);
    validate(this.opts);
  },

  getObservable() {
    return this.observable;
  },

  getObserver() {
    return this.observer;
  },

  setObservable(next) {
    if(this.observable === next) {
      return next;
    }

    this.stopObserving();
    this.observable = next;
    this.startObserving();

    return next;
  },

  stopObserving() {
    let observer = this.observer;
    if(!observer) {
      return;
    }
    observer.cancel();
    this.observer = null;
  },

  startObserving() {
    let observable = this.observable;
    if(!observable) {
      return;
    }
    this.observer = observable.observe();
  },

  willDestroy() {
    this.stopObserving();
    this._super(...arguments);
  }

});
