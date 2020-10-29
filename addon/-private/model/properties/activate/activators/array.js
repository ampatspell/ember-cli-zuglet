import { A } from '@ember/array';
import { diffArrays } from '../../../../util/diff-arrays';
import ArrayObserver from '../../../tracking/array';

export default class ArrayActivator {

  type = 'array';

  constructor(property, value) {
    this.property = property;
    this.value = A(value);
    this._observer = null;
    this.activate();
  }

  get observer() {
    let observer = this._observer;
    if(!observer) {
      observer = new ArrayObserver({
        content: this.value,
        delegate: {
          onAdd: item => this.activateValue(item),
          onRemove: item => this.deactivateValue(item)
        }
      });
      this._observer = observer;
    }
    return observer;
  }

  get proxy() {
    return this.observer.proxy;
  }

  //

  activateValue(item) {
    this.property.activateValue(item);
  }

  deactivateValue(item) {
    this.property.deactivateValue(item);
  }

  activateValues(values) {
    values.forEach(value => this.activateValue(value));
  }

  deactivateValues(values) {
    values.forEach(value => this.deactivateValue(value));
  }

  activate(models) {
    if(!this.property.isActivated) {
      return;
    }
    this.activateValues(models || this.value);
  }

  deactivate(models) {
    this.deactivateValues(models || this.value);
  }

  getValue() {
    return this.proxy;
  }

  setValue(value) {
    if(value === this.proxy || value === this.value) {
      return this.proxy;
    }

    let { removed, added } = diffArrays(this.value, value);

    this.deactivate(removed);
    this.value = A(value);
    this._observer = null;
    this.activate(added);

    return this.proxy;
  }

}
