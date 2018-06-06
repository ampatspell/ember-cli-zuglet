import EmberObject from '@ember/object';
import ModelMixin from '../internal/model-mixin';

const forwardPromise = name => function(model, ...rest) {
  let internal = this._internal;
  return internal[name].call(internal, model && model._internal).then(internal => {
    return internal && internal.model(true);
  });
}

const forward = name => function(model, ...rest) {
  let internal = this._internal;
  return internal[name].call(internal, model && model._internal);
}

export default EmberObject.extend(ModelMixin, {

  load: forwardPromise('load'),
  save: forward('save'),

});
