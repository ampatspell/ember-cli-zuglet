import ZugletObject from '../../../../object';
import { activate } from '../../../model/properties/activate';

/**
 * TODO: register(doc) for reuse
 * TODO: deferred and promise
 * TODO: passive
 * TODO: string, serialized, toJSON
 */
export default class QueryPaginated extends ZugletObject {

  @activate()
  queries

  constructor(owner, { store, ref, strategy }) {
    super(owner);
    this.store = store;
    this.ref = ref;
    this.strategy = strategy;
    this._prepare();
  }

  //

  get _firstDocument() {
    let firstObject = array => {
      if(array && array.length > 0) {
        return array[0];
      }
    }
    let query = firstObject(this.queries);
    if(!query) {
      return undefined;
    }
    return firstObject(query.content);
  }

  get _lastDocument() {
    let lastObject = array => {
      if(array && array.length > 0) {
        return array[array.length - 1];
      }
    }
    let query = lastObject(this.queries);
    if(!query) {
      return undefined;
    }
    return lastObject(query.content);
  }

  //

  _createNextQuery() {
    let { ref, _firstDocument: first, _lastDocument: last } = this;
    let next = this.strategy({ ref, type: 'next', first, last });
    return next && next.query();
  }

  _createFirstQuery() {
    let { ref } = this;
    let next = this.strategy({ ref, type: 'first' });
    return next && next.query();
  }

  _prepare() {
    let query = this._createFirstQuery();
    let queries = [];
    if(query) {
      queries.push(query);
    }
    this.queries = queries;
  }

  //

  loadMore() {
    let next = this._createNextQuery();
    if(next) {
      this.queries.push(next);
    }
  }

}
