import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Internal from '../../internal/internal';

export default Internal.extend({

  owner: null,
  opts: null,

  _source: computed(function() {
    let { owner, opts: { source } } = this.getProperties('owner', 'opts');
    return this.factoryFor('zuglet:computed/models/internal/source').create({ owner, key: source });
  }).readOnly(),

  source: readOnly('_source.content'),

  // TODO: destroy mapping on source change
  _content: computed('source', function() {
    let { source, opts: { dependencies, factory, mapping } } = this.getProperties('source', 'opts');
    return this.factoryFor('zuglet:computed/models/internal/mapping').create({ source, dependencies, factory, mapping });
  }).readOnly(),

  content: readOnly('_content.content'),

  factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:computed/models').create({ _internal: this });
  }

});
