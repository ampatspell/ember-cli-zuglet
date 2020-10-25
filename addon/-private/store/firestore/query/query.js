import EmberObject from '@ember/object';
import { objectToJSON } from '../../../util/object-to-json';

export default class Query extends EmberObject {

  init({ }) {
    super.init(...arguments);
  }

  //

  onActivated() {
    this._isActivated = true;
  }

  onDeactivated() {
    this._isActivated = false;
  }

  get serialized() {
    let { content } = this;
    return {
      content: objectToJSON(content)
    };
  }

}
