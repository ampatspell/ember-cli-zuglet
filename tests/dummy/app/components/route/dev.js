import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { tracked } from '@glimmer/tracking';
import { consumeKey, dirtyKey } from 'zuglet/-private/tracking/tag';
import { alias } from 'macro-decorators';

export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  isDirty = false

  _data = { name: 'hey there' }

  get data() {
    let { _proxy } = this;
    if(!_proxy) {
      _proxy = new Proxy(this._data, {
        get: (target, prop) => {
          consumeKey(target, prop);
          return target[prop];
        },
        set: (target, prop, value) => {
          target[prop] = value;
          dirtyKey(target, prop);
          this.isDirty = true;
          return true;
        }
      })
      this._proxy = _proxy;
    }
    return _proxy;
  }

  @alias('data.name')
  name

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
