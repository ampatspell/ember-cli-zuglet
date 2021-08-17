import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { cached } from "tracked-toolbox";

class RemoteDocumentUpdates {

  constructor(owner, key) {
    this.owner = owner;
    this.key = key;
    this.start();
  }

  onData(doc, { source, fromCache }) {
    console.log({
      data: doc.serialized.data,
      source,
      fromCache
    });
  }

  start() {
    this._cancel = this.owner[this.key].onData((doc, opts) => this.onData(doc, opts));
  }

  stop() {
    this._cancel();
  }

}

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
    this.onData = new RemoteDocumentUpdates(this, 'doc');
  }

  onDeactivated() {
    this.onData.stop();
  }

  @action
  async saveLocal() {
    let { doc } = this;
    doc.data.name = this.name;
    await doc.save({ token: true });
  }

  @action
  async saveRemote() {
    let doc = this.ref.existing();
    doc.data.name = this.name;
    await doc.save({ token: true });
  }

  toString() {
    return toString(this);
  }

}
