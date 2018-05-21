import Internal from '../internal/internal';
import { A } from '@ember/array';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.content = A();
  },

  createModel() {
    return this.factoryFor('zuglet:data/array').create({ _internal: this });
  },

  getModelValue(idx) {
    return this.serializer.getModelValue(this, idx);
  },

  replaceModelValues(idx, amt, values) {
    return this.serializer.replaceModelValues(this, idx, amt, values);
  },

  withArrayContentChanges(notify, cb) {
    return this.withPropertyChanges(notify, changed => {
      let builder = (idx, amt, len, runtime) => {
        let model = this.model(false);

        if(model) {
          model.arrayContentWillChange(idx, amt, len);
        }

        let result = runtime(changed);

        if(model) {
          model.arrayContentDidChange(idx, amt, len);
        }

        if(amt > 0 || len > 0) {
          changed();
        }

        return result;
      }
      return cb(builder);
    });
  }

});
