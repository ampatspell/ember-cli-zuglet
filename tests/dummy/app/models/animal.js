import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { objectToJSON } from 'zuglet/-private/util/object-to-json';

export default class Animal extends EmberObject {

  @tracked
  isActivated = false

  @tracked
  doc

  onActivated() {
    this.isActivated = true;
  }

  onDeactivated() {
    this.isActivated = false;
  }

  get serialized() {
    let { isActivated, doc } = this;
    return {
      isActivated,
      doc: objectToJSON(doc)
    }
  }

  toStringExtension() {
    return `${this.get('doc.data.name')}`;
  }

}
