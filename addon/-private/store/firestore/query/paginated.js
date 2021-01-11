import ZugletObject from '../../../../object';
import { activate } from '../../../model/properties/activate';
import { tracked } from '@glimmer/tracking';

/**
 * TODO: register(doc) for reuse
 * TODO: deferred and promise
 * TODO: passive
 * TODO: string, serialized, toJSON
 */
export default class QueryPaginated extends ZugletObject {

  @activate()
  queries

  @tracked
  content = [];

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

  // _onQueryData() {
  //   let content = [];
  //   let exists = doc => content.find(existing => existing.path === doc.path);
  //   this.queries.forEach(query => query.content.forEach(doc => {
  //     if(exists(doc)) {
  //       return;
  //     }
  //     content.push(doc);
  //   }));
  //   this.content = content;
  // }

  //

  // _subscribeQuery(query) {
  //   if(!this._isActivated) {
  //     return;
  //   }
  //   let cancel = query.onData(query => this._onQueryData(query));
  //   let { _cancel } = this;
  //   if(!_cancel) {
  //     _cancel = [];
  //     this._cancel = _cancel;
  //   }
  //   _cancel.push(cancel);
  // }

  onActivated() {
    this._isActivated = true;
    // this.queries.map(query => this._subscribeQuery(query));
  }

  onDeactivated() {
    this._isActivated = false;
    // let { _cancel } = this;
    // if(_cancel) {
    //   this._cancel = null;
    //   _cancel.map(cancel => cancel());
    // }
  }

  //

  loadMore() {
    let next = this._createNextQuery();
    if(next) {
      // this._subscribeQuery(next);
      this.queries.push(next);
      return next.load();
    }
  }

  load(...args) {
    let [ query ] = this.queries;
    if(query) {
      return query.load(...args);
    }
  }

}
