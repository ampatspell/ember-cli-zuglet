import EmberObject from '@ember/object';

export default EmberObject.extend({

  owner: null,
  opts: null,

  createContentInstance(factory) {
    let instance = factory.create();
    let owner = this.get('owner');
    instance.prepare && instance.prepare(owner);
    return instance;
  },

  createContent() {
    let factory = this.get('opts.factory');
    return this.createContentInstance(factory);
  },

  content(create) {
    let content = this._content;
    if(!content && create) {
      content = this.createContent();
      this._content = content;
    }
    return content;
  },

  willDestroy() {
    this._content && this._content.destroy();
    this._super(...arguments);
  }

});
