import { computed, get } from '@ember/object';
import Mixin from '@ember/object/mixin';

const key = '_isZugletDataModel';

export const isModel = arg => arg && get(arg, key) === true;

export default Mixin.create({

  [key]: true,

  serialized: computed(function() {
    return this._internal.serialize('model');
  }).readOnly()

});
