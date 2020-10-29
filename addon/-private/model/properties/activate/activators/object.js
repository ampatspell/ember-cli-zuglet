
export default class ObjectActivator {

  type = 'object';

  value = null;
  isActivated = false;

  constructor(property, value) {
    this.property = property;
    this.isActivated = false;
    this.value = value || null;
    this.activate();
  }

  activate() {
    if(!this.property.isActivated) {
      return;
    }

    if(this.isActivated) {
      return;
    }

    this.isActivated = true;

    let value = this.value;
    this.property.activateValue(value);
  }

  deactivate() {
    if(!this.isActivated) {
      return;
    }

    this.isActivated = false;

    let value = this.value;
    this.property.deactivateValue(value);
  }

  getValue() {
    this.activate();
    return this.value;
  }

  setValue(value) {
    if(value === this.value) {
      return;
    }
    value = value || null;
    this.deactivate();
    this.value = value;
    this.activate();
    return value;
  }

}
