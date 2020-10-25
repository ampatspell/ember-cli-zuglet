import 'firebase/functions';
import EmberObject, { computed } from '@ember/object';
import { getOwner } from '../../util/get-owner';

export default class Functions extends EmberObject {

  @computed()
  get _defaultRegion() {
    let { store: { firebase, options: { functions } } } = this;
    let region = functions && functions.region;
    if(!region) {
      return firebase.functions();
    }
    return firebase.functions(region);
  }

  _functions(region) {
    if(!region) {
      return this._defaultRegion;
    }
    return this.store.firebase.functions(region);
  }

  region(region) {
    let functions = this;
    let _region = this._functions(region);
    return getOwner(this).factoryFor('zuglet:store/functions/region').create({ functions, _region });
  }

  call() {
    return this.region().call(...arguments);
  }

  //

  get serialized() {
    let region = this._defaultRegion.region;
    return {
      region
    };
  }

  toStringExtension() {
    return `${this._defaultRegion.region}`;
  }

}
