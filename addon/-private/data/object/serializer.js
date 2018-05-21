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

  createInternal(props) {
    let internal = this.factoryFor('zuglet:data/object/internal').create({ serializer: this });

    return internal;
  },

  createInternals(props) {
    let manager = this.manager;
    return map(props, (key, value) => manager.createInternal(value));
  },

  // createInternal(props, type) {
  //   let internal = this.factoryFor('zuglet:data/object/internal').create({ serializer: this });
  //   let values = this.createInternals(props, type);
  //   internal.withPropertyChanges(false, changed => {
  //     this.internalReplacePristine(internal, values);
  //     this.fetch(internal, changed);
  //   });
  //   return internal;
  // },

  getModelValue(internal, key) {
    let value = internal.content[key];
    return toModel(value);
  },

  setModelValue(internal, key, value) {
    return internal.withPropertyChanges(true, changed => {
      value = this.manager.createInternal(value);

      let content = internal.content;
      let current = content[key];

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

  deserialize(internal, values={}) {
    let content = internal.content;
    let remove = A(Object.keys(content));
    let manager = this.manager;

    internal.withPropertyChanges(true, changed => {
      map(values, (key, value) => {
        remove.removeObject(key);
        let current = content[key];
        if(current && current.serializer.matches(value)) {
          let updated = current.serializer.deserialize(current, value);
          if(updated.replace) {
            content[key] = updated.internal;
            changed(key);
          }
        } else {
          let internal = manager.createInternal(value);
          content[key] = internal;
          changed(key);
        }
      });

      remove.forEach(key => {
        delete content[key];
        changed(key);
      });
    });

    return {
      replace: false,
      internal
    };
  },

  commit(internal, data={}) {
    this.set('raw', data);
    this.deserialize(internal, data);
  },

  rollback(internal) {
    let data = this.get('raw');
    if(!data) {
      return;
    }
    this.deserialize(internal, data);
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
      let value = raw[key];
      if(!internal.isEqual(value)) {
        return false;
      }
    }

    return false;
  }

});
