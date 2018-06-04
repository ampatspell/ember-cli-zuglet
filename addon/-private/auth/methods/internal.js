import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export const types = A([
  'anonymous',
  'email'
]);

export default Internal.extend({

  auth: null,

  factoryFor(name) {
    return this.auth.factoryFor(name);
  },

  types: computed(function() {
    return A(types.slice());
  }).readOnly(),

  methods: computed(function() {
    return Object.create(null);
  }).readOnly(),

  createModel() {
    return this.auth.factoryFor('zuglet:auth/methods').create({ _internal: this });
  },

  createInternalMethod(type) {
    return this.auth.factoryFor(`zuglet:auth/method/${type}/internal`).create({ methods: this, type });
  },

  method(name) {
    if(!types.includes(name)) {
      return;
    }
    let methods = this.get('methods');
    let method = methods[name];
    if(!method) {
      method = this.createInternalMethod(name);
      methods[name] = method;
    }
    return method;
  }

});
