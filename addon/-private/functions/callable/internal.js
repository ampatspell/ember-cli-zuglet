import Internal from '../../internal/internal';
import queue from '../../queue/computed';

export default Internal.extend({

  functions: null,
  name: null,
  callable: null,

  queue: queue('serialized', 'functions.store.queue'),

  createModel() {
    return this.functions.factoryFor('zuglet:functions/callable').create({ _internal: this });
  },

  call(opts) {
    return this.get('queue').schedule({
      name: 'functions/callable',
      invoke: () => this.callable(opts)
    });
  }

});
