import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import ArrayObserver from 'zuglet/-private/model/tracking/array-observer';

export default class RouteDevComponent extends Component {

  @service
  store

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
    this.observer = new ArrayObserver([ 'a', 'b', 'c' ]);
  }

  toString() {
    return toString(this);
  }

}
