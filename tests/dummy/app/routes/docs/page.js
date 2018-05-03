import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {
    let id = params.page_id;
    if(id === 'index') {
      return this.transitionTo('index');
    }
    return this.get('docs').page(id).load();
  }

})
