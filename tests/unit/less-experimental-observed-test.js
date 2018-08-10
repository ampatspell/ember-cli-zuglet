import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { observed, observerFor } from 'ember-cli-zuglet/less-experimental';
import { run } from '@ember/runloop';

const Owner = EmberObject.extend({
});

module('less-experimental-observed', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.object = props => EmberObject.create(props);
    this.registerModel = (name, factory) => this.getOwner().register(`model:${name}`, factory);
    this.subject = (props, name='subject') => {
      let factory = Owner.extend(props);
      let owner = this.getOwner();
      let fullName = `component:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create();
    };
  });

  test('settable observed', async function(assert) {
    let subject = this.subject({
      observed: observed(),
    });

    let doc = this.store.doc('ducks/yellow').existing();
    assert.ok(!doc.isObserved);

    subject.set('observed', doc);
    assert.ok(doc.isObserved);

    run(() => subject.destroy());
    assert.ok(!doc.isObserved);
  });

});
