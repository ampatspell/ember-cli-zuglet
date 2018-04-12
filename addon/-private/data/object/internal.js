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
    let content = this.content;
    let value = content.pristine[key];
    if(!value) {
      value = content.values[key];
    }
    return toModel(value);
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
    let current = this.content.values[key];

    if(current === value) {
      return;
    }

    if(current) {
      current.detach();
    }

    if(value) {
      value.attach(this);
    }

    this.content.values[key] = value;
  },

  checkpoint() {
    let { pristine, values } = this.content;

    for(let key in pristine) {
      if(!values[key]) {
        pristine[key].detach();
        delete pristine[key];
      }
    }

    for(let key in values) {
      let value = values[key];
      let prev = pristine[key];
      if(value !== prev) {
        if(prev) {
          prev.detach();
        }
        pristine[key] = value;
      }
      delete values[key];
    }
  }

});
