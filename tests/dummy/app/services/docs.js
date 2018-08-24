import Service from 'ember-cli-remark-static/static/service';

export default Service.extend({

  identifier: 'docs',

  pageFactoryName(id) {
    if(!id) {
      return;
    }
    if(id.startsWith('api')) {
      return `model:docs/page/api`;
    }
    return 'model:docs/page';
  }

});
