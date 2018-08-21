import { getOwner } from '@ember/application';
import { onResetController, onWillDestroy } from './hooks';
import { getInternal } from './internal';
import { resolve, reject } from 'rsvp';

const destroyInternal = internal => internal && internal.destroy();

const destroyCurentModel = route => {
  let model = route.currentModel;
  let internal = getInternal(model, route);
  destroyInternal(internal);
}

const resetController = function() {
  destroyCurentModel(this);
}

const willDestroy = function() {
  destroyCurentModel(this);
}

const destroyInternalIfAborted = (internal, transition) => {
  if(!transition.isAborted) {
    return;
  }
  internal.scheduleDestroy();
}

const create = (route, params, opts) => {
  let owner = getOwner(route);
  return owner.factoryFor('zuglet:less-experimental/route/internal').create({ route, params, opts });
}

export default opts => {
  return function(params, transition) {
    onResetController(this, resetController);
    onWillDestroy(this, willDestroy);
    let internal = create(this, params, opts);
    return resolve(internal.load()).then(model => {
      destroyInternalIfAborted(internal, transition);
      return model;
    }, err => {
      destroyInternalIfAborted(internal, transition);
      return reject(err);
    });
  }
}
