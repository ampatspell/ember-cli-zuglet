import Component from '@glimmer/component';
import { action } from '@ember/object';
import { setGlobal } from 'zuglet/util';
import { inject as service } from '@ember/service';
import { autoactivate, activate } from 'zuglet';

@autoactivate
export default class RouteIndexComponent extends Component {

  @service
  store

  @activate
  array

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
    this.array = this.store.document();
  }

  @action
  toggle() {
  }

}
