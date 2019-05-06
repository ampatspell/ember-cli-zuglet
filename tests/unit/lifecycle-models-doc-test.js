import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { models } from 'ember-cli-zuglet/lifecycle';
import { readOnly } from '@ember/object/computed';

const Owner = EmberObject.extend({
});

module('lifecycle-models-doc', function(hooks) {
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

  test.only('hello', async function(assert) {
    let subject = this.subject({

      doc: null,
      ducks: readOnly('doc.data.ducks'),
      models: models('ducks').inline({
        prepare(duck) {
          this.setProperties({ name: duck.get('name') });
        }
      })

    });

    let doc = this.store.doc('ducks/weird').new({ ducks: [ { name: 'yellow' } ] });
    subject.set('doc', doc);

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'yellow' ]);

    doc.get('data.ducks').pushObject({ name: 'red' });

    assert.deepEqual(subject.get('models').mapBy('name'), [ 'yellow', 'red' ]);
  });

});
