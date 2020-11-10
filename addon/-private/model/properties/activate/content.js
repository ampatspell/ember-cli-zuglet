import BaseActivateProperty from './activate';
import { assert } from '@ember/debug';
import { diff } from '../../decorators/diff';

export default class ContentActivateProperty extends BaseActivateProperty {

  init() {
    super.init(...arguments);
  }

  @diff()
  _value() {
    let { owner, opts: { value } } = this;
    return value.call(owner, owner);
  }

  getPropertyValue() {
    let { activator } = this;
    if(!activator) {
      let { current } = this._value;
      this.value = current;
      activator = this.createActivator(current);
      this.activator = activator;
    } else {
      let { current } = this._value;
      if(current !== this.value) {
        this.value = current;
        this.assertActivatorType(activator, current);
        activator.setValue(current);
      }
    }
    return activator.getValue();
  }

  setPropertyValue() {
    assert(`@activate().content(...) is read-only`, false);
  }

}
