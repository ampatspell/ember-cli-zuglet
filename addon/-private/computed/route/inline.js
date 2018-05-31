import { createLoadedModel } from './util';

export default arg => function(params) {
  return createLoadedModel(this, params, arg);
}
