import EmberObject from '@ember/object';
import { toJSON } from '../../../util/to-json';

export default class Reference extends EmberObject {

  store = null
  _ref = null

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

}
