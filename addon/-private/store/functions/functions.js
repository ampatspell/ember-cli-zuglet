import 'firebase/compat/functions';
import ZugletObject from '../../object';
import { cached } from '../../model/decorators/cached';
import { toJSON } from '../../util/to-json';
import { getFactory } from '../../factory/get-factory';
import { getFunctions } from 'firebase/functions';

export default class Functions extends ZugletObject {

  constructor(owner, { store }) {
    super(owner);
    this.store = store;
  }

  _maybeSetupEmulator(functions) {
    window.functions = functions;
    let emulators = this.store.normalizedOptions.emulators;
    if(emulators.functions) {
      functions.useEmulator(emulators.functions.host, emulators.functions.port);
    }
    return functions;
  }

  @cached()
  get _defaultRegion() {
    let { store: { firebase, options: { functions } } } = this;
    let region = functions && functions.region;
    if(!region) {
      return this._maybeSetupEmulator(getFunctions(firebase));
    }
    return this._maybeSetupEmulator(getFunctions(firebase, region));
  }

  _functions(region) {
    if(!region) {
      return this._defaultRegion;
    }
    return this._maybeSetupEmulator(getFunctions(this.store.firebase, region));
  }

  region(region) {
    let functions = this;
    let _region = this._functions(region);
    return getFactory(this).zuglet.create('store/functions/region', { functions, _region });
  }

  call() {
    return this.region().call(...arguments);
  }

  //

  get serialized() {
    let region = this._defaultRegion._region;
    let serialized = {
      region
    };
    let emulator = this.store.normalizedOptions.emulators.functions;
    if(emulator) {
      serialized.emulator = emulator;
    }
    return serialized;
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this._defaultRegion._region}`;
  }

}
