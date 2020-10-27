import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import ArrayManager from 'zuglet/-private/model/tracking/array';
import { A } from '@ember/array';

export default class RouteDevComponent extends Component {

  @service
  store

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
    this.observer = new ArrayManager({
      content: A([ 'a', 'b', 'c' ]),
      delegate: {
        onAdd: item => console.log('add', item),
        onRemove: item => console.log('remove', item)
      }
    });
  }

  get first() {
    return this.observer.proxy[0];
  }

  get last() {
    return this.observer.proxy[this.observer.proxy.length - 1];
  }

  toString() {
    return toString(this);
  }

}
