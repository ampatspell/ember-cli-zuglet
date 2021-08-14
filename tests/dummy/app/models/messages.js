import ZugletObject from 'zuglet/object';
import { inject as service } from '@ember/service';
import { objectToJSON, toJSON, load } from 'zuglet/utils';
import { activate, models } from 'zuglet/decorators';

export default class Messages extends ZugletObject {

  @service store;

  get coll() {
    return this.store.collection('messages');
  }

  @activate()
    .content(({ coll }) => coll.query())
  query;

  @models()
    .source(({ query }) => query.content)
    .named(doc => {
      if(doc.data.name ==='first') {
        return 'fancy-message';
      }
      return 'message';
    })
    .mapping(doc => ({ doc }))
  models;

  async load() {
    await load.cached(this.query);
  }

  async add(name) {
    let doc = this.store.collection('messages').doc().new({ name });
    await doc.save();
    return doc;
  }

  byId(id) {
    return this.models.find(model => model.id === id);
  }

  get serialized() {
    let { models } = this;
    return {
      models: objectToJSON(models)
    };
  }

  toJSON() {
    let { serialized } = this;
    return toJSON(this, { serialized });
  }

}
