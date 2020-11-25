import EmberObject from '@ember/object';

export default class PagesMessagesMessageIndex extends EmberObject {

  async load() {
    return await this.message.load();
  }

}
