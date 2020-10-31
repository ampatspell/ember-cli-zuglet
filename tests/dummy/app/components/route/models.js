import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, models } from 'zuglet/decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteModelsComponent extends Component {

  @service
  store

  @tracked
  name

  @activate().content(({ store, name }) => {
    let ref = store.collection('messages');
    if(name) {
      ref = ref.where('name', '==', name);
    }
    return ref.query();
  })
  query

  @models(({ query }) => query.content).named('message').mapping(doc => ({ doc }))
  models

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  async add() {
    await this.store.collection('messages').doc().new({
      name: 'new message'
    }).save();
  }

  toString() {
    return toString(this);
  }

}
