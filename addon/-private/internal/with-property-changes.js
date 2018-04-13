export default (internal, notify, cb, done) => {
  let model;

  if(notify) {
    model = internal.model(false);
  }

  let enabled = !!model;

  if(enabled) {
    model.beginPropertyChanges();
  }

  let changes = [];

  let changed = key => {
    if(enabled && !changes.includes(key)) {
      if(key) {
        model.notifyPropertyChange(key);
      }
    }
    changes.push(key);
  };

  Object.defineProperty(changed, 'any', {
    get() {
      return changes.length > 0;
    }
  });

  try {
    let result = cb(changed);
    done && done(changed, result);
    return result;
  } finally {
    if(enabled) {
      model.endPropertyChanges();
    }
  }
}
