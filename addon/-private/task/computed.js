import destroyable from '../util/computed-destroyable';
import { getOwner } from '@ember/application';

export default (type, opts) => destroyable({
  create() {
    return getOwner(this).factoryFor(`zuglet:task/${type}`).create({ owner: this, opts });
  }
});
