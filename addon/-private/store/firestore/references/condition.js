import QueryableReference from './queryable';

export default class ConditionReference extends QueryableReference {

  get serialized() {
    let { string } = this;
    return { string };
  }

  toStringExtension() {
    return `${this.string}`;
  }

}
