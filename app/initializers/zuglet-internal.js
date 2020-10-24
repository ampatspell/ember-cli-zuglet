import State from 'zuglet/-private/state';
import DummyProperty from 'zuglet/-private/dev/dummy';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:state', State);
    container.register('zuglet:properties/dummy', DummyProperty);
  }
}
