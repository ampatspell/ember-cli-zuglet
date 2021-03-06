/* global FastBoot */

if(typeof FastBoot !== 'undefined') {
  self.XMLHttpRequest = FastBoot.require('xmlhttprequest').XMLHttpRequest;
  self.fetch = FastBoot.require('node-fetch');
  if(typeof self.atob === 'undefined') {
    self.atob = string =>  FastBoot.require('buffer').Buffer.from(string, 'base64').toString('binary');
  }
}
