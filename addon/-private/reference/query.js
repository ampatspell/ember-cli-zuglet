import EmberObject from '@ember/object';
import ModelMixin from '../model-mixin';
import QueryableMixin from './queryable-mixin';

export default EmberObject.extend(ModelMixin, QueryableMixin, {
});
