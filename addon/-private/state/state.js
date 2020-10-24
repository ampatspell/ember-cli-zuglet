import EmberObject from '@ember/object';
import { associateDestroyableChild } from '@ember/destroyable';

export default class State extends EmberObject {

  owner = null
  properties = Object.create(null);

  init() {
    super.init(...arguments);
    associateDestroyableChild(this.owner, this);
  }

  getProperty(key, create) {
    let property = this.properties[key];
    if(!property && create) {
      property = create();
      associateDestroyableChild(this, property);
      this.properties[key] = property;
    }
    return property;
  }

}
