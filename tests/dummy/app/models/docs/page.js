import { setOwner } from '@ember/application';
import { reads } from "macro-decorators";
import { cached } from "tracked-toolbox";
import { remark } from 'remark/decorators';

export default class Page {

  constructor(owner, { file }) {
    setOwner(this, owner);
    this.file = file;
  }

  @reads('file.body') body;
  @reads('file.filename') filename;
  @reads('file.directory') directory;

  @cached
  get name() {
    let components = this.filename.split('.');
    components.pop();
    return components.join('.');
  }

  @remark('body')
  tree(node) {
    if(node.tagName === 'a') {
      let href = node.properties.href;
      if(href.startsWith('http:') || href.startsWith('https:') || href.startsWith('mailto:')) {
        node.properties.target = 'top';
      } else if(href.startsWith('/')) {
        console.log(node);
        // let route = href.substr(1);
        // return {
        //   type: 'component',
        //   name: 'remark/link-to',
        //   inline: true,
        //   model: {
        //     route
        //   },
        //   children: node.children
        // };
      }
    }
    return node;
  }

  async load() {
    await this.file.load();
    await this.tree.load();
    return this;
  }

}
