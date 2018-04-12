export default (internal, notify, cb) => {
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
      model.notifyPropertyChange(key);
    }
    changes.push(key);
  };

  Object.defineProperty(changed, 'any', {
    get() {
      return changes.length > 0;
    }
  });

  try {
    return cb(changed);
  } finally {
    if(enabled) {
      model.endPropertyChanges();
    }
  }
}
