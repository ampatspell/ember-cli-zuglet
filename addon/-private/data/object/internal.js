import Internal from '../internal/internal';
import { toInternal, isInternal, toModel } from '../internal/util';

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
    return toModel(this.content.values[key]);
  },

  setModelValue(key, value) {
    let internal = toInternal(value);

    if(isInternal(internal)) {
      if(internal.isAttached()) {
        throw new Error('not implemented');
      }
    } else {
      internal = this.manager.deserialize(value, 'model');
    }

    this.update(key, internal);

    return toModel(internal);
  },

  update(key, value) {
    value.attach(this);
    this.content.values[key] = value;
  }

});
