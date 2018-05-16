import { module, test, setupStoreTest, setupDucks } from '../helpers/setup';
import { waitFor } from '../helpers/firebase';
import { typeOf } from '@ember/utils';

module('document-save', function(hooks) {
  setupStoreTest(hooks);
  setupDucks(hooks);

  hooks.beforeEach(function() {
    this.save = (props, opts) => this.store.doc(`ducks/yellow`).new(props).save(opts);
    this.load = () => this.store.doc(`ducks/yellow`).load();
  });

  test('save creates document', async function(assert) {
    await this.recreate();
    await this.save({ name: 'yellow' });
    let doc = await this.load();
    assert.deepEqual(doc.get('data.serialized'), {
      name: 'yellow'
    });
  });

  test('save with merge', async function(assert) {
    await this.recreate();
    await this.save({ name: 'yellow' });
    await this.save({ color: 'yellow it is' }, { merge: true });
    let doc = await this.load();
    assert.deepEqual(doc.get('data.serialized'), {
      name: 'yellow',
      color: 'yellow it is'
    });
  });

  test('update doesnt create doc', async function(assert) {
    await this.recreate();
    try {
      await this.save({ name: 'yellow' }, { type: 'update' });
    } catch(err) {
      assert.equal(err.code, 'not-found');
    }
  });

  test('update merges', async function(assert) {
    await this.recreate();
    await this.save({ name: 'yellow' });
    await this.save({ color: 'yellow it is' }, { type: 'update' });
    let doc = await this.load();
    assert.deepEqual(doc.get('data.serialized'), {
      name: 'yellow',
      color: 'yellow it is'
    });
  });

});