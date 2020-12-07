import 'firebase/storage';
import ZugletObject from '../../../object';
import { toJSON } from '../../util/to-json';
import { getFactory } from '../../factory/get-factory';

export default class Storage extends ZugletObject {

  constructor(owner, { store }) {
    super(owner);
    this.store = store;
  }

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
    return getFactory(this).zuglet.create('store/storage/reference', { storage, _ref });
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
