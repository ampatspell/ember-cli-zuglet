import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import observed from 'ember-cli-zuglet/-private/computed/observed/property';
import { getOwner } from '@ember/application';
import { assign } from '@ember/polyfills';
import { run } from '@ember/runloop';

module('computed-observed', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.model = (classProps, instanceProps) => EmberObject.extend(classProps).create(assign({}, this.getOwner().ownerInjection(), instanceProps));
    this.subject = () => EmberObject.extend({
      isObserved: false,
      observe() {
        this.isObserved = true;
        return {
          cancel: () => this.isObserved = false
        };
      }
    }).create();
  });

  test('create observed', function(assert) {
    let model = this.model({ doc: observed() });
    let subject = this.subject();

    assert.equal(model.get('doc'), null);
    model.set('doc', subject);

    assert.equal(model.get('doc'), subject);
  });

  test('create with value', function(assert) {
    let subject = this.subject();
    let model = this.model({ doc: observed() }, { doc: subject });

    assert.equal(model.get('doc'), subject);
  });

  test('subject is observed', function(assert) {
    let model = this.model({ doc: observed() });

    let first = this.subject();
    let second = this.subject();

    assert.equal(first.isObserved, false);
    assert.equal(second.isObserved, false);

    model.set('doc', first);
    assert.equal(first.isObserved, true);

    model.set('doc', second);
    assert.equal(first.isObserved, false);
    assert.equal(second.isObserved, true);

    model.set('doc', first);
    assert.equal(first.isObserved, true);
    assert.equal(second.isObserved, false);
  });

  test('destroy parent stops observing', function(assert) {
    let subject = this.subject();
    let model = this.model({ doc: observed() }, { doc: subject });
    assert.equal(subject.isObserved, true);
    run(() => model.destroy());
    assert.equal(subject.isObserved, false);
  });

});
