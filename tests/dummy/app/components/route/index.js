import Component from '@glimmer/component';
import { action } from '@ember/object';
import { setGlobal } from 'zuglet/utils';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { root, activate, models } from 'zuglet/decorators';

@root()
export default class RouteIndexComponent extends Component {

  @service
  store

  constructor() {
    super(...arguments);
  }

  toString() {
    return `<Component:RouteIndex>`;
  }

}
