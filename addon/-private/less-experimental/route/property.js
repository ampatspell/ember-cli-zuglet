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

const create = (route, params, opts) => {
  let owner = getOwner(route);
  return owner.factoryFor('zuglet:less-experimental/route/internal').create({ route, params, opts });
}

export default opts => {
  return function(params, transition) {
    onResetController(this, resetController);
    onWillDestroy(this, willDestroy);
    let internal = create(this, params, opts);
    return resolve().then(() => {
      return internal.load();
    }).then(model => {
      if(transition.isAborted) {
        internal.scheduleDestroy();
      }
      return model;
    }, err => {
      internal.scheduleDestroy();
      return reject(err);
    });
  }
}
