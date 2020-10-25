import Stats from 'zuglet/-private/stats';
import ModelState from 'zuglet/-private/model/state/model';
import RootState from 'zuglet/-private/model/state/root';
import ActivateProperty from 'zuglet/-private/model/properties/activate';

export default {
  name: 'zuglet:internal',
  initialize(container) {
    container.register('zuglet:stats', Stats);
    container.register('zuglet:state/model', ModelState);
    container.register('zuglet:state/root', RootState);
    container.register('zuglet:properties/activate', ActivateProperty);
  }
}
