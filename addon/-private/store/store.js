import EmberObject from '@ember/object';
import { getOwner } from '../util/get-owner';

const {
  assign
} = Object;

export default class Store extends EmberObject {

  _createDocument(props) {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/firestore/document').create(assign({ store }, props));
  }

  document() {
    return this._createDocument({ data: { ok: true } });
  }

}
