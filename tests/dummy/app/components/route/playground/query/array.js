import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';

@root()
export default class RouteQueryArrayComponent extends Component {

  @service
  store

  @activate().content(({ store }) => store.collection('messages').query())
  query

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
