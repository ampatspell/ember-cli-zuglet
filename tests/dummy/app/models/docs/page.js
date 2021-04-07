import { setOwner } from '@ember/application';
import { reads } from "macro-decorators";
import { cached } from "tracked-toolbox";
import { remark } from 'remark/decorators';

const withoutExtension = fn => (target, key) => cached(target, key, {
  get() {
    let components = fn.call(this, this).split('.');
    components.pop();
    return components.join('.');
  }
});

export default class Page {

  constructor(owner, { docs, file }) {
    setOwner(this, owner);
    this.docs = docs;
    this.file = file;
  }

  @reads('file.attributes.pos') pos;
  @reads('file.attributes.hidden') hidden;
  @reads('file.body') body;
  @reads('file.filename') filename;
  @reads('file.directory') directory;

  @withoutExtension(page => page.file.name) id;
  @withoutExtension(page => page.filename) name;

  get pages() {
    return this.docs.directory(this.id);
  }

  @cached
  get title() {
    let { file } = this;
    return file.attributes.title || file.toc[0]?.content || this.name;
  }

  @remark('body')
  tree(node) {
    if(node.tagName === 'a') {
      let href = node.properties.href;
      if(href.startsWith('http:') || href.startsWith('https:') || href.startsWith('mailto:')) {
        node.properties.target = 'top';
      } else if(href.startsWith('api/')) {
        return {
          type: 'component',
          name: 'block/remark/link-to',
          inline: true,
          model: {
            route: 'docs.page',
            model: href
          },
          children: node.children
        };
      } else {
        console.log('Unmapped link', node);
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
