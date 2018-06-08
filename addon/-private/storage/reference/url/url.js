import Model, { makeStatePropertiesMixin } from '../base/model';
import { state } from './internal';

const StatePropertiesMixin = makeStatePropertiesMixin(state);

export default Model.extend(StatePropertiesMixin, {
});
