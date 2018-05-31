import Route from '@ember/routing/route';
import RouteMixin from 'ember-cli-zuglet/-private/computed/route/mixin';
import inline from 'ember-cli-zuglet/-private/computed/route/inline';

import { all, resolve } from 'rsvp';

const insert = (store, enabled) => {
  if(!enabled) {
    return resolve();
  }
  console.log('insert');
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
}

export default Route.extend(RouteMixin, {

  model: inline({
    init() {
      this._super(...arguments);
      console.log('init', this+'');
    },
    prepare(route, params) {
      console.log('prepare', this+'');
    },
    willDestroy() {
      this._super(...arguments);
      console.log('willDestroy', this+'');
    }
  })

});
