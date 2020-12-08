import QueryableReference from './queryable';

export default class ConditionReference extends QueryableReference {

  constructor(owner, opts) {
    super(owner, opts);
    let { string } = opts;
    this.string = string;
  }

  get serialized() {
    let { string } = this;
    return { string };
  }

  toStringExtension() {
    return `${this.string}`;
  }

}
