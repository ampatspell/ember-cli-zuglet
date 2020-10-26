import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { tracked } from '@glimmer/tracking';

export default class RouteDevComponent extends Component {

  @service
  store

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
