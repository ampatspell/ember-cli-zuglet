import { getOwner } from '@ember/application';
import { onResetController } from './hooks';
import { getInternal } from './internal';

export const resetController = function() {
  let model = this.currentModel;
  let internal = getInternal(model, this);
  internal && internal.destroy();
}

const create = (route, params, opts) => {
  let owner = getOwner(route);
  return owner.factoryFor('zuglet:less-experimental/route/internal').create({ route, params, opts });
}

export default opts => {
  return function(params) {
    onResetController(this, resetController);
    let internal = create(this, params, opts);
    return internal.load();
  }
}
