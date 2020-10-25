export const objectToJSON = value => {
  if(value) {
    if(value.serialized) {
      return value.serialized;
    } else if(Array.isArray(value)) {
      return value.map(object => objectToJSON(object));
    }
  }
  return value;
}
