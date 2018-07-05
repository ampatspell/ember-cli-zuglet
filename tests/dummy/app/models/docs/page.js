import Page from 'ember-cli-remark-static/static/page';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Page.extend({

  title: computed('headings', 'frontmatter', function() {
    let { name, headings, frontmatter } = this.getProperties('name', 'headings', 'frontmatter');
    return (frontmatter && frontmatter.title) || (headings && headings[0] && headings[0].value) || name;
  }).readOnly(),

  pos: readOnly('frontmatter.pos'),
  hidden: readOnly('frontmatter.hidden')

});
