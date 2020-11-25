/* istanbul ignore next */
export const setGlobal = (hash, silent=false) => {
  if(typeof window === 'undefined') {
    return;
  }
  for(let key in hash) {
    let value = hash[key];
    if(!silent) {
      // eslint-disable-next-line no-console
      console.log(`window.${key} = ${value}`);
    }
    window[key] = value;
  }
}
