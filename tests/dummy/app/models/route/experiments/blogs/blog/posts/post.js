import EmberObject from '@ember/object';
import { reject } from 'rsvp';

export default EmberObject.extend({

  blog: null,
  post: null,

  prepare({ blog, id }) {
    let post = blog.get('posts.content').findBy('id', id);
    if(!post) {
      return reject(new Error(`Post '${id}' was not found`));
    }

    this.setProperties({
      blog,
      post
    });
  }

});
