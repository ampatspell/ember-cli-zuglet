import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';

@root()
export default class RouteQuerySingleComponent extends Component {

  @service
  store

  @activate()
  query

  constructor() {
    super(...arguments);
    this.query = this.store.collection('messages').where('name', '==', 'firrst').query({ type: 'single' });
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
