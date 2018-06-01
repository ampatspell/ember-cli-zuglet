import EmberObject from '@ember/object';
import { observed, observerPromiseFor } from 'ember-cli-zuglet/experimental/computed';
import { reject } from 'rsvp';

export default EmberObject.extend({

  blog: null,
  posts: observed(),

  prepare({ blogs, id }) {
    let blog = blogs.get('blogs.content').findBy('id', id);
    if(!blog) {
      return reject(new Error(`Blog '${id}' was not found`));
    }

    let posts = blog.get('ref').collection('posts').query({ type: 'array' });

    this.setProperties({
      blog,
      posts
    });

    return posts.load();
    // return oserverPromiseFor(this, 'posts');
  }

});
