import Stats from 'zuglet/-private/stats';
import ModelState from 'zuglet/-private/state/model-state';
import RootState from 'zuglet/-private/state/root-state';
import ActivateProperty from 'zuglet/-private/property/activate';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:stats', Stats);
    container.register('zuglet:state/model', ModelState);
    container.register('zuglet:state/root', RootState);
    container.register('zuglet:properties/activate', ActivateProperty);
  }
}
