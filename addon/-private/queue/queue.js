import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';

export default EmberObject.extend({

  parent: null,

  operations: computed(function() {
    return A();
  }).readOnly(),

  createOperation(opts) {
    let owner = this.get('owner');
    return getOwner(this).factoryFor('zuglet:queue/operation').create({ queue: this, owner, opts });
  },

  reuse(opts) {
    let operations = this.get('operations');
    if(opts.reuse) {
      return opts.reuse(operations);
    }
  },

  didCreateOperation(operation) {
    let parent = this.get('parent');
    if(parent) {
      parent.register(operation);
    }
  },

  register(operation) {
    let operations = this.get('operations');
    operations.pushObject(operation);
    operation.get('promise').catch(() => {}).finally(() => {
      operations.removeObject(operation);
    });
  },

  schedule(opts) {
    if(this.isDestroying) {
      return;
    }

    let operation = this.reuse(opts);
    if(!operation) {
      operation = this.createOperation(opts);
      this.register(operation);
      this.didCreateOperation(operation);
    }

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
