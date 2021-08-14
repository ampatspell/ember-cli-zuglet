export const snapshotToDeferredType = snapshot => {
  let { fromCache } = snapshot.metadata;
  if(fromCache) {
    return 'cached';
  }
  return 'remote';
}
