import Internal from '../../internal/internal';
import Runtime from './runtime';

export default Internal.extend({

  parent: null,
  key: null,
  opts: null,

  runtime(create) {
    let runtime = this._runtime;
    if(!runtime && create) {
      let { parent, key, opts } = this.getProperties('parent', 'key', 'opts');
      runtime = new Runtime(parent, key, opts, {
        updated: () => this.notifyPropertyChange()
      });
      this._runtime = runtime;
    }
    return runtime;
  },

  notifyPropertyChange() {
    let { parent, key } = this;
    if(parent.isDestroying) {
      return;
    }
    parent.notifyPropertyChange(key);
  },

  model(create) {
    let runtime = this.runtime(create);
    return runtime && runtime.content;
  },

  willDestroy() {
    this._super(...arguments);
    this._runtime && this._runtime.destroy();
  }

});
