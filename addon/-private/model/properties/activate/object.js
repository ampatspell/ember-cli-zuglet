export default class ObjectActivator {

  type = 'object';

  value = null;
  isActivated = false;

  constructor(property, value) {
    this.property = property;
    this.isActivated = false;
    this.value = value || null;
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
    if(value) {
      let state = getState(value);
      if(state) {
        state.activate(this.property);
      }
    }
  }

  deactivate() {
    if(!this.isActivated) {
      return;
    }

    this.isActivated = false;

    let value = this.value;
    if(value) {
      let state = getState(value);
      if(state) {
        state.deactivate(this.property);
      }
    }
  }

  getValue() {
    this.activate();
    return this.value;
  }

  setValue(value) {
    value = value || null;
    this.deactivate();
    this.value = value;
    this.activate();
    return value;
  }

}
