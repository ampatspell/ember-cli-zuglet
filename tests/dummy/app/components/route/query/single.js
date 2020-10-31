import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';

@root()
export default class RouteQuerySingleComponent extends Component {

  @service
  store

  @activate()
    .content(({ store }) => {
      return store.collection('messages').where('name', '==', 'first').limit(1).query({ type: 'single' });
    })
  query

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
