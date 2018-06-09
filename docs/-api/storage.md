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

``` javascript
await ref.metadata.load({ optional: true }) // loads metatada
await ref.url.load({ optional: true }) // gets download url
await ref.load({ url: true, metadata: true, optional: true }); // does 2 identical requests
```

> TODO
