import ArrayProxy from '@ember/array/proxy';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';

export default ArrayProxy.extend(ModelMixin, {

  content: readOnly('_internal.models')

});
