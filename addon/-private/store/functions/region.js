import ZugletObject from '../../../object';
import { toJSON } from '../../util/to-json';
import { registerPromise } from '../../stores/stats';

export default class FunctionsRegion extends ZugletObject {

  constructor(owner, { functions, _region }) {
    super(owner);
    this.functions = functions;
    this._region = _region;
  }

  get identifier() {
    return this._region._region;
  }

  //

  async call(name, props) {
    let callable = this._region.httpsCallable(name);
    let result = await registerPromise(this, 'call', false, callable(props));
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
