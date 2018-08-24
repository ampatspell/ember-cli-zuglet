import Page from '../page';

export default Page.extend({

  preprocessNode(parent, node) {
    if(node.tagName === 'a') {
      let href = node.properties.href;
      if(href.startsWith('api')) {
        node.properties.href = `/docs/${href}`;
        node.componentName = 'ui-remark/render/api-a';
        return;
      }
    }
    this._super(...arguments);
  }

});
