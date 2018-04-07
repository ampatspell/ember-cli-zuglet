import destroyable from '../util/destroyable';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

export default (type, parentKey) => destroyable({
  create() {
    let parent;
    if(parentKey) {
      parent = this.get(parentKey);
      assert(`parent ${parentKey} is not set`, !!parent);
    }
    return getOwner(this).factoryFor(`zuglet:queue/${type}`).create({ owner: this, parent });
  }
});
