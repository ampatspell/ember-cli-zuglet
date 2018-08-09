import ObjectObserver from '../../util/object-observer';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const validate = (parent, observe, delegate) => {
  assert(`parent is required`, !!parent);
  assert(`observe must be array`, typeOf(observe) === 'array');
  assert(`delegate is required`, !!delegate);
  assert(`delegate.updated must be function`, typeOf(delegate.updated) === 'function');
}

export default class ParentManager {

  // parent

  constructor({ parent, observe, delegate }) {
    validate(parent, observe, delegate);
    this.parent = parent;
    this.observer = new ObjectObserver({
      object: parent,
      observe,
      delegate: {
        updated: (object, key) => delegate.updated(object, key)
      }
    });
  }

  destroy() {
    this.observer.destroy();
  }

}
