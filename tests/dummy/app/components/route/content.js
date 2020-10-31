import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, models } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';

const queryForName = (store, name) => {
  let ref = store.collection('messages');
  if(name) {
    ref = ref.where('name', '==', name);
  }
  return ref.query();
};

@root()
export default class RouteContentComponent extends Component {

  @service
  store

  @tracked
  name = 'first'

  @activate().content(({ store, name }) => queryForName(store, name))
  query

  @models('query.content').named('message').mapping(doc => ({ doc }))
  models

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
