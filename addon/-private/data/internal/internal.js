import Internal from '../../internal/internal';
import { get, computed } from '@ember/object';
import { assert } from '@ember/debug';
import withPropertyChanges from '../../internal/with-property-changes';

const key = '_isZugletDataInternal';

export const isInternal = arg => arg && get(arg, key) === true;

export default Internal.extend({

  [key]: true,

  serializer: null,
  manager: null,

  root: null,
  parent: null,

  init() {
    this._super(...arguments);
    this.manager = this.serializer.manager;
  },

  factoryFor(name) {
    return this.serializer.factoryFor(name);
  },

  //

  attach(parent) {
    assert(`parent must be data internal`, isInternal(parent));
    this.parent = parent;
  },

  detach() {
    assert(`cannot detach root`, !this.root);
    this.parent = null;
  },

  isAttached() {
    return !!this.parent;
  },

  //

  childDidUpdate() {
    this.withPropertyChanges(true, changed => changed('serialized'));
    this.notifyDidUpdate();
  },

  notifyDidUpdate() {
    let parent = this.parent;
    if(parent) {
      parent.childDidUpdate(this);
    } else {
      let root = this.root;
      if(root) {
        root.internalDidUpdate();
      }
    }
  },

  didUpdate(changed) {
    changed('serialized');
    this.notifyDidUpdate();
  },

  withPropertyChanges(notify, fn) {
    return withPropertyChanges(this, notify, fn, changed => {
      if(changed.any) {
        this.didUpdate(changed);
      }
    });
  },

  //

  serialize(type) {
    return this.serializer.serialize(this, type);
  }

});
