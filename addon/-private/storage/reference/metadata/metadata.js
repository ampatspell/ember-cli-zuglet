import EmberObject, { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../../internal/model-mixin';
import serialized from '../../../util/serialized';
import { state } from './internal';
import { invokePromiseReturningThis } from '../../../internal/invoke';

const StatePropertiesMixin = Mixin.create(state.reduce((hash, key) => {
  hash[key] = readOnly(`_internal.${key}`);
  return hash;
}, {}));

const raw = () => computed('raw', function(key) {
  let raw = this.get('raw');
  if(!raw) {
    return;
  }
  return raw[key];
}).readOnly();

const rawDate = key => computed('raw', function() {
  let value = this.get(`raw.${key}`);
  if(!value) {
    return;
  }
  return new Date(value);
}).readOnly();

const lastInArray = key => computed(key, function() {
  let array = this.get(key);
  return array && array[array.length - 1];
}).readOnly();

export default EmberObject.extend(ModelMixin, StatePropertiesMixin, {

  reference: computed(function() {
    return this._internal.ref.model(true);
  }).readOnly(),

  raw: readOnly('_internal._metadata'),

  type: raw(),

  name: raw(),
  size: raw(),
  contentType: raw(),
  customMetadata: raw(),
  downloadURLs: raw(),

  cacheControl: raw(),
  contentDisposition: raw(),
  contentEncoding: raw(),
  contentLanguage: raw(),

  bucket: raw(),
  fullPath: raw(),

  generation: raw(),
  md5Hash: raw(),
  metageneration: raw(),

  createdAt: rawDate('timeCreated'),
  updatedAt: rawDate('updated'),

  downloadURL: lastInArray('downloadURLs'),

  // { optional }
  load: invokePromiseReturningThis('load'),

  // { ... }
  update: invokePromiseReturningThis('update'),

  serialized: serialized([ ...state, 'name', 'size', 'contentType', 'customMetadata' ], [ 'isExisting' ]),

});
