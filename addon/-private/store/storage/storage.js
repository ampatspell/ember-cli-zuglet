import 'firebase/storage';
import EmberObject from '@ember/object';
import { getOwner } from '../../util/get-owner';
import { toJSON } from '../../util/to-json';

export default class Storage extends EmberObject {

  get _storage() {
    return this.store.firebase.storage();
  }

  get bucket() {
    return this._storage.app.options.storageBucket;
  }

  ref(arg) {
    if(typeof arg === 'string') {
      arg = { path: arg };
    }

    let { path, url } = arg;
    let _ref;
    if(path) {
      _ref = this._storage.ref(path);
    } else {
      _ref = this._storage.refFromURL(url);
    }

    let storage = this;
    return getOwner(this).factoryFor('zuglet:store/storage/reference').create({ storage, _ref });
  }

  get serialized() {
    let { bucket } = this;
    return {
      bucket
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.bucket}`;
  }

}
