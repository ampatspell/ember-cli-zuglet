import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../model-mixin';
import QueryableMixin from './queryable-mixin';

export default EmberObject.extend(ModelMixin, QueryableMixin, {

  type: readOnly('_internal.type'),

  info: readOnly('_internal.stringValue'),
  serialized: readOnly('_internal.objectValue'),

  toStringExtension() {
    let info = this.get('info');
    return `${info}`;
  }

});
