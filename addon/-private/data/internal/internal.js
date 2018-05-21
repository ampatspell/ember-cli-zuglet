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

  parent: null,

  init() {
    this._super(...arguments);
    this.manager = this.serializer.manager;
  },

  factoryFor(name) {
    return this.serializer.factoryFor(name);
  },

  //

  isDirty: computed('raw', function() {
    return this.serializer.isDirty(this);
  }).readOnly(),

  //

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

  //

  childDidUpdate() {
    this.withPropertyChanges(true, changed => changed('serialized'));
    this.notifyDidUpdate();
  },

  notifyDidUpdate() {
    this.notifyPropertyChange('isDirty');
    let parent = this.parent;
    if(!parent) {
      return;
    }
    parent.childDidUpdate(this);
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
  },

  commit(data) {
    return this.serializer.commit(this, data);
  },

  rollback() {
    return this.serializer.rollback(this);
  }

});
