import { addObserver, removeObserver } from '@ember/object/observers';
import { assert } from '@ember/debug';
import { typeOf } from '@ember/utils';
import { get } from '@ember/object';

const withKeys = (keys, cb) => {
  if(!keys || keys.length === 0) {
    return;
  }
  keys.map(key => cb(key));
}

export const startObservingObject = (object, keys, target, method) => {
  if(!object) {
    return;
  }
  withKeys(keys, key => addObserver(object, key, target, method));
}

export const stopObservingObject = (object, keys, target, method) => {
  if(!object) {
    return;
  }
  withKeys(keys, key => removeObserver(object, key, target, method));
}

export const startObservingObjects = (objects, keys, target, method) => {
  objects.map(object => startObservingObject(object, keys, target, method));
}

export const stopObservingObjects = (objects, keys, target, method) => {
  objects.map(object => stopObservingObject(object, keys, target, method));
}

const validate = (object, observe, delegate) => {
  assert(`object is required`, !!object);
  assert(`observe must be array`, typeOf(observe) === 'array');
  assert(`delegate is required`, !!delegate);
  assert(`delegate.updated must be function`, typeOf(delegate.updated) === 'function');
}

export default class ObjectObserver {

  // object: EmberObject
  // observe: [ 'id', 'type' ]
  // delegate: { updated(object, key) }
  constructor({ object, observe, delegate }) {
    validate(object, observe, delegate);
    this._object = object;
    this._observe = observe;
    this._delegate = delegate;
    this._enabled = get(observe, 'length') > 0;
    this._startObserving();
  }

  _startObserving() {
    if(!this._enabled) {
      return;
    }
    startObservingObject(this._object, this._observe, this, this._objectValueForKeyDidChange);
  }

  _stopObserving() {
    if(!this._enabled) {
      return;
    }
    stopObservingObject(this._object, this._observe, this, this._objectValueForKeyDidChange);
  }

  _objectValueForKeyDidChange(object, key) {
    this._delegate.updated(object, key);
  }

  destroy() {
    this._stopObserving();
  }

}
