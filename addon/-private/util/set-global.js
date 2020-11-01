export const setGlobal = (hash, silent=false) => {
  for(let key in hash) {
    let value = hash[key];
    if(!silent) {
      console.log(`window.${key} = ${value}`);
    }
    window[key] = value;
  }
}
