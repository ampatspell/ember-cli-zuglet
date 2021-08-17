import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { cached } from "tracked-toolbox";

@root()
export default class RoutePlaygroundDataComponent extends Component {

  @service
  store

  @cached
  get ref() {
    return this.store.doc('messages/data');
  }

  @activate()
    .content(({ ref }) => ref.existing())
  doc

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @tracked name = null;

  onActivated() {
    setTimeout(() => {
      this._onData = this.doc.onData((doc, opts) => console.log('onData', doc+'', opts));
    }, 0);
  }

  onDeactivated() {
    this._onData();
  }

  @action
  async save() {
    let doc = this.ref.existing();
    doc.data.name = this.name;
    await doc.save();
  }

  toString() {
    return toString(this);
  }

}
