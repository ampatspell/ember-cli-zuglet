import destroyable from '../../util/destroyable';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

const reusable = () => true;
const get = internal => internal.getObservable();
const set = (internal, value) => internal.setObservable(value);

const create = function() {
  let owner = getOwner(this);
  assert(`observed computed property works only in instances created by container`, !!owner);
  return owner.factoryFor('zuglet:computed/observed/internal').create();
}

export default () => destroyable({ reusable, create, get, set });
