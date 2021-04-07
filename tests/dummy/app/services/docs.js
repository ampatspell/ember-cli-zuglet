import FilesService from 'remark/services/files';
import { cached } from "tracked-toolbox";
import { inject as service } from "@ember/service";

export default class DocsService extends FilesService {

  identifier = 'docs';

  @service store;

  @cached
  get pages() {
    return this.all.map(file => this.store.models.create('docs/page', { file, docs: this }));
  }

  constructor() {
    super(...arguments);
    window.docs = this;
  }

  page(name) {
    return this.pages.find(page => page.filename === `${name}.md`);
  }

  directory(name) {
    return this.pages.filter(page => page.directory === name);
  }

}
