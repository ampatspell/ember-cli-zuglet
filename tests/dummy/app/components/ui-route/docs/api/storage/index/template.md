# Storage

``` javascript
let storage = this.get('store.storage');
let ref = storage.ref('images').child('first');

let task = ref.put({
  type: 'data',
  data: file,
  metadata: {
    contentType: file.type,
    customMetadata: { filename: file.name }
  }
});

await task.get('promise');
```

> TODO
