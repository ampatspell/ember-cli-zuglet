import Component from '@glimmer/component';
import { computed, action } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import { setGlobal } from 'zuglet/util';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { autoactivate, activate } from 'zuglet';

@autoactivate
export default class RouteIndexComponent extends Component {

  @service
  router

  @service
  store

  @readOnly('store.stores.stats')
  stats

  @tracked
  show = false

  @activate
  active

  constructor() {
    super(...arguments);
    setGlobal({ component: this, stats: this.stats });
  }

  @computed
  get child() {
    let child = getOwner(this).factoryFor('model:child').create();
    setGlobal({ child });
    return child;
  }

  @computed
  get model() {
    let child = this.child;
    let model = getOwner(this).factoryFor('model:thing').create({ child });
    setGlobal({ model, router: this.router });
    return model;
  }

  @action
  toggle() {
    this.show = !this.show;
    if(this.show) {
      this.active = this.model;
    } else {
      this.active = null;
    }
  }

}
