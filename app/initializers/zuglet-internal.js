import Stores from 'zuglet/-private/stores/stores';
import Stats from 'zuglet/-private/stores/stats';
import Factory from 'zuglet/-private/factory/factory';
import ModelsFactory from 'zuglet/-private/factory/factory/models';
import ZugletFactory from 'zuglet/-private/factory/factory/zuglet';

import ModelState from 'zuglet/-private/model/state/model';
import RootState from 'zuglet/-private/model/state/root';

import WritableActivateProperty from 'zuglet/-private/model/properties/activate/writable';
import ContentActivateProperty from 'zuglet/-private/model/properties/activate/content';
import ObjectProperty from 'zuglet/-private/model/properties/object';
import ModelsProperty from 'zuglet/-private/model/properties/models';
import ModelProperty from 'zuglet/-private/model/properties/model';

import Store from 'zuglet/-private/store/store';

import DocumentReference from 'zuglet/-private/store/firestore/references/document';
import CollectionReference from 'zuglet/-private/store/firestore/references/collection';
import ConditionReference from 'zuglet/-private/store/firestore/references/condition';
import CollectionGroupReference from 'zuglet/-private/store/firestore/references/collection-group';

import Document from 'zuglet/-private/store/firestore/document';
import QueryArray from 'zuglet/-private/store/firestore/query/array';
import QuerySingle from 'zuglet/-private/store/firestore/query/single';

import Transaction from 'zuglet/-private/store/firestore/transaction';
import Batch from 'zuglet/-private/store/firestore/batch';

import Auth from 'zuglet/-private/store/auth/auth';
import AuthMethods from 'zuglet/-private/store/auth/methods';
import AnonymousAuthMethod from 'zuglet/-private/store/auth/methods/anonymous';
import TokenAuthMethod from 'zuglet/-private/store/auth/methods/token';
import EmailAuthMethod from 'zuglet/-private/store/auth/methods/email';
import PopupAuthMethod from 'zuglet/-private/store/auth/methods/popup';
import PopupGoogleAuthMethod from 'zuglet/-private/store/auth/methods/popup/google';
import User from 'zuglet/-private/store/auth/user';

import Storage from 'zuglet/-private/store/storage/storage';
import StorageReference from 'zuglet/-private/store/storage/reference';
import StorageTask from 'zuglet/-private/store/storage/task';

import Functions from 'zuglet/-private/store/functions/functions';
import FunctionsRegion from 'zuglet/-private/store/functions/region';

export default {
  name: 'zuglet:internal',
  after: 'zuglet:version',
  initialize(container) {
    container.register('zuglet:factory', Factory);
    container.register('zuglet:factory/models', ModelsFactory);
    container.register('zuglet:factory/zuglet', ZugletFactory);

    container.register('zuglet:stores', Stores);
    container.register('zuglet:stores/stats', Stats);

    container.register('zuglet:state/model', ModelState);
    container.register('zuglet:state/root', RootState);

    container.register('zuglet:properties/activate/writable', WritableActivateProperty);
    container.register('zuglet:properties/activate/content', ContentActivateProperty);
    container.register('zuglet:properties/object', ObjectProperty);
    container.register('zuglet:properties/models', ModelsProperty);
    container.register('zuglet:properties/model', ModelProperty);

    container.register('zuglet:store', Store);

    container.register('zuglet:store/firestore/reference/document', DocumentReference);
    container.register('zuglet:store/firestore/reference/collection', CollectionReference);
    container.register('zuglet:store/firestore/reference/condition', ConditionReference);
    container.register('zuglet:store/firestore/reference/collection-group', CollectionGroupReference);

    container.register('zuglet:store/firestore/document', Document);
    container.register('zuglet:store/firestore/query/array', QueryArray);
    container.register('zuglet:store/firestore/query/single', QuerySingle);

    container.register('zuglet:store/firestore/transaction', Transaction);
    container.register('zuglet:store/firestore/batch', Batch);

    container.register('zuglet:store/auth', Auth);
    container.register('zuglet:store/auth/methods', AuthMethods);
    container.register('zuglet:store/auth/methods/anonymous', AnonymousAuthMethod);
    container.register('zuglet:store/auth/methods/email', EmailAuthMethod);
    container.register('zuglet:store/auth/methods/token', TokenAuthMethod);
    container.register('zuglet:store/auth/methods/popup', PopupAuthMethod);
    container.register('zuglet:store/auth/methods/popup/google', PopupGoogleAuthMethod);
    container.register('zuglet:store/auth/user', User);

    container.register('zuglet:store/storage', Storage);
    container.register('zuglet:store/storage/reference', StorageReference);
    container.register('zuglet:store/storage/task', StorageTask);

    container.register('zuglet:store/functions', Functions);
    container.register('zuglet:store/functions/region', FunctionsRegion);
  }
}
