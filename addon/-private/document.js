import EmberObject, { computed } from '@ember/object';
import serialized from './util/serialized';

let keys = [ 'path', 'exists', 'metadata', 'data' ];

const ref = key => computed('ref', function() {
  let ref = this.get('ref');
  if(!ref) {
    return;
  }
  return ref[key];
}).readOnly();

export default EmberObject.extend({

  store: null,

  ref: null,

  id: ref('id'),
  path: ref('path'),

  exists: undefined,
  metadata: undefined,

  data: undefined,

  serialized: serialized(keys),

  _onSnapshot(snapshot) {
    let { exists, ref, metadata } = snapshot;
    let data = snapshot.data({ serverTimestamps: 'estimate' });
    this.setProperties({ exists, ref, metadata, data });
  }

});