import Route from '@ember/routing/route';

export default Route.extend({

  // beforeModel() {
  //   this.transitionTo('docs.about');
  // }

  model() {
    return this.get('docs').page('index').load();
  }

})
