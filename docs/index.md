---
title: Overview
---

# Async Storage

Async Storage is asynchronous, unencrypted, persistent, key-value storage for your React Native application.  
It provides a simple API compatible with the [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API), with a few extensions for batch operations and multi-database support.

---

## Supported platforms

- **Android** (SQLite backend via Room KMP)
- **iOS** (SQLite backend via Room KMP)
- **Web** (IndexedDB backend)
- **macOS** (SQLite backend via Room KMP)
- **Windows** (legacy fallback, single database only)

---

## Installation

```shell
# using npm
npm install @uniplay-io/async-storage

# using yarn
yarn add @uniplay-io/async-storage
```

On iOS/macOS, don’t forget to install pods:

```shell
# inside macos/ios directory
pod install
```

## Usage

```typescript
import { createAsyncStorage } from "@uniplay-io/async-storage";

// create a storage instance
const storage = createAsyncStorage("appDB");

async function demo() {
  // save value under "userToken" key
  await storage.setItem("userToken", "abc123");

  // read value stored at "userToken" key
  const token = await storage.getItem("userToken");
  console.log("Stored token:", token); // abc123

  // remove value from storage
  await storage.removeItem("userToken");
}
```

Head over to [Usage page](api/usage.md) to learn more.
