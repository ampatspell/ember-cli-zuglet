import QueryableReference from './queryable';

export default class ConditionReference extends QueryableReference {

  constructor(owner, opts) {
    super(owner, opts);
    let { string, parent } = opts;
    this.string = string;
    this.parent = parent;
  }

  get serialized() {
    let { string } = this;
    return { string };
  }

  toStringExtension() {
    return `${this.string}`;
  }

}
