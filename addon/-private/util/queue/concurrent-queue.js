import Queue from './queue';

export default Queue.extend({

  didCreateOperation(operation) {
    operation.invoke().catch(() => {});
    this._super(...arguments);
  }

});
