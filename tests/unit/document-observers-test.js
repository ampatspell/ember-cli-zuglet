import { module, test, setupStoreTest } from '../helpers/setup';
import { run } from '@ember/runloop';

module('document-observers', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(() => {
    this.recreate = () => this.store.doc('ducks/yellow').new({ name: 'yellow', feathers: 'cute' }).save();
  });

  test('observers exist', async function(assert) {
    let doc = this.store.doc('ducks/yellow').existing();
    let observers = doc.get('observers');
    assert.ok(observers);
  });

  test('observers are registered', async function(assert) {
    let doc = this.store.doc('ducks/yellow').existing();
    let observers = doc.get('observers');
    assert.equal(observers.get('length'), 0);

    let observer = doc.observe();

    assert.equal(observers.get('length'), 1);
    assert.ok(observers.get('firstObject') === observer);

    observer.cancel();

    assert.equal(observers.get('length'), 0);
    assert.ok(observers.get('firstObject') === undefined);
  });

  test('observers are destroyed', async function(assert) {
    let doc = this.store.doc('ducks/yellow').existing();
    let observers = doc.get('observers');
    assert.equal(observers.get('length'), 0);

    let observer = doc.observe();

    assert.equal(observers.get('length'), 1);
    assert.ok(observers.get('firstObject') === observer);

    run(() => doc.destroy());

    assert.ok(observers.isDestroyed);
  });

  test('observers promise', async function(assert) {
    await this.recreate();
    let doc = this.store.doc('ducks/yellow').existing();
    let observers = doc.get('observers');
    let observer = doc.observe();

    let promise = observers.get('promise');

    assert.equal(doc.get('isLoaded'), false);

    assert.ok(promise);
    assert.ok(promise === observer.get('promise'));

    await promise;

    assert.equal(doc.get('isLoaded'), true);
  });

  test('observers promise rejects if there is no observers', async function(assert) {
    let doc = this.store.doc('ducks/yellow').existing();
    let observers = doc.get('observers');

    try {
      await observers.get('promise');
      assert.ok(false, 'should reject');
    } catch(err) {
      assert.equal(err.code, 'zuglet/observers/none');
    }

    doc.observe();

    await observers.get('promise');
  });

});
