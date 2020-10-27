import { A } from '@ember/array';
import { diffArrays } from '../../../util/diff-arrays';

export default class ArrayActivator {

  type = 'array';

  arrayObserverOpts = {
    willChange: this.contentWillChange,
    didChange: this.contentDidChange
  }

  constructor(property, content) {
    this.property = property;
    this.content = A(content);
    this.isObserving = false;
    this.activate();
  }

  //

  startObservingArray() {
    console.log('startObserving');
    if(this.isObserving) {
      return;
    }
    this.isObserving = true;
    let { content } = this;
    content.addArrayObserver(this, this.arrayObserverOpts);
  }

  stopObservingArray() {
    if(!this.isObserving) {
      return;
    }
    this.isObserving = false;
    let { content } = this;
    content.removeArrayObserver(this, this.arrayObserverOpts);
  }

  contentWillChange(array, start, removeCount, addCount) {
    if(removeCount) {
      let removed = array.slice(start, start + removeCount);
      this.deactivateValues(removed);
    }
  }

  contentDidChange(array, start, removeCount, addCount) {
    if(addCount) {
      let added = A(array.slice(start, start + addCount));
      this.activateValues(added);
    }
  }

  //

  activateValues(values) {
    values.map(item => this.property.activateValue(item));
  }

  deactivateValues(values) {
    values.map(item => this.property.deactivateValue(item));
  }

  activate(models) {
    if(!this.property.isActivated) {
      return;
    }
    this.startObservingArray();
    this.activateValues(models || this.content);
  }

  deactivate(models) {
    this.stopObservingArray();
    this.deactivateValues(models || this.content);
  }

  getValue() {
    return this.content;
  }

  setValue(value) {
    if(value === this.content) {
      return value;
    }

    let { removed, added } = diffArrays(this.content, value);

    this.deactivate(removed);
    this.content = A(value);
    this.activate(added);

    return this.content;
  }

}
