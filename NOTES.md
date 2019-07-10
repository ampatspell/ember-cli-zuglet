# Auth internals

* queue -- serialized, parent is store for overall settle

``` javascript
// sign in

signIn() {
  return this.withAuthReturningUser(auth => auth.signInWithEmailAndPassword(email, password).then(({ user }) => user));
}

withAuthReturningUser(fn) {
  return this.get('queue').schedule({
    name: 'auth',
    invoke: () => this.withAuth(auth => {
      let current = this.user && this.user.user;
      let change = this.waitForAuthStateChanged();
      return fn(auth).then(next => {
        if(current === next) {
          // same user
          change.cancel();
        } else {
          // wait for onAuthStateChanged
          return change.promise;
        }
      });
    })
  });
}

waitForAuthStateChanged() {
  let deferred = defer();
  let promise = deferred.promise;

  let hash = {};

  let resolve = deferred.resolve();
  let cancel = () => this.__waitForAuthStateChanged.removeObject(hash);

  hash = {
    resolve,
    cancel,
    promise
  };

  this.__waitForAuthStateChanged.pushObject(hash);

  return hash;
}

notifyOnAuthStateChanged() {
  let listeners = this.__waitForAuthStateChanged.slice();
  this.__waitForAuthStateChanged.clear();
  listeners.forEach(listener => listener.promise.resolve());
}

onAuthStateChanged(user) {
  this.notifyOnAuthStateChanged();
}

```
