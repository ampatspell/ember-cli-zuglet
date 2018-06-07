import EmberObject from '@ember/object';
import ModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  save(doc, opts) {
    this._internal.save(doc._internal, opts);
  },

  delete(doc) {
    this._internal.delete(doc._internal);
  },

  commit() {
    return this._internal.commit();
  }

});
