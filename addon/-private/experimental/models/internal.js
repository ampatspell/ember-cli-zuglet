import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Internal from '../../internal/internal';

export default Internal.extend({

  owner: null,
  opts: null,

  source: computed(function() {
    let { owner, opts: { source } } = this.getProperties('owner', 'opts');
    return this.factoryFor('zuglet:computed/models/internal/source').create({ owner, key: source });
  }).readOnly(),

  content: readOnly('source.content'),

  factoryFor(name) {
    return getOwner(this).factoryFor(name);
  },

  createModel() {
    return this.factoryFor('zuglet:computed/models').create({ _internal: this });
  },

  startObserving() {
    let content = this.get('content');
    if(content) {
      return;
    }
  },

  stopObserving() {
    let content = this.get('content');
    if(!content) {
      return;
    }
  }

});
