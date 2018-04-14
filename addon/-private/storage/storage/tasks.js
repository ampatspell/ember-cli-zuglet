import ArrayProxy from '@ember/array/proxy';
import { assert } from '@ember/debug';
import createTransform from '../../util/array-transform-mixin';

const TransformMixin = createTransform({
  internal() {
    assert('this array is read-only', false);
  },
  public(operation) {
    return operation.get('opts.task').model(true);
  }
});

export default ArrayProxy.extend(TransformMixin);
