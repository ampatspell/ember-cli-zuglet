import EmberObject, { computed } from '@ember/object';
import ModelMixin from '../../internal/model-mixin';

export default EmberObject.extend(ModelMixin, {

  methods: computed(function() {
    return this.get('_internal.methods').model(true);
  }).readOnly(),

  user: computed('_internal.user', function() {
    let internal = this.get('_internal.user');
    return internal && internal.model(true);
  }).readOnly()

});
