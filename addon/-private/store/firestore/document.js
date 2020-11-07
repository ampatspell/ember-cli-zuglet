import EmberObject from '@ember/object';
import { object, raw } from '../../model/properties/object';
import { tracked } from '@glimmer/tracking';
import { objectToJSON } from '../../util/object-to-json';
import { toJSON } from '../../util/to-json';
import { assert } from '@ember/debug';
import { defer } from '../../util/defer';
import { registerOnSnapshot } from '../../stores/stats';
import { cached } from '../../model/decorators/cached';
import { randomString } from '../../util/random-string';
import { Listeners } from '../../util/listeners';
import { isFastBoot } from '../../util/fastboot';

const {
  assign
} = Object;

export const isDocument = arg => arg instanceof Document;

export default class Document extends EmberObject {

  @object().onDirty(owner => owner._dataDidChange())
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

  _isPassive = false

  init(opts) {
    let { snapshot, data } = opts;
    delete opts.snapshot;
    super.init(...arguments);
    this._listeners = new Listeners();
    this._deferred = defer();
    if(snapshot) {
      this._onSnapshot(snapshot, { source: 'initial' });
    } else if(data) {
      this.data = data;
      this.isNew = true;
      this.isDirty = true;
    } else {
      this.data = {};
    }
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

  @cached()
  get token() {
    return randomString(20);
  }

  //

  onData(fn) {
    return this._listeners.register('onData', fn);
  }

  onDeleted(fn) {
    return this._listeners.register('onDeleted', fn);
  }

  //

  _dataDidChange() {
    this.isDirty = true;
  }

  _setData(data) {
    assert('data must be object', data instanceof Object);
    this.data = data;
  }

  _shouldApplySnapshotData(data) {
    let token = data._token;
    delete data._token;
    return this.token !== token;
  }

  _onSnapshot(snapshot, opts) {
    let { source } = opts || {};
    let { exists } = snapshot;
    let notify;
    if(exists) {
      let data = snapshot.data({ serverTimestamps: 'estimate' });
      if(this._shouldApplySnapshotData(data)) {
        this._setData(data);
        notify = 'onData';
      }
    } else {
      if(source === 'initial') {
        this._setData({});
      } else if(source === 'subscription') {
        if(this.exists) {
          notify = 'onDeleted';
        }
      }
    }
    this.setProperties({ isNew: false, isLoading: false, isLoaded: true, isDirty: false, exists });
    if(notify) {
      this._listeners.notify(notify, this);
    }
  }

  //

  async _loadInternal(get, opts) {
    let { force } = assign({ force: false }, opts);
    let { isLoaded, isNew } = this;
    if((isLoaded || isNew) && !force) {
      return this;
    }
    this.setProperties({ isLoading: true, isError: false, error: null });
    try {
      let snapshot = await get(this.ref._ref);
      this._onSnapshot(snapshot, { source: 'load' });
      this._maybeSubscribeToOnSnapshot();
      this._deferred.resolve(this);
    } catch(error) {
      this.setProperties({ isNew: false, isLoading: false, isError: true, error });
      this._deferred.reject(error);
      throw error;
    }
    return this;
  }

  load(opts) {
    return this._loadInternal(ref => ref.get(), opts);
  }

  reload() {
    return this.load({ force: true });
  }

  _normalizeSaveOptions(opts) {
    let { merge, token, force } = assign({ force: false, merge: false, token: false }, opts);
    let { isDirty } = this;
    let skip = !isDirty && !force;
    return {
      skip,
      merge,
      token
    };
  }

  _saveData(token) {
    let data = this._data;
    if(token) {
      data._token = this.token;
    }
    return data;
  }

  _willSave() {
    this.setProperties({ isSaving: true, isError: false, error: null });
  }

  _didSave() {
    this.setProperties({ isNew: false, isSaving: false, isDirty: false, exists: true });
    this._maybeSubscribeToOnSnapshot();
    this._deferred.resolve(this);
  }

  _saveDidFail(error) {
    this.setProperties({ isSaving: false, isError: true, error });
  }

  async _saveInternal(set, opts) {
    let { skip, merge, token } = this._normalizeSaveOptions(opts);
    if(skip) {
      return this;
    }
    this._willSave();
    try {
      let data = this._saveData(token);
      await set(this.ref._ref, data, { merge });
      this._didSave();
    } catch(error) {
      this._saveDidFail(error);
      throw error;
    }
    return this;
  }

  _batchSave(batch, opts) {
    let { skip, merge, token } = this._normalizeSaveOptions(opts);
    if(skip) {
      return;
    }
    this._willSave();
    let data = this._saveData(token);
    batch.set(this.ref._ref, data, { merge });
    return {
      resolve: () => this._didSave(),
      reject: err => this._saveDidFail(err)
    };
  }

  save(opts) {
    return this._saveInternal((ref, data, opts) => ref.set(data, opts), opts);
  }

  _willDelete() {
    this.setProperties({ isSaving: true, isError: false, error: null });
  }

  _didDelete() {
    this.setProperties({ isSaving: false, exists: false });
    this._maybeSubscribeToOnSnapshot();
  }

  _deleteDidFail(error) {
    this.setProperties({ isSaving: false, isError: true, error });
  }

  async _deleteInternal(del) {
    this._willDelete();
    try {
      await del(this.ref._ref);
      this._didDelete();
    } catch(error) {
      this._deleteDidFail(error);
      throw error;
    }
    return this;
  }

  _batchDelete(batch) {
    this._willDelete();
    batch.delete(this.ref._ref);
    return {
      resolve: () => this._didDelete(),
      reject: err => this._deleteDidFail(err)
    }
  }

  delete() {
    return this._deleteInternal(ref => ref.delete());
  }

  //

  _subscribeToOnSnapshot() {
    if(this.isPassive) {
      this.load().then(() => {}, err => this.store.onSnapshotError(this, err));
    } else {
      let { isLoaded } = this;
      if(!isLoaded) {
        this.setProperties({ isLoading: true, isError: false, error: null });
      }
      this._cancel = registerOnSnapshot(this, this.ref._ref.onSnapshot({ includeMetadataChanges: false }, snapshot => {
        this._onSnapshot(snapshot, { source: 'subscription' });
        this._deferred.resolve(this);
      }, error => {
        this.setProperties({ isLoading: false, isError: true, error });
        this.store.onSnapshotError(this);
        this._deferred.reject(error);
      }));
    }
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

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.path}`;
  }

}
