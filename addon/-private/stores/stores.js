import EmberObject, { computed } from '@ember/object';
import { getOwner } from '../util/get-owner';

export default class Stores extends EmberObject {

  @computed
  get stats() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:stores/stats').create({ stores });
  }

  @computed
  get models() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:stores/models').create({ stores });
  }

  createStore() {
    let stores = this;
    return getOwner(this).factoryFor('zuglet:store').create({ stores });
  }

}
