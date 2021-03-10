import ZugletObject from '../../../../object';
import { toJSON } from '../../../util/to-json';

export default class Reference extends ZugletObject {

  store = null;
  _ref = null;

  constructor(owner, { store, _ref }) {
    super(owner);
    this.store = store;
    this._ref = _ref;
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

}
