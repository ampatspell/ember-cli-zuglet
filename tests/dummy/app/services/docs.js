import Service from 'ember-cli-remark-static/static/service';

export default class DocsService extends Service {

  identifier = 'docs'

  pageFactoryName(id) {
    if(!id) {
      return;
    }
    if(id.startsWith('api')) {
      return `model:docs/page/api`;
    }
    if(id.startsWith('guides')) {
      return `model:docs/page/guide`;
    }
    return 'model:docs/page';
  }

}