import Stores from 'zuglet/-private/stores/stores';
import Stats from 'zuglet/-private/stores/stats';
import ModelState from 'zuglet/-private/model/state/model';
import RootState from 'zuglet/-private/model/state/root';
import ActivateProperty from 'zuglet/-private/model/properties/activate';
import ObjectProperty from 'zuglet/-private/model/properties/object';

import Store from 'zuglet/-private/store/store';
import Document from 'zuglet/-private/store/firestore/document';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:stores', Stores);
    container.register('zuglet:stats', Stats);

    container.register('zuglet:state/model', ModelState);
    container.register('zuglet:state/root', RootState);

    container.register('zuglet:properties/activate', ActivateProperty);
    container.register('zuglet:properties/object', ObjectProperty);

    container.register('zuglet:store', Store);
    container.register('zuglet:store/firestore/document', Document);
  }
}
