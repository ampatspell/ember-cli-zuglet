import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { observed, observerFor } from 'ember-cli-zuglet/lifecycle';
import { run } from '@ember/runloop';

const Owner = EmberObject.extend({
});

module('lifecycle-observed', function(hooks) {
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

  test('witable observed', async function(assert) {
    let subject = this.subject({
      observed: observed(),
    });

    let doc = this.store.doc('ducks/yellow').existing();
    assert.ok(doc.get('isObserving') === false);

    subject.set('observed', doc);
    assert.ok(doc.get('isObserving') === true);

    subject.set('observed');
    assert.ok(doc.get('isObserving') === false);

    subject.set('observed', doc);
    assert.ok(doc.get('isObserving') === true);

    run(() => subject.destroy());
    assert.ok(!doc.isObserved);
  });

  test('dynamic observed', async function(assert) {
    let subject = this.subject({
      doc: null,
      observed: observed().owner('doc').content(owner => owner.get('doc'))
    });

    let doc = this.store.doc('ducks/yellow').existing();
    assert.ok(subject.get('observed') === null);

    subject.set('doc', doc);
    assert.ok(subject.get('observed.isObserving') === true);
    assert.ok(doc.get('isObserving') === true);

    subject.set('doc', null);
    assert.ok(subject.get('observed') === null);
    assert.ok(doc.get('isObserving') === false);

    subject.set('doc', doc);

    assert.ok(subject.get('observed.isObserving') === true);
    assert.ok(doc.get('isObserving') === true);

    run(() => subject.destroy());

    assert.ok(doc.get('isObserving') === false);
  });

  test('observer for', async function(assert) {
    let subject = this.subject({
      doc: null,
      observed: observed().owner('doc').content(owner => owner.get('doc'))
    });

    let doc = this.store.doc('ducks/yellow').existing();

    assert.ok(observerFor(subject, 'observed') === undefined);

    subject.set('doc', doc);
    assert.ok(observerFor(subject, 'observed') === undefined);

    subject.get('observed');
    let instance = observerFor(subject, 'observed');
    assert.ok(instance);
    assert.ok(instance.get('content', doc));

    run(() => subject.destroy());
  });

  test('multiple owner deps should not create content multiple times', async function(assert) {
    let log = [];
    let subject = this.subject({
      parent: 'ducks',
      id: 'yellow',
      observed: observed().owner('parent', 'id').content(owner => {
        let { parent, id } = owner.getProperties('parent', 'id');
        log.push([ parent, id ]);
        return owner.store.doc(`${parent}/${id}`).existing();
      })
    });

    subject.get('observed');
    subject.setProperties({ parent: 'messages', id: 'first' });
    let second = subject.get('observed');
    assert.equal(second.get('ref.path'), 'messages/first');

    run(() => subject.destroy());

    assert.deepEqual(log, [
      [ "ducks", "yellow" ],
      [ "messages", "first" ]
    ]);
  });

});
