import { createModel, loadModel, resetController } from './util';
import { onResetController } from './hooks';

// inline(function(route, params) {
//   this: model
// })

// inline({
//   prepare(route, params) {
//   }
// })

export default arg => function(params) {
  onResetController(this, resetController);
  let model = createModel(this, params, arg);
  return loadModel(model, [ this, params ]);
}
