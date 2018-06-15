import Route from '@ember/routing/route';
import { getFastBoot } from 'ember-cli-zuglet/-private/util/fastboot';

export default Route.extend({

  model({ path }) {
    let { isFastBoot, fastboot } = getFastBoot(this);
    if(isFastBoot) {
      fastboot.set('response.statusCode', 404);
    }
    return { path };
  }

});
