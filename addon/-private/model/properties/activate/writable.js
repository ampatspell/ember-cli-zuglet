import BaseActivateProperty from './activate';
import { consumeKey, dirtyKey } from '../../tracking/tag';

export default class WritableActivateProperty extends BaseActivateProperty {

  getPropertyValue() {
    consumeKey(this, 'activator');
    let { activator } = this;
    if(!activator) {
      return null;
    }
    return activator.getValue();
  }

  setPropertyValue(value) {
    let { activator } = this;
    if(!activator) {
      activator = this.createActivator(value);
      this.activator = activator;
    } else {
      this.assertActivatorType(activator, value);
    }
    dirtyKey(this, 'activator');
    return activator.setValue(value);
  }

}
