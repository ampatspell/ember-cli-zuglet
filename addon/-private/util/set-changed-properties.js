export default (object, hash) => {
  let changed = {};
  let current = object.getProperties(...Object.keys(hash));
  for(let key in hash) {
    let value = hash[key];
    if(value !== current[value]) {
      changed[key] = value;
    }
  }
  object.setProperties(changed);
};
