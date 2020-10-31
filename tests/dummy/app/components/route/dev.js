import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root } from 'zuglet/decorators';
import { tracked } from '@glimmer/tracking';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

const cached = () => (target, _key, descriptor) => {
  let key = `_${_key}`;
  return {
    get() {
      let cache = this[key];
      if(!cache) {
        cache = createCache(descriptor.get.bind(this));
        this[key] = cache;
      }
      return getValue(cache);
    }
  };
}

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  greeting = 'Hello'

  @tracked
  name = 'zeeba'

  @cached()
  get thing() {
    console.log('recompute');
    return `${this.greeting} ${this.name}`;
  }

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
