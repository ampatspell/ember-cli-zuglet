import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  type: readOnly('_internal.type'),

});
