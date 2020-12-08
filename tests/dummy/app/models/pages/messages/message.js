import ZugletObject from 'zuglet/object';
import { activate } from 'zuglet/decorators';

export default class PagesMessagesMessage extends ZugletObject {

  @activate().content(({ messages, id }) => messages.byId(id))
  message

  constructor(owner, { messages, id }) {
    super(owner);
    this.messages = messages;
    this.id = id;
  }

  async load() {
    let { message } = this;
    if(message) {
      await message.load();
      return true;
    }
  }

}
