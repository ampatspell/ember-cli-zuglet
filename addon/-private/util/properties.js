export const setChangedProperties = (model, props) => {
  if(!props) {
    return;
  }
  for(let key in props) {
    let value = props[key];
    if(model[key] !== value) {
      model[key] = value;
    }
  }
}
