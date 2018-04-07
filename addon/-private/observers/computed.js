import destroyable from '../util/destroyable';
import { getOwner } from '@ember/application';

export default opts => destroyable({
  create() {
    return getOwner(this).factoryFor(`zuglet:observers`).create({ owner: this, opts });
  }
});
