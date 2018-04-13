import Internal from '../internal/internal';
import { A } from '@ember/array';
import { toModel } from '../internal/util';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.content = {
      pristine: A(),
      values: A()
    };
  },

  createModel() {
    return this.factoryFor('zuglet:data/array').create({ _internal: this });
  },

  getModelValue(idx) {
    let internal = this.content.values.objectAt(idx);
    return toModel(internal);
  },

  replaceModelValues(idx, amt, values) {
    this.withArrayContentChanges(true, builder => {
      let len = A(values).get('length');
      builder(idx, amt, len, changed => {
        this.serializer.replace(this, idx, amt, values, 'model', changed);
      });
    });
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
  },

  checkpoint() {
    this.withArrayContentChanges(true, build => {
      this.serializer.checkpoint(this, build);
    });
  },

  rollback() {
    this.withArrayContentChanges(true, build => {
      this.serializer.rollback(this, build);
    });
  }

});
