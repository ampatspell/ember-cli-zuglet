import Route from './-route';
import { all } from 'rsvp';

const insert = store => {
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

export default Route.extend({

  model(params) {
    return insert(this.get('store')).then(() => this._super(params));
  }

});
