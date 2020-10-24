import Component from '@glimmer/component';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { setGlobal } from 'zuglet/util';

export default class RouteIndexComponent extends Component {

  @computed
  get model() {
    let model = getOwner(this).factoryFor('model:thing').create();
    setGlobal({ model });
    return model;
  }

}
