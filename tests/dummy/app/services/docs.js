import Service from 'ember-cli-remark-static/static/service';

export default class DocsService extends Service {

  identifier = 'docs'

  pageFactoryName(id) {
    return 'model:docs/page';
  }

}