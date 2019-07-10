import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { defer, resolve, reject } from 'rsvp';
import { assert } from '@ember/debug';
import { operationDestroyedError } from '../../util/errors';

export default EmberObject.extend({

  queue: null,
  owner: null,
  opts: null,

  isInvoked: false,

  deferred: computed(function() {
    return defer();
  }),

  name: readOnly('opts.name'),
  promise: readOnly('deferred.promise'),

  invoke() {
    let deferred = this.get('deferred');
    let promise = deferred.promise;

    if(this.isDestroying) {
      deferred.reject(operationDestroyedError());
      return promise;
    }

    assert(`operation is already invoked`, !this.get('isInvoked'));
    this.set('isInvoked', true);

    let opts = this.get('opts');

    resolve().then(() => opts.invoke()).then(arg => {
      if(this.isDestroying) {
        return;
      }
      return opts.didResolve ? opts.didResolve(arg) : arg;
    }, err => {
      if(this.isDestroying) {
        return reject(err);
      }
      return opts.didReject ? opts.didReject(err) : reject(err);
    }).then(arg => {
      return deferred.resolve(arg);
    }, err => {
      return deferred.reject(err);
    });

    return promise;
  }

});
