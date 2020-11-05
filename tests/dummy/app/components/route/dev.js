import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { action } from "@ember/object";

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @activate().content(({ store }) => store.doc('messages/thingie').existing())
  doc

  constructor() {
    super(...arguments);
    this.doc.onData(doc => console.log('onData'));
    this.doc.onDeleted(doc => console.log('onDeleted'));
    setGlobal({ component: this });
  }

  @action
  async save() {
    await this.doc.save({ force: true });
  }

  @action
  async delete() {
    await this.doc.delete();
  }

  toString() {
    return toString(this);
  }

}
