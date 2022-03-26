import ZugletObject from '../../../object';
import { toJSON } from '../../util/to-json';
import { registerPromise } from '../../stores/stats';
import { httpsCallable } from 'firebase/functions';

export default class FunctionsRegion extends ZugletObject {

  constructor(owner, { functions, _region }) {
    super(owner);
    this.functions = functions;
    this._region = _region;
  }

  get identifier() {
    return this._region.region;
  }

  //

  async call(name, props) {
    let callable = httpsCallable(this._region, name);
    let result = await registerPromise(this, 'call', callable(props));
    return result;
  }

  //

  get serialized() {
    let { identifier } = this;
    return {
      identifier
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.identifier}`;
  }

}
