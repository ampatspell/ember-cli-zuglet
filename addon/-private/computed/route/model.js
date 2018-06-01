import { createLoadedModel, isModelForRouteName } from './util';
import { onResetController } from './hooks';

const resetController = function(/*controller, isExiting, transition */) {
  let model = this.currentModel;
  if(!model) {
    return;
  }
  if(!isModelForRouteName(model, this.routeName)) {
    return;
  }
  model.destroy();
}

export default arg => function(params) {
  onResetController(this, resetController);
  return createLoadedModel(this, params, arg);
}
