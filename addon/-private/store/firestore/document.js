import ZugletObject from '../../../object';
import { object, raw, update } from '../../model/properties/object';
import { objectToJSON } from '../../util/object-to-json';
import { toJSON } from '../../util/to-json';
import { assert } from '@ember/debug';
import { cachedRemoteDefer, replaceCachedRemoteDefer } from '../../util/defer';
import { snapshotToDeferredType } from '../../util/snapshot';
import { registerObserver, registerPromise } from '../../stores/stats';
import { cached } from '../../model/decorators/cached';
import { randomString } from '../../util/random-string';
import { Listeners } from '../../util/listeners';
import { isFastBoot } from '../../util/fastboot';
import { state, readable } from '../../model/tracking/state';
import { isServerTimestamp } from '../../util/types';

const {
  assign
} = Object;

export const isDocument = arg => arg instanceof Document;

const noop = () => {};

export default class Document extends ZugletObject {

  @object().onDirty(owner => owner._dataDidChange())
  data;

  @raw('data')
  _data;

  @state _state;
  @readable isNew = false;
  @readable isLoading = false;
  @readable isLoaded = false;
  @readable isSaving = false;
  @readable isDirty = true;
  @readable isError = false;
  @readable error = null;
  @readable exists = undefined;

  _isPassive = false;

  constructor(owner, { store, ref, snapshot, parent, data }) {
    super(owner);
    this.store = store;
    this.ref = ref;
    this.parent = parent;
    this._listeners = new Listeners();
    this._deferred = cachedRemoteDefer(this);
    if(data) {
      this.data = data;
      this._state.untracked.setProperties({ isNew: true, isDirty: true });
    } else {
      this.data = {};
      if(snapshot) {
        this._onSnapshot(snapshot, { source: 'initial' });
        this._deferred.resolve(snapshotToDeferredType(snapshot), this);
      }
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
    return this._deferred;
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
    this._state.setProperties({ isDirty: true });
  }

  @update('data')
  __setData;

  _setData(data) {
    assert('data must be object', data instanceof Object);
    this.__setData(data);
  }

  _shouldApplySnapshotData(data) {
    let token = data._token;
    delete data._token;
    return this.token !== token;
  }

  // TODO: replace this with partial updates in tracking/data
  _applyPartialSnapshotData(next) {
    let applied = false;
    let { data } = this;
    for(let key in next) {
      let curr = data[key];
      if(isServerTimestamp(curr)) {
        data[key] = next[key];
        applied = true;
      }
    }
    return applied;
  }

  _onSnapshot(snapshot, opts) {
    this._snapshot = snapshot;
    let { source } = opts || {};
    let { exists } = snapshot;
    let notify;
    if(exists) {
      let data = snapshot.data({ serverTimestamps: 'estimate' });
      if(this._shouldApplySnapshotData(data)) {
        this._setData(data);
        notify = 'onData';
      } else if(this._applyPartialSnapshotData(data)) {
        notify = 'onData';
      }
    } else {
      if(source === 'initial') {
        this._setData({});
      } else if(source === 'subscription') {
        if(this.exists !== false) {
          notify = 'onDeleted';
        }
      }
    }
    this._state.setProperties({ isNew: false, isLoading: false, isLoaded: true, isDirty: false, exists });
    if(notify) {
      this._listeners.notify(notify, this);
    }
  }

  _onReused(parent, snapshot, opts) {
    assert(`Document ${this} already have a parent`, !this.parent);
    this.parent = parent;
    this._onSnapshot(snapshot, opts);
    this._onSnapshotMetadata(snapshot);
    return this;
  }

  //

  _onSnapshotMetadata(snapshot) {
    this._deferred.resolve(snapshotToDeferredType(snapshot), this);
  }

  async _loadInternal(get, opts) {
    let { force } = assign({ force: false }, opts);
    let { isLoaded, isNew } = this._state.untracked.getProperties('isLoaded', 'isNew');
    if((isLoaded || isNew) && !force) {
      return this;
    }
    this._state.setProperties({ isLoading: true, isError: false, error: null });
    try {
      let snapshot = await registerPromise(this, 'load', true, get(this.ref._ref));
      this._onSnapshot(snapshot, { source: 'load' });
      this._onSnapshotMetadata(snapshot);
      this._maybeSubscribeToOnSnapshot();
    } catch(error) {
      this._state.setProperties({ isNew: false, isLoading: false, isError: true, error });
      this._deferred.reject('remote', error);
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
    let { isDirty } = this._state.untracked.getProperties('isDirty');
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
    let isDirty = this._state.untracked.get('isDirty');
    this._state.setProperties({ isDirty: false, isSaving: true, isError: false, error: null });
    return { isDirty };
  }

  _didSave() {
    this._state.setProperties({ isNew: false, isLoaded: true, isSaving: false, exists: true });
    this._deferred.resolve('remote', this);
    this._maybeSubscribeToOnSnapshot();
  }

  _saveDidFail(state, error) {
    let isDirty = state.isDirty || this._state.untracked.get('isDirty');
    this._state.setProperties({ isSaving: false, isError: true, isDirty, error });
  }

  async _saveInternal(set, opts) {
    let { skip, merge, token } = this._normalizeSaveOptions(opts);
    if(skip) {
      return this;
    }
    let state = this._willSave();
    try {
      let data = this._saveData(token);
      await registerPromise(this, 'save', true, set(this.ref._ref, data, { merge }));
      this._didSave();
    } catch(error) {
      this._saveDidFail(state, error);
      throw error;
    }
    return this;
  }

  _batchSave(batch, opts) {
    let { skip, merge, token } = this._normalizeSaveOptions(opts);
    if(skip) {
      return {
        resolve: noop,
        reject: noop
      };
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
    this._state.setProperties({ isSaving: true, isError: false, error: null });
  }

  _didDelete() {
    this._state.setProperties({ isSaving: false, exists: false });
    this._maybeSubscribeToOnSnapshot();
  }

  _deleteDidFail(error) {
    this._state.setProperties({ isSaving: false, isError: true, error });
  }

  async _deleteInternal(del) {
    this._willDelete();
    try {
      await registerPromise(this, 'delete', true, del(this.ref._ref));
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
      let { isLoaded } = this._state.untracked.getProperties('isLoaded');
      if(!isLoaded) {
        replaceCachedRemoteDefer(this, '_deferred');
        this.load().then(() => {}, err => this.store.onObserverError(this, err));
      }
    } else {
      let { isLoaded } = this._state.untracked.getProperties('isLoaded');
      if(!isLoaded) {
        this._state.setProperties({ isLoading: true, isError: false, error: null });
      }
      replaceCachedRemoteDefer(this, '_deferred', true);
      this._cancel = registerObserver(this, wrap => {
        return this.ref._ref.onSnapshot({ includeMetadataChanges: true }, wrap(snapshot => {
          this._onSnapshot(snapshot, { source: 'subscription' });
          this._deferred.resolve(snapshotToDeferredType(snapshot), this);
        }), wrap(error => {
          this._state.setProperties({ isLoading: false, isError: true, error });
          this.store.onObserverError(this, error);
          this._deferred.reject('remote', error);
        }));
      });
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
    let { isNew } = this._state.untracked.getProperties('isNew');
    if(isNew) {
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
    this._state.setProperties({ exists: false });
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

  get dashboardURL() {
    return this.ref.dashboardURL;
  }

  openDashboard() {
    this.ref.openDashboard();
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

  toStringExtension() {
    return `${this.path}`;
  }

}
