import { createModel, loadModel, isModelForRouteName } from './util';
import { onResetController } from './hooks';

const resetController = function() {
  let model = this.currentModel;
  if(!model) {
    return;
  }
  if(!isModelForRouteName(model, this.routeName)) {
    return;
  }
  model.destroy();
}

const createOptionsForPrepare = (route, params, prepare) => {
  if(typeof prepare === 'function') {
    return prepare.call(null, route, params);
  }
  return { route, params };
}

export default (arg, prepare) => function(params) {
  onResetController(this, resetController);
  let model = createModel(this, params, arg);
  let opts = createOptionsForPrepare(this, params, prepare);
  return loadModel(model, opts);
}
