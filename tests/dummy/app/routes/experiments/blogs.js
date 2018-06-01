import Route from '@ember/routing/route';
import { model } from 'ember-cli-zuglet/experimental/route';
import { observed } from 'ember-cli-zuglet/experimental/computed';
import { all } from 'rsvp';

export default Route.extend({

  model: model({

    blogs: observed(),

    insert() {
      let store = this.get('store');
      let doc = (path, data) => store.doc(path).new(data).save();
      let post = (blog, name) => doc(`blogs/${blog}/posts/${name}`, { blog, name });
      let blog = name => all([
        doc(`blogs/${name}`, { name }),
        post(name, 'one'),
        post(name, 'two'),
      ]);
      return all([
        blog('amateurinmotion'),
        blog('zeeba')
      ]);
    },

    prepare() {
      // return this.insert();
      let blogs = this.get('store').collection('blogs').query({ type: 'array' });

      this.setProperties({
        blogs
      });

      return blogs.get('observers.promise');
    }

  })

});
