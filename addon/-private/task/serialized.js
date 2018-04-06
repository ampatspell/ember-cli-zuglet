import EmberObject, { computed } from '@ember/object';
import { resolve, reject } from 'rsvp';

export default EmberObject.extend({

  owner: null,
  opts: null,

  _invokePerform() {
    return this.opts.perform.call(this.owner);
  },

  _didResolve(res) {
    return this.opts.didResolve.call(this.owner, res);
  },

  _didReject(err) {
    return this.opts.didReject.call(this.owner, err);
  },

  perform() {
    let promise = this._promise;

    if(promise) {
      return promise;
    }

    if(this.isDestroying) {
      return;
    }

    promise = resolve(this._invokePerform()).then(res => {
      if(this.isDestroying) {
        return;
      }
      return this._didResolve(res);
    }, err => {
      if(this.isDestroying) {
        return;
      }
      return this._didReject(err);
    });

    this._promise = promise.catch(() => {}).finally(() => {
      if(this.isDestroying) {
        return;
      }
      this._promise = null;
      this.notifyPropertyChange('promise');
    });

    return promise;
  },

  promise: computed(function() {
    return this.perform();
  })

});
