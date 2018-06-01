import Internal from '../internal/internal';
import { gt } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { defer, reject } from 'rsvp';
import { assign } from '@ember/polyfills';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { noObserversError } from '../util/errors';

export default Internal.extend({

  owner: null,

  observers: null,
  isEnabled: gt('observers.length', 0),

  init() {
    this._super(...arguments);
    this.setProperties({
      deferred: defer(),
      observers: A()
    });
  },

  observer: readOnly('observers.lastObject'),

  promise: computed('observer.promise', function() {
    let promise = this.get('observer.promise');
    if(promise) {
      return promise;
    }
    return reject(noObserversError());
  }).readOnly(),

  factoryFor(name) {
    return this.get('owner').factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:observers').create({ _internal: this });
  },

  _withParent(fn) {
    let parentKey = this.get('opts.parent');
    if(!parentKey) {
      return;
    }
    let owner = this.get('owner');
    let parent = owner.get(parentKey);
    assert(`parent ${parentKey} is not set`, !!parent);
    fn(parent, owner);
  },

  _startObserving() {
    this._withParent((parent, owner) => parent.registerObservedInternal(owner));
    this.opts.start.call(this.owner, this);
  },

  _stopObserving() {
    this.opts.stop.call(this.owner, this);
    this._withParent((parent, owner) => parent.unregisterObservedInternal(owner));
  },

  _withObservers(cb) {
    let observers = this.get('observers');
    let builder = (idx, remove, add) => invocation => {
      let model;

      if(!this.isDestroying) {
        model = this.model(false);
      }

      if(model) {
        model.arrayContentWillChange(idx, remove, add);
      }

      invocation();

      if(model) {
        model.arrayContentDidChange(idx, remove, add);
      }
    };
    cb(observers, builder);
  },

  _addObserver(internal) {
    this._withObservers((observers, builder) => {
      let idx = observers.get('length');
      let change = builder(idx, 0, 1);
      change(() => observers.pushObject(internal));
    });
  },

  _removeObserver(internal) {
    this._withObservers((observers, builder) => {
      let idx = observers.indexOf(internal);
      let change = builder(idx, 1, 0);
      change(() => observers.removeObject(internal));
    })
  },

  add(factoryName, props) {
    if(this.isDestroying) {
      return;
    }

    if(this.get('observers.length') === 0) {
      this._startObserving();
    }

    let promise = this.get('deferred.promise');
    let cancel = internal => this.cancelObserver(internal);
    let state = { promise, cancel };

    let internal = this.factoryFor(factoryName).create(assign({ observers: this, state }, props));
    this._addObserver(internal);
    return internal;
  },

  cancelObserver(internal) {
    if(internal.get('isCancelled')) {
      return;
    }

    internal.set('isCancelled', true);

    if(this.get('observers.length') === 1) {
      this._stopObserving();
      this.resolve();
    }

    this._removeObserver(internal);
  },

  resolve(arg) {
    this.get('deferred').resolve(arg);
  },

  willDestroy() {
    this.get('observers').map(observer => this.cancelObserver(observer));
    this.resolve();
    this._super(...arguments);
  }

});
