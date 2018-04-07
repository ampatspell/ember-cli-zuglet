import ArrayProxy from '@ember/array/proxy';
import { assert } from '@ember/debug';
import createTransform from './array-transform-mixin';

const TransformMixin = createTransform({
  internal() {
    assert('this array is read-only', false);
  },
  public(internal) {
    return internal && internal.model(true);
  }
});

export default ArrayProxy.extend(TransformMixin);
