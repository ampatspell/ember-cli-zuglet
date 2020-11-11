import EmberObject from '@ember/object';
import { objectToJSON } from '../../../util/object-to-json';
import { toJSON } from '../../../util/to-json';
import { activate } from '../../../model/properties/activate';
import { defer } from '../../../util/defer';
import { registerOnSnapshot } from '../../../stores/stats';
import { isFastBoot } from '../../../util/fastboot';
import { state, readable }  from '../../../model/tracking/state';

const {
  assign
} = Object;

export default class Query extends EmberObject {

  @activate()
  content

  @state _state
  @readable isLoading = false;
  @readable isLoaded = false;
  @readable isError = false;
  @readable error = null;

  _isPassive = false
  _reusable

  init() {
    super.init(...arguments);
    this._deferred = defer();
  }

  //

  get isPassive() {
    return isFastBoot(this) || this._isPassive;
  }

  passive() {
    this._isPassive = true;
    return this;
  }

  //

  get promise() {
    return this._deferred.promise;
  }

  //

  async load(opts) {
    let { force } = assign({ force: false }, opts);
    let { isLoaded } = this._state.untracked.getProperties('isLoaded');
    if(isLoaded && !force) {
      return this;
    }
    this._state.setProperties({ isLoading: true, isError: false, error: null });
    try {
      let snapshot = await this.ref._ref.get();
      this._onLoad(snapshot);
      this._state.setProperties({ isLoading: false, isLoaded: true });
      this._deferred.resolve(this);
    } catch(error) {
      this._state.setProperties({ isLoading: false, isError: true, error });
      this._deferred.reject(error);
      throw error;
    }
    return this;
  }

  reload() {
    return this.load({ force: true });
  }

  //

  register(doc) {
    let { _reusable } = this;
    if(!_reusable) {
      _reusable = [];
      this._reusable = _reusable;
    }
    if(!_reusable.includes(doc)) {
      _reusable.push(doc);
    }
  }

  //

  _reusableDocumentForSnapshot(snapshot) {
    let { _reusable } = this;
    if(_reusable) {
      let path = snapshot.ref.path;
      let doc = _reusable.find(doc => doc.path === path);
      if(doc) {
        _reusable.splice(_reusable.indexOf(doc), 1);
      }
      return doc;
    }
  }

  _createDocumentForSnapshot(snapshot) {
    let doc = this._reusableDocumentForSnapshot(snapshot);
    if(doc) {
      return doc._onReused(this, snapshot, { source: 'subscription' });
    }
    return this.store._createDocumentForSnapshot(snapshot, this);
  }

  _subscribeToOnSnapshot() {
    if(this.isPassive) {
      this.load().then(() => {}, err => this.store.onSnapshotError(this, err));
    } else {
      let cancel = this._cancel;
      if(!cancel) {
        this._state.setProperties({ isLoading: true, isError: false, error: null });
        let refresh = true;
        this._cancel = registerOnSnapshot(this, this.ref._ref.onSnapshot({ includeMetadataChanges: false }, snapshot => {
          this._onSnapshot(snapshot, refresh);
          refresh = false;
          this._state.setProperties({ isLoading: false, isLoaded: true })
          this._deferred.resolve(this);
        }, error => {
          this._state.setProperties({ isLoading: false, isError: true, error });
          this.store.onSnapshotError(this);
          this._deferred.reject(error);
        }));
      }
    }
  }

  _unsubscribeFromOnSnapshot() {
    let { _cancel } = this;
    if(_cancel) {
      this._cancel = null;
      _cancel();
    }
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
