import Model from '../base/model';
import { readOnly } from '@ember/object/computed';
import { state } from '../base/internal';
import serialized from '../../../util/serialized';

export default Model.extend({

  value: readOnly('_internal.value'),

  serialized: serialized([ ...state, 'value' ], [ 'exists', 'value' ])

});
