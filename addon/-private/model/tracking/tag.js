import { tracked } from '@glimmer/tracking';

class Tag {

  @tracked
  __tag__

  consume() {
    this.__tag__
  }

  dirty() {
    this.__tag__ = undefined;
  }

}

const TAGS = new WeakMap();

const getTag = (object, key) => {
  let tags = TAGS.get(object);
  if(!tags) {
    tags = new Map();
    TAGS.set(object, tags);
  }

  let tag = tags.get(key);
  if(!tag) {
    tag = new Tag();
    tags.set(key, tag);
  }

  return tag;
}

export const consumeKey = (object, key) => {
  getTag(object, key).consume();
}

export const dirtyKey = (object, key) => {
  getTag(object, key).dirty();
}
