import { A } from '@ember/array';
import { startObservingObjects, stopObservingObjects } from './object-observer';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import { get } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import MutableArray from '@ember/array/mutable';

const validate = (array, observe, delegate) => {
  assert(`array must be array or array proxy`, typeOf(array) === 'array' || ArrayProxy.detectInstance(array) || MutableArray.detect(array));
  assert(`observe must be array`, typeOf(observe) === 'array');
  assert(`delegate is required`, !!delegate);
  assert(`delegate.added must be function`, typeOf(delegate.added) === 'function');
  assert(`delegate.removed must be function`, typeOf(delegate.removed) === 'function');
  assert(`delegate.updated must be function`, typeOf(delegate.updated) === 'function');
}

export default class ArrayObserver {

  // array: Enumerable
  // observe: [ 'id', 'type' ]
  // delegate: { removed(objects, start, len), added(objects, start, len), updated(object, key) }
  constructor({ array, observe, delegate }) {
    validate(array, observe, delegate);
    this._array = array;
    this._observe = observe;
    this._delegate = delegate;
    this._enabled = get(observe, 'length') > 0;
    this.isDestroyed = false;
    this._startObserving();
  }

  //

  _startObservingObjects(objects) {
    if(!this._enabled) {
      return;
    }
    startObservingObjects(objects, this._observe, this, this._objectDidChange);
  }

  _stopObservingObjects(objects) {
    if(!this._enabled) {
      return;
    }
    stopObservingObjects(objects, this._observe, this, this._objectDidChange);
  }

  _objectDidChange(object, key) {
    this._delegate.updated(object, key);
  }

  //

  get _arrayObserverOptions() {
    return {
      willChange: this._arrayWillChange,
      didChange: this._arrayDidChange
    };
  }

  _startObserving() {
    let array = this._array;
    array.addArrayObserver(this, this._arrayObserverOptions);
    this._startObservingObjects(array);
  }

  _stopObserving() {
    let array = this._array;
    array.removeArrayObserver(this, this._arrayObserverOptions);
    this._stopObservingObjects(array);
  }

  _arrayWillChange(array, start, removeCount) {
    if(removeCount) {
      let removing = A(array.slice(start, start + removeCount));
      this._delegate.removed(removing, start, removeCount);
      this._stopObservingObjects(removing);
    }
  }

  _arrayDidChange(array, start, removeCount, addCount) {
    if(addCount) {
      let adding = A(array.slice(start, start + addCount));
      this._delegate.added(adding, start, addCount);
      this._startObservingObjects(adding);
    }
  }

  destroy() {
    if(this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;
    this._stopObserving();
  }

}
