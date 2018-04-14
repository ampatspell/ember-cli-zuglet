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

import AuthInternal from 'ember-cli-zuglet/-private/auth/auth/internal';
import Auth from 'ember-cli-zuglet/-private/auth/auth/auth';
import AuthUserInternal from 'ember-cli-zuglet/-private/auth/user/internal';
import AuthUser from 'ember-cli-zuglet/-private/auth/user/user';

import AuthMethodsInternal from 'ember-cli-zuglet/-private/auth/methods/internal';
import AuthMethods from 'ember-cli-zuglet/-private/auth/methods/methods';
import AuthMethodAnonymousInternal from 'ember-cli-zuglet/-private/auth/methods/anonymous/internal';
import AuthMethodAnonymous from 'ember-cli-zuglet/-private/auth/methods/anonymous/anonymous';
import AuthMethodEmailInternal from 'ember-cli-zuglet/-private/auth/methods/email/internal';
import AuthMethodEmail from 'ember-cli-zuglet/-private/auth/methods/email/email';

import StorageInternal from 'ember-cli-zuglet/-private/storage/storage/internal';
import Storage from 'ember-cli-zuglet/-private/storage/storage/storage';

import StorageReferenceInternal from 'ember-cli-zuglet/-private/storage/reference/internal';
import StorageReference from 'ember-cli-zuglet/-private/storage/reference/reference';

import StorageReferenceMetadataInternal from 'ember-cli-zuglet/-private/storage/reference/metadata/internal';
import StorageReferenceMetadata from 'ember-cli-zuglet/-private/storage/reference/metadata/metadata';

import StorageTaskInternal from 'ember-cli-zuglet/-private/storage/task/internal';
import StorageTask from 'ember-cli-zuglet/-private/storage/task/task';

export default {
  name: 'zuglet:internal',
  initialize(container) {

    //

    container.register('zuglet:stores', Stores);
    container.register('zuglet:stores/internal', StoresInternal);

    //

    container.register('zuglet:store/internal', StoreInternal);
    container.register('zuglet:store/observed', ModelArrayProxy);

    //

    container.register('zuglet:query/array/internal', QueryArrayInternal);
    container.register('zuglet:query/array/content', ModelArrayProxy);
    container.register('zuglet:query/array', QueryArrayModel);

    //

    container.register('zuglet:query/first/internal', QueryFirstInternal);
    container.register('zuglet:query/first', QueryFirstModel);

    //

    container.register('zuglet:document/internal', DocumentInternal);
    container.register('zuglet:document', Document);

    //

    container.register('zuglet:reference/collection/internal', CollectionReferenceInternal);
    container.register('zuglet:reference/collection', CollectionReference);

    container.register('zuglet:reference/document/internal', DocumentReferenceInternal);
    container.register('zuglet:reference/document', DocumentReference);

    container.register('zuglet:reference/query/internal', QueryReferenceInternal);
    container.register('zuglet:reference/query', QueryReference);

    //

    container.register('zuglet:observers', Observers);

    //

    container.register('zuglet:queue/serialized', SerializedQueue);
    container.register('zuglet:queue/concurrent', ConcurrentQueue);
    container.register('zuglet:queue/operation', QueueOperation);

    //

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

    //

    container.register('zuglet:auth/internal', AuthInternal);
    container.register('zuglet:auth', Auth);

    container.register('zuglet:auth/user/internal', AuthUserInternal);
    container.register('zuglet:auth/user', AuthUser);

    container.register('zuglet:auth/methods/internal', AuthMethodsInternal);
    container.register('zuglet:auth/methods', AuthMethods);

    container.register('zuglet:auth/method/anonymous/internal', AuthMethodAnonymousInternal);
    container.register('zuglet:auth/method/anonymous', AuthMethodAnonymous);

    container.register('zuglet:auth/method/email/internal', AuthMethodEmailInternal);
    container.register('zuglet:auth/method/email', AuthMethodEmail);

    //

    container.register('zuglet:storage/internal', StorageInternal);
    container.register('zuglet:storage', Storage);

    container.register('zuglet:storage/reference/internal', StorageReferenceInternal);
    container.register('zuglet:storage/reference', StorageReference);

    container.register('zuglet:storage/reference/metadata/internal', StorageReferenceMetadataInternal);
    container.register('zuglet:storage/reference/metadata', StorageReferenceMetadata);

    container.register('zuglet:storage/task/internal', StorageTaskInternal);
    container.register('zuglet:storage/task', StorageTask);
  }
}
