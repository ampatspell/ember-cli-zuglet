import Component from '@glimmer/component';
import { action } from '@ember/object';
import { setGlobal } from 'zuglet/util';
import { inject as service } from '@ember/service';
import { autoactivate, activate } from 'zuglet';
import { tracked } from '@glimmer/tracking';

@autoactivate
export default class RouteIndexComponent extends Component {

  @service
  store

  @tracked
  doc

  @activate
  array

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
    // this.array = [];
    // this.array.pushObject(this.store.document());
    this.doc = this.store.document({ name: 'zeeba' });
    let second = this.store.document({ name: 'larry' });
    setGlobal({ doc: this.doc });
    this.array = [ this.doc, second ];
  }

  @action
  toggle() {
    if(this.array && this.array.length > 0) {
      this.array = null;
    } else {
      this.array = [ this.doc ];
    }
  }

}
