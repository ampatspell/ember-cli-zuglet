import Serializer from '../internal/serializer';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

export default Serializer.extend({

  supports(value) {
    return typeOf(value) === 'array';
  },

  internalReplacePristine(internal, values) {
    let pristine = internal.content.pristine;
    let oldLen = pristine.get('length');
    pristine.replace(0, oldLen, values);
  },

  fetch(internal, build) {
    let { pristine, values } = internal.content;
    let oldLen = values.get('length');
    let newLen = pristine.get('length');
    return build(0, oldLen, newLen, changed => {
      values.forEach(item => item.detach());
      values.replace(0, oldLen, pristine);
      values.forEach(item => {
        item.attach(internal);
        item.fetch();
      });
    });
  },

  createInternals(array, type) {
    let manager = this.manager;
    return A(array).map(item => manager.createInternal(item, type));
  },

  createInternal(array, type) {
    let internal = this.factoryFor('zuglet:data/array/internal').create({ serializer: this });
    let values = this.createInternals(array, type);
    return internal.withArrayContentChanges(true, build => {
      this.internalReplacePristine(internal, values);
      this.fetch(internal, build);
      return internal;
    });
  },

  replaceModelValues(internal, idx, amt, array, type, builder) {
    let values = internal.content.values;
    let len = A(array).get('length');
    builder(idx, amt, len, changed => {
      let removing = values.slice(idx, amt);
      removing.map(item => item.detach());

      let adding = this.createInternals(array, type);
      adding.map(item => item.attach(internal));

      values.replace(idx, amt, adding);
    });
  },

  serialize(internal, type) {
    return internal.content.values.map(value => value.serialize(type));
  }

});
