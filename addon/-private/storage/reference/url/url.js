import Model, { makeStatePropertiesMixin } from '../base/model';
import { state } from './internal';
import { readOnly } from '@ember/object/computed';

const StatePropertiesMixin = makeStatePropertiesMixin(state);

export default Model.extend(StatePropertiesMixin, {

  value: readOnly('_internal.value')

});
