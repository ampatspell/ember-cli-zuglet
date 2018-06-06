import EmberObject from '@ember/object';
import ModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  load(doc, opts) {
    return this._internal.load(doc._internal, opts);
  },

  save(doc, opts) {
    this._internal.save(doc._internal, opts);
  }

});
