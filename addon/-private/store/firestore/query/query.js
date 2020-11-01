import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { objectToJSON } from '../../../util/object-to-json';
import { toJSON } from '../../../util/to-json';
import { activate } from '../../../model/properties/activate';
import { defer } from '../../../util/defer';
import { registerOnSnapshot } from '../../../stores/stats';

const {
  assign
} = Object;

export default class Query extends EmberObject {

  @activate()
  content

  @tracked isLoading = false;
  @tracked isLoaded = false;
  @tracked isError = false;
  @tracked error = null;

  init() {
    super.init(...arguments);
    this._deferred = defer();
  }

  get promise() {
    return this._deferred.promise;
  }

  //

  async load(opts) {
    let { force } = assign({ force: false }, opts);
    let { isLoaded } = this;
    if(isLoaded && !force) {
      return this;
    }
    this.setProperties({ isLoading: true, isError: false, error: null });
    try {
      let snapshot = await this.ref._ref.get();
      this._onLoad(snapshot);
      this.setProperties({ isLoading: false, isLoaded: true });
      this._deferred.resolve(this);
    } catch(error) {
      this.setProperties({ isLoading: false, isError: true, error });
      this._deferred.reject(error);
      throw error;
    }
    return this;
  }

  reload() {
    return this.load({ force: true });
  }

  //

  _createDocumentForSnapshot(snapshot) {
    return this.store._createDocumentForSnapshot(snapshot, this);
  }

  _subscribeToOnSnapshot() {
    let cancel = this._cancel;
    if(!cancel) {
      this.setProperties({ isLoading: true, isError: false, error: null });
      let refresh = true;
      this._cancel = registerOnSnapshot(this, this.ref._ref.onSnapshot({ includeMetadataChanges: true }, snapshot => {
        this._onSnapshot(snapshot, refresh);
        refresh = false;
        this.setProperties({ isLoading: false, isLoaded: true })
        this._deferred.resolve(this);
      }, error => {
        this.setProperties({ isLoading: false, isError: true, error });
        this.store.onSnapshotError(this);
        this._deferred.reject(error);
      }));
    }
  }

  _unsubscribeFromOnSnapshot() {
    let { _cancel } = this;
    this._cancel = null;
    _cancel();
  }

  //

  onActivated() {
    this._isActivated = true;
    this._subscribeToOnSnapshot();
  }

  onDeactivated() {
    this._isActivated = false;
    this._unsubscribeFromOnSnapshot();
  }

  //

  get string() {
    return this.ref.string;
  }

  get serialized() {
    let { isLoading, isLoaded, isError, error, string } = this;
    return {
      isLoading,
      isLoaded,
      isError,
      error: objectToJSON(error),
      string
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.string}`;
  }

}
