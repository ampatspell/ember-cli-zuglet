import EmberObject from '@ember/object';
import { objectToJSON, toJSON } from 'zuglet/utils';
import { tracked } from '@glimmer/tracking';
import { alias } from 'macro-decorators';

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

  @alias('doc.data.name')
  name

  @alias('doc.data.text')
  text

  //

  async load() {
  }

  //

  get serialized() {
    let { doc } = this;
    return {
      doc: objectToJSON(doc)
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.id}`;
  }

}
