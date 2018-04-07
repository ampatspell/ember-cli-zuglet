import EmberObject, { computed } from '@ember/object';
import EmberError from '@ember/error';
import { readOnly } from '@ember/object/computed';
import { defer, resolve, reject } from 'rsvp';
import { assert } from '@ember/debug';

const destroyedError = () => {
  let err = new EmberError('operation is destroyed');
  err.code = 'zuglet/operation/destroyed';
  return err;
};

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
      deferred.reject(destroyedError());
      return promise;
    }

    assert(`operation is already invoked`, !this.get('isInvoked'));
    this.set('isInvoked', true);

    let opts = this.get('opts');

    resolve(opts.invoke()).then(arg => {
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

    return promise;
  }

});
