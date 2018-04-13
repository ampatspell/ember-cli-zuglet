import Serializer from '../internal/serializer';
import { map } from '../internal/util';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

export default Serializer.extend({

  createInternal() {
    return this.factoryFor('zuglet:data/object/internal').create({ serializer: this });
  },

  supports(value) {
    return typeOf(value) === 'object';
  },

  //

  internalReplaceKey(internal, key, value, changed) {
    let { values } = internal.content;

    let current = values[key];

    if(current === value) {
      return;
    }

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

  internalReplaceAll(internal, hash, changed) {
    let { values } = internal.content;

    let remove = A(Object.keys(values));

    map(hash, (key, value) => {
      remove.removeObject(key);
      this.internalReplaceKey(internal, key, value, changed);
    });

    remove.map(key => {
      this.internalReplaceKey(internal, key, undefined, changed);
    });
  },

  replaceKey(internal, key, value, type, changed) {
    value = this.manager.deserialize(value, type);
    return this.internalReplaceKey(internal, key, value, changed);
  },

  //

  checkpoint(internal) {
    let { pristine, values } = internal.content;

    map(pristine, (key, value) => {
      value.detach();
      delete pristine[key];
    });

    map(values, (key, value) => {
      value.attach(internal);
      pristine[key] = value;
      value.checkpoint();
    });
  },

  rollback(internal, changed) {
    let { pristine, values } = internal.content;

    map(values, (key, value) => {
      value.detach();
      delete values[key];
      changed(key);
    });

    map(pristine, (key, value) => {
      value.attach(internal);
      values[key] = value;
      changed(key);
      value.rollback();
    });
  },

  toInternals(props, type) {
    let manager = this.manager;
    return map(props, (key, value) => manager.deserialize(value, type));
  },

  deserialize(props, type) {
    let internal = this.createInternal();
    let values = this.toInternals(props, type);
    internal.withPropertyChanges(false, changed => {
      this.internalReplaceAll(internal, values, changed);
      this.checkpoint(internal, changed);
    });
    return internal;
  },

  serialize(internal, type) {
    return map(internal.content.values, (key, value) => {
      return value.serialize(type);
    });
  },

  update(internal, props, type, changed) {
    let values = internal.content.values;
    let remove = A(Object.keys(values));

    map(props, (key, value) => {
      remove.removeObject(key);
      let current = values[key];
      if(current && current.matches(value)) {
        let updated = current.update(value, type);
        if(updated.replace) {
          this.internalReplaceKey(internal, key, updated.internal, changed);
        }
      } else {
        this.replaceKey(internal, key, value, type, changed);
      }
    });

    remove.forEach(key => {
      this.internalReplaceKey(internal, key, undefined, changed);
    });

    this.checkpoint(internal);

    return {
      replace: false,
      internal
    };
  },

  createNewInternal(props) {
    return this.deserialize(props, 'model');
  },

});
