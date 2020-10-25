import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, models } from 'zuglet/decorators';

@root()
export default class RouteModelsComponent extends Component {

  @service
  store

  @activate()
  query

  @models('query.content').named('message').mapping(doc => ({ doc }))
  models

  constructor() {
    super(...arguments);
    this.query = this.store.collection('messages').query();
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
