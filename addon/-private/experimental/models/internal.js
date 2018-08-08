import { getOwner } from '@ember/application';
import Internal from '../../internal/internal';
import PropertyObserver from './utils/property-observer';
import ArrayObserver from './utils/array-observer';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import { typeOf } from '@ember/utils';
import generateModelClass from '../../util/generate-model-class';
import { assert } from '@ember/debug';

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

  modelFactoryForObject(object) {
    let { owner, opts: { key, factory } } = this.getProperties('owner', 'opts');

    if(typeof factory === 'function') {
      factory = factory(object);
    }

    let type = typeOf(factory);

    if(type === 'string') {
      let proxy = this.factoryFor(`model:${factory}`);
      assert(`model '${factory}' is not registered`, !!proxy);
      return proxy;
    } else if(type === 'object') {
      return generateModelClass(owner, key, factory);
    }
  },

  resolveMappingForObject(object) {
    let mapping = this.get('opts.mapping');
    if(mapping) {
      return mapping(object);
    }
    return object;
  },

  //

  updateModelForObject(model, object) {
    console.log('update', model);
    return model;
  },

  prepareModelForObject(model, object) {
    let arg = this.resolveMappingForObject(object);
    model.prepare(arg);
    return model;
  },

  createModelForObject(object) {
    let factory = this.modelFactoryForObject(object);
    let model = factory.create();
    return this.prepareModelForObject(model, object);
  },

  //

  sourceDidChange(value) {
    this.get('array').update(value);
  },

  didInsertObjects(objects, start) {
    let array = this.get('models');
    let models = objects.map(object => this.createModelForObject(object));
    array.replace(start, 0, models);
  },

  didRemoveObjects(object, start) {
    let array = this.get('models');
    let len = object.get('length');
    let models = array.slice(start, len);
    array.replace(start, len);
    models.map(model => model.destroy());
  },

  didUpdateObject(object, key, index) {
    let array = this.get('models');
    let current = array.objectAt(index);
    let model = this.updateModelForObject(current, object);
    if(model !== current) {
      array.replace(index, 1, [ model ]);
      if(current) {
        current.destroy();
      }
    }
  },

  //

  willDestroy() {
    this._super(...arguments);
    this.array.destroy();
    this.source.destroy();
  }

});
