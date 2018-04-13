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

  fetch(internal, builder) {
    let { pristine, values } = internal.content;
    let oldLen = values.get('length');
    let newLen = pristine.get('length');
    return builder(0, oldLen, newLen, () => {
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
    builder(idx, amt, len, () => {
      let removing = values.slice(idx, amt);
      removing.map(item => item.detach());

      let adding = this.createInternals(array, type);
      adding.map(item => item.attach(internal));

      values.replace(idx, amt, adding);
    });
  },

  update(internal, array, type) {
    let pristine = internal.content.pristine;

    let remaining = A(pristine.copy());
    const reusable = item => {
      let found = remaining.find(value => value.matches(item));
      if(found) {
        remaining.removeObject(found);
      }
      return found;
    };

    let internals = A(array.map(item => {
      let internal = reusable(item);
      if(internal) {
        let result = internal.update(item, type);
        internal = result.internal;
      } else {
        internal = this.manager.createInternal(item, type);
      }
      return internal;
    }));

    this.internalReplacePristine(internal, internals);

    return {
      replace: false,
      internal
    };
  },

  serialize(internal, type) {
    return internal.content.values.map(value => value.serialize(type));
  }

});
