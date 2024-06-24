import { module, test, setupStoreTest } from '../helpers/setup';
import { replaceCollection } from '../helpers/util';

module('firestore / query / paginate', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(function() {
    this.replace = async () => {
      let ref = this.store.collection('ducks');
      let ducks = [];
      for(let i = 0; i < 10; i++) {
        ducks.push({ _id: `duck-${i}`, name: `Duck #${i}`, position: i });
      }
      await replaceCollection(ref, ducks);
    }
  });

  test.only('load', async function(assert) {
    await this.replace();
    let strategy = ({ ref, type, last }) => {
      if(type === 'next') {
        return ref.startAfter(last);
      } else if(type === 'first') {
        return ref;
      }
    }
    let query = this.store.collection('ducks').orderBy('position').limit(2).query({ type: 'paginated', strategy });
    await query.load();
    // await query.loadMore();
  });

});
