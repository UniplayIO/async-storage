# React Native Async Storage

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

### Basic

```typescript
import { createAsyncStorage } from "@uniplay-io/async-storage";

// Create a storage instance
const storage = createAsyncStorage("appDB");

async function demo() {
  // save value under "userToken" key
  await storage.setItem("userToken", "abc123");

  // read value stored at "userToken" key
  const token = await storage.getItem("userToken");
  console.log("Stored token:", token);

  // remove value from storage
  await storage.removeItem("userToken");
}
```

### Multi-item operations

Async Storage supports batch operations for efficiency:

```typescript
async function demo() {
  // save multiple values at once
  await storage.setMany({
    theme: "dark",
    language: "en",
  });

  // Retrieve multiple values
  const values = await storage.getMany(["theme", "language", "different"]);
  console.log(values); // { theme: "dark", language: "en", different: null }

  // Remove multiple values
  await storage.removeMany(["theme", "language"]);
}
```

## Contribution

Pull requests are welcome. Please open an issue first to discuss what you would
like to change.

See the [CONTRIBUTING](.github/CONTRIBUTING.md) file for more information.

## License

MIT
