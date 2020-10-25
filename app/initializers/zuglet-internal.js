import Stores from 'zuglet/-private/stores/stores';
import Stats from 'zuglet/-private/stores/stats';
import Models from 'zuglet/-private/stores/models';
import ModelState from 'zuglet/-private/model/state/model';
import RootState from 'zuglet/-private/model/state/root';
import ActivateProperty from 'zuglet/-private/model/properties/activate';
import ObjectProperty from 'zuglet/-private/model/properties/object';
import ModelsProperty from 'zuglet/-private/model/properties/models';

import Store from 'zuglet/-private/store/store';

import DocumentReference from 'zuglet/-private/store/firestore/references/document';
import CollectionReference from 'zuglet/-private/store/firestore/references/collection';
import ConditionReference from 'zuglet/-private/store/firestore/references/condition';

import Document from 'zuglet/-private/store/firestore/document';
import Query from 'zuglet/-private/store/firestore/query';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:stores', Stores);
    container.register('zuglet:stores/models', Models);
    container.register('zuglet:stores/stats', Stats);

    container.register('zuglet:state/model', ModelState);
    container.register('zuglet:state/root', RootState);

    container.register('zuglet:properties/activate', ActivateProperty);
    container.register('zuglet:properties/object', ObjectProperty);
    container.register('zuglet:properties/models', ModelsProperty);

    container.register('zuglet:store', Store);

    container.register('zuglet:store/firestore/reference/document', DocumentReference);
    container.register('zuglet:store/firestore/reference/collection', CollectionReference);
    container.register('zuglet:store/firestore/reference/condition', ConditionReference);

    container.register('zuglet:store/firestore/document', Document);
    container.register('zuglet:store/firestore/query', Query);
  }
}
