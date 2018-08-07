import { getOwner } from '@ember/application';
import { computed, defineProperty } from '@ember/object';
import Internal from '../../internal/internal';
import { A } from '@ember/array';

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

  prepareModelForItem(model, item) {
    let mapping = this.get('opts.mapping');

    let arg;
    if(mapping) {
      arg = mapping(item);
    } else {
      arg = item;
    }

    model.prepare(arg);

    return model;
  },

  createModelForItem(item) {
    let factory = this.get('opts.factory');

    if(typeof factory === 'function') {
      factory = factory(item);
    }

    factory = getOwner(this).factoryFor(`model:${factory}`);

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

    content.replace(0, content.get('length'), next);
    remove.map(model => model.destroy());
    return content;
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
