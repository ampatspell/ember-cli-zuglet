import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { getOwner } from '../../util/get-owner';
import firebase from "firebase/app";

const {
  StringFormat
} = firebase.storage;

const {
  assign
} = Object;

const stringFormats = {
  'raw':        StringFormat.RAW,
  'base64':     StringFormat.BASE64,
  'base64-url': StringFormat.BASE64URL,
  'data-url':   StringFormat.DATA_URL
};

export default class StorageReference extends EmberObject {

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

  async url() {
    return await this._ref.getDownloadURL();
  }

  async metadata() {
    let metadata = await this._ref.getMetadata();
    let date = key => {
      let value = metadata[key];
      return value && new Date(value);
    }
    let timeCreated = date('timeCreated');
    let updated = date('updated');
    return assign({}, metadata, {
      timeCreated,
      updated
    });
  }

  async update(metadata) {
    await this._ref.updateMetadata(metadata);
    return this;
  }

  //

  async delete() {
    await this._ref.delete();
    return this;
  }

  //

  _put(opts={}) {
    let { type, data, format, metadata } = opts;
    assert(`opts.metadata must be object`, typeof metadata === 'object');
    let _task;
    if(type === 'string') {
      let format_ = stringFormats[format];
      assert(`opts.format can be one of the following [ ${keys(stringFormats).join(', ')} ]`, format_);
      _task = this._ref.putString(data, format_, metadata);
    } else if(type === 'data') {
      _task = this._ref.put(data, metadata);
    } else {
      assert(`opts.type must be string or data`, false);
    }
    let ref = this;
    return { ref, type, data, _task, metadata };
  }

  put(opts) {
    return getOwner(this).factoryFor('zuglet:store/storage/task').create(this._put(opts));
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

  toStringExtension() {
    return `${this.path}`;
  }

}