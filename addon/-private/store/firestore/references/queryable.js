import Reference from './reference';
import { documentNotFoundError } from '../../../util/error';

export default class QueryableReference extends Reference {

  _conditionParameters(name, args) {
    let _ref = this._ref[name].call(this._ref, ...args);
    let normalized = args.map(arg => {
      if(Array.isArray(arg)) {
        return `[ ${arg.join(', ')} ]`;
      }
      return arg;
    })
    let string = `${this.string}.${name}(${normalized.join(', ')})`;
    return {
      _ref,
      string
    };
  }

  _condition(name, args) {
    let { _ref, string } = this._conditionParameters(name, args);
    return this.store._createConditionReference(_ref, string);
  }

  where(...args) {
    return this._condition('where', args);
  }

  orderBy(...args) {
    return this._condition('orderBy', args);
  }

  limit(...args) {
    return this._condition('limit', args);
  }

  limitToLast(...args) {
    return this._condition('limitToLast', args);
  }

  startAt(...args) {
    return this._condition('startAt', args);
  }

  startAfter(...args) {
    return this._condition('startAfter', args);
  }

  endAt(...args) {
    return this._condition('endAt', args);
  }

  endBefore(...args) {
    return this._condition('endBefore', args);
  }

  //

  query(opts) {
    return this.store._createQuery(this, opts);
  }

  async load() {
    let snapshot = await this._ref.get();
    return snapshot.docs.map(doc => this.store._createDocumentForSnapshot(doc));
  }

  async first(opts) {
    let { optional } = assign({ optional: false }, opts);
    let snapshot = await this._ref.get();
    if(snapshot.docs.length > 1) {
      console.warn(`${this.string} yields more than 1 document`);
    }
    let doc = snapshot.docs[0];
    if(doc) {
      return this.store._createDocumentForSnapshot(doc);
    }
    if(!optional) {
      throw documentNotFoundError();
    }
  }

}
