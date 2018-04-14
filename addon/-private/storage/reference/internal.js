import Internal from '../../internal/internal';
import { computed } from '@ember/object';
import destroyCached from '../../util/destroy-cached';
import firebase from 'firebase';
import { assert } from '@ember/debug';

const {
  StringFormat
} = firebase.storage;

const stringFormats = {
  'raw':        StringFormat.RAW,
  'base64':     StringFormat.BASE64,
  'base64-url': StringFormat.BASE64URL,
  'data-url':   StringFormat.DATA_URL
};

export default Internal.extend({

  storage: null,
  ref: null,

  factoryFor(name) {
    return this.storage.factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:storage/reference').create({ _internal: this });
  },

  metadata: computed(function() {
    return this.factoryFor('zuglet:storage/reference/metadata/internal').create({ ref: this });
  }).readOnly(),

  load(opts) {
    return this.get('metadata').load(opts);
  },

  createStorageTask(opts) {
    let { type, data, format, metadata } = opts;
    assert(`opts.metadata must be object`, typeof metadata === 'object');
    let task;
    if(type === 'string') {
      let format_ = stringFormats[format];
      assert(`opts.format can be one of the following [ ${Object.keys(stringFormats).join(', ')} ]`, format_);
      task = this.ref.putString(data, format_, metadata);
    } else if(type === 'data') {
      task = this.ref.put(data, metadata);
    } else {
      assert(`opts.type must be string or data`, false);
    }
    return { type, task };
  },

  createInternalTask(type, task) {
    return this.factoryFor('zuglet:storage/task/internal').create({ ref: this, type, task });
  },

  put(opts) {
    let { task, type } = this.createStorageTask(opts);
    return this.createInternalTask(type, task);
  },

  willDestroy() {
    destroyCached(this, 'metadata');
    this._super(...arguments);
  }

});
