import EmberObject from '@ember/object';
import { module, test, setupStoreTest } from '../helpers/setup';
import { getOwner } from '@ember/application';
import Route from '@ember/routing/route';

module('experimental-route', function(hooks) {
  setupStoreTest(hooks);

  hooks.beforeEach(async function() {
    this.getOwner = () => getOwner(this.store);
    this.create = (name, props) => {
      let factory = Route.extend(props);
      let owner = this.getOwner();
      let fullName = `route:${name}`;
      owner.register(fullName, factory);
      return owner.factoryFor(fullName).create({ routeName: name });
    };
  });

  test('hello', function(assert) {
    let route = this.create('test', {
    });
    assert.ok(route);
    assert.equal(route.routeName, 'test');
  });

});
