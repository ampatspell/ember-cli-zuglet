import Model from '../base/model';
import { state } from '../base/internal';
import serialized from '../../../util/serialized';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { invokePromiseReturningThis } from '../../../internal/invoke';

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

export default Model.extend({

  reference: computed(function() {
    return this._internal.ref.model(true);
  }).readOnly(),

  raw: readOnly('_internal._metadata'),

  type: raw(),

  name: raw(),
  size: raw(),
  contentType: raw(),
  customMetadata: raw(),

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

  // { ... }
  update: invokePromiseReturningThis('update'),

  serialized: serialized([ ...state, 'name', 'size', 'contentType', 'customMetadata' ], [ 'exists' ]),

});
