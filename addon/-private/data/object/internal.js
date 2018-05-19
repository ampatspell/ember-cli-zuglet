import Internal from '../internal/internal';
import { toModel } from '../internal/util';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.content = {
      pristine: Object.create(null),
      values:   Object.create(null)
    };
  },

  createModel() {
    return this.factoryFor('zuglet:data/object').create({ _internal: this });
  },

  getModelValue(key) {
    let value = this.content.values[key];
    return toModel(value);
  },

  setModelValue(key, value) {
    return this.withPropertyChanges(true, changed => {
      let internal = this.serializer.setModelValueForKey(this, key, value, 'model', changed);
      return toModel(internal);
    });
  },

  fetch() {
    return this.withPropertyChanges(true, changed => {
      return this.serializer.fetch(this, changed);
    });
  },

  _isDirty() {
    let source = this.content.pristine;
    let target = this.content.values;

    let sourceKeys = Object.keys(source);
    let targetKeys = Object.keys(target);

    if(sourceKeys.length !== targetKeys.length) {
      return true;
    }

    for(let key of sourceKeys) {
      let sourceValue = source[key];
      let targetValue = target[key];
      if(!targetValue || targetValue._isDirty(sourceValue)) {
        return true;
      }
    }

    return false;
  }

});
