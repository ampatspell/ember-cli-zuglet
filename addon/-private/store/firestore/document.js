import EmberObject from '@ember/object';
import { object, raw } from '../../model/properties/object';

export default class Document extends EmberObject {

  @object
  data

  @raw('data')
  _data

  get serialized() {
    let { data } = this;
    return {
      data
    };
  }

}
