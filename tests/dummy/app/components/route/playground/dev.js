import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, model } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  id = 'foo'

  // @model().named('zeeba').mapping(({ id }) => ({ id }))
  // model

  @activate().mapping(({ id }) => ({ id })).content(({ store }, { id }) => store.models.create('zeeba', { id }))
  model

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
