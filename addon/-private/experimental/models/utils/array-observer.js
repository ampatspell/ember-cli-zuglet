import { A } from '@ember/array';
import { addObserver, removeObserver } from '@ember/object/observers';

export default class ArrayObserver {

  constructor(source, dependencies, delegate) {
    this.source = source;
    this.dependencies = dependencies;
    this.delegate = delegate;
    this.obseverOptions = {
      arrayWillChange: this.arrayWillChange,
      arrayDidChange: this.arrayDidChange
    };
    this.start();
  }

  notifyRemvoed(objects, start) {
    this.delegate.didRemove(objects, start);
  }

  objectDidChange(object, key) {
    let index = this.source.indexOf(object);
    this.delegate.didUpdate(object, key, index);
  }

  stopObservingObjects(array) {
    let dependencies = this.dependencies;
    array.forEach(item => {
      // console.log('stopObservingObjects', item+'');
      dependencies.forEach(dep => removeObserver(item, dep, this, this.objectDidChange));
    });
  }

  startObservingObjects(array) {
    let dependencies = this.dependencies;
    array.forEach(item => {
      // console.log('startObservingObjects', item+'');
      dependencies.forEach(dep => addObserver(item, dep, this, this.objectDidChange));
    });
  }

  didInsertObjects(added, start) {
    this.startObservingObjects(added);
    this.delegate.didInsert(added, start);
  }

  didRemoveObjects(removed, start) {
    this.stopObservingObjects(removed);
    this.delegate.didRemove(removed, start);
  }

  arrayWillChange(source, start, removeCount, addCount) {
    // console.log('arrayWillChange', start, removeCount, addCount);
    if(removeCount) {
      let removed = A(source.slice(start, removeCount));
      this.didRemoveObjects(removed, start);
    }
  }

  arrayDidChange(source, start, removeCount, addCount) {
    // console.log('arrayDidChange', start, removeCount, addCount);
    if(addCount) {
      let added = A(source.slice(start, addCount));
      this.didInsertObjects(added, start);
    }
  }

  startObservingArray() {
    let source = this.source;
    if(!source) {
      return;
    }
    source = A(source);
    source.addArrayObserver(this, this.observerOptions);
    return source;
  }

  stopObservingArray() {
    let source = this.source;
    if(!source) {
      return;
    }
    source.removeArrayObserver(this, this.observerOptions);
    return source;
  }

  start(notify) {
    let source = this.startObservingArray();
    if(source) {
      this.startObservingObjects(source);
      if(notify) {
        this.didInsertObjects(source, 0);
      }
    }
  }

  stop(notify) {
    let source = this.stopObservingArray();
    if(source) {
      this.stopObservingObjects(source);
      if(notify) {
        this.didRemoveObjects(source, 0);
      }
    }
  }

  update(next) {
    let current = this.source;
    if(current === next) {
      return;
    }

    this.stop(true);
    this.source = next;
    this.start(true);
  }

  destroy() {
    this.stop();
  }

}
