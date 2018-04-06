export default (curr, next) => {
  if(!curr) {
    return false;
  }
  return curr.isEqual(next);
};
