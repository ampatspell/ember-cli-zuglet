import Route from '@ember/routing/route';
import { route, observed } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';

let inserted = false;

export default Route.extend({

  model: route().inline({

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
      let blogs = this.get('store').collection('blogs').query({ type: 'array' });

      this.setProperties({
        blogs
      });

      if(!inserted) {
        this.insert(); // no await, observer will pickup all added docs
        inserted = true;
      }

      return blogs.get('observers.promise');
    },

    init() {
      this._super(...arguments);
      console.log('init', this+'');
    },

    willDestroy() {
      this._super(...arguments);
      console.log('willDestroy', this+'');
    }

  })

});
