import EmberObject from '@ember/object';
import { gt } from '@ember/object/computed';
import destroyable from '../util/computed-destroyable';
import { getOwner } from '@ember/application';

export const observers = opts => destroyable({
  create() {
    return getOwner(this).factoryFor(`zuglet:observers`).create({ owner: this, opts });
  }
});

export default EmberObject.extend({

  isEnabled: gt('count', 0),
  count: 0,

  _startObserving() {
    this.opts.start.call(this.owner, this);
  },

  _stopObserving() {
    this.opts.stop.call(this.owner, this);
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