import Serializer from '../internal/serializer';
import { map } from '../internal/util';
import { toModel } from '../internal/util';
import { typeOf } from '@ember/utils';
import { A } from '@ember/array';

export default Serializer.extend({

  supports(value) {
    return typeOf(value) === 'object';
  },

  matches(internal, value) {
    return this.supports(value);
  },

  createInternal(props, raw) {
    let internal = this.factoryFor('zuglet:data/object/internal').create({ serializer: this, raw });

    return internal;
  },

  createInternals(props) {
    let manager = this.manager;
    return map(props, (key, value) => manager.createInternal(value));
  },

  getModelValue(internal, key) {
    let value = internal.content[key];
    return toModel(value);
  },

  setModelValue(internal, key, value) {
    return internal.withPropertyChanges(true, changed => {
      let content = internal.content;
      let current = content[key];

      value = this.manager.createInternal(value, current, false);

      if(current) {
        current.detach();
      }

      if(value) {
        value.attach(internal);
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

  deserialize(internal, values={}, commit=false) {
    let content = internal.content;
    let remove = A(Object.keys(content));
    let manager = this.manager;

    internal.withPropertyChanges(true, changed => {
      map(values, (key, value) => {
        remove.removeObject(key);
        let current = content[key];
        if(current && current.serializer.matches(value)) {
          let updated = current.serializer.deserialize(current, value, commit);
          if(updated.replace) {
            content[key] = updated.internal;
            changed(key);
          }
        } else {
          let internal = manager.createInternal(value, current, commit);
          content[key] = internal;
          changed(key);
        }
      });

      remove.forEach(key => {
        delete content[key];
        changed(key);
      });

      if(commit) {
        internal.set('raw', values);
      }
    });

    return {
      replace: false,
      internal
    };
  },

  isDirty(internal) {
    let { raw, content } = internal.getProperties('raw', 'content');

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
      if(internal.get('isDirty')) {
        return true;
      }
    }

    return false;
  }

});
