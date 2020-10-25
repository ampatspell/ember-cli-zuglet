import EmberObject, { computed } from '@ember/object';
import { getOwner } from '../util/get-owner';

export const getStores = owner => getOwner(owner).lookup('zuglet:stores');

export default class Stores extends EmberObject {

  @computed
  get stats() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:stats').create({ stores });
  }

  createStore() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:store').create({ stores });
  }

}
