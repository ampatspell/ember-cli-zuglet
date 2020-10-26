import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { action } from '@ember/object';

@root()
export default class RouteDocumentComponent extends Component {

  @service
  store

  @activate()
  doc

  get name() {
    return this.doc.data.name;
  }

  set name(value) {
    this.doc.data.name = value;
  }

  constructor() {
    super(...arguments);
    this.doc = this.store.doc('messages/first').existing();
    setGlobal({ component: this });
  }

  @action
  save() {
    this.doc.save();
  }

  toString() {
    return toString(this);
  }

}
