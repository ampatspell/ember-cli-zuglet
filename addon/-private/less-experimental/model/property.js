import destroyable from '../../util/destroyable';
import { getOwner } from '@ember/application';

const get = internal => internal.model(true);
const reusable = () => true;

const create = opts => function(key) {
  let parent = this;
  let owner = getOwner(this);
  return owner.factoryFor('zuglet:less-experimental/model/internal').create({ parent, key, opts });
}

export default opts => {
  return destroyable({
    create: create(opts),
    reusable,
    get
  });
}
