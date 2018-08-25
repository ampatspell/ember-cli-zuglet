import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { typeOf } from '@ember/utils';
import Internal from '../../internal/internal';
import { instances, destroyInstances } from './computed/instances';
import models from './computed/models';
import { modelClassForName, createModelClassFromProperties } from '../../lifecycle/util/model-factory';
import { assert } from '@ember/debug';

export default Internal.extend({

  owner: null,
  opts: null,

  factory: computed(function() {
    let { owner, opts: { key, factory } } = this.getProperties('owner', 'opts');
    let type = typeOf(factory);
    const result = (type, prop) => ({ type, prop });
    if(type === 'object') {
      return result('class', createModelClassFromProperties(owner, key, factory, []));
    } else if(type === 'string') {
      return result('class', modelClassForName(owner, factory));
    } else if(type === 'function') {
      let fn = (...args) => modelClassForName(owner, factory(...args));
      return result('function', fn);
    }
    assert(`models last argument must be object, string or function`, false);
  }).readOnly(),

  instances: instances(owner => {
    let source = owner.get('opts.source');
    return `owner.${source}`;
  }, owner => {
    let { opts: { dependencies, mapping }, factory } = owner.getProperties('opts', 'factory');
    return { opts: { dependencies, mapping, factory } };
  }),

  models: models('instances.content'),

  factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:computed/models').create({ _internal: this });
  },

  willDestroy() {
    this._super(...arguments);
    destroyInstances(this);
  }

});
