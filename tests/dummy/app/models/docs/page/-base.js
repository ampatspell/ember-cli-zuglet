import Base from '../page';

export default class Page extends Base {

  preprocessNode(parent, node) {
    if(node.tagName === 'a') {
      let { properties: { href } } = node;
      if([ 'api', 'guides' ].find(str => href.startsWith(str))) {
        node.properties.route = 'docs.page';
        node.properties.model = href;
        node.componentName = 'docs/route';
        return;
      }
    }
    super.preprocessNode(parent, node);
  }

}
