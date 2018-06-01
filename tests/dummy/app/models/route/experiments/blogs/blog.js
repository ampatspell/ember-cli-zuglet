import EmberObject from '@ember/object';
import { observed, observerPromiseFor } from 'ember-cli-zuglet/experimental/computed';

export default EmberObject.extend({

  blog: null,
  posts: observed(),

  prepare({ blogs, id }) {
    let blog = blogs.get('blogs.content').findBy('id', id);
    let posts = blog.get('ref').collection('posts').query({ type: 'array' });
    this.setProperties({ blog, posts });
    return posts.load();
    // return oserverPromiseFor(this, 'posts');
  }

});
