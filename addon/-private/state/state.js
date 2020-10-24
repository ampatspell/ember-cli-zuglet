import EmberObject from '@ember/object';

export default class State extends EmberObject {

  owner = null
  properties = Object.create(null);

  getProperty(key, create) {
    let property = this.properties[key];
    if(!property && create) {
      property = create();
      this.properties[key] = property;
    }
    return property;
  }

}
