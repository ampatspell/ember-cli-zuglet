import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';

@root()
export default class RouteQueryComponent extends Component {

  @service
  store

  @activate()
  query

  constructor() {
    super(...arguments);
    this.query = this.store.collection('messages').query();
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
