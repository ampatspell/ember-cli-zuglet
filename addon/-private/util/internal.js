import EmberObject from '@ember/object';

export default EmberObject.extend({

  _model: null,

  didCreateModel() {
  },

  model(create) {
    let model = this._model;
    if(!model && create) {
      model = this.createModel();
      this.didCreateModel(model);
      this._model = model;
    }
    return model;
  },

  modelWillDestroy() {
    this.destroy();
  },

  willDestroy() {
    this._model && this._model.destroy();
    this._super(...arguments);
  }

});
