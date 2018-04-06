import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from './model-mixin';
import { invokeReturningModel } from './util/internal-invoke';

export default EmberObject.extend(ModelMixin, {

  identifier: readOnly('_internal.identifier'),

  ready: computed(function() {
    return this.get('_internal.ready').then(() => this);
  }).readOnly(),

  collection: invokeReturningModel('collection'),
  doc: invokeReturningModel('doc')

});
