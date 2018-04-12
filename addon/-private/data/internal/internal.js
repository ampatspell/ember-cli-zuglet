import Internal from '../../internal/internal';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { isModel } from './model-mixin';

const key = '_isZugletDataInternal';

export const isInternal = arg => arg && get(arg, key) === true;

export default Internal.extend({

  [key]: true,

  serializer: null,
  manager: null,

  parent: null,

  init() {
    this._super(...arguments);
    this.manager = this.serializer.manager;
  },

  factoryFor(name) {
    return this.serializer.factoryFor(name);
  },

  attach(parent) {
    assert(`parent must be data internal`, isInternal(parent));
    this.parent = parent;
  },

  detach() {
    this.parent = null;
  },

  isAttached() {
    return !!this.parent;
  }

});
