import Internal from '../internal/internal';
import { isInternal, toModel } from '../internal/util';
import { get } from '@ember/object';
import { A } from '@ember/array';

const indexes = (idx, amt) => {
  let values = [];
  for(let i = 0; i < amt; i++) {
    values.push(idx + i);
  }
  return values;
}

export default Internal.extend({

  init() {
    this._super(...arguments);
    this.content = {
      pristine: null,
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

  didUpdate() {
    this.withPropertyChanges(true, changed => changed('serialized'));
    this.notifyDidUpdate();
  },

  replace(idx, amt, internals) {
    let model = this.model(false);
    let values = this.content.values;

    let len = get(internals, 'length');

    if(model) {
      model.arrayContentWillChange(idx, amt, len);
    }

    values.objectsAt(indexes(idx, amt)).map(internal => internal.detach(this));

    values.replace(idx, amt, internals);

    internals.map(internal => internal.attach(this));

    if(model) {
      model.arrayContentDidChange(0, amt, len);
    }

    if(amt > 0 || len > 0) {
      this.didUpdate();
    }
  },

  checkpoint() {
    console.log('array.checkpoint');
  },

  serialize(type) {
    return this.content.values.map(internal => {
      return internal.serialize(type);
    });
  }

});
