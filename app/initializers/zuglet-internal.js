import Stores from 'ember-cli-zuglet/-private/stores/stores';
import StoresInternal from 'ember-cli-zuglet/-private/stores/internal';

import StoreInternal from 'ember-cli-zuglet/-private/store/internal';

import QueryArrayInternal from 'ember-cli-zuglet/-private/query/array/internal';
import QueryArrayModel from 'ember-cli-zuglet/-private/query/array/query';
import QueryFirstInternal from 'ember-cli-zuglet/-private/query/first/internal';
import QueryFirstModel from 'ember-cli-zuglet/-private/query/first/query';

import DocumentInternal from 'ember-cli-zuglet/-private/document/internal';
import Document from 'ember-cli-zuglet/-private/document/document';

import CollectionReference from 'ember-cli-zuglet/-private/reference/collection/collection';
import CollectionReferenceInternal from 'ember-cli-zuglet/-private/reference/collection/internal';

import DocumentReference from 'ember-cli-zuglet/-private/reference/document/document';
import DocumentReferenceInternal from 'ember-cli-zuglet/-private/reference/document/internal';

import QueryReference from 'ember-cli-zuglet/-private/reference/query/query';
import QueryReferenceInternal from 'ember-cli-zuglet/-private/reference/query/internal';

import SerializedQueue from 'ember-cli-zuglet/-private/queue/serialized-queue';
import ConcurrentQueue from 'ember-cli-zuglet/-private/queue/concurrent-queue';
import QueueOperation from 'ember-cli-zuglet/-private/queue/operation';

import Observers from 'ember-cli-zuglet/-private/observers/observers';

import ModelArrayProxy from 'ember-cli-zuglet/-private/util/array-proxy';

import DataManagerInternal from 'ember-cli-zuglet/-private/data/manager';

import DataObjectSerializer from 'ember-cli-zuglet/-private/data/object/serializer';
import DataObjectInternal from 'ember-cli-zuglet/-private/data/object/internal';
import DataObject from 'ember-cli-zuglet/-private/data/object/object';

import DataPrimitiveSerializer from 'ember-cli-zuglet/-private/data/primitive/serializer';
import DataPrimitiveInternal from 'ember-cli-zuglet/-private/data/primitive/internal';

import DataArraySerializer from 'ember-cli-zuglet/-private/data/array/serializer';
import DataArrayInternal from 'ember-cli-zuglet/-private/data/array/internal';
import DataArray from 'ember-cli-zuglet/-private/data/array/array';

import DataReferenceSerializer from 'ember-cli-zuglet/-private/data/reference/serializer';
import DataReferenceInternal from 'ember-cli-zuglet/-private/data/reference/internal';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:stores', Stores);
    container.register('zuglet:stores/internal', StoresInternal);
    container.register('zuglet:store/internal', StoreInternal);
    container.register('zuglet:store/observed', ModelArrayProxy);

    container.register('zuglet:query/array/internal', QueryArrayInternal);
    container.register('zuglet:query/array/content', ModelArrayProxy);
    container.register('zuglet:query/array', QueryArrayModel);

    container.register('zuglet:query/first/internal', QueryFirstInternal);
    container.register('zuglet:query/first', QueryFirstModel);

    container.register('zuglet:document/internal', DocumentInternal);
    container.register('zuglet:document', Document);

    container.register('zuglet:reference/collection/internal', CollectionReferenceInternal);
    container.register('zuglet:reference/collection', CollectionReference);
    container.register('zuglet:reference/document/internal', DocumentReferenceInternal);
    container.register('zuglet:reference/document', DocumentReference);
    container.register('zuglet:reference/query/internal', QueryReferenceInternal);
    container.register('zuglet:reference/query', QueryReference);

    container.register('zuglet:observers', Observers);
    container.register('zuglet:queue/serialized', SerializedQueue);
    container.register('zuglet:queue/concurrent', ConcurrentQueue);
    container.register('zuglet:queue/operation', QueueOperation);

    container.register('zuglet:data/manager', DataManagerInternal);

    container.register('zuglet:data/object/serializer', DataObjectSerializer);
    container.register('zuglet:data/object/internal', DataObjectInternal);
    container.register('zuglet:data/object', DataObject);

    container.register('zuglet:data/array/serializer', DataArraySerializer);
    container.register('zuglet:data/array/internal', DataArrayInternal);
    container.register('zuglet:data/array', DataArray);

    container.register('zuglet:data/reference/serializer', DataReferenceSerializer);
    container.register('zuglet:data/reference/internal', DataReferenceInternal);

    container.register('zuglet:data/primitive/serializer', DataPrimitiveSerializer);
    container.register('zuglet:data/primitive/internal', DataPrimitiveInternal);
  }
}
