import Queue from './queue';
import { assert } from '@ember/debug';

export default Queue.extend({

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
      // assert('first operation must be operation in scope', operations.get('firstObject') === operation);
      // operations.shiftObject();
      this.set('running', null);
      this.next();
    });
  },

  didCreateOperation() {
    this.next();
    this._super(...arguments);
  }

});
