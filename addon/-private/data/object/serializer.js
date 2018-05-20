import Serializer from '../internal/serializer';
import { map } from '../internal/util';
import { toModel } from '../internal/util';
import { typeOf } from '@ember/utils';
// import { A } from '@ember/array';

export default Serializer.extend({

  supports(value) {
    return typeOf(value) === 'object';
  },

  createInternal(props) {
    let internal = this.factoryFor('zuglet:data/object/internal').create({ serializer: this });

    return internal;
  },

  createInternals(props) {
    let manager = this.manager;
    return map(props, (key, value) => manager.createInternal(value));
  },

  // internalReplacePristine(internal, values) {
  //   let pristine = internal.content.pristine;
  //   let remove = A(Object.keys(values));

  //   map(values, (key, value) => {
  //     remove.removeObject(key);
  //     pristine[key] = value;
  //   });

  //   remove.map(key => {
  //     delete pristine[key];
  //   });
  // },

  // update(internal, values, type) {
  //   let pristine = internal.content.pristine;
  //   let remove = A(Object.keys(pristine));

  //   map(values, (key, value) => {
  //     remove.removeObject(key);
  //     let current = pristine[key];
  //     if(current && current.matches(value)) {
  //       let updated = current.update(value, type);
  //       if(updated.replace) {
  //         pristine[key] = updated.internal;
  //       }
  //     } else {
  //       let internal = this.manager.createInternal(value, type);
  //       pristine[key] = internal;
  //     }
  //   });

  //   remove.forEach(key => {
  //     delete pristine[key];
  //   });

  //   return {
  //     replace: false,
  //     internal
  //   };
  // },

  // setModelValueForKey(internal, key, value, type, changed) {
  //   value = this.manager.createInternal(value, type);

  //   let values = internal.content.values;
  //   let current = values[key];

  //   if(current) {
  //     current.detach();
  //   }

  //   if(value) {
  //     value.attach(internal);
  //     values[key] = value;
  //   } else {
  //     delete values[key];
  //   }

  //   changed(key);
  // },

  // fetch(internal, changed) {
  //   let { pristine, values } = internal.content;
  //   let remove = A(Object.keys(values));

  //   map(pristine, (key, value) => {
  //     remove.removeObject(key);
  //     value.attach(internal);
  //     value.fetch();
  //     values[key] = value;
  //     changed(key);
  //   });

  //   remove.map(key => {
  //     let value = values[key];
  //     value.detach();
  //     delete values[key];
  //     changed(key);
  //   });
  // },

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
  }

});
