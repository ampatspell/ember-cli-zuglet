import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { root, models, activate } from 'zuglet/decorators';
import { inject as service } from '@ember/service';
import { setGlobal, toString } from 'zuglet/utils';
import { prevObject, nextObject } from '../../../util/array';

@root()
export default class RoutePlaygroundReorderingComponent extends Component {

  constructor() {
    super(...arguments);
    setGlobal({ component: this });
  }

  @service store;

  //

  @activate()
    .content(({ store }) => store.collection('posts').orderBy('position').query())
  query;

  @models()
    .source(({ query }) => query.content)
    .named('post')
    .mapping(doc => ({ doc }))
  models;

  //

  @tracked title;
  @tracked position;

  @action
  async add() {
    let { title, position } = this;
    position = parseInt(position);

    if(isNaN(position)) {
      return;
    }

    await this.store.collection('posts').doc().new({
      title,
      position
    }).save();
  }

  @action
  async reset() {
    let content = this.query.content;
    let max = 5;
    let keep = content.slice(0, 5);
    if(content.length > max) {
      let del = content.filter(doc => !keep.includes(doc));
      await Promise.all(del.map(doc => doc.delete()));
    }
    await this.store.batch(batch => {
      keep.forEach((doc, idx) => {
        doc.data.position = (idx + 1) * 10;
        batch.save(doc);
      });
    });
  }

  async swap(a, b) {
    if(!a || !b) {
      return;
    }

    let position = a.data.position;
    a.data.position = b.data.position;
    b.data.position = position;

    await Promise.all([
      a.save(),
      b.save()
    ]);

    // let sorted = sortedBy(this.query.content, doc => doc.data.position);
    // await Promise.all(sorted.map(async (doc, index) => {
    //   doc.data.position = index;
    //   await doc.save();
    // }));
  }

  @action
  moveUp(doc) {
    this.swap(doc, prevObject(this.query.content, doc));
  }

  @action
  moveDown(doc) {
    this.swap(doc, nextObject(this.query.content, doc));
  }

  @action
  async delete(doc) {
    await doc.delete();
  }

  toString() {
    return toString(this);
  }

}
