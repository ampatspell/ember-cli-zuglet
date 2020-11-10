import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { action } from '@ember/object';
import { dedupeTracked } from 'tracked-toolbox';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @dedupeTracked
  id = 'first'

  @activate().content(({ store, id }) => {
    if(!id) {
      return;
    }
    return store.doc(`messages/${id}`).existing();
  })
  doc

  get thing() {
    return this.doc?.data?.things?.[0]?.name;
  }

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  reload() {
    console.log('reload');
    this.doc.reload();
  }

  @action
  save() {
    console.log('save');
    this.doc.save();
  }

  toString() {
    return toString(this);
  }

}
