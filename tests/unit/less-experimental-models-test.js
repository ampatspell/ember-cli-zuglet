import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { models } from 'ember-cli-zuglet/less-experimental';
import { A } from '@ember/array';
import { run } from '@ember/runloop';

const Owner = EmberObject.extend({
});

module('less-experimental-models', function(hooks) {
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

  test('acceptance', async function(assert) {
    let duck = this.object({ name: 'duck' });
    let hamster = this.object({ name: 'hamster' });
    let otter = this.object({ name: 'otter' });

    let subject = this.subject({

      all: A([ duck, hamster, otter ]),
      selected: A([ duck, otter ]),
      type: 'all',

      models: models('type', owner => owner.type).object('name').inline({
        prepare(object) {
          this.setProperties({ name: object.name });
        }
      })

    });

    assert.deepEqual(subject.models.mapBy('name'), [ 'duck', 'hamster', 'otter' ]);

    subject.set('type', 'selected');

    assert.deepEqual(subject.models.mapBy('name'), [ 'duck', 'otter' ]);

    // hamster destroy

    run(() => subject.destroy());
  });

});
