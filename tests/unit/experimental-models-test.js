import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import models from 'ember-cli-zuglet/experimental/models';
import { run } from '@ember/runloop';
import { A } from '@ember/array';

const Owner = EmberObject.extend({
});

module('experimental-models', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.registerModel = (name, factory) => this.getOwner().register(`model:${name}`, factory);
    this.subject = props => {
      let name = 'subject';
      let factory = Owner.extend(props);
      let owner = this.getOwner();
      let fullName = `component:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create();
    };
  });

  test('models content is null if there is no source', async function(assert) {
    let subject = this.subject({
      models: models('source', {})
    });
    let prop = subject.get('models');
    assert.ok(prop);
    assert.equal(prop.get('content'), null);
  });

  test('models content is empty if there is no source objects', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', {})
    });
    let prop = subject.get('models');
    assert.ok(prop);
    assert.deepEqual(prop.get('content'), []);
  });

  test('models content stays the same array', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', {
        prepare() {}
      })
    });

    let prop = subject.get('models');
    let content = prop.get('content');

    assert.deepEqual(content, []);

    subject.get('source').pushObject({ ok: true });

    assert.ok(content === prop.get('content'));
    assert.equal(content.get('length'), 1);
  });

  test('removed models are destroyed', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', {
        prepare(raw) {
          this.setProperties({ raw });
        }
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    source.pushObject({ id: 'first' });

    assert.equal(prop.get('content.length'), 1);

    let first = prop.get('content.firstObject');

    assert.equal(first.get('raw.id'), 'first');
    assert.ok(!first.isDestroying);

    source.removeAt(0);

    assert.equal(run(() => prop.get('content.length')), 0);
    assert.ok(first.isDestroying);
  });

  test('models are destroyed on prop destroy', async function(assert) {
    let subject = this.subject({
      source: A([ { id: 'first' } ]),
      models: models('source', {
        prepare(raw) {
          this.setProperties({ raw });
        }
      })
    });

    let prop = subject.get('models');

    assert.equal(prop.get('content.length'), 1);
    let first = prop.get('content.firstObject');
    assert.equal(first.get('raw.id'), 'first');
    assert.ok(!first.isDestroying);

    run(() => subject.destroy());

    assert.ok(first.isDestroying);
  });

  test('model is recreated on dependency change', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', 'id', {
        prepare(raw) {
          this.setProperties({ raw });
        }
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    let doc = EmberObject.create({ id: 'first' });

    source.pushObject(doc);

    let first = prop.get('content.firstObject');

    assert.equal(first.get('raw.id'), 'first');

    doc.set('id', 'second');

    let second = run(() => prop.get('content.firstObject'));

    assert.ok(first !== second);
    assert.ok(first.isDestroying);
    assert.ok(!second.isDestroying);
  });

  test('inline without mapping', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', {
        prepare(raw, owner) {
          assert.ok(raw);
          assert.ok(owner);
          assert.ok(owner === subject);
          let id = raw.get('id');
          this.setProperties({ raw, id });
        }
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    source.pushObject(EmberObject.create({ id: 'first' }));

    let first = prop.get('content.firstObject');

    assert.equal(first.get('raw.id'), 'first');
    assert.equal(first.get('id'), 'first');
  });

  test('inline with mapping', async function(assert) {
    let subject = this.subject({
      source: A(),
      models: models('source', {
        prepare({ raw, id }) {
          assert.equal(arguments[1], undefined);
          this.setProperties({ raw, id });
        }
      }).mapping((raw, owner) => {
        assert.ok(owner === subject);
        let id = raw.get('id');
        return { raw, id };
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    source.pushObject(EmberObject.create({ id: 'first' }));

    let first = prop.get('content.firstObject');
    assert.equal(first.get('raw.id'), 'first');
    assert.equal(first.get('id'), 'first');
  });

  test('named with mapping', async function(assert) {
    this.registerModel('book', EmberObject.extend({
      prepare({ raw, id }) {
        this.setProperties({ raw, id });
      }
    }));

    let subject = this.subject({
      source: A(),
      models: models('source', 'book').mapping((raw, owner) => {
        assert.ok(owner === subject);
        let id = raw.get('id');
        return { raw, id };
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    source.pushObject(EmberObject.create({ id: 'first' }));

    let first = prop.get('content.firstObject');
    assert.equal(first.get('raw.id'), 'first');
    assert.equal(first.get('id'), 'first');
  });

  test('named without mapping', async function(assert) {
    let subject;

    this.registerModel('book', EmberObject.extend({
      prepare(raw, owner) {
        assert.ok(subject === owner);
        let id = raw.get('id');
        this.setProperties({ raw, id });
      }
    }));

    subject = this.subject({
      source: A(),
      models: models('source', 'book')
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    source.pushObject(EmberObject.create({ id: 'first' }));

    let first = prop.get('content.firstObject');
    assert.equal(first.get('raw.id'), 'first');
    assert.equal(first.get('id'), 'first');
  });

  test('resolved with mapping', async function(assert) {
    this.registerModel('book', EmberObject.extend({
      prepare({ raw, id }) {
        this.setProperties({ raw, id });
      }
    }));

    let subject = this.subject({
      source: A(),
      models: models('source', (doc, owner) => {
        assert.equal(doc.get('id'), 'first');
        assert.ok(owner === subject);
        return 'book';
      }).mapping((raw, owner) => {
        assert.ok(owner === subject);
        let id = raw.get('id');
        return { raw, id };
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    source.pushObject(EmberObject.create({ id: 'first' }));

    let first = prop.get('content.firstObject');
    assert.equal(first.get('raw.id'), 'first');
    assert.equal(first.get('id'), 'first');
  });

  test('resolved with mapping replaces model', async function(assert) {
    this.registerModel('book', EmberObject.extend({
      modelName: 'book',
      prepare({ raw, id }) {
        this.setProperties({ raw, id });
      }
    }));

    this.registerModel('newspaper', EmberObject.extend({
      modelName: 'newspaper',
      prepare({ raw, id }) {
        this.setProperties({ raw, id });
      }
    }));

    let subject = this.subject({
      source: A(),
      models: models('source', 'type', doc => {
        return doc.get('type');
      }).mapping((raw, owner) => {
        assert.ok(owner === subject);
        let id = raw.get('id');
        return { raw, id };
      })
    });

    let source = subject.get('source');
    let prop = subject.get('models');

    let doc = EmberObject.create({ id: 'first', type: 'book' });
    source.pushObject(doc);

    let first = prop.get('content.firstObject');
    assert.equal(first.get('modelName'), 'book');

    doc.set('type', 'newspaper');

    let second = run(() => prop.get('content.firstObject'));
    assert.equal(second.get('modelName'), 'newspaper');

    assert.ok(first.isDestroying);
    assert.ok(!second.isDestroying);
  });

});
