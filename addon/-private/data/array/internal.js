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
      this.serializer.replaceModelValues(this, idx, amt, values, 'model', builder);
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

  fetch() {
    this.withArrayContentChanges(true, builder => {
      return this.serializer.fetch(this, builder);
    });
  },

  _isDirty() {
    let source = this.content.pristine;
    let target = this.content.values;

    let len = source.get('length');

    if(len !== target.get('length')) {
      return true;
    }

    for(let i = 0; i < len; i++) {
      let sourceValue = source.objectAt(i);
      let targetValue = target.objectAt(i);
      if(!targetValue || targetValue._isDirty(sourceValue)) {
        return true;
      }
    }

    return false;
  }

});
