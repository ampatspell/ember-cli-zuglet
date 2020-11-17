import EmberObject from '@ember/object';
import { toJSON } from '../../util/to-json';
import { registerPromise } from '../../stores/stats';

export default class FunctionsRegion extends EmberObject {

  get region() {
    return this._region.region;
  }

  //

  async call(name, props) {
    let callable = this._region.httpsCallable(name);
    let result = await registerPromise(this, 'call', callable(props));
    return result;
  }

  //

  get serialized() {
    let { region } = this;
    return {
      region
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.region}`;
  }

}
