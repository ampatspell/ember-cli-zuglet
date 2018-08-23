import Component from 'ember-cli-remark-static/components/ui-remark/render/a/component';
import { inject as service } from '@ember/service';

export default Component.extend({

  router: service(),

  click(e) {
    e.preventDefault();
    let node = this.get('node');
    let href = node.properties.href;
    this.router.transitionTo(href);
  }

});
