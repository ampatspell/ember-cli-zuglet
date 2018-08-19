import { getOwner } from '@ember/application';
import { onResetController } from './hooks';
import { getInternal } from './internal';
import { resolve } from 'rsvp';

const destroyInternal = internal => {
  internal && internal.destroy();
}

export const resetController = function() {
  let model = this.currentModel;
  let internal = getInternal(model, this);
  destroyInternal(internal);
}

const create = (route, params, opts) => {
  let owner = getOwner(route);
  return owner.factoryFor('zuglet:less-experimental/route/internal').create({ route, params, opts });
}

export default opts => {
  return function(params, transition) {
    onResetController(this, resetController);
    let internal = create(this, params, opts);
    let promise = resolve(internal.load());
    promise.catch(() => {}).finally(() => {
      if(!transition.isAborted) {
        return;
      }
      destroyInternal(internal);
    });
    return promise;
  }
}
