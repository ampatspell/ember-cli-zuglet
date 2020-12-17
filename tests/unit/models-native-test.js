import { module, test, setupStoreTest } from '../helpers/setup';
import { setOwner, getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import { toString } from 'zuglet/utils';
import { guidFor } from '@ember/object/internals';
import ZugletObject from 'zuglet/object';

module('models / native', function(hooks) {
  setupStoreTest(hooks);

  test('create with owner and multiple params', async function(assert) {
    class Hamster {

      @service store

      constructor(owner, id, name) {
        setOwner(this, owner);
        this.id = id;
        this.name = name;
      }

      toString() {
        let { id, name } = this;
        return toString(this, `${id}:${name}`);
      }

    }

    this.registerModel('hamster', Hamster);

    let model = this.store.models.create('hamster', 'z33ba', 'Zeeba');
    assert.ok(model);
    assert.strictEqual(model.id, 'z33ba');
    assert.strictEqual(model.name, 'Zeeba');
    assert.ok(model.store === getOwner(this.store).lookup('service:store'));
    assert.strictEqual(String(model), `<dummy@model:hamster::${guidFor(model)}:z33ba:Zeeba>`);
  });

  test('create zuglet object', async function(assert) {
    class Hamster extends ZugletObject {

      @service store

      constructor(owner, id, name) {
        super(owner);
        this.id = id;
        this.name = name;
      }

      toStringExtension() {
        let { id, name } = this;
        return `${id}:${name}`;
      }

    }

    this.registerModel('hamster', Hamster);

    let model = this.store.models.create('hamster', 'z33ba', 'Zeeba');
    assert.ok(model);
    assert.strictEqual(model.id, 'z33ba');
    assert.strictEqual(model.name, 'Zeeba');
    assert.ok(model.store === getOwner(this.store).lookup('service:store'));
    assert.strictEqual(String(model), `<dummy@model:hamster::${guidFor(model)}:z33ba:Zeeba>`);
  });

});
