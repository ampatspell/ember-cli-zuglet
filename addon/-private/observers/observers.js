import EmberObject from '@ember/object';
import { gt } from '@ember/object/computed';
import { assert } from '@ember/debug';
import { defer } from 'rsvp';

export default EmberObject.extend({

  isEnabled: gt('count', 0),
  count: 0,

  init() {
    this._super(...arguments);
    this.set('deferred', defer());
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

  _remove() {
    if(this.isDestroying) {
      return;
    }
    let count = this.get('count');
    if(count === 1) {
      this._stopObserving();
      this.resolve();
    }
    this.set('count', count - 1);
  },

  add() {
    if(this.isDestroying) {
      return;
    }

    let count = this.get('count');

    if(count === 0) {
      this._startObserving();
    }

    this.set('count', count + 1);

    let cancel = () => {
      if(cancel.invoked) {
        return;
      }
      cancel.invoked = true;
      this._remove();
    };

    let promise = this.get('deferred').promise;

    return { cancel, promise };
  },

  resolve(arg) {
    this.get('deferred').resolve(arg);
  },

  willDestroy() {
    if(this.get('count') > 0) {
      this._stopObserving();
    }
    this.resolve();
    this._super(...arguments);
  }

});
