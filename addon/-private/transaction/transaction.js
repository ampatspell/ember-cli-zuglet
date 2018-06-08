import EmberObject from '@ember/object';
import ModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  load(doc, opts) {
    return this._internal.load(doc._internal, opts).then(internal => internal.model(true));
  },

  save(doc, opts) {
    this._internal.save(doc._internal, opts);
  },

  delete(doc) {
    this._internal.delete(doc._internal);
  }

});