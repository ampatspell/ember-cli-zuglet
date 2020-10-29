import BaseActivateProperty from './activate';
import { consumeKey, dirtyKey } from '../../tracking/tag';

export default class WirtableActivateProperty extends BaseActivateProperty {

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
      dirtyKey(this, 'activator');
    } else {
      this.assertActivatorType(activator, value);
    }
    return activator.setValue(value);
  }

}
