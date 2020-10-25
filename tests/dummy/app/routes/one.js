import Route from '@ember/routing/route';

export default class OneRoute extends Route {

  beforeModel() {
    super.beforeModel(...arguments);
    console.log('before model');
  }

  resetController() {
    super.resetController(...arguments);
    console.log('reset controller');
  }

}
