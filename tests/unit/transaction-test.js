import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { waitForProp } from '../helpers/firebase';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

module('transaction', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('load and save document', async function(assert) {
    let duck = this.store.doc(`ducks/yellow'`);
    await duck.new({ value: 0 }).save();

    await this.store.runTransaction(async tx => {
      let doc = await tx.load(duck);
      doc.incrementProperty('data.value');
      tx.save(doc);
    });

    let doc = await duck.existing().load();
    assert.deepEqual(doc.get('data.serialized'), {
      value: 1
    });
  });

});
