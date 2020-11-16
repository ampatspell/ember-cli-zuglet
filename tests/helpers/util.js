export const replaceCollection = async (ref, docs=[]) => {
  let { store } = ref;
  let existing = await ref.load();

  await store.batch(batch => {
    existing.map(doc => batch.delete(doc));
  });

  await Promise.all(docs.map(async data => {
    let { _id, ...rest } = data;
    let doc;
    if(_id) {
      doc = ref.doc(_id);
    } else {
      doc = ref.doc()
    }
    await doc.new(rest).save();
  }));
}

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
    }
    next();
  });
}
