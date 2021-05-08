import QueryableReference from './queryable';

export default class CollectionGroupReference extends QueryableReference {

  constructor(owner, opts) {
    super(owner, opts);
    let { id } = opts;
    this.id = id;
  }

  get string() {
    let { id } = this;
    return `group(${id})`;
  }

  get serialized() {
    let { id } = this;
    return { id };
  }

  toStringExtension() {
    return `${this.id}`;
  }

}
