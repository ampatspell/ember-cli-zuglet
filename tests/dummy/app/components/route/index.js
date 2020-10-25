import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, models } from 'zuglet/decorators';

@root()
export default class RouteIndexComponent extends Component {

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
