import destroyable from '../util/computed-destroyable';
import { getOwner } from '@ember/application';

const get = op => op;
const destroy = op => op.destroy();

export default (type, opts) => destroyable({
  create() {
    return getOwner(this).factoryFor(`zuglet:task/${type}`).create({ owner: this, opts });
  },
  get,
  destroy
});
