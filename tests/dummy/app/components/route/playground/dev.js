import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate, models, object } from 'zuglet/decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @object()
  array

  @tracked
  id = 'one'

  @models()
    .source(({ array }) => array)
    .named(({ type }) => type)
    .mapping((doc, { id }) => ({ doc, id: `${doc.id}:${id}` }))
  models

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
    this.array = [
      { id: '1', type: 'zeeba' },
      { id: '2', type: 'zeeba' },
    ];
  }

  toString() {
    return toString(this);
  }

}
