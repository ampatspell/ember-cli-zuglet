import FilesService from 'remark/services/files';
import { cached } from "tracked-toolbox";
import { inject as service } from "@ember/service";
import { setGlobal } from 'zuglet/utils';
import { sortedBy } from '../util/array';

export default class DocsService extends FilesService {

  identifier = 'docs';

  @service store;

  @cached
  get pages() {
    return sortedBy(this.all.map(file => {
      return this.store.models.create('docs/page', { file, docs: this });
    }), page => page.pos);
  }

  constructor() {
    super(...arguments);
    setGlobal({ docs: this });
  }

  page(name) {
    return this.pages.find(page => page.filename === `${name}.md`);
  }

  directory(name) {
    return this.pages.filter(page => page.directory === name);
  }

}
