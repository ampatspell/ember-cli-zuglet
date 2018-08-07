import { getOwner } from '@ember/application';
import Internal from '../../internal/internal';
import PropertyObserver from './utils/property-observer';
import ArrayObserver from './utils/array-observer';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Internal.extend({

  owner: null,
  opts: null,

  init() {
    this._super(...arguments);

    let { owner, opts } = this.getProperties('owner', 'opts');

    this.source = new PropertyObserver(owner, opts.source, {
      didChange: value => this.sourceDidChange(value)
    });

    this.array = new ArrayObserver(this.source.value, opts.dependencies, {
      didInsert: (objects, start) => this.didInsertObjects(objects, start),
      didRemove: (objects, start) => this.didRemoveObjects(objects, start),
      didUpdate: (object, key, index) => this.didUpdateObject(object, key, index)
    });
  },

  models: computed(function() {
    return A();
  }),

  factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  createModel() {
    let content = this.get('models');
    return this.factoryFor('zuglet:computed/models').create({ _internal: this, content });
  },

  //

  sourceDidChange(value) {
    this.get('array').update(value);
  },

  didInsertObjects(objects, start) {
    let models = this.get('models');
    models.replace(start, 0, objects);
  },

  didRemoveObjects(object, start) {
    let models = this.get('models');
    models.replace(start, object.get('length'));
  },

  didUpdateObject(object, key, index) {
    console.log('didUpdate', index, object+'', key);
  },

  //

  willDestroy() {
    this._super(...arguments);
    this.array.destroy();
    this.source.destroy();
  }

});
