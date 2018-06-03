import { getOwner } from '@ember/application';
import { onResetController } from './hooks';
import { resolveFactory } from './factory';
import { createInstance, loadInstance, isInstance } from './instance';

export const resetController = function() {
  let model = this.currentModel;
  if(!model) {
    return;
  }
  if(!isInstance(model, this.routeName)) {
    return;
  }
  model.destroy();
}

const build = (arg, mapping) => function(params) {
  onResetController(this, resetController);

  let owner = getOwner(this);
  let routeName = this.routeName;

  let { factory, requiresMapping } = resolveFactory(owner, routeName, arg);
  let instance = createInstance(factory, routeName);
  return loadInstance(instance, this, params, mapping, requiresMapping);
}

export default arg => {
  let fn = build(arg);
  fn.mapping = mapper => build(arg, mapper);
  return fn;
}
