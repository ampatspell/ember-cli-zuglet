import ZugletObject from 'zuglet/object';
import { reads } from 'macro-decorators';

const data = key => reads(`doc.data.${key}`);

export default class Post extends ZugletObject {

  constructor(owner, { doc }) {
    super(owner);
    this.doc = doc;
  }

  @data('title') title;
  @data('position') position;

  load(type) {
    console.log('load', type, this+'');
  }

}
