import State from 'zuglet/-private/state';
import DummyProperty from 'zuglet/-private/property/dummy';
import ActivateProperty from 'zuglet/-private/property/activate';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:state', State);
    container.register('zuglet:properties/dummy', DummyProperty);
    container.register('zuglet:properties/activate', ActivateProperty);
  }
}
