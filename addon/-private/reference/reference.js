import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import ModelMixin from '../model-mixin';

export default EmberObject.extend(ModelMixin, {

  id:   readOnly(`_internal.ref.id`),
  path: readOnly(`_internal.ref.path`),

  parent: computed(function() {
    let parent =  this._internal.get('parent');
    return parent && parent.model(true);
  })

});
