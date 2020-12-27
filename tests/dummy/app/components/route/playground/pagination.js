import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { root, activate } from 'zuglet/decorators';
import { setGlobal, toString, alive } from 'zuglet/utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

@root()
export default class RoutePlaygroundPaginationComponent extends Component {

  @service
  store

  @activate()
  queries

  get ref() {
    return this.store.collection('posts').orderBy('position', 'asc').limit(5);
  }

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
    this.queries = [];
    let query = this.ref.query();
    this.queries.push(query);
  }

  @action
  loadMore() {
    let lastObject = arr => arr[arr.length - 1];
    let last = lastObject(lastObject(this.queries).content);
    let query = this.ref.startAfter(last).query();
    this.queries.push(query);
  }

  toString() {
    return toString(this);
  }

  @tracked
  isInserting = false

  @alive()
  didInsert() {
    this.isInserting = false;
  }

  @action
  async insert() {
    if(this.isInserting) {
      return;
    }

    this.isInserting = true;

    try {
      let { store } = this;
      let coll = store.collection('posts');

      let refs = await coll.load({ type: 'ref' });
      console.log(`Delete ${refs.length} posts`);
      await store.batch(async batch => {
        refs.map(ref => batch.delete(ref));
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
    } finally {
      this.didInsert();
    }
  }

}
