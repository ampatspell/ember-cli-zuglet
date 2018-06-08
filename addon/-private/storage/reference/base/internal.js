import Internal from '../../../internal/internal';
import queue from '../../../queue/computed';

export default Internal.extend({

  queue: queue('serialized', 'ref.storage.queue'),

});
