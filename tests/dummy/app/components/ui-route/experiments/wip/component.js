import EmberObject from '@ember/object';
import { defineProperty } from '@ember/object';
import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import observed from 'ember-cli-zuglet/experimental/observed';
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';

const Model = EmberObject.extend({

  object: null,

  toString() {
    return `<model:${this.object}>`;
  }

});

const createInstance = deps => {
  let dep = `object.{${deps.join(',')}}`;

  return EmberObject.extend({

    object: null,

    model: computed(dep, function() {
      console.log('recompute model', this.get('object')+'');
      let model = this._model;
      if(!model) {
        model = this.createModel();
      }
      this._model = model;
      return model;
    }).readOnly(),

    createModel() {
      let object = this.get('object');
      return Model.create({ object });
    },

    toString() {
      return `<instance:${this.object}>`;
    }

  });
};

export default Component.extend({
  classNameBindings: [ ':ui-route-experiments-wip' ],
  layout,

  query: observed(),

  instanceFactory: computed(function() {
    return createInstance([ 'data.type' ]);
  }).readOnly(),

  instances: computed(`query.content.[]`, function() {
    let instances = this._instances;

    if(!instances) {
      instances = A();
      this._instances = instances;
    }

    let objects = this.get('query.content');

    let remove = A(instances.slice());
    instances.clear();

    let factory = this.get('instanceFactory');

    let instanceByObject = object => instances.findBy('object', object);
    let createInstanceForObject = object => factory.create({ object });

    objects.forEach(object => {
      let instance = instanceByObject(object);
      if(instance) {
        remove.removeObject(instance);
      } else {
        instance = createInstanceForObject(object);
      }
      instances.pushObject(instance);
    });

    remove.forEach(instance => instance.destroy());

    return instances;
  }).readOnly(),

  models: computed('instances.@each.model', function() {
    let models = this._models;
    if(!models) {
      models = A();
      this._models = models;
    }

    models.clear();

    this.get('instances').map(instance => {
      let model = instance.get('model');
      models.pushObject(model);
    });

    return models;
  }).readOnly(),

  proxy: computed(function() {
    let content = this.get('models');
    return ArrayProxy.create({ content });
  }).readOnly(),

  willInsertElement() {
    this._super(...arguments);
    let query = this.store.collection('ducks').query();
    this.setProperties({ query });
    window.content = query.content;
  }

});
