import Page from 'ember-cli-remark-static/static/page';

export default class DocPage extends Page {

  get title() {
    let { name, headings, frontmatter } = this;
    return frontmatter?.title || headings?.[0]?.value || name;
  }

  get pos() {
    return this.frontmatter?.pos;
  }

  get hidden() {
    return this.frontmatter?.hidden;
  }

  // preprocessNode(parent, node) {
  //   if(node.tagName === 'a') {
  //     node.properties.target = 'top';
  //   }
  // }

  preprocessNode(parent, node) {
    if(node.tagName === 'a') {
      if(node.properties.href.startsWith('/')) {
        node.componentName = 'docs/route';
        node.properties.route = node.properties.href.substr(1);
      }
    }
  }

}