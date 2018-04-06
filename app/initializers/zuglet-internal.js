import Stores from 'ember-cli-zuglet/-private/stores';
import StoresInternal from 'ember-cli-zuglet/-private/stores-internal';
import StoreInternal from 'ember-cli-zuglet/-private/store-internal';
import QueryArrayInternal from 'ember-cli-zuglet/-private/query/array/internal';
import QueryArrayModel from 'ember-cli-zuglet/-private/query/array/query';
import TaskSerialized from 'ember-cli-zuglet/-private/task/serialized';
import Observers from 'ember-cli-zuglet/-private/util/observers';
import DocumentInternal from 'ember-cli-zuglet/-private/document-internal';
import Document from 'ember-cli-zuglet/-private/document';
import ModelArrayProxy from 'ember-cli-zuglet/-private/util/read-only-model-array-proxy';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:stores', Stores);
    container.register('zuglet:stores/internal', StoresInternal);
    container.register('zuglet:store/internal', StoreInternal);

    container.register('zuglet:query/array/internal', QueryArrayInternal);
    container.register('zuglet:query/array/content', ModelArrayProxy);
    container.register('zuglet:query/array', QueryArrayModel);

    container.register('zuglet:document/internal', DocumentInternal);
    container.register('zuglet:document', Document);

    container.register('zuglet:task/serialized', TaskSerialized);
    container.register('zuglet:observers', Observers);
  }
}
