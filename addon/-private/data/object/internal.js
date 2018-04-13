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
      let internal = this.serializer.replaceKey(this, key, value, 'model', changed);
      return toModel(internal);
    });
  },

  checkpoint() {
    this.withPropertyChanges(true, changed => {
      this.serializer.checkpoint(this, changed);
    });
  },

  rollback() {
    this.withPropertyChanges(true, changed => {
      this.serializer.rollback(this, changed);
    });
  }

});
