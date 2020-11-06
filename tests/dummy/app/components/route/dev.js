import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { getOwner, setOwner } from '@ember/application';
import { state, readable } from 'zuglet/-private/model/tracking/state';

class Thing {

  @state _state
  @readable isNew
  @readable isLoading

  constructor(owner) {
    setOwner(this, owner);
    this._state.untracked.setProperties({ isNew: false, isLoading: false });
  }

  onActivated() {
    let { isNew, isLoading } = this._state.untracked.getProperties('isNew', 'isLoading');
    this._state.set('isLoading', true);
  }

  get serialized() {
    let { isNew, isLoading } = this;
    return { isNew, isLoading };
  }

  toJSON() {
    return { serialized: this.serialized }
  }

  toString() {
    return toString(this);
  }

}


@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @activate().content(owner => new Thing(getOwner(owner)))
  thing

  @activate().content(owner => new Thing(getOwner(owner)))
  thing2

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

}
