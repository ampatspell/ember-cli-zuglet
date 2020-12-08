import ZugletObject from 'zuglet/object';

export default class PagesMessagesMessageIndex extends ZugletObject {

  constructor(owner, { message }) {
    super(owner);
    this.message = message;
  }

  async load() {
    return await this.message.load();
  }

}
