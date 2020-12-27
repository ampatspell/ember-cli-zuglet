import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { root } from 'zuglet/decorators';
import { setGlobal, toString } from 'zuglet/utils';
import { action } from '@ember/object';

@root()
export default class RoutePlaygroundPaginationComponent extends Component {

  @service
  store

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  toString() {
    return toString(this);
  }

  @action
  async insert() {
    let { store } = this;
    let coll = store.collection('posts');

    let docs = await coll.load();
    console.log(`Delete ${docs.length} posts`);
    await store.batch(async batch => {
      docs.map(doc => batch.delete(doc));
    });

    let len = 500;
    console.log(`Insert ${len} posts`);
    await store.batch(async batch => {
      for(let i = 0; i < len; i++) {
        let doc = coll.doc().new({
          createdAt: store.serverTimestamp,
          position: i,
          title: `Post #${i}`
        });
        batch.save(doc);
      }
    });

    console.log('Done');
  }

}
