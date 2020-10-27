import { A } from '@ember/array';
import { diffArrays } from '../../../util/diff-arrays';
import ArrayObserver from '../../../model/tracking/array';

export default class ArrayActivator {

  type = 'array';

  constructor(property, content) {
    this.property = property;
    this.content = A(content);
    this._observer = null;
    this.activate();
  }

  get observer() {
    let observer = this._observer;
    if(!observer) {
      observer = new ArrayObserver({
        content: this.content,
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
    this.activateValues(models || this.content);
  }

  deactivate(models) {
    this.deactivateValues(models || this.content);
  }

  getValue() {
    return this.proxy;
  }

  setValue(value) {
    if(value === this.proxy) {
      return this.proxy;
    }

    let { removed, added } = diffArrays(this.content, value);

    this.deactivate(removed);
    this.content = A(value);
    this._observer = null;
    this.activate(added);

    return this.proxy;
  }

}
