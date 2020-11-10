import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  id = 'first'

  @activate().content(({ store, id }) => store.doc(`messages/${id}`).existing())
  doc

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
