import Serializer from '../internal/serializer';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

const indexes = (idx, amt) => {
  let values = [];
  for(let i = 0; i < amt; i++) {
    values.push(idx + i);
  }
  return values;
};

export default Serializer.extend({

  createInternal() {
    return this.factoryFor('zuglet:data/array/internal').create({ serializer: this });
  },

  supports(value) {
    return typeOf(value) === 'array';
  },

  toInternals(array, type) {
    let manager = this.manager;
    return A(A(array).map(value => manager.deserialize(value, type)));
  },

  internalReplace(internal, idx, amt, array) {
    let { values } = internal.content;
    let removing = values.objectsAt(indexes(idx, amt));
    removing.forEach(item => item.detach());
    array.forEach(item => item.attach(internal));
    values.replace(idx, amt, array);
  },

  replace(internal, idx, amt, values, type, changed) {
    let internals = this.toInternals(values, type);
    this.internalReplace(internal, idx, amt, internals, changed);
  },

  internalCheckpoint(internal) {
    let { pristine, values } = internal.content;
    pristine.map(item => item.detach());
    values.map(item => item.attach(internal));
    pristine.clear();
    pristine.addObjects(values);
    values.forEach(item => item.checkpoint());
  },

  checkpoint(internal, build) {
    build(0, 0, 0, changed => {
      this.internalCheckpoint(internal, changed);
    });
  },

  rollback(internal, build) {
    let { pristine, values } = internal.content;
    let oldLen = values.get('length');
    let newLen = pristine.get('length');
    return build(0, oldLen, newLen, changed => {
      this.internalReplace(internal, 0, oldLen, pristine, changed);
      values.forEach(item => item.rollback());
    });
  },

  serialize(internal, type) {
    return internal.content.values.map(value => value.serialize(type));
  },

  deserialize(values, type) {
    let internal = this.createInternal();
    return internal.withArrayContentChanges(true, build => {
      let internals = this.toInternals(values, type);
      let len = internals.get('length');
      return build(0, 0, len, changed => {
        this.internalReplace(internal, 0, 0, internals, changed);
        this.internalCheckpoint(internal, changed);
        return internal;
      });
    });
  },

  update(internal, array, type, build) {
    array = A(array);
    let values = internal.content.values;

    let remaining = A(values.copy());
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
        internal = this.manager.deserialize(item, type);
      }
      return internal;
    }));

    let oldLen = values.get('length');
    let newLen = internals.get('length');

    return build(0, oldLen, newLen, changed => {
      this.internalReplace(internal, 0, oldLen, internals);
      this.internalCheckpoint(internal, changed);
      return {
        replace: false,
        internal
      };
    });
  },

  //

  createNewInternal(values) {
    return this.deserialize(values, 'model');
  }

});
