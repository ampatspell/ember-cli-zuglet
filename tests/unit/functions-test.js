import { module, test, setupStoreTest } from '../helpers/setup';

module('functions', function(hooks) {
  setupStoreTest(hooks);

  test('functions exist', async function(assert) {
    let functions = this.store.functions();
    assert.ok(functions);
    assert.ok(functions._internal);
  });

  test('functions has default region', async function(assert) {
    let functions = this.store.functions();
    assert.equal(functions.get('region'), null);
  });

  test('functions has custom region', async function(assert) {
    let functions = this.store.functions('europe-west1');
    assert.equal(functions.get('region'), 'europe-west1');
  });

  test('functions are per region', async function(assert) {
    assert.ok(this.store.functions() === this.store.functions());
    assert.ok(this.store.functions('europe-west1') === this.store.functions('europe-west1'));
    assert.ok(this.store.functions() !== this.store.functions('europe-west1'));
  });

  test('callable', async function(assert) {
    let callable = await this.store.functions().callable('callable_success');
    assert.ok(callable);
  });

  test.only('callable has name and functions', async function(assert) {
    let functions = this.store.functions();
    let callable = await functions.callable('callable_success');
    assert.equal(callable.get('name'), 'callable_success');
    assert.ok(callable.get('functions') === functions);
  });

  test('call', async function(assert) {
    let callable = await this.store.functions().callable('callable_success');
    let result = await callable.call({ ok: true });
    assert.deepEqual(result, {
      "data": {
        "request": {
          "ok": true
        }
      }
    });
  });

  test('store settle', async function(assert) {
    let operations = this.store.get('_internal.queue.operations');
    let callable = await this.store.functions().callable('callable_success');

    assert.equal(operations.get('length'), 0);
    callable.call({ ok: true });
    assert.equal(operations.get('length'), 1);

    await this.store.settle();
    assert.equal(operations.get('length'), 0);
  });

  test('call reject', async function(assert) {
    let callable = await this.store.functions().callable('callable_error');
    try {
      await callable.call({ ok: true });
      assert.ok(false, 'should throw');
    } catch(err) {
      assert.equal(err.code, 'not-found');
      assert.equal(err.message, 'something was not found');
      assert.deepEqual(err.details, {
        "id": "foobar"
      });
    }
  });

});
