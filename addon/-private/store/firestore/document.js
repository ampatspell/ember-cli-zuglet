import EmberObject from '@ember/object';
import { object, raw } from '../../model/properties/object';
import { tracked } from '@glimmer/tracking';
import { objectToJSON } from '../../util/object-to-json';
import { assert } from '@ember/debug';
import { defer } from '../../util/defer';

const {
  assign
} = Object;

export default class Document extends EmberObject {

  @object({ onChange: doc => doc._dataDidChange() })
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
      console.log('has snapshot')
      // this._onSnapshot(snapshot, false);
    } else if(data) {
      this.data = data;
      this.isNew = true;
      this.isDirty = true;
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

  _onSnapshot(snapshot) {
    let { exists } = snapshot;
    if(exists) {
      this._setData(snapshot.data({ serverTimestamps: 'estimate' }));
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
      // this._maybeSubscribeToOnSnapshot();
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
      this.setProperties({ isNew: false, isSaving: false, exists: true });
      // this._maybeSubscribeToOnSnapshot();
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
      // this._maybeSubscribeToOnSnapshot();
    } catch(error) {
      this.setProperties({ isSaving: false, isError: true, error });
      throw error;
    }
    return this;
  }

  // _onDeleted() {
  //   this.setProperties({ exists: false });
  // }

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

}
