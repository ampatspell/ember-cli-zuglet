import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @activate().content(({ store }) => store.collection('messages').query().passive())
  doc

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
