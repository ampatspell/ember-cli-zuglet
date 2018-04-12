export default (owner, key) => {
  let value = owner.cacheFor(key);
  if(!value) {
    return;
  }
  value.destroy();
};
