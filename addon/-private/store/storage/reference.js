import 'firebase/compat/storage';
import ZugletObject from '../../../object';
import { assert } from '@ember/debug';
import { toJSON } from '../../util/to-json';
import { registerPromise } from '../../stores/stats';
import { getFactory } from '../../factory/get-factory';
import { StringFormat } from 'firebase/storage';
import {
  ref,
  uploadString,
  uploadBytesResumable,
  list,
  listAll,
  getDownloadURL,
  deleteObject,
  updateMetadata,
  getMetadata
} from 'firebase/storage';

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
    return this.storage._createReference(ref(this._ref, path));
  }

  //

  async url() {
    return await registerPromise(this, 'url', getDownloadURL(this._ref));
  }

  async _metadata(opts) {
    let { optional } = assign({ optional: false }, opts);
    try {
      return await registerPromise(this, 'metadata', getMetadata(this._ref));
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
    await registerPromise(this, 'update', updateMetadata(this._ref, metadata));
  }

  async delete(opts) {
    let { optional } = assign({ optional: false }, opts);
    try {
      await registerPromise(this, 'delete', deleteObject(this._ref));
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
      _task = uploadString(this._ref, data, format_, metadata);
      throw new Error('TODO: this is just a promise');
    } else if(type === 'data') {
      _task = uploadBytesResumable(this._ref, data, metadata);
    } else {
      assert(`opts.type must be 'string' or 'data'`, false);
    }
    let ref = this;
    return { ref, type, data, _task, metadata };
  }

  _toListResult(result) {
    let { items, nextPageToken, prefixes } = result;
    let wrap = refs => refs.map(ref => this.storage._createReference(ref));
    return {
      items: wrap(items),
      prefixes: wrap(prefixes),
      nextPageToken
    };
  }

  async list(opts) {
    let { maxResults, pageToken } = assign({ }, opts);
    let result = await list(this._ref, { maxResults, pageToken });
    return this._toListResult(result);
  }

  async listAll() {
    let result = await listAll(this._ref);
    return this._toListResult(result);
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
