import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';

export default EmberObject.extend({

  parent: null,

  operations: computed(function() {
    return A();
  }).readOnly(),

  createInvocableOperation(opts) {
    let owner = this.get('owner');
    return getOwner(this).factoryFor('zuglet:queue/operation/invocable').create({ queue: this, owner, opts });
  },

  createPromiseOperation(opts) {
    let owner = this.get('owner');
    return getOwner(this).factoryFor('zuglet:queue/operation/promise').create({ queue: this, owner, opts });
  },

  reuse(opts) {
    let operations = this.get('operations');
    if(opts.reuse) {
      return opts.reuse(operations);
    }
  },

  register(operation) {
    let operations = this.get('operations');
    operations.pushObject(operation);
    operation.get('promise').catch(() => {}).finally(() => {
      operations.removeObject(operation);
    });

    let parent = this.get('parent');
    if(parent) {
      parent.register(operation);
    }
  },

  schedule(opts) {
    if(this.isDestroying) {
      return;
    }

    let operation = this.reuse(opts);

    if(!operation) {
      if(opts.promise) {
        operation = this.createPromiseOperation(opts);
      } else {
        operation = this.createInvocableOperation(opts);
      }
    }

    this.register(operation);
    this.didCreateOperation(operation);

    return operation.get('promise');
  },

  promises() {
    return this.get('operations').mapBy('promise');
  },

  willDestroy() {
    this.get('operations').forEach(operation => operation.destroy());
    this._super(...arguments);
  }

});
