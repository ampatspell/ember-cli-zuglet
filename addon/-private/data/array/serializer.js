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
    let remaining = A(content.copy());

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
        nested.attach(internal);
      }
      return nested;
    }));

    let adding = internals.get('length');
    let removing = remaining.get('length');

    remaining.map(item => item.detach());

    internal.withArrayContentChanges(true, builder => builder(0, adding, removing, () => {
      let len = content.get('length');
      content.replace(0, len, internals);
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

  replaceModelValues(internal, idx, amt, array) {
    let manager = this.manager;
    let content = internal.content;
    let len = A(array).get('length');

    internal.withArrayContentChanges(true, builder => builder(idx, amt, len, () => {
      let removing = content.slice(idx, amt);
      removing.map(item => item.detach());

      let adding = array.map(item => {
        let nested = manager.createInternal(item);
        nested.attach(internal);
        return nested;
      });

      content.replace(idx, amt, adding);
    }));
  },

  serialize(internal, type) {
    return internal.content.map(value => value.serialize(type));
  }

});
