import destroyable from '../util/destroyable';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';

export default opts => destroyable({
  create() {
    return getOwner(this).factoryFor(`zuglet:observers/internal`).create({ owner: this, opts });
  }
});

export const observers = (key='observers') => computed(function() {
  let internal = this.get(`_internal.${key}`);
  return internal && internal.model(true);
}).readOnly();
