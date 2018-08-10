import Internal from '../internal';
import ObjectObserver from '../../util/object-observer';

export default Internal.extend({

  init() {
    this._super(...arguments);

    let { parent, opts } = this.getProperties('parent', 'opts');

    this.parentObserver = new ObjectObserver({
      object: parent,
      observe: opts.parent,
      delegate: {
        updated: (object, key) => this.onParentPropertyUpdated(object, key)
      }
    });

    this.update(false);
  },

  notifyPropertyChange() {
    let { parent, key } = this.getProperties('parent', 'key');
    if(parent.isDestroying) {
      return;
    }
    parent.notifyPropertyChange(key);
  },

  update(notify) {
    let { parent, opts: { content } } = this.getProperties('parent', 'opts');

    let next = content(parent) || null;

    if(this.observable === next) {
      return;
    }

    this.setObservable(next);

    if(notify) {
      this.notifyPropertyChange();
    }
  },

  onParentPropertyUpdated() {
    this.update(true);
  },

  willDestroy() {
    this._super(...arguments);
    this.parentObserver.destroy();
  }

});
