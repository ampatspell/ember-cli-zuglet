import Internal from '../../internal/internal';
import { get } from '@ember/object';
import { assert } from '@ember/debug';
import { toInternal } from './util';
import withPropertyChanges from '../../internal/with-property-changes';

const key = '_isZugletDataInternal';

export const isInternal = arg => arg && get(arg, key) === true;

export default Internal.extend({

  [key]: true,

  serializer: null,
  manager: null,

  parent: null,

  init() {
    this._super(...arguments);
    this.manager = this.serializer.manager;
  },

  factoryFor(name) {
    return this.serializer.factoryFor(name);
  },

  attach(parent) {
    assert(`parent must be data internal`, isInternal(parent));
    this.parent = parent;
  },

  detach() {
    this.parent = null;
  },

  isAttached() {
    return !!this.parent;
  },

  withPropertyChanges(notify, fn) {
    return withPropertyChanges(this, notify, fn);
  },

  childDidUpdate() {
    this.withPropertyChanges(true, changed => changed('serialized'));
    this.notifyDidUpdate();
  },

  notifyDidUpdate() {
    let parent = this.parent;
    if(!parent) {
      return;
    }
    parent.childDidUpdate(this);
  },

  //

  toInternal(value) {
    let internal = toInternal(value);
    if(isInternal(internal)) {
      if(internal.isAttached()) {
        throw new Error('attached internal: not implemented');
      }
    } else {
      internal = this.manager.deserialize(value, 'model');
    }
    return internal;
  }

});
