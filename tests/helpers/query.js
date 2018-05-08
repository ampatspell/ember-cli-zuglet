export default () => {
  let search = window.location.search;
  if(!search) {
    return {};
  }
  return search.substr(1).split('&').reduce((hash, pair) => {
    let [ key, value ] = pair.split('=');

    if(value === 'false') {
      value = false;
    } else if(value === 'true') {
      value = true;
    }

    hash[key] = value;
    return hash;
  }, {});
}