import Component from '@ember/component';
import layout from './template';
import randomString from 'ember-cli-zuglet/util/random-string';

export default Component.extend({
  layout,

  actions: {
    async upload(file) {
      if(!this.get('auth.user')) {
        await this.get('store.auth.methods.anonymous').signIn();
      }

      let ref = this.get('store.storage').ref('experimental').child(randomString());

      let task = ref.put({
        type: 'data',
        data: file,
        metadata: {
          contentType: file.type,
          customMetadata: { ok: true }
        }
      });

      this.setProperties({
        ref,
        task
      });
    }
  }
});
