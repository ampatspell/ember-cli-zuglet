import EmberObject, { computed } from '@ember/object';
import { getOwner } from '../util/get-owner';
import { getStats } from './stats';

export default class Stores extends EmberObject {

  @computed
  get stats() {
    return getStats(this);
  }

  createStore() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:store').create({ stores });
  }

}
