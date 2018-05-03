import Service from '@ember/service';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default Service.extend({

  pages: computed(function() {
    return Object.create(null);
  }).readOnly(),

  index: computed(function() {
    return getOwner(this).factoryFor('model:docs/index').create({ service: this });
  }).readOnly(),

  page(id) {
    let pages = this.get('pages');
    let page = pages[id];
    if(!page) {
      page = getOwner(this).factoryFor('model:docs/page').create({ service: this, id });
      pages[id] = page;
    }
    return page;
  }

});