import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class BlockMessageComponent extends Component {

  @action
  async save() {
    await this.args.message.doc.save();
  }

  @action
  async delete() {
    await this.args.message.doc.delete();
  }

}
