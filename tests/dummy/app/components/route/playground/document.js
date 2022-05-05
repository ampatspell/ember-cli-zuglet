import Component from '@glimmer/component';
import { root, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { action } from '@ember/object';
import { alias } from 'macro-decorators';

@root()
export default class RouteDocumentComponent extends Component {

  @service store;

  @activate()
    .content(({ store }) => store.doc('messages/first').existing())
  doc;

  @alias('doc.data.name') name;

  constructor() {
    super(...arguments);
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
