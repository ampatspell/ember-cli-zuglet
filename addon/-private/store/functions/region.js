import EmberObject from '@ember/object';

export default class FunctionsRegion extends EmberObject {

  get region() {
    return this._region.region;
  }

  //

  async call(name, props) {
    let callable = this._region.httpsCallable(name);
    let result = await callable(props);
    return result;
  }

  //

  get serialized() {
    let { region } = this;
    return {
      region
    };
  }

  toStringExtension() {
    return `${this.region}`;
  }

}
