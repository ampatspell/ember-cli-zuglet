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

* isReference -> true
* id -> String
* path -> String
* parent -> DocumentReference|CollectionReference|QueryReference
* serialized -> Array<Object>
* string -> String
* isEqual(other) -> Boolean


# DocumentReference extends FirestoreReference

* collection(name) -> CollectionReference
* doc(path) -> DocumentReference
* load(opts) -> Promise<Document>
* delete() -> Promise<This>
* new(object) -> Document
* existing() -> Document
* observe() -> DocumentObserver

# CollectionReference extends FirestoreReference, QueryableReferenceMixin

* doc(path) -> DocumentReference

# QueryableReferenceMixin

* where -> QueryReference
* orderBy -> QueryReference
* limit -> QueryReference
* startAt -> QueryReference
* startAfter -> QueryReference
* endAt -> QueryReference
* endBefore -> QueryReference
* query(opts) -> Query
* load(opts) -> Promise<Array<Document>>
* first(opts) -> Promise<Document>

# QueryReference extends QueryableReferenceMixin

* type -> String
* args -> Array<Any>
* parent -> QueryReference|CollectionReference
* serialized -> Array<Object>
* string -> String

# Document

* isNew
* isDirty
* isLoading
* isLoaded
* isSaving
* isObserving
* isError
* error
* exists
* metadata
* isDocument -> true
* ref -> DocumentReference
* id -> String
* path -> String
* data -> DataObject
* serialized -> Object
* load(opts) -> Promise<This>
* reload(opts) -> Promise<This>
* save(opts) -> Promise<This>
* delete() -> Promise<This>
* reset() -> undefined
* observe() -> DocumentObserver
* observers -> Observers

# Query

* isQuery -> true
* isLoading -> Boolean
* isLoaded -> Boolean
* isObserving -> Boolean
* isError -> Boolean
* error -> Error|Null
* type -> String (array|first)
* size -> Number|undefined
* empty -> Boolean|undefined
* metadata -> Object|undefined
* ref -> CollectionReference|QueryReference
* isArray -> Boolean
* isFirst -> Boolean
* serialized -> Object
* load(opts) -> Promise<This>
* observe() -> QueryObserver
* observers -> Observers

# ArrayQuery

* content -> Array<Document>

# FirstQuery

* content -> Document|null

# Observers extends Array

* promise -> Promise

# Observer

* isCancelled -> Boolean
* promise -> Promise
* load() -> Promise
* cancel() -> undefined

# DocumentObserver extends Observer

* doc -> Document

# QueryObserver extends Observer

* query -> Query

# DataObject

* serialized -> Object
* serialize(type) -> Object

# DataArray extends Array

Wraps primitive types in Ember-observable ones and manages dirty tracking

# DataServerTimestamp

* isTimestamp -> true
* isServerTimestamp -> Boolean
* date -> Date
* dateTime -> Luxon.DateTime

# Batch

* save(doc, opts) -> Doc
* delete(docOrRef) -> Document|DocumentReference
* commit() -> Promise

# Transaction

* load(docOrRef, opts) -> Promise<Document>
* save(doc, opts) -> undefined
* delete(doc) -> undefined

# Less-experimental
