import Internal from '../internal/internal';
import { isInternal, toModel } from '../internal/util';
import { get } from '@ember/object';
import { A } from '@ember/array';

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.content = {
      values: A()
    };
  },

  createModel() {
    return this.factoryFor('zuglet:data/array').create({ _internal: this });
  },

  getModelValue(idx) {
    let internal = this.content.values.objectAt(idx);
    if(!internal) {
      return;
    }
    return internal.model(true);
  },

  replaceModelValues(idx, amt, values) {
    let internals = A(values).map(value => this.toInternal(value));
    this.replace(idx, amt, internals);
  },

  replace(idx, amt, internals) {
    let model = this.model(false);
    let values = this.content.values;

    let len = get(internals, 'length');

    if(model) {
      model.arrayContentWillChange(idx, amt, len);
    }

    values.replace(idx, amt, internals);

    if(model) {
      model.arrayContentDidChange(0, amt, len);
    }
  },

  checkpoint() {
  },

});
