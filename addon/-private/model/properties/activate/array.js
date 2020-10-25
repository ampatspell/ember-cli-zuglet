export default class ArrayActivator {

  type = 'array';

  value = null;
  isActivated = false;

  constructor(property, value) {
    this.property = property;
    this.isActivated = false;
    this.value = value || [];
  }

  activate() {
  }

  deactivate() {
  }

  getValue() {
  }

  setValue(value) {
    value = value || [];
    return value;
  }

}
