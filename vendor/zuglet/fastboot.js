/* global FastBoot */

if(typeof FastBoot !== 'undefined') {
  self.XMLHttpRequest = FastBoot.require("xmlhttprequest").XMLHttpRequest;
  self.fetch = FastBoot.require("node-fetch");
}
