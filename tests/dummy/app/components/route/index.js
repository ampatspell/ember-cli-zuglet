import Component from '@glimmer/component';
import { computed, action } from '@ember/object';
import { getOwner } from '@ember/application';
import { setGlobal } from 'zuglet/util';
import { tracked } from '@glimmer/tracking';
import { activate } from 'zuglet/-private/property/activate';

export default class RouteIndexComponent extends Component {

  @tracked
  show = false

  @activate
  active

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @computed
  get model() {
    let child = getOwner(this).factoryFor('model:child').create();
    let model = getOwner(this).factoryFor('model:thing').create({ child });
    setGlobal({ model });
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
