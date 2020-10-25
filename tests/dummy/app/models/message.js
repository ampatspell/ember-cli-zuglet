import EmberObject from '@ember/object';
import { objectToJSON, toPrimitive } from 'zuglet/utils';

export default class Message extends EmberObject {

  doc

  get id() {
    return this.doc.id;
  }

  get serialized() {
    let { doc } = this;
    return {
      instance: toPrimitive(this),
      doc: objectToJSON(doc)
    };
  }

  toStringExtension() {
    return `${this.id}`;
  }

}
