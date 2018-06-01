import EmberObject from '@ember/object';
import { observed, observerPromiseFor } from 'ember-cli-zuglet/experimental/computed';
import { all } from 'rsvp';

export default EmberObject.extend({

  blogs: observed(),

  init() {
    this._super(...arguments);
    console.log('init', this+'');
  },

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
    console.log('prepare', this+'');
    // return this.insert();

    let blogs = this.get('store').collection('blogs').query({ type: 'array' });

    this.setProperties({
      blogs
    });

    // return observerPromiseFor(this, 'blogs');
    return this.get('blogs').load();
  },

  willDestroy() {
    this._super(...arguments);
    console.log('willDestroy', this+'');
  }

});
