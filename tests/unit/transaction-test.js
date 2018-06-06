import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { waitForProp } from '../helpers/firebase';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

module('transaction', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('load and save document', async function(assert) {
    let doc = await this.store.doc(`ducks/yellow`).new({ value: 0 }).save();

    await this.store.transaction(async tx => {
      await tx.load(doc);
      doc.incrementProperty('data.value');
      tx.save(doc);
    });

    doc = await doc.reload();
    assert.deepEqual(doc.get('data.serialized'), {
      value: 1
    });
  });

  // settle

});
