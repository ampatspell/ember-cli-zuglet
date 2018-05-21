import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../../internal/model-mixin';
import DataModelMixin from '../internal/model-mixin';

export default EmberObject.extend(ModelMixin, DataModelMixin, {

  isTimestamp:       readOnly('_internal.isTimestamp'),
  isServerTimestamp: readOnly('_internal.isServerTimestamp'),
  date:              readOnly('_internal.date'),
  dateTime:          readOnly('_internal.dateTime'),

});
