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

  @activate().content(({ store }) => {
    let strategy = ({ ref, type, last }) => {
      if(type === 'next') {
        return ref.startAfter(last);
      } else if(type === 'first') {
        return ref;
      }
    }
    let base = store.collection('posts').orderBy('position', 'asc').limit(5);
    return base.query({ type: 'paginated', strategy });
  })
  query

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @action
  loadMore() {
    this.query.loadMore();
  }

  //

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

  //

  toString() {
    return toString(this);
  }

}
