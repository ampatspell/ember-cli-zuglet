import EmberObject from '@ember/object';
import { activate } from 'zuglet/decorators';

export default class PagesMessagesMessage extends EmberObject {

  @activate().content(({ messages, id }) => messages.byId(id))
  message

  async load() {
    let { message } = this;
    if(message) {
      await message.load();
      return true;
    }
  }

}
