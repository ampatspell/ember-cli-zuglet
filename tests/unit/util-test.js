import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import { alive } from 'zuglet/-private/util/alive';
import { delay } from 'zuglet/-private/util/delay';
import { next } from 'zuglet/-private/util/runloop';
import { resolve } from 'zuglet/-private/util/resolve';
import { toPrimitive } from 'zuglet/-private/util/to-primitive';
import { toString } from 'zuglet/-private/util/to-string';

module('util', function(hooks) {
  setupStoreTest(hooks);

  test('alive', async function(assert) {
    this.registerModel('thing', class Thing extends EmberObject {

      value = 0;

      @alive()
      increment() {
        this.value++;
      }

    });

    let model = this.store.models.create('thing');
    model.increment();
    model.destroy();
    await next();
    model.increment();

    assert.strictEqual(model.value, 1);
  });

  test('delay', async function(assert) {
    let start = new Date();
    await delay(300);
    let end = new Date();
    let took = end - start;
    assert.ok(took > 299);
  });

  test('error', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.delete();
    try {
      await ref.load();
    } catch(err) {
      assert.deepEqual(err.serialized, {
        code: 'zuglet/document/missing',
        message: `Document 'ducks/yellow' missing`,
        path: 'ducks/yellow',
        stack: err.stack
      });
      let json = err.toJSON();
      assert.deepEqual(json, {
        type: 'zuglet-error',
        serialized: {
          code: 'zuglet/document/missing',
          message: `Document 'ducks/yellow' missing`,
          path: 'ducks/yellow',
          stack: err.stack
        }
      });
    }
  });

  test('resolve', async function(assert) {
    let ref = this.store.doc('ducks/yellow');
    await ref.save({ name: 'yellow' });

    let doc = ref.existing();
    this.activate(doc);

    let invoked = false;
    let then = (resolve) => {
      invoked = true;
      resolve();
    }

    await resolve(null, [ doc, null, undefined ], null, undefined, { ok: true }, { then });

    assert.ok(invoked);
    assert.strictEqual(doc.isLoaded, true);
  });

  test('toPrimitive', async function(assert) {
    {
      let string = toPrimitive(new Date());
      assert.ok(string.startsWith('Date::ember'));
    }
    assert.ok(!toPrimitive(undefined));
  });

  test('toString', async function(assert) {
    {
      let string = toString(new Date());
      assert.ok(string.startsWith('<Date::ember'));
      assert.ok(string.endsWith('>'));
    }
    {
      let string = toString(new Date(), 'ok=true');
      assert.ok(string.startsWith('<Date::ember'));
      assert.ok(string.endsWith(':ok=true>'));
    }
    assert.ok(!toString(undefined));
  });

});
