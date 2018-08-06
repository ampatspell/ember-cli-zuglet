export default (object, hash) => {
  let changed = {};
  let current = object.getProperties(...Object.keys(hash));
  for(let key in hash) {
    let value = hash[key];
    let curr = current[key];
    if(value === curr) {
      continue;
    } else if(curr && typeof curr.isEqual === 'function' && curr.isEqual(value)) {
      continue;
    }
    changed[key] = value;
  }
  object.setProperties(changed);
};
