import Serializer from '../internal/serializer';
import { map } from '../internal/util';
import { toModel } from '../internal/util';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

const isObject = value => typeOf(value) === 'object';

export default Serializer.extend({

  supports(value) {
    return isObject(value);
  },

  matches(internal, value) {
    return isObject(value);
  },

  createInternal(props) {
    let internal = this.factoryFor('zuglet:data/object/internal').create({ serializer: this });
    this.deserialize(internal, props);
    return internal;
  },

  getModelValue(internal, key) {
    let value = internal.content[key];
    return toModel(value);
  },

  setModelValue(internal, key, value) {
    return internal.withPropertyChanges(true, changed => {
      let content = internal.content;
      let current = content[key];

      value = this.manager.createInternal(value, internal);

      if(current) {
        current.detach();
      }

      if(value) {
        content[key] = value;
      } else {
        delete content[key];
      }

      changed(key);

      return toModel(value);
    });
  },

  serialize(internal, type) {
    return map(internal.content, (key, value) => value.serialize(type));
  },

  deserialize(internal, values={}) {
    let content = internal.content;
    let remove = A(Object.keys(content));
    let manager = this.manager;

    internal.withPropertyChanges(true, changed => {
      map(values, (key, value) => {
        remove.removeObject(key);
        let current = content[key];
        if(current && current.serializer.matches(current, value)) {
          let updated = current.serializer.deserialize(current, value);
          if(updated.replace) {
            content[key] = updated.internal;
            changed(key);
          }
        } else {
          let created = manager.createInternal(value, internal);
          content[key] = created;
          changed(key);
        }
      });

      remove.forEach(key => {
        content[key].detach();
        delete content[key];
        changed(key);
      });
    });

    return {
      replace: false,
      internal
    };
  },

  isDirty(internal, raw) {
    let content = internal.content;

    raw = raw || {};

    let rawKeys = Object.keys(raw);
    let contentKeys = Object.keys(content);

    if(rawKeys.length !== contentKeys.length) {
      return true;
    }

    if(rawKeys.length === 0) {
      return false;
    }

    for(let key of contentKeys) {
      let internal = content[key];
      let value = raw[key];
      if(internal.serializer.isDirty(internal, value)) {
        return true;
      }
    }

    return false;
  }

});
