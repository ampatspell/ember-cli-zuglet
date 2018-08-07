import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

export default EmberObject.extend({

  source: null,
  dependencies: null,
  factory: null,
  mapping: null,

  content: null,

  init() {
    this._super(...arguments);
    this.setProperties({ content: A() });
    this.startObservingSource();
  },

  createModel(raw) {
    let { factory, mapping } = this.getProperties('factory', 'mapping');

    if(typeof factory === 'function') {
      factory = factory(raw);
    }

    let _factory = getOwner(this).factoryFor(`model:${factory}`);
    let instance = _factory.create();

    let mapped = raw;
    if(mapping) {
      mapped = mapping(raw);
    }

    instance.prepare(mapped);

    return instance;
  },

  createModels(source) {
    return source.map(item => this.createModel(item));
  },

  sourceWillChange() {
    console.log('sourceWillChange');
  },

  sourceDidChange() {
    console.log('sourceDidChange');
  },

  withSourceObservation(cb) {
    let { source } = this.getProperties('source');
    cb(source, {
      willChange: this.sourceWillChange,
      didChange: this.sourceDidChange
    });
  },

  startObservingSource() {
    this.withSourceObservation((source, opts) => {
      source.addArrayObserver(this, opts);
      let models = this.createModels(source);
      console.log('models', models);
    });
  },

  stopObservingSource() {
    this.withSourceObservation((source, opts) => source.removeArrayObserver(this, opts));
  },

  willDestroy() {
    this._super(...arguments);
    this.stopObservingSource();
  },

});
