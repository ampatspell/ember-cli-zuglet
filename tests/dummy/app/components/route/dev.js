import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @activate()
  docs

  constructor() {
    super(...arguments);
    setGlobal({ component: this });

    this.first = this.store.doc('messages/first').existing(),
    this.second = this.store.doc('messages/second').existing()

    this.docs = [ this.first ];
  }

  toString() {
    return toString(this);
  }

}
