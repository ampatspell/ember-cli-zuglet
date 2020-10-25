import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';

@root()
export default class RouteDocumentComponent extends Component {

  @service store

  @activate()
  doc

  constructor() {
    super(...arguments);
    this.doc = this.store.doc('messages/first').existing();
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
