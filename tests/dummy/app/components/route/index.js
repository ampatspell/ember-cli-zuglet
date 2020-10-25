import Component from '@glimmer/component';
import { computed, action } from '@ember/object';
import { getOwner } from '@ember/application';
import { setGlobal } from 'zuglet/util';
import { tracked } from '@glimmer/tracking';
import { activate } from 'zuglet/-private/property/activate';
import { inject as service } from '@ember/service';

export default class RouteIndexComponent extends Component {

  @service
  router

  @tracked
  show = false

  @activate
  active

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
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
