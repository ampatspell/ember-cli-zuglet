import EmberObject from '@ember/object';

export default EmberObject.extend({

  blog: null,

  prepare({ blogs, id }) {
    let blog = blogs.get('blogs.content').findBy('id', id);
    this.set('blog', blog);
  }

});
