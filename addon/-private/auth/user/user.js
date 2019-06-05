import EmberObject, { computed } from '@ember/object';
import ModelMixin from '../../internal/model-mixin';
import Mixin from '@ember/object/mixin';
import { invoke, invokePromiseReturningUndefined, invokePromiseReturningModel } from '../../internal/invoke';
import serialized from '../../util/serialized';

const keys = [
  'uid',
  'isAnonymous',
  'displayName',
  'email',
  'emailVerified',
  'phoneNumber',
  'photoURL',
  'providerId'
];

const UserPropertiesMixin = Mixin.create(keys.reduce((hash, key) => {
  hash[key] = computed('_internal.user', function() {
    return this._internal.user[key];
  }).readOnly();
  return hash;
}, {}));

export default EmberObject.extend(ModelMixin, UserPropertiesMixin, {

  token: invoke('token'),

  delete: invokePromiseReturningUndefined('delete'),
  link: invokePromiseReturningModel('link'),

  serialized: serialized(keys)

});
