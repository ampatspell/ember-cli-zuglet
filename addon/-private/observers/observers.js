import EmberObject from '@ember/object';
import { gt } from '@ember/object/computed';
import { assert } from '@ember/debug';

export default EmberObject.extend({

  isEnabled: gt('count', 0),
  count: 0,

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

    let observer = () => {
      if(observer.invoked) {
        return;
      }
      observer.invoked = true;
      this._remove();
    };

    return observer;
  },

  willDestroy() {
    if(this.get('count') > 0) {
      this._stopObserving();
    }
    this._super(...arguments);
  }

});
