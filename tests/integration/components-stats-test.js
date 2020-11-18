import { module, test, setupRrenderingStoreTest } from '../helpers/setup';
import { render, pauseTest } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('components / stats', function(hooks) {
  setupRrenderingStoreTest(hooks);

  test('render', async function(assert) {
    await render(hbs`<Zuglet::Stats/>`);

    let el = this.element.querySelector('.zuglet-stats');
    assert.ok(el);

    let sections = el.querySelectorAll('.section');
    assert.strictEqual(sections.length, 4);

    let sectionInfo = section => {
      let label = section.querySelector('.label').innerText;
      let models = [ ...section.querySelectorAll('.models > .model') ].map(el => el.innerText);
      return {
        label,
        models
      };
    }

    {
      let section = sectionInfo(sections[0]);
      assert.strictEqual(section.label, 'Stores');
      assert.strictEqual(section.models.length, 2);
      assert.ok(section.models[0].startsWith('<dummy@zuglet:store/'));
      assert.ok(section.models[1].startsWith('<dummy@zuglet:store/'));
    }
    {
      let section = sectionInfo(sections[1]);
      assert.strictEqual(section.label, 'Activated (2)');
      assert.strictEqual(section.models.length, 2);
      assert.ok(section.models[0].startsWith('<dummy@zuglet:store/'));
      assert.ok(section.models[1].startsWith('<dummy@zuglet:store/'));
    }
  });

});
