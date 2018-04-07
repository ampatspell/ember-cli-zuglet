import Stores from 'ember-cli-zuglet/-private/stores';
import StoresInternal from 'ember-cli-zuglet/-private/stores-internal';
import StoreInternal from 'ember-cli-zuglet/-private/store-internal';
import QueryArrayInternal from 'ember-cli-zuglet/-private/query/array/internal';
import QueryArrayModel from 'ember-cli-zuglet/-private/query/array/query';
import TaskSerialized from 'ember-cli-zuglet/-private/task/serialized';
import Observers from 'ember-cli-zuglet/-private/util/observers/observers';
import DocumentInternal from 'ember-cli-zuglet/-private/document-internal';
import Document from 'ember-cli-zuglet/-private/document';
import ModelArrayProxy from 'ember-cli-zuglet/-private/util/read-only-model-array-proxy';
import CollectionReference from 'ember-cli-zuglet/-private/reference/collection';
import CollectionReferenceInternal from 'ember-cli-zuglet/-private/reference/collection-internal';
import DocumentReference from 'ember-cli-zuglet/-private/reference/document';
import DocumentReferenceInternal from 'ember-cli-zuglet/-private/reference/document-internal';
import QueryReference from 'ember-cli-zuglet/-private/reference/query';
import QueyrReferenceInternal from 'ember-cli-zuglet/-private/reference/query-internal';
import Queue from 'ember-cli-zuglet/-private/util/queue/queue';
import QueueOperation from 'ember-cli-zuglet/-private/util/queue/operation';

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

    container.register('zuglet:reference/collection/internal', CollectionReferenceInternal);
    container.register('zuglet:reference/collection', CollectionReference);
    container.register('zuglet:reference/document/internal', DocumentReferenceInternal);
    container.register('zuglet:reference/document', DocumentReference);
    container.register('zuglet:reference/query/internal', QueyrReferenceInternal);
    container.register('zuglet:reference/query', QueryReference);

    container.register('zuglet:task/serialized', TaskSerialized);
    container.register('zuglet:observers', Observers);
    container.register('zuglet:queue', Queue);
    container.register('zuglet:queue/operation', QueueOperation);
  }
}
