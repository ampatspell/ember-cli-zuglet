import ValueProvider from '../../util/value-provider';
import ArrayObserver from '../../util/array-observer';

export default class SourceManager {

  // parent
  // source: { dependencies, key }
  constructor({ parent, source }) {
    this.parent = parent;
    this.provider = new ValueProvider({
      object: parent,
      observe: source.dependencies,
      key: source.key,
      delegate: {
        updated: value => this.update(true)
      }
    });
    this.source = this.provider.value;
    this.update(false);
  }

  update(notify) {
    let observer = this.observer;
    if(observer) {
      observer.destroy();
      this.observer = null;
    }

    let source = this.source;

    if(source) {
      this.observer = new ArrayObserver({
        array: source,
        observe: [],
        delegate: {
          added: (objects, start, len) => {
            console.log('source objects added', objects.slice(), start, len);
          },
          removed: (objects, start, len) => {
            console.log('source objects removed', objects.slice(), start, len);
          },
          updated: (object, key) => {
            console.log('source object updated', object, key);
          }
        }
      });
    }

    console.log('source replaced', source);
  }

  destroy() {
    this.provider.destroy();
  }

}
