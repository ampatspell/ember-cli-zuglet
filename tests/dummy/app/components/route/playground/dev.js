import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  id = 'first'

  @activate().content(({ store, id }) => store.doc(`messages/${id}`).existing())
  doc

  get thing() {
    return this.doc.data?.things?.[0]?.name;
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
