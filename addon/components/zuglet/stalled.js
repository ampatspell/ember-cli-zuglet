import Component from '@glimmer/component';
import { later, cancel } from '@ember/runloop';
import { getStores } from '../../utils';
import { tracked } from '@glimmer/tracking';

export default class ZugletStalledComponent extends Component {

  constructor() {
    super(...arguments);
    this.stores = getStores(this);
    this.next();
  }

  @tracked stalledPromises = false;

  update() {
    let stalled = this.stores.stats.stalledPromises;
    this.stalledPromises = stalled.map(promise => promise.stats);
  }

  next() {
    this.cancel = later(() => {
      this.update();
      this.next();
    }, 1000);
  }

  willDestroy() {
    cancel(this.cancel);
    super.willDestroy(...arguments);
  }

}
