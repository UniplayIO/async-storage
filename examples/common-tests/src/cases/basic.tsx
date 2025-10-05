import type { AsyncStorage } from "@uniplay-io/async-storage";
import { type TestRunner, useTests } from "../useTests";

export function useBasicTest(storage: AsyncStorage): TestRunner {
  const test = useTests();

  const testSingles = async () => {
    try {
      test.clear();
      await storage.clear();
      const key = "single-set";
      let value = `value-${Math.round(Math.random() * 1000)}`;
      test.assert(
        undefined,
        await storage.setItem(key, value),
        `saved ${key} with value ${value}`
      );
      test.assert(value, await storage.getItem(key), "retrieves stored value");

      test.assert(
        undefined,
        await storage.removeItem(key),
        `removed ${key} from storage`
      );
      test.assert(
        null,
        await storage.getItem(key),
        `gets null for previously stored value`
      );

      value = `value-${Math.round(Math.random() * 1000)}`;
      test.assert(
        undefined,
        await storage.setItem(key, value),
        `saved value for the key: ${value}`
      );
      test.assert(
        value,
        await storage.getItem(key),
        `reads ${value} for the key`
      );

      value = `value-${Math.round(Math.random() * 1000)}`;
      test.assert(
        undefined,
        await storage.setItem(key, value),
        `overrides key with value: ${value}`
      );
      test.assert(
        value,
        await storage.getItem(key),
        `successfully overridden the value`
      );
    } catch (e) {
      test.report(e);
    }
  };

  const testMultiplies = async () => {
    try {
      test.clear();
      await storage.clear();
      const entry1 = { key1: "value1" };
      const entry2 = { key2: "value2" };
      const entry3 = { key3: "value3" };

      const entries = { ...entry1, ...entry2, ...entry3 };
      test.assert(
        undefined,
        await storage.setMany(entries),
        "sets multiple entries"
      );

      test.assert(
        entries,
        await storage.getMany(["key1", "key2", "key3"]),
        "reads stored values"
      );

      test.assert(
        undefined,
        await storage.removeMany(["key1", "key2"]),
        "removed key1 and key2"
      );
      test.assert(
        ["key3"],
        await storage.getAllKeys(),
        "only key3 remains after removal"
      );

      const afterRemove = await storage.getMany(["key1", "key2", "key3"]);
      test.assert(
        { key1: null, key2: null, key3: "value3" },
        afterRemove,
        "reads all requested values"
      );

      test.assert(
        undefined,
        await storage.setMany(entries),
        "sets multiple entries again"
      );
      test.assert(
        entries,
        await storage.getMany(["key1", "key2", "key3"]),
        "checked stored values"
      );

      const overridden = {
        key1: "new-value-1",
        key2: "new-value-2",
        key3: "new-value-3",
      };
      test.assert(
        undefined,
        await storage.setMany(overridden),
        "overriding stored entries"
      );
      test.assert(
        overridden,
        await storage.getMany(["key1", "key2", "key3"]),
        "confirms overriden values"
      );
    } catch (e) {
      test.report(e);
    }
  };

  const testClearingStorage = async () => {
    try {
      test.clear();
      await storage.clear();
      test.assert([], await storage.getAllKeys(), "confirms empty storage");

      test.assert(
        undefined,
        await storage.setItem("i should be here", "my item"),
        "stores single value"
      );
      test.assert(
        ["i should be here"],
        await storage.getAllKeys(),
        "reads the single value"
      );
      test.assert(undefined, await storage.clear(), "clears all storage");
      test.assert(
        [],
        await storage.getAllKeys(),
        "confirms single key is gone"
      );

      test.assert(
        undefined,
        await storage.setMany({
          newKey1: "heheh",
          "other-key": "123",
          heheh: "324",
        }),
        "stores multiple values"
      );
      test.assert(
        ["newKey1", "other-key", "heheh"].sort(),
        (await storage.getAllKeys()).sort(),
        "confirms values are there"
      );
      test.assert(undefined, await storage.clear(), "clears all storage");
      test.assert([], await storage.getAllKeys(), "confirms entries are gone");
    } catch (e) {
      test.report(e);
    }
  };

  const testEdgeCases = async () => {
    try {
      test.clear();
      await storage.clear();
      test.assert([], await storage.getAllKeys(), "confirms storage is empty");
      test.assert(
        undefined,
        await storage.removeMany(["missing1", "missing2"]),
        "gracefully handles removing of non-existing keys"
      );
      test.assert(
        [],
        await storage.getAllKeys(),
        "confirmed no keys are stored"
      );

      test.assert(
        undefined,
        await storage.setItem("item1", ""),
        "stores an empty string"
      );
      test.assert(
        "",
        await storage.getItem("item1"),
        "confirms empty string is saved"
      );
    } catch (e) {
      test.report(e);
    }
  };

  const testConcurrentSetAndGet = async () => {
    try {
      test.clear();
      await storage.clear();

      const key1 = "concurrent1";
      const key2 = "concurrent2";
      const key3 = "concurrent3";
      const key4 = "concurrent4";
      const key5 = "concurrent5";

      test.info("Setting multiple keys concurrently");
      await Promise.all([
        storage.setItem(key1, key1),
        storage.setItem(key2, key2),
        storage.setItem(key3, key3),
        storage.setItem(key4, key4),
        storage.setItem(key5, key5),
      ]);

      const values = await storage.getMany([key1, key2, key3, key4, key5]);
      test.assert(
        {
          [key1]: key1,
          [key2]: key2,
          [key3]: key3,
          [key4]: key4,
          [key5]: key5,
        },
        values,
        "Concurrent set/get works"
      );
    } catch (e) {
      test.report(e);
    }
  };

  return {
    logs: test.logs,
    clearLogs: test.clear,
    tests: [
      {
        name: "Single crud",
        run: testSingles,
      },
      {
        name: "Multi crud",
        run: testMultiplies,
      },
      {
        name: "Storage clearance",
        run: testClearingStorage,
      },
      {
        name: "Edge cases?",
        run: testEdgeCases,
      },
      {
        name: "Concurrency",
        run: testConcurrentSetAndGet,
      },
    ],
  };
}
