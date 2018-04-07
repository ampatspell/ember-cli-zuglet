import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { A } from '@ember/array';
import { assert } from '@ember/debug';

export default EmberObject.extend({

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

  schedule(opts) {
    let operation = this.reuse(opts);
    if(!operation) {
      operation = this.createOperation(opts);
      this.get('operations').pushObject(operation);
      this.next();
    }
    return operation.get('promise');
  },

  next() {
    if(this.isDestroying) {
      return;
    }

    if(this.get('running')) {
      return;
    }

    let operations = this.get('operations');

    let operation = operations.get('firstObject');
    if(!operation) {
      return;
    }

    this.set('running', operation);

    operation.invoke().catch(() => {}).finally(() => {
      assert('running operation must match operation in scope', this.get('running') === operation);
      assert('first operation must be operation in scope', operations.get('firstObject') === operation);
      operations.shiftObject();
      this.set('running', null);
      this.next();
    });
  },

  willDestroy() {
    this.operations.forEach(op => op.destroy());
    super.willDestroy();
  }

});
