import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { setGlobal } from 'zuglet/utils';
import { root, activate, models } from 'zuglet/decorators';

@root()
export default class RouteIndexComponent extends Component {

  @service
  store

  @activate()
  doc

  constructor() {
    super(...arguments);
    let doc = this.store.doc('messages/first').existing();
    this.doc = doc;
    setGlobal({ component: this, doc });
  }

  toString() {
    return `<Component:RouteIndex>`;
  }

}
