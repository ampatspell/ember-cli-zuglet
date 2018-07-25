import Internal from '../../internal/internal';
import { computed } from '@ember/object';

const hack = functions => {
  // https://github.com/firebase/firebase-js-sdk/issues/630
  if(!functions.INTERNAL) {
    functions.INTERNAL = {
      delete() {}
    };
  }
  return functions;
};

export default Internal.extend({

  store: null,
  region: null,

  factoryFor(name) {
    return this.store.factoryFor(name);
  },

  functions: computed('region', function() {
    let region = this.get('region');
    return hack(this.store.app.functions(region));
  }).readOnly(),

  createModel() {
    return this.factoryFor('zuglet:functions').create({ _internal: this });
  },

  createCallableInternalForCallable(name, callable) {
    return this.factoryFor('zuglet:functions/callable/internal').create({ functions: this, name, callable });
  },

  createCallable(name) {
    return this.get('functions').httpsCallable(name);
  },

  callable(name) {
    let callable = this.createCallable(name);
    return this.createCallableInternalForCallable(name, callable);
  }

});
