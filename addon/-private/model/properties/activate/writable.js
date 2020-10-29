import BaseActivateProperty from './activate';

export default class WirtableActivateProperty extends BaseActivateProperty {

  getPropertyValue() {
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
    return activator.setValue(value);
  }

}
