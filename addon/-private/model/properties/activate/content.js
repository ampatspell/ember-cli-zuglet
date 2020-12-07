import BaseActivateProperty from './activate';
import { diff } from '../../decorators/diff';

export default class ContentActivateProperty extends BaseActivateProperty {

  @diff()
  _value() {
    let { owner, opts: { value }, key } = this;
    return value.call(owner, owner, key);
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

}
