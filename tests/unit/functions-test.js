import { module, test, setupStoreTest } from '../helpers/setup';
import { recreateCollection, waitForCollectionSize, waitForLength } from '../helpers/firebase';
import { all } from 'rsvp';
import { run } from '@ember/runloop';

module('functions', function(hooks) {
  setupStoreTest(hooks);

  test('hello', async function(assert) {
    let app = this.store._internal.app;
    let fns = app.functions();
    fns.INTERNAL = fns.INTERNAL || {};
    fns.INTERNAL.delete = fns.INTERNAL.delete || (() => {});
    let result = await fns.call('hello', { ok: true });
    console.log(result);
  });

});