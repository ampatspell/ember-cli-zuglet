import EmberObject from '@ember/object';
import { object, raw } from '../../model/properties/object';

export default class Document extends EmberObject {

  @object
  data

  @raw('data')
  _data

  init({ data }) {
    super.init(...arguments);
  }

  onActivated() {
  }

  onDeactivated() {
  }

  get serialized() {
    let { data, foo } = this;
    return {
      data,
      foo
    };
  }

}
