import Serializer from '../internal/serializer';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';
import { toModel } from '../internal/util';

const isArray = value => typeOf(value) === 'array';

export default Serializer.extend({

  supports(value) {
    return isArray(value);
  },

  matches(internal, value) {
    return isArray(value);
  },

  createInternal(props) {
    let internal = this.factoryFor('zuglet:data/array/internal').create({ serializer: this });
    this.deserialize(internal, props);
    return internal;
  },

  deserialize(internal, array) {
    array = A(array);

    let manager = this.manager;
    let content = internal.content;
    let remaining = A(content.slice());

    const reusable = item => {
      let found = remaining.find(value => value.serializer.matches(value, item));
      if(found) {
        remaining.removeObject(found);
      }
      return found;
    }

    let internals = A(array.map(item => {
      let nested = reusable(item);
      if(nested) {
        let result = nested.serializer.deserialize(nested, item);
        nested = result.internal;
      } else {
        nested = manager.createInternal(item);
      }
      if(nested) {
        nested.attach(internal);
      }
      return nested;
    }));

    let addAmt = internals.get('length');
    let removeAmt = content.get('length');

    remaining.map(item => item.detach());

    internal.withArrayContentChanges(true, builder => builder(0, addAmt, removeAmt, () => {
      content.replace(0, removeAmt, internals);
    }));

    return {
      replace: false,
      internal
    };
  },

  getModelValue(internal, idx) {
    internal = internal.content.objectAt(idx);
    return toModel(internal);
  },

  replaceModelValues(internal, idx, removeAmt, array) {
    let manager = this.manager;
    let content = internal.content;
    let addAmt = A(array).get('length');

    internal.withArrayContentChanges(true, builder => builder(idx, addAmt, removeAmt, () => {
      let removing = content.slice(idx, removeAmt);
      removing.map(item => item.detach());

      let adding = array.map(item => {
        let created = manager.createInternal(item);
        if(created) {
          created.attach(internal);
        }
        return created;
      });

      content.replace(idx, removeAmt, adding);
    }));
  },

  serialize(internal, type) {
    return internal.content.map(value => value.serialize(type));
  },

  isDirty(internal, value) {
    let values = internal.content;

    value = A(value);

    if(values.get('length') !== value.get('length')) {
      return true;
    }

    return values.find((internal, idx) => internal.serializer.isDirty(internal, value.objectAt(idx)));
  }

});
