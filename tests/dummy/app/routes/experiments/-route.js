import Route from '@ember/routing/route';
// import { later } from '@ember/runloop';
// import { Promise, reject } from 'rsvp';

// const wait = delay => new Promise(resolve => later(resolve, delay));

export default Route.extend({

  // model(params) {
  //   let missing = params[Object.keys(params)[0]] === 'missing';
  //   console.log(this.routeName, 'model', params, missing ? 'missing' : '');
  //   return wait(500).then(() => {
  //     if(missing) {
  //       return reject(new Error('not_found'));
  //     }
  //     return { model: true, params };
  //   });
  // },

  // setupController(controller, model) {
  //   console.log(this.routeName, 'setupController', model);
  //   this._super(...arguments);
  // },

  // resetController(controller, isExiting/*, transition*/) {
  //   let model = controller.get('model');
  //   console.log(this.routeName, 'resetController', isExiting, model);
  //   this._super(...arguments);
  // }

});
