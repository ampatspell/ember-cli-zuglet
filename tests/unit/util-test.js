import { module, test, setupStoreTest } from '../helpers/setup';
import EmberObject from '@ember/object';
import ZugletObject from 'zuglet/object';
import { alive } from 'zuglet/-private/util/alive';
import { delay } from 'zuglet/-private/util/delay';
import { next } from 'zuglet/-private/util/runloop';
import { resolve } from 'zuglet/-private/util/resolve';
import { toPrimitive } from 'zuglet/-private/util/to-primitive';
import { toString } from 'zuglet/-private/util/to-string';
import { assert as zugletAssert, isZugletError } from 'zuglet/-private/util/error';
import { destroy } from '@ember/destroyable';

module('util', function(hooks) {
  setupStoreTest(hooks);

  test('alive with ember object', async function(assert) {
    class Thing extends EmberObject {

      value = 0;

      @alive()
      increment() {
        this.value++;
      }

    }
    this.registerModel('thing', Thing);

    let model = this.store.models.create('thing');
    model.increment();
    model.destroy();
    await next();
    model.increment();

    assert.strictEqual(model.value, 1);
  });

  test('alive with native class', async function(assert) {
    this.registerModel('thing', class Thing extends ZugletObject {

      value = 0;

      @alive()
      increment() {
        this.value++;
      }

    });

    let model = this.store.models.create('thing');
    model.increment();
    destroy(model);
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

  // eslint-disable-next-line qunit/require-expect
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

  // eslint-disable-next-line qunit/require-expect
  test('assert', async function(assert) {
    try {
      zugletAssert('fake one', false);
      assert.ok(false);
    } catch(err) {
      assert.true(isZugletError(err));
      assert.strictEqual(err.code, 'zuglet/assert');
      assert.strictEqual(err.message, 'fake one');
    }
  });

  // eslint-disable-next-line qunit/require-expect
  test('assert with message function', async function(assert) {
    try {
      zugletAssert(() => 'fake one', false);
      assert.ok(false);
    } catch(err) {
      assert.true(isZugletError(err));
      assert.strictEqual(err.code, 'zuglet/assert');
      assert.strictEqual(err.message, 'fake one');
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
    assert.true(doc.isLoaded);
  });

  // eslint-disable-next-line qunit/require-expect
  test('toPrimitive', async function(assert) {
    {
      let string = toPrimitive(new Date());
      assert.ok(string.startsWith('Date::ember'));
    }
    assert.strictEqual(toPrimitive(undefined), undefined);
  });

  // eslint-disable-next-line qunit/require-expect
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
    assert.strictEqual(toString(undefined), undefined);
  });

});
