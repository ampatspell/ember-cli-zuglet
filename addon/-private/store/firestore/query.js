import EmberObject from '@ember/object';
import { activate } from '../../model/properties/activate';
import { tracked } from '@glimmer/tracking';
import { objectToJSON } from '../../util/object-to-json';

export default class Query extends EmberObject {

  @activate
  content

  @tracked
  isActivated = false

  init({ content }) {
    super.init(...arguments);
    this.content = content;
  }

  //

  add(doc) {
    this.content.pushObject(doc);
  }

  remove(doc) {
    this.content.removeObject(doc);
  }

  //

  onActivated() {
    this.isActivated = true;
  }

  onDeactivated() {
    this.isActivated = false;
  }

  get serialized() {
    let { isActivated, content } = this;
    return {
      isActivated,
      content: objectToJSON(content)
    };
  }

}
