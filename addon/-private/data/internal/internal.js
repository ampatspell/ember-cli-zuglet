import Internal from '../../internal/internal';
import { get } from '@ember/object';
import { isModel } from './model-mixin';

const key = '_isZugletDataInternal';

export const isInternal = arg => arg && get(arg, key) === true;

export default Internal.extend({

  [key]: true,

  serializer: null,
  manager: null,

  init() {
    this._super(...arguments);
    this.manager = this.serializer.manager;
  },

  factoryFor(name) {
    return this.serializer.factoryFor(name);
  }

});
