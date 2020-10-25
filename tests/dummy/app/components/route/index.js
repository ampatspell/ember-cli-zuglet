import Component from '@glimmer/component';
import { action } from '@ember/object';
import { setGlobal } from 'zuglet/util';
import { inject as service } from '@ember/service';
import { autoactivate, activate, models } from 'zuglet';
import { tracked } from '@glimmer/tracking';

@autoactivate
export default class RouteIndexComponent extends Component {

  @service
  store

  @tracked
  first

  @tracked
  second

  @activate
  query

  @models('query.content', 'animal', doc => ({ doc }))
  models

  constructor() {
    super(...arguments);
    setGlobal({ component: this });

    this.zeeba = this.store.document({ name: 'zeeba' });
    this.larry = this.store.document({ name: 'larry' });
    setGlobal({ zeeba: this.zeeba, larry: this.larry });

    this.query = this.store.query([ this.zeeba, this.larry ]);
  }

  @action
  toggle() {
    if(this.query.content.length === 2) {
      this.query.content.removeObject(this.zeeba);
    } else {
      this.query.content.pushObject(this.zeeba);
    }
  }

  toString() {
    return `<Component:RouteIndex>`;
  }

}
