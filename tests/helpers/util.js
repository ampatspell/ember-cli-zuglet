export const saveCollection = async (ref, docs=[]) => {
  let { store } = ref;
  await store.batch(batch => docs.map(data => {
    let { _id, ...rest } = data;
    let doc;
    if(_id) {
      doc = ref.doc(_id);
    } else {
      doc = ref.doc();
    }
    batch.save(doc.new(rest));
  }));
};

export const replaceCollection = async (ref, docs=[]) => {
  let { store } = ref;
  let existing = await ref.load();
  await store.batch(batch => existing.map(doc => batch.delete(doc)));
  await saveCollection(ref, docs);
};

export const poll = async (cb) => {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      reject(new Error('Timeout'));
    }, 5000);
    let next = () => {
      if(!cb()) {
        setTimeout(() => next(), 100);
      }
      clearInterval(timeout);
      resolve();
    };
    next();
  });
};
