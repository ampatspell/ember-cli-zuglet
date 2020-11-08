import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { toJSON } from 'zuglet/utils';

export default class Message extends EmberObject {

  @tracked
  id

  mappingDidChange({ id }) {
    this.id = id;
  }

  get serialized() {
    let { id } = this;
    return { id };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

}
