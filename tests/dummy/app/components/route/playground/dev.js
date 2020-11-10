import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { root, activate } from 'zuglet/decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@root()
export default class RouteDevComponent extends Component {

  @service
  store

  @tracked
  doc

  @activate().content(({ store }) => store.collection('messages').query())
  query

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  async add() {
    let doc = this.store.collection('messages').doc().new({
      name: 'new'
    });
    this.doc = doc;
    this.query.register(doc);
    await doc.save();
    console.log(this.query.content.find(({ path }) => path === doc.path)+'');
  }

  toString() {
    return toString(this);
  }

}
