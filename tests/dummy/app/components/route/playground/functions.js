import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RouteFunctionsComponent extends Component {

  @service
  store

  @tracked
  response

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  async invoke() {
    this.response = "Loading…";
    try {
      let response = await this.store.functions.call('echo', { now: new Date().toJSON() });
      this.response = response;
    } catch(err) {
      this.response = err;
    }
  }

  toString() {
    return toString(this);
  }

}
