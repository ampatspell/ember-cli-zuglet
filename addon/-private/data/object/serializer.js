import Serializer from '../internal/serializer';
import { map } from '../internal/util';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

export default Serializer.extend({

  supports(value) {
    return typeOf(value) === 'object';
  },

  createInternals(props, type) {
    let manager = this.manager;
    return map(props, (key, value) => manager.createInternal(value, type));
  },

  internalReplacePristine(internal, values) {
    let pristine = internal.content.pristine;
    let remove = A(Object.keys(values));

    map(values, (key, value) => {
      remove.removeObject(key);
      pristine[key] = value;
    });

    remove.map(key => {
      delete pristine[key];
    });
  },

  fetch(internal, changed) {
    let { pristine, values } = internal.content;

    map(values, (key, value) => {
      delete values[key];
      value.detach();
      changed(key);
    });

    map(pristine, (key, value) => {
      values[key] = value;
      value.attach(internal);
      value.fetch();
      changed(key);
    });
  },

  update(internal, values, type) {
    let pristine = internal.content.pristine;
    let remove = A(Object.keys(pristine));

    map(values, (key, value) => {
      remove.removeObject(key);
      let current = pristine[key];
      if(current && current.matches(value)) {
        let updated = current.update(value, type);
        if(updated.replace) {
          pristine[key] = updated.internal;
        }
      } else {
        let internal = this.manager.createInternal(value, type);
        pristine[key] = internal;
      }
    });

    remove.forEach(key => {
      delete pristine[key];
    });

    return {
      replace: false,
      internal
    };
  },

  setModelValueForKey(internal, key, value, type, changed) {
    value = this.manager.createInternal(value, type);

    let values = internal.content.values;
    let current = values[key];

    if(current) {
      current.detach();
    }

    if(value) {
      value.attach(internal);
      values[key] = value;
    } else {
      delete values[key];
    }

    changed(key);
  },

  rollback(internal, changed) {
    let { pristine, values } = internal.content;
    let remove = A(Object.keys(values));

    map(pristine, (key, value) => {
      remove.removeObject(key);
      value.attach(internal);
      values[key] = value;
      changed(key);
    });

    remove.map(key => {
      let value = values[key];
      value.detach();
      delete values[key];
      changed(key);
    });
  },

  createInternal(props, type) {
    let internal = this.factoryFor('zuglet:data/object/internal').create({ serializer: this });
    let values = this.createInternals(props, type);
    internal.withPropertyChanges(false, changed => {
      this.internalReplacePristine(internal, values);
      this.fetch(internal, changed);
    });
    return internal;
  },

  serialize(internal, type) {
    return map(internal.content.values, (key, value) => {
      return value.serialize(type);
    });
  }

});
