import { module, test, setupStoreTest } from '../helpers/setup';

module('functions', function(hooks) {
  setupStoreTest(hooks);

  test('functions exist', async function(assert) {
    let functions = this.store.get( 'functions');
    assert.ok(functions);
    assert.ok(functions._internal);
  });

  test('callable', async function(assert) {
    let callable = await this.store.get('functions').callable('callable_success');
    assert.ok(callable);
  });

  test('call', async function(assert) {
    let callable = await this.store.get('functions').callable('callable_success');
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
    let callable = await this.store.get('functions').callable('callable_success');

    assert.equal(operations.get('length'), 0);
    callable.call({ ok: true });
    assert.equal(operations.get('length'), 1);

    await this.store.settle();
    assert.equal(operations.get('length'), 0);
  });

  test('call reject', async function(assert) {
    let callable = await this.store.get('functions').callable('callable_error');
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
