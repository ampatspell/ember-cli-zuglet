import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { objectToJSON, toPrimitive, load } from 'zuglet/utils';
import { activate, models } from 'zuglet/decorators';

export default class Messages extends EmberObject {

  @service
  store

  @activate()
  query

  @models('query.content').named('message').mapping(doc => ({ doc }))
  models

  init() {
    super.init(...arguments);
    this.query = this.store.collection('messages').query();
  }

  async load() {
    await load(this.query);
  }

  async add(name) {
    let doc = this.store.collection('messages').doc().new({ name });
    await doc.save();
    return doc;
  }

  get serialized() {
    let { models } = this;
    return {
      instance: toPrimitive(this),
      models: objectToJSON(models)
    };
  }

}
