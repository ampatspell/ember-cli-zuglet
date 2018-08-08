import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { assign } from '@ember/polyfills';

const modelFullName = key => `zuglet:computed/models/generated/instances/${key}`;

const lookupFactory = (parent, fullName, create) => {
  let owner = getOwner(parent);
  let factory = owner.factoryFor(fullName);
  if(!factory) {
    owner.register(fullName, create());
    factory = owner.factoryFor(fullName);
  }
  return factory;
}

//

const Instance = EmberObject.extend({

  parent: null,
  object: null,
  model: null,

  owner: readOnly('parent.owner'),

  recompute() {
    let model = this._model;
    if(model) {
      let current = model;
      model = this.create();
      current.destroy();
      this._model = model;
    } else {
      model = this.create();
      this._model = model;
    }
    return model;
  },

  factory() {
    let { owner, object, opts: { factory: { type, prop } } } = this.getProperties('owner', 'object', 'opts');
    if(type === 'function') {
      return prop(object, owner);
    }
    return prop;
  },

  instantiate() {
    let factory = this.factory();
    return factory.create();
  },

  arguments() {
    let { owner, object, opts: { mapping } } = this.getProperties('owner', 'object', 'opts');
    if(mapping) {
      let mapped = mapping.call(owner, object, owner);
      return [ mapped ];
    }
    return [ object, owner ];
  },

  prepare(model) {
    model.prepare(...this.arguments());
  },

  create() {
    let model = this.instantiate();
    this.prepare(model);
    return model;
  },

  willDestroy() {
    this._super(...arguments);
    this._model && this._model.destroy();
  }

});

const createInstanceClass = deps => {
  deps = deps.map(dep => `object.${dep}`);
  return Instance.extend({

    model: computed(...deps, function() {
      return this.recompute();
    }).readOnly()

  });
}

//

const Instances = EmberObject.extend({

  parent: null,
  source: null,
  opts: null,

  content: computed('source.[]', function() {
    let source = this.get('source');
    if(!source) {
      return;
    }

    let content = this._content;

    if(!content) {
      content = A();
      this._content = content;
    }

    let remove = A(content.slice());

    content.clear();

    A(source).map(object => {
      let model = remove.findBy('object', object);
      if(model) {
        remove.removeObject(model);
      } else {
        model = this.createInstance(object);
      }
      content.pushObject(model);
    });

    remove.map(item => item.destroy());

    return content;
  }).readOnly(),

  instanceFactory: computed(function() {
    let { opts: { dependencies }, parent } = this.getProperties('opts', 'parent');
    let depsKey = dependencies.join('-');
    let fullName = modelFullName(`instance/${depsKey}`);
    return lookupFactory(parent, fullName, () => createInstanceClass(dependencies));
  }).readOnly(),

  createInstance(object) {
    let { instanceFactory, parent, opts: { factory, mapping } } = this.getProperties('instanceFactory', 'parent', 'opts');
    return instanceFactory.create({ parent, opts: { factory, mapping }, object });
  },

  willDestroy() {
    this._super(...arguments);
    this._content && this._content.map(model => model.destroy());
  }

});

const createInstancesClass = key => Instances.extend({
  source: readOnly(`parent.${key}`)
});

//

const resolveSourceKey = (owner, arg) => {
  if(typeof arg === 'function') {
    return arg(owner);
  }
  return arg;
}

const createInstances = (parent, sourceKeyFn, instancePropsFn) => {
  let sourceKey = resolveSourceKey(parent, sourceKeyFn);
  let fullName = modelFullName(sourceKey);
  let factory = lookupFactory(parent, fullName, () => createInstancesClass(sourceKey));
  let props = instancePropsFn(parent);
  return factory.create(assign({ parent }, props));
}

const cacheKey = '__instances';

export const instances = (sourceKeyFn, instancePropsFn) => computed(function() {
  let instance = this[cacheKey];
  if(!instance) {
    instance = createInstances(this, sourceKeyFn, instancePropsFn);
    this[cacheKey] = instance;
  }
  return instance;
}).readOnly();

export const destroyInstances = owner => {
  let instance = owner[cacheKey];
  instance && instance.destroy();
};
