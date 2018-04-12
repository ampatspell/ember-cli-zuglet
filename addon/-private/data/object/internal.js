import Internal from '../internal/internal';
import { toInternal, isInternal, toModel } from '../internal/util';
import withPropertyChanges from '../../internal/with-property-changes';

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
    withPropertyChanges(this, true, changed => {
      let { pristine, values } = this.content;
      let current = values[key];

      if(current === value) {
        return;
      }

      if(current) {
        let pr = pristine[key];
        if(pr !== current) {
          current.detach();
        }
      }

      if(value) {
        value.attach(this);
        values[key] = value;
      } else {
        delete values[key];
      }

      changed(key);
      changed('serialized');
    });
  },

  // moves all values to pristine
  checkpoint() {
    let { pristine, values } = this.content;

    for(let key in pristine) {
      let pr = pristine[key];
      if(pr && pr !== values[key]) {
        pr.detach();
        delete pristine[key];
      }
    }

    for(let key in values) {
      let value = values[key];
      let pr = pristine[key];
      if(value !== pr) {
        if(pr) {
          pr.detach();
        }
        pristine[key] = value;
      }
    }
  },

  // copies pristine over values
  rollback() {
    withPropertyChanges(this, true, changed => {
      let { pristine, values } = this.content;

      for(let key in values) {
        let value = values[key];
        let pr = pristine[key];
        if(value !== pr) {
          value.detach();
          delete values[key];
        }
      }

      for(let key in pristine) {
        values[key] = pristine[key];
        changed(key);
      }

      if(changed.any) {
        changed('serialized');
      }
    });
  },

  serialize(type) {
    let json = {};
    let values = this.content.values;
    for(let key in values) {
      let value = values[key].serialize(type);
      if(typeof value !== 'undefined') {
        json[key] = value;
      }
    }
    return json;
  }

});
