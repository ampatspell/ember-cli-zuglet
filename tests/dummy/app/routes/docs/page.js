import Route from '@ember/routing/route';

const normalize = id => {
  if(id.endsWith('/')) {
    return id.slice(0, -1);
  }
  return id;
}

export default Route.extend({

  model(params) {
    let id = normalize(params.page_id);
    if(id === 'index') {
      return this.transitionTo('index');
    }
    return this.get('docs').page(id).load();
  }

});
