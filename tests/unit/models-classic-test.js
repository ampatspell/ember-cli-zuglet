import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { guidFor } from '@ember/object/internals';
import EmberObject from '@ember/object';
import classic from 'ember-classic-decorator';

module('models / classic', function(hooks) {
  setupStoreTest(hooks);

  test('create classic model', async function(assert) {
    @classic
    class Hamster extends EmberObject {

      @service store

      toStringExtension() {
        let { id, name } = this;
        return `${id}:${name}`;
      }

    }

    this.registerModel('hamster', Hamster);

    let model = this.store.models.create('hamster', { id: 'z33ba', name: 'Zeeba' });
    assert.ok(model);
    assert.strictEqual(model.id, 'z33ba');
    assert.strictEqual(model.name, 'Zeeba');
    assert.ok(model.store === getOwner(this.store).lookup('service:store'));
    assert.strictEqual(String(model), `<dummy@model:hamster::${guidFor(model)}:z33ba:Zeeba>`);
  });


});
