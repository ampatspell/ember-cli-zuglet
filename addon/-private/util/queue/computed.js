import destroyable from '../computed-destroyable';
import { getOwner } from '@ember/application';

export default () => destroyable({
  create() {
    return getOwner(this).factoryFor(`zuglet:queue`).create({ owner: this });
  }
});
