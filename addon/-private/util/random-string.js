// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export default (len=8) => {
  let string = '';
  for (let i=0; i<len; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return string;
}
