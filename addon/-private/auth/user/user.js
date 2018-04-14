import EmberObject, { computed } from '@ember/object';
import ModelMixin from '../../internal/model-mixin';
import Mixin from '@ember/object/mixin';
import { invokePromiseReturningUndefined } from '../../internal/invoke';

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

  delete: invokePromiseReturningUndefined('delete')

});
