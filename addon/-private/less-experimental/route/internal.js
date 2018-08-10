import Internal from '../../internal/internal';
import ModelFactory from '../util/model-factory';
import { resolve } from 'rsvp';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';

const validate = (opts, named) => {
  assert(`opts must be object`, typeOf(opts) === 'object');
  if(!opts.named && !opts.inline) {
    opts.named = named;
  }
}

const __zuglet_route_internal = '__zuglet_route_internal';

export const getInternal = (arg, route) => {
  if(!arg) {
    return;
  }
  if(arg.__zuglet_route_internal !== true) {
    return;
  }
  let internal = arg._internal;
  if(!internal) {
    return;
  }
  if(internal.route !== route) {
    return;
  }
  return internal;
}

const keyFromRouteName = routeName => `route/${routeName.replace(/\./g, '/')}`;

export default Internal.extend({

  route: null,
  params: null,
  opts: null,

  init() {
    this._super(...arguments);
    let { route, params, opts } = this.getProperties('route', 'params', 'opts');
    let key = keyFromRouteName(route.routeName);
    validate(opts, key);
    this.modelFactory = new ModelFactory({
      parent: route,
      key,
      inline: opts.inline,
      named: opts.named,
      mapping: opts.mapping,
      delegate: {
        props: () => ({ [__zuglet_route_internal]: true, _internal: this }),
        prepare: () => [ route, params ],
        named: () => [ route, params ]
      }
    });
  },

  createModel() {
    let { model, promise } = this.modelFactory.create();
    let destroy = () => model.destroy();
    return { model, promise, destroy };
  },

  load() {
    let hash = this.model(true);
    assert(`route model is required`, !!hash.model);
    return resolve(hash.promise).then(() => hash.model);
  }

});
