import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, models } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteContentComponent extends Component {

  @service
  store

  @tracked
  name = 'first'

  @activate().content(({ store, name }) => store.collection('messages').where('name', '==', name).query())
  query

  // @models('query.content').named('message').mapping(doc => ({ doc }))
  // models

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
