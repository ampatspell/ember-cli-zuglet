import Component from '@glimmer/component';
import { action } from '@ember/object';
import { setGlobal } from 'zuglet/utils';
import { getStats } from '../../-private/stores/stats';
import { getStores } from '../../-private/stores/get-stores';

export default class ZugletStatsComponent extends Component {

  get classNames() {
    let arr = [ 'zuglet-stats' ];
    if(this.args.class) {
      arr.push(this.args.class);
    }
    return arr.join(' ');
  }

  get showStores() {
    return this.args.stores !== false;
  }

  get stores() {
    return getStores(this).stores;
  }

  get hasSingleStore() {
    return this.stores.length === 1;
  }

  get firstStore() {
    return this.stores[0];
  }

  get stats() {
    return getStats(this);
  }

  @action
  setGlobal(model) {
    setGlobal({ model });
  }

}
