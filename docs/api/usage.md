---
title: Usage
---

# Using Async Storage

The [`AsyncStorage`](https://github.com/react-native-async-storage/async-storage/blob/main/packages/async-storage/src/AsyncStorage.ts) interface provides an asynchronous, promise-based API for persistent key-value storage.
Each method is modeled after the Web Storage API, with extensions for batch operations.

Similar to Web, AsyncStorage deals with data that should be already serialized (strings). If you need to store objects, arrays, or other non-string values, you must serialize them first (for example, using `JSON.stringify`) and deserialize them when retrieving (for example, using `JSON.parse`).

## Creating a storage

To create a new storage, call `createAsyncStorage` with your database name:

!!! note "About naming"

    It's best to avoid adding an extensions to the name. Read more at [Database naming](db-naming.md) section.

```typescript
import { createAsyncStorage } from "@uniplay-io/async-storage";

const userStorage = createAsyncStorage("john");
```

This returns an instance of `AsyncStorage` and each instance is uniquely identified by the name you provide.
The data in one storage instance is scoped to its name: using different names ensures that data does not leak between storages.

!!! note "Web platform"

    On Web, AsyncStorage is backed by [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), which also support scoped storages.

!!! warning "Windows platform"

    As of AsyncStorage v3.0, Windows platform does not support scoped storages. It fallsback to previous implementation - single storage per application.

## Using a storage

Once you have created a storage instance, you can start managing data.

### Single item operations

You can store, retrieve, and remove individual keys using `setItem`, `getItem`, and `removeItem`.

Note that:

- Calling `setItem` with an existing key will overwrite the current value
- Calling `removeItem` on a key that does not exist has no effect and does not throw an error

```typescript
await userStorage.setItem("username", "doe_john");
// previously stored value is overriden
await userStorage.setItem("username", "john_doe");

// read current value
let username = await userStorage.getItem("username");
console.log(username); // "john_doe"

await userStorage.removeItem("username");
// does nothing, item is already removed
await userStorage.removeItem("username");

username = await userStorage.getItem("username");
console.log(username); // null
```

### Batch operations

Use convenient batch methods to handle multiple keys at once. Behind the scene, transaction performed to store all of them, or none in case of an error.

```typescript
// store values
await userStorage.setMany({
  email: "john@example.com",
  age: "30",
});

// read multiple items
const data = await userStorage.getMany(["email", "age", "username"]);
console.log(data);
// {
//   email: "john@example.com",
//   age: "30",
//   username: null, // key doesn't exist
// }

// remove multiple items
// non-existing keys are ignored
await userStorage.removeMany(["email", "age", "not-here"]);
```

### Reading stored keys

To retrieve all keys currently stored in a storage instance, use `getAllKeys`:

```typescript
await userStorage.setMany({
  email: "john@example.com",
  age: "30",
});

const keys = await userStorage.getAllKeys();
console.log(keys); // ["email", "age"]
```

### Clearing storage

To remove all data from a storage instance, use `clear`:

```typescript
await userStorage.setMany({
  email: "john@example.com",
  age: "30",
});

await userStorage.clear();
const keys = await userStorage.getAllKeys();
console.log(keys); // []
```
