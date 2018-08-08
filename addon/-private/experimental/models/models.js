import EmberObject from '@ember/object';
import ModelMixin from '../../internal/model-mixin';
import { readOnly } from '@ember/object/computed';

export default EmberObject.extend(ModelMixin, {

  content: readOnly('_internal.models')

});
