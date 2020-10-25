import EmberObject from '@ember/object';
import { object, raw } from '../../model/properties/object';
import { tracked } from '@glimmer/tracking';

export default class Document extends EmberObject {

  @object
  data

  @raw('data')
  _data

  @tracked
  isActivated = false

  init({ data }) {
    super.init(...arguments);
  }

  onActivated() {
    this.isActivated = true;
  }

  onDeactivated() {
    this.isActivated = false;
  }

  get serialized() {
    let { isActivated, data } = this;
    return {
      isActivated,
      data
    };
  }

}
