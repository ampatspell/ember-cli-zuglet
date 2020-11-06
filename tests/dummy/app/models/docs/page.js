import Page from 'ember-cli-remark-static/static/page';

export default class DocPage extends Page {

  preprocessNode(parent, node) {
    if(node.tagName === 'a') {
      if(node.properties.href.startsWith('/')) {
        node.componentName = 'docs/route';
        node.properties.route = node.properties.href.substr(1);
      }
    }
  }

}