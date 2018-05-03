import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.get('docs.index').load();
  }

})
