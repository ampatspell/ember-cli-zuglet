import Service from 'ember-cli-remark-static/static/service';

export default Service.extend({

  identifier: 'docs',

  pageFactoryName(id) {
    if(!id) {
      return;
    }
    return 'model:docs/page';
  }

});
