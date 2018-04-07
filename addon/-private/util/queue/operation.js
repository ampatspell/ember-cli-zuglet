import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { defer, resolve, reject } from 'rsvp';

export default EmberObject.extend({

  queue: null,
  owner: null,
  opts: null,

  deferred: computed(function() {
    return defer();
  }),

  name: readOnly('opts.name'),
  promise: readOnly('deferred.promise'),

  invoke() {
    let opts = this.get('opts');

    let deferred = this.get('deferred');

    if(this.isDestroying) {
      deferred.reject(new Error('Queue is destroyed'));
      return deferred.promise;
    }

    resolve().then(() => {
      return opts.invoke();
    }).then(arg => {
      if(this.isDestroying) {
        return;
      }
      return opts.didResolve(arg);
    }, err => {
      if(this.isDestroying) {
        return reject(err);
      }
      return opts.didReject(err);
    }).then(arg => {
      return deferred.resolve(arg);
    }, err => {
      return deferred.reject(err);
    });

    return deferred.promise;
  }

});
