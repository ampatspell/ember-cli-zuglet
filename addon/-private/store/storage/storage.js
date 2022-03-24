import 'firebase/compat/storage';
import ZugletObject from '../../../object';
import { toJSON } from '../../util/to-json';
import { getFactory } from '../../factory/get-factory';

export default class Storage extends ZugletObject {

  constructor(owner, { store }) {
    super(owner);
    this.store = store;
    this._maybeSetupEmulator();
  }

  _maybeSetupEmulator() {
    let emulators = this.store.normalizedOptions.emulators;
    if(emulators.storage) {
      this._storage.useEmulator(emulators.storage.host, emulators.storage.port);
    }
  }

  get _storage() {
    return this.store.firebase.storage();
  }

  get bucket() {
    return this._storage.app.options.storageBucket;
  }

  _createReference(_ref) {
    let storage = this;
    return getFactory(this).zuglet.create('store/storage/reference', { storage, _ref });
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

    return this._createReference(_ref);
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
