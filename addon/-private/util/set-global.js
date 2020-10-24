export default hash => {
  for(let key in hash) {
    let value = hash[key];
    console.log(`window.${key} = ${value}`);
    window[key] = value;
  }
}
