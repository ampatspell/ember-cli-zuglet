import { A } from '@ember/array';

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
      let added  = A(array.slice(start, start + addCount));
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

  activate() {
    if(!this.property.isActivated) {
      return;
    }
    this.startObservingArray();
    this.activateValues(this.content);
  }

  deactivate() {
    this.stopObservingArray();
    this.deactivateValues(this.content);
  }

  getValue() {
    return this.content;
  }

  setValue(value) {
    if(value === this.content) {
      return this.content;
    }
    // TODO: possibly same models appear in both current and next array
    // should not deactivate & activate needlessly
    // array.replace(0, 2, [ doc ]); // where doc was already there
    this.deactivate();
    this.content = A(value);
    this.activate();
    return this.content;
  }

}
