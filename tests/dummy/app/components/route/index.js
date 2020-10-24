import Component from '@glimmer/component';
import EmberObject, { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import {  } from 'zuglet';




export default class RouteIndexComponent extends Component {

  @computed
  get model() {
    let model = getOwner(this).factoryFor('model:thing').create();
    window.model = model;
    return model;
  }

}
