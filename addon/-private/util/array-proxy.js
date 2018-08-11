import ArrayProxy from '@ember/array/proxy';
import createTransform from './array-transform-mixin';

const TransformMixin = createTransform({
  public(internal) {
    return internal && internal.model(true);
  }
});

export default ArrayProxy.extend(TransformMixin);
