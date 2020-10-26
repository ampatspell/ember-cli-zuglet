import EmberObject from '@ember/object';
import { objectToJSON, toPrimitive } from 'zuglet/utils';
import { tracked } from '@glimmer/tracking';

export default class Message extends EmberObject {

  @tracked
  doc

  get id() {
    return this.doc.id;
  }

  async save() {
    await this.doc.save();
  }

  async delete() {
    await this.doc.delete();
  }

  //

  get name() {
    return this.doc.data.name;
  }

  set name(value) {
    this.doc.data.name = value;
  }

  get text() {
    return this.doc.data.text;
  }

  set text(value) {
    this.doc.data.text = value;
  }

  //

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
