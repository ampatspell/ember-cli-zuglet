import Base from '../page';

export default class Page extends Base {

  // preprocessNode(parent, node) {
  //   if(node.tagName === 'a') {
  //     let href = node.properties.href;
  //     if([ 'api', 'guides' ].find(str => href.startsWith(str))) {
  //       node.properties.href = `/docs/${href}`;
  //       node.componentName = 'ui-remark/render/api-a';
  //       return;
  //     }
  //   }
  //   this._super(...arguments);
  // }

}