import Internal from '../internal/internal';
import { toInternal, isInternal, toModel } from '../internal/util';
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

  replaceModelValues(idx, amt, objects) {
    console.log('replaceModelValues', idx, amt, objects);
  },

  replace(internals) {
    let model = this.model(false);

    let values = this.content.values;

    let remove = values.get('length');
    let add = internals.length;

    if(model) {
      model.arrayContentWillChange(0, remove, add);
    }

    values.clear();
    values.addObjects(internals);

    if(model) {
      model.arrayContentDidChange(0, remove, add);
    }
  },

  checkpoint() {
  },

});
