import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, model } from 'zuglet/decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  name = 'zeeba'

  @tracked
  id = 'one'

  @model().named(({ name }) => name).mapping(({ id }) => ({ id }))
  model

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
