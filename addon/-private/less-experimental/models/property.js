import destroyable from '../../util/destroyable';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';

const get = internal => internal.model(true);
const reusable = () => false;

const create = opts => function(key) {
  let parent = this;
  let owner = getOwner(this);
  return owner.factoryFor('zuglet:less-experimental/models/internal').create({ parent, key, opts });
}

export default opts => {
  return destroyable({
    create: create(opts),
    reusable,
    get
  });
}
