import EmberObject from '@ember/object';
import { getOwner } from '../util/get-owner';
import { A } from '@ember/array';

export default class Store extends EmberObject {

  get models() {
    return this.stores.models;
  }

  //

  _createDocument({ data }) {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/firestore/document').create({ store, data });
  }

  _createQuery({ content }) {
    let store = this;
    return getOwner(this).factoryFor('zuglet:store/firestore/query').create({ store, content });
  }

  document(data) {
    return this._createDocument({ data });
  }

  query(content) {
    content = A(content);
    return this._createQuery({ content });
  }

}
