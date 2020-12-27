import Reference from './reference';
import { documentNotFoundError } from '../../../util/error';
import { registerPromise } from '../../../stores/stats';
import { isDocument } from '../document';
import { assert } from '@ember/debug';
import { isArray } from '../../../util/types';

const {
  assign
} = Object;

const normalizeMethodArguments = args => args.map(arg => {
  if(isDocument(arg)) {
    let snapshot = arg._snapshot;
    assert(`Document '${arg}' is not yet loaded`, !!snapshot);
    return snapshot;
  }
  return arg;
});

const normalizeStringArguments = args => args.map(arg => {
  if(isArray(arg)) {
    return `[ ${normalizeStringArguments(arg)} ]`;
  }
  if(isDocument(arg)) {
    return arg.id;
  }
  if(typeof arg === 'string') {
    return `'${arg}'`;
  }
  return arg;
}).join(', ');

export default class QueryableReference extends Reference {

  _conditionParameters(name, args) {
    let _ref = this._ref[name].call(this._ref, ...normalizeMethodArguments(args));
    let string = `${this.string}.${name}(${normalizeStringArguments(args)})`;
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

  _createDocumentOrReferenceForSnapshot(snapshot, type) {
    if(type === 'doc') {
      return this.store._createDocumentForSnapshot(snapshot);
    } else if(type === 'ref') {
      return this.store._createDocumentReference(snapshot.ref);
    }
    assert(`Unsupported type '${type}'`, false);
  }

  async load(opts) {
    let { type } = assign({ type: 'doc' }, opts);
    let snapshot = await registerPromise(this, 'load', this._ref.get());
    return snapshot.docs.map(doc => this._createDocumentOrReferenceForSnapshot(doc, type));
  }

  async first(opts) {
    let { type, optional } = assign({ type: 'doc', optional: false }, opts);
    let snapshot = await registerPromise(this, 'first', this._ref.get());
    if(snapshot.docs.length > 1) {
      console.warn(`${this.string} yields more than 1 document`);
    }
    let doc = snapshot.docs[0];
    if(doc) {
      return this._createDocumentOrReferenceForSnapshot(doc, type);
    }
    if(!optional) {
      throw documentNotFoundError();
    }
  }

}
