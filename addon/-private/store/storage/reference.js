import ZugletObject from '../../../object';
import { assert } from '@ember/debug';
import { toJSON } from '../../util/to-json';
import { registerPromise } from '../../stores/stats';
import firebase from "firebase/app";
import { getFactory } from '../../factory/get-factory';

const {
  StringFormat
} = firebase.storage;

const {
  assign,
  keys
} = Object;

const stringFormats = {
  'raw':        StringFormat.RAW,
  'base64':     StringFormat.BASE64,
  'base64-url': StringFormat.BASE64URL,
  'data-url':   StringFormat.DATA_URL
};

export default class StorageReference extends ZugletObject {

  constructor(owner, { storage, _ref }) {
    super(owner);
    this.storage = storage;
    this._ref = _ref;
  }

  get name() {
    return this._ref.name;
  }

  get path() {
    return this._ref.fullPath;
  }

  get bucket() {
    return this._ref.bucket;
  }

  //

  ref(path) {
    return this.storage._createReference(this._ref.child(path));
  }

  //

  async url() {
    return await registerPromise(this, 'url', this._ref.getDownloadURL());
  }

  async _metadata(opts) {
    let { optional } = assign({ optional: false }, opts);
    try {
      return await registerPromise(this, 'metadata', this._ref.getMetadata());
    } catch(err) {
      if(err.code === 'storage/object-not-found' && optional) {
        return;
      }
      throw err;
    }
  }

  _normalizeMetadata(metadata) {
    if(!metadata) {
      return;
    }
    let date = value => value && new Date(value);
    let hash = {};
    for(let key in metadata) {
      let value = metadata[key];
      if([ 'timeCreated', 'updated' ].includes(key)) {
        hash[key] = date(value);
      } else {
        hash[key] = value;
      }
    }
    return hash;
  }

  async metadata(opts) {
    let metadata = await this._metadata(opts);
    return this._normalizeMetadata(metadata);
  }

  async update(metadata) {
    await registerPromise(this, 'update', this._ref.updateMetadata(metadata));
  }

  async delete(opts) {
    let { optional } = assign({ optional: false }, opts);
    try {
      await registerPromise(this, 'delete', this._ref.delete());
    } catch(err) {
      if(err.code === 'storage/object-not-found' && optional) {
        return false;
      }
      throw err;
    }
    return true;
  }

  put(opts) {
    return getFactory(this).zuglet.create('store/storage/task', this._put(opts));
  }

  //

  _put(opts) {
    let { type, data, format, metadata } = assign({ type: 'data' }, opts);
    assert(`opts.metadata must be object`, typeof metadata === 'object');
    let _task;
    if(type === 'string') {
      let format_ = stringFormats[format];
      assert(`opts.format can be one of the following [ ${keys(stringFormats).join(', ')} ]`, format_);
      _task = this._ref.putString(data, format_, metadata);
    } else if(type === 'data') {
      _task = this._ref.put(data, metadata);
    } else {
      assert(`opts.type must be 'string' or 'data'`, false);
    }
    let ref = this;
    return { ref, type, data, _task, metadata };
  }

  //

  get serialized() {
    let { name, path, bucket } = this;
    return {
      name,
      path,
      bucket
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.path}`;
  }

}
