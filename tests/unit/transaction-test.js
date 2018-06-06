import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { waitForProp } from '../helpers/firebase';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

module('transaction', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  test('load ref and save document', async function(assert) {
    let duck = this.store.doc(`ducks/yellow`);
    await duck.new({ value: 0 }).save();

    await this.store.runTransaction(async tx => {
      // tx.inherit(ref)
      let doc = await tx.doc(`ducks/yellow`);
      doc.incrementProperty('data.value');
      doc.save();
    });

    let doc = await duck.existing().load();
    assert.deepEqual(doc.get('data.serialized'), {
      value: 1
    });
  });

  // settle

  // have a context: StoreContext, TransactionContext
  // doc has internal reference to transaction
  // doc.save() inherits it from ref

});
