import ArrayProxy from '@ember/array/proxy';
import ModelMixin from '../../internal/model-mixin';
import createTransform from '../../util/array-transform-mixin';

const TransformMixin = createTransform({
  public(internal) {
    return internal && internal.model(true);
  }
});

export default ArrayProxy.extend(ModelMixin, TransformMixin);
