import { getOwner } from '@ember/application';
import { computed, defineProperty } from '@ember/object';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';
import { A } from '@ember/array';
import Internal from '../../internal/internal';
import generateModelClass from '../../util/geneate-model-class';

const __zuglet_models_raw = '__zuglet_models_raw';

export default Internal.extend({

  owner: null,
  opts: null,

  source: null,
  models: null,

  content: computed(function() {
    return A();
  }),

  init() {
    this._super(...arguments);
    this.createSourceProperty();
    this.createModelsProperty();
  },

  createSourceProperty() {
    let source = this.get('opts.source');
    let path = `owner.${source}`;
    defineProperty(this, 'source', computed(path, function() {
      return A(this.get(path));
    }).readOnly());
  },

  resolveModelsPropertyDependency() {
    let dependencies = this.get('opts.dependencies');
    if(dependencies.length) {
      return `source.@each.{${dependencies.join(',')}}`;
    }
    return `source.[]`;
  },

  createModelsProperty() {
    let dependency = this.resolveModelsPropertyDependency();
    defineProperty(this, 'models', computed(dependency, function() {
      return this.recompute();
    }).readOnly());
  },

  resolveMapping(item) {
    let mapping = this.get('opts.mapping');
    if(mapping) {
      return mapping(item);
    }
    return item;
  },

  prepareModelForItem(model, item) {
    let arg = this.resolveMapping(item);
    model.prepare(arg);
    return model;
  },

  resolveModelFactoryForItem(item) {
    let { owner, opts: { key, factory } } = this.getProperties('owner', 'opts');

    if(typeof factory === 'function') {
      factory = factory(item);
    }

    let type = typeOf(factory);

    if(type === 'string') {
      let proxy = getOwner(this).factoryFor(`model:${factory}`);
      assert(`model '${factory}' is not registered`, !!proxy);
      return proxy;
    } else if(type === 'object') {
      return generateModelClass(owner, key, factory);
    }
  },

  createModelForItem(item) {
    let factory = this.resolveModelFactoryForItem(item);
    let model = factory.create({ [__zuglet_models_raw]: item });
    this.prepareModelForItem(model, item);
    return model;
  },

  recompute() {
    let { source, content } = this.getProperties('source', 'content');

    let remove = A(content.slice());
    let next = A();

    const existing = item => {
      let model = content.findBy(__zuglet_models_raw, item);
      if(model) {
        remove.removeObject(model);
      }
      return model;
    }

    source.forEach(item => {
      let model = existing(item);
      if(model) {
        model = this.prepareModelForItem(model, item);
      } else {
        model = this.createModelForItem(item);
      }
      next.push(model);
    });

    remove.map(model => model.destroy());

    this.set('content', next);

    return next;
  },

  factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:computed/models').create({ _internal: this });
  },

  willDestroy() {
    this._super(...arguments);
    this.get('content').map(model => model.destroy());
  }

});
