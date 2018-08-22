# Register & Initialize

``` javascript
import { register, initialize } from 'ember-cli-zuglet/initialize';
```

# Stores

``` javascript
let stores = getOwner(this).lookup('zuglet:stores');
```

* ready -> Promise
* createStore() -> Store
* settle() -> Promise

# Store

``` javascript
import Store from 'ember-cli-zuglet/store';
```

* identifier -> String
* ready -> Promise<Store>
* auth -> Auth
* storage -> Storage
* functions(region) -> Functions
* observed -> Array<Document|Query>
* collection(name) -> CollectionReference
* doc(path) -> DocumentReference
* object(arg) -> DataObject
* array(arg) -> DataArray
* serverTimestamp -> DataServerTimestamp
* transaction(fn) -> Promise
* batch() -> Batch
* batch(fn) -> Promise<Result>
* settle() -> Promise
* restore() -> Promise (override)
* restoreUser(user) -> Promise (override)

# Auth

* methods -> AuthMethods
* user -> AuthUser|null
* signOut() -> Promise

# AuthMethods

* available -> Array<String>
* email -> AuthEmailMethod
* anonumous -> AuthAnonymousMethod

# AuthMethod

* type -> string

# AuthAnonymousMethod

* signIn() -> Promise<User>

# AuthEmailMethod

* signIn(email, password) -> Promise<User>
* signUp(email, password) -> Promise<User>

# AuthUser

* token(opts) -> Promise<String|Object>
* delete() -> Promise
* uid -> String
* isAnonymous -> Boolean
* displayName -> String
* email -> String
* emailVerified -> Boolean
* phoneNumber -> String
* photoURL -> String
* providerId -> String
* serialized -> Object

# Storage

* tasks -> Array<StorageTask>
* ref(opts) -> StorageReference

# StorageReference

* parent -> StorageReference
* ref(path) -> StorageReference
* fullPath -> String
* bucket -> String
* name -> String
* metadata -> StorageReferenceMetadata
* url -> StorageReferenceURL
* load(opts) -> Promise<?>
* delete(opts) -> Promise
* put(opts) -> StorageTask
* serialized -> Object

# StorageReferenceMetadata

* isLoading -> Boolean
* isLoaded -> Boolean
* isError -> Boolea
* error -> Object|null
* exists -> Boolean|undefined
* load(opts) -> Promise<This>
* update(object) -> Promise
* reference -> StorageReference
* raw -> Object
* type -> raw alias
* name -> raw alias
* size -> raw alias
* contentType -> raw alias
* customMetadata -> raw alias
* cacheControl -> raw alias
* contentDisposition -> raw alias
* contentEncoding -> raw alias
* contentLanguage -> raw alias
* bucket -> raw alias
* fullPath -> raw alias
* generation -> raw alias
* md5Hash -> raw alias
* metageneration -> raw alias
* createdAt -> Date
* updatedAt -> Date
* serialized -> object

# StorageReferenceURL

* isLoading -> Boolean
* isLoaded -> Boolean
* isError -> Boolea
* error -> Error|null
* exists -> Boolean|undefined
* load(opts) -> Promise<This>
* value -> String
* serialized -> Object

# StorageTask

* ref -> StorageReference
* serialized -> Object
* promise -> Promise
* type -> String
* percent -> Number
* isRunning -> Boolean
* isCompleted -> Boollean
* isError -> Boolean
* error -> Error
* bytesTransferred -> Number
* totalBytes -> Number
* then(resolve, reject) -> Promise
* catch(fn) -> Promise
* finally(fn) -> Promise

# Functions

* region -> String
* callable(name) -> FunctionsCallable

# FunctionsCallable

* call(data) -> Promise

# FirestoreReference
# QueryableReferenceMixin
# DocumentReference extends FirestoreReference
# CollectionReference extends FirestoreReference, QueryableReferenceMixin
# QueryReference extends QueryableReferenceMixin

# Document
# Query
# Observers
# Observer
# DataObject
# DataArray
# DataServerTimestamp

# Batch

* save(doc, opts) -> Doc
* delete(docOrRef) -> Document|DocumentReference
* commit() -> Promise

# Transaction

* load(docOrRef, opts) -> Promise<Document>
* save(doc, opts) -> undefined
* delete(doc) -> undefined

# Less-experimental
