import EmberObject from '@ember/object';
import { object, raw } from '../../model/properties/object';
import { tracked } from '@glimmer/tracking';
import { objectToJSON } from '../../util/object-to-json';
import { assert } from '@ember/debug';
import { defer } from '../../util/defer';
import { registerOnSnapshot } from '../../stores/stats';

const {
  assign
} = Object;

export default class Document extends EmberObject {

  @object()
  data

  @raw('data')
  _data

  @tracked isNew = false;
  @tracked isLoading = false;
  @tracked isLoaded = false;
  @tracked isSaving = false;
  @tracked isDirty = true;
  @tracked isError = false;
  @tracked error = null;
  @tracked exists = undefined;

  init(opts) {
    let { snapshot, data } = opts;
    delete opts.snapshot;
    super.init(...arguments);
    this._deferred = defer();
    if(snapshot) {
      this._onSnapshot(snapshot, true);
    } else if(data) {
      this.data = data;
      this.isNew = true;
      this.isDirty = true;
    } else {
      this.data = {};
    }
  }

  //

  get id() {
    return this.ref.id;
  }

  get path() {
    return this.ref.path;
  }

  get promise() {
    return this._deferred.promise;
  }

  //

  _dataDidChange() {
    this.isDirty = true;
  }

  _setData(data) {
    assert('data must be object', data instanceof Object);
    this.data = data;
  }

  _onSnapshot(snapshot, first) {
    let { exists } = snapshot;
    if(exists) {
      this._setData(snapshot.data({ serverTimestamps: 'estimate' }));
    } else if(first && !exists) {
      this._setData({});
    }
    this.setProperties({ isNew: false, isLoading: false, isLoaded: true, isDirty: false, exists });
  }

  //

  async load(opts) {
    let { force } = assign({ force: false }, opts);
    let { isLoaded } = this;
    if(isLoaded && !force) {
      return this;
    }
    this.setProperties({ isNew: false, isLoading: true, isError: false, error: null });
    try {
      let snapshot = await this.ref._ref.get();
      this._onSnapshot(snapshot);
      this._maybeSubscribeToOnSnapshot();
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

  async save(opts) {
    let { force, merge } = assign({ force: false, merge: false }, opts);
    let { isDirty } = this;
    if(!isDirty && !force) {
      return this;
    }
    this.setProperties({ isSaving: true, isError: false, error: null });
    try {
      await this.ref._ref.set(this._data, { merge });
      this.setProperties({ isNew: false, isSaving: false, isDirty: false, exists: true });
      this._maybeSubscribeToOnSnapshot();
      this._deferred.resolve(this);
    } catch(error) {
      this.setProperties({ isSaving: false, isError: true, error });
      throw error;
    }
    return this;
  }

  async delete() {
    this.setProperties({ isSaving: true, isError: false, error: null });
    try {
      await this.ref._ref.delete();
      this.setProperties({ isSaving: false, exists: false });
      this._maybeSubscribeToOnSnapshot();
    } catch(error) {
      this.setProperties({ isSaving: false, isError: true, error });
      throw error;
    }
    return this;
  }

  //

  // TODO: issue with current firebase js sdk
  _shouldIgnoreSnapshot(snapshot) {
    return this.isSaving && !snapshot.metadata.hasPendingWrites;
  }

  _subscribeToOnSnapshot() {
    let { isLoaded } = this;

    if(!isLoaded) {
      this.setProperties({ isLoading: true, isError: false, error: null });
    }

    this._cancel = registerOnSnapshot(this, this.ref._ref.onSnapshot({ includeMetadataChanges: true }, snapshot => {
      if(this._shouldIgnoreSnapshot(snapshot)) {
        return;
      }
      this._onSnapshot(snapshot);
      this._deferred.resolve(this);
    }, error => {
      this.setProperties({ isLoading: false, isError: true, error });
      this.store.onSnapshotError(this);
      this._deferred.reject(error);
    }));
  }

  _shouldSubscribeToOnSnapshot() {
    if(this.parent) {
      return false;
    }
    if(!this._isActivated) {
      return false;
    }
    if(this._cancel) {
      return false;
    }
    if(this.isNew) {
      return false;
    }
    return true;
  }

  _maybeSubscribeToOnSnapshot() {
    if(!this._shouldSubscribeToOnSnapshot()) {
      return;
    }
    this._subscribeToOnSnapshot();
  }

  _unsubscribeFromOnSnapshot() {
    let { _cancel } = this;
    if(_cancel) {
      this._cancel = null;
      _cancel();
    }
  }

  _onDeleted() {
    this.setProperties({ exists: false });
  }

  //

  onActivated() {
    this._isActivated = true;
    this._maybeSubscribeToOnSnapshot();
  }

  onDeactivated() {
    this._isActivated = false;
    this._unsubscribeFromOnSnapshot();
  }

  //

  get serialized() {
    let { id, path, isDirty, isNew, isLoading, isLoaded, isSaving, isError, error, exists, _data } = this;
    return {
      id,
      path,
      isDirty,
      isNew,
      isLoading,
      isLoaded,
      isSaving,
      isError,
      error: objectToJSON(error),
      exists,
      data: objectToJSON(_data)
    };
  }

  toStringExtension() {
    return `${this.path}`;
  }

}
