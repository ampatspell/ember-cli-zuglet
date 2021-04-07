import FilesService from 'remark/services/files';
import { cached } from "tracked-toolbox";
import { inject as service } from "@ember/service";
import { sortedBy } from '../util/array';

const normalize = name => {
  if(name && name.endsWith('/')) {
    name = name.substring(0, name.length - 1);
  }
  return name;
}

export default class DocsService extends FilesService {

  identifier = 'docs';

  @service store;

  @cached
  get pages() {
    return sortedBy(this.all.map(file => {
      return this.store.models.create('docs/page', { file, docs: this });
    }), page => page.pos);
  }

  @cached
  get root() {
    return this.pages.filter(page => page.directory === '');
  }

  page(name) {
    name = normalize(name);
    return this.pages.find(page => page.id === name);
  }

  directory(name) {
    name = normalize(name);
    return this.pages.filter(page => page.directory === name);
  }

}
