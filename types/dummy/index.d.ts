declare module 'ember-router-scroll' {
  import Router from '@ember/routing/router';
  export default Router;
}

declare module 'ember-cli-remark-static/static/service' {
  import Service from '@ember/service';
  class Page {
    name: string;
    pages: Page[];
    load(): Promise<this>;
  }
  class StaticService extends Service {
    page(id: string): Page;
  }
  export default StaticService;
}
