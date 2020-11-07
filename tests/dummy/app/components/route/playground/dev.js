import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root } from 'zuglet/decorators';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  async run() {
    let { store } = this;
    await store.transaction(async tx => {
      let doc = await tx.load(store.doc('messages/first'));
      doc.data.count = doc.data.count || 0;
      doc.data.count++;
      await tx.save(doc);
      let d = store.doc('messages/thing').existing();
      await tx.delete(d);
    });
  }

  toString() {
    return toString(this);
  }

}
