import Internal from '../internal';
import ObjectObserver from '../../util/object-observer';

export default Internal.extend({

  init() {
    this._super(...arguments);

    this._dirty = true;

    let { parent, opts } = this.getProperties('parent', 'opts');

    this.parentObserver = new ObjectObserver({
      object: parent,
      observe: opts.parent,
      delegate: {
        updated: (object, key) => this.onParentPropertyUpdated(object, key)
      }
    });
  },

  getObservable() {
    if(this._dirty) {
      this._dirty = false;
      let observable = this.createObservable();
      this.setObservable(observable);
    }
    return this._super(...arguments);
  },

  createObservable() {
    let { parent, opts: { content } } = this.getProperties('parent', 'opts');
    return content(parent) || null;
  },

  dirty(notify) {
    this.setObservable(null);
    this._dirty = true;
    if(notify) {
      this.notifyPropertyChange();
    }
  },

  notifyPropertyChange() {
    let { parent, key } = this.getProperties('parent', 'key');
    if(parent.isDestroying) {
      return;
    }
    parent.notifyPropertyChange(key);
  },

  onParentPropertyUpdated() {
    this.dirty(true);
  },

  willDestroy() {
    this._super(...arguments);
    this.parentObserver.destroy();
  }

});
